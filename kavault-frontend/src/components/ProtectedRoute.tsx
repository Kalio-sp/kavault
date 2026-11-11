import { Navigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { OnboardingWizard } from "./OnboardingWizard";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("access_token");
  const { profileLoaded, onboardingCompleted } = useApp();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!profileLoaded) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-muted)",
          fontSize: "14px",
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}
      >
        KAVAULT...
      </div>
    );
  }

  if (!onboardingCompleted) {
    return <OnboardingWizard />;
  }

  return <>{children}</>;
}
