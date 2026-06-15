# Raw bun:sqlite Queries Instead of an ORM

The schema is small (three application tables) and stable. Writing queries directly against `bun:sqlite` keeps the data layer readable and avoids the migration tooling, generated types, and query-builder abstraction that an ORM like Drizzle or Prisma would introduce at this scale.
