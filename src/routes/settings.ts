import { db } from "../db/client";

export function get(userId: string): Response {
  let row = db
    .query("SELECT chemical_options, maintenance_activities FROM user_settings WHERE user_id = ?")
    .get(userId);

  if (!row) {
    db.run("INSERT INTO user_settings (user_id) VALUES (?)", [userId]);
    row = db
      .query("SELECT chemical_options, maintenance_activities FROM user_settings WHERE user_id = ?")
      .get(userId);
  }

  return Response.json(row);
}

export async function put(userId: string, req: Request): Promise<Response> {
  const { chemical_options, maintenance_activities } = await req.json();

  const existing = db.query("SELECT id FROM user_settings WHERE user_id = ?").get(userId);

  if (existing) {
    db.run(
      `UPDATE user_settings
       SET chemical_options = ?, maintenance_activities = ?, updated_at = datetime('now')
       WHERE user_id = ?`,
      [chemical_options, maintenance_activities, userId],
    );
  } else {
    db.run(
      "INSERT INTO user_settings (user_id, chemical_options, maintenance_activities) VALUES (?, ?, ?)",
      [userId, chemical_options, maintenance_activities],
    );
  }

  const row = db
    .query("SELECT chemical_options, maintenance_activities FROM user_settings WHERE user_id = ?")
    .get(userId);
  return Response.json(row);
}
