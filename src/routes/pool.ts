import { db } from "../db/client";

interface PoolRow {
  id: number;
  user_id: string;
  name: string;
  gallons: number;
  pool_type: string;
  created_at: string;
  updated_at: string;
}

export function get(userId: string): Response {
  let row = db.query("SELECT * FROM pool_profile WHERE user_id = ?").get(userId) as PoolRow | null;

  if (!row) {
    db.run("INSERT INTO pool_profile (user_id) VALUES (?)", [userId]);
    row = db.query("SELECT * FROM pool_profile WHERE user_id = ?").get(userId) as PoolRow;
  }

  return Response.json(row);
}

export async function put(userId: string, req: Request): Promise<Response> {
  const { name, gallons, pool_type } = await req.json();

  const existing = db.query("SELECT id FROM pool_profile WHERE user_id = ?").get(userId);

  if (existing) {
    db.run(
      `UPDATE pool_profile
       SET name = ?, gallons = ?, pool_type = ?, updated_at = datetime('now')
       WHERE user_id = ?`,
      [name, gallons, pool_type, userId],
    );
  } else {
    db.run("INSERT INTO pool_profile (user_id, name, gallons, pool_type) VALUES (?, ?, ?, ?)", [
      userId,
      name,
      gallons,
      pool_type,
    ]);
  }

  const row = db.query("SELECT * FROM pool_profile WHERE user_id = ?").get(userId);
  return Response.json(row);
}
