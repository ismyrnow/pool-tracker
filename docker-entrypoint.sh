#!/bin/sh
set -e

# The SQLite database lives on a bind-mounted /data that keeps the host's
# ownership. Fix ownership so the unprivileged bun user can write to it,
# then drop from root to bun before starting the server.
chown -R bun:bun /data

exec su-exec bun "$@"
