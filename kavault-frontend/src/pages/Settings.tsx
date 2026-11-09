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
} from "../data/starterPacks";

type SettingsTab = "appearance" | "account" | "learning" | "vault";

interface ToastMessage {
  id: number;
  text: string;
  type?: "success" | "error" | "info";
}

const ACCENT_COLORS = [
  { name: "Electric Blue", value: "#3b82f6" },
  { name: "Neon Purple", value: "#8b5cf6" },
  { name: "Emerald Green", value: "#10b981" },
  { name: "Amber Gold", value: "#f59e0b" },
  { name: "Rose Pink", value: "#ec4899" },
  { name: "Cyan Teal", value: "#06b6d4" },
];

export function Settings() {
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage, isCreator, activateCreatorMode } = useApp();
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
      showToast("Сброшено на дефолтный адрес http://localhost:4000");
      return;
    }
    localStorage.setItem("kavault_api_url", trimmed);
    showToast(`Сервер сохранён: ${trimmed}`);
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
    showToast(`Акцентный цвет обновлен на ${color}`);
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

    showToast("Настройки успешно сохранены!");
  };

  /* Активация режима Создателя */
  const handleActivateCreator = () => {
    if (!creatorPass.trim()) {
      showToast("Введите мастер-пароль Создателя", "error");
      return;
    }
    if (activateCreatorMode(creatorPass)) {
      showToast("👑 Режим Создателя успешно активирован! Панель Создателя открыта в меню.");
      setCreatorPass("");
    } else {
      showToast("Неверный мастер-пароль Создателя", "error");
    }
  };

  /* Смена пароля */
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
      showToast("Новые пароли не совпадают", "error");
      return;
    }

    try {
      setPasswordLoading(true);
      await api.patch("/auth/password", {
        currentPass: currentPassword,
        newPass: newPassword,
      });
      showToast("Пароль успешно изменен!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      showToast(err.response?.data?.message || "Ошибка смены пароля", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  /* Экспорт данных в JSON */
  const handleExportData = async () => {
    try {
      showToast("Формирование резервной копии...", "info");
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

      showToast("Резервная копия успешно скачана!");
    } catch (e) {
      console.error(e);
      showToast("Не удалось экспортировать данные", "error");
    }
  };

  /* Импорт данных из JSON */
  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      showToast("Чтение файла бэкапа...", "info");
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
        `Импорт завершен! Добавлено: ${importedResources} материалов, ${importedCards} карточек.`,
      );
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      showToast("Ошибка при чтении или обработке JSON файла", "error");
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
      showToast("Прогресс повторения всех карточек сброшен на уровень 0");
    } catch {
      showToast("Не удалось сбросить прогресс SRS", "error");
    }
  };

  /* Очистка всех учебных материалов без удаления аккаунта */
  const handleClearAllData = async () => {
    const confirmed = await confirmModal({
      title: "Очистить все материалы аккаунта?",
      message:
        "Все статьи, видео и документация Developer Hub, репозитории GitHub и японские карточки будут безвозвратно удалены. Сам ваш аккаунт останется активным. Вы уверены?",
      confirmText: "Да, очистить всё",
      cancelText: "Отмена",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete("/resources/clear/all");
      await api.delete("/japanese/clear/all");
      showToast("Все материалы и карточки успешно очищены!");
    } catch {
      showToast("Не удалось очистить материалы", "error");
    }
  };

  /* Безвозвратное удаление аккаунта */
  const handleDeleteAccount = async () => {
    if (deleteConfirmationInput !== "DELETE") {
      showToast("Введите DELETE для подтверждения", "error");
      return;
    }

    try {
      setIsDeleting(true);
      await api.delete("/auth/account");
      localStorage.clear();
      navigate("/login");
    } catch (e: any) {
      showToast(e.response?.data?.message || "Ошибка удаления аккаунта", "error");
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
      showToast("Стартовый набор успешно загружен в базу!");
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
      showToast(e.response?.data?.message || "Ошибка загрузки набора", "error");
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
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              padding: "10px 16px",
              backgroundColor: "rgba(24, 24, 27, 0.95)",
              border: `1px solid ${
                t.type === "error"
                  ? "var(--error)"
                  : t.type === "info"
                    ? "var(--accent)"
                    : "var(--success)"
              }`,
              borderRadius: "var(--radius-md)",
              color: "var(--text-primary)",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
              backdropFilter: "blur(8px)",
              animation: "fadeIn 0.2s ease",
            }}
          >
            {t.type === "error" ? (
              <TriangleAlert size={16} color="var(--error)" />
            ) : t.type === "info" ? (
              <Sparkles size={16} color="var(--accent)" />
            ) : (
              <CheckCircle2 size={16} color="var(--success)" />
            )}
            <span>{t.text}</span>
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
            Настройки
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
            Управление внешним видом, аккаунтом, целями и резервным копированием
          </p>
        </div>

        <Button onClick={handleSaveGeneral} style={{ gap: "8px" }}>
          <Save size={16} /> Сохранить изменения
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
          { id: "appearance", label: "Внешний вид", icon: Palette },
          { id: "account", label: "Профиль и Защита", icon: User },
          { id: "learning", label: "Цели и Обучение", icon: Target },
          { id: "vault", label: "Данные и Хранилище", icon: Database },
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
              Тема оформления
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              Выберите комфортный стиль для глаз. Переключение происходит мгновенно.
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
                    <span style={{ fontWeight: 600, color: "#f3f5f8" }}>Тёмная (Dark)</span>
                  </div>
                  {theme === "dark" && <CheckCircle2 size={18} color="var(--accent)" />}
                </div>
                <div style={{ fontSize: "12px", color: "#a0a7b4" }}>
                  Минималистичная ночная тема KAVAULT по умолчанию.
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
                    <span style={{ fontWeight: 600, color: "#09090b" }}>Светлая (Light)</span>
                  </div>
                  {theme === "light" && <CheckCircle2 size={18} color="var(--accent)" />}
                </div>
                <div style={{ fontSize: "12px", color: "#52525b" }}>
                  Высокая контрастность для чтения при ярком свете.
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
              Акцентный цвет интерфейса
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              Задает оттенок кнопок, свечения графа, бейджей и прогресс-баров.
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
                    {col.name}
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
              Язык системы (Language)
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              Интерфейс мгновенно адаптируется на выбранный язык.
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
              <ShieldCheck size={18} color="var(--accent)" /> Информация об учетной записи
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
                  {username || "Пользователь"}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                  {userEmail || "Авторизованная сессия"}
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
                <Badge variant="accent">Активен</Badge>
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
                  Отображаемое имя (Display Name)
                </label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ваше имя"
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
                  Email
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
              <Crown size={18} color="#f59e0b" /> Режим Создателя (Root Access)
            </h3>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 16px 0" }}>
              Предоставляет полный доступ к глобальной статистике KAVAULT, управлению пользователями и метрикам сервера.
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
                  <CheckCircle2 size={16} /> Права Создателя активны на этом устройстве
                </div>
                <Button variant="primary" onClick={() => navigate("/admin")}>
                  Открыть Панель Создателя →
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-end", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "220px", maxWidth: "340px" }}>
                  <Input
                    type="password"
                    placeholder="Мастер-пароль Создателя"
                    value={creatorPass}
                    onChange={(e) => setCreatorPass(e.target.value)}
                  />
                </div>
                <Button variant="secondary" onClick={handleActivateCreator}>
                  Активировать права
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
              <Lock size={18} color="var(--accent)" /> Изменение пароля
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
                  Текущий пароль
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
                    Новый пароль
                  </label>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Минимум 6 символов"
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
                    Подтвердите новый пароль
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
                  {showPassword ? "Скрыть пароли" : "Показать пароли"}
                </button>

                <Button type="submit" disabled={passwordLoading}>
                  {passwordLoading ? "Обновление..." : "Обновить пароль"}
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
                Выйти из текущего аккаунта
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Токен авторизации будет удален из этого браузера.
              </div>
            </div>
            <Button variant="secondary" onClick={handleLogout} style={{ gap: "6px" }}>
              <LogOut size={16} /> Выйти
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
              Недельные цели (Weekly Goals)
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 20px 0" }}>
              Цели отображаются на главной панели и мотивируют держать постоянный темп.
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
                  Статей / Ресурсов в неделю
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
                  Японских слов в неделю
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
                  Лимит новых слов в день
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
              Параметры сессии
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
                      Звуковые эффекты карточек
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Аудио-клик при перевороте и звуки верного ответа.
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
                      Напоминания о повторении (SRS)
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                      Подсвечивать готовые к повторению слова в навигации.
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
              <Database size={18} color="var(--accent)" /> Статистика хранилища (Vault Health)
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
                  Материалов в базе
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
                  Японских слов
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
                  Заметок и конспектов
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
              Резервное копирование и перенос
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              Вы полностью владеете своими знаниями. Скачивайте JSON или импортируйте обратно.
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
                <Download size={16} /> Экспортировать базу (JSON)
              </Button>

              {/* Импорт */}
              <Button
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                style={{ gap: "8px" }}
              >
                <Upload size={16} /> Импортировать из JSON
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
              <Sparkles size={18} color="var(--accent)" /> Стартовые наборы данных (Starter Packs)
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", margin: "0 0 16px 0" }}>
              Каждый стартовый набор можно активировать только 1 раз на аккаунт. После получения кнопка набора скрывается.
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
                    <span>Все доступные стартовые наборы уже успешно активированы на вашем аккаунте.</span>
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
                      <span>{importingStarter === "japanese" ? "Импорт..." : "Японский N5 (36 слов)"}</span>
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
                      <span>{importingStarter === "developer" ? "Импорт..." : "Dev Hub сниппеты (6 шт)"}</span>
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
                      <span>{importingStarter === "github" ? "Импорт..." : "GitHub проекты (4 шт)"}</span>
                    </Button>
                  )}

                  {!isJapClaimed && !isDevClaimed && !isGitClaimed && (
                    <Button
                      onClick={() => handleLoadStarterPack("all")}
                      disabled={importingStarter !== null}
                      style={{ gap: "8px", justifyContent: "flex-start", padding: "10px 14px" }}
                    >
                      <span>🚀</span>
                      <span>{importingStarter === "all" ? "Загрузка..." : "Загрузить всё сразу"}</span>
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
              <Smartphone size={18} color="var(--accent)" /> Сервер API (для iOS и ПК)
            </h3>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "14px",
                margin: "0 0 16px 0",
                lineHeight: 1.5,
              }}
            >
              Для подключения приложения с iPhone укажите локальный IP-адрес вашего компьютера в домашней Wi-Fi сети (например, <code>http://192.168.1.50:4000</code>) или адрес внешнего сервера.
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
                <Save size={16} /> Сохранить адрес
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
              <TriangleAlert size={18} /> Опасная зона (Danger Zone)
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
                  Сбросить прогресс интервального повторения
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Возвращает все японские слова на уровень 0 (слова не удаляются).
                </div>
              </div>
              <Button
                variant="secondary"
                onClick={() => setIsResetSRSModalOpen(true)}
                style={{ gap: "6px" }}
              >
                <RotateCcw size={14} /> Сбросить прогресс
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
                  Очистить все учебные материалы
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Удаляет все статьи Developer Hub, репозитории GitHub и японские карточки (аккаунт остаётся активным).
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
                <Trash2 size={14} /> Очистить всё
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
                  Удалить аккаунт и базу знаний навсегда
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  Безвозвратно удаляет аккаунт, все материалы, карточки и заметки.
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
                  🛡️ Аккаунт Создателя защищён
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
                  Удалить аккаунт
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
        title="Сброс прогресса повторения"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px", margin: 0 }}>
            Вы уверены, что хотите сбросить уровни всех японских карточек на 0? Карточки
            останутся в колоде, но система интервального повторения начнется заново.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
            <Button variant="secondary" onClick={() => setIsResetSRSModalOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleResetSRS}>Подтвердить сброс</Button>
          </div>
        </div>
      </Modal>

      {/* Модальное окно: Удаление аккаунта */}
      <Modal
        isOpen={isDeleteAccountModalOpen}
        onClose={() => setIsDeleteAccountModalOpen(false)}
        title="Удаление аккаунта KAVAULT"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <p style={{ color: "var(--error)", fontSize: "14px", margin: 0, fontWeight: 500 }}>
            ⚠️ Внимание! Это действие необратимо. Вся ваша база знаний, японские карточки и
            заметки будут стёрты навсегда.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "13px", margin: 0 }}>
            Для подтверждения введите слово <strong>DELETE</strong> ниже:
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
              Отмена
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
              {isDeleting ? "Удаление..." : "Удалить навсегда"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
