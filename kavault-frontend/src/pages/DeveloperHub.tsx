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
  Code2,
  Globe,
  Tag,
  Layers,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { confirmModal } from "../context/DialogContext";
import {
  STARTER_DEVELOPER_RESOURCES,
  getMissingStarterCount,
  isPackClaimed,
  markPackClaimed,
  unmarkPackClaimed,
} from "../data/starterPacks";
import {
  extractHostname,
  normalizeUrl,
  parseTagInput,
  formatNotePreview,
  getNextLearningStatus,
  type LearningStatus,
} from "../utils/resourceHelpers";
import type { Language } from "../i18n/translations";

type DevResourceType = "ARTICLE" | "DOCUMENTATION" | "VIDEO" | "WEBSITE";

interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string;
  type: DevResourceType | string;
  status: LearningStatus;
  tags?: string[];
  note?: string;
  createdAt: string;
}

const DEV_UI: Record<
  Language,
  {
    vaultBadge: string;
    totalLabel: string;
    toLearnLabel: string;
    learningLabel: string;
    doneLabel: string;
    progressLabel: string;
    allTypes: string;
    docType: string;
    siteType: string;
    allStatuses: string;
    tagsPlaceholder: string;
    noteOptionalPlaceholder: string;
    addNoteToggle: string;
    hideNoteToggle: string;
    noteBadge: string;
    noNoteHint: string;
    tagsLabel: string;
    clearFilters: string;
  }
> = {
  ru: {
    vaultBadge: "DEV VAULT · КОНСПЕКТЫ И ГАЙДЫ",
    totalLabel: "Всего",
    toLearnLabel: "В очереди",
    learningLabel: "Изучаю",
    doneLabel: "Изучено",
    progressLabel: "Прогресс базы",
    allTypes: "Все форматы",
    docType: "Документация",
    siteType: "Ресурс",
    allStatuses: "Все статусы",
    tagsPlaceholder: "Теги через запятую (напр. react, docker, backend)",
    noteOptionalPlaceholder: "Краткий конспект или заметка в Markdown (необязательно)...",
    addNoteToggle: "+ Прикрепить заметку",
    hideNoteToggle: "Скрыть заметку",
    noteBadge: "Есть конспект",
    noNoteHint: "Нажмите иконку заметки, чтобы записать конспект",
    tagsLabel: "Теги:",
    clearFilters: "Сбросить фильтры",
  },
  en: {
    vaultBadge: "DEV VAULT · CHEAT SHEETS & DOCS",
    totalLabel: "Total",
    toLearnLabel: "Queued",
    learningLabel: "Studying",
    doneLabel: "Mastered",
    progressLabel: "Completion",
    allTypes: "All Formats",
    docType: "Docs",
    siteType: "Website",
    allStatuses: "All Statuses",
    tagsPlaceholder: "Comma-separated tags (e.g. react, docker, backend)",
    noteOptionalPlaceholder: "Optional Markdown summary or key takeaways...",
    addNoteToggle: "+ Attach summary note",
    hideNoteToggle: "Hide note field",
    noteBadge: "Has Notes",
    noNoteHint: "Add key takeaways in Markdown notes",
    tagsLabel: "Tags:",
    clearFilters: "Reset filters",
  },
  ja: {
    vaultBadge: "DEV VAULT · 技術資料＆チートシート",
    totalLabel: "合計",
    toLearnLabel: "未学習",
    learningLabel: "学習中",
    doneLabel: "習得済",
    progressLabel: "完了率",
    allTypes: "すべて",
    docType: "公式Docs",
    siteType: "Webサイト",
    allStatuses: "全ステータス",
    tagsPlaceholder: "タグをカンマ区切りで入力（例: react, docker）",
    noteOptionalPlaceholder: "要点メモやMarkdownノート（任意）...",
    addNoteToggle: "+ メモを添える",
    hideNoteToggle: "メモ欄を閉じる",
    noteBadge: "メモあり",
    noNoteHint: "ノートのアイコンから要点を記録できます",
    tagsLabel: "タグ:",
    clearFilters: "フィルターを解除",
  },
};

const TYPE_STYLE: Record<
  string,
  { color: string; bg: string; border: string }
> = {
  DOCUMENTATION: {
    color: "#6366f1",
    bg: "rgba(99, 102, 241, 0.14)",
    border: "rgba(99, 102, 241, 0.35)",
  },
  ARTICLE: {
    color: "#3b82f6",
    bg: "rgba(59, 130, 246, 0.14)",
    border: "rgba(59, 130, 246, 0.35)",
  },
  VIDEO: {
    color: "#ec4899",
    bg: "rgba(236, 72, 153, 0.14)",
    border: "rgba(236, 72, 153, 0.35)",
  },
  WEBSITE: {
    color: "#f59e0b",
    bg: "rgba(245, 158, 11, 0.14)",
    border: "rgba(245, 158, 11, 0.35)",
  },
};

export function DeveloperHub() {
  const { t, language } = useApp();
  const ui = DEV_UI[language];
  const { evaluateAchievements } = useAchievements();

  const [resources, setResources] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | DevResourceType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | LearningStatus>("ALL");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [showQuickNote, setShowQuickNote] = useState(false);
  const [type, setType] = useState<DevResourceType>("ARTICLE");

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const fetchResources = async (evaluate = false) => {
    try {
      const response = await api.get("/resources");
      const allData = response.data || [];
      const filtered = allData.filter(
        (r: Resource) => r.type !== "REPOSITORY",
      );
      setResources(filtered);
      if (evaluate) {
        evaluateAchievements({ resources: allData });
      }
    } catch (error) {
      console.error("Ошибка загрузки ресурсов", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const missingStarterCount = useMemo(
    () => getMissingStarterCount("developer", undefined, resources),
    [resources],
  );

  const isStarterClaimed = useMemo(
    () => isPackClaimed("developer", undefined, resources),
    [resources],
  );

  const handleLoadStarterPack = async () => {
    try {
      setIsImporting(true);
      await api.post("/resources/bulk", { items: STARTER_DEVELOPER_RESOURCES });
      markPackClaimed("developer");
      await fetchResources(true);
    } catch (err) {
      console.error("Ошибка загрузки стартового набора", err);
    } finally {
      setIsImporting(false);
    }
  };

  const stats = useMemo(() => {
    const toLearn = resources.filter((r) => r.status === "TO_LEARN").length;
    const learning = resources.filter((r) => r.status === "LEARNING").length;
    const completed = resources.filter((r) => r.status === "COMPLETED").length;
    const pct =
      resources.length > 0
        ? Math.round((completed / resources.length) * 100)
        : 0;
    return { total: resources.length, toLearn, learning, completed, pct };
  }, [resources]);

  const popularTags = useMemo(() => {
    const counts = new Map<string, number>();
    resources.forEach((r) => {
      (r.tags || []).forEach((tag) => {
        const clean = tag.trim().toLowerCase();
        if (clean) counts.set(clean, (counts.get(clean) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [resources]);

  const getTypeLabel = (resType: string) => {
    if (resType === "DOCUMENTATION") return ui.docType;
    if (resType === "VIDEO") return t.dev.videoType;
    if (resType === "WEBSITE") return ui.siteType;
    return t.dev.articleType;
  };

  const renderTypeIcon = (resType: string, size = 16) => {
    const styleColor = TYPE_STYLE[resType]?.color || "var(--accent)";
    if (resType === "VIDEO") return <Video size={size} color={styleColor} />;
    if (resType === "DOCUMENTATION") return <Code2 size={size} color={styleColor} />;
    if (resType === "WEBSITE") return <Globe size={size} color={styleColor} />;
    return <BookOpen size={size} color={styleColor} />;
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    const normalizedUrl = normalizeUrl(url);
    try {
      await api.post("/resources", {
        title: title.trim(),
        url: normalizedUrl,
        type,
        status: "TO_LEARN",
        tags: parseTagInput(tagsInput),
        ...(quickNote.trim() ? { note: quickNote.trim() } : {}),
      });
      setTitle("");
      setUrl("");
      setTagsInput("");
      setQuickNote("");
      setShowQuickNote(false);
      fetchResources(true);
    } catch (error) {
      console.error("Ошибка сохранения", error);
    }
  };

  const handleToggleStatus = async (item: Resource) => {
    const nextStatus = getNextLearningStatus(item.status);

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
      fetchResources(true);
    } catch (error) {
      console.error("Ошибка сохранения заметки", error);
    }
  };

  const filteredResources = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return resources.filter((res) => {
      if (typeFilter !== "ALL" && res.type !== typeFilter) return false;
      if (statusFilter !== "ALL" && res.status !== statusFilter) return false;
      if (
        selectedTag &&
        !(res.tags || []).some((tg) => tg.toLowerCase() === selectedTag)
      ) {
        return false;
      }
      if (!q) return true;
      return (
        res.title.toLowerCase().includes(q) ||
        res.url.toLowerCase().includes(q) ||
        (res.note && res.note.toLowerCase().includes(q)) ||
        (res.tags || []).some((tg) => tg.toLowerCase().includes(q))
      );
    });
  }, [resources, searchQuery, typeFilter, statusFilter, selectedTag]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
    typeFilter !== "ALL" ||
    statusFilter !== "ALL" ||
    selectedTag !== null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
      }}
    >
      {/* ── HERO СТУДИЯ БАЗЫ ЗНАНИЙ ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "var(--space-6)",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.14) 0%, rgba(99, 102, 241, 0.10) 55%, rgba(16, 185, 129, 0.08) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.28)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "20px",
            top: "10px",
            fontSize: "76px",
            fontWeight: 800,
            fontFamily: "var(--font-mono)",
            color: "rgba(59, 130, 246, 0.08)",
            pointerEvents: "none",
            userSelect: "none",
            lineHeight: 1,
          }}
        >
          {"</>"}
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            gap: "var(--space-4)",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "rgba(59, 130, 246, 0.14)",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                color: "var(--accent)",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                marginBottom: "10px",
              }}
            >
              <Code2 size={13} /> {ui.vaultBadge}
            </div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                margin: "0 0 6px 0",
                color: "var(--text-primary)",
              }}
            >
              {t.dev.title}
            </h2>
            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "14px" }}>
              {t.dev.subtitle}
            </p>
          </div>

          {!isStarterClaimed && (
            <Button
              onClick={handleLoadStarterPack}
              disabled={isImporting}
              style={{
                gap: "8px",
                background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 22px -8px rgba(59, 130, 246, 0.6)",
              }}
            >
              <Sparkles size={16} />
              {isImporting
                ? t.dev.importingBtn
                : resources.length > 0 && missingStarterCount > 0
                  ? `${t.dev.loadStarterBtn} (+${missingStarterCount})`
                  : t.dev.loadStarterBtn}
            </Button>
          )}
        </div>

        {/* Мини-метрики базы */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
            gap: "var(--space-3)",
          }}
        >
          {[
            { label: ui.totalLabel, value: stats.total, color: "var(--text-primary)" },
            { label: ui.toLearnLabel, value: stats.toLearn, color: "#f59e0b" },
            { label: ui.learningLabel, value: stats.learning, color: "#3b82f6" },
            { label: ui.doneLabel, value: `${stats.completed} (${stats.pct}%)`, color: "#10b981" },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                padding: "10px 14px",
                borderRadius: "12px",
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                {stat.label}
              </div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: stat.color, marginTop: "2px" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ДОБАВЛЕНИЕ МАТЕРИАЛА ── */}
      <Card style={{ padding: "var(--space-5)", borderRadius: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-4)",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <h3 style={{ fontSize: "16px", margin: 0, fontWeight: 600 }}>
            {t.dev.addResource}
          </h3>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {(
              [
                { id: "ARTICLE", label: t.dev.articleType, icon: BookOpen },
                { id: "DOCUMENTATION", label: ui.docType, icon: Code2 },
                { id: "VIDEO", label: t.dev.videoType, icon: Video },
                { id: "WEBSITE", label: ui.siteType, icon: Globe },
              ] as const
            ).map((opt) => {
              const IconComp = opt.icon;
              const isSelected = type === opt.id;
              const palette = TYPE_STYLE[opt.id];
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "5px 11px",
                    fontSize: "12px",
                    borderRadius: "999px",
                    border: `1px solid ${isSelected ? palette.border : "var(--border)"}`,
                    backgroundColor: isSelected ? palette.bg : "transparent",
                    color: isSelected ? palette.color : "var(--text-muted)",
                    cursor: "pointer",
                    fontWeight: isSelected ? 700 : 500,
                  }}
                >
                  <IconComp size={13} /> {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <form
          onSubmit={handleAddResource}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
        >
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px" }}>
              <Input
                icon={<BookOpen size={16} />}
                placeholder={t.dev.titlePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: "1 1 240px" }}>
              <Input
                icon={<Globe size={16} />}
                placeholder={t.dev.urlPlaceholder}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: "1 1 260px" }}>
              <Input
                icon={<Tag size={15} />}
                placeholder={ui.tagsPlaceholder}
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowQuickNote((p) => !p)}
              style={{
                height: "40px",
                padding: "0 12px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--bg-elevated)",
                color: showQuickNote ? "var(--accent)" : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <FileText size={14} />
              {showQuickNote ? ui.hideNoteToggle : ui.addNoteToggle}
            </button>

            <Button type="submit" style={{ height: "40px" }}>
              <Plus size={18} /> {t.dev.saveBtn}
            </Button>
          </div>

          {showQuickNote && (
            <textarea
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              placeholder={ui.noteOptionalPlaceholder}
              style={{
                width: "100%",
                minHeight: "86px",
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "var(--space-3)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                resize: "vertical",
                outline: "none",
              }}
            />
          )}
        </form>
      </Card>

      {/* ── ПАНЕЛЬ ФИЛЬТРАЦИИ, ПОИСКА И ТЕГОВ ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h3 style={{ fontSize: "16px", margin: 0, color: "var(--text-secondary)", fontWeight: 600 }}>
              {t.dev.savedMaterials} ({filteredResources.length}/{resources.length})
            </h3>
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

          <div style={{ width: "260px", maxWidth: "100%" }}>
            <Input
              icon={<Search size={16} />}
              placeholder={t.dev.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {resources.length > 0 && (
          <Card
            style={{
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <Layers size={14} style={{ color: "var(--text-muted)" }} />
              {(
                [
                  { id: "ALL", label: ui.allTypes },
                  { id: "ARTICLE", label: t.dev.articleType },
                  { id: "DOCUMENTATION", label: ui.docType },
                  { id: "VIDEO", label: t.dev.videoType },
                  { id: "WEBSITE", label: ui.siteType },
                ] as const
              ).map((tab) => {
                const active = typeFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTypeFilter(tab.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      border: `1px solid ${active ? "var(--accent)" : "var(--border-subtle)"}`,
                      backgroundColor: active ? "var(--accent)" : "var(--bg-elevated)",
                      color: active ? "#ffffff" : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}

              <span style={{ width: "1px", height: "16px", backgroundColor: "var(--border)" }} />

              {(
                [
                  { id: "ALL", label: ui.allStatuses },
                  { id: "TO_LEARN", label: ui.toLearnLabel },
                  { id: "LEARNING", label: ui.learningLabel },
                  { id: "COMPLETED", label: ui.doneLabel },
                ] as const
              ).map((st) => {
                const active = statusFilter === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setStatusFilter(st.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "999px",
                      border: `1px solid ${active ? "var(--text-primary)" : "var(--border-subtle)"}`,
                      backgroundColor: active ? "var(--surface-raised)" : "transparent",
                      color: active ? "var(--text-primary)" : "var(--text-muted)",
                      fontSize: "12px",
                      fontWeight: active ? 700 : 500,
                      cursor: "pointer",
                    }}
                  >
                    {st.label}
                  </button>
                );
              })}

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setTypeFilter("ALL");
                    setStatusFilter("ALL");
                    setSelectedTag(null);
                  }}
                  style={{
                    marginLeft: "auto",
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {ui.clearFilters}
                </button>
              )}
            </div>

            {popularTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                  {ui.tagsLabel}
                </span>
                {popularTags.map(([tg, count]) => {
                  const active = selectedTag === tg;
                  return (
                    <button
                      key={tg}
                      type="button"
                      onClick={() => setSelectedTag(active ? null : tg)}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: `1px solid ${active ? "var(--accent)" : "var(--border-subtle)"}`,
                        backgroundColor: active ? "rgba(59, 130, 246, 0.16)" : "var(--bg-elevated)",
                        color: active ? "var(--accent)" : "var(--text-secondary)",
                        fontSize: "11px",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      #{tg} ({count})
                    </button>
                  );
                })}
              </div>
            )}
          </Card>
        )}

        {/* ── СПИСОК МАТЕРИАЛОВ ── */}
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
              {hasActiveFilters ? t.dev.noResources : t.dev.emptyDbText}
            </p>
            {!hasActiveFilters && !isStarterClaimed && (
              <Button
                onClick={handleLoadStarterPack}
                disabled={isImporting}
                style={{ gap: "8px", marginTop: "6px" }}
              >
                <Sparkles size={16} />
                {isImporting ? t.dev.importingFullBtn : t.dev.loadStarterFullBtn}
              </Button>
            )}
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filteredResources.map((item) => {
              const styleMeta = TYPE_STYLE[item.type] || TYPE_STYLE.ARTICLE;
              const host = extractHostname(item.url);
              const noteSnippet = formatNotePreview(item.note);

              return (
                <Card
                  key={item.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "var(--space-5)",
                    gap: "var(--space-3)",
                    borderRadius: "16px",
                    borderTop: `3px solid ${styleMeta.color}`,
                  }}
                >
                  {/* Верх: иконка, тип, домен */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "10px",
                          backgroundColor: styleMeta.bg,
                          border: `1px solid ${styleMeta.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {renderTypeIcon(item.type, 15)}
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: styleMeta.color,
                        }}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                    </div>

                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--text-muted)",
                        fontFamily: "var(--font-mono)",
                        backgroundColor: "var(--bg-elevated)",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: "1px solid var(--border-subtle)",
                        maxWidth: "150px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={item.url}
                    >
                      {host}
                    </span>
                  </div>

                  {/* Заголовок */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      margin: 0,
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      textDecoration: "none",
                      lineHeight: 1.4,
                      wordBreak: "break-word",
                    }}
                  >
                    {item.title}
                  </a>

                  {/* Теги */}
                  {item.tags && item.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {item.tags.map((tg) => (
                        <button
                          key={tg}
                          type="button"
                          onClick={() => setSelectedTag(selectedTag === tg ? null : tg)}
                          style={{
                            fontSize: "11px",
                            padding: "2px 8px",
                            borderRadius: "999px",
                            border: "1px solid var(--border-subtle)",
                            backgroundColor: "var(--bg-elevated)",
                            color: selectedTag === tg ? "var(--accent)" : "var(--text-secondary)",
                            cursor: "pointer",
                            fontWeight: 600,
                          }}
                        >
                          #{tg}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Превью заметки или подсказка */}
                  <div
                    onClick={() => openNoteModal(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") openNoteModal(item);
                    }}
                    style={{
                      padding: "8px 10px",
                      borderRadius: "10px",
                      backgroundColor: "var(--surface-raised)",
                      border: "1px solid var(--border-subtle)",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: noteSnippet ? "var(--accent)" : "var(--text-muted)",
                      }}
                    >
                      <FileText size={12} />
                      <span>{noteSnippet ? ui.noteBadge : ui.noNoteHint}</span>
                    </div>
                    {noteSnippet && (
                      <div
                        style={{
                          fontSize: "12px",
                          color: "var(--text-secondary)",
                          lineHeight: 1.45,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {noteSnippet}
                      </div>
                    )}
                  </div>

                  {/* Нижняя панель действий */}
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: "var(--space-3)",
                      borderTop: "1px solid var(--border-subtle)",
                    }}
                  >
                    <button
                      type="button"
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

                    <div style={{ marginLeft: "auto", display: "flex", gap: "8px" }}>
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
              );
            })}
          </div>
        )}
      </div>

      {/* ── МОДАЛКА КОНСПЕКТОВ ── */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={`${t.dev.notesTitle} ${activeResource?.title || ""}`}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          {activeResource && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center" }}>
              <a
                href={activeResource.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: "12px",
                  color: "var(--accent)",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <ExternalLink size={12} /> {extractHostname(activeResource.url)}
              </a>
              {(activeResource.tags || []).map((tg) => (
                <span
                  key={tg}
                  style={{
                    fontSize: "11px",
                    padding: "2px 8px",
                    borderRadius: "999px",
                    backgroundColor: "var(--bg-elevated)",
                    border: "1px solid var(--border-subtle)",
                    color: "var(--text-secondary)",
                  }}
                >
                  #{tg}
                </span>
              ))}
            </div>
          )}

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t.dev.notePlaceholder}
            style={{
              width: "100%",
              minHeight: "230px",
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
            <Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>
              {t.dev.cancel}
            </Button>
            <Button onClick={saveNote}>{t.dev.saveNote}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
