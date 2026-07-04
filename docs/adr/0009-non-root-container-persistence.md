# Non-Root Container with a Bind-Mounted SQLite Database

The container runs the server as the unprivileged `bun` user, but persists the SQLite database on a host **bind mount** (`./data:/data`) so the database is a plain file the operator can back up with ordinary tools. To reconcile the two — a bind mount keeps host ownership, which an unprivileged process may not be able to write — an entrypoint starts as root, `chown`s `/data` to `bun`, then drops privileges via `su-exec` before exec'ing the server. The process itself never runs as root; only the entrypoint does, and only long enough to fix ownership.

## Considered Options

- **Named volume instead of a bind mount** — sidesteps the ownership problem (Docker initializes the volume from the image's `/data`), but backups become a `docker run … tar` incantation against an opaque path under `/var/lib/docker/volumes`. Rejected: the "back up by copying a folder" story (ADR 0002) is worth more here than avoiding the entrypoint.
- **PUID/PGID remapping (LinuxServer.io style)** — makes the runtime uid configurable. Rejected as unnecessary flexibility for a single-user, single-operator app; a fixed `bun` user is enough.
- **Running as root** — simplest, but needless privilege for a network-exposed service.

## Consequences

The entrypoint briefly runs as root, so this image is unsuitable for hosts that forbid containers from ever starting as root (e.g. a hardened `--user`-only policy). Such a host would instead run the image with an explicit `--user` and pre-`chown` the bind mount itself.
