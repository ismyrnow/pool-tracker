import { Database } from "bun:sqlite";
import { join } from "path";

const DB_PATH = process.env.DB_PATH ?? join(import.meta.dir, "../../data/pool.db");

export const db = new Database(DB_PATH, { create: true });

db.run("PRAGMA journal_mode = WAL");
db.run("PRAGMA foreign_keys = ON");
