import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import AppLayout from "./layouts/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WorkspaceSelectorPage from "./pages/WorkspaceSelectorPage";
import WorkspaceDashboardPage from "./pages/WorkspaceDashboardPage";
import WorkspaceSettingsPage from "./pages/WorkspaceSettingsPage";
import ProjectHubPage from "./pages/ProjectHubPage";
import ProjectSettingsPage from "./pages/ProjectSettingsPage";
import BoardPage from "./pages/BoardPage";
import BacklogPage from "./pages/BacklogPage";
import SprintsListPage from "./pages/SprintsListPage";
import SprintDetailPage from "./pages/SprintDetailPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ActivityPage from "./pages/ActivityPage";
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
          <Route path="/w/:workspaceId/settings" element={<WorkspaceSettingsPage />} />

          <Route path="/w/:workspaceId/p/:projectId" element={<ProjectHubPage />} />
          <Route path="/w/:workspaceId/p/:projectId/settings" element={<ProjectSettingsPage />} />
          <Route path="/w/:workspaceId/p/:projectId/board/:boardId" element={<BoardPage />} />
          <Route path="/w/:workspaceId/p/:projectId/backlog" element={<BacklogPage />} />
          <Route path="/w/:workspaceId/p/:projectId/sprints" element={<SprintsListPage />} />
          <Route path="/w/:workspaceId/p/:projectId/sprints/:sprintId" element={<SprintDetailPage />} />
          <Route path="/w/:workspaceId/p/:projectId/analytics" element={<AnalyticsPage />} />
          <Route path="/w/:workspaceId/p/:projectId/activity" element={<ActivityPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

// /account doesn't have a :workspaceId in its URL, but should still show a
// consistent page shell — this tiny wrapper avoids requiring route nesting
// under /w/:workspaceId just for one page.
function AppLayoutWrapper({ children }) {
  return (
    <div className="flex min-h-screen bg-canvas">
      <div className="flex-1 flex flex-col min-w-0 mx-auto max-w-6xl">
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
