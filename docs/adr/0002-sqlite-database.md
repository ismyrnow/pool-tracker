# SQLite as the Database

This is a single-user, self-hosted app where simplicity and portability matter more than concurrent write throughput. SQLite runs in-process, requires no server, and the database file travels with the deployment — a `./data` volume mount is the entire backup story.
