import { db } from "../db/client";

export function list(userId: string, url: URL): Response {
  const days = Number(url.searchParams.get("days") ?? 90);
  const since = new Date(Date.now() - days * 86400000).toISOString();

  const rows = db
    .query(
      `SELECT * FROM chemical_logs
       WHERE user_id = ? AND logged_at >= ?
       ORDER BY logged_at DESC`,
    )
    .all(userId, since);

  return Response.json(rows);
}

export async function create(userId: string, req: Request): Promise<Response> {
  const { logged_at, chemical, amount, unit, notes } = await req.json();

  const result = db
    .query(
      `INSERT INTO chemical_logs (user_id, logged_at, chemical, amount, unit, notes)
       VALUES (?, ?, ?, ?, ?, ?)
       RETURNING *`,
    )
    .get(
      userId,
      logged_at ?? new Date().toISOString(),
      chemical,
      amount,
      unit ?? "oz",
      notes ?? null,
    );

  return Response.json(result, { status: 201 });
}

export function remove(userId: string, id: number): Response {
  const row = db.query("SELECT id FROM chemical_logs WHERE id = ? AND user_id = ?").get(id, userId);
  if (!row) return Response.json({ error: "Not found" }, { status: 404 });

  db.query("DELETE FROM chemical_logs WHERE id = ?").run(id);
  return new Response(null, { status: 204 });
}
