import { db } from "./client";
import { readFileSync } from "fs";
import { join } from "path";

export function runMigrations() {
  const schema = readFileSync(join(import.meta.dir, "schema.sql"), "utf-8");
  const statements = schema
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
  for (const stmt of statements) {
    db.run(stmt);
  }
  console.log("Migrations complete");
}
