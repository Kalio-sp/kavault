import { useState, useEffect, useMemo } from "react";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import {
  ExternalLink,
  Plus,
  BookOpen,
  Search,
  FileText,
  Trash2,
  Video,
  CheckCircle2,
  Clock,
  Circle,
  Sparkles,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { confirmModal } from "../context/DialogContext";
import {
  STARTER_DEVELOPER_RESOURCES,
  isPackClaimed,
  markPackClaimed,
  unmarkPackClaimed,
} from "../data/starterPacks";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  status: "TO_LEARN" | "LEARNING" | "COMPLETED";
  note?: string;
  createdAt: string;
}

export function DeveloperHub() {
  const { t } = useApp();
  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<"ARTICLE" | "VIDEO">("ARTICLE");

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const fetchResources = async () => {
    try {
      const response = await api.get("/resources");
      const filtered = response.data.filter(
        (r: Resource) => r.type === "ARTICLE" || r.type === "VIDEO",
      );
      setResources(filtered);
    } catch (error) {
      console.error("Ошибка загрузки ресурсов", error);
    }
  };

  const isStarterClaimed = useMemo(
    () => isPackClaimed("developer", undefined, resources),
    [resources],
  );

  const handleLoadStarterPack = async () => {
    try {
      setIsImporting(true);
      await api.post("/resources/bulk", { items: STARTER_DEVELOPER_RESOURCES });
      markPackClaimed("developer");
      await fetchResources();
    } catch (err) {
      console.error("Ошибка загрузки стартового набора", err);
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !url) return;
    try {
      await api.post("/resources", {
        title,
        url,
        type,
        status: "TO_LEARN",
      });
      setTitle("");
      setUrl("");
      fetchResources();
    } catch (error) {
      console.error("Ошибка сохранения", error);
    }
  };

  const handleToggleStatus = async (item: Resource) => {
    const cycleMap: Record<string, "TO_LEARN" | "LEARNING" | "COMPLETED"> = {
      TO_LEARN: "LEARNING",
      LEARNING: "COMPLETED",
      COMPLETED: "TO_LEARN",
    };
    const nextStatus = cycleMap[item.status] || "TO_LEARN";

    // Оптимистичное обновление UI
    setResources((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: nextStatus } : r)),
    );

    try {
      await api.patch(`/resources/${item.id}/status`, { status: nextStatus });
    } catch (error) {
      console.error("Ошибка смены статуса", error);
      fetchResources();
    }
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = resources.find((r) => r.id === id);
    const titleLabel = itemToDelete ? ` «${itemToDelete.title}»` : "";
    const confirmed = await confirmModal({
      title: t.dev.deleteConfirmTitle,
      message: `${t.dev.deleteConfirmMsgPrefix}${titleLabel}${t.dev.deleteConfirmMsgSuffix}`,
      confirmText: t.common.delete,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/resources/${id}`);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource", error);
    }
  };

  const handleClearAll = async () => {
    if (resources.length === 0) return;
    const confirmed = await confirmModal({
      title: t.dev.clearConfirmTitle,
      message: `${t.dev.clearConfirmMsgPrefix} (${resources.length})${t.dev.clearConfirmMsgSuffix}`,
      confirmText: t.common.yesDeleteAll,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete("/resources/clear/all?type=DEVELOPER");
      unmarkPackClaimed("developer");
      fetchResources();
    } catch (error) {
      console.error("Error clearing resources", error);
    }
  };

  const openNoteModal = (resource: Resource) => {
    setActiveResource(resource);
    setNoteText(resource.note || "");
    setIsNoteModalOpen(true);
  };

  const saveNote = async () => {
    if (!activeResource) return;
    try {
      await api.patch(`/resources/${activeResource.id}/note`, {
        note: noteText,
      });
      setIsNoteModalOpen(false);
      fetchResources();
    } catch (error) {
      console.error("Ошибка сохранения заметки", error);
    }
  };

  const filteredResources = resources.filter((res) =>
    res.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: 600,
            margin: "0 0 var(--space-2) 0",
            color: "var(--text-primary)",
          }}
        >
          {t.dev.title}
        </h2>
        <p style={{ color: "var(--text-muted)", margin: 0 }}>
          {t.dev.subtitle}
        </p>
      </div>

      <Card style={{ padding: "var(--space-5)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-4)",
          }}
        >
          <h3 style={{ fontSize: "16px", margin: 0, fontWeight: 600 }}>
            {t.dev.addResource}
          </h3>

          {/* Переключатель типа материала */}
          <div style={{ display: "flex", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setType("ARTICLE")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                fontSize: "12px",
                borderRadius: "var(--radius-md)",
                border: type === "ARTICLE" ? "1px solid var(--accent)" : "1px solid var(--border)",
                backgroundColor: type === "ARTICLE" ? "var(--surface-raised)" : "transparent",
                color: type === "ARTICLE" ? "var(--accent)" : "var(--text-muted)",
                cursor: "pointer",
                fontWeight: type === "ARTICLE" ? 600 : 400,
              }}
            >
              <BookOpen size={13} /> {t.dev.articleType}
            </button>
            <button
              type="button"
              onClick={() => setType("VIDEO")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                fontSize: "12px",
                borderRadius: "var(--radius-md)",
                border: type === "VIDEO" ? "1px solid var(--accent)" : "1px solid var(--border)",
                backgroundColor: type === "VIDEO" ? "var(--surface-raised)" : "transparent",
                color: type === "VIDEO" ? "var(--accent)" : "var(--text-muted)",
                cursor: "pointer",
                fontWeight: type === "VIDEO" ? 600 : 400,
              }}
            >
              <Video size={13} /> {t.dev.videoType}
            </button>
          </div>
        </div>

        <form
          onSubmit={handleAddResource}
          style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}
        >
          <div style={{ flex: "1 1 250px" }}>
            <Input
              icon={<BookOpen size={16} />}
              placeholder={t.dev.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div style={{ flex: "1 1 250px" }}>
            <Input
              placeholder={t.dev.urlPlaceholder}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <Button type="submit" style={{ height: "40px" }}>
            <Plus size={18} /> {t.dev.saveBtn}
          </Button>
        </form>
      </Card>

      <div>
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h3
              style={{
                fontSize: "16px",
                margin: 0,
                color: "var(--text-secondary)",
              }}
            >
              {t.dev.savedMaterials} ({resources.length})
            </h3>
            {!isStarterClaimed && (
              <Button
                variant="secondary"
                onClick={handleLoadStarterPack}
                disabled={isImporting}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "var(--accent)",
                  borderColor: "rgba(59, 130, 246, 0.4)",
                  gap: "6px",
                }}
              >
                <Sparkles size={13} /> {isImporting ? t.dev.importingBtn : t.dev.loadStarterBtn}
              </Button>
            )}

            {resources.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleClearAll}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  borderColor: "var(--border)",
                  gap: "6px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                title={t.dev.clearAllBtn}
              >
                <Trash2 size={13} /> {t.dev.clearAllBtn}
              </Button>
            )}
          </div>
          <div style={{ width: "250px" }}>
            <Input
              icon={<Search size={16} />}
              placeholder={t.dev.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredResources.length === 0 ? (
          <Card
            style={{
              padding: "var(--space-8)",
              textAlign: "center",
              color: "var(--text-muted)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <p style={{ margin: 0, fontSize: "15px" }}>
              {searchQuery
                ? t.dev.noResources
                : t.dev.emptyDbText}
            </p>
            {!searchQuery && !isStarterClaimed && (
              <Button
                onClick={handleLoadStarterPack}
                disabled={isImporting}
                style={{ gap: "8px", marginTop: "6px" }}
              >
                <Sparkles size={16} /> {isImporting ? t.dev.importingFullBtn : t.dev.loadStarterFullBtn}
              </Button>
            )}
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filteredResources.map((item) => (
              <Card
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "var(--space-5)",
                  gap: "var(--space-3)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-3)",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: "var(--surface-raised)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.type === "VIDEO" ? (
                      <Video size={16} color="var(--accent)" />
                    ) : (
                      <BookOpen size={16} color="var(--text-secondary)" />
                    )}
                  </div>
                  <h4
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      wordBreak: "break-word",
                      lineHeight: "1.3",
                    }}
                  >
                    {item.title}
                  </h4>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                    marginTop: "auto",
                    paddingTop: "var(--space-3)",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  {/* Кликабельный статус-бейдж */}
                  <button
                    onClick={() => handleToggleStatus(item)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <Badge
                      variant={
                        item.status === "COMPLETED"
                          ? "success"
                          : item.status === "LEARNING"
                            ? "accent"
                            : "default"
                      }
                    >
                      {item.status === "COMPLETED" ? (
                        <CheckCircle2 size={12} style={{ marginRight: 4 }} />
                      ) : item.status === "LEARNING" ? (
                        <Clock size={12} style={{ marginRight: 4 }} />
                      ) : (
                        <Circle size={12} style={{ marginRight: 4 }} />
                      )}
                      {t.dash.statusLabels[item.status] || item.status.replace("_", " ")}
                    </Badge>
                  </button>

                  <div
                    style={{ marginLeft: "auto", display: "flex", gap: "8px" }}
                  >
                    <Button
                      variant="secondary"
                      onClick={() => openNoteModal(item)}
                      style={{
                        padding: "6px 8px",
                        color: item.note ? "var(--accent)" : "inherit",
                      }}
                      title={t.dev.notesBtnTitle}
                    >
                      <FileText size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => window.open(item.url, "_blank")}
                      style={{ padding: "6px 8px" }}
                      title={t.dev.openLinkTitle}
                    >
                      <ExternalLink size={14} />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => handleDelete(item.id)}
                      style={{ padding: "6px 8px", color: "var(--error)" }}
                      title={t.dev.deleteBtnTitle}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={`${t.dev.notesTitle} ${activeResource?.title}`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t.dev.notePlaceholder}
            style={{
              width: "100%",
              minHeight: "220px",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "var(--space-3)",
              color: "var(--text-primary)",
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              resize: "vertical",
              outline: "none",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "var(--space-3)",
            }}
          >
            <Button
              variant="secondary"
              onClick={() => setIsNoteModalOpen(false)}
            >
              {t.dev.cancel}
            </Button>
            <Button onClick={saveNote}>{t.dev.saveNote}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
