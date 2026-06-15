import { db } from "../db/client";
import { buildRecommendations } from "../lib/recommendations";
import type { TestReading, PoolType } from "../lib/recommendations";

interface PoolRow {
  pool_type: string;
}
interface TestRow extends TestReading {
  id: number;
  logged_at: string;
  kit_type: string;
  notes: string | null;
}
interface MaintenanceRow {
  id: number;
  logged_at: string;
  activities: string;
  notes: string | null;
}

export function get(userId: string): Response {
  const pool = db
    .query("SELECT pool_type FROM pool_profile WHERE user_id = ?")
    .get(userId) as PoolRow | null;

  const poolType: PoolType = (pool?.pool_type as PoolType) ?? "chlorine";

  const latestTest = db
    .query("SELECT * FROM test_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 1")
    .get(userId) as TestRow | null;

  const latestMaintenanceRow = db
    .query("SELECT * FROM maintenance_logs WHERE user_id = ? ORDER BY logged_at DESC LIMIT 1")
    .get(userId) as MaintenanceRow | null;

  const latestMaintenance = latestMaintenanceRow
    ? {
        ...latestMaintenanceRow,
        activities: JSON.parse(latestMaintenanceRow.activities) as string[],
      }
    : null;

  const emptyReading: TestReading = {
    free_chlorine: null,
    combined_chlorine: null,
    ph: null,
    alkalinity: null,
    calcium_hardness: null,
    cya: null,
  };

  const reading: TestReading = latestTest ?? emptyReading;
  const parameters = buildRecommendations(reading, poolType);

  return Response.json({ latestTest, latestMaintenance, parameters });
}
