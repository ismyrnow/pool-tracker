import { betterAuth } from "better-auth";
import { db } from "../db/client";

export function hasUsers(): boolean {
  const row = db.query('SELECT COUNT(*) as count FROM "user"').get() as { count: number };
  return row.count > 0;
}

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 30,
  },
  trustedOrigins: [process.env.FRONTEND_ORIGIN ?? "http://localhost:5173"],
});
