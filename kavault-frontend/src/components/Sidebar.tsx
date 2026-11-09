import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Code,
  GitBranch,
  BookOpen,
  BarChart2,
  Network,
  Settings,
} from "lucide-react";

export function Sidebar() {
  const navItems = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/developer", icon: Code, label: "Developer Hub" },
    { to: "/github", icon: GitBranch, label: "GitHub Collection" },
    { to: "/japanese", icon: BookOpen, label: "Japanese Hub" },
    { to: "/tracker", icon: BarChart2, label: "Learning Tracker" },
    { to: "/graph", icon: Network, label: "Knowledge Graph" },
  ];

  return (
    <aside
      style={{
        width: "240px",
        backgroundColor: "var(--bg)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        padding: "var(--space-4) 0",
      }}
    >
      <div
        style={{ padding: "0 var(--space-6)", marginBottom: "var(--space-8)" }}
      >
        <h1
          style={{
            fontSize: "18px",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "24px",
              height: "24px",
              backgroundColor: "var(--text-primary)",
              color: "var(--bg)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            K
          </div>
          KAVAULT
        </h1>
      </div>

      <nav
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-1)",
          padding: "0 var(--space-3)",
        }}
      >
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              padding: "var(--space-2) var(--space-3)",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
              color: isActive ? "var(--accent)" : "var(--text-secondary)",
              backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
              fontSize: "14px",
              fontWeight: 500,
              transition: "all 0.2s ease",
            })}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: "0 var(--space-3)", marginTop: "auto" }}>
        <NavLink
          to="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-3)",
            padding: "var(--space-2) var(--space-3)",
            borderRadius: "var(--radius-md)",
            textDecoration: "none",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
          }}
        >
          <Settings size={18} />
          Settings
        </NavLink>
      </div>
    </aside>
  );
}
