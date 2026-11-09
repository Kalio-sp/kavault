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
      showStatus(e.response?.data?.message || "Ошибка загрузки данных админки", "error");
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
        title: "Действие заблокировано",
        message:
          "Нельзя удалить аккаунт Создателя платформы! Он защищён на уровне ядра KAVAULT.",
        variant: "warning",
      });
      return;
    }

    const confirmed = await confirmModal({
      title: "Удалить пользователя?",
      message: `Вы действительно хотите удалить пользователя «${user.email}» и все его данные безвозвратно?`,
      confirmText: "Удалить аккаунт",
      cancelText: "Отмена",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/admin/users/${user.id}`);
      showStatus(`Пользователь ${user.email} успешно удален`);
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || "Ошибка удаления пользователя", "error");
    }
  };

  const handleSeedDemo = async () => {
    const confirmed = await confirmModal({
      title: "Создать демонстрационные данные?",
      message:
        "В базу данных будут добавлены готовые материалы по веб-разработке и начальные карточки японского языка.",
      confirmText: "Сгенерировать",
      cancelText: "Отмена",
      variant: "info",
    });
    if (!confirmed) return;

    try {
      showStatus("Генерация демонстрационных материалов...", "info");
      const resp = await api.post("/admin/seed-demo");
      showStatus(resp.data.message || "Демо-контент успешно сгенерирован!");
      loadData();
    } catch (e: any) {
      showStatus(e.response?.data?.message || "Ошибка генерации демо-контента", "error");
    }
  };

  const handleExportAll = async () => {
    try {
      showStatus("Формирование полного системного дампа...", "info");
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
      showStatus("Полный системный дамп успешно скачан!");
    } catch {
      showStatus("Не удалось выгрузить системный дамп", "error");
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
            backgroundColor: "rgba(24, 24, 27, 0.95)",
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
            boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
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
            "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(24, 24, 27, 0.9) 60%)",
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
                Панель управления Создателя
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
                SUPERADMIN
              </span>
            </div>
            <p style={{ color: "var(--text-secondary)", margin: "4px 0 0 0", fontSize: "14px" }}>
              Авторизован как <strong>zerkalovandrey@kavoult.dev</strong> · Полный доступ к инфраструктуре
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <Button variant="secondary" onClick={loadData} style={{ gap: "6px" }}>
            <RotateCw size={14} /> Обновить
          </Button>
          <Button onClick={handleSeedDemo} style={{ gap: "6px", backgroundColor: "#f59e0b", color: "#000", border: "none" }}>
            <Sparkles size={14} /> Сгенерировать демо-контент
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
            <Users size={16} color="var(--accent)" /> Всего пользователей
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)" }}>
            {stats?.totalUsers ?? "..."}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            Зарегистрировано в базе данных
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Database size={16} color="#10b981" /> Объектов в хранилище
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)" }}>
            {(stats?.totalResources ?? 0) + (stats?.totalCards ?? 0)}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {stats?.totalResources ?? 0} материалов, {stats?.totalCards ?? 0} карточек
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "8px" }}>
            <Cpu size={16} color="#f59e0b" /> Статус сервера
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
          Инструменты Создателя (God Mode Tools)
        </h3>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Button variant="secondary" onClick={handleExportAll} style={{ gap: "8px" }}>
            <Download size={16} /> Полный дамп платформы (JSON)
          </Button>
          <Button variant="secondary" onClick={handleSeedDemo} style={{ gap: "8px" }}>
            <Sparkles size={16} /> Добавить демо-набор карточек и статей
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
              Реестр пользователей системы ({users.length})
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
              Управление зарегистрированными аккаунтами
            </p>
          </div>

          <div style={{ width: "260px" }}>
            <Input
              icon={<Search size={15} />}
              placeholder="Поиск по email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            Загрузка списка пользователей...
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
                  <th style={{ padding: "12px 14px" }}>Email</th>
                  <th style={{ padding: "12px 14px" }}>Роль</th>
                  <th style={{ padding: "12px 14px" }}>Дата регистрации</th>
                  <th style={{ padding: "12px 14px" }}>Материалы</th>
                  <th style={{ padding: "12px 14px" }}>Слова</th>
                  <th style={{ padding: "12px 14px", textAlign: "right" }}>Действия</th>
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
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
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
                          <ShieldCheck size={14} color="#f59e0b" /> Защищён
                        </span>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => handleDeleteUser(u)}
                          style={{ padding: "4px 8px", color: "var(--error)" }}
                          title="Удалить пользователя"
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
