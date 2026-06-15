import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSetupStatus } from "@/hooks/useAuth";
import { LoginPage } from "@/pages/LoginPage";
import { SetupPage } from "@/pages/SetupPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { HistoryPage } from "@/pages/HistoryPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AppShell } from "@/components/layout/AppShell";

export default function App() {
  const needsSetup = useSetupStatus();

  if (needsSetup === null) return null;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={needsSetup ? <Navigate to="/setup" /> : <LoginPage />} />
        <Route path="/setup" element={needsSetup ? <SetupPage /> : <Navigate to="/login" />} />
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
