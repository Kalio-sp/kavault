import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { DeveloperHub } from "./pages/DeveloperHub";
import { JapaneseHub } from "./pages/JapaneseHub";
import { ReviewSession } from "./pages/ReviewSession";
import { GitHubCollection } from "./pages/GitHubCollection";
import { LearningTracker } from "./pages/LearningTracker";
import { KnowledgeGraph } from "./pages/KnowledgeGraph";
import { Settings } from "./pages/Settings";
import { AdminPanel } from "./pages/AdminPanel";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { AppProvider, useApp } from "./context/AppContext";
import { DialogProvider } from "./context/DialogContext";
import { AchievementProvider } from "./context/AchievementContext";
import { AchievementToast } from "./components/AchievementToast";
import { AchievementsModal } from "./components/AchievementsModal";

function ProgrammingGuard({ children }: { children: React.ReactNode }) {
  const { showProgramming } = useApp();
  if (!showProgramming) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <AppProvider>
      <DialogProvider>
        <AchievementProvider>
          <AchievementToast />
          <AchievementsModal />
          <HashRouter>
          <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/developer"
            element={
              <ProtectedRoute>
                <ProgrammingGuard>
                  <Layout>
                    <DeveloperHub />
                  </Layout>
                </ProgrammingGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/japanese"
            element={
              <ProtectedRoute>
                <Layout>
                  <JapaneseHub />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/learn"
            element={
              <ProtectedRoute>
                <Layout>
                  <JapaneseHub />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/review"
            element={
              <ProtectedRoute>
                <Layout>
                  <ReviewSession />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/github"
            element={
              <ProtectedRoute>
                <ProgrammingGuard>
                  <Layout>
                    <GitHubCollection />
                  </Layout>
                </ProgrammingGuard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/tracker"
            element={
              <ProtectedRoute>
                <Layout>
                  <LearningTracker />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/graph"
            element={
              <ProtectedRoute>
                <Layout>
                  <KnowledgeGraph />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout>
                  <AdminPanel />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </HashRouter>
        </AchievementProvider>
    </DialogProvider>
  </AppProvider>
  );
}
