export type PoolType = "chlorine" | "salt";
export type KitType = "drop" | "strip";
export type Unit = "oz" | "lbs" | "gal";
export type ParamStatus = "good" | "low" | "high" | "untested";

export interface PoolProfile {
  id: number;
  name: string;
  gallons: number;
  pool_type: PoolType;
}

export interface TestLog {
  id: number;
  logged_at: string;
  kit_type: KitType;
  free_chlorine: number | null;
  combined_chlorine: number | null;
  ph: number | null;
  alkalinity: number | null;
  calcium_hardness: number | null;
  cya: number | null;
  notes: string | null;
}

export interface ChemicalLog {
  id: number;
  logged_at: string;
  chemical: string;
  amount: number;
  unit: Unit;
  notes: string | null;
}

export interface MaintenanceLog {
  id: number;
  logged_at: string;
  activities: string[];
  notes: string | null;
}

export interface UserSettings {
  chemical_options: string;
  maintenance_activities: string;
}

export interface Parameter {
  parameter: string;
  value: number | null;
  unit: string;
  status: ParamStatus;
  idealLow: number;
  idealHigh: number;
  recommendation: string | null;
}

export interface DashboardData {
  latestTest: TestLog | null;
  latestMaintenance: MaintenanceLog | null;
  parameters: Parameter[];
}
