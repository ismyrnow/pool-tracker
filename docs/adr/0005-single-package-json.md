# Single Root package.json (No Workspaces)

Backend and frontend share one `package.json` at the repo root rather than using Bun workspaces. The project is small enough that a single dependency graph is simpler to manage, and workspace tooling (inter-package linking, separate lockfiles, per-package scripts) adds complexity without benefit at this scale.
