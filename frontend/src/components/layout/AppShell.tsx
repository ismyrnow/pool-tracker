import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { BottomNav } from "./BottomNav";
import { Fab, type FabAction } from "./Fab";
import { LogTestForm } from "@/components/forms/LogTestForm";
import { LogChemicalForm } from "@/components/forms/LogChemicalForm";
import { LogMaintenanceForm } from "@/components/forms/LogMaintenanceForm";

export function AppShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const [fabOpen, setFabOpen] = useState(false);
  const [drawer, setDrawer] = useState<FabAction | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const activeTab =
    location.pathname === "/history"
      ? "history"
      : location.pathname === "/settings"
        ? "settings"
        : "dashboard";

  const handleTabChange = (tab: string) => {
    setFabOpen(false);
    setDrawer(null);
    if (tab === "dashboard") navigate("/");
    else navigate(`/${tab}`);
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
      <div className="flex-1 min-h-0 overflow-y-auto pb-6">
        <Outlet context={{ refreshKey }} />
      </div>

      {fabOpen && (
        <div
          onClick={() => setFabOpen(false)}
          className="absolute inset-0 z-40 bg-black/10 backdrop-blur-[1px]"
        />
      )}

      <Fab open={fabOpen} setOpen={setFabOpen} onPick={handlePick} />

      <BottomNav
        active={activeTab as "dashboard" | "history" | "settings"}
        onChange={handleTabChange}
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
