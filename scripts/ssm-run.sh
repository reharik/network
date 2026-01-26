#!/usr/bin/env bash
set -euo pipefail

# scripts/ssm-run.sh
#
# Usage:
#   source scripts/ssm-run.sh
#   ssm_run "comment" path/to/remote-script.sh
#
# Env (common):
#   AWS_REGION              (required)
#   S3_BUCKET               (optional, passed through to remote env if you use it)
#
# Targeting (defaults to tag App=network, Env=prod):
#   SSM_TAG_APP             (default: network)
#   SSM_TAG_ENV             (default: prod)
#   SSM_TARGETS_OVERRIDE    (optional) if set, used verbatim as repeated --targets args:
#                           e.g. 'Key=InstanceIds,Values=i-0123abcd'
#
# Wait tuning (to stop "out of control" waits):
#   SSM_WAIT_DELAY          (default: 2 seconds)
#   SSM_WAIT_MAX_ATTEMPTS   (default: 120 attempts) => ~4 minutes at delay=2
#
# Output behavior:
#   Always prints stdout/stderr via list-command-invocations (stable and debuggable)

_ssm_default_targets() {
  local app="${SSM_TAG_APP:-network}"
  local env="${SSM_TAG_ENV:-prod}"
  # IMPORTANT: return as an array-like echo (caller will put into array)
  echo "Key=tag:App,Values=${app}" "Key=tag:Env,Values=${env}"
}

_ssm_wait_delay() {
  echo "${SSM_WAIT_DELAY:-2}"
}

_ssm_wait_max_attempts() {
  echo "${SSM_WAIT_MAX_ATTEMPTS:-120}"
}

_ssm_send_command() {
  local comment="$1"
  local remote_script_path="$2"

  if [[ -z "${AWS_REGION:-}" ]]; then
    echo "AWS_REGION is required" >&2
    return 2
  fi
  if [[ ! -f "$remote_script_path" ]]; then
    echo "Remote script not found: $remote_script_path" >&2
    return 2
  fi

  # Decide targets
  local -a targets=()
  if [[ -n "${SSM_TARGETS_OVERRIDE:-}" ]]; then
    # shellcheck disable=SC2206
    targets=(${SSM_TARGETS_OVERRIDE})
  else
    # shellcheck disable=SC2206
    targets=($(_ssm_default_targets))
  fi

  # Base64 encode remote script to avoid nested quoting
  local payload
  payload="$(base64 -w0 "$remote_script_path")"

  # Minimal JSON for SSM parameters (file-based to avoid YAML quoting issues)
  cat > /tmp/ssm-params.json <<JSON
{
  "commands": [
    "bash -lc 'set -euo pipefail; echo \"$payload\" | base64 -d > /tmp/remote.sh; chmod +x /tmp/remote.sh; /tmp/remote.sh'"
  ]
}
JSON

  aws ssm send-command \
    --region "${AWS_REGION}" \
    --document-name "AWS-RunShellScript" \
    --targets "${targets[@]}" \
    --comment "$comment" \
    --parameters file:///tmp/ssm-params.json \
    --query "Command.CommandId" \
    --output text
}

_ssm_get_instance_ids() {
  local command_id="$1"

  # Wait until SSM resolves the target set and returns invocations.
  # (SSM can take a moment before invocations appear.)
  for _ in {1..30}; do
    local ids
    ids="$(
      aws ssm list-command-invocations \
        --region "${AWS_REGION}" \
        --command-id "$command_id" \
        --query "CommandInvocations[].InstanceId" \
        --output text 2>/dev/null || true
    )"
    if [[ -n "${ids// /}" ]]; then
      echo "$ids"
      return 0
    fi
    sleep 2
  done

  return 1
}

_ssm_wait_and_dump_one() {
  local command_id="$1"
  local instance_id="$2"

  local delay max_attempts
  delay="$(_ssm_wait_delay)"
  max_attempts="$(_ssm_wait_max_attempts)"

  echo "Waiting (delay=${delay}s, max_attempts=${max_attempts}) on ${instance_id} ..."

  # Built-in waiter (no custom polling loops)
  # If it times out, we still dump output for debugging.
  local wait_ok=0
  if ! aws ssm wait command-executed \
    --region "${AWS_REGION}" \
    --command-id "$command_id" \
    --instance-id "$instance_id" \
    --delay "$delay" \
    --max-attempts "$max_attempts"; then
    wait_ok=1
  fi

  aws ssm list-command-invocations \
    --region "${AWS_REGION}" \
    --command-id "$command_id" \
    --details \
    --query "CommandInvocations[?InstanceId=='$instance_id'].{
      InstanceId:InstanceId,
      Status:Status,
      ResponseCode:CommandPlugins[0].ResponseCode,
      Stdout:CommandPlugins[0].Output,
      Stderr:CommandPlugins[0].StandardErrorContent
    }" \
    --output table || true

  return "$wait_ok"
}

ssm_run() {
  local comment="$1"
  local remote_script_path="$2"

  local command_id
  command_id="$(_ssm_send_command "$comment" "$remote_script_path")"
  echo "SSM CommandId: $command_id"

  local instance_ids
  if ! instance_ids="$(_ssm_get_instance_ids "$command_id")"; then
    echo "No instances returned for command-id=$command_id (targeting failed?)" >&2
    return 1
  fi

  local failed=0
  for iid in $instance_ids; do
    if ! _ssm_wait_and_dump_one "$command_id" "$iid"; then
      failed=1
    fi
  done

  if [[ "$failed" -ne 0 ]]; then
    echo "One or more instances failed (or waiter timed out)." >&2
    return 1
  fi
}
export -f ssm_run
