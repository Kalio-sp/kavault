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
  Image as ImageIcon,
  ChevronRight,
  BookOpen,
  Code2,
  PenLine,
  Compass,
  Palette,
  Camera,
  Upload,
  Dices,
  Film,
  Link2,
  Trash2,
  Check,
} from "lucide-react";
import { api } from "../api/axios";
import { useApp, syncNicknameEverywhere } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { confirmModal } from "../context/DialogContext";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { UserAvatarBadge } from "../components/UserAvatarBadge";
import { BannerRenderer } from "../components/BannerRenderer";
import {
  AVATAR_PRESETS,
  AVATAR_FRAMES,
  BANNER_THEMES,
  type UserProfileCustomization,
  loadProfileCustomization,
  saveProfileCustomization,
  syncProfileFromServer,
  getRandomCosmetics,
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
    language,
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

  // Выбор подраздела кастомизации: Аватар | Рамка | Баннер
  const [cosmeticsSubTab, setCosmeticsSubTab] = useState<"avatar" | "frame" | "banner">("avatar");
  const [avatarTabMode, setAvatarTabMode] = useState<"presets" | "custom">("presets");
  const [bannerTabMode, setBannerTabMode] = useState<"presets" | "custom">("presets");
  const [bannerFilter, setBannerFilter] = useState<string>("all");
  const [frameFilter, setFrameFilter] = useState<string>("all");
  const [avatarFilter, setAvatarFilter] = useState<string>("all");
  const [bannerUrlInput, setBannerUrlInput] = useState("");
  const [avatarUrlInput, setAvatarUrlInput] = useState("");

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
          if (meRes.value.data.nickname) {
            setEditNickname(meRes.value.data.nickname);
            setLocalNickname(meRes.value.data.nickname);
            syncNicknameEverywhere(meRes.value.data.nickname);
          }
          if (meRes.value.data.profileCustomization) {
            const synced = syncProfileFromServer(meRes.value.data.profileCustomization);
            setCustomization(synced);
          }
        }

        const resources =
          resRes.status === "fulfilled" && Array.isArray(resRes.value.data)
            ? resRes.value.data.length
            : 0;
        const cards =
          cardsRes.status === "fulfilled" && Array.isArray(cardsRes.value.data)
            ? cardsRes.value.data.length
            : 0;
        const notes =
          notesRes.status === "fulfilled" && Array.isArray(notesRes.value.data)
            ? notesRes.value.data.length
            : 0;

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

  // Загрузка кастомного аватара (поддерживает PNG, JPG, WebP и анимированные GIF до 15 МБ)
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Пожалуйста, выберите файл изображения или GIF", "error");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      showToast("Размер файла не должен превышать 15 МБ", "error");
      return;
    }

    const isGif = file.type === "image/gif";

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;

      // Для GIF сохраняем исходный поток данных без конвертации
      if (isGif) {
        const nextCustom: UserProfileCustomization = {
          ...customization,
          avatarType: "custom",
          customAvatarUrl: rawUrl,
        };
        setCustomization(nextCustom);
        saveProfileCustomization(nextCustom);
        showToast("✨ Анимированный GIF-аватар установлен!");
        return;
      }

      // Для статичных фото оптимизируем размер для быстрой загрузки
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 384;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            const ratio = Math.min(maxDim / w, maxDim / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, w, h);
            const optimized = canvas.toDataURL("image/webp", 0.92);
            const nextCustom: UserProfileCustomization = {
              ...customization,
              avatarType: "custom",
              customAvatarUrl: optimized.length < rawUrl.length ? optimized : rawUrl,
            };
            setCustomization(nextCustom);
            saveProfileCustomization(nextCustom);
            showToast("📸 Фото-аватар оптимизирован и установлен!");
            return;
          }
        } catch {}
        const nextCustom: UserProfileCustomization = {
          ...customization,
          avatarType: "custom",
          customAvatarUrl: rawUrl,
        };
        setCustomization(nextCustom);
        saveProfileCustomization(nextCustom);
        showToast("📸 Новый аватар загружен и сохранен!");
      };
      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  // Установка аватара по прямой ссылке (GIF / WebP / PNG / Giphy / Tenor / Discord)
  const handleApplyAvatarUrl = () => {
    const trimmed = avatarUrlInput.trim();
    if (!trimmed) {
      showToast("Вставьте ссылку на картинку или GIF", "info");
      return;
    }
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      showToast("Ссылка должна начинаться с https://", "error");
      return;
    }
    const nextCustom: UserProfileCustomization = {
      ...customization,
      avatarType: "custom",
      customAvatarUrl: trimmed,
    };
    setCustomization(nextCustom);
    saveProfileCustomization(nextCustom);
    setAvatarUrlInput("");
    showToast("✨ Аватар (GIF / фото) по ссылке установлен!");
  };

  // Загрузка кастомного баннера (поддерживает изображения, GIF, WebP и видео MP4/WebM)
  const handleBannerFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isGif = file.type === "image/gif";

    if (!isImage && !isVideo) {
      showToast("Пожалуйста, выберите изображение, GIF или видео (MP4 / WebM)", "error");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast("Размер файла не должен превышать 25 МБ", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const rawUrl = event.target?.result as string;

      // Если это GIF или видео — сохраняем исходный поток данных без изменений кадров
      if (isGif || isVideo || !isImage) {
        const nextCustom: UserProfileCustomization = {
          ...customization,
          bannerThemeId: "custom",
          customBannerUrl: rawUrl,
          customBannerType: isVideo ? "video" : "image",
        };
        setCustomization(nextCustom);
        saveProfileCustomization(nextCustom);
        showToast(isVideo ? "🎬 Живой видео-баннер загружен!" : "✨ Анимированный GIF-баннер установлен!");
        return;
      }

      // Для статичных фото: оптимизируем четкость и размер через Canvas
      const img = new Image();
      img.onload = () => {
        try {
          const maxW = 1920;
          const maxH = 1080;
          let w = img.width;
          let h = img.height;

          if (w > maxW || h > maxH) {
            const ratio = Math.min(maxW / w, maxH / h);
            w = Math.round(w * ratio);
            h = Math.round(h * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, w, h);
            // Пытаемся сохранить в WebP с высоким качеством 92%
            const optimized = canvas.toDataURL("image/webp", 0.92);
            const nextCustom: UserProfileCustomization = {
              ...customization,
              bannerThemeId: "custom",
              customBannerUrl: optimized.length < rawUrl.length ? optimized : rawUrl,
              customBannerType: "image",
            };
            setCustomization(nextCustom);
            saveProfileCustomization(nextCustom);
            showToast("🖼️ Фото-баннер оптимизирован и установлен!");
            return;
          }
        } catch {
          // fallback к сырому URL если canvas недоступен
        }

        const nextCustom: UserProfileCustomization = {
          ...customization,
          bannerThemeId: "custom",
          customBannerUrl: rawUrl,
          customBannerType: "image",
        };
        setCustomization(nextCustom);
        saveProfileCustomization(nextCustom);
        showToast("🖼️ Фото-баннер установлен!");
      };

      img.onerror = () => {
        const nextCustom: UserProfileCustomization = {
          ...customization,
          bannerThemeId: "custom",
          customBannerUrl: rawUrl,
          customBannerType: "image",
        };
        setCustomization(nextCustom);
        saveProfileCustomization(nextCustom);
        showToast("🖼️ Фоновый баннер обновлен!");
      };

      img.src = rawUrl;
    };
    reader.readAsDataURL(file);
  };

  // Применение прямой ссылки на GIF / видео / картинку
  const handleApplyBannerUrl = () => {
    const trimmed = bannerUrlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://")) {
      showToast("Ссылка должна начинаться с https://", "error");
      return;
    }
    const isVideo =
      trimmed.endsWith(".mp4") ||
      trimmed.endsWith(".webm") ||
      trimmed.includes(".mp4?") ||
      trimmed.includes(".webm?");

    const nextCustom: UserProfileCustomization = {
      ...customization,
      bannerThemeId: "custom",
      customBannerUrl: trimmed,
      customBannerType: isVideo ? "video" : "image",
    };
    setCustomization(nextCustom);
    saveProfileCustomization(nextCustom);
    setBannerUrlInput("");
    showToast(isVideo ? "🎬 Видео-баннер по ссылке установлен!" : "✨ Баннер по ссылке успешно установлен!");
  };

  // Сброс кастомного баннера и возврат к теме
  const handleRemoveCustomBanner = () => {
    const nextCustom: UserProfileCustomization = {
      ...customization,
      bannerThemeId: "tokyo_midnight",
      customBannerUrl: undefined,
      customBannerType: undefined,
    };
    setCustomization(nextCustom);
    saveProfileCustomization(nextCustom);
    showToast("Фон сброшен на базовую тему");
  };

  // Случайный стиль оформления (Shuffle / Dice)
  const handleShuffleStyle = () => {
    const randomized = getRandomCosmetics();
    const nextCustom: UserProfileCustomization = {
      ...customization,
      ...randomized,
    };
    setCustomization(nextCustom);
    saveProfileCustomization(nextCustom);
    showToast("🎲 Примерен случайный стиль оформления!");
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
      syncNicknameEverywhere(resp.data.nickname);
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
  const handleLogout = async () => {
    const isRu = language === "ru";
    const isJa = language === "ja";
    const confirmed = await confirmModal({
      title: isRu ? "Выход из аккаунта" : isJa ? "ログアウトの確認" : "Log Out",
      message: isRu
        ? "Вы действительно хотите завершить текущую сессию и выйти из своего аккаунта KaVault?"
        : isJa
          ? "このデバイスからKaVaultアカウントをログアウトしますか？"
          : "Are you sure you want to sign out of your KaVault account on this device?",
      confirmText: isRu ? "Выйти" : isJa ? "ログアウト" : "Log Out",
      cancelText: isRu ? "Отмена" : isJa ? "キャンセル" : "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    localStorage.removeItem("access_token");
    localStorage.removeItem("kavault_is_creator");
    window.dispatchEvent(new Event("kavault-auth-changed"));
    navigate("/login");
  };

  const currentRankTier = socialData?.rankTier || {
    key: "novice",
    title: "Novice",
    emoji: "🌱",
    color: "#94a3b8",
    minMmr: 0,
    nextMinMmr: 150,
    progressPercent: Math.min(100, Math.round(((socialData?.mmr || 0) / 150) * 100)),
  };

  // Достижения для показа
  const showcaseBadges = customization.showcaseAchievementIds
    .map((id) => achievements.find((a) => a.id === id))
    .filter((a): a is (typeof achievements)[number] => Boolean(a));

  const fallbackUnlockedBadges = achievements.filter((a) => a.unlocked).slice(0, 3);
  const displayShowcase = showcaseBadges.length > 0 ? showcaseBadges : fallbackUnlockedBadges;

  return (
    <div className="kv-cabinet-root">
      {/* ── СТИЛИ ДЛЯ ИДЕАЛЬНОЙ МОБИЛЬНОЙ И ДЕСКТОПНОЙ АДАПТАЦИИ ── */}
      <style>{`
        .kv-cabinet-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          box-sizing: border-box;
          overflow-x: clip;
        }

        /* Табы: на мобильном показывается короткий лейбл, на ПК — полный */
        .kv-tab-label-short {
          display: inline;
        }
        .kv-tab-label-full {
          display: none;
        }
        @media (min-width: 640px) {
          .kv-tab-label-short {
            display: none;
          }
          .kv-tab-label-full {
            display: inline;
          }
        }

        /* Таббар кабинета */
        .kv-cab-tabs-bar {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          background-color: var(--surface, #121214);
          padding: 4px;
          border-radius: 14px;
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          gap: 4px;
          width: 100%;
          box-sizing: border-box;
        }

        .kv-cab-tab-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 10px 4px;
          border-radius: 10px;
          border: none;
          background-color: transparent;
          color: var(--text-muted, #71717a);
          font-weight: 500;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.15s ease;
          min-width: 0;
          white-space: nowrap;
        }

        .kv-cab-tab-btn.active {
          background-color: var(--surface-raised, #27272a);
          color: var(--text-primary, #ffffff);
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }

        /* Ряд с никнеймом и кнопкой "Сохранить ник" */
        .kv-nick-row {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
          margin-top: 10px;
        }

        @media (max-width: 640px) {
          .kv-nick-row {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .kv-nick-row button {
            width: 100% !important;
          }
        }

        /* Парольная сетка */
        .kv-pass-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .kv-pass-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }

        /* Парольные кнопки действий */
        .kv-pass-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .kv-pass-actions {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          .kv-pass-actions button[type="submit"] {
            width: 100% !important;
          }
        }

        /* Выход из сессии */
        .kv-logout-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        @media (max-width: 640px) {
          .kv-logout-card {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }
          .kv-logout-card button {
            width: 100% !important;
          }
        }

        /* Сетка пресетов аватарок */
        .kv-presets-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          max-height: 360px;
          overflow-y: auto;
          padding: 4px;
        }

        @media (max-width: 768px) {
          .kv-presets-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
          }
        }

        @media (max-width: 480px) {
          .kv-presets-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }

        /* Сетка рамок */
        .kv-frames-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        @media (max-width: 768px) {
          .kv-frames-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }

        /* Сетка баннеров */
        .kv-banners-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        @media (max-width: 768px) {
          .kv-banners-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
        }

        /* Сетка показателей в паспорте */
        .kv-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 768px) {
          .kv-stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
        }

        @media (max-width: 380px) {
          .kv-stats-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
        }

        /* Шапка карточки профиля */
        .kv-hero-body {
          padding: 0 16px 16px 16px;
          position: relative;
          z-index: 10;
        }

        @media (min-width: 640px) {
          .kv-hero-body {
            padding: 0 22px 20px 22px;
          }
        }

        .kv-hero-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: -38px;
          margin-bottom: 12px;
          flex-wrap: wrap;
          gap: 12px;
          position: relative;
          z-index: 15;
        }

        @media (max-width: 640px) {
          .kv-hero-row {
            flex-direction: column;
            align-items: flex-start;
            margin-top: -34px;
            gap: 10px;
          }
        }

        .kv-action-btn {
          min-height: 42px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 0 16px;
          border-radius: 10px;
          flex-shrink: 0;
          box-sizing: border-box;
        }

        .kv-preview-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        @media (max-width: 640px) {
          .kv-preview-actions {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }
        }

        .kv-cosmetics-subtabs {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          padding: 4px;
          border-radius: 12px;
          background-color: var(--surface, #121214);
          border: 1px solid var(--border, rgba(255,255,255,0.08));
          width: 100%;
          box-sizing: border-box;
        }

        .kv-custom-avatar-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-radius: 12px;
          background-color: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.25);
          gap: 12px;
        }
        @media (max-width: 640px) {
          .kv-custom-avatar-card {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .kv-custom-avatar-actions {
            width: 100% !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 8px !important;
          }
        }
      `}</style>

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
        accept="image/*,video/mp4,video/webm"
        style={{ display: "none" }}
      />

      {/* ══════════════════════════════════════════════════════════════════
          ГЛАВНАЯ КАРТОЧКА ПРОФИЛЯ (HERO IDENTITY CARD)
      ══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          borderRadius: "18px",
          overflow: "hidden",
          backgroundColor: "var(--surface, #121214)",
          border: "1px solid var(--border, rgba(255,255,255,0.08))",
          boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
          position: "relative",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Баннер / Обложка профиля (поддерживает живые анимации, GIF и видео) */}
        <BannerRenderer
          customization={customization}
          style={{ height: "140px" }}
        >
          <div
            style={{
              position: "absolute",
              top: "12px",
              right: "12px",
              zIndex: 3,
            }}
          >
            <button
              onClick={() => setCabinetTab("cosmetics")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "6px 12px",
                borderRadius: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.65)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              <Palette size={14} />
              <span className="kv-tab-label-full">Оформить стиль</span>
              <span className="kv-tab-label-short">Стиль</span>
            </button>
          </div>
        </BannerRenderer>

        {/* Тело карточки: Аватарка + Никнейм + Статус */}
        <div className="kv-hero-body">
          <div className="kv-hero-row">
            <div style={{ position: "relative", zIndex: 20, isolation: "isolate" }}>
              <UserAvatarBadge
                customization={customization}
                size={80}
                username={nickname || "User"}
                onClick={() => setCabinetTab("cosmetics")}
              />
              <button
                onClick={() => avatarFileInputRef.current?.click()}
                title="Загрузить свой аватар"
                style={{
                  position: "absolute",
                  bottom: "0px",
                  right: "0px",
                  zIndex: 25,
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

            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {isCreator ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    background: "rgba(245, 158, 11, 0.18)",
                    border: "1px solid rgba(245, 158, 11, 0.4)",
                    color: "#f59e0b",
                    fontSize: "12px",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
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
                    padding: "5px 10px",
                    borderRadius: "8px",
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
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexWrap: "wrap" }}>
              <h1
                style={{
                  fontSize: "20px",
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
                  fontSize: "13.5px",
                  color: "var(--accent, #3b82f6)",
                  fontWeight: 600,
                }}
              >
                @{nickname ? nickname.toLowerCase() : "user"}
              </span>
              <span style={{ fontSize: "12px", color: "var(--text-muted, #71717a)" }}>
                • {userEmail || "Авторизован"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ТАБЫ УПРАВЛЕНИЯ ЛИЧНЫМ КАБИНЕТОМ (НЕТ ДВОЙНЫХ СЛОВ!)
      ══════════════════════════════════════════════════════════════════ */}
      <div className="kv-cab-tabs-bar">
        <button
          onClick={() => setCabinetTab("overview")}
          className={`kv-cab-tab-btn ${cabinetTab === "overview" ? "active" : ""}`}
        >
          <Compass size={15} color={cabinetTab === "overview" ? "var(--accent, #3b82f6)" : undefined} />
          <span className="kv-tab-label-short">Паспорт</span>
          <span className="kv-tab-label-full">Паспорт и Статистика</span>
        </button>

        <button
          onClick={() => setCabinetTab("cosmetics")}
          className={`kv-cab-tab-btn ${cabinetTab === "cosmetics" ? "active" : ""}`}
        >
          <Palette size={15} color={cabinetTab === "cosmetics" ? "#ec4899" : undefined} />
          <span className="kv-tab-label-short">Стиль</span>
          <span className="kv-tab-label-full">Кастомизация и Стиль</span>
        </button>

        <button
          onClick={() => setCabinetTab("security")}
          className={`kv-cab-tab-btn ${cabinetTab === "security" ? "active" : ""}`}
        >
          <ShieldCheck size={15} color={cabinetTab === "security" ? "#10b981" : undefined} />
          <span className="kv-tab-label-short">Защита</span>
          <span className="kv-tab-label-full">Безопасность и Вход</span>
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          СЕКЦИЯ 1: ОБЗОР, РАНГ И СТАТИСТИКА (ПАСПОРТ)
      ══════════════════════════════════════════════════════════════════ */}
      {cabinetTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {/* Карточка Task MMR и Лиги */}
          <div
            style={{
              padding: "16px 18px",
              borderRadius: "14px",
              backgroundColor: "var(--surface, #121214)",
              border: `1px solid ${currentRankTier.color}44`,
              background: `linear-gradient(135deg, ${currentRankTier.color}15 0%, var(--surface, #121214) 75%)`,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
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
                gap: "8px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "28px", lineHeight: 1 }}>{currentRankTier.emoji}</span>
                <div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: currentRankTier.color,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    Лига Task-System
                  </div>
                  <div
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "var(--text-primary, #ffffff)",
                    }}
                  >
                    {currentRankTier.title} League
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, color: currentRankTier.color }}>
                  {socialData?.mmr ?? 0} <span style={{ fontSize: "12px", fontWeight: 600 }}>MMR</span>
                </div>
                {socialData?.globalRank ? (
                  <div style={{ fontSize: "11px", color: "var(--text-muted, #71717a)" }}>
                    Место в топе: #{socialData.globalRank}
                  </div>
                ) : (
                  <div style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>
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
                  fontSize: "11px",
                  color: "var(--text-muted, #71717a)",
                  marginBottom: "5px",
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
                  height: "7px",
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
                  gap: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: currentRankTier.color,
                  textDecoration: "none",
                }}
              >
                <span>Рейтинг и друзья</span>
                <ChevronRight size={13} />
              </Link>
            </div>
          </div>

          {/* Сетка показателей активности */}
          <div className="kv-stats-grid">
            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#3b82f6" }}>
                <BookOpen size={15} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Слов SRS
                </span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats.cardsCount}
              </div>
              <Link
                to="/japanese"
                style={{ fontSize: "11px", color: "var(--accent, #3b82f6)", textDecoration: "none" }}
              >
                Повторить →
              </Link>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#10b981" }}>
                <Code2 size={15} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Ресурсов Dev
                </span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats.resourcesCount}
              </div>
              <Link
                to="/developer"
                style={{ fontSize: "11px", color: "#10b981", textDecoration: "none" }}
              >
                База знаний →
              </Link>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#a855f7" }}>
                <PenLine size={15} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Заметок
                </span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                {stats.notesCount}
              </div>
              <Link
                to="/thoughts"
                style={{ fontSize: "11px", color: "#a855f7", textDecoration: "none" }}
              >
                Заметки →
              </Link>
            </div>

            <div
              style={{
                padding: "12px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#f59e0b" }}>
                <Trophy size={15} />
                <span style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)" }}>
                  Награды
                </span>
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                {unlockedCount} <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>/ {totalCount}</span>
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
                Список всех →
              </button>
            </div>
          </div>

          {/* Витрина наград */}
          {displayShowcase.length > 0 && (
            <div
              style={{
                padding: "16px 18px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-primary, #ffffff)",
                    margin: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Trophy size={16} color="#f59e0b" />
                  <span>Открытые награды</span>
                </h3>
                <button
                  onClick={openModal}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    cursor: "pointer",
                  }}
                >
                  Все ({unlockedCount}) →
                </button>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "10px",
                }}
              >
                {displayShowcase.map((ach) => (
                  <div
                    key={ach.id}
                    style={{
                      padding: "12px",
                      borderRadius: "10px",
                      backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "38px",
                        height: "38px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(245, 158, 11, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
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
                        }}
                      >
                        {ach.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          СЕКЦИЯ 2: КАСТОМИЗАЦИЯ И СТИЛЬ (КНОПКИ: АВАТАР, РАМКА, БАННЕР)
      ══════════════════════════════════════════════════════════════════ */}
      {cabinetTab === "cosmetics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", width: "100%" }}>
          {/* ══════════════════════════════════════════════════════════════════
              ЗАКРЕПЛЕННЫЙ ПРЕДПРОСМОТР ПРОФИЛЯ ПРИ КАСТОМИЗАЦИИ (STICKY LIVE PROFILE)
          ══════════════════════════════════════════════════════════════════ */}
          <div
            className="kv-sticky-cosmetics-bar"
            style={{
              position: "sticky",
              top: "10px",
              zIndex: 35,
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              backgroundColor: "rgba(18, 18, 22, 0.94)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              boxShadow: "0 12px 36px -4px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.15)",
              marginBottom: "4px",
            }}
          >
            {/* Живой баннер профиля с кнопками */}
            <div style={{ position: "relative", height: "76px", width: "100%", overflow: "hidden" }}>
              <BannerRenderer
                customization={customization}
                style={{ height: "100%", width: "100%", position: "absolute", inset: 0 }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(18,18,22,0.88) 100%)",
                  pointerEvents: "none",
                }}
              />

              {/* Метка «Живой предпросмотр» */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "3px 8px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(0, 0, 0, 0.65)",
                  backdropFilter: "blur(8px)",
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#ffffff",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                }}
              >
                <Sparkles size={11} color="#ec4899" />
                <span>Живой профиль</span>
              </div>

              {/* Кнопки быстрых действий на баннере */}
              <div
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <button
                  type="button"
                  onClick={handleShuffleStyle}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 10px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(0,0,0,0.65)",
                    border: "1px solid rgba(168, 85, 247, 0.4)",
                    color: "#c084fc",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    backdropFilter: "blur(8px)",
                    transition: "all 0.15s ease",
                  }}
                  title="Сгенерировать случайное сочетание героя, рамки и баннера"
                >
                  <Dices size={13} />
                  <span>Случайный</span>
                </button>

                <Button
                  onClick={() => handleSaveCosmetics()}
                  style={{
                    padding: "5px 12px",
                    fontSize: "11px",
                    fontWeight: 700,
                    borderRadius: "8px",
                    gap: "5px",
                  }}
                >
                  <Save size={13} /> Сохранить
                </Button>
              </div>
            </div>

            {/* Нижняя часть закрепленного блока: аватарка + имя + переключатель Аватар/Рамка/Баннер */}
            <div
              style={{
                padding: "8px 12px 10px 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <div style={{ marginTop: "-22px", position: "relative", zIndex: 5, flexShrink: 0 }}>
                  <UserAvatarBadge
                    customization={customization}
                    size={50}
                    username={nickname || "User"}
                  />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 800,
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {nickname || "Аноним"}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--accent, #3b82f6)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontWeight: 600,
                    }}
                  >
                    {customization.avatarType === "custom" ? "Своё фото" : "Герой"} •{" "}
                    {AVATAR_FRAMES.find((f) => f.id === customization.avatarFrameId)?.name || "Рамка"} •{" "}
                    {customization.bannerThemeId === "custom"
                      ? "Свой баннер"
                      : BANNER_THEMES.find((b) => b.id === customization.bannerThemeId)?.name || "Баннер"}
                  </div>
                </div>
              </div>

              {/* Навигационные табы выбора: Аватар / Рамка / Баннер прямо в закрепленной панели */}
              <div
                className="kv-cosmetics-subtabs"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "3px",
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  flexShrink: 0,
                }}
              >
                <button
                  type="button"
                  onClick={() => setCosmeticsSubTab("avatar")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor:
                      cosmeticsSubTab === "avatar"
                        ? "var(--accent, #3b82f6)"
                        : "transparent",
                    color: cosmeticsSubTab === "avatar" ? "#ffffff" : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <User size={13} />
                  <span>Аватар</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCosmeticsSubTab("frame")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor:
                      cosmeticsSubTab === "frame"
                        ? "var(--accent, #3b82f6)"
                        : "transparent",
                    color: cosmeticsSubTab === "frame" ? "#ffffff" : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <Sparkles size={13} />
                  <span>Рамка</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCosmeticsSubTab("banner")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor:
                      cosmeticsSubTab === "banner"
                        ? "var(--accent, #3b82f6)"
                        : "transparent",
                    color: cosmeticsSubTab === "banner" ? "#ffffff" : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  <ImageIcon size={13} />
                  <span>Баннер</span>
                </button>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════════
              ПОДРАЗДЕЛ 1: АВАТАР
          ══════════════════════════════════════════════════════════════════ */}
          {cosmeticsSubTab === "avatar" && (
            <div
              style={{
                padding: "18px 20px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Выбор Аватара
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
                    Выберите персонажа из коллекции или загрузите собственное фото / GIF
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
                    onClick={() => {
                      setAvatarTabMode("presets");
                      handleSaveCosmetics({ avatarType: "preset" });
                    }}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor:
                        avatarTabMode === "presets" && customization.avatarType === "preset"
                          ? "var(--accent, #3b82f6)"
                          : "transparent",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Герои ({AVATAR_PRESETS.length})
                  </button>
                  <button
                    onClick={() => setAvatarTabMode("custom")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor:
                        avatarTabMode === "custom" || customization.avatarType === "custom"
                          ? "var(--accent, #3b82f6)"
                          : "transparent",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Upload size={13} />
                    <span>Своё фото / GIF</span>
                  </button>
                </div>
              </div>

              {/* РЕЖИМ 1: КОЛЛЕКЦИЯ ГЕРОЕВ */}
              {avatarTabMode === "presets" && customization.avatarType === "preset" && (
                <>
                  {/* Фильтры категорий героев */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["all", "Cyberpunk", "Japanese", "Anime", "VIP", "Chill", "Dev"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setAvatarFilter(tag)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "8px",
                          border: "1px solid",
                          borderColor: avatarFilter === tag ? "var(--accent, #3b82f6)" : "rgba(255,255,255,0.08)",
                          backgroundColor: avatarFilter === tag ? "rgba(59, 130, 246, 0.15)" : "transparent",
                          color: avatarFilter === tag ? "#60a5fa" : "var(--text-muted)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {tag === "all" ? "Все герои" : tag}
                      </button>
                    ))}
                  </div>

                  {/* Сетка пресетов аватарок (16 персонажей) */}
                  <div className="kv-presets-grid">
                    {AVATAR_PRESETS.filter((p) => avatarFilter === "all" || p.tag.toLowerCase() === avatarFilter.toLowerCase()).map((preset) => {
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
                            padding: "10px 8px",
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
                            boxShadow: isSelected ? "0 0 16px rgba(59, 130, 246, 0.4)" : "none",
                          }}
                        >
                          <div
                            style={{
                              width: "46px",
                              height: "46px",
                              borderRadius: "50%",
                              background: preset.gradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "23px",
                              boxShadow: isSelected ? "0 0 12px rgba(59, 130, 246, 0.6)" : "none",
                            }}
                          >
                            {preset.emoji}
                          </div>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-primary)" }}>
                            {preset.name}
                          </div>
                          <div style={{ fontSize: "9.5px", color: "var(--text-muted)" }}>
                            {preset.tag}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* РЕЖИМ 2: СВОЙ АВАТАР (GIF, КАРТИНКА ИЛИ ПРЯМАЯ ССЫЛКА) */}
              {(avatarTabMode === "custom" || customization.avatarType === "custom") && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {/* Карточка активного кастомного аватара */}
                  {customization.avatarType === "custom" && customization.customAvatarUrl && (
                    <div className="kv-custom-avatar-card">
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <img
                          src={customization.customAvatarUrl}
                          alt="Custom Avatar"
                          style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "50%",
                            objectFit: "cover",
                            flexShrink: 0,
                            border: "2px solid var(--accent, #3b82f6)",
                            boxShadow: "0 0 12px rgba(59, 130, 246, 0.4)",
                          }}
                        />
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                            Кастомный аватар активен ✨
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            Синхронизирован с вашим аккаунтом KaVault
                          </div>
                        </div>
                      </div>

                      <div className="kv-custom-avatar-actions">
                        <button
                          onClick={() => avatarFileInputRef.current?.click()}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            backgroundColor: "var(--accent, #3b82f6)",
                            color: "#fff",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Заменить файл
                        </button>
                        <button
                          onClick={() => {
                            setAvatarTabMode("presets");
                            handleSaveCosmetics({ avatarType: "preset", customAvatarUrl: undefined });
                          }}
                          style={{
                            padding: "8px 14px",
                            borderRadius: "8px",
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            color: "var(--text-secondary)",
                            border: "none",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                          }}
                        >
                          Сбросить на персонажа
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Загрузка файла с устройства */}
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      border: "1px dashed rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent, #3b82f6)",
                      }}
                    >
                      <Camera size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        Загрузите аватар любого формата
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
                        Поддерживаются статические картинки (PNG, JPG, WebP) и <strong>живые анимированные GIF</strong> до 15 МБ
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "9px 18px",
                        borderRadius: "10px",
                        backgroundColor: "var(--accent, #3b82f6)",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                      }}
                    >
                      <Upload size={16} />
                      <span>Выбрать файл с устройства</span>
                    </button>
                  </div>

                  {/* Вставка прямой ссылки на GIF или картинку */}
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      backgroundColor: "var(--surface-raised, #18181b)",
                      border: "1px solid var(--border, rgba(255,255,255,0.08))",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                      Или вставьте прямую ссылку на аватар (URL)
                    </div>
                    <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                      Подходят прямые ссылки на анимированные GIF (Tenor, Giphy, Imgur, Discord) или картинки PNG/JPG
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <input
                        type="url"
                        placeholder="https://media.tenor.com/.../avatar.gif"
                        value={avatarUrlInput}
                        onChange={(e) => setAvatarUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleApplyAvatarUrl();
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          backgroundColor: "var(--surface, #121214)",
                          border: "1px solid var(--border, rgba(255,255,255,0.12))",
                          color: "var(--text-primary, #ffffff)",
                          fontSize: "13px",
                          outline: "none",
                        }}
                      />
                      <button
                        type="button"
                        onClick={handleApplyAvatarUrl}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "8px 14px",
                          borderRadius: "8px",
                          backgroundColor: "var(--accent, #3b82f6)",
                          color: "#ffffff",
                          border: "none",
                          fontSize: "12.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <Sparkles size={14} />
                        <span>Применить</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ПОДРАЗДЕЛ 2: РАМКА АВАТАРА (18 РАМОК С ЖИВЫМ СВЕЧЕНИЕМ)
          ══════════════════════════════════════════════════════════════════ */}
          {cosmeticsSubTab === "frame" && (
            <div
              style={{
                padding: "18px 20px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Рамка и Неоновое Свечение (Avatar Frame)
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
                    Световые контуры, анимированные нимбы и огненные кольца вокруг вашего аватара
                  </p>
                </div>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {["all", "Animated", "Popular", "Hot", "VIP", "Mythic", "Rare", "Classic"].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setFrameFilter(tag)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: frameFilter === tag ? "var(--accent, #3b82f6)" : "rgba(255,255,255,0.08)",
                        backgroundColor: frameFilter === tag ? "rgba(59, 130, 246, 0.15)" : "transparent",
                        color: frameFilter === tag ? "#60a5fa" : "var(--text-muted)",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {tag === "all" ? "Все рамки (18)" : tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Сетка рамок */}
              <div className="kv-frames-grid">
                {AVATAR_FRAMES.filter((f) => frameFilter === "all" || f.tag.toLowerCase() === frameFilter.toLowerCase()).map((frame) => {
                  const isSelected = customization.avatarFrameId === frame.id;
                  return (
                    <div
                      key={frame.id}
                      onClick={() => handleSaveCosmetics({ avatarFrameId: frame.id })}
                      style={{
                        padding: "12px 8px",
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
                        boxShadow: isSelected ? `0 0 16px ${frame.accentColor}66` : "none",
                      }}
                    >
                      {/* Живой круг с примененной рамкой и анимацией */}
                      <div
                        className={`kv-avatar-frame ${frame.animationClass || ""}`}
                        style={{
                          width: "48px",
                          height: "48px",
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
                        {frame.tag === "Animated" ? "🔥" : frame.tag === "VIP" ? "👑" : "✨"}
                      </div>
                      <div>
                        <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {frame.name}
                        </div>
                        <div style={{ fontSize: "10px", color: frame.accentColor, fontWeight: 600, marginTop: "2px" }}>
                          {frame.tag}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════════
              ПОДРАЗДЕЛ 3: БАННЕР ПРОФИЛЯ (18 ДЕФОЛТНЫХ/АНИМИРОВАННЫХ + ЗАГРУЗКА GIF/ВИДЕО + URL)
          ══════════════════════════════════════════════════════════════════ */}
          {cosmeticsSubTab === "banner" && (
            <div
              style={{
                padding: "18px 20px",
                borderRadius: "14px",
                backgroundColor: "var(--surface, #121214)",
                border: "1px solid var(--border, rgba(255,255,255,0.08))",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                    Баннер профиля (Обложка)
                  </h3>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "3px 0 0 0" }}>
                    Живые анимированные темы, загрузка своих фонов, анимированных GIF и видеороликов
                  </p>
                </div>

                {/* Переключатель: Коллекция | Свой баннер */}
                <div
                  style={{
                    display: "inline-flex",
                    padding: "3px",
                    borderRadius: "10px",
                    backgroundColor: "var(--surface-raised, rgba(255,255,255,0.05))",
                  }}
                >
                  <button
                    onClick={() => setBannerTabMode("presets")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: bannerTabMode === "presets" ? "var(--accent, #3b82f6)" : "transparent",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Коллекция ({BANNER_THEMES.length})
                  </button>
                  <button
                    onClick={() => setBannerTabMode("custom")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "8px",
                      border: "none",
                      backgroundColor: bannerTabMode === "custom" ? "var(--accent, #3b82f6)" : "transparent",
                      color: "#ffffff",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                    }}
                  >
                    <Upload size={13} />
                    <span>Загрузить баннер / GIF / Видео</span>
                  </button>
                </div>
              </div>

              {/* РЕЖИМ 1: КОЛЛЕКЦИЯ БАННЕРОВ */}
              {bannerTabMode === "presets" && (
                <>
                  {/* Фильтры коллекции баннеров */}
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {["all", "Animated", "Cyberpunk", "Japanese", "Space", "Dark", "Gold"].map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setBannerFilter(tag)}
                        style={{
                          padding: "4px 10px",
                          borderRadius: "8px",
                          border: "1px solid",
                          borderColor: bannerFilter === tag ? "var(--accent, #3b82f6)" : "rgba(255,255,255,0.08)",
                          backgroundColor: bannerFilter === tag ? "rgba(59, 130, 246, 0.15)" : "transparent",
                          color: bannerFilter === tag ? "#60a5fa" : "var(--text-muted)",
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {tag === "all" ? "Все темы (18)" : tag === "Animated" ? "✨ Живые анимированные" : tag}
                      </button>
                    ))}
                  </div>

                  <div className="kv-banners-grid">
                    {BANNER_THEMES.filter((t) => bannerFilter === "all" || t.tag.toLowerCase() === bannerFilter.toLowerCase()).map((theme) => {
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
                            boxShadow: isSelected ? `0 0 16px ${theme.accentColor}66` : "none",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div
                            className={theme.isAnimated ? theme.animationClass : ""}
                            style={{
                              height: "48px",
                              background: theme.background,
                              backgroundSize: theme.isAnimated ? "300% 300%" : "cover",
                              position: "relative",
                            }}
                          >
                            {theme.isAnimated && (
                              <div
                                style={{
                                  position: "absolute",
                                  top: "4px",
                                  right: "6px",
                                  backgroundColor: "rgba(0,0,0,0.6)",
                                  borderRadius: "999px",
                                  padding: "2px 6px",
                                  fontSize: "9px",
                                  fontWeight: 700,
                                  color: "#ffffff",
                                }}
                              >
                                Live ✨
                              </div>
                            )}
                          </div>
                          <div style={{ padding: "8px 10px", backgroundColor: "var(--surface-raised, #18181b)" }}>
                            <div style={{ fontSize: "11.5px", fontWeight: 700, color: "var(--text-primary)" }}>
                              {theme.name}
                            </div>
                            <div style={{ fontSize: "10px", color: theme.accentColor, marginTop: "2px" }}>
                              {theme.tag}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* РЕЖИМ 2: ЗАГРУЗКА СВОЕГО БАННЕРА (GIF, ВИДЕО, КАРТИНКА, URL) */}
              {bannerTabMode === "custom" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  <div
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      backgroundColor: "rgba(255, 255, 255, 0.03)",
                      border: "1px dashed rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(59, 130, 246, 0.15)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent, #3b82f6)",
                      }}
                    >
                      <Film size={24} />
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                        Загрузите баннер любого формата
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "3px" }}>
                        Поддерживаются статические картинки (PNG, JPG, WebP), <strong>анимированные GIF</strong> и <strong>видеоролики (MP4, WebM)</strong> до 15 МБ
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => bannerFileInputRef.current?.click()}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "9px 18px",
                        borderRadius: "10px",
                        backgroundColor: "var(--accent, #3b82f6)",
                        color: "#ffffff",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
                      }}
                    >
                      <Upload size={16} />
                      <span>Выбрать файл с устройства</span>
                    </button>
                  </div>

                  {/* Вставка прямой ссылки на баннер / GIF / Видео */}
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      backgroundColor: "var(--surface-raised, #18181b)",
                      border: "1px solid var(--border, rgba(255,255,255,0.08))",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                      Или вставьте прямую ссылку (URL)
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Подходят ссылки на GIF (Giphy, Tenor, Imgur) или прямые ссылки на видео MP4 / изображение
                    </div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                      <input
                        type="url"
                        value={bannerUrlInput}
                        onChange={(e) => setBannerUrlInput(e.target.value)}
                        placeholder="https://example.com/banner.gif или .mp4"
                        style={{
                          flex: 1,
                          padding: "8px 12px",
                          borderRadius: "8px",
                          backgroundColor: "#09090b",
                          border: "1px solid rgba(255,255,255,0.12)",
                          color: "#ffffff",
                          fontSize: "12.5px",
                        }}
                      />
                      <Button onClick={handleApplyBannerUrl} style={{ padding: "8px 14px", fontSize: "12px" }}>
                        <Link2 size={14} /> Применить
                      </Button>
                    </div>
                  </div>

                  {/* Превью активного кастомного баннера и кнопка удаления */}
                  {customization.bannerThemeId === "custom" && customization.customBannerUrl && (
                    <div
                      style={{
                        padding: "14px 16px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "10px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <Check size={18} color="#10b981" />
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: 700, color: "#10b981" }}>
                            Кастомный баннер активен ({customization.customBannerType === "video" ? "Видео" : "Изображение / GIF"})
                          </div>
                          <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                            Он отображается в шапке профиля и на вашей главной странице
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveCustomBanner}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          backgroundColor: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.35)",
                          color: "#ef4444",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        <Trash2 size={13} />
                        <span>Сбросить кастомный фон</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          СЕКЦИЯ 3: БЕЗОПАСНОСТЬ И УЧЕТНАЯ ЗАПИСЬ (ЗАЩИТА)
      ══════════════════════════════════════════════════════════════════ */}
      {cabinetTab === "security" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {/* Смена ника — ИДЕАЛЬНОЕ РАССТОЯНИЕ МЕЖДУ ИНПУТОМ И КНОПКОЙ */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: "14px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(59, 130, 246, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent, #3b82f6)",
                }}
              >
                <User size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Отображаемый никнейм (@handle)
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Ваш уникальный идентификатор в таблице лидеров
                </p>
              </div>
            </div>

            <div className="kv-nick-row">
              <div style={{ flex: 1, minWidth: 0, width: "100%" }}>
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
              padding: "18px 20px",
              borderRadius: "14px",
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
                  width: "34px",
                  height: "34px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(16, 185, 129, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#10b981",
                }}
              >
                <KeyRound size={16} />
              </div>
              <div>
                <h3 style={{ fontSize: "15px", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
                  Безопасность и пароль
                </h3>
                <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                  Регулярно обновляйте пароль для защиты ваших данных
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

              <div className="kv-pass-grid">
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

              <div className="kv-pass-actions">
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
                    padding: "4px 0",
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
              borderRadius: "14px",
              backgroundColor: "var(--surface, #121214)",
              border: "1px solid var(--border, rgba(255,255,255,0.08))",
            }}
          >
            <div className="kv-logout-card">
              <div>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                  Выход из аккаунта
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Завершить сессию на этом устройстве
                </div>
              </div>

              <Button variant="secondary" onClick={handleLogout} className="kv-action-btn" style={{ color: "var(--text-primary)" }}>
                <LogOut size={15} /> Выйти из сессии
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
