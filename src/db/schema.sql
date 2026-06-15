-- better-auth tables (managed by better-auth, shown for reference)
CREATE TABLE IF NOT EXISTS "user" (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  emailVerified INTEGER NOT NULL DEFAULT 0,
  name TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "session" (
  id TEXT PRIMARY KEY,
  expiresAt TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  ipAddress TEXT,
  userAgent TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "account" (
  id TEXT PRIMARY KEY,
  accountId TEXT NOT NULL,
  providerId TEXT NOT NULL,
  userId TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  password TEXT,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "verification" (
  id TEXT PRIMARY KEY,
  identifier TEXT NOT NULL,
  value TEXT NOT NULL,
  expiresAt TEXT NOT NULL,
  createdAt TEXT NOT NULL,
  updatedAt TEXT NOT NULL
);

-- Application tables

CREATE TABLE IF NOT EXISTS pool_profile (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'My Pool',
  gallons INTEGER NOT NULL DEFAULT 10000,
  pool_type TEXT NOT NULL DEFAULT 'chlorine' CHECK(pool_type IN ('chlorine', 'salt')),
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS test_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  logged_at TEXT NOT NULL DEFAULT (datetime('now')),
  kit_type TEXT NOT NULL DEFAULT 'drop' CHECK(kit_type IN ('drop', 'strip')),
  free_chlorine REAL,
  combined_chlorine REAL,
  ph REAL,
  alkalinity REAL,
  calcium_hardness REAL,
  cya REAL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS chemical_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  logged_at TEXT NOT NULL DEFAULT (datetime('now')),
  chemical TEXT NOT NULL,
  amount REAL NOT NULL,
  unit TEXT NOT NULL DEFAULT 'oz' CHECK(unit IN ('oz', 'lbs', 'gal')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  logged_at TEXT NOT NULL DEFAULT (datetime('now')),
  activities TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS user_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  chemical_options TEXT NOT NULL DEFAULT 'Liquid Chlorine,Trichlor/Dichlor,Cal-Hypo,Soda Ash,Baking Soda,Muriatic Acid',
  maintenance_activities TEXT NOT NULL DEFAULT 'Skimming,Vacuuming,Brushing,Backwashing',
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_test_logs_user_logged ON test_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_chemical_logs_user_logged ON chemical_logs(user_id, logged_at DESC);
CREATE INDEX IF NOT EXISTS idx_maintenance_logs_user_logged ON maintenance_logs(user_id, logged_at DESC);
