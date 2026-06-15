import { db } from "../db/client";

interface MaintenanceRow {
  id: number;
  user_id: string;
  logged_at: string;
  activities: string;
  notes: string | null;
  created_at: string;
}

function parseRow(row: MaintenanceRow) {
  return { ...row, activities: JSON.parse(row.activities) as string[] };
}

export function list(userId: string, url: URL): Response {
  const days = Number(url.searchParams.get("days") ?? 90);
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const rows = db
    .query(
      `SELECT * FROM maintenance_logs
       WHERE user_id = ? AND logged_at >= ?
       ORDER BY logged_at DESC`,
    )
    .all(userId, since) as MaintenanceRow[];

  return Response.json(rows.map(parseRow));
}

export async function create(userId: string, req: Request): Promise<Response> {
  const { logged_at, activities, notes } = await req.json();

  const result = db
    .query(
      `INSERT INTO maintenance_logs (user_id, logged_at, activities, notes)
       VALUES (?, ?, ?, ?)
       RETURNING *`,
    )
    .get(
      userId,
      logged_at ?? new Date().toISOString(),
      JSON.stringify(activities ?? []),
      notes ?? null,
    ) as MaintenanceRow;

  return Response.json(parseRow(result), { status: 201 });
}

export function remove(userId: string, id: number): Response {
  const row = db
    .query("SELECT id FROM maintenance_logs WHERE id = ? AND user_id = ?")
    .get(id, userId);
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  db.query("DELETE FROM maintenance_logs WHERE id = ?").run(id);
  return new Response(null, { status: 204 });
}
