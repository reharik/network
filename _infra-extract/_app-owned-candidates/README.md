# App-owned candidates

These files were moved out of the infra extract because they contain **app-specific** content and must not live in shared cannibal-infra. They are preserved here as reference for the app repo.

To use shared infra, either:

- Keep these in the **app repo** (e.g. under `scripts/` and `.github/workflows/`), or
- **Parameterize** them (APP_NAME, app root path, image names, path filters) and contribute a generic version back to infra.

See `../manifest.json` → `left_in_app` for the reason each file was moved.
