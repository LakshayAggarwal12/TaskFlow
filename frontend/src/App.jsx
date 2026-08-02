import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkspaceSelectorPage from "./pages/WorkspaceSelectorPage";
import WorkspaceDashboardPage from "./pages/WorkspaceDashboardPage";
import ProjectHubPage from "./pages/ProjectHubPage";
import AccountPage from "./pages/AccountPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected — no workspace scope yet */}
      <Route element={<ProtectedRoute />}>
        <Route path="/workspaces" element={<WorkspaceSelectorPage />} />
        <Route path="/account" element={<AppLayoutWrapper><AccountPage /></AppLayoutWrapper>} />
      </Route>

      {/* Protected — workspace-scoped, gets the full app shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/w/:workspaceId" element={<WorkspaceDashboardPage />} />
          <Route path="/w/:workspaceId/p/:projectId" element={<ProjectHubPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// /account doesn't have a :workspaceId in its URL, but should still show the
// full sidebar/topbar shell — this tiny wrapper reuses AppLayout without
// requiring route nesting under /w/:workspaceId.
function AppLayoutWrapper({ children }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="flex-1 flex flex-col min-w-0 mx-auto max-w-6xl">
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
