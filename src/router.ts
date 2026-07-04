import { auth, hasUsers } from "./lib/auth";
import { cors, jsonError } from "./lib/middleware";
import { db } from "./db/client";
import * as poolRoutes from "./routes/pool";
import * as testRoutes from "./routes/tests";
import * as chemicalRoutes from "./routes/chemicals";
import * as maintenanceRoutes from "./routes/maintenance";
import * as dashboardRoutes from "./routes/dashboard";
import * as settingsRoutes from "./routes/settings";

export async function router(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const method = req.method;

  if (method === "OPTIONS") return cors(new Response(null, { status: 204 }));

  if (path === "/api/health" && method === "GET") {
    try {
      db.query("SELECT 1").get();
      return cors(Response.json({ status: "ok" }));
    } catch (err) {
      console.error(err);
      return cors(jsonError("Database unavailable", 503));
    }
  }

  if (path.startsWith("/api/auth/")) {
    if (path === "/api/auth/sign-up/email" && method === "POST" && hasUsers()) {
      return cors(jsonError("Registration is closed", 403));
    }
    return cors(await auth.handler(req));
  }

  if (path === "/api/setup-status" && method === "GET") {
    return cors(Response.json({ needsSetup: !hasUsers() }));
  }

  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return cors(jsonError("Unauthorized", 401));

  const userId = session.user.id;

  try {
    if (path === "/api/pool") {
      if (method === "GET") return cors(await poolRoutes.get(userId));
      if (method === "PUT") return cors(await poolRoutes.put(userId, req));
    }
    if (path === "/api/dashboard" && method === "GET") {
      return cors(dashboardRoutes.get(userId));
    }
    if (path === "/api/tests") {
      if (method === "GET") return cors(testRoutes.list(userId, url));
      if (method === "POST") return cors(await testRoutes.create(userId, req));
    }
    if (path.match(/^\/api\/tests\/\d+$/)) {
      const id = Number(path.split("/")[3]);
      if (method === "PUT") return cors(await testRoutes.update(userId, id, req));
      if (method === "DELETE") return cors(testRoutes.remove(userId, id));
    }
    if (path === "/api/chemicals") {
      if (method === "GET") return cors(chemicalRoutes.list(userId, url));
      if (method === "POST") return cors(await chemicalRoutes.create(userId, req));
    }
    if (path.match(/^\/api\/chemicals\/\d+$/)) {
      const id = Number(path.split("/")[3]);
      if (method === "PUT") return cors(await chemicalRoutes.update(userId, id, req));
      if (method === "DELETE") return cors(chemicalRoutes.remove(userId, id));
    }
    if (path === "/api/maintenance") {
      if (method === "GET") return cors(maintenanceRoutes.list(userId, url));
      if (method === "POST") return cors(await maintenanceRoutes.create(userId, req));
    }
    if (path.match(/^\/api\/maintenance\/\d+$/)) {
      const id = Number(path.split("/")[3]);
      if (method === "PUT") return cors(await maintenanceRoutes.update(userId, id, req));
      if (method === "DELETE") return cors(maintenanceRoutes.remove(userId, id));
    }
    if (path === "/api/settings") {
      if (method === "GET") return cors(settingsRoutes.get(userId));
      if (method === "PUT") return cors(await settingsRoutes.put(userId, req));
    }

    return cors(jsonError("Not found", 404));
  } catch (err) {
    console.error(err);
    return cors(jsonError("Internal server error", 500));
  }
}
