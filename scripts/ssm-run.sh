#!/usr/bin/env bash
set -euo pipefail

# scripts/ssm-run.sh
#
# Usage:
#   source scripts/ssm-run.sh
#   ssm_run "comment" path/to/remote-script.sh
#
# Required:
#   AWS_REGION
#
# Common:
#   S3_BUCKET
#
# Targeting defaults:
#   SSM_TAG_APP (default network)
#   SSM_TAG_ENV (default prod)
#   SSM_TARGETS_OVERRIDE (optional) e.g. 'Key=InstanceIds,Values=i-0123abcd'
#
# Bounded waiting:
#   SSM_POLL_DELAY_SECONDS (default 2)
#   SSM_POLL_MAX_ATTEMPTS  (default 180)  # 180*2 = ~6 minutes

_ssm_default_targets() {
  local app="${SSM_TAG_APP:-network}"
  local env="${SSM_TAG_ENV:-prod}"
  echo "Key=tag:App,Values=${app}" "Key=tag:Env,Values=${env}"
}

_ssm_poll_delay() { echo "${SSM_POLL_DELAY_SECONDS:-2}"; }
_ssm_poll_max()   { echo "${SSM_POLL_MAX_ATTEMPTS:-180}"; }

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

  # Targets
  local -a targets=()
  if [[ -n "${SSM_TARGETS_OVERRIDE:-}" ]]; then
    # shellcheck disable=SC2206
    targets=(${SSM_TARGETS_OVERRIDE})
  else
    # shellcheck disable=SC2206
    targets=($(_ssm_default_targets))
  fi

  # Prepare remote env file (only include what exists locally)
  # Add more vars here if needed.
  local env_text=""
  for v in AWS_REGION S3_BUCKET; do
    if [[ -n "${!v:-}" ]]; then
      env_text+="${v}=${!v}"$'\n'
    fi
  done

  local script_b64 env_b64
  script_b64="$(base64 -w0 "$remote_script_path")"
  env_b64="$(printf "%s" "$env_text" | base64 -w0)"

  cat > /tmp/ssm-params.json <<JSON
{
  "commands": [
    "bash -lc 'set -euo pipefail; \
echo \"$env_b64\" | base64 -d > /tmp/remote.env; \
echo \"$script_b64\" | base64 -d > /tmp/remote.sh; \
chmod +x /tmp/remote.sh; \
set -a; source /tmp/remote.env; set +a; \
/tmp/remote.sh'"
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

_ssm_statuses() {
  local command_id="$1"
  aws ssm list-command-invocations \
    --region "${AWS_REGION}" \
    --command-id "$command_id" \
    --details \
    --query "CommandInvocations[].{InstanceId:InstanceId,Status:Status}" \
    --output text 2>/dev/null || true
}

_ssm_dump_instance_output() {
  local command_id="$1"
  local instance_id="$2"
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

  local delay max_attempts
  delay="$(_ssm_poll_delay)"
  max_attempts="$(_ssm_poll_max)"

  # Poll until all instances reach a terminal state, bounded
  local attempt=0
  while true; do
    attempt=$((attempt + 1))

    local any_in_progress=0
    local any_failed=0

    for iid in $instance_ids; do
      local status
      status="$(
        aws ssm list-command-invocations \
          --region "${AWS_REGION}" \
          --command-id "$command_id" \
          --details \
          --query "CommandInvocations[?InstanceId=='$iid'].Status | [0]" \
          --output text 2>/dev/null || echo ""
      )"

      case "$status" in
        Pending|InProgress|Delayed)
          any_in_progress=1
          ;;
        Success)
          ;;
        Cancelled|TimedOut|Failed|Cancelling)
          any_failed=1
          ;;
        "")
          any_in_progress=1
          ;;
        *)
          # Unknown status; treat as in-progress but we’ll still bound it.
          any_in_progress=1
          ;;
      esac
    done

    if [[ "$any_in_progress" -eq 0 ]]; then
      break
    fi

    if [[ "$attempt" -ge "$max_attempts" ]]; then
      echo "SSM command did not finish within bounds (attempts=$attempt)." >&2
      any_failed=1
      break
    fi

    sleep "$delay"
  done

  # Dump outputs for each instance, and fail if any non-success
  local failed=0
  for iid in $instance_ids; do
    _ssm_dump_instance_output "$command_id" "$iid"
    local final_status
    final_status="$(
      aws ssm list-command-invocations \
        --region "${AWS_REGION}" \
        --command-id "$command_id" \
        --details \
        --query "CommandInvocations[?InstanceId=='$iid'].Status | [0]" \
        --output text 2>/dev/null || echo "Unknown"
    )"
    if [[ "$final_status" != "Success" ]]; then
      failed=1
    fi
  done

  if [[ "$failed" -ne 0 ]]; then
    echo "One or more instances failed (or timed out)." >&2
    return 1
  fi
}
export -f ssm_run
