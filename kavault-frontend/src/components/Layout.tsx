import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Code2,
  GitBranch,
  Languages,
  BarChart2,
  Network,
  Settings as SettingsIcon,
  Crown,
  Menu,
  X,
  Trophy,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const { t, isCreator, activateCreatorMode } = useApp();
  const { trackPageVisit, openModal, unlockedCount, totalCount } = useAchievements();

  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    if (isCreator) return;
    const next = logoClicks + 1;
    if (next >= 5) {
      setLogoClicks(0);
      const pass = window.prompt("Введите мастер-пароль Создателя (Root-доступ):");
      if (pass) {
        if (activateCreatorMode(pass)) {
          window.alert("👑 Режим Создателя успешно активирован!");
        } else {
          window.alert("Неверный пароль Создателя.");
        }
      }
    } else {
      setLogoClicks(next);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c" || e.key === "С" || e.key === "с")) {
        e.preventDefault();
        const pass = window.prompt("Вход в Панель Создателя (Root Access). Введите пароль:");
        if (pass) {
          if (activateCreatorMode(pass)) {
            window.alert("👑 Режим Создателя успешно активирован!");
          } else {
            window.alert("Неверный пароль Создателя.");
          }
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activateCreatorMode]);

  useEffect(() => {
    trackPageVisit(location.pathname);
  }, [location.pathname, trackPageVisit]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Закрывать меню при смене страницы
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: "/dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
    { path: "/developer", label: t.nav.developer, icon: Code2 },
    { path: "/github", label: t.nav.github, icon: GitBranch },
    { path: "/japanese", label: t.nav.japanese, icon: Languages },
    { path: "/tracker", label: t.nav.tracker, icon: BarChart2 },
    { path: "/graph", label: t.nav.graph, icon: Network },
  ];

  // Главные пункты для мобильного нижнего таб-бара
  const mobileTabs = [
    { path: "/dashboard", label: "Главная", icon: LayoutDashboard },
    { path: "/developer", label: "Dev Hub", icon: Code2 },
    { path: "/japanese", label: "Японский", icon: Languages },
    { path: "/tracker", label: "Трекер", icon: BarChart2 },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        backgroundColor: "var(--bg)",
        color: "var(--text-primary)",
        overflow: "hidden",
      }}
    >
      {/* ── ДЕСКТОПНЫЙ САЙДБАР (на экранах >= 768px) ── */}
      {!isMobile && (
        <aside
          style={{
            width: "250px",
            borderRight: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--surface)",
            flexShrink: 0,
          }}
        >
          {/* Логотип + статус создателя */}
          <div
            style={{
              padding: "var(--space-6)",
              fontWeight: 700,
              fontSize: "18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              onClick={handleLogoClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: isCreator ? "default" : "pointer",
                userSelect: "none",
              }}
              title={isCreator ? "KAVAULT Root Active" : "KAVAULT"}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  backgroundColor: isCreator
                    ? "#f59e0b"
                    : "var(--text-primary)",
                  color: isCreator ? "#000" : "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: 800,
                }}
              >
                K
              </div>
              <span>KAVAULT</span>
            </div>

            {isCreator && (
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                👑 Root
              </span>
            )}
          </div>

          {/* Навигация */}
          <nav
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              padding: "0 var(--space-4)",
              overflowY: "auto",
            }}
          >
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    textDecoration: "none",
                    borderRadius: "var(--radius-md)",
                    color: isActive
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                    backgroundColor: isActive
                      ? "var(--surface-raised)"
                      : "transparent",
                    fontWeight: isActive ? 500 : 400,
                    transition: "all 0.2s",
                  }}
                >
                  <Icon size={18} /> {item.label}
                </Link>
              );
            })}

            {/* Эксклюзивный пункт для Создателя */}
            {isCreator && (
              <Link
                to="/admin"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  textDecoration: "none",
                  borderRadius: "var(--radius-md)",
                  color: location.pathname === "/admin" ? "#f59e0b" : "#fbbf24",
                  backgroundColor:
                    location.pathname === "/admin"
                      ? "rgba(245, 158, 11, 0.15)"
                      : "rgba(245, 158, 11, 0.05)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  fontWeight: 600,
                  marginTop: "8px",
                  transition: "all 0.2s",
                }}
              >
                <Crown size={18} color="#f59e0b" /> Панель Создателя
              </Link>
            )}
          </nav>

          {/* Достижения и Настройки */}
          <div
            style={{
              padding: "var(--space-4)",
              borderTop: "1px solid var(--border)",
              marginTop: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            <button
              onClick={openModal}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(234, 179, 8, 0.2)",
                backgroundColor: "rgba(234, 179, 8, 0.06)",
                color: "#eab308",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Trophy size={16} /> Достижения
              </span>
              <span
                style={{
                  fontSize: "11px",
                  padding: "1px 6px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(234, 179, 8, 0.15)",
                }}
              >
                {unlockedCount}/{totalCount}
              </span>
            </button>

            <Link
              to="/settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 12px",
                textDecoration: "none",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/settings"
                    ? "var(--text-primary)"
                    : "var(--text-muted)",
                backgroundColor:
                  location.pathname === "/settings"
                    ? "var(--surface-raised)"
                    : "transparent",
              }}
            >
              <SettingsIcon size={18} /> {t.nav.settings}
            </Link>
          </div>
        </aside>
      )}

      {/* ── МОБИЛЬНЫЙ ВЕРХНИЙ ХЕДЕР (iOS Safe Area) ── */}
      {isMobile && (
        <header
          style={{
            padding: "12px 16px",
            paddingTop: "calc(12px + env(safe-area-inset-top, 0px))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            zIndex: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "24px",
                height: "24px",
                backgroundColor: isCreator
                  ? "#f59e0b"
                  : "var(--text-primary)",
                color: isCreator ? "#000" : "var(--bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 800,
              }}
            >
              K
            </div>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>KAVAULT</span>
            {isCreator && (
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  padding: "1px 5px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(245, 158, 11, 0.15)",
                  color: "#f59e0b",
                  border: "1px solid rgba(245, 158, 11, 0.3)",
                }}
              >
                Root
              </span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              onClick={openModal}
              style={{
                background: "none",
                border: "none",
                color: "#eab308",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
              title="Достижения"
            >
              <Trophy size={20} />
            </button>
            <Link
              to="/settings"
              style={{
                padding: "8px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SettingsIcon size={20} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-primary)",
                padding: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </header>
      )}

      {/* ── ОСНОВНОЙ КОНТЕНТ ── */}
      <main
        style={{
          flex: 1,
          padding: isMobile ? "var(--space-4)" : "var(--space-8)",
          paddingBottom: isMobile
            ? "calc(74px + env(safe-area-inset-bottom, 0px))"
            : "var(--space-8)",
          overflowY: "auto",
          height: "100%",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>{children}</div>
      </main>

      {/* ── МОБИЛЬНОЕ ВСПЛЫВАЮЩЕЕ МЕНЮ (ШТОРКА) ── */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: "calc(58px + env(safe-area-inset-bottom, 0px))",
            backgroundColor: "rgba(9, 9, 11, 0.8)",
            backdropFilter: "blur(8px)",
            zIndex: 45,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            animation: "kavaultFadeIn 0.2s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--surface)",
              borderTop: "1px solid var(--border)",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
              padding: "var(--space-5)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 -10px 30px rgba(0, 0, 0, 0.5)",
              animation: "kavaultScaleIn 0.25s ease-out",
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 600,
                color: "var(--text-muted)",
                textTransform: "uppercase",
                marginBottom: "4px",
              }}
            >
              Все разделы KAVAULT
            </div>

            <Link
              to="/github"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/github"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/github"
                    ? "var(--surface-raised)"
                    : "transparent",
                textDecoration: "none",
                fontSize: "15px",
              }}
            >
              <GitBranch size={18} /> {t.nav.github}
            </Link>

            <Link
              to="/graph"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/graph"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/graph"
                    ? "var(--surface-raised)"
                    : "transparent",
                textDecoration: "none",
                fontSize: "15px",
              }}
            >
              <Network size={18} /> {t.nav.graph}
            </Link>

            <Link
              to="/settings"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/settings"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/settings"
                    ? "var(--surface-raised)"
                    : "transparent",
                textDecoration: "none",
                fontSize: "15px",
              }}
            >
              <SettingsIcon size={18} /> {t.nav.settings}
            </Link>

            {isCreator && (
              <Link
                to="/admin"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  color: "#f59e0b",
                  backgroundColor: "rgba(245, 158, 11, 0.1)",
                  border: "1px solid rgba(245, 158, 11, 0.2)",
                  textDecoration: "none",
                  fontWeight: 600,
                  fontSize: "15px",
                  marginTop: "4px",
                }}
              >
                <Crown size={18} color="#f59e0b" /> Панель Создателя
              </Link>
            )}
          </div>
        </div>
      )}

      {/* ── МОБИЛЬНЫЙ НИЖНИЙ ТАБ-БАР (iOS Style) ── */}
      {isMobile && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "calc(58px + env(safe-area-inset-bottom, 0px))",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            backgroundColor: "rgba(24, 24, 27, 0.92)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            zIndex: 50,
          }}
        >
          {mobileTabs.map((tab) => {
            const isActive = location.pathname === tab.path;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.path}
                to={tab.path}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "3px",
                  color: isActive ? "var(--accent)" : "var(--text-muted)",
                  textDecoration: "none",
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 400,
                  width: "20%",
                  height: "100%",
                }}
              >
                <Icon size={20} />
                <span>{tab.label}</span>
              </Link>
            );
          })}

          {/* Кнопка "Еще" */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "3px",
              color: mobileMenuOpen ? "var(--accent)" : "var(--text-muted)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: mobileMenuOpen ? 600 : 400,
              width: "20%",
              height: "100%",
            }}
          >
            <Menu size={20} />
            <span>Ещё</span>
          </button>
        </nav>
      )}
    </div>
  );
}
