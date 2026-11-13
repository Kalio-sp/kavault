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
  { key: "blue" as const, value: "#3b82f6" },
  { key: "purple" as const, value: "#8b5cf6" },
  { key: "emerald" as const, value: "#10b981" },
  { key: "amber" as const, value: "#f59e0b" },
  { key: "rose" as const, value: "#ec4899" },
  { key: "cyan" as const, value: "#06b6d4" },
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
    studyPalette,
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
  const [userResources, setUserResources] = useState<Array<{ url: string }>>([]);
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
            // ignore duplicates
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
            // ignore duplicates
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
      setUserResources(showProgramming ? [] : userResources);
      setUserCards([]);
      setVaultStats({
        resourcesCount: showProgramming ? 0 : vaultStats.resourcesCount,
        cardsCount: 0,
        totalNotes: showProgramming ? 0 : vaultStats.totalNotes,
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

  const tabsConfig = [
    { id: "appearance", label: t.settings.tabs.appearance, icon: Palette, hint: "Тема, цвета, язык" },
    { id: "account", label: t.settings.tabs.account, icon: User, hint: "Профиль, пароль" },
    { id: "learning", label: t.settings.tabs.learning, icon: Target, hint: "Языки, цели, наборы" },
    { id: "vault", label: t.settings.tabs.vault, icon: Database, hint: "Сервер, бэкапы" },
  ];

  return (
    <div className="kv-settings-root">
      {/* Стили для идеальной мобильной адаптации и тач-контролов */}
      <style>{`
        .kv-settings-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
          max-width: 900px;
          margin: 0 auto;
          padding: 8px 12px 64px 12px;
          width: 100%;
        }

        @media (min-width: 640px) {
          .kv-settings-root {
            gap: 24px;
            padding: 16px 20px 48px 20px;
          }
        }

        /* Навигационная панель табов на мобильных */
        .kv-settings-tabs-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 6px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 6px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          position: sticky;
          top: 12px;
          z-index: 40;
          backdrop-filter: blur(12px);
        }

        .kv-settings-tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          gap: 4px;
          padding: 8px 4px;
          min-height: 52px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          -webkit-tap-highlight-color: transparent;
        }

        .kv-settings-tab-btn:active {
          transform: scale(0.96);
        }

        .kv-settings-tab-btn.active {
          background: var(--surface-raised);
          color: var(--text-primary);
          border-color: var(--border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        }

        .kv-settings-tab-title {
          font-size: 11px;
          font-weight: 600;
          line-height: 1.1;
          text-align: center;
        }

        @media (min-width: 640px) {
          .kv-settings-tab-btn {
            flex-direction: row;
            gap: 8px;
            padding: 10px 16px;
            min-height: 44px;
          }
          .kv-settings-tab-title {
            font-size: 13px;
          }
        }

        /* Карточка настроек */
        .kv-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 16px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        @media (min-width: 640px) {
          .kv-card {
            padding: 24px;
            border-radius: 18px;
          }
        }

        /* Заголовок группы настроек */
        .kv-group-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }

        .kv-group-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          background: var(--accent-soft);
          color: var(--accent);
          display: flex;
          align-items: center;
          justifyContent: center;
          flex-shrink: 0;
        }

        .kv-group-title {
          margin: 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .kv-group-desc {
          margin: 2px 0 0 0;
          font-size: 13px;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* Большие кликабельные карточки опций */
        .kv-touch-card {
          border: 2px solid var(--border);
          background: var(--surface-raised);
          border-radius: 14px;
          padding: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justifyContent: space-between;
          gap: 12px;
          transition: all 0.2s ease;
          -webkit-tap-highlight-color: transparent;
          min-height: 56px;
        }

        .kv-touch-card:hover {
          border-color: var(--accent);
        }

        .kv-touch-card:active {
          transform: scale(0.98);
        }

        .kv-touch-card.selected {
          border-color: var(--accent);
          background: var(--accent-soft);
          box-shadow: 0 0 16px rgba(59, 130, 246, 0.15);
        }

        /* Кнопка-переключатель в стиле iOS */
        .kv-toggle-row {
          display: flex;
          align-items: center;
          justifyContent: space-between;
          gap: 14px;
          padding: 14px;
          background: var(--surface-raised);
          border: 1px solid var(--border);
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.15s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .kv-toggle-row:active {
          transform: scale(0.99);
        }

        .kv-switch {
          width: 48px;
          height: 28px;
          background: var(--border);
          border-radius: 20px;
          padding: 3px;
          display: flex;
          align-items: center;
          transition: background 0.25s ease;
          flex-shrink: 0;
        }

        .kv-switch.on {
          background: var(--success);
        }

        .kv-switch-handle {
          width: 22px;
          height: 22px;
          background: #ffffff;
          border-radius: 50%;
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .kv-switch.on .kv-switch-handle {
          transform: translateX(20px);
        }

        /* Мобильные сетки */
        .kv-grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        @media (min-width: 600px) {
          .kv-grid-2 {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }

        .kv-grid-3 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }

        @media (min-width: 600px) {
          .kv-grid-3 {
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
          }
        }

        /* Touch-кнопки */
        .kv-action-btn {
          min-height: 46px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justifyContent: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
        }
      `}</style>

      {/* Всплывающие Toast-уведомления */}
      <div
        style={{
          position: "fixed",
          bottom: "20px",
          left: "16px",
          right: "16px",
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
              padding: "12px 18px",
              backgroundColor: "var(--tooltip-bg)",
              border: `1px solid ${
                toast.type === "error"
                  ? "var(--error)"
                  : toast.type === "info"
                    ? "var(--accent)"
                    : "var(--success)"
              }`,
              borderRadius: "14px",
              color: "var(--text-primary)",
              fontSize: "14px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              backdropFilter: "blur(12px)",
              pointerEvents: "auto",
              margin: "0 auto",
              maxWidth: "420px",
              width: "100%",
            }}
          >
            {toast.type === "error" ? (
              <TriangleAlert size={18} color="var(--error)" style={{ flexShrink: 0 }} />
            ) : toast.type === "info" ? (
              <Sparkles size={18} color="var(--accent)" style={{ flexShrink: 0 }} />
            ) : (
              <CheckCircle2 size={18} color="var(--success)" style={{ flexShrink: 0 }} />
            )}
            <span style={{ flex: 1 }}>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Верхняя шапка: Заголовок и быстрая кнопка Сохранить */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              margin: 0,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            {t.settings.pageTitle}
          </h2>
          <p style={{ color: "var(--text-muted)", margin: "4px 0 0 0", fontSize: "13px" }}>
            {t.settings.pageSubtitle}
          </p>
        </div>

        <Button onClick={handleSaveGeneral} className="kv-action-btn">
          <Save size={16} /> {t.settings.saveChanges}
        </Button>
      </div>

      {/* Навигационная панель разделов (Адаптирована под большие пальцы на телефоне) */}
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
                size={18}
                color={isActive ? "var(--accent)" : "currentColor"}
                style={{ flexShrink: 0 }}
              />
              <span className="kv-settings-tab-title">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          ТАБ 1: ВНЕШНИЙ ВИД (APPEARANCE)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "appearance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Тема оформления (Большие наглядные карточки) */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Palette size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">{t.settings.themeCardTitle}</h3>
                <p className="kv-group-desc">{t.settings.themeCardDesc}</p>
              </div>
            </div>

            <div className="kv-grid-2">
              {/* Темная тема */}
              <div
                onClick={() => {
                  setTheme("dark");
                  evaluateAchievements({ themeSwitched: true });
                  showToast("🌙 Тёмная тема активирована");
                }}
                className={`kv-touch-card ${theme === "dark" ? "selected" : ""}`}
                style={{
                  background: theme === "dark" ? "rgba(59, 130, 246, 0.12)" : "#131519",
                  borderColor: theme === "dark" ? "var(--accent)" : "var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "#09090b",
                      border: "1px solid #3f3f46",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#60a5fa",
                    }}
                  >
                    <Moon size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "#f4f4f5", fontSize: "15px" }}>
                      {t.settings.darkTitle}
                    </div>
                    <div style={{ fontSize: "12px", color: "#a1a1aa" }}>Cyber-Obsidian</div>
                  </div>
                </div>

                {theme === "dark" ? (
                  <Badge variant="accent">✓ Выбрано</Badge>
                ) : (
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Нажмите</span>
                )}
              </div>

              {/* Светлая тема */}
              <div
                onClick={() => {
                  setTheme("light");
                  evaluateAchievements({ themeSwitched: true });
                  showToast("☀️ Светлая тема активирована");
                }}
                className={`kv-touch-card ${theme === "light" ? "selected" : ""}`}
                style={{
                  background: theme === "light" ? "rgba(59, 130, 246, 0.12)" : "var(--surface-raised)",
                  borderColor: theme === "light" ? "var(--accent)" : "var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#f59e0b",
                    }}
                  >
                    <Sun size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "15px" }}>
                      {t.settings.lightTitle}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Editorial Light</div>
                  </div>
                </div>

                {theme === "light" ? (
                  <Badge variant="accent">✓ Выбрано</Badge>
                ) : (
                  <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Нажмите</span>
                )}
              </div>
            </div>
          </div>

          {/* Акцентный цвет (Крупные круглые кнопки с галочкой) */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">{t.settings.accentCardTitle}</h3>
                <p className="kv-group-desc">{t.settings.accentCardDesc}</p>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
                gap: "10px",
              }}
            >
              {ACCENT_COLORS.map((col) => {
                const isSelected = accentColor.toLowerCase() === col.value.toLowerCase();
                return (
                  <button
                    key={col.value}
                    type="button"
                    onClick={() => handleSelectAccent(col.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 14px",
                      minHeight: "48px",
                      borderRadius: "12px",
                      border: isSelected ? `2px solid ${col.value}` : "1px solid var(--border)",
                      backgroundColor: isSelected ? "var(--surface-raised)" : "var(--surface)",
                      color: "var(--text-primary)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                        backgroundColor: col.value,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#fff",
                        boxShadow: isSelected ? `0 0 10px ${col.value}` : "none",
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && <Check size={14} strokeWidth={3} />}
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: isSelected ? 600 : 500 }}>
                      {t.settings.accentNames[col.key]}
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
                <Globe size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">{t.settings.langCardTitle}</h3>
                <p className="kv-group-desc">{t.settings.langCardDesc}</p>
              </div>
            </div>

            <div className="kv-grid-3">
              {[
                { code: "ru", label: "Русский (RU)", flag: "🇷🇺", sub: "Основной язык" },
                { code: "en", label: "English (US)", flag: "🇬🇧", sub: "International" },
                { code: "ja", label: "日本語 (JP)", flag: "🇯🇵", sub: "ネイティブ表示" },
              ].map((langItem) => {
                const isCurrent = language === langItem.code;
                return (
                  <div
                    key={langItem.code}
                    onClick={() => {
                      setLanguage(langItem.code as any);
                      showToast(`Язык изменён: ${langItem.label}`);
                    }}
                    className={`kv-touch-card ${isCurrent ? "selected" : ""}`}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "24px" }}>{langItem.flag}</span>
                      <div>
                        <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                          {langItem.label}
                        </div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                          {langItem.sub}
                        </div>
                      </div>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 size={18} color="var(--accent)" />
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Выбрать</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Звуковые эффекты и уведомления (iOS-стиль переключателей) */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Sliders size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">Эффекты и Уведомления</h3>
                <p className="kv-group-desc">Настройте звуки интерфейса и напоминания об уроках</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: soundEffects ? "var(--accent)" : "var(--text-muted)" }}>
                    {soundEffects ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      Звуковые эффекты (SFX)
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Звуки карточек, квизов и получения наград
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
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ color: notifications ? "var(--accent)" : "var(--text-muted)" }}>
                    <Bell size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      Напоминания об обучении
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Ежедневные уведомления для сохранения ударного режима
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Карточка профиля */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">{t.settings.accountCardTitle}</h3>
                <p className="kv-group-desc">Ваш профиль и статус в системе KAVAULT</p>
              </div>
            </div>

            {/* Блок пользователя с аватаром */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "14px",
                backgroundColor: "var(--surface-raised)",
                borderRadius: "14px",
                marginBottom: "16px",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                  flexShrink: 0,
                }}
              >
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "16px",
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
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {userEmail || t.settings.authorizedSession}
                </div>
              </div>

              {isCreator ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 10px",
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    color: "#f59e0b",
                    fontSize: "12px",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  <Crown size={14} />
                  <span>CREATOR</span>
                </div>
              ) : (
                <Badge variant="success">Онлайн</Badge>
              )}
            </div>

            {/* Редактирование никнейма */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
                {t.settings.displayNameLabel}
              </label>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                  <Input
                    icon={<User size={16} />}
                    placeholder={t.settings.displayNamePlaceholder}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <Button onClick={handleSaveGeneral} className="kv-action-btn">
                  <Save size={16} /> Сохранить ник
                </Button>
              </div>
            </div>
          </div>

          {/* Смена пароля */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">Безопасность и пароль</h3>
                <p className="kv-group-desc">Смена текущего пароля для входа в ваш аккаунт</p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
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

              <div className="kv-grid-2">
                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                    Новый пароль
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    icon={<Lock size={16} />}
                    placeholder="Минимум 6 символов"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
                    Подтвердите пароль
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    icon={<Lock size={16} />}
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-muted)",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    cursor: "pointer",
                    padding: "6px 0",
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span>{showPassword ? "Скрыть символы" : "Показать пароль"}</span>
                </button>

                <Button type="submit" disabled={passwordLoading} className="kv-action-btn">
                  {passwordLoading ? "Обновление..." : "🔑 Обновить пароль"}
                </Button>
              </div>
            </form>
          </div>

          {/* Выход из сессии */}
          <div className="kv-card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
                Выход из аккаунта
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Завершить текущую сессию на этом устройстве
              </div>
            </div>

            <Button variant="secondary" onClick={handleLogout} className="kv-action-btn" style={{ color: "var(--text-primary)" }}>
              <LogOut size={16} /> {t.dash.logout}
            </Button>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          ТАБ 3: ОБУЧЕНИЕ И ЦЕЛИ (LEARNING)
      ══════════════════════════════════════════════════════════════════ */}
      {activeTab === "learning" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Выбор изучаемого языка */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">Изучаемый язык платформы</h3>
                <p className="kv-group-desc">Переключает колоды слов, аудирование, грамматику и культурную тему</p>
              </div>
            </div>

            <div className="kv-grid-3">
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
                      flexDirection: "column",
                      alignItems: "stretch",
                      gap: "8px",
                      padding: "16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "28px" }}>{pal.flag}</span>
                      {isSelected ? (
                        <Badge variant="accent">✓ Активен</Badge>
                      ) : (
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Нажмите для выбора</span>
                      )}
                    </div>

                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>
                        {txt.name}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {txt.vibeBadge}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Режим Разработчика и программирования */}
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
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: showProgramming ? "var(--accent-soft)" : "var(--surface-raised)",
                    color: showProgramming ? "var(--accent)" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Code2 size={22} />
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Хаб программирования и репозиториев
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
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

          {/* Ежедневные цели (Daily Goals) */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Target size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">Дневные цели обучения</h3>
                <p className="kv-group-desc">Сколько карточек и материалов вы планируете проходить за день</p>
              </div>
            </div>

            <div className="kv-grid-3">
              <div>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
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
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
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
                <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", display: "block", marginBottom: "6px" }}>
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

            <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={handleSaveGeneral} className="kv-action-btn">
                <Save size={16} /> Сохранить цели
              </Button>
            </div>
          </div>

          {/* Стартовые наборы карточек (Starter Packs) */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">Стартовые наборы материалов</h3>
                <p className="kv-group-desc">Загрузите готовые колоды слов и материалы в один клик</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {/* Языковой набор */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "var(--surface-raised)",
                  borderRadius: "12px",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {studyPalette.flag} Базовая колода ({STUDY_TEXTS[studyLanguage][language].name})
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    Базовые слова, иероглифы и фразы начального уровня
                  </div>
                </div>

                <Button
                  variant={isPackClaimed(studyLanguageToPackType(studyLanguage)) ? "secondary" : "primary"}
                  disabled={importingStarter === "language"}
                  onClick={() => handleLoadStarterPack("language")}
                  style={{ padding: "6px 14px", fontSize: "13px" }}
                >
                  {isPackClaimed(studyLanguageToPackType(studyLanguage))
                    ? "✓ Загружено"
                    : importingStarter === "language"
                      ? "Загрузка..."
                      : "📥 Загрузить"}
                </Button>
              </div>

              {/* Набор для программирования (если включен) */}
              {showProgramming && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: "var(--surface-raised)",
                    borderRadius: "12px",
                    gap: "10px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                      💻 Набор статей разработчика и GitHub
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Подборка лучших инструментов, архитектурных статей и библиотек
                    </div>
                  </div>

                  <Button
                    variant={isPackClaimed("developer") ? "secondary" : "primary"}
                    disabled={importingStarter === "developer"}
                    onClick={() => handleLoadStarterPack("developer")}
                    style={{ padding: "6px 14px", fontSize: "13px" }}
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
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Сетевой адрес сервера API */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Globe size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">Сетевой адрес сервера (API)</h3>
                <p className="kv-group-desc">
                  Адрес бэкенда для синхронизации мобильного приложения и браузера
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Input
                icon={<Globe size={16} />}
                placeholder="http://46.21.245.64:4000"
                value={serverUrl}
                onChange={(e) => setServerUrl(e.target.value)}
              />

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Button onClick={handleSaveServerUrl} className="kv-action-btn">
                  <Save size={16} /> Сохранить адрес
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
                  <RefreshCw size={16} /> Сбросить по умолчанию
                </Button>
              </div>
            </div>
          </div>

          {/* Статистика и резервное копирование */}
          <div className="kv-card">
            <div className="kv-group-header">
              <div className="kv-group-icon">
                <Database size={20} />
              </div>
              <div>
                <h3 className="kv-group-title">Резервные копии и статистика</h3>
                <p className="kv-group-desc">Выгружайте и восстанавливайте свои карточки и заметки в JSON</p>
              </div>
            </div>

            {/* Метрики хранилища */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginBottom: "16px",
              }}
            >
              <div style={{ textAlign: "center", padding: "12px", background: "var(--surface-raised)", borderRadius: "12px" }}>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--accent)" }}>
                  {vaultStats.cardsCount}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Карточек слов
                </div>
              </div>

              <div style={{ textAlign: "center", padding: "12px", background: "var(--surface-raised)", borderRadius: "12px" }}>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--success)" }}>
                  {vaultStats.resourcesCount}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Ресурсов
                </div>
              </div>

              <div style={{ textAlign: "center", padding: "12px", background: "var(--surface-raised)", borderRadius: "12px" }}>
                <div style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {vaultStats.totalNotes}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                  Заметок
                </div>
              </div>
            </div>

            {/* Кнопки экспорта и импорта */}
            <div className="kv-grid-2">
              <Button onClick={handleExportData} className="kv-action-btn">
                <Download size={16} /> Скачать бэкап (JSON)
              </Button>

              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                className="kv-action-btn"
              >
                <Upload size={16} /> Восстановить из JSON
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

          {/* Опасная зона (Danger Zone) */}
          <div
            className="kv-card"
            style={{
              borderColor: "rgba(239, 68, 68, 0.35)",
              backgroundColor: "rgba(239, 68, 68, 0.03)",
            }}
          >
            <div className="kv-group-header">
              <div className="kv-group-icon" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "var(--error)" }}>
                <TriangleAlert size={20} />
              </div>
              <div>
                <h3 className="kv-group-title" style={{ color: "var(--error)" }}>
                  {t.settings.dangerZoneTitle}
                </h3>
                <p className="kv-group-desc">Операции необратимого сброса данных</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {/* Сброс прогресса SRS */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "12px",
                  background: "var(--surface)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {t.settings.resetSrsTitle}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {t.settings.resetSrsDesc}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => setIsResetSRSModalOpen(true)}
                  style={{ gap: "6px" }}
                >
                  <RotateCcw size={14} /> {t.settings.resetSrsBtn}
                </Button>
              </div>

              {/* Очистить все учебные материалы */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "12px",
                  background: "var(--surface)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                    {t.settings.clearAllTitle}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {t.settings.clearAllDesc}
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={handleClearAllData}
                  style={{ gap: "6px", color: "var(--error)" }}
                >
                  <Trash2 size={14} /> {t.settings.clearAllBtn}
                </Button>
              </div>

              {/* Удаление аккаунта */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "12px",
                  background: "var(--surface)",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--error)" }}>
                    {t.settings.deleteAccTitle}
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {t.settings.deleteAccDesc}
                  </div>
                </div>

                {isCreator ? (
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#f59e0b",
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: "10px",
                      backgroundColor: "rgba(245, 158, 11, 0.1)",
                      border: "1px solid rgba(245, 158, 11, 0.2)",
                    }}
                  >
                    {t.settings.creatorProtectedBadge}
                  </span>
                ) : (
                  <Button
                    onClick={() => setIsDeleteAccountModalOpen(true)}
                    style={{ backgroundColor: "var(--error)", color: "#fff", border: "none" }}
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
