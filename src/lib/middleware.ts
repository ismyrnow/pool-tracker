const CORS_HEADERS = {
  "Access-Control-Allow-Origin": process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Cookie",
  "Access-Control-Allow-Credentials": "true",
};

export function cors(res: Response): Response {
  const headers = new Headers(res.headers);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => headers.set(k, v));
  return new Response(res.body, { status: res.status, headers });
}

export function jsonError(message: string, status: number): Response {
  return Response.json({ error: message }, { status });
}
