import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
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
  Smartphone,
  Globe,
  Crown,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { api } from "../api/axios";
import { confirmModal } from "../context/DialogContext";
import {
  STARTER_JAPANESE_CARDS,
  STARTER_DEVELOPER_RESOURCES,
  STARTER_GITHUB_REPOSITORIES,
  isPackClaimed,
  markPackClaimed,
  unmarkPackClaimed,
} from "../data/starterPacks";

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
  const { theme, setTheme, language, setLanguage, t, isCreator, activateCreatorMode } = useApp();
  const { evaluateAchievements } = useAchievements();

  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Профиль
  const [userEmail, setUserEmail] = useState("");
  const [creatorPass, setCreatorPass] = useState("");
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
  const [userCards, setUserCards] = useState<Array<{ word: string }>>([]);

  // Модальные окна подтверждения
  const [isResetSRSModalOpen, setIsResetSRSModalOpen] = useState(false);
  const [isDeleteAccountModalOpen, setIsDeleteAccountModalOpen] = useState(false);
  const [deleteConfirmationInput, setDeleteConfirmationInput] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [serverUrl, setServerUrl] = useState(() => {
    return localStorage.getItem("kavault_api_url") || "http://localhost:4000";
  });

  const handleSaveServerUrl = () => {
    const trimmed = serverUrl.trim();
    if (!trimmed) {
      localStorage.removeItem("kavault_api_url");
      setServerUrl("http://localhost:4000");
      showToast(`${t.settings.toasts.serverResetDefault} http://localhost:4000`);
      return;
    }
    localStorage.setItem("kavault_api_url", trimmed);
    showToast(`${t.settings.toasts.serverSaved} ${trimmed}`);
  };

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  /* Загрузка профиля и метрик хранилища */
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const [profileResp, resResp, japResp] = await Promise.all([
          api.get("/auth/profile").catch(() => ({ data: {} })),
          api.get("/resources").catch(() => ({ data: [] })),
          api.get("/japanese").catch(() => ({ data: [] })),
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
  }, []);

  /* Применение акцентного цвета */
  const handleSelectAccent = (color: string) => {
    setAccentColor(color);
    document.documentElement.style.setProperty("--accent", color);
    localStorage.setItem("kavault_accent", color);
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

    // Мгновенная проверка ачивок (включая секретную "Некий мистер А" при вводе никнейма)
    evaluateAchievements({
      username,
      userEmail,
    });

    showToast(t.settings.toasts.savedGeneral);
  };

  /* Активация режима Создателя */
  const handleActivateCreator = () => {
    if (!creatorPass.trim()) {
      showToast(t.settings.toasts.creatorPassRequired, "error");
      return;
    }
    if (activateCreatorMode(creatorPass)) {
      showToast(t.settings.toasts.creatorActivated);
      setCreatorPass("");
    } else {
      showToast(t.settings.toasts.creatorInvalid, "error");
    }
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
        api.get("/resources"),
        api.get("/japanese"),
      ]);

      const backupData = {
        version: "1.0",
        appName: "KAVAULT",
        exportedAt: new Date().toISOString(),
        user: {
          email: userEmail,
          username,
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

      // Восстанавливаем ресурсы
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
            // дубликаты или ошибки пропускаем
          }
        }
      }

      // Восстанавливаем карточки
      if (Array.isArray(parsed.japaneseCards)) {
        for (const card of parsed.japaneseCards) {
          try {
            await api.post("/japanese", {
              word: card.word,
              reading: card.reading,
              meaning: card.meaning,
              type: card.type || "VOCABULARY",
            });
            importedCards++;
          } catch {
            // пропускаем
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

  /* Сброс прогресса SRS (возврат уровней в 0) */
  const handleResetSRS = async () => {
    try {
      const resp = await api.get<any[]>("/japanese");
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

  /* Очистка всех учебных материалов без удаления аккаунта */
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
      await api.delete("/resources/clear/all");
      await api.delete("/japanese/clear/all");
      unmarkPackClaimed("all");
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
      navigate("/login");
    } catch (e: any) {
      showToast(e.response?.data?.message || t.settings.toasts.deleteError, "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const [importingStarter, setImportingStarter] = useState<string | null>(null);

  /* Загрузка стартовых наборов данных */
  const handleLoadStarterPack = async (packType: "japanese" | "developer" | "github" | "all") => {
    try {
      setImportingStarter(packType);
      if (packType === "japanese" || packType === "all") {
        await api.post("/japanese/bulk", { items: STARTER_JAPANESE_CARDS });
      }
      if (packType === "developer" || packType === "all") {
        await api.post("/resources/bulk", { items: STARTER_DEVELOPER_RESOURCES });
      }
      if (packType === "github" || packType === "all") {
        await api.post("/resources/bulk", { items: STARTER_GITHUB_REPOSITORIES });
      }
      markPackClaimed(packType);
      showToast(t.settings.toasts.starterLoaded);
      const [resResp, japResp] = await Promise.all([
        api.get("/resources").catch(() => ({ data: [] })),
        api.get("/japanese").catch(() => ({ data: [] })),
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
      evaluateAchievements();
    } catch (e: any) {
      showToast(e.response?.data?.message || t.settings.toasts.starterError, "error");
    } finally {
      setImportingStarter(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        maxWidth: "960px",
        margin: "0 auto",
      }}
    >
      {/* Toast-уведомления */}
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          zIndex: 1000,
        }}
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            style={{
              padding: "10px 16px",
              backgroundColor: "var(--tooltip-bg)",
              border: `1px solid ${
                toast.type === "error"
                  ? "var(--error)"
                  : toast.type === "info"
                    ? "var(--accent)"
                    : "var(--success)"
              }`,
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
              backdropFilter: "blur(8px)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {toast.type === "error" ? (
              <TriangleAlert size={16} color="var(--error)" />
            ) : toast.type === "info" ? (
              <Sparkles size={16} color="var(--accent)" />
            ) : (
              <CheckCircle2 size={16} color="var(--success)" />
            )}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>

      {/* Верхний заголовок и кнопка Сохранить */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 600,
              margin: "0 0 6px 0",
              color: "var(--text-primary)",
            }}
          >
            {t.settings.pageTitle}
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
            {t.settings.pageSubtitle}
          </p>
        </div>

        <Button onClick={handleSaveGeneral} style={{ gap: "8px" }}>
          <Save size={16} /> {t.settings.saveChanges}
        </Button>
      </div>

      {/* Горизонтальный Segmented Tabs Bar */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          borderBottom: "1px solid var(--border)",
          paddingBottom: "8px",
          overflowX: "auto",
        }}
      >
        {[
          { id: "appearance", label: t.settings.tabs.appearance, icon: Palette },
          { id: "account", label: t.settings.tabs.account, icon: User },
          { id: "learning", label: t.settings.tabs.learning, icon: Target },
          { id: "vault", label: t.settings.tabs.vault, icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SettingsTab)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: isActive ? "var(--surface-raised)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={16} color={isActive ? "var(--accent)" : "currentColor"} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ── ТАБ 1: ВНЕШНИЙ ВИД ── */}
      {activeTab === "appearance" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Тема оформления */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-4) 0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t.settings.themeCardTitle}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              {t.settings.themeCardDesc}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {/* Темная тема */}
              <div
                onClick={() => setTheme("dark")}
                style={{
                  border: `2px solid ${theme === "dark" ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "16px",
                  cursor: "pointer",
                  backgroundColor: "#0f1115",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Moon size={18} color="#60a5fa" />
                    <span style={{ fontWeight: 600, color: "#f3f5f8" }}>{t.settings.darkTitle}</span>
                  </div>
                  {theme === "dark" && <CheckCircle2 size={18} color="var(--accent)" />}
                </div>
                <div style={{ fontSize: "12px", color: "#a0a7b4" }}>
                  {t.settings.darkDesc}
                </div>
              </div>

              {/* Светлая тема */}
              <div
                onClick={() => setTheme("light")}
                style={{
                  border: `2px solid ${theme === "light" ? "var(--accent)" : "var(--border)"}`,
                  borderRadius: "var(--radius-lg)",
                  padding: "16px",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sun size={18} color="#f59e0b" />
                    <span style={{ fontWeight: 600, color: "#09090b" }}>{t.settings.lightTitle}</span>
                  </div>
                  {theme === "light" && <CheckCircle2 size={18} color="var(--accent)" />}
                </div>
                <div style={{ fontSize: "12px", color: "#52525b" }}>
                  {t.settings.lightDesc}
                </div>
              </div>
            </div>
          </Card>

          {/* Акцентный цвет */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-2) 0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t.settings.accentCardTitle}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              {t.settings.accentCardDesc}
            </p>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {ACCENT_COLORS.map((col) => {
                const isSelected = accentColor.toLowerCase() === col.value.toLowerCase();
                return (
                  <button
                    key={col.value}
                    onClick={() => handleSelectAccent(col.value)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "8px 14px",
                      borderRadius: "var(--radius-md)",
                      border: isSelected
                        ? `2px solid ${col.value}`
                        : "1px solid var(--border)",
                      backgroundColor: isSelected
                        ? "var(--surface-raised)"
                        : "var(--surface)",
                      color: "var(--text-primary)",
                      fontSize: "13px",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        backgroundColor: col.value,
                        boxShadow: isSelected ? `0 0 8px ${col.value}` : "none",
                      }}
                    />
                    {t.settings.accentNames[col.key]}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Язык интерфейса */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-2) 0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t.settings.langCardTitle}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              {t.settings.langCardDesc}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "var(--space-3)",
              }}
            >
              {[
                { code: "ru", label: "Русский (RU)", flag: "🇷🇺" },
                { code: "en", label: "English (US)", flag: "🇺🇸" },
                { code: "ja", label: "日本語 (JP)", flag: "🇯🇵" },
              ].map((langItem) => {
                const isCurrent = language === langItem.code;
                return (
                  <div
                    key={langItem.code}
                    onClick={() => setLanguage(langItem.code as any)}
                    style={{
                      border: `1px solid ${isCurrent ? "var(--accent)" : "var(--border)"}`,
                      backgroundColor: isCurrent
                        ? "var(--surface-raised)"
                        : "var(--surface)",
                      borderRadius: "var(--radius-md)",
                      padding: "12px 14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "18px" }}>{langItem.flag}</span>
                      <span style={{ fontSize: "14px", fontWeight: 500 }}>
                        {langItem.label}
                      </span>
                    </div>
                    {isCurrent && <CheckCircle2 size={16} color="var(--accent)" />}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ── ТАБ 2: ПРОФИЛЬ И БЕЗОПАСНОСТЬ ── */}
      {activeTab === "account" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Информация об аккаунте */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-4) 0",
                fontSize: "16px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ShieldCheck size={18} color="var(--accent)" /> {t.settings.accountCardTitle}
            </h3>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px",
                backgroundColor: "var(--surface-raised)",
                borderRadius: "var(--radius-md)",
                marginBottom: "var(--space-4)",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  backgroundColor: "var(--accent)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {username || t.settings.userDefault}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {userEmail || t.settings.authorizedSession}
                </div>
              </div>
              {isCreator ? (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    backgroundColor: "rgba(245, 158, 11, 0.15)",
                    color: "#f59e0b",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  👑 CREATOR
                </span>
              ) : (
                <Badge variant="accent">{t.settings.activeBadge}</Badge>
              )}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  {t.settings.displayNameLabel}
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.settings.displayNamePlaceholder}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  {t.settings.emailLabel}
                </label>
                <Input value={userEmail} disabled style={{ opacity: 0.6 }} />
              </div>
            </div>
          </Card>

          {/* Режим Создателя (Root Access) */}
          <Card
            style={{
              padding: "var(--space-6)",
              border: isCreator ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid var(--border)",
              backgroundColor: isCreator ? "rgba(245, 158, 11, 0.04)" : "var(--surface)",
            }}
          >
            <h3
              style={{
                margin: "0 0 6px 0",
                fontSize: "16px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: isCreator ? "#f59e0b" : "var(--text-primary)",
              }}
            >
              <Crown size={18} color="#f59e0b" /> {t.settings.creatorCardTitle}
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px 0" }}>
              {t.settings.creatorCardDesc}
            </p>

            {isCreator ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    color: "#10b981",
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  <CheckCircle2 size={16} /> {t.settings.creatorActiveMsg}
                </div>
                <Button variant="primary" onClick={() => navigate("/admin")}>
                  {t.settings.openCreatorPanelBtn}
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "220px", maxWidth: "340px" }}>
                  <Input
                    type="password"
                    placeholder={t.settings.creatorPassPlaceholder}
                    value={creatorPass}
                    onChange={(e) => setCreatorPass(e.target.value)}
                  />
                </div>
                <Button variant="secondary" onClick={handleActivateCreator}>
                  {t.settings.activateRightsBtn}
                </Button>
              </div>
            )}
          </Card>

          {/* Смена пароля */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-4) 0",
                fontSize: "16px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Lock size={18} color="var(--accent)" /> {t.settings.passwordCardTitle}
            </h3>

            <form
              onSubmit={handleChangePassword}
              style={{ display: "flex", flexDirection: "column", gap: "14px" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginBottom: "6px",
                  }}
                >
                  {t.settings.currentPassLabel}
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "var(--space-4)",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    {t.settings.newPassLabel}
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder={t.settings.newPassPlaceholder}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      marginBottom: "6px",
                    }}
                  >
                    {t.settings.confirmPassLabel}
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "6px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-muted)",
                    cursor: "pointer",
                    fontSize: "13px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  {showPassword ? t.settings.hidePasswords : t.settings.showPasswords}
                </button>

                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? t.settings.updatingPassBtn : t.settings.updatePassBtn}
                </Button>
              </div>
            </form>
          </Card>

          {/* Завершение сессии */}
          <Card
            style={{
              padding: "var(--space-5)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                {t.settings.logoutCardTitle}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {t.settings.logoutCardDesc}
              </div>
            </div>
            <Button variant="secondary" onClick={handleLogout} style={{ gap: "6px" }}>
              <LogOut size={16} /> {t.settings.logoutBtn}
            </Button>
          </Card>
        </div>
      )}

      {/* ── ТАБ 3: ЦЕЛИ И ОБУЧЕНИЕ ── */}
      {activeTab === "learning" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-2) 0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t.settings.goalsCardTitle}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 20px 0" }}>
              {t.settings.goalsCardDesc}
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "var(--space-5)",
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  {t.settings.weeklyResLabel}
                </label>
                <Input
                  type="number"
                  min="1"
                  max="100"
                  value={goalResources}
                  onChange={(e) => setGoalResources(e.target.value)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  {t.settings.weeklyCardsLabel}
                </label>
                <Input
                  type="number"
                  min="5"
                  max="500"
                  value={goalCards}
                  onChange={(e) => setGoalCards(e.target.value)}
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  {t.settings.dailyLimitLabel}
                </label>
                <Input
                  type="number"
                  min="5"
                  max="100"
                  value={dailyCardsLimit}
                  onChange={(e) => setDailyCardsLimit(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Дополнительные параметры обучения */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-4) 0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t.settings.sessionCardTitle}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Звуковые эффекты */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      padding: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--surface-raised)",
                    }}
                  >
                    {soundEffects ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {t.settings.soundFxLabel}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {t.settings.soundFxDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEffects}
                  onChange={(e) => setSoundEffects(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
              </label>

              {/* Уведомления */}
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div
                    style={{
                      padding: "8px",
                      borderRadius: "50%",
                      backgroundColor: "var(--surface-raised)",
                    }}
                  >
                    <Bell size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500 }}>
                      {t.settings.notifLabel}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      {t.settings.notifDesc}
                    </div>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{ width: "18px", height: "18px", cursor: "pointer" }}
                />
              </label>
            </div>
          </Card>
        </div>
      )}

      {/* ── ТАБ 4: ДАННЫЕ И ХРАНИЛИЩЕ ── */}
      {activeTab === "vault" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          {/* Статистика базы */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-4) 0",
                fontSize: "16px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Database size={18} color="var(--accent)" /> {t.settings.vaultStatsTitle}
            </h3>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              <div
                style={{
                  padding: "14px",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {t.settings.statsResources}
                </div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {vaultStats.resourcesCount}
                </div>
              </div>

              <div
                style={{
                  padding: "14px",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {t.settings.statsCards}
                </div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {vaultStats.cardsCount}
                </div>
              </div>

              <div
                style={{
                  padding: "14px",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {t.settings.statsNotes}
                </div>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {vaultStats.totalNotes}
                </div>
              </div>
            </div>
          </Card>

          {/* Резервное копирование и Импорт */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-2) 0",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              {t.settings.backupTitle}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              {t.settings.backupDesc}
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              {/* Экспорт */}
              <Button onClick={handleExportData} style={{ gap: "8px" }}>
                <Download size={16} /> {t.settings.exportJsonBtn}
              </Button>

              {/* Импорт */}
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                style={{ gap: "8px" }}
              >
                <Upload size={16} /> {t.settings.importJsonBtn}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                style={{ display: "none" }}
                onChange={handleImportFile}
              />
            </div>
          </Card>

          {/* Стартовые наборы данных */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-2) 0",
                fontSize: "16px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Sparkles size={18} color="var(--accent)" /> {t.settings.starterPacksTitle}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              {t.settings.starterPacksDesc}
            </p>

            {(() => {
              const isJapClaimed = isPackClaimed("japanese", userCards);
              const isDevClaimed = isPackClaimed("developer", undefined, userResources);
              const isGitClaimed = isPackClaimed("github", undefined, userResources);
              const allClaimed = isJapClaimed && isDevClaimed && isGitClaimed;

              if (allClaimed) {
                return (
                  <div
                    style={{
                      padding: "16px",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "var(--radius-md)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      color: "var(--success)",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    <CheckCircle2 size={18} />
                    <span>{t.settings.starterAllActivated}</span>
                  </div>
                );
              }

              return (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "12px",
                  }}
                >
                  {!isJapClaimed && (
                    <Button
                      variant="secondary"
                      onClick={() => handleLoadStarterPack("japanese")}
                      disabled={importingStarter !== null}
                      style={{ gap: "8px", justifyContent: "flex-start", padding: "10px 14px" }}
                    >
                      <span>🌸</span>
                      <span>{importingStarter === "japanese" ? t.settings.loadingText : t.settings.starterJapBtn}</span>
                    </Button>
                  )}

                  {!isDevClaimed && (
                    <Button
                      variant="secondary"
                      onClick={() => handleLoadStarterPack("developer")}
                      disabled={importingStarter !== null}
                      style={{ gap: "8px", justifyContent: "flex-start", padding: "10px 14px" }}
                    >
                      <span>💻</span>
                      <span>{importingStarter === "developer" ? t.settings.loadingText : t.settings.starterDevBtn}</span>
                    </Button>
                  )}

                  {!isGitClaimed && (
                    <Button
                      variant="secondary"
                      onClick={() => handleLoadStarterPack("github")}
                      disabled={importingStarter !== null}
                      style={{ gap: "8px", justifyContent: "flex-start", padding: "10px 14px" }}
                    >
                      <span>🐙</span>
                      <span>{importingStarter === "github" ? t.settings.loadingText : t.settings.starterGitBtn}</span>
                    </Button>
                  )}

                  {!isJapClaimed && !isDevClaimed && !isGitClaimed && (
                    <Button
                      onClick={() => handleLoadStarterPack("all")}
                      disabled={importingStarter !== null}
                      style={{ gap: "8px", justifyContent: "flex-start", padding: "10px 14px" }}
                    >
                      <span>🚀</span>
                      <span>{importingStarter === "all" ? t.settings.loadingText : t.settings.starterAllBtn}</span>
                    </Button>
                  )}
                </div>
              );
            })()}
          </Card>

          {/* Сервер синхронизации для iOS и ПК */}
          <Card style={{ padding: "var(--space-6)" }}>
            <h3
              style={{
                margin: "0 0 var(--space-2) 0",
                fontSize: "16px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Smartphone size={18} color="var(--accent)" /> {t.settings.apiServerTitle}
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                margin: "0 0 16px 0",
                lineHeight: 1.5,
              }}
            >
              {t.settings.apiServerDescPrefix}{" "}
              <code>http://192.168.1.50:4000</code>
              {t.settings.apiServerDescSuffix}
            </p>

            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: "1 1 280px" }}>
                <Input
                  icon={<Globe size={16} />}
                  placeholder="http://localhost:4000"
                  value={serverUrl}
                  onChange={(e) => setServerUrl(e.target.value)}
                />
              </div>
              <Button onClick={handleSaveServerUrl} style={{ gap: "6px" }}>
                <Save size={16} /> {t.settings.saveAddressBtn}
              </Button>
            </div>
          </Card>

          {/* Опасные операции */}
          <Card
            style={{
              padding: "var(--space-6)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                fontWeight: 600,
                color: "var(--error)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <TriangleAlert size={18} /> {t.settings.dangerZoneTitle}
            </h3>

            {/* Сброс прогресса SRS */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>
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
                justifyContent: "space-between",
                alignItems: "center",
                padding: "12px 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ fontWeight: 500, color: "var(--text-primary)" }}>
                  {t.settings.clearAllTitle}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {t.settings.clearAllDesc}
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={handleClearAllData}
                style={{
                  gap: "6px",
                  color: "var(--text-muted)",
                  borderColor: "var(--border)",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                <Trash2 size={14} /> {t.settings.clearAllBtn}
              </Button>
            </div>

            {/* Безвозвратное удаление аккаунта */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "6px",
              }}
            >
              <div>
                <div style={{ fontWeight: 500, color: "var(--error)" }}>
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
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    border: "1px solid rgba(245, 158, 11, 0.2)",
                  }}
                >
                  {t.settings.creatorProtectedBadge}
                </span>
              ) : (
                <Button
                  onClick={() => setIsDeleteAccountModalOpen(true)}
                  style={{
                    backgroundColor: "var(--error)",
                    color: "#fff",
                    border: "none",
                  }}
                >
                  {t.settings.deleteAccBtn}
                </Button>
              )}
            </div>
          </Card>
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
