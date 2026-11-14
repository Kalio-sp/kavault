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
  TrendingUp,
  Palette,
  X,
  ChevronRight,
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
            flexShrink: 0,
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

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Link
              to="/social"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 11px",
                borderRadius: "999px",
                backgroundColor: "rgba(59, 130, 246, 0.12)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "#60a5fa",
                textDecoration: "none",
                fontSize: "12px",
                fontWeight: 700,
                transition: "all 0.15s ease",
              }}
              title="Рейтинг и Таблица лидеров"
            >
              <TrendingUp size={14} />
              <span>Рейтинг</span>
            </Link>

            <Link
              to="/settings"
              style={{
                padding: "7px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                borderRadius: "8px",
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
          overflowX: "hidden",
          height: "100%",
          WebkitOverflowScrolling: "touch",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          key={location.pathname}
          className="kv-page-enter"
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            width: "100%",
            overflowX: "hidden",
            boxSizing: "border-box",
          }}
        >
          {children}
        </div>
      </main>

      {/* ── МОБИЛЬНОЕ ВСПЛЫВАЮЩЕЕ МЕНЮ (ШТОРКА "ЕЩЁ") ── */}
      {isMobile && mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            animation: "kavaultFadeIn 0.2s ease-out",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "var(--surface, #121214)",
              backgroundImage:
                "linear-gradient(180deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              borderTopLeftRadius: "24px",
              borderTopRightRadius: "24px",
              padding: "16px 16px calc(24px + env(safe-area-inset-bottom, 16px)) 16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              boxShadow: "0 -10px 40px rgba(0, 0, 0, 0.6)",
              maxHeight: "82vh",
              overflowY: "auto",
              animation: "kavaultScaleIn 0.25s ease-out",
            }}
          >
            {/* Индикатор для свайпа (Drag handle) */}
            <div
              style={{
                width: "40px",
                height: "4px",
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.25)",
                margin: "0 auto 4px auto",
              }}
            />

            {/* Заголовок шторки и кнопка закрытия */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 2px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                {t.nav.allSections}
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                aria-label="Закрыть"
              >
                <X size={15} />
              </button>
            </div>

            {/* Карточка профиля / быстрый вход в Личный кабинет */}
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 14px",
                borderRadius: "16px",
                backgroundColor:
                  location.pathname === "/profile"
                    ? "var(--vibe-soft, rgba(59, 130, 246, 0.15))"
                    : "rgba(255, 255, 255, 0.04)",
                border:
                  location.pathname === "/profile"
                    ? "1px solid var(--accent, #3b82f6)"
                    : "1px solid rgba(255, 255, 255, 0.08)",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              <UserAvatarBadge
                customization={profileCustom}
                size={38}
                username={nickname || "User"}
                showOnlineDot
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {nickname || "Мой профиль"}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--accent, #3b82f6)",
                    fontWeight: 600,
                  }}
                >
                  Личный кабинет и аватар →
                </div>
              </div>
            </Link>

            {/* Вертикальный список разделов KAVAULT (в 1 колонку для комфортного скролла вниз) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              {/* Повторение */}
              <Link
                to="/review"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  backgroundColor:
                    location.pathname === "/review"
                      ? "var(--vibe-soft)"
                      : "rgba(255, 255, 255, 0.03)",
                  border:
                    location.pathname === "/review"
                      ? "1px solid var(--vibe-banner-border)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(236, 72, 153, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={18} color={studyPalette.accentHex} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      Повторение лексики
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Интервалы SRS & карточки
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
              </Link>

              {/* Зал наград */}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openModal();
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(234, 179, 8, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Trophy size={18} color="#eab308" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      Зал наград
                    </div>
                    <div style={{ fontSize: "11px", color: "#eab308", fontWeight: 600 }}>
                      {unlockedCount}/{totalCount} открыто
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
              </button>

              {/* Сообщество & Рейтинг */}
              <Link
                to="/social"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  backgroundColor:
                    location.pathname === "/social"
                      ? "rgba(59, 130, 246, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                  border:
                    location.pathname === "/social"
                      ? "1px solid rgba(59, 130, 246, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(59, 130, 246, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Users size={18} color="#60a5fa" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {t.nav.social}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Друзья, активность & MMR
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
              </Link>

              {/* Мысли & Заметки */}
              <Link
                to="/thoughts"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  backgroundColor:
                    location.pathname === "/thoughts"
                      ? "rgba(168, 85, 247, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                  border:
                    location.pathname === "/thoughts"
                      ? "1px solid rgba(168, 85, 247, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(168, 85, 247, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <PenLine size={18} color="#c084fc" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {t.nav.thoughts}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Заметки, идеи и дневник
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
              </Link>

              {/* Граф знаний */}
              <Link
                to="/graph"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  backgroundColor:
                    location.pathname === "/graph"
                      ? "rgba(16, 185, 129, 0.15)"
                      : "rgba(255, 255, 255, 0.03)",
                  border:
                    location.pathname === "/graph"
                      ? "1px solid rgba(16, 185, 129, 0.3)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(16, 185, 129, 0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Network size={18} color="#34d399" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {t.nav.graph}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Интерактивная карта связей
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
              </Link>

              {/* GitHub Проекты (если включено программирование) */}
              {showProgramming && (
                <Link
                  to="/github"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    borderRadius: "14px",
                    backgroundColor:
                      location.pathname === "/github"
                        ? "rgba(6, 182, 212, 0.15)"
                        : "rgba(255, 255, 255, 0.03)",
                    border:
                      location.pathname === "/github"
                        ? "1px solid rgba(6, 182, 212, 0.3)"
                        : "1px solid rgba(255, 255, 255, 0.06)",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(6, 182, 212, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <GitBranch size={18} color="#22d3ee" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {t.nav.github}
                      </div>
                      <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        Репозитории & активность
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
                </Link>
              )}

              {/* Настройки */}
              <Link
                to="/settings"
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  backgroundColor:
                    location.pathname === "/settings"
                      ? "var(--surface-raised)"
                      : "rgba(255, 255, 255, 0.03)",
                  border:
                    location.pathname === "/settings"
                      ? "1px solid var(--border)"
                      : "1px solid rgba(255, 255, 255, 0.06)",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(255, 255, 255, 0.07)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <SettingsIcon size={18} color="var(--text-secondary)" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13.5px",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                      }}
                    >
                      {t.nav.settings}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Темы оформления & аккаунт
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
              </Link>

              {/* Панель Создателя (если Root) ИЛИ Стиль & Оформление */}
              {isCreator ? (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    borderRadius: "14px",
                    backgroundColor:
                      location.pathname === "/admin"
                        ? "rgba(245, 158, 11, 0.22)"
                        : "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    boxShadow: "0 0 14px rgba(245, 158, 11, 0.12)",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(245, 158, 11, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Crown size={18} color="#f59e0b" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 800,
                          color: "#fbbf24",
                        }}
                      >
                        Панель Создателя
                      </div>
                      <div style={{ fontSize: "11px", color: "#f59e0b", opacity: 0.9 }}>
                        Root управление & аналитика
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="#fbbf24" style={{ flexShrink: 0, opacity: 0.8 }} />
                </Link>
              ) : (
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "11px 14px",
                    borderRadius: "14px",
                    backgroundColor:
                      location.pathname === "/profile"
                        ? "rgba(236, 72, 153, 0.2)"
                        : "rgba(236, 72, 153, 0.08)",
                    border: "1px solid rgba(236, 72, 153, 0.25)",
                    textDecoration: "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(236, 72, 153, 0.18)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Palette size={18} color="#f472b6" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        Стиль & Оформление
                      </div>
                      <div style={{ fontSize: "11px", color: "#f472b6" }}>
                        Рамки, темы и баннеры
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0, opacity: 0.6 }} />
                </Link>
              )}
            </div>

            {/* Подвал шторки меню с версией платформы */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "8px 0 2px 0",
                color: "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.02em",
                opacity: 0.75,
              }}
            >
              <span>⚡ KaVault Engine v2.4</span>
              <span>•</span>
              <span>Web & Mobile</span>
            </div>
          </div>
        </div>
      )}

      {/* ── МОБИЛЬНЫЙ НИЖНИЙ НАВИГАЦИОННЫЙ ТАБ-БАР (iOS Safe Area) ── */}
      {isMobile && (
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            height: "calc(62px + env(safe-area-inset-bottom, 0px))",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            backgroundColor: "var(--tabbar-bg, rgba(18, 18, 20, 0.95))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderTop: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            zIndex: 45,
            boxSizing: "border-box",
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
                  gap: "2px",
                  color: isActive ? "var(--accent)" : "var(--text-secondary)",
                  backgroundColor: isActive ? "var(--accent-soft)" : "transparent",
                  borderRadius: "12px",
                  padding: "6px 12px",
                  textDecoration: "none",
                  minWidth: "56px",
                  transition: "all 0.15s ease",
                }}
              >
                <Icon size={20} />
                <span style={{ fontSize: "10px", fontWeight: isActive ? 700 : 500 }}>
                  {tab.label}
                </span>
              </Link>
            );
          })}

          {/* Кнопка открытия шторки "Ещё" */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2px",
              color: mobileMenuOpen ? "var(--accent)" : "var(--text-secondary)",
              backgroundColor: mobileMenuOpen ? "var(--accent-soft)" : "transparent",
              borderRadius: "12px",
              padding: "6px 12px",
              border: "none",
              cursor: "pointer",
              minWidth: "56px",
              transition: "all 0.15s ease",
            }}
          >
            <Menu size={20} />
            <span style={{ fontSize: "10px", fontWeight: mobileMenuOpen ? 700 : 500 }}>
              {t.nav.more}
            </span>
          </button>
        </nav>
      )}
    </div>
  );
}
