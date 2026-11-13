import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import {
  User,
  Palette,
  Target,
  Database,
  Lock,
  Moon,
  Sun,
  Save,
  Download,
  Upload,
  RotateCcw,
  TriangleAlert,
  Trash2,
  CheckCircle2,
  LogOut,
  Bell,
  Sparkles,
  Volume2,
  VolumeX,
  ShieldCheck,
  Eye,
  EyeOff,
  Globe,
  Crown,
  Code2,
  Check,
  Sliders,
  KeyRound,
  RefreshCw,
  BookOpen,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { api, getApiBaseURL } from "../api/axios";
import { confirmModal } from "../context/DialogContext";
import {
  STARTER_DEVELOPER_RESOURCES,
  STARTER_GITHUB_REPOSITORIES,
  getStarterCardsForStudy,
  studyLanguageToPackType,
  isPackClaimed,
  markPackClaimed,
  unmarkPackClaimed,
} from "../data/starterPacks";
import {
  STUDY_VIBE_PALETTES,
  STUDY_TEXTS,
  ONBOARDING_TEXTS,
  type StudyLanguage,
} from "../data/studyVibes";

type SettingsTab = "appearance" | "account" | "learning" | "vault";

interface ToastMessage {
  id: number;
  text: string;
  type?: "success" | "error" | "info";
}

const ACCENT_COLORS = [
  { key: "blue" as const, label: "Синий", value: "#3b82f6" },
  { key: "purple" as const, label: "Фиолетовый", value: "#8b5cf6" },
  { key: "emerald" as const, label: "Изумруд", value: "#10b981" },
  { key: "amber" as const, label: "Янтарный", value: "#f59e0b" },
  { key: "rose" as const, label: "Розовый", value: "#ec4899" },
  { key: "cyan" as const, label: "Бирюза", value: "#06b6d4" },
];

export function Settings() {
  const navigate = useNavigate();
  const {
    theme,
    setTheme,
    language,
    setLanguage,
    t,
    isCreator,
    studyLanguage,
    showProgramming,
    updateStudyPreferences,
  } = useApp();
  const { evaluateAchievements } = useAchievements();
  const [updatingPrefs, setUpdatingPrefs] = useState(false);

  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Профиль
  const [userEmail, setUserEmail] = useState("");
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("kavault_username") || "";
  });

  // Пароль
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Акцентный цвет
  const [accentColor, setAccentColor] = useState(() => {
    return localStorage.getItem("kavault_accent") || "#3b82f6";
  });

  // Цели обучения
  const [goalResources, setGoalResources] = useState(() => {
    return localStorage.getItem("kavault_goal_resources") || "5";
  });
  const [goalCards, setGoalCards] = useState(() => {
    return localStorage.getItem("kavault_goal_cards") || "50";
  });
  const [dailyCardsLimit, setDailyCardsLimit] = useState(() => {
    return localStorage.getItem("kavault_daily_cards_limit") || "20";
  });

  // Переключатели
  const [notifications, setNotifications] = useState(() => {
    return localStorage.getItem("kavault_notif") === "true";
  });
  const [soundEffects, setSoundEffects] = useState(() => {
    return localStorage.getItem("kavault_sound_fx") !== "false";
  });

  // Статистика хранилища
  const [vaultStats, setVaultStats] = useState({
    resourcesCount: 0,
    cardsCount: 0,
    totalNotes: 0,
  });
  const [, setUserResources] = useState<Array<{ url: string }>>([]);
  const [, setUserCards] = useState<Array<{ word: string }>>([]);

  // Модальные окна подтверждения
  const [isResetSRSModalOpen, setIsResetSRSModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [serverUrl, setServerUrl] = useState(() => {
    return localStorage.getItem("kavault_api_url") || getApiBaseURL();
  });

  const handleSaveServerUrl = () => {
    const trimmed = serverUrl.trim();
    if (!trimmed) {
      localStorage.removeItem("kavault_api_url");
      const current = getApiBaseURL();
      setServerUrl(current);
      showToast(`${t.settings.toasts.serverResetDefault} ${current}`);
      return;
    }
    localStorage.setItem("kavault_api_url", trimmed);
    showToast(`${t.settings.toasts.serverSaved} ${trimmed}`);
  };

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3500);
  };

  /* Переключение языка изучения / программирования */
  const handleChangeStudyLanguage = async (nextLang: StudyLanguage) => {
    if (nextLang === studyLanguage || updatingPrefs) return;
    try {
      setUpdatingPrefs(true);
      await updateStudyPreferences({ studyLanguage: nextLang });
      showToast(`${STUDY_VIBE_PALETTES[nextLang].flag} ${STUDY_TEXTS[nextLang][language].name}`);
    } catch {
      showToast(t.settings.toasts.savedGeneral, "error");
    } finally {
      setUpdatingPrefs(false);
    }
  };

  const handleToggleProgramming = async (nextProg: boolean) => {
    if (nextProg === showProgramming || updatingPrefs) return;
    try {
      setUpdatingPrefs(true);
      await updateStudyPreferences({ showProgramming: nextProg });
      const ob = ONBOARDING_TEXTS[language];
      showToast(nextProg ? ob.optionProgYesTitle : ob.optionProgNoTitle);
    } catch {
      showToast(t.settings.toasts.savedGeneral, "error");
    } finally {
      setUpdatingPrefs(false);
    }
  };

  /* Загрузка профиля и метрик хранилища */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileResp, resResp, japResp] = await Promise.all([
          api.get("/auth/profile").catch(() => ({ data: {} })),
          showProgramming
            ? api.get("/resources").catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] }),
          api.get(`/japanese?language=${studyLanguage}`).catch(() => ({ data: [] })),
        ]);

        if (profileResp.data?.email) {
          setUserEmail(profileResp.data.email);
          if (!username) {
            const rawName = profileResp.data.email.split("@")[0];
            const cap = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            setUsername(cap);
          }
        }

        const resourcesList = resResp.data || [];
        const cardsList = japResp.data || [];
        const notesCount = resourcesList.filter((r: any) => Boolean(r.note)).length;
        setUserResources(resourcesList);
        setUserCards(cardsList);
        setVaultStats({
          resourcesCount: resourcesList.length,
          cardsCount: cardsList.length,
          totalNotes: notesCount,
        });
      } catch (e) {
        console.error(e);
      }
    };
    loadProfile();
  }, [studyLanguage, showProgramming]);

  /* Применение акцентного цвета */
  const handleSelectAccent = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty("--accent", color);
    localStorage.setItem("kavault_accent", color);
    evaluateAchievements({ themeSwitched: true });
    showToast(`${t.settings.toasts.accentUpdated} ${color}`);
  };

  /* Сохранение общих настроек */
  const handleSaveGeneral = () => {
    localStorage.setItem("kavault_username", username);
    localStorage.setItem("kavault_goal_resources", goalResources);
    localStorage.setItem("kavault_goal_cards", goalCards);
    localStorage.setItem("kavault_daily_cards_limit", dailyCardsLimit);
    localStorage.setItem("kavault_notif", String(notifications));
    localStorage.setItem("kavault_sound_fx", String(soundEffects));

    evaluateAchievements({
      username,
      userEmail,
      goalsConfigured: true,
    });

    showToast(t.settings.toasts.savedGeneral);
  };

  /* Смена пароля */
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast(t.settings.toasts.passCurrentRequired, "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast(t.settings.toasts.passTooShort, "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast(t.settings.toasts.passMismatch, "error");
      return;
    }

    try {
      setPasswordLoading(true);
      await api.patch("/auth/password", {
        currentPass: currentPassword,
        newPass: newPassword,
      });
      showToast(t.settings.toasts.passUpdated);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(err.response?.data?.message || t.settings.toasts.passError, "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  /* Экспорт данных в JSON */
  const handleExportData = async () => {
    try {
      showToast(t.settings.toasts.exportStarted, "info");
      const [resResp, japResp] = await Promise.all([
        showProgramming ? api.get("/resources") : Promise.resolve({ data: [] }),
        api.get(`/japanese?language=${studyLanguage}`),
      ]);

      const backupData = {
        version: "1.1",
        appName: "KAVAULT",
        exportedAt: new Date().toISOString(),
        user: {
          email: userEmail,
          username,
          studyLanguage,
          showProgramming,
        },
        settings: {
          theme,
          language,
          accentColor,
          goalResources,
          goalCards,
        },
        resources: resResp.data || [],
        japaneseCards: japResp.data || [],
      };

      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement("a");
      const datePart = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `kavault-backup-${datePart}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      showToast(t.settings.toasts.exportDone);
    } catch (e) {
      console.error(e);
      showToast(t.settings.toasts.exportError, "error");
    }
  };

  /* Импорт данных из JSON */
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast(t.settings.toasts.importStarted, "info");
      const text = await file.text();
      const parsed = JSON.parse(text);

      let importedResources = 0;
      let importedCards = 0;

      if (Array.isArray(parsed.resources)) {
        for (const item of parsed.resources) {
          try {
            await api.post("/resources", {
              title: item.title,
              url: item.url,
              type: item.type || "ARTICLE",
              status: item.status || "TO_LEARN",
              tags: item.tags || [],
            });
            importedResources++;
          } catch {
            // ignore
          }
        }
      }

      if (Array.isArray(parsed.japaneseCards)) {
        for (const card of parsed.japaneseCards) {
          try {
            await api.post("/japanese", {
              word: card.word,
              reading: card.reading,
              meaning: card.meaning,
              type: card.type || "VOCABULARY",
              language: card.language || studyLanguage,
            });
            importedCards++;
          } catch {
            // ignore
          }
        }
      }

      showToast(
        `${t.settings.toasts.importDonePrefix} ${importedResources} ${t.settings.toasts.importDoneMid} ${importedCards} ${t.settings.toasts.importDoneSuffix}`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      showToast(t.settings.toasts.importError, "error");
    }
  };

  /* Сброс прогресса SRS */
  const handleResetSRS = async () => {
    try {
      const resp = await api.get<any[]>(`/japanese?language=${studyLanguage}`);
      const cards = resp.data || [];
      for (const card of cards) {
        await api.post(`/japanese/${card.id}/review`, { isCorrect: false });
      }
      setIsResetSRSModalOpen(false);
      showToast(t.settings.toasts.srsResetDone);
    } catch {
      showToast(t.settings.toasts.srsResetError, "error");
    }
  };

  /* Очистка всех учебных материалов */
  const handleClearAllData = async () => {
    const confirmed = await confirmModal({
      title: t.settings.clearAllConfirmTitle,
      message: t.settings.clearAllConfirmMsg,
      confirmText: t.settings.clearAllConfirmBtn,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      if (showProgramming) {
        await api.delete("/resources/clear/all");
      }
      await api.delete(`/japanese/clear/all?language=${studyLanguage}`);
      unmarkPackClaimed(studyLanguageToPackType(studyLanguage));
      if (showProgramming) unmarkPackClaimed("all");
      setUserResources([]);
      setUserCards([]);
      setVaultStats({
        resourcesCount: 0,
        cardsCount: 0,
        totalNotes: 0,
      });
      showToast(t.settings.toasts.clearAllDone);
    } catch {
      showToast(t.settings.toasts.clearAllError, "error");
    }
  };

  /* Безвозвратное удаление аккаунта */
  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== "DELETE") {
      showToast(t.settings.toasts.deleteTypeError, "error");
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete("/auth/account");
      localStorage.clear();
      window.dispatchEvent(new Event("kavault-auth-changed"));
      navigate("/login");
    } catch (e: any) {
      showToast(e.response?.data?.message || t.settings.toasts.deleteError, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const [importingStarter, setImportingStarter] = useState<string | null>(null);

  /* Загрузка стартовых наборов данных */
  const handleLoadStarterPack = async (
    packType: "language" | "developer" | "github" | "all",
  ) => {
    const activeLangPack = studyLanguageToPackType(studyLanguage);
    try {
      setImportingStarter(packType);
      if (packType === "language" || packType === "all") {
        const items = getStarterCardsForStudy(studyLanguage, language);
        await api.post("/japanese/bulk", { items, language: studyLanguage });
        markPackClaimed(activeLangPack);
      }
      if (showProgramming && (packType === "developer" || packType === "all")) {
        await api.post("/resources/bulk", { items: STARTER_DEVELOPER_RESOURCES });
        markPackClaimed("developer");
      }
      if (showProgramming && (packType === "github" || packType === "all")) {
        await api.post("/resources/bulk", { items: STARTER_GITHUB_REPOSITORIES });
        markPackClaimed("github");
      }
      showToast(t.settings.toasts.starterLoaded);
      const [resResp, japResp] = await Promise.all([
        showProgramming
          ? api.get("/resources").catch(() => ({ data: [] }))
          : Promise.resolve({ data: [] }),
        api.get(`/japanese?language=${studyLanguage}`).catch(() => ({ data: [] })),
      ]);
      const resourcesList = resResp.data || [];
      const cardsList = japResp.data || [];
      const notesCount = resourcesList.filter((r: any) => Boolean(r.note)).length;
      setUserResources(resourcesList);
      setUserCards(cardsList);
      setVaultStats({
        resourcesCount: resourcesList.length,
        cardsCount: cardsList.length,
        totalNotes: notesCount,
      });
      evaluateAchievements({ resources: resourcesList, cards: cardsList });
    } catch (e: any) {
      showToast(e.response?.data?.message || t.settings.toasts.starterError, "error");
    } finally {
      setImportingStarter(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("kavault-auth-changed"));
    navigate("/login");
  };

  // Компактные подписи для мобильных + полные для ПК
  const tabsConfig = [
    { id: "appearance", shortLabel: "Тема", fullLabel: "Внешний вид", icon: Palette },
    { id: "account", shortLabel: "Профиль", fullLabel: "Профиль и Защита", icon: User },
    { id: "learning", shortLabel: "Обучение", fullLabel: "Цели и Обучение", icon: Target },
    { id: "vault", shortLabel: "Сервер", fullLabel: "Данные и Хранилище", icon: Database },
  ];

  return (
    <div className="kv-settings-root">
      {/* 100% защита от горизонтального скролла и вылезания за края на смартфонах */}
      <style>{`
        .kv-settings-root {
          display: flex;
          flex-direction: column;
          gap: 14px;
          max-width: 860px;
          width: 100%;
          margin: 0 auto;
          box-sizing: border-box;
          overflow-x: hidden;
        }

        @media (min-width: 640px) {
          .kv-settings-root {
            gap: 20px;
          }
        }

        /* ─── ВЕРХНЯЯ ШАПКА ─── */
        .kv-header-row {
          display: flex;
          justifyContent: space-between;
          align-items: center;
          gap: 12px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 639px) {
          .kv-header-row {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
        }

        /* ─── НАВИГАЦИОННЫЙ ТАБ-БАР (Никогда не вылезает за экран) ─── */
        .kv-settings-tabs-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 4px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 4px;
          width: 100%;
          box-sizing: border-box;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        @media (min-width: 640px) {
          .kv-settings-tabs-bar {
            display: inline-flex;
            width: fit-content;
            padding: 5px;
            gap: 6px;
            border-radius: 14px;
          }
        }

        .kv-settings-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          gap: 3px;
          padding: 8px 2px;
          min-height: 48px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.15s ease;
          -webkit-tap-highlight-color: transparent;
          min-width: 0;
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .kv-settings-tab-btn {
            flex-direction: row;
            gap: 8px;
            padding: 8px 16px;
            min-height: 40px;
            border-radius: 10px;
          }
        }

        .kv-settings-tab-btn:hover {
          color: var(--text-primary);
        }

        .kv-settings-tab-btn.active {
          background: var(--surface-raised);
          color: var(--text-primary);
          border-color: var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .kv-tab-label-short {
          font-size: 11px;
          font-weight: 600;
          line-height: 1;
          display: block;
        }

        .kv-tab-label-full {
          display: none;
        }

        @media (min-width: 640px) {
          .kv-tab-label-short {
            display: none;
          }
          .kv-tab-label-full {
            display: block;
            font-size: 13px;
            font-weight: 600;
            white-space: nowrap;
          }
        }

        /* ─── КАРТОЧКА СЕКЦИИ ─── */
        .kv-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 14px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          box-sizing: border-box;
          width: 100%;
          overflow: hidden;
        }

        @media (min-width: 640px) {
          .kv-card {
            padding: 20px;
            border-radius: 16px;
          }
        }

        /* ─── ШАПКА ГРУППЫ НАСТРОЕК ─── */
        .kv-group-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          width: 100%;
        }

        .kv-group-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--accent-soft);
          color: var(--accent);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .kv-group-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
          flex: 1;
        }

        .kv-group-title {
          margin: 0;
          font-size: 15px;
          font-weight: 600;
          line-height: 1.25;
          color: var(--text-primary);
        }

        .kv-group-desc {
          margin: 2px 0 0 0;
          font-size: 12px;
          line-height: 1.35;
          color: var(--text-muted);
        }

        /* ─── TOUCH КАРТОЧКИ ВЫБОРА ─── */
        .kv-touch-card {
          border: 2px solid var(--border);
          background: var(--surface-raised);
          border-radius: 12px;
          padding: 12px 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          min-height: 56px;
          box-sizing: border-box;
          width: 100%;
          transition: all 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .kv-touch-card:hover {
          border-color: var(--accent);
        }

        .kv-touch-card.selected {
          border-color: var(--accent);
          background: var(--accent-soft);
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.15);
        }

        .kv-item-icon-box {
          width: 34px;
          height: 34px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .kv-radio-check {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--border);
          background: var(--surface);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .kv-radio-check.active {
          border-color: var(--accent);
          background: var(--accent);
          box-shadow: 0 0 8px var(--accent);
        }

        /* ─── СЕТКА АКЦЕНТНЫХ ЦВЕТОВ (3 в ряд на телефоне) ─── */
        .kv-accent-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 360px) {
          .kv-accent-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 680px) {
          .kv-accent-grid {
            grid-template-columns: repeat(6, 1fr);
          }
        }

        .kv-color-btn {
          display: inline-flex;
          align-items: center;
          justifyContent: center;
          gap: 8px;
          padding: 0 8px;
          height: 42px;
          border-radius: 10px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-primary);
          cursor: pointer;
          transition: all 0.15s ease;
          box-sizing: border-box;
          min-width: 0;
          width: 100%;
        }

        .kv-color-btn.active {
          border-width: 2px;
          background: var(--surface-raised);
        }

        .kv-color-circle {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justifyContent: center;
          color: #ffffff;
          flex-shrink: 0;
        }

        /* ─── iOS СТИЛЬ ПЕРЕКЛЮЧАТЕЛЕЙ ─── */
        .kv-toggle-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 12px 14px;
          background: var(--surface-raised);
          border: 1px solid var(--border);
          border-radius: 12px;
          cursor: pointer;
          min-height: 54px;
          box-sizing: border-box;
          width: 100%;
          transition: all 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .kv-switch {
          width: 44px;
          height: 24px;
          background: var(--border);
          border-radius: 20px;
          padding: 2px;
          display: inline-flex;
          align-items: center;
          transition: background 0.25s ease;
          flex-shrink: 0;
        }

        .kv-switch.on {
          background: var(--success);
        }

        .kv-switch-handle {
          width: 20px;
          height: 20px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .kv-switch.on .kv-switch-handle {
          transform: translateX(20px);
        }

        .kv-lang-chip {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-primary);
          flex-shrink: 0;
        }

        /* ─── МОБИЛЬНЫЕ СЕТКИ (1 колонка на телефоне, 2-3 на ПК) ─── */
        .kv-grid-1-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 600px) {
          .kv-grid-1-2 {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .kv-grid-1-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 8px;
          width: 100%;
          box-sizing: border-box;
        }

        @media (min-width: 600px) {
          .kv-grid-1-3 {
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
          }
        }

        /* ─── ПОЛЯ ВВОДА С КНОПКАМИ ─── */
        .kv-field-row {
          display: flex;
          gap: 8px;
          align-items: center;
          width: 100%;
          box-sizing: border-box;
        }

        @media (max-width: 540px) {
          .kv-field-row {
            flex-direction: column;
            align-items: stretch;
          }
          .kv-field-row button {
            width: 100%;
          }
        }

        .kv-action-btn {
          height: 42px;
          font-size: 14px;
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
      `}</style>

      {/* Всплывающие Toast-уведомления */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "12px",
          right: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "10px 14px",
              backgroundColor: "var(--tooltip-bg)",
              border: `1px solid ${
                toast.type === "error"
                  ? "var(--error)"
                  : toast.type === "info"
                    ? "var(--accent)"
                    : "var(--success)"
              }`,
              borderRadius: "12px",
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "8px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              pointerEvents: "auto",
              margin: "0 auto",
              maxWidth: "400px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {toast.type === "error" ? (
              <TriangleAlert size={16} color="var(--error)" style={{ flexShrink: 0 }} />
            ) : toast.type === "info" ? (
              <Sparkles size={16} color="var(--accent)" style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0 }} />
            )}
            <span style={{ flex: 1, minWidth: 0 }}>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Верхняя шапка: Заголовок и кнопка Сохранить */}
      <div className="kv-header-row">
        <div>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.settings.pageTitle}
          </h2>
          <p style={{ color: "var(--text-muted)", margin: "3px 0 0 0", fontSize: "13px" }}>
            {t.settings.pageSubtitle}
          </p>
        </div>

        <Button onClick={handleSaveGeneral} className="kv-action-btn">
          <Save size={16} /> {t.settings.saveChanges}
        </Button>
      </div>

      {/* Панель разделов: Компактные надписи на мобильных, полные на ПК */}
      <div className="kv-settings-tabs-bar">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              className={`kv-settings-tab-btn ${isActive ? "active" : ""}`}
            >
              <Icon
                size={16}
                color={isActive ? "var(--accent)" : "currentColor"}
                style={{ flexShrink: 0 }}
              />
              <span className="kv-tab-label-short">{tab.shortLabel}</span>
              <span className="kv-tab-label-full">{tab.fullLabel}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ТАБ 1: ВНЕШНИЙ ВИД (APPEARANCE)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "appearance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {/* Тема оформления */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Palette size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">{t.settings.themeCardTitle}</h3>
                <p className="kv-group-desc">{t.settings.themeCardDesc}</p>
              </div>
            </div>

            <div className="kv-grid-1-2">
              {/* Темная тема */}
              <div
                onClick={() => {
                  setTheme("dark");
                  evaluateAchievements({ themeSwitched: true });
                  showToast("🌙 Тёмная тема активирована");
                }}
                className={`kv-touch-card ${theme === "dark" ? "selected" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    className="kv-item-icon-box"
                    style={{
                      background: "#09090b",
                      border: "1px solid #3f3f46",
                      color: "#60a5fa",
                    }}
                  >
                    <Moon size={17} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "14px" }}>
                      {t.settings.darkTitle}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                      Cyber-Obsidian
                    </div>
                  </div>
                </div>

                <div className={`kv-radio-check ${theme === "dark" ? "active" : ""}`}>
                  {theme === "dark" && <Check size={11} strokeWidth={3} />}
                </div>
              </div>

              {/* Светлая тема */}
              <div
                onClick={() => {
                  setTheme("light");
                  evaluateAchievements({ themeSwitched: true });
                  showToast("☀️ Светлая тема активирована");
                }}
                className={`kv-touch-card ${theme === "light" ? "selected" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    className="kv-item-icon-box"
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      color: "#f59e0b",
                    }}
                  >
                    <Sun size={17} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "14px" }}>
                      {t.settings.lightTitle}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                      Editorial Light
                    </div>
                  </div>
                </div>

                <div className={`kv-radio-check ${theme === "light" ? "active" : ""}`}>
                  {theme === "light" && <Check size={11} strokeWidth={3} />}
                </div>
              </div>
            </div>
          </div>

          {/* Акцентный цвет */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Sparkles size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">{t.settings.accentCardTitle}</h3>
                <p className="kv-group-desc">{t.settings.accentCardDesc}</p>
              </div>
            </div>

            <div className="kv-accent-grid">
              {ACCENT_COLORS.map((col) => {
                const isSelected = accentColor.toLowerCase() === col.value.toLowerCase();
                return (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => handleSelectAccent(col.value)}
                    className={`kv-color-btn ${isSelected ? "active" : ""}`}
                    style={{
                      borderColor: isSelected ? col.value : "var(--border)",
                    }}
                  >
                    <div
                      className="kv-color-circle"
                      style={{
                        backgroundColor: col.value,
                        boxShadow: isSelected ? `0 0 6px ${col.value}` : "none",
                      }}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: "12px", fontWeight: isSelected ? 600 : 500 }}>
                      {col.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Язык интерфейса приложения */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Globe size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">{t.settings.langCardTitle}</h3>
                <p className="kv-group-desc">{t.settings.langCardDesc}</p>
              </div>
            </div>

            <div className="kv-grid-1-3">
              {[
                { code: "ru", label: "Русский (RU)", codeLabel: "RU", sub: "Основной интерфейс" },
                { code: "en", label: "English (US)", codeLabel: "EN", sub: "International" },
                { code: "ja", label: "日本語 (JP)", codeLabel: "JA", sub: "ネイティブ表示" },
              ].map((langItem) => {
                const isCurrent = language === langItem.code;
                return (
                  <div
                    key={langItem.code}
                    onClick={() => {
                      setLanguage(langItem.code as any);
                      showToast(`Язык: ${langItem.label}`);
                    }}
                    className={`kv-touch-card ${isCurrent ? "selected" : ""}`}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <div className="kv-lang-chip">{langItem.codeLabel}</div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                          {langItem.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                          {langItem.sub}
                        </div>
                      </div>
                    </div>

                    <div className={`kv-radio-check ${isCurrent ? "active" : ""}`}>
                      {isCurrent && <Check size={11} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Звуковые эффекты и напоминания */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Sliders size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">Эффекты и Уведомления</h3>
                <p className="kv-group-desc">Звуки интерфейса и сохранение ударного режима</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Звук */}
              <div
                className="kv-toggle-row"
                onClick={() => {
                  const nextVal = !soundEffects;
                  setSoundEffects(nextVal);
                  localStorage.setItem("kavault_sound_fx", String(nextVal));
                  showToast(nextVal ? "Звуковые эффекты включены 🔊" : "Звук отключен 🔇");
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    className="kv-item-icon-box"
                    style={{
                      background: soundEffects ? "var(--accent-soft)" : "var(--surface)",
                      color: soundEffects ? "var(--accent)" : "var(--text-muted)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {soundEffects ? <Volume2 size={17} /> : <VolumeX size={17} />}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      Звуковые эффекты (SFX)
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Озвучка квизов, карточек и наград
                    </div>
                  </div>
                </div>

                <div className={`kv-switch ${soundEffects ? "on" : ""}`}>
                  <div className="kv-switch-handle" />
                </div>
              </div>

              {/* Уведомления */}
              <div
                className="kv-toggle-row"
                onClick={() => {
                  const nextVal = !notifications;
                  setNotifications(nextVal);
                  localStorage.setItem("kavault_notif", String(nextVal));
                  showToast(nextVal ? "Уведомления включены 🔔" : "Уведомления выключены 🔕");
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <div
                    className="kv-item-icon-box"
                    style={{
                      background: notifications ? "var(--accent-soft)" : "var(--surface)",
                      color: notifications ? "var(--accent)" : "var(--text-muted)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <Bell size={17} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      Напоминания об уроках
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Ежедневные пуши для сохранения стрика
                    </div>
                  </div>
                </div>

                <div className={`kv-switch ${notifications ? "on" : ""}`}>
                  <div className="kv-switch-handle" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          ТАБ 2: ПРОФИЛЬ И БЕЗОПАСНОСТЬ (ACCOUNT)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "account" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {/* Профиль */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <ShieldCheck size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">{t.settings.accountCardTitle}</h3>
                <p className="kv-group-desc">Ваш профиль и статус в системе KAVAULT</p>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px",
                backgroundColor: "var(--surface-raised)",
                borderRadius: "12px",
                marginBottom: "14px",
                border: "1px solid var(--border)",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "10px",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {username || t.settings.userDefault}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    marginTop: "1px",
                  }}
                >
                  {userEmail || t.settings.authorizedSession}
                </div>
              </div>

              {isCreator ? (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    padding: "4px 8px",
                    borderRadius: "8px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#f59e0b",
                    fontSize: "11px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <Crown size={12} />
                  <span>CREATOR</span>
                </div>
              ) : (
                <Badge variant="success">Онлайн</Badge>
              )}
            </div>

            {/* Редактирование никнейма */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                {t.settings.displayNameLabel}
              </label>
              <div className="kv-field-row">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Input
                    icon={<User size={16} />}
                    placeholder={t.settings.displayNamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveGeneral} className="kv-action-btn">
                  <Save size={15} /> Сохранить ник
                </Button>
              </div>
            </div>
          </div>

          {/* Смена пароля */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <KeyRound size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">Безопасность и пароль</h3>
                <p className="kv-group-desc">Смена текущего пароля для входа в ваш аккаунт</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
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
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
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
                  <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                    Подтвердите пароль
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    icon={<Lock size={16} />}
                    placeholder="Повтор пароля"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", marginTop: "2px" }}>
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
                  <span>{showPassword ? "Скрыть" : "Показать"}</span>
                </button>

                <Button type="submit" disabled={passwordLoading} className="kv-action-btn">
                  {passwordLoading ? "Обновление..." : "🔑 Обновить пароль"}
                </Button>
              </div>
            </form>
          </div>

          {/* Выход из сессии */}
          <div className="kv-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                Выход из аккаунта
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Завершить сессию на этом устройстве
              </div>
            </div>

            <Button variant="secondary" onClick={handleLogout} className="kv-action-btn" style={{ color: "var(--text-primary)" }}>
              <LogOut size={15} /> {t.dash.logout}
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          ТАБ 3: ОБУЧЕНИЕ И ЦЕЛИ (LEARNING)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "learning" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {/* Выбор изучаемого языка */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <BookOpen size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">Изучаемый язык платформы</h3>
                <p className="kv-group-desc">Слова, карточки SRS, аудирование и грамматика</p>
              </div>
            </div>

            <div className="kv-grid-1-3">
              {(["ja", "en", "de"] as StudyLanguage[]).map((code) => {
                const pal = STUDY_VIBE_PALETTES[code];
                const txt = STUDY_TEXTS[code][language];
                const isSelected = studyLanguage === code;
                return (
                  <div
                    key={code}
                    onClick={() => handleChangeStudyLanguage(code)}
                    className={`kv-touch-card ${isSelected ? "selected" : ""}`}
                    style={{
                      borderColor: isSelected ? pal.accentHex : "var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                      <div
                        className="kv-lang-chip"
                        style={{
                          borderColor: isSelected ? pal.accentHex : "var(--border)",
                          color: isSelected ? pal.accentHex : "var(--text-primary)",
                        }}
                      >
                        {code.toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                          {txt.name}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {txt.vibeBadge}
                        </div>
                      </div>
                    </div>

                    <div
                      className={`kv-radio-check ${isSelected ? "active" : ""}`}
                      style={{
                        backgroundColor: isSelected ? pal.accentHex : "var(--surface)",
                        borderColor: isSelected ? pal.accentHex : "var(--border)",
                      }}
                    >
                      {isSelected && <Check size={11} strokeWidth={3} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Режим Разработчика */}
          <div className="kv-card">
            <div
              className="kv-toggle-row"
              onClick={() => handleToggleProgramming(!showProgramming)}
              style={{
                border: "none",
                padding: 0,
                background: "transparent",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                <div
                  className="kv-item-icon-box"
                  style={{
                    backgroundColor: showProgramming ? "var(--accent-soft)" : "var(--surface-raised)",
                    color: showProgramming ? "var(--accent)" : "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Code2 size={18} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Хаб программирования и репозиториев
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                    {showProgramming
                      ? "Разделы Dev Hub и GitHub открыты в меню"
                      : "Разделы кода скрыты (только языковое обучение)"}
                  </div>
                </div>
              </div>

              <div className={`kv-switch ${showProgramming ? "on" : ""}`}>
                <div className="kv-switch-handle" />
              </div>
            </div>
          </div>

          {/* Ежедневные цели */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Target size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">Дневные цели обучения</h3>
                <p className="kv-group-desc">Сколько карточек и материалов вы планируете проходить за день</p>
              </div>
            </div>

            <div className="kv-grid-1-3">
              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Новых слов в день
                </label>
                <Input
                  type="number"
                  value={goalCards}
                  onChange={(e) => setGoalCards(e.target.value)}
                  placeholder="50"
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Лимит повторений SRS
                </label>
                <Input
                  type="number"
                  value={dailyCardsLimit}
                  onChange={(e) => setDailyCardsLimit(e.target.value)}
                  placeholder="20"
                />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "4px" }}>
                  Статей / ресурсов
                </label>
                <Input
                  type="number"
                  value={goalResources}
                  onChange={(e) => setGoalResources(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            <div style={{ marginTop: "12px", display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleSaveGeneral} className="kv-action-btn">
                <Save size={15} /> Сохранить цели
              </Button>
            </div>
          </div>

          {/* Стартовые наборы карточек */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Sparkles size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">Стартовые наборы материалов</h3>
                <p className="kv-group-desc">Загрузите готовые колоды слов и материалы в один клик</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {/* Языковой набор */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 12px",
                  background: "var(--surface-raised)",
                  borderRadius: "10px",
                  gap: "10px",
                  flexWrap: "wrap",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    Базовая колода ({STUDY_TEXTS[studyLanguage][language].name})
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Слова и иероглифы начального уровня
                  </div>
                </div>

                <Button
                  variant={isPackClaimed(studyLanguageToPackType(studyLanguage)) ? "secondary" : "primary"}
                  disabled={importingStarter === "language"}
                  onClick={() => handleLoadStarterPack("language")}
                  style={{ padding: "6px 14px", fontSize: "12px" }}
                >
                  {isPackClaimed(studyLanguageToPackType(studyLanguage))
                    ? "✓ Загружено"
                    : importingStarter === "language"
                      ? "Загрузка..."
                      : "📥 Загрузить"}
                </Button>
              </div>

              {/* Набор для программирования */}
              {showProgramming && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    background: "var(--surface-raised)",
                    borderRadius: "10px",
                    gap: "10px",
                    flexWrap: "wrap",
                    width: "100%",
                    boxSizing: "border-box",
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                      💻 Набор разработчика и GitHub
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      Подборка статей и полезных репозиториев
                    </div>
                  </div>

                  <Button
                    variant={isPackClaimed("developer") ? "secondary" : "primary"}
                    disabled={importingStarter === "developer"}
                    onClick={() => handleLoadStarterPack("developer")}
                    style={{ padding: "6px 14px", fontSize: "12px" }}
                  >
                    {isPackClaimed("developer")
                      ? "✓ Загружено"
                      : importingStarter === "developer"
                        ? "Загрузка..."
                        : "📥 Загрузить"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          ТАБ 4: БАЗА ДАННЫХ И СЕРВЕР (VAULT)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "vault" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {/* Сетевой адрес сервера API */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Globe size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">Сетевой адрес сервера (API)</h3>
                <p className="kv-group-desc">
                  Адрес бэкенда для синхронизации мобильного приложения и браузера
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
              <Input
                icon={<Globe size={16} />}
                placeholder="http://46.21.245.64:4000"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
              />

              <div className="kv-field-row">
                <Button onClick={handleSaveServerUrl} className="kv-action-btn">
                  <Save size={15} /> Сохранить адрес
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    localStorage.removeItem("kavault_api_url");
                    const def = getApiBaseURL();
                    setServerUrl(def);
                    showToast(`Адрес сброшен: ${def}`);
                  }}
                  className="kv-action-btn"
                >
                  <RefreshCw size={15} /> Сбросить по умолчанию
                </Button>
              </div>
            </div>
          </div>

          {/* Статистика и резервное копирование */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Database size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title">Резервные копии и статистика</h3>
                <p className="kv-group-desc">Выгружайте и восстанавливайте свои карточки и заметки в JSON</p>
              </div>
            </div>

            {/* Метрики хранилища */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "8px",
                marginBottom: "14px",
                width: "100%",
                boxSizing: "border-box",
              }}
            >
              <div style={{ textAlign: "center", padding: "10px 4px", background: "var(--surface-raised)", borderRadius: "10px" }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--accent)" }}>
                  {vaultStats.cardsCount}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                  Карточек
                </div>
              </div>

              <div style={{ textAlign: "center", padding: "10px 4px", background: "var(--surface-raised)", borderRadius: "10px" }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--success)" }}>
                  {vaultStats.resourcesCount}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                  Ресурсов
                </div>
              </div>

              <div style={{ textAlign: "center", padding: "10px 4px", background: "var(--surface-raised)", borderRadius: "10px" }}>
                <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {vaultStats.totalNotes}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
                  Заметок
                </div>
              </div>
            </div>

            {/* Кнопки экспорта и импорта */}
            <div className="kv-grid-1-2">
              <Button onClick={handleExportData} className="kv-action-btn">
                <Download size={15} /> Скачать бэкап (JSON)
              </Button>

              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="kv-action-btn"
              >
                <Upload size={15} /> Восстановить из JSON
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleImportFile}
              />
            </div>
          </div>

          {/* Опасная зона */}
          <div
            className="kv-card"
            style={{
              borderColor: "rgba(239, 68, 68, 0.35)",
              backgroundColor: "rgba(239, 68, 68, 0.03)",
            }}
          >
            <div className="kv-group-header">
              <div className="kv-group-icon" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "var(--error)" }}>
                <TriangleAlert size={18} />
              </div>
              <div className="kv-group-text">
                <h3 className="kv-group-title" style={{ color: "var(--error)" }}>
                  {t.settings.dangerZoneTitle}
                </h3>
                <p className="kv-group-desc">Операции необратимого сброса данных</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", width: "100%" }}>
              {/* Сброс прогресса SRS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: "10px 12px",
                  background: "var(--surface)",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  flexWrap: "wrap",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {t.settings.resetSrsTitle}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {t.settings.resetSrsDesc}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => setIsResetSRSModalOpen(true)}
                  style={{ gap: "6px", fontSize: "12px", padding: "6px 12px" }}
                >
                  <RotateCcw size={13} /> {t.settings.resetSrsBtn}
                </Button>
              </div>

              {/* Очистить все учебные материалы */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: "10px 12px",
                  background: "var(--surface)",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  flexWrap: "wrap",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {t.settings.clearAllTitle}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {t.settings.clearAllDesc}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleClearAllData}
                  style={{ gap: "6px", color: "var(--error)", fontSize: "12px", padding: "6px 12px" }}
                >
                  <Trash2 size={13} /> {t.settings.clearAllBtn}
                </Button>
              </div>

              {/* Удаление аккаунта */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "10px",
                  padding: "10px 12px",
                  background: "var(--surface)",
                  borderRadius: "10px",
                  border: "1px solid var(--border)",
                  flexWrap: "wrap",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--error)" }}>
                    {t.settings.deleteAccTitle}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    {t.settings.deleteAccDesc}
                  </div>
                </div>

                {isCreator ? (
                  <span
                    style={{
                      fontSize: "11px",
                      color: "#f59e0b",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    {t.settings.creatorProtectedBadge}
                  </span>
                ) : (
                  <Button
                    onClick={() => setIsDeleteAccountModalOpen(true)}
                    style={{ backgroundColor: "var(--error)", color: "#fff", border: "none", fontSize: "12px", padding: "6px 12px" }}
                  >
                    {t.settings.deleteAccBtn}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно: Сброс SRS */}
      <Modal
        isOpen={isResetSRSModalOpen}
        onClose={() => setIsResetSRSModalOpen(false)}
        title={t.settings.resetModalTitle}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            {t.settings.resetModalDesc}
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setIsResetSRSModalOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button onClick={handleResetSRS}>{t.settings.resetModalConfirm}</Button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно: Удаление аккаунта */}
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title={t.settings.deleteModalTitle}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "var(--error)", fontSize: "14px", margin: 0, fontWeight: 500 }}>
            {t.settings.deleteModalWarn}
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>
            {t.settings.deleteModalPromptPrefix} <strong>DELETE</strong> {t.settings.deleteModalPromptSuffix}
          </p>
          <Input
            value={deleteConfirmationInput}
            onChange={(e) => setDeleteConfirmationInput(e.target.value)}
            placeholder="DELETE"
          />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button
              variant="secondary"
              onClick={() => {
                setIsDeleteAccountModalOpen(false);
                setDeleteConfirmationInput("");
              }}
            >
              {t.common.cancel}
            </Button>
            <Button
              onClick={handleDeleteAccount}
              disabled={deleteConfirmationInput !== "DELETE" || isDeleting}
              style={{
                backgroundColor: "var(--error)",
                color: "#fff",
                border: "none",
              }}
            >
              {isDeleting ? t.settings.deletingBtn : t.settings.deleteModalBtn}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
