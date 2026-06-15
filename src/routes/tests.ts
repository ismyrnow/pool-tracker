import { db } from "../db/client";

export function list(userId: string, url: URL): Response {
  const days = Number(url.searchParams.get("days") ?? 90);
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const rows = db
    .query(
      `SELECT * FROM test_logs
       WHERE user_id = ? AND logged_at >= ?
       ORDER BY logged_at DESC`,
    )
    .all(userId, since);

  return Response.json(rows);
}

export async function create(userId: string, req: Request): Promise<Response> {
  const body = await req.json();
  const {
    logged_at,
    kit_type,
    free_chlorine,
    combined_chlorine,
    ph,
    alkalinity,
    calcium_hardness,
    cya,
    notes,
  } = body;

  const result = db
    .query(
      `INSERT INTO test_logs
        (user_id, logged_at, kit_type, free_chlorine, combined_chlorine,
         ph, alkalinity, calcium_hardness, cya, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`,
    )
    .get(
      userId,
      logged_at ?? new Date().toISOString(),
      kit_type ?? "drop",
      free_chlorine ?? null,
      combined_chlorine ?? null,
      ph ?? null,
      alkalinity ?? null,
      calcium_hardness ?? null,
      cya ?? null,
      notes ?? null,
    );

  return Response.json(result, { status: 201 });
}

export function remove(userId: string, id: number): Response {
  const row = db.query("SELECT id FROM test_logs WHERE id = ? AND user_id = ?").get(id, userId);
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  db.query("DELETE FROM test_logs WHERE id = ?").run(id);
  return new Response(null, { status: 204 });
}
