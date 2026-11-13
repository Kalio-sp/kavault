import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Sparkles,
  ShieldCheck,
  Crown,
  KeyRound,
  LogOut,
  User,
  Lock,
  Eye,
  EyeOff,
  Save,
  Trophy,
  Award,
  Image as ImageIcon,
  Check,
  ChevronRight,
  BookOpen,
  Code2,
  PenLine,
  Compass,
  Palette,
  Camera,
  Upload,
} from "lucide-react";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { UserAvatarBadge } from "../components/UserAvatarBadge";
import {
  AVATAR_PRESETS,
  AVATAR_FRAMES,
  BANNER_THEMES,
  PROFILE_TITLES,
  STATUS_PRESETS,
  MONOGRAM_COLORS,
  type UserProfileCustomization,
  loadProfileCustomization,
  saveProfileCustomization,
} from "../utils/profileCosmetics";

interface UserProfileCabinetProps {
  embeddedInSettings?: boolean;
}

interface SocialSummary {
  id: string;
  nickname: string;
  mmr: number;
  rankTier: {
    key: string;
    title: string;
    emoji: string;
    color: string;
    minMmr: number;
    nextMinMmr: number | null;
    progressPercent: number;
  };
  globalRank: number | null;
  friendsCount: number;
}

interface SystemStats {
  cardsCount: number;
  resourcesCount: number;
  notesCount: number;
}

export const UserProfileCabinet: React.FC<UserProfileCabinetProps> = ({
  embeddedInSettings: _embeddedInSettings = false,
}) => {
  const navigate = useNavigate();
  const {
    isCreator,
    userEmail,
    nickname,
    setLocalNickname,
  } = useApp();
  const { achievements, unlockedCount, totalCount, openModal } = useAchievements();

  // Вкладки Личного Кабинета
  const [cabinetTab, setCabinetTab] = useState<"overview" | "cosmetics" | "security">("overview");

  // Данные кастомизации
  const [customization, setCustomization] = useState<UserProfileCustomization>(() =>
    loadProfileCustomization(),
  );

  // Данные социального профиля и MMR
  const [socialData, setSocialData] = useState<SocialSummary | null>(null);
  const [stats, setStats] = useState<SystemStats>({
    cardsCount: 0,
    resourcesCount: 0,
    notesCount: 0,
  });
  const [_loadingStats, setLoadingStats] = useState(true);

  // Формы редактирования
  const [editNickname, setEditNickname] = useState(nickname || "");
  const [savingNick, setSavingNick] = useState(false);

  // Пароль
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Тосты уведомлений
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error" | "info">("success");

  // Реф для загрузки аватара и баннера
  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage(text);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  useEffect(() => {
    setEditNickname(nickname || "");
  }, [nickname]);

  // Загрузка статистики
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoadingStats(true);
      try {
        const [meRes, resRes, cardsRes, notesRes] = await Promise.allSettled([
          api.get("/social/me"),
          api.get("/resources"),
          api.get("/japanese"),
          api.get("/thoughts"),
        ]);

        if (!isMounted) return;

        if (meRes.status === "fulfilled" && meRes.value.data) {
          setSocialData(meRes.value.data);
          if (meRes.value.data.nickname && !nickname) {
            setEditNickname(meRes.value.data.nickname);
          }
        }

        const resources = resRes.status === "fulfilled" && Array.isArray(resRes.value.data) ? resRes.value.data.length : 0;
        const cards = cardsRes.status === "fulfilled" && Array.isArray(cardsRes.value.data) ? cardsRes.value.data.length : 0;
        const notes = notesRes.status === "fulfilled" && Array.isArray(notesRes.value.data) ? notesRes.value.data.length : 0;

        setStats({
          resourcesCount: resources,
          cardsCount: cards,
          notesCount: notes,
        });
      } catch (err) {
        console.error("Failed to load user cabinet data", err);
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    fetchData();

    // Слушатель внешних обновлений кастомизации
    const handleProfileUpdate = () => {
      setCustomization(loadProfileCustomization());
    };
    window.addEventListener("kavault_profile_updated", handleProfileUpdate);

    return () => {
      isMounted = false;
      window.removeEventListener("kavault_profile_updated", handleProfileUpdate);
    };
  }, []);

  // Сохранение кастомизации
  const handleSaveCosmetics = (updated?: Partial<UserProfileCustomization>) => {
    const nextCustom = {
      ...customization,
      ...(updated || {}),
    };
    setCustomization(nextCustom);
    saveProfileCustomization(nextCustom);
    showToast("✨ Стиль профиля успешно обновлен!");
  };

  // Загрузка кастомного аватара
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Пожалуйста, выберите файл изображения (PNG, JPG, WEBP)", "error");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      showToast("Размер изображения не должен превышать 3 МБ", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const nextCustom: UserProfileCustomization = {
        ...customization,
        avatarType: "custom",
        customAvatarUrl: base64,
      };
      setCustomization(nextCustom);
      saveProfileCustomization(nextCustom);
      showToast("📸 Новый аватар загружен и сохранен!");
    };
    reader.readAsDataURL(file);
  };

  // Загрузка кастомного баннера
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Пожалуйста, выберите файл изображения", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Размер фона не должен превышать 5 МБ", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const nextCustom: UserProfileCustomization = {
        ...customization,
        bannerThemeId: "custom",
        customBannerUrl: base64,
      };
      setCustomization(nextCustom);
      saveProfileCustomization(nextCustom);
      showToast("🖼️ Фоновая обложка обновлена!");
    };
    reader.readAsDataURL(file);
  };

  // Сохранение никнейма
  const handleSaveNickname = async () => {
    const clean = editNickname.trim();
    if (clean.length < 3 || clean.length > 24) {
      showToast("Никнейм должен быть от 3 до 24 символов", "error");
      return;
    }
    setSavingNick(true);
    try {
      const resp = await api.patch("/social/nickname", { nickname: clean });
      setLocalNickname(resp.data.nickname);
      localStorage.setItem("kavault_username", resp.data.nickname);
      showToast("✅ Никнейм успешно сохранен!");
    } catch (e: any) {
      const msg = e.response?.data?.message || "Ошибка при сохранении никнейма";
      showToast(msg, "error");
    } finally {
      setSavingNick(false);
    }
  };

  // Смена пароля
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Введите текущий пароль", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("Новый пароль должен быть не менее 6 символов", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Пароли не совпадают", "error");
      return;
    }
    try {
      setPasswordLoading(true);
      await api.patch("/auth/password", {
        currentPass: currentPassword,
        newPass: newPassword,
      });
      showToast("🔑 Пароль успешно изменен!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.response?.data?.message || "Неверный текущий пароль";
      showToast(msg, "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Выход
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("kavault_is_creator");
    navigate("/login");
  };

  // Активная тема баннера
  const activeBanner =
    BANNER_THEMES.find((b) => b.id === customization.bannerThemeId) ||
    BANNER_THEMES[0];

  const currentRankTier = socialData?.rankTier || {
    key: "novice",
    title: "Novice",
    emoji: "🌱",
    color: "#94a3b8",
    minMmr: 0,
    nextMinMmr: 150,
    progressPercent: Math.min(100, Math.round(((socialData?.mmr || 0) / 150) * 100)),
  };

  // Выбранные на витрину достижения
  const showcaseBadges = customization.showcaseAchievementIds
    .map((id) => achievements.find((a) => a.id === id))
    .filter((a): a is (typeof achievements)[number] => Boolean(a));

  const fallbackUnlockedBadges = achievements.filter((a) => a.unlocked).slice(0, 3);
  const displayShowcase = showcaseBadges.length > 0 ? showcaseBadges : fallbackUnlockedBadges;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            padding: "12px 18px",
            borderRadius: "12px",
            backgroundColor: "var(--surface-raised, #18181b)",
            border: `1px solid ${
              toastType === "error"
                ? "var(--error, #ef4444)"
                : toastType === "info"
                ? "var(--accent, #3b82f6)"
                : "var(--success, #10b981)"
            }`,
            color: "var(--text-primary, #ffffff)",
            fontSize: "13px",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 14px 30px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            animation: "fadeIn 0.2s ease",
          }}
        >
          {toastType === "error" ? (
            <ShieldCheck size={18} color="var(--error, #ef4444)" />
          ) : (
            <Sparkles size={18} color="var(--accent, #3b82f6)" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={avatarFileInputRef}
        onChange={handleAvatarFileUpload}
        accept="image/*"
        style={{ display: "none" }}
      />
      <input
        type="file"
        ref={bannerFileInputRef}
        onChange={handleBannerFileUpload}
        accept="image/*"
        style={{ display: "none" }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          ГЛАВНАЯ КАРТОЧКА ПРОФИЛЯ (HERO IDENTITY CARD)
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          borderRadius: "20px",
          overflow: "hidden",
          backgroundColor: "var(--surface, #121214)",
          border: "1px solid var(--border, rgba(255,255,255,0.08))",
          boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Баннер / Обложка профиля */}
        <div
          style={{
            height: "140px",
            width: "100%",
            position: "relative",
            background:
              customization.bannerThemeId === "custom" && customization.customBannerUrl
                ? `url(${customization.customBannerUrl}) center / cover no-repeat`
                : activeBanner.background,
            transition: "background 0.4s ease",
          }}
        >
          {/* Легкая декоративная сетка */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              opacity: 0.35,
              pointerEvents: "none",
            }}
          />

          {/* Быстрая кнопка смены обложки */}
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              onClick={() => {
                setCabinetTab("cosmetics");
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.55)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Palette size={14} />
              <span className="kv-tab-label-full">Оформить профиль</span>
              <span className="kv-tab-label-short">Стиль</span>
            </button>
          </div>
        </div>

        {/* Тело карточки: Аватарка + Никнейм + Статус + Звание */}
        <div
          style={{
            padding: "0 20px 20px 20px",
            position: "relative",
          }}
        >
          {/* Ряд с Аватаркой и экшенами */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginTop: "-44px",
              marginBottom: "14px",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            {/* Аватарка с кнопкой загрузки */}
            <div style={{ position: "relative" }}>
              <UserAvatarBadge
                customization={customization}
                size={88}
                username={nickname || "User"}
                showOnlineDot
                onClick={() => setCabinetTab("cosmetics")}
              />
              <button
                onClick={() => avatarFileInputRef.current?.click()}
                title="Загрузить свой аватар"
                style={{
                  position: "absolute",
                  bottom: "2px",
                  right: "2px",
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "var(--surface-raised, #27272a)",
                  border: "2px solid var(--surface, #121214)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                }}
              >
                <Camera size={13} />
              </button>
            </div>

            {/* Быстрые статусные бейджи */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {isCreator ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.18)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#f59e0b",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.05em",
                  }}
                >
                  <Crown size={14} />
                  <span>CREATOR / ROOT</span>
                </div>
              ) : (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "10px",
                    background: `${currentRankTier.color}22`,
                    border: `1px solid ${currentRankTier.color}55`,
                    color: currentRankTier.color,
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  <span>{currentRankTier.emoji}</span>
                  <span>{currentRankTier.title} League</span>
                </div>
              )}

              {/* Звание пользователя */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "10px",
                  background: "var(--surface-raised, rgba(255,255,255,0.06))",
                  border: "1px solid var(--border, rgba(255,255,255,0.1))",
                  color: "var(--text-primary, #ffffff)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                <Award size={13} color="var(--accent, #3b82f6)" />
                <span>{customization.title}</span>
              </div>
            </div>
          </div>

          {/* Имя, Никнейм, Статус и О себе */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", flexWrap: "wrap" }}>
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: "var(--text-primary, #ffffff)",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}
              >
                {nickname || "Анонимный Исследователь"}
              </h1>
              <span
                style={{
                  fontSize: "14px",
                  color: "var(--accent, #3b82f6)",
                  fontWeight: 600,
                }}
              >
                @{nickname ? nickname.toLowerCase() : "user"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted, #71717a)" }}>
                • {userEmail || "Гостевая сессия"}
              </span>
            </div>

            {/* Пузырь статуса настроения */}
            {customization.statusText && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))",
                  border: "1px solid var(--border, rgba(255,255,255,0.08))",
                  width: "fit-content",
                  maxWidth: "100%",
                  fontSize: "13px",
                  color: "var(--text-secondary, #d4d4d8)",
                }}
              >
                <span style={{ fontSize: "15px" }}>{customization.statusEmoji || "⚡"}</span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {customization.statusText}
                </span>
              </div>
            )}

            {/* Текст «О себе» */}
            {customization.bio && (
              <p
                style={{
                  fontSize: "13.5px",
                  lineHeight: "1.55",
                  color: "var(--text-secondary, #a1a1aa)",
                  margin: "4px 0 0 0",
                  maxWidth: "680px",
                }}
              >
                {customization.bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ТАБЫ УПРАВЛЕНИЯ ЛИЧНЫМ КАБИНЕТОМ
      ══════════════════════════════════════════════════════════════════ */}
      <div
        className="kv-tabs-bar"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          backgroundColor: "var(--surface, #121214)",
          padding: "5px",
          borderRadius: "14px",
          border: "1px solid var(--border, rgba(255,255,255,0.08))",
          gap: "4px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => setCabinetTab("overview")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 8px",
            borderRadius: "10px",
            border: "none",
            backgroundColor:
              cabinetTab === "overview"
                ? "var(--surface-raised, #27272a)"
                : "transparent",
            color:
              cabinetTab === "overview"
                ? "var(--text-primary, #ffffff)"
                : "var(--text-muted, #71717a)",
            fontWeight: cabinetTab === "overview" ? 700 : 500,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            minWidth: 0,
          }}
        >
          <Compass size={16} color={cabinetTab === "overview" ? "var(--accent, #3b82f6)" : undefined} />
          <span className="kv-tab-label-full">Паспорт и Статистика</span>
          <span className="kv-tab-label-short">Паспорт</span>
        </button>

        <button
          onClick={() => setCabinetTab("cosmetics")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 8px",
            borderRadius: "10px",
            border: "none",
            backgroundColor:
              cabinetTab === "cosmetics"
                ? "var(--surface-raised, #27272a)"
                : "transparent",
            color:
              cabinetTab === "cosmetics"
                ? "var(--text-primary, #ffffff)"
                : "var(--text-muted, #71717a)",
            fontWeight: cabinetTab === "cosmetics" ? 700 : 500,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            minWidth: 0,
          }}
        >
          <Palette size={16} color={cabinetTab === "cosmetics" ? "#ec4899" : undefined} />
          <span className="kv-tab-label-full">Кастомизация и Стиль</span>
          <span className="kv-tab-label-short">Украшения</span>
        </button>

        <button
          onClick={() => setCabinetTab("security")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 8px",
            borderRadius: "10px",
            border: "none",
            backgroundColor:
              cabinetTab === "security"
                ? "var(--surface-raised, #27272a)"
                : "transparent",
            color:
              cabinetTab === "security"
                ? "var(--text-primary, #ffffff)"
                : "var(--text-muted, #71717a)",
            fontWeight: cabinetTab === "security" ? 700 : 500,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.15s ease",
            minWidth: 0,
          }}
        >
          <ShieldCheck size={16} color={cabinetTab === "security" ? "#10b981" : undefined} />
          <span className="kv-tab-label-full">Безопасность и Вход</span>
          <span className="kv-tab-label-short">Защита</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          СЕКЦИЯ 1: ОБЗОР, РАНГ И СТАТИСТИКА
      ══════════════════════════════════════════════════════════════════ */}
      {cabinetTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
          {/* Карточка Task MMR и Лиги */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: `1px solid ${currentRankTier.color}44`,
              background: `linear-gradient(135deg, ${currentRankTier.color}15 0%, var(--surface, #121214) 70%)`,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "32px", lineHeight: 1 }}>{currentRankTier.emoji}</span>
                <div>
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: currentRankTier.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Текущая Лига Task-System
                  </div>
                  <div
                    style={{
                      fontSize: "18px",
                      fontWeight: 800,
                      color: "var(--text-primary, #ffffff)",
                    }}
                  >
                    {currentRankTier.title} League
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "22px", fontWeight: 800, color: currentRankTier.color }}>
                  {socialData?.mmr ?? 0} <span style={{ fontSize: "13px", fontWeight: 600 }}>MMR</span>
                </div>
                {socialData?.globalRank ? (
                  <div style={{ fontSize: "12px", color: "var(--text-muted, #71717a)" }}>
                    Ранг в топе: #{socialData.globalRank}
                  </div>
                ) : (
                  <div style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 600 }}>
                    Системный аккаунт
                  </div>
                )}
              </div>
            </div>

            {/* Прогресс-бар до следующей лиги */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  color: "var(--text-muted, #71717a)",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                <span>Прогресс дивизиона</span>
                <span>
                  {currentRankTier.nextMinMmr
                    ? `${socialData?.mmr ?? 0} / ${currentRankTier.nextMinMmr} MMR (${currentRankTier.progressPercent}%)`
                    : "Высший легендарный ранг достигнут! 👑"}
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, Math.max(5, currentRankTier.progressPercent))}%`,
                    backgroundColor: currentRankTier.color,
                    boxShadow: `0 0 10px ${currentRankTier.color}`,
                    borderRadius: "999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Link
                to="/social"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: currentRankTier.color,
                  textDecoration: "none",
                }}
              >
                <span>Таблица лидеров и друзья</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Сетка ключевых показателей (Stats Grid) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: "12px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* Карточки SRS */}
            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#3b82f6" }}>
                <BookOpen size={16} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Слов на SRS
                </span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats.cardsCount}
              </div>
              <Link
                to="/japanese"
                style={{ fontSize: "11px", color: "var(--accent, #3b82f6)", textDecoration: "none" }}
              >
                Повторить слова →
              </Link>
            </div>

            {/* Материалы Dev */}
            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#10b981" }}>
                <Code2 size={16} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Ресурсов Dev
                </span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats.resourcesCount}
              </div>
              <Link
                to="/developer"
                style={{ fontSize: "11px", color: "#10b981", textDecoration: "none" }}
              >
                База знаний →
              </Link>
            </div>

            {/* Заметки Мыслей */}
            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#a855f7" }}>
                <PenLine size={16} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Заметок
                </span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats.notesCount}
              </div>
              <Link
                to="/thoughts"
                style={{ fontSize: "11px", color: "#a855f7", textDecoration: "none" }}
              >
                Открыть Thoughts →
              </Link>
            </div>

            {/* Достижения */}
            <div
              style={{
                padding: "14px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "6px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#f59e0b" }}>
                <Trophy size={16} />
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Достижений
                </span>
              </div>
              <div style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>
                {unlockedCount} <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>/ {totalCount}</span>
              </div>
              <button
                onClick={openModal}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  fontSize: "11px",
                  color: "#f59e0b",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                Все награды →
              </button>
            </div>
          </div>

          {/* Витрина лучших наград (Showcase) */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text-primary, #ffffff)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Trophy size={17} color="#f59e0b" />
                  <span>Витрина Достижений</span>
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted, #71717a)",
                    margin: "2px 0 0 0",
                  }}
                >
                  Главные знаки отличия вашего профиля
                </p>
              </div>

              <button
                onClick={() => setCabinetTab("cosmetics")}
                style={{
                  background: "transparent",
                  border: "1px solid var(--border, rgba(255,255,255,0.15))",
                  color: "var(--text-primary, #ffffff)",
                  padding: "5px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Настроить витрину
              </button>
            </div>

            {displayShowcase.length === 0 ? (
              <div
                style={{
                  padding: "24px",
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: "13px",
                  borderRadius: "12px",
                  border: "1px dashed var(--border)",
                }}
              >
                Пока нет открытых достижений для показа. Изучайте карточки и сохраняйте статьи, чтобы открыть первые медали!
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                {displayShowcase.map((ach) => (
                  <div
                    key={ach.id}
                    style={{
                      padding: "14px",
                      borderRadius: "12px",
                      backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))",
                      border: "1px solid rgba(245, 158, 11, 0.25)",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "10px",
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "22px",
                        flexShrink: 0,
                      }}
                    >
                      {ach.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "var(--text-primary, #ffffff)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {ach.title}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted, #a1a1aa)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          marginTop: "2px",
                        }}
                      >
                        {ach.description}
                      </div>
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#f59e0b",
                        backgroundColor: "rgba(245, 158, 11, 0.12)",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                    >
                      +{ach.points}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          СЕКЦИЯ 2: КАСТОМИЗАЦИЯ И СТИЛЬ (COSMETICS STUDIO)
      ══════════════════════════════════════════════════════════════════ */}
      {cabinetTab === "cosmetics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", width: "100%" }}>
          {/* Интерактивный предпросмотр аватара и рамки */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <UserAvatarBadge
                customization={customization}
                size={76}
                username={nickname || "User"}
                showOnlineDot
              />
              <div>
                <div style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 700 }}>
                  Живой предпросмотр
                </div>
                <div style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {nickname || "Аноним"} • {customization.title}
                </div>
                <div style={{ fontSize: "12px", color: "var(--accent, #3b82f6)", marginTop: "2px" }}>
                  {customization.statusEmoji} {customization.statusText}
                </div>
              </div>
            </div>

            <Button onClick={() => handleSaveCosmetics()} className="kv-action-btn">
              <Save size={15} /> Сохранить изменения
            </Button>
          </div>

          {/* 1. ВЫБОР АВАТАРА */}
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  1. Стиль Аватара
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Выберите готового героя, монограмму или загрузите собственное фото
                </p>
              </div>

              {/* Переключатель режима аватара */}
              <div
                style={{
                  display: "inline-flex",
                  padding: "3px",
                  borderRadius: "10px",
                  backgroundColor: "var(--surface-raised, rgba(255,255,255,0.05))",
                }}
              >
                <button
                  onClick={() => handleSaveCosmetics({ avatarType: "preset" })}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: customization.avatarType === "preset" ? "var(--accent, #3b82f6)" : "transparent",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Пресеты героев
                </button>
                <button
                  onClick={() => avatarFileInputRef.current?.click()}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: customization.avatarType === "custom" ? "var(--accent, #3b82f6)" : "transparent",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Upload size={13} />
                  <span>Своё фото</span>
                </button>
                <button
                  onClick={() => handleSaveCosmetics({ avatarType: "monogram" })}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: customization.avatarType === "monogram" ? "var(--accent, #3b82f6)" : "transparent",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Инициалы
                </button>
              </div>
            </div>

            {/* Сетка пресетов аватарок (16 персонажей) */}
            {customization.avatarType === "preset" && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                  gap: "10px",
                  maxHeight: "340px",
                  overflowY: "auto",
                  padding: "4px",
                }}
              >
                {AVATAR_PRESETS.map((preset) => {
                  const isSelected =
                    customization.avatarType === "preset" &&
                    customization.avatarPresetId === preset.id;
                  return (
                    <div
                      key={preset.id}
                      onClick={() =>
                        handleSaveCosmetics({
                          avatarType: "preset",
                          avatarPresetId: preset.id,
                        })
                      }
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        backgroundColor: isSelected
                          ? "rgba(59, 130, 246, 0.15)"
                          : "var(--surface-raised, rgba(255,255,255,0.04))",
                        border: isSelected
                          ? "2px solid var(--accent, #3b82f6)"
                          : "1px solid var(--border, rgba(255,255,255,0.06))",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "6px",
                        transition: "all 0.15s ease",
                        textAlign: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "50%",
                          background: preset.gradient,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "24px",
                          boxShadow: isSelected ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none",
                        }}
                      >
                        {preset.emoji}
                      </div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {preset.name}
                      </div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "var(--text-muted)",
                          padding: "1px 6px",
                          borderRadius: "4px",
                          backgroundColor: "rgba(255,255,255,0.06)",
                        }}
                      >
                        {preset.tag}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Режим Монограммы (выбор цвета) */}
            {customization.avatarType === "monogram" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", padding: "10px 0" }}>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Выберите оттенок фона инициала ({nickname ? nickname.charAt(0).toUpperCase() : "U"}):
                </span>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {MONOGRAM_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleSaveCosmetics({ monogramColor: color })}
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        border:
                          customization.monogramColor === color
                            ? "3px solid #ffffff"
                            : "2px solid rgba(255,255,255,0.2)",
                        cursor: "pointer",
                        boxShadow:
                          customization.monogramColor === color
                            ? `0 0 12px ${color}`
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Режим своего фото */}
            {customization.avatarType === "custom" && customization.customAvatarUrl && (
              <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0" }}>
                <img
                  src={customization.customAvatarUrl}
                  alt="Custom"
                  style={{ width: "56px", height: "56px", borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    Пользовательское фото установлено
                  </div>
                  <button
                    onClick={() => avatarFileInputRef.current?.click()}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--accent, #3b82f6)",
                      fontSize: "12px",
                      cursor: "pointer",
                      padding: 0,
                      marginTop: "4px",
                    }}
                  >
                    Загрузить другое фото →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. РАМКИ И СВЕЧЕНИЕ АВАТАРА */}
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                2. Рамка и Неоновая Аура (Avatar Frame)
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Специальные световые контуры для выделения вашего аватара в системе
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                gap: "10px",
              }}
            >
              {AVATAR_FRAMES.map((frame) => {
                const isSelected = customization.avatarFrameId === frame.id;
                return (
                  <div
                    key={frame.id}
                    onClick={() => handleSaveCosmetics({ avatarFrameId: frame.id })}
                    style={{
                      padding: "12px 10px",
                      borderRadius: "12px",
                      backgroundColor: isSelected
                        ? "rgba(59, 130, 246, 0.15)"
                        : "var(--surface-raised, rgba(255,255,255,0.04))",
                      border: isSelected
                        ? `2px solid ${frame.accentColor}`
                        : "1px solid var(--border, rgba(255,255,255,0.06))",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                      textAlign: "center",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {/* Мини-превью рамки */}
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "50%",
                        backgroundColor: "#18181b",
                        border: frame.border,
                        boxShadow: frame.boxShadow,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "18px",
                      }}
                    >
                      ✨
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {frame.name}
                      </div>
                      <div style={{ fontSize: "10px", color: frame.accentColor, fontWeight: 600 }}>
                        {frame.tag}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. ОБЛОЖКА ПРОФИЛЯ (БАННЕР) */}
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  3. Тема Обложки (Profile Banner)
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Кинематографичные градиенты или загрузка собственной фоновой иллюстрации
                </p>
              </div>

              <button
                onClick={() => bannerFileInputRef.current?.click()}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  backgroundColor: "var(--surface-raised, #27272a)",
                  border: "1px solid var(--border, rgba(255,255,255,0.1))",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <ImageIcon size={14} />
                <span>Загрузить фон</span>
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
                gap: "10px",
              }}
            >
              {BANNER_THEMES.map((theme) => {
                const isSelected = customization.bannerThemeId === theme.id;
                return (
                  <div
                    key={theme.id}
                    onClick={() => handleSaveCosmetics({ bannerThemeId: theme.id })}
                    style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      border: isSelected
                        ? `2px solid ${theme.accentColor}`
                        : "1px solid var(--border, rgba(255,255,255,0.08))",
                      cursor: "pointer",
                      boxShadow: isSelected ? `0 0 12px ${theme.accentColor}55` : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div style={{ height: "46px", background: theme.background }} />
                    <div style={{ padding: "8px", backgroundColor: "var(--surface-raised, #18181b)" }}>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {theme.name}
                      </div>
                      <div style={{ fontSize: "10px", color: theme.accentColor }}>{theme.tag}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. ЗВАНИЕ, СТАТУС И БИОГРАФИЯ */}
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div>
              <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                4. Звание, Статус и «О себе»
              </h3>
              <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                Персонализируйте то, как вас видят другие участники KaVault
              </p>
            </div>

            {/* Выбор титула */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                Титул профиля (Звание)
              </label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                {PROFILE_TITLES.slice(0, 6).map((title) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => handleSaveCosmetics({ title })}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      backgroundColor:
                        customization.title === title
                          ? "rgba(59, 130, 246, 0.2)"
                          : "var(--surface-raised, rgba(255,255,255,0.04))",
                      border:
                        customization.title === title
                          ? "1px solid var(--accent, #3b82f6)"
                          : "1px solid var(--border, rgba(255,255,255,0.06))",
                      color: customization.title === title ? "var(--accent, #3b82f6)" : "var(--text-secondary)",
                      fontSize: "12px",
                      cursor: "pointer",
                      fontWeight: customization.title === title ? 700 : 500,
                    }}
                  >
                    {title}
                  </button>
                ))}
              </div>
              <Input
                value={customization.title}
                onChange={(e) => setCustomization({ ...customization, title: e.target.value })}
                placeholder="Или введите свой титул..."
              />
            </div>

            {/* Статус настроения */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                Статус дня (Mood / Focus)
              </label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                {STATUS_PRESETS.slice(0, 5).map((sp) => (
                  <button
                    key={sp.text}
                    type="button"
                    onClick={() => handleSaveCosmetics({ statusEmoji: sp.emoji, statusText: sp.text })}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "8px",
                      backgroundColor:
                        customization.statusText === sp.text
                          ? "rgba(16, 185, 129, 0.2)"
                          : "var(--surface-raised, rgba(255,255,255,0.04))",
                      border:
                        customization.statusText === sp.text
                          ? "1px solid #10b981"
                          : "1px solid var(--border, rgba(255,255,255,0.06))",
                      color: customization.statusText === sp.text ? "#10b981" : "var(--text-secondary)",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {sp.emoji} {sp.text}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  value={customization.statusEmoji}
                  onChange={(e) => setCustomization({ ...customization, statusEmoji: e.target.value })}
                  style={{
                    width: "48px",
                    padding: "8px",
                    textAlign: "center",
                    fontSize: "16px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface-raised, #18181b)",
                    border: "1px solid var(--border, rgba(255,255,255,0.1))",
                    color: "var(--text-primary)",
                  }}
                  maxLength={2}
                />
                <div style={{ flex: 1 }}>
                  <Input
                    value={customization.statusText}
                    onChange={(e) => setCustomization({ ...customization, statusText: e.target.value })}
                    placeholder="Например: В потоке кодинга..."
                  />
                </div>
              </div>
            </div>

            {/* «О себе» (Bio) */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                О себе (Bio)
              </label>
              <textarea
                value={customization.bio}
                onChange={(e) => setCustomization({ ...customization, bio: e.target.value })}
                rows={3}
                maxLength={280}
                placeholder="Расскажите о своих целях, стеке разработки или любимых темах..."
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  backgroundColor: "var(--surface-raised, #18181b)",
                  border: "1px solid var(--border, rgba(255,255,255,0.1))",
                  color: "var(--text-primary, #ffffff)",
                  fontSize: "13px",
                  fontFamily: "inherit",
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* 5. ВЫБОР ДОСТИЖЕНИЙ НА ВИТРИНУ */}
            <div>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>
                Закрепить до 3 наград на витрине профиля:
              </label>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: "8px",
                  maxHeight: "200px",
                  overflowY: "auto",
                }}
              >
                {achievements
                  .filter((a) => a.unlocked)
                  .map((ach) => {
                    const isPinned = customization.showcaseAchievementIds.includes(ach.id);
                    return (
                      <div
                        key={ach.id}
                        onClick={() => {
                          let nextIds = [...customization.showcaseAchievementIds];
                          if (isPinned) {
                            nextIds = nextIds.filter((id) => id !== ach.id);
                          } else {
                            if (nextIds.length >= 3) {
                              nextIds.shift(); // заменяем самый старый
                            }
                            nextIds.push(ach.id);
                          }
                          handleSaveCosmetics({ showcaseAchievementIds: nextIds });
                        }}
                        style={{
                          padding: "8px 10px",
                          borderRadius: "10px",
                          backgroundColor: isPinned
                            ? "rgba(245, 158, 11, 0.15)"
                            : "var(--surface-raised, rgba(255,255,255,0.04))",
                          border: isPinned
                            ? "1px solid #f59e0b"
                            : "1px solid var(--border, rgba(255,255,255,0.06))",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "12px",
                        }}
                      >
                        <span style={{ fontSize: "16px" }}>{ach.icon}</span>
                        <span
                          style={{
                            flex: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            color: isPinned ? "#f59e0b" : "var(--text-primary)",
                            fontWeight: isPinned ? 700 : 500,
                          }}
                        >
                          {ach.title}
                        </span>
                        {isPinned && <Check size={14} color="#f59e0b" />}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
              <Button onClick={() => handleSaveCosmetics()} className="kv-action-btn">
                <Save size={15} /> Сохранить весь стиль
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          СЕКЦИЯ 3: БЕЗОПАСНОСТЬ И УЧЕТНАЯ ЗАПИСЬ
      ══════════════════════════════════════════════════════════════════ */}
      {cabinetTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
          {/* Смена ника */}
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent, #3b82f6)",
                }}
              >
                <User size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Отображаемый никнейм (@handle)
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Ваш уникальный идентификатор в таблице лидеров и списках друзей
                </p>
              </div>
            </div>

            <div className="kv-field-row" style={{ marginTop: "4px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Input
                  icon={<User size={16} />}
                  value={editNickname}
                  onChange={(e) => setEditNickname(e.target.value)}
                  placeholder="От 3 до 24 символов..."
                />
              </div>
              <Button onClick={handleSaveNickname} disabled={savingNick} className="kv-action-btn">
                {savingNick ? "Сохранение..." : "Сохранить ник"}
              </Button>
            </div>
          </div>

          {/* Смена пароля */}
          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                }}
              >
                <KeyRound size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Безопасность и смена пароля
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Регулярно обновляйте пароль для надежной защиты ваших данных
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                  Текущий пароль
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  icon={<Lock size={16} />}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="kv-grid-1-2">
                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Новый пароль
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    icon={<Lock size={16} />}
                    placeholder="От 6 символов"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
                    Повторите новый пароль
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    icon={<Lock size={16} />}
                    placeholder="Подтверждение"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  <span>{showPassword ? "Скрыть символы" : "Показать символы"}</span>
                </button>

                <Button type="submit" disabled={passwordLoading} className="kv-action-btn">
                  {passwordLoading ? "Обновление..." : "🔑 Обновить пароль"}
                </Button>
              </div>
            </form>
          </div>

          {/* Завершение сессии */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "16px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                Выход из аккаунта
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Завершить авторизованную сессию на этом устройстве
              </div>
            </div>

            <Button variant="secondary" onClick={handleLogout} className="kv-action-btn" style={{ color: "var(--text-primary)" }}>
              <LogOut size={15} /> Выйти из сессии
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
