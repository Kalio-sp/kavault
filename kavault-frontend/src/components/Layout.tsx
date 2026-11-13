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
  Trophy,
  Sparkles,
  PenLine,
  Users,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { UserAvatarBadge } from "./UserAvatarBadge";
import {
  loadProfileCustomization,
  type UserProfileCustomization,
} from "../utils/profileCosmetics";

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const {
    t,
    isCreator,
    showProgramming,
    studyText,
    studyPalette,
    nickname,
  } = useApp();
  const { trackPageVisit, openModal, unlockedCount, totalCount } = useAchievements();

  const [profileCustom, setProfileCustom] = useState<UserProfileCustomization>(() =>
    loadProfileCustomization(),
  );

  useEffect(() => {
    const handleProfileUpdate = () => {
      setProfileCustom(loadProfileCustomization());
    };
    window.addEventListener("kavault_profile_updated", handleProfileUpdate);
    return () => {
      window.removeEventListener("kavault_profile_updated", handleProfileUpdate);
    };
  }, []);

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
    ...(showProgramming
      ? [
          { path: "/developer", label: t.nav.developer, icon: Code2 },
          { path: "/github", label: t.nav.github, icon: GitBranch },
        ]
      : []),
    { path: "/japanese", label: studyText.navLabel, icon: Languages },
    { path: "/thoughts", label: t.nav.thoughts, icon: PenLine },
    { path: "/social", label: t.nav.social, icon: Users },
    { path: "/tracker", label: t.nav.tracker, icon: BarChart2 },
    { path: "/graph", label: t.nav.graph, icon: Network },
  ];

  // Главные пункты для мобильного нижнего таб-бара
  const mobileTabs = showProgramming
    ? [
        { path: "/dashboard", label: t.nav.mobileDash, icon: LayoutDashboard },
        { path: "/developer", label: t.nav.mobileDev, icon: Code2 },
        { path: "/japanese", label: studyText.mobileNavLabel, icon: Languages },
        { path: "/tracker", label: t.nav.mobileTrack, icon: BarChart2 },
      ]
    : [
        { path: "/dashboard", label: t.nav.mobileDash, icon: LayoutDashboard },
        { path: "/japanese", label: studyText.mobileNavLabel, icon: Languages },
        { path: "/graph", label: t.nav.graph, icon: Network },
        { path: "/tracker", label: t.nav.mobileTrack, icon: BarChart2 },
      ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        height: "100vh",
        backgroundColor: "var(--bg)",
        backgroundImage: "var(--vibe-page-bg)",
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
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "default",
                userSelect: "none",
              }}
              title={isCreator ? "KAVAULT Creator Active" : "KAVAULT"}
            >
              <div
                style={{
                  width: "26px",
                  height: "26px",
                  backgroundColor: isCreator
                    ? "#f59e0b"
                    : studyPalette.accentHex,
                  color: isCreator ? "#000" : "#fff",
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

            {isCreator ? (
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
            ) : (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: "999px",
                  backgroundColor: studyPalette.softTint,
                  color: studyPalette.accentHex,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {studyPalette.flag}
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
                <Crown size={18} color="#f59e0b" /> {t.nav.admin}
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
                border: "1px solid rgba(234, 179, 8, 0.25)",
                backgroundColor: "rgba(234, 179, 8, 0.08)",
                color: "#eab308",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: "13px",
                transition: "all 0.15s ease",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Trophy size={16} /> {t.nav.achievements}
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

            {/* Карточка профиля / Личный кабинет */}
            <Link
              to="/profile"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 10px",
                textDecoration: "none",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/profile"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/profile"
                    ? "var(--surface-raised)"
                    : "rgba(255, 255, 255, 0.03)",
                border: "1px solid var(--border)",
                transition: "all 0.15s ease",
              }}
            >
              <UserAvatarBadge
                customization={profileCustom}
                size={34}
                username={nickname || "User"}
                showOnlineDot
              />
              <div style={{ flex: 1, minWidth: 0, textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {nickname || "Мой профиль"}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--accent, #3b82f6)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  Личный кабинет →
                </div>
              </div>
            </Link>

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
                  : studyPalette.accentHex,
                color: isCreator ? "#000" : "#ffffff",
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
            <span
              style={{
                fontSize: "11px",
                padding: "1px 6px",
                borderRadius: "999px",
                backgroundColor: "var(--vibe-soft)",
                border: "1px solid var(--vibe-banner-border)",
                color: "var(--vibe-accent)",
                fontWeight: 600,
              }}
              title={studyText.vibeBadge}
            >
              {studyPalette.flag}
            </span>
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
              title={t.nav.achievements}
            >
              <Trophy size={20} />
            </button>
            <Link
              to="/profile"
              style={{
                padding: "2px 4px",
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
              }}
              title="Личный кабинет"
            >
              <UserAvatarBadge
                customization={profileCustom}
                size={28}
                username={nickname || "User"}
              />
            </Link>

            <Link
              to="/settings"
              style={{
                padding: "8px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
              }}
              title={t.nav.settings}
            >
              <SettingsIcon size={20} />
            </Link>
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
            bottom: "calc(62px + env(safe-area-inset-bottom, 0px))",
            backgroundColor: "var(--overlay-bg)",
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
              boxShadow: "var(--tabbar-shadow)",
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
              {t.nav.allSections}
            </div>

            <Link
              to="/review"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/review"
                    ? "var(--vibe-accent)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/review"
                    ? "var(--vibe-soft)"
                    : "transparent",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 500,
              }}
            >
              <Sparkles size={18} color={studyPalette.accentHex} /> {studyText.section1.repeatBtn}
            </Link>

            {showProgramming && (
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
            )}

            <Link
              to="/thoughts"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/thoughts"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/thoughts"
                    ? "var(--surface-raised)"
                    : "transparent",
                textDecoration: "none",
                fontSize: "15px",
              }}
            >
              <PenLine size={18} /> {t.nav.thoughts}
            </Link>

            <Link
              to="/social"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/social"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/social"
                    ? "var(--surface-raised)"
                    : "transparent",
                textDecoration: "none",
                fontSize: "15px",
              }}
            >
              <Users size={18} /> {t.nav.social}
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

            {/* Личный кабинет в мобильном меню */}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                borderRadius: "var(--radius-md)",
                color:
                  location.pathname === "/profile"
                    ? "var(--text-primary)"
                    : "var(--text-secondary)",
                backgroundColor:
                  location.pathname === "/profile"
                    ? "var(--surface-raised)"
                    : "transparent",
                textDecoration: "none",
                fontSize: "15px",
                fontWeight: 600,
              }}
            >
              <UserAvatarBadge
                customization={profileCustom}
                size={24}
                username={nickname || "User"}
              />
              <span>Личный кабинет</span>
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
                <Crown size={18} color="#f59e0b" /> {t.nav.admin}
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
            height: "calc(62px + env(safe-area-inset-bottom, 0px))",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            paddingLeft: "6px",
            paddingRight: "6px",
            backgroundColor: "var(--tabbar-bg)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderTop: "1px solid var(--tabbar-border)",
            boxShadow: "var(--tabbar-shadow)",
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
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                  borderRadius: "10px",
                  textDecoration: "none",
                  fontSize: "11px",
                  fontWeight: isActive ? 600 : 500,
                  width: "19%",
                  height: "48px",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={20} />
                <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "100%" }}>
                  {tab.label}
                </span>
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
              color: mobileMenuOpen ? "var(--accent)" : "var(--text-secondary)",
              backgroundColor: mobileMenuOpen ? "var(--accent-soft)" : "transparent",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "11px",
              fontWeight: mobileMenuOpen ? 600 : 500,
              width: "19%",
              height: "48px",
              transition: "all 0.15s ease",
            }}
          >
            <Menu size={20} />
            <span>{t.nav.more}</span>
          </button>
        </nav>
      )}
    </div>
  );
}
