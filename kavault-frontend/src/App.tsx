import { Suspense, lazy } from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";
import { AppProvider, useApp } from "./context/AppContext";
import { DialogProvider } from "./context/DialogContext";
import { AchievementProvider } from "./context/AchievementContext";
import { AchievementToast } from "./components/AchievementToast";

const lazyNamed = <T extends Record<string, any>>(
  loader: () => Promise<T>,
  exportName: keyof T,
) => lazy(() => loader().then((m) => ({ default: m[exportName] })));

const Dashboard = lazyNamed(() => import("./pages/Dashboard"), "Dashboard");
const DeveloperHub = lazyNamed(() => import("./pages/DeveloperHub"), "DeveloperHub");
const JapaneseHub = lazyNamed(() => import("./pages/JapaneseHub"), "JapaneseHub");
const ReviewSession = lazyNamed(() => import("./pages/ReviewSession"), "ReviewSession");
const GitHubCollection = lazyNamed(() => import("./pages/GitHubCollection"), "GitHubCollection");
const LearningTracker = lazyNamed(() => import("./pages/LearningTracker"), "LearningTracker");
const KnowledgeGraph = lazyNamed(() => import("./pages/KnowledgeGraph"), "KnowledgeGraph");
const Settings = lazyNamed(() => import("./pages/Settings"), "Settings");
const AdminPanel = lazyNamed(() => import("./pages/AdminPanel"), "AdminPanel");
const AchievementsModal = lazyNamed(
  () => import("./components/AchievementsModal"),
  "AchievementsModal",
);

function RouteLoadingFallback() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--text-muted)",
        fontSize: "14px",
        fontWeight: 600,
        letterSpacing: "0.08em",
      }}
    >
      KAVAULT...
    </div>
  );
}

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
          <Suspense fallback={null}>
            <AchievementsModal />
          </Suspense>
          <HashRouter>
          <Suspense fallback={<RouteLoadingFallback />}>
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
        </Suspense>
      </HashRouter>
        </AchievementProvider>
    </DialogProvider>
  </AppProvider>
  );
}
