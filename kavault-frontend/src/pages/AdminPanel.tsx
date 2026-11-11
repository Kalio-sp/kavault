import { useState, useEffect, useMemo } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
import { Modal } from "../components/ui/Modal";
import {
  Crown,
  Users,
  Database,
  Cpu,
  Trash2,
  Sparkles,
  Download,
  RotateCw,
  Search,
  ShieldCheck,
  CheckCircle2,
  TriangleAlert,
  Plus,
  Lock,
  Volume2,
  Code2,
  FileText,
  Globe,
  ExternalLink,
} from "lucide-react";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import { confirmModal, alertModal } from "../context/DialogContext";
import type { Language } from "../i18n/translations";

interface GlobalStats {
  totalUsers: number;
  recentUsers7d?: number;
  onboardedUsers?: number;
  programmingUsers?: number;
  languageBreakdown?: Record<string, number>;
  totalResources: number;
  totalRepositories?: number;
  totalPassages?: number;
  totalCards: number;
  masteredCards?: number;
  cardsByLanguage?: Record<string, number>;
  ttsCache?: { entries: number; bytes: number };
  system: {
    nodeVersion: string;
    uptimeSeconds: number;
    memoryRssMb: number;
    memoryHeapUsedMb: number;
    platform: string;
    status: string;
    dbLatencyMs?: number;
  };
}

interface UserRow {
  id: string;
  email: string;
  studyLanguage?: string;
  showProgramming?: boolean;
  onboardingCompleted?: boolean;
  createdAt: string;
  isCreator: boolean;
  role: string;
  _count: {
    resources: number;
    japaneseCards: number;
    studyPassages?: number;
  };
}

interface UserDetails extends UserRow {
  updatedAt: string;
  achievementsCount: number;
  recentResources: Array<{
    id: string;
    title: string;
    url: string;
    type: string;
    status: string;
    createdAt: string;
  }>;
  recentCards: Array<{
    id: string;
    word: string;
    meaning: string;
    type: string;
    language: string;
    studyLevel?: string | null;
    level: number;
  }>;
  recentPassages: Array<{
    id: string;
    title: string;
    language: string;
    kind: string;
    level: string;
  }>;
}

const ADMIN_EXTRA: Record<
  Language,
  {
    new7d: string;
    onboarded: string;
    reposLabel: string;
    passagesLabel: string;
    masteredLabel: string;
    dbLatencyLabel: string;
    uptimeLabel: string;
    ttsTitle: string;
    ttsEntries: string;
    flushTtsBtn: string;
    createUserBtn: string;
    createUserTitle: string;
    emailPh: string;
    passwordPh: string;
    langLabel: string;
    progLabel: string;
    onboardLabel: string;
    createConfirmBtn: string;
    bulkDeleteBtn: string;
    bulkConfirmTitle: string;
    bulkConfirmMsg: string;
    allFilter: string;
    devOffFilter: string;
    colsStudy: string;
    colsTexts: string;
    inspectBtn: string;
    exportUserBtn: string;
    purgeUserBtn: string;
    purgeConfirmTitle: string;
    purgeConfirmMsg: string;
    inspectTitle: string;
    achievementsLabel: string;
    editUserSection: string;
    resetPassPh: string;
    saveChangesBtn: string;
    recentResourcesTitle: string;
    recentCardsTitle: string;
    noItems: string;
    userCreatedMsg: string;
    userUpdatedMsg: string;
    userPurgedMsg: string;
    ttsClearedMsg: string;
    userExportedMsg: string;
  }
> = {
  ru: {
    new7d: "за 7 дн.",
    onboarded: "Прошли старт:",
    reposLabel: "GitHub",
    passagesLabel: "текстов",
    masteredLabel: "освоено",
    dbLatencyLabel: "БД пинг",
    uptimeLabel: "Аптайм",
    ttsTitle: "Кэш озвучки (TTS)",
    ttsEntries: "аудиоклипов в RAM",
    flushTtsBtn: "Очистить кэш TTS",
    createUserBtn: "Создать аккаунт",
    createUserTitle: "Создать нового пользователя",
    emailPh: "Email нового пользователя",
    passwordPh: "Пароль (от 6 символов)",
    langLabel: "Изучаемый язык",
    progLabel: "Показывать Dev Hub и GitHub",
    onboardLabel: "Пропустить стартовый выбор при входе",
    createConfirmBtn: "Создать пользователя",
    bulkDeleteBtn: "Удалить выбранных",
    bulkConfirmTitle: "Удалить выбранные аккаунты?",
    bulkConfirmMsg: "Выбранные пользователи и все их данные будут безвозвратно удалены с сервера и из PostgreSQL.",
    allFilter: "Все",
    devOffFilter: "Без Dev Hub",
    colsStudy: "Профиль",
    colsTexts: "Тексты",
    inspectBtn: "Управление и просмотр",
    exportUserBtn: "Бэкап пользователя JSON",
    purgeUserBtn: "Очистить данные аккаунта",
    purgeConfirmTitle: "Очистить данные пользователя?",
    purgeConfirmMsg: "Все карточки, материалы и тексты будут удалены, но сам логин останется.",
    inspectTitle: "Профиль пользователя",
    achievementsLabel: "Достижений:",
    editUserSection: "Управление аккаунтом и сброс пароля",
    resetPassPh: "Новый пароль (оставьте пустым, чтобы не менять)",
    saveChangesBtn: "Сохранить изменения",
    recentResourcesTitle: "Последние материалы и GitHub",
    recentCardsTitle: "Последние карточки слов",
    noItems: "Пока пусто",
    userCreatedMsg: "Пользователь успешно создан",
    userUpdatedMsg: "Параметры пользователя обновлены",
    userPurgedMsg: "Данные пользователя очищены",
    ttsClearedMsg: "Кэш серверной озвучки очищен",
    userExportedMsg: "Бэкап пользователя скачан",
  },
  en: {
    new7d: "in 7d",
    onboarded: "Onboarded:",
    reposLabel: "GitHub",
    passagesLabel: "passages",
    masteredLabel: "mastered",
    dbLatencyLabel: "DB ping",
    uptimeLabel: "Uptime",
    ttsTitle: "Server TTS Cache",
    ttsEntries: "audio clips cached",
    flushTtsBtn: "Flush TTS Cache",
    createUserBtn: "Create User",
    createUserTitle: "Provision New User Account",
    emailPh: "User email address",
    passwordPh: "Password (min 6 chars)",
    langLabel: "Study Language",
    progLabel: "Enable Dev Hub & GitHub",
    onboardLabel: "Skip initial onboarding",
    createConfirmBtn: "Create User",
    bulkDeleteBtn: "Delete Selected",
    bulkConfirmTitle: "Delete selected accounts?",
    bulkConfirmMsg: "Selected accounts and all their database records will be permanently removed from the server.",
    allFilter: "All",
    devOffFilter: "No Dev Hub",
    colsStudy: "Profile",
    colsTexts: "Passages",
    inspectBtn: "Inspect & Manage",
    exportUserBtn: "Export User JSON",
    purgeUserBtn: "Purge User Data",
    purgeConfirmTitle: "Wipe user study data?",
    purgeConfirmMsg: "All cards, resources, and passages will be erased while keeping the login active.",
    inspectTitle: "User Inspector",
    achievementsLabel: "Achievements:",
    editUserSection: "Account Controls & Password Reset",
    resetPassPh: "New password (leave empty to keep current)",
    saveChangesBtn: "Save Changes",
    recentResourcesTitle: "Recent Resources & GitHub",
    recentCardsTitle: "Recent Flashcards",
    noItems: "Nothing yet",
    userCreatedMsg: "User created successfully",
    userUpdatedMsg: "User settings updated",
    userPurgedMsg: "User content purged",
    ttsClearedMsg: "Server TTS cache flushed",
    userExportedMsg: "User JSON backup downloaded",
  },
  ja: {
    new7d: "週間新規",
    onboarded: "初期設定済:",
    reposLabel: "GitHub",
    passagesLabel: "文章",
    masteredLabel: "習得",
    dbLatencyLabel: "DB応答",
    uptimeLabel: "稼働時間",
    ttsTitle: "サーバーTTSキャッシュ",
    ttsEntries: "件の音声をキャッシュ",
    flushTtsBtn: "TTSキャッシュ削除",
    createUserBtn: "ユーザー作成",
    createUserTitle: "新規ユーザーを作成",
    emailPh: "メールアドレス",
    passwordPh: "パスワード（6文字以上）",
    langLabel: "学習言語",
    progLabel: "開発者ハブ・GitHubを有効化",
    onboardLabel: "オンボーディングをスキップ",
    createConfirmBtn: "作成する",
    bulkDeleteBtn: "選択を削除",
    bulkConfirmTitle: "選択したアカウントを削除しますか？",
    bulkConfirmMsg: "選択されたユーザーと全データはサーバーおよびDBから完全に削除されます。",
    allFilter: "すべて",
    devOffFilter: "開発非表示",
    colsStudy: "設定",
    colsTexts: "文章",
    inspectBtn: "詳細・管理",
    exportUserBtn: "ユーザー別JSON出力",
    purgeUserBtn: "学習データのみ消去",
    purgeConfirmTitle: "学習データを消去しますか？",
    purgeConfirmMsg: "カードや資料はすべて削除されますが、ログインアカウントは残ります。",
    inspectTitle: "ユーザー詳細管理",
    achievementsLabel: "獲得実績:",
    editUserSection: "設定編集・パスワード再設定",
    resetPassPh: "新しいパスワード（変更しない場合は空欄）",
    saveChangesBtn: "変更を保存",
    recentResourcesTitle: "最近のリソース",
    recentCardsTitle: "最近の単語カード",
    noItems: "データなし",
    userCreatedMsg: "ユーザーを作成しました",
    userUpdatedMsg: "ユーザー設定を更新しました",
    userPurgedMsg: "ユーザーデータを消去しました",
    ttsClearedMsg: "TTSキャッシュを削除しました",
    userExportedMsg: "ユーザーデータを保存しました",
  },
};

function formatUptime(totalSec?: number): string {
  if (!totalSec) return "0m";
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatBytes(bytes = 0): string {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
}

function getLangFlag(code?: string): string {
  if (code === "en") return "🇬🇧 EN";
  if (code === "de") return "🇩🇪 DE";
  return "🇯🇵 JA";
}

function triggerJsonDownload(payload: unknown, filename: string) {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(payload, null, 2));
  const a = document.createElement("a");
  a.setAttribute("href", dataStr);
  a.setAttribute("download", filename);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function AdminPanel() {
  const { t, locale, language } = useApp();
  const ui = ADMIN_EXTRA[language];

  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [userFilter, setUserFilter] = useState<"ALL" | "ja" | "en" | "de" | "NO_DEV">("ALL");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());

  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  // Модалка создания пользователя
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newLang, setNewLang] = useState<"ja" | "en" | "de">("ja");
  const [newShowProg, setNewShowProg] = useState(true);
  const [newOnboarded, setNewOnboarded] = useState(false);
  const [creatingUser, setCreatingUser] = useState(false);

  // Модалка детального управления пользователем
  const [inspectData, setInspectData] = useState<UserDetails | null>(null);
  const [editLang, setEditLang] = useState<"ja" | "en" | "de">("ja");
  const [editShowProg, setEditShowProg] = useState(true);
  const [editOnboarded, setEditOnboarded] = useState(true);
  const [editNewPass, setEditNewPass] = useState("");
  const [savingUserEdit, setSavingUserEdit] = useState(false);

  const showStatus = (text: string, type: "success" | "error" | "info" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4200);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsResp, usersResp] = await Promise.all([
        api.get<GlobalStats>("/admin/stats"),
        api.get<UserRow[]>("/admin/users"),
      ]);
      setStats(statsResp.data);
      setUsers(usersResp.data);
      setSelectedIds(new Set());
    } catch (e: any) {
      console.error(e);
      showStatus(e.response?.data?.message || t.admin.toasts.loadErr, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openInspectModal = async (userId: string) => {
    try {
      const resp = await api.get<UserDetails>(`/admin/users/${userId}`);
      const d = resp.data;
      setInspectData(d);
      setEditLang(
        d.studyLanguage === "en" || d.studyLanguage === "de" ? d.studyLanguage : "ja",
      );
      setEditShowProg(d.showProgramming !== false);
      setEditOnboarded(d.onboardingCompleted !== false);
      setEditNewPass("");
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.loadErr, "error");
    }
  };

  const handleSaveUserEdit = async () => {
    if (!inspectData) return;
    try {
      setSavingUserEdit(true);
      await api.patch(`/admin/users/${inspectData.id}`, {
        studyLanguage: editLang,
        showProgramming: editShowProg,
        onboardingCompleted: editOnboarded,
        ...(editNewPass.trim() ? { newPassword: editNewPass.trim() } : {}),
      });
      showStatus(`${ui.userUpdatedMsg}: ${inspectData.email}`);
      setEditNewPass("");
      await Promise.all([loadData(), openInspectModal(inspectData.id)]);
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.loadErr, "error");
    } finally {
      setSavingUserEdit(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || newPassword.length < 6) return;
    try {
      setCreatingUser(true);
      const resp = await api.post("/admin/users", {
        email: newEmail.trim(),
        password: newPassword,
        studyLanguage: newLang,
        showProgramming: newShowProg,
        onboardingCompleted: newOnboarded,
      });
      showStatus(`${ui.userCreatedMsg}: ${resp.data.email}`);
      setIsCreateOpen(false);
      setNewEmail("");
      setNewPassword("");
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.loadErr, "error");
    } finally {
      setCreatingUser(false);
    }
  };

  const handleExportSingleUser = async (user: Pick<UserRow, "id" | "email">) => {
    try {
      const resp = await api.get(`/admin/users/${user.id}/export`);
      const datePart = new Date().toISOString().split("T")[0];
      const safeName = user.email.replace(/[^a-zA-Z0-9._-]/g, "_");
      triggerJsonDownload(resp.data, `kavault-user-${safeName}-${datePart}.json`);
      showStatus(`${ui.userExportedMsg}: ${user.email}`);
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.exportErr, "error");
    }
  };

  const handlePurgeUser = async (user: Pick<UserRow, "id" | "email" | "isCreator">) => {
    if (user.isCreator) return;
    const confirmed = await confirmModal({
      title: ui.purgeConfirmTitle,
      message: `${user.email}: ${ui.purgeConfirmMsg}`,
      confirmText: ui.purgeUserBtn,
      cancelText: t.common.cancel,
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const resp = await api.delete(`/admin/users/${user.id}/data`);
      showStatus(resp.data?.message || ui.userPurgedMsg);
      await loadData();
      if (inspectData?.id === user.id) {
        await openInspectModal(user.id);
      }
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.deleteErr, "error");
    }
  };

  const handleDeleteUser = async (user: Pick<UserRow, "id" | "email" | "isCreator">) => {
    if (user.isCreator) {
      await alertModal({
        title: t.admin.blockedTitle,
        message: t.admin.blockedMsg,
        variant: "warning",
      });
      return;
    }

    const confirmed = await confirmModal({
      title: t.admin.deleteConfirmTitle,
      message: `${t.admin.deleteConfirmMsgPrefix} «${user.email}»${t.admin.deleteConfirmMsgSuffix}`,
      confirmText: t.admin.deleteConfirmBtn,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      showStatus(`${t.admin.toasts.userDeleted}: ${user.email}`);
      if (inspectData?.id === user.id) {
        setInspectData(null);
      }
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.deleteErr, "error");
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    const confirmed = await confirmModal({
      title: ui.bulkConfirmTitle,
      message: `${ui.bulkConfirmMsg} (${selectedIds.size})`,
      confirmText: `${ui.bulkDeleteBtn} (${selectedIds.size})`,
      cancelText: t.common.cancel,
      variant: "danger",
    });
    if (!confirmed) return;

    try {
      const resp = await api.post("/admin/users/bulk-delete", {
        ids: [...selectedIds],
      });
      showStatus(resp.data?.message || t.admin.toasts.userDeleted);
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.deleteErr, "error");
    }
  };

  const handleFlushTts = async () => {
    try {
      const resp = await api.post("/admin/clear-tts-cache");
      showStatus(resp.data?.message || ui.ttsClearedMsg);
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.loadErr, "error");
    }
  };

  const handleSeedDemo = async () => {
    const confirmed = await confirmModal({
      title: t.admin.seedConfirmTitle,
      message: t.admin.seedConfirmMsg,
      confirmText: t.admin.seedConfirmBtn,
      cancelText: t.common.cancel,
      variant: "info",
    });
    if (!confirmed) return;

    try {
      showStatus(t.admin.toasts.seeding, "info");
      const resp = await api.post("/admin/seed-demo");
      showStatus(resp.data.message || t.admin.toasts.seedDone);
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.seedErr, "error");
    }
  };

  const handleExportAll = async () => {
    try {
      showStatus(t.admin.toasts.exporting, "info");
      const resp = await api.get("/admin/export-all");
      const datePart = new Date().toISOString().split("T")[0];
      triggerJsonDownload(resp.data, `kavault-SYSTEM-FULL-BACKUP-${datePart}.json`);
      showStatus(t.admin.toasts.exportDone);
    } catch {
      showStatus(t.admin.toasts.exportErr, "error");
    }
  };

  const filteredUsers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return users.filter((u) => {
      if (userFilter === "NO_DEV" && u.showProgramming !== false) return false;
      if (
        (userFilter === "ja" || userFilter === "en" || userFilter === "de") &&
        (u.studyLanguage || "ja") !== userFilter
      ) {
        return false;
      }
      if (!q) return true;
      return u.email.toLowerCase().includes(q);
    });
  }, [users, searchQuery, userFilter]);

  const deletableVisible = filteredUsers.filter((u) => !u.isCreator);
  const allVisibleSelected =
    deletableVisible.length > 0 &&
    deletableVisible.every((u) => selectedIds.has(u.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(deletableVisible.map((u) => u.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        maxWidth: "1180px",
        margin: "0 auto",
      }}
    >
      {/* Статус-сообщения */}
      {statusMessage && (
        <div
          style={{
            padding: "12px 18px",
            backgroundColor: "var(--tooltip-bg)",
            border: `1px solid ${
              statusMessage.type === "error"
                ? "var(--error)"
                : statusMessage.type === "info"
                  ? "#f59e0b"
                  : "var(--success)"
            }`,
            borderRadius: "var(--radius-md)",
            color: "var(--text-primary)",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
          }}
        >
          {statusMessage.type === "error" ? (
            <TriangleAlert size={18} color="var(--error)" />
          ) : (
            <CheckCircle2 size={18} color="var(--success)" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Золотой Hero-блок Создателя */}
      <Card
        style={{
          padding: "var(--space-6)",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, var(--surface) 62%)",
          border: "1px solid rgba(245, 158, 11, 0.38)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              backgroundColor: "rgba(245, 158, 11, 0.2)",
              border: "2px solid #f59e0b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#f59e0b",
              boxShadow: "0 0 18px rgba(245, 158, 11, 0.28)",
              flexShrink: 0,
            }}
          >
            <Crown size={28} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  margin: 0,
                  color: "var(--text-primary)",
                }}
              >
                {t.admin.title}
              </h2>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "2px 8px",
                  borderRadius: "4px",
                  backgroundColor: "#f59e0b",
                  color: "#000",
                }}
              >
                {t.admin.superadminBadge}
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0", fontSize: "14px" }}>
              {t.admin.authorizedAsPrefix} <strong>zerkalovandrey@kavoult.dev</strong>{" "}
              {t.admin.authorizedAsSuffix}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={loadData} style={{ gap: "6px" }}>
            <RotateCw size={14} /> {t.admin.refreshBtn}
          </Button>
          <Button
            onClick={() => setIsCreateOpen(true)}
            style={{ gap: "6px", backgroundColor: "#f59e0b", color: "#000", border: "none", fontWeight: 700 }}
          >
            <Plus size={15} /> {ui.createUserBtn}
          </Button>
        </div>
      </Card>

      {/* Метрики системы в реальном времени */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <Card style={{ padding: "var(--space-5)", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Users size={16} color="var(--accent)" /> {t.admin.totalUsers}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <span style={{ fontSize: "30px", fontWeight: 700, color: "var(--text-primary)" }}>
              {stats?.totalUsers ?? "..."}
            </span>
            {typeof stats?.recentUsers7d === "number" && (
              <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--success)" }}>
                +{stats.recentUsers7d} {ui.new7d}
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px", display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span>
              🇯🇵 {stats?.languageBreakdown?.ja ?? 0} · 🇬🇧 {stats?.languageBreakdown?.en ?? 0} · 🇩🇪{" "}
              {stats?.languageBreakdown?.de ?? 0}
            </span>
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Database size={16} color="#10b981" /> {t.admin.vaultObjects}
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "var(--text-primary)" }}>
            {(stats?.totalResources ?? 0) +
              (stats?.totalRepositories ?? 0) +
              (stats?.totalCards ?? 0) +
              (stats?.totalPassages ?? 0)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            {stats?.totalResources ?? 0} {t.admin.materialsSuffix} · {stats?.totalRepositories ?? 0}{" "}
            {ui.reposLabel} · {stats?.totalCards ?? 0} {t.admin.cardsSuffix} ({stats?.masteredCards ?? 0}{" "}
            {ui.masteredLabel})
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Cpu size={16} color="#f59e0b" /> {t.admin.serverStatus}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <span style={{ fontSize: "26px", fontWeight: 700, color: "var(--success)" }}>
              {stats?.system.status ?? "ONLINE"}
            </span>
            {typeof stats?.system.dbLatencyMs === "number" && (
              <span style={{ fontSize: "12px", color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
                {ui.dbLatencyLabel}: {stats.system.dbLatencyMs}ms
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            {stats?.system.nodeVersion} · {ui.uptimeLabel} {formatUptime(stats?.system.uptimeSeconds)} · RSS{" "}
            {stats?.system.memoryRssMb ?? 0} MB
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Volume2 size={16} color="#a855f7" /> {ui.ttsTitle}
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700, color: "var(--text-primary)" }}>
            {stats?.ttsCache?.entries ?? 0}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "6px" }}>
            {ui.ttsEntries} · {formatBytes(stats?.ttsCache?.bytes)}
          </div>
        </Card>
      </div>

      {/* Инструменты Создателя */}
      <Card style={{ padding: "var(--space-5)", borderRadius: "16px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 12px 0" }}>
          {t.admin.creatorToolsTitle}
        </h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={handleExportAll} style={{ gap: "8px" }}>
            <Download size={16} /> {t.admin.exportAllBtn}
          </Button>
          <Button variant="secondary" onClick={handleSeedDemo} style={{ gap: "8px" }}>
            <Sparkles size={16} /> {t.admin.seedDemoPackBtn}
          </Button>
          <Button variant="secondary" onClick={handleFlushTts} style={{ gap: "8px" }}>
            <Volume2 size={16} /> {ui.flushTtsBtn}
          </Button>
          {selectedIds.size > 0 && (
            <Button
              onClick={handleBulkDelete}
              style={{ gap: "8px", backgroundColor: "var(--error)", color: "#fff", border: "none" }}
            >
              <Trash2 size={15} /> {ui.bulkDeleteBtn} ({selectedIds.size})
            </Button>
          )}
        </div>
      </Card>

      {/* Реестр пользователей KAVAULT */}
      <Card style={{ padding: "var(--space-6)", borderRadius: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-4)",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div>
            <h3 style={{ margin: "0 0 4px 0", fontSize: "17px", fontWeight: 600 }}>
              {t.admin.usersRegistryTitle} ({filteredUsers.length}/{users.length})
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              {t.admin.manageAccountsDesc}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ width: "240px" }}>
              <Input
                icon={<Search size={15} />}
                placeholder={t.admin.searchEmailPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Быстрые фильтры пользователей */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "var(--space-4)" }}>
          {(
            [
              { id: "ALL", label: ui.allFilter },
              { id: "ja", label: "🇯🇵 JA" },
              { id: "en", label: "🇬🇧 EN" },
              { id: "de", label: "🇩🇪 DE" },
              { id: "NO_DEV", label: ui.devOffFilter },
            ] as const
          ).map((f) => {
            const active = userFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setUserFilter(f.id)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "999px",
                  border: `1px solid ${active ? "#f59e0b" : "var(--border)"}`,
                  backgroundColor: active ? "rgba(245, 158, 11, 0.16)" : "var(--surface-raised)",
                  color: active ? "#f59e0b" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            {t.admin.loadingUsers}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "12px",
                    textTransform: "uppercase",
                  }}
                >
                  <th style={{ padding: "12px 8px", width: "32px" }}>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      disabled={deletableVisible.length === 0}
                      style={{ cursor: "pointer" }}
                    />
                  </th>
                  <th style={{ padding: "12px 12px" }}>{t.admin.cols.email}</th>
                  <th style={{ padding: "12px 12px" }}>{t.admin.cols.role}</th>
                  <th style={{ padding: "12px 12px" }}>{ui.colsStudy}</th>
                  <th style={{ padding: "12px 12px" }}>{t.admin.cols.registered}</th>
                  <th style={{ padding: "12px 12px" }}>{t.admin.cols.resources}</th>
                  <th style={{ padding: "12px 12px" }}>{t.admin.cols.words}</th>
                  <th style={{ padding: "12px 12px" }}>{ui.colsTexts}</th>
                  <th style={{ padding: "12px 12px", textAlign: "right" }}>{t.admin.cols.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    style={{
                      borderBottom: "1px solid var(--border)",
                      transition: "background-color 0.15s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "var(--surface-raised)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    <td style={{ padding: "12px 8px" }}>
                      {!u.isCreator && (
                        <input
                          type="checkbox"
                          checked={selectedIds.has(u.id)}
                          onChange={() => toggleSelectRow(u.id)}
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </td>
                    <td style={{ padding: "12px 12px", fontWeight: 500 }}>
                      <button
                        type="button"
                        onClick={() => openInspectModal(u.id)}
                        style={{
                          background: "none",
                          border: "none",
                          padding: 0,
                          color: "var(--text-primary)",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          fontSize: "14px",
                        }}
                      >
                        {u.isCreator && <Crown size={15} color="#f59e0b" />}
                        <span style={{ textDecoration: "underline", textDecorationColor: "var(--border)" }}>
                          {u.email}
                        </span>
                      </button>
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      {u.isCreator ? (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            backgroundColor: "rgba(245, 158, 11, 0.15)",
                            color: "#f59e0b",
                            border: "1px solid rgba(245, 158, 11, 0.3)",
                          }}
                        >
                          CREATOR
                        </span>
                      ) : (
                        <Badge variant="default">USER</Badge>
                      )}
                    </td>
                    <td style={{ padding: "12px 12px" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "6px",
                            backgroundColor: "var(--surface-raised)",
                            border: "1px solid var(--border)",
                          }}
                        >
                          {getLangFlag(u.studyLanguage)}
                        </span>
                        {u.showProgramming !== false && (
                          <span title="Dev Hub Enabled" style={{ color: "var(--accent)", display: "inline-flex" }}>
                            <Code2 size={13} />
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: "12px 12px", color: "var(--text-muted)", fontSize: "13px" }}>
                      {new Date(u.createdAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={{ padding: "12px 12px" }}>{u._count.resources}</td>
                    <td style={{ padding: "12px 12px" }}>{u._count.japaneseCards}</td>
                    <td style={{ padding: "12px 12px" }}>{u._count.studyPassages ?? 0}</td>
                    <td style={{ padding: "12px 12px", textAlign: "right" }}>
                      <div style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                        <Button
                          variant="secondary"
                          onClick={() => openInspectModal(u.id)}
                          style={{ padding: "4px 8px" }}
                          title={ui.inspectBtn}
                        >
                          <FileText size={14} />
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => handleExportSingleUser(u)}
                          style={{ padding: "4px 8px" }}
                          title={ui.exportUserBtn}
                        >
                          <Download size={14} />
                        </Button>
                        {u.isCreator ? (
                          <span
                            style={{
                              fontSize: "12px",
                              color: "var(--text-muted)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                              marginLeft: "4px",
                            }}
                          >
                            <ShieldCheck size={14} color="#f59e0b" /> {t.admin.protectedLabel}
                          </span>
                        ) : (
                          <Button
                            variant="secondary"
                            onClick={() => handleDeleteUser(u)}
                            style={{ padding: "4px 8px", color: "var(--error)" }}
                            title={t.admin.deleteUserTitleAttr}
                          >
                            <Trash2 size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* ── МОДАЛКА: СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ ── */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={ui.createUserTitle}
      >
        <form
          onSubmit={handleCreateUser}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <Input
            type="email"
            placeholder={ui.emailPh}
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder={ui.passwordPh}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "6px" }}>
              {ui.langLabel}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {(["ja", "en", "de"] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setNewLang(code)}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: `1px solid ${newLang === code ? "#f59e0b" : "var(--border)"}`,
                    backgroundColor: newLang === code ? "rgba(245, 158, 11, 0.16)" : "var(--surface-raised)",
                    color: newLang === code ? "#f59e0b" : "var(--text-primary)",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {getLangFlag(code)}
                </button>
              ))}
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={newShowProg}
              onChange={(e) => setNewShowProg(e.target.checked)}
            />
            <span>{ui.progLabel}</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={newOnboarded}
              onChange={(e) => setNewOnboarded(e.target.checked)}
            />
            <span>{ui.onboardLabel}</span>
          </label>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={creatingUser} style={{ backgroundColor: "#f59e0b", color: "#000", border: "none", fontWeight: 700 }}>
              {creatingUser ? t.common.loading : ui.createConfirmBtn}
            </Button>
          </div>
        </form>
      </Modal>

      {/* ── МОДАЛКА: УПРАВЛЕНИЕ И ИНСПЕКТОР ПОЛЬЗОВАТЕЛЯ ── */}
      <Modal
        isOpen={Boolean(inspectData)}
        onClose={() => setInspectData(null)}
        title={`${ui.inspectTitle}: ${inspectData?.email || ""}`}
      >
        {inspectData && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxHeight: "72vh", overflowY: "auto" }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <Badge variant={inspectData.isCreator ? "accent" : "default"}>
                {inspectData.role}
              </Badge>
              <span style={{ fontSize: "12px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                ID: {inspectData.id}
              </span>
              <span style={{ fontSize: "12px", color: "#f59e0b", fontWeight: 700, marginLeft: "auto" }}>
                🏆 {ui.achievementsLabel} {inspectData.achievementsCount}
              </span>
            </div>

            {/* Настройки аккаунта и сброс пароля */}
            <div
              style={{
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                <Globe size={14} color="#f59e0b" /> {ui.editUserSection}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                {(["ja", "en", "de"] as const).map((code) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setEditLang(code)}
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: "8px",
                      border: `1px solid ${editLang === code ? "#f59e0b" : "var(--border)"}`,
                      backgroundColor: editLang === code ? "rgba(245, 158, 11, 0.16)" : "var(--surface)",
                      color: editLang === code ? "#f59e0b" : "var(--text-primary)",
                      fontWeight: 700,
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    {getLangFlag(code)}
                  </button>
                ))}
              </div>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={editShowProg}
                  onChange={(e) => setEditShowProg(e.target.checked)}
                />
                <span>{ui.progLabel}</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={editOnboarded}
                  onChange={(e) => setEditOnboarded(e.target.checked)}
                />
                <span>{ui.onboardLabel}</span>
              </label>

              {!inspectData.isCreator && (
                <Input
                  icon={<Lock size={14} />}
                  type="password"
                  placeholder={ui.resetPassPh}
                  value={editNewPass}
                  onChange={(e) => setEditNewPass(e.target.value)}
                />
              )}

              <Button onClick={handleSaveUserEdit} disabled={savingUserEdit} style={{ alignSelf: "flex-end" }}>
                {savingUserEdit ? t.common.loading : ui.saveChangesBtn}
              </Button>
            </div>

            {/* Последние материалы */}
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                {ui.recentResourcesTitle} ({inspectData._count.resources})
              </div>
              {inspectData.recentResources.length === 0 ? (
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ui.noItems}</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {inspectData.recentResources.map((r) => (
                    <div
                      key={r.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "8px",
                        padding: "8px 10px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface-raised)",
                        fontSize: "12px",
                      }}
                    >
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        <strong>[{r.type}]</strong> {r.title}
                      </span>
                      <a href={r.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", flexShrink: 0 }}>
                        <ExternalLink size={13} />
                      </a>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Последние карточки */}
            <div>
              <div style={{ fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                {ui.recentCardsTitle} ({inspectData._count.japaneseCards})
              </div>
              {inspectData.recentCards.length === 0 ? (
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{ui.noItems}</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {inspectData.recentCards.map((c) => (
                    <span
                      key={c.id}
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "8px",
                        backgroundColor: "var(--surface-raised)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <strong>{c.word}</strong> — {c.meaning} ({c.studyLevel || "N5"})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Действия с аккаунтом */}
            <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", flexWrap: "wrap", paddingTop: "8px", borderTop: "1px solid var(--border)" }}>
              <Button variant="secondary" onClick={() => handleExportSingleUser(inspectData)} style={{ gap: "6px" }}>
                <Download size={14} /> {ui.exportUserBtn}
              </Button>
              {!inspectData.isCreator && (
                <div style={{ display: "flex", gap: "8px" }}>
                  <Button
                    variant="secondary"
                    onClick={() => handlePurgeUser(inspectData)}
                    style={{ color: "#f59e0b", borderColor: "rgba(245,158,11,0.4)" }}
                  >
                    {ui.purgeUserBtn}
                  </Button>
                  <Button
                    onClick={() => handleDeleteUser(inspectData)}
                    style={{ backgroundColor: "var(--error)", color: "#fff", border: "none", gap: "6px" }}
                  >
                    <Trash2 size={14} /> {t.admin.deleteConfirmBtn}
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
