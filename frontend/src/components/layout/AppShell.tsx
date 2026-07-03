import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { type FabAction } from "./Fab";
import { LogTestForm } from "@/components/forms/LogTestForm";
import { LogChemicalForm } from "@/components/forms/LogChemicalForm";
import { LogMaintenanceForm } from "@/components/forms/LogMaintenanceForm";

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fabOpen, setFabOpen] = useState(false);
  const [drawer, setDrawer] = useState<FabAction | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const activeTab = location.pathname === "/history" ? "history" : "dashboard";

  const handleTabChange = (tab: "dashboard" | "history") => {
    setFabOpen(false);
    setDrawer(null);
    navigate(tab === "dashboard" ? "/" : "/history");
  };

  const handlePick = (action: FabAction) => {
    setFabOpen(false);
    setDrawer(action);
  };

  const handleSaved = () => {
    setDrawer(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="h-full flex flex-col bg-background relative">
      <div className="flex-1 min-h-0 overflow-y-auto pb-10">
        <Outlet context={{ refreshKey }} />
      </div>

      {fabOpen && (
        <div
          onClick={() => setFabOpen(false)}
          className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
        />
      )}

      <BottomNav
        active={activeTab}
        onChange={handleTabChange}
        fabOpen={fabOpen}
        setFabOpen={setFabOpen}
        onPick={handlePick}
      />

      <LogTestForm open={drawer === "test"} onClose={() => setDrawer(null)} onSaved={handleSaved} />
      <LogChemicalForm
        open={drawer === "chem"}
        onClose={() => setDrawer(null)}
        onSaved={handleSaved}
      />
      <LogMaintenanceForm
        open={drawer === "maint"}
        onClose={() => setDrawer(null)}
        onSaved={handleSaved}
      />
    </div>
  );
}
