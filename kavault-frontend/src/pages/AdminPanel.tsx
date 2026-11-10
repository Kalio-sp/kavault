import { useState, useEffect } from "react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Input } from "../components/ui/Input";
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
} from "lucide-react";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import { confirmModal, alertModal } from "../context/DialogContext";

interface GlobalStats {
  totalUsers: number;
  totalResources: number;
  totalCards: number;
  system: {
    nodeVersion: string;
    uptimeSeconds: number;
    memoryRssMb: number;
    memoryHeapUsedMb: number;
    platform: string;
    status: string;
  };
}

interface UserRow {
  id: string;
  email: string;
  createdAt: string;
  isCreator: boolean;
  role: string;
  _count: {
    resources: number;
    japaneseCards: number;
  };
}

export function AdminPanel() {
  const { t, locale } = useApp();
  const [stats, setStats] = useState<GlobalStats | null>(null);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMessage, setStatusMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const showStatus = (text: string, type: "success" | "error" | "info" = "success") => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
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

  const handleDeleteUser = async (user: UserRow) => {
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
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || t.admin.toasts.deleteErr, "error");
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
      const dataStr =
        "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(resp.data, null, 2));
      const downloadAnchor = document.createElement("a");
      const datePart = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `kavault-SYSTEM-FULL-BACKUP-${datePart}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      showStatus(t.admin.toasts.exportDone);
    } catch {
      showStatus(t.admin.toasts.exportErr, "error");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
        maxWidth: "1100px",
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
          background:
            "linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, var(--surface) 60%)",
          border: "1px solid rgba(245, 158, 11, 0.35)",
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
              boxShadow: "0 0 16px rgba(245, 158, 11, 0.3)",
            }}
          >
            <Crown size={28} />
          </div>

          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
              {t.admin.authorizedAsPrefix} <strong>zerkalovandrey@kavoult.dev</strong> {t.admin.authorizedAsSuffix}
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="secondary" onClick={loadData} style={{ gap: "6px" }}>
            <RotateCw size={14} /> {t.admin.refreshBtn}
          </Button>
          <Button onClick={handleSeedDemo} style={{ gap: "6px", backgroundColor: "#f59e0b", color: "#000", border: "none" }}>
            <Sparkles size={14} /> {t.admin.seedDemoBtn}
          </Button>
        </div>
      </Card>

      {/* Метрики системы в реальном времени */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <Card style={{ padding: "var(--space-5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Users size={16} color="var(--accent)" /> {t.admin.totalUsers}
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)" }}>
            {stats?.totalUsers ?? "..."}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {t.admin.registeredInDb}
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Database size={16} color="#10b981" /> {t.admin.vaultObjects}
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)" }}>
            {(stats?.totalResources ?? 0) + (stats?.totalCards ?? 0)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {stats?.totalResources ?? 0} {t.admin.materialsSuffix}, {stats?.totalCards ?? 0} {t.admin.cardsSuffix}
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Cpu size={16} color="#f59e0b" /> {t.admin.serverStatus}
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--success)" }}>
            {stats?.system.status ?? "ONLINE"}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Node {stats?.system.nodeVersion} · RSS {stats?.system.memoryRssMb} MB
          </div>
        </Card>
      </div>

      {/* Быстрые команды Создателя (Creator Tools) */}
      <Card style={{ padding: "var(--space-5)" }}>
        <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 12px 0" }}>
          {t.admin.creatorToolsTitle}
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={handleExportAll} style={{ gap: "8px" }}>
            <Download size={16} /> {t.admin.exportAllBtn}
          </Button>
          <Button variant="secondary" onClick={handleSeedDemo} style={{ gap: "8px" }}>
            <Sparkles size={16} /> {t.admin.seedDemoPackBtn}
          </Button>
        </div>
      </Card>

      {/* Таблица пользователей KAVAULT */}
      <Card style={{ padding: "var(--space-6)" }}>
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
              {t.admin.usersRegistryTitle} ({users.length})
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              {t.admin.manageAccountsDesc}
            </p>
          </div>

          <div style={{ width: "260px" }}>
            <Input
              icon={<Search size={15} />}
              placeholder={t.admin.searchEmailPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
                  <th style={{ padding: "12px 14px" }}>{t.admin.cols.email}</th>
                  <th style={{ padding: "12px 14px" }}>{t.admin.cols.role}</th>
                  <th style={{ padding: "12px 14px" }}>{t.admin.cols.registered}</th>
                  <th style={{ padding: "12px 14px" }}>{t.admin.cols.resources}</th>
                  <th style={{ padding: "12px 14px" }}>{t.admin.cols.words}</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>{t.admin.cols.actions}</th>
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
                    <td style={{ padding: "12px 14px", fontWeight: 500 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        {u.isCreator && <Crown size={15} color="#f59e0b" />}
                        {u.email}
                      </div>
                    </td>
                    <td style={{ padding: "12px 14px" }}>
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
                    <td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: "13px" }}>
                      {new Date(u.createdAt).toLocaleDateString(locale, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td style={{ padding: "12px 14px" }}>{u._count.resources}</td>
                    <td style={{ padding: "12px 14px" }}>{u._count.japaneseCards}</td>
                    <td style={{ padding: "12px 14px", textAlign: "right" }}>
                      {u.isCreator ? (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
