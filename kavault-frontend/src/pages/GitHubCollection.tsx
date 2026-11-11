import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import {
  ExternalLink,
  Plus,
  GitBranch,
  Search,
  FileText,
  Trash2,
  CheckCircle2,
  Clock,
  Circle,
  Sparkles,
  Star,
  GitFork,
  Tag,
  Code2,
  RefreshCw,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { confirmModal } from "../context/DialogContext";
import {
  STARTER_GITHUB_REPOSITORIES,
  getMissingStarterCount,
  isPackClaimed,
  markPackClaimed,
  unmarkPackClaimed,
} from "../data/starterPacks";
import {
  normalizeUrl,
  parseTagInput,
  formatNotePreview,
  getNextLearningStatus,
  type LearningStatus,
} from "../utils/resourceHelpers";
import type { Language } from "../i18n/translations";

interface Resource {
  id: string;
  title: string;
  url: string;
  description?: string;
  type: string;
  status: LearningStatus;
  tags?: string[];
  note?: string;
  createdAt: string;
}

interface GitHubRepoMeta {
  stars: number;
  forks: number;
  language: string | null;
  description: string | null;
  fetchedAt: number;
}

const GH_META_CACHE_KEY = "kavault_gh_meta_v1";
const GH_META_TTL_MS = 12 * 60 * 60 * 1000;

const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#eab308",
  Python: "#3572a5",
  Go: "#00add8",
  Rust: "#ea580c",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Shell: "#10b981",
  Dockerfile: "#0ea5e9",
  CSS: "#6366f1",
  HTML: "#e34c26",
  Kotlin: "#a97bff",
  Swift: "#f05138",
};

const GIT_UI: Record<
  Language,
  {
    vaultBadge: string;
    totalLabel: string;
    activeLabel: string;
    masteredLabel: string;
    notesCountLabel: string;
    loadStarterBtn: string;
    loadStarterFullBtn: string;
    importingBtn: string;
    syncStarsBtn: string;
    allStatuses: string;
    toLearnLabel: string;
    learningLabel: string;
    doneLabel: string;
    tagsPlaceholder: string;
    tagsLabel: string;
    noteOptionalPlaceholder: string;
    addNoteToggle: string;
    hideNoteToggle: string;
    noteBadge: string;
    noNoteHint: string;
    emptyVaultDesc: string;
    clearFilters: string;
  }
> = {
  ru: {
    vaultBadge: "OPEN SOURCE · КОЛЛЕКЦИЯ РЕПОЗИТОРИЕВ",
    totalLabel: "Проектов",
    activeLabel: "В разборе",
    masteredLabel: "Разобрано",
    notesCountLabel: "С заметками",
    loadStarterBtn: "Топ-12 проектов",
    loadStarterFullBtn: "🐙 Загрузить 12 лучших GitHub-проектов",
    importingBtn: "Загрузка...",
    syncStarsBtn: "Обновить ★",
    allStatuses: "Все статусы",
    toLearnLabel: "В очереди",
    learningLabel: "Изучаю код",
    doneLabel: "Разобрано",
    tagsPlaceholder: "Стек / теги (напр. react, typescript, devops)",
    tagsLabel: "Стек:",
    noteOptionalPlaceholder: "Архитектурные заметки, идеи для пет-проекта (необязательно)...",
    addNoteToggle: "+ Добавить заметку",
    hideNoteToggle: "Скрыть заметку",
    noteBadge: "Разбор / Заметка",
    noNoteHint: "Нажмите, чтобы записать разбор архитектуры",
    emptyVaultDesc:
      "Коллекция GitHub-проектов пока пуста. Добавьте репозиторий вручную или загрузите курируемую подборку топ open-source проектов!",
    clearFilters: "Сбросить фильтры",
  },
  en: {
    vaultBadge: "OPEN SOURCE · ENGINEERING REPOS",
    totalLabel: "Projects",
    activeLabel: "Active",
    masteredLabel: "Studied",
    notesCountLabel: "Annotated",
    loadStarterBtn: "Load Top 12 Repos",
    loadStarterFullBtn: "🐙 Load 12 Curated Open-Source Projects",
    importingBtn: "Importing...",
    syncStarsBtn: "Sync ★",
    allStatuses: "All Statuses",
    toLearnLabel: "Queued",
    learningLabel: "Exploring",
    doneLabel: "Studied",
    tagsPlaceholder: "Stack tags (e.g. react, typescript, devops)",
    tagsLabel: "Stack:",
    noteOptionalPlaceholder: "Optional architecture notes or ideas...",
    addNoteToggle: "+ Add note",
    hideNoteToggle: "Hide note",
    noteBadge: "Architecture Note",
    noNoteHint: "Click to write architecture insights",
    emptyVaultDesc:
      "Your GitHub showcase is empty yet. Add a repository URL above or import 12 essential open-source projects!",
    clearFilters: "Reset filters",
  },
  ja: {
    vaultBadge: "OPEN SOURCE · GITHUB コレクション",
    totalLabel: "保存数",
    activeLabel: "学習中",
    masteredLabel: "分析完了",
    notesCountLabel: "メモ付き",
    loadStarterBtn: "厳選12選を読込",
    loadStarterFullBtn: "🐙 厳選オープンソース12件を読み込む",
    importingBtn: "読込中...",
    syncStarsBtn: "★同期",
    allStatuses: "全ステータス",
    toLearnLabel: "未学習",
    learningLabel: "解析中",
    doneLabel: "完了",
    tagsPlaceholder: "技術スタック（例: react, typescript, docker）",
    tagsLabel: "タグ:",
    noteOptionalPlaceholder: "設計メモや参考ポイント（任意）...",
    addNoteToggle: "+ 設計メモを添える",
    hideNoteToggle: "メモ欄を閉じる",
    noteBadge: "設計メモ",
    noNoteHint: "クリックしてアーキテクチャメモを追加",
    emptyVaultDesc:
      "GitHubコレクションはまだ空です。URLを追加するか、定番オープンソース12件を読み込んでください！",
    clearFilters: "フィルターを解除",
  },
};

function parseGitHubRepo(
  rawUrl: string,
  fallbackTitle?: string,
): { owner: string; repo: string; slug: string; canonicalUrl: string } | null {
  const candidates = [rawUrl, fallbackTitle || ""];
  for (const input of candidates) {
    const trimmed = input.trim();
    if (!trimmed) continue;

    const urlMatch = trimmed.match(
      /github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/i,
    );
    if (urlMatch) {
      const owner = urlMatch[1];
      const repo = urlMatch[2].replace(/\.git$/i, "").replace(/[#?].*$/, "");
      return {
        owner,
        repo,
        slug: `${owner}/${repo}`,
        canonicalUrl: `https://github.com/${owner}/${repo}`,
      };
    }

    const slugMatch = trimmed.match(/^([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)$/);
    if (slugMatch) {
      const owner = slugMatch[1];
      const repo = slugMatch[2].replace(/\.git$/i, "");
      return {
        owner,
        repo,
        slug: `${owner}/${repo}`,
        canonicalUrl: `https://github.com/${owner}/${repo}`,
      };
    }
  }
  return null;
}

function formatCompactCount(num: number): string {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(num >= 100000 ? 0 : 1)}k`;
  }
  return String(num);
}

function loadMetaCache(): Record<string, GitHubRepoMeta> {
  try {
    const raw = localStorage.getItem(GH_META_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function GitHubCollection() {
  const { t, language } = useApp();
  const ui = GIT_UI[language];
  const { evaluateAchievements } = useAchievements();

  const [repos, setRepos] = useState<Resource[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | LearningStatus>("ALL");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [quickNote, setQuickNote] = useState("");
  const [showQuickNote, setShowQuickNote] = useState(false);

  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<Resource | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const [metaMap, setMetaMap] = useState<Record<string, GitHubRepoMeta>>(loadMetaCache);
  const [syncingMeta, setSyncingMeta] = useState(false);
  const [failedAvatars, setFailedAvatars] = useState<Set<string>>(() => new Set());
  const failedFetchRef = useRef<Set<string>>(new Set());

  const fetchRepos = useCallback(
    async (evaluate = false) => {
      try {
        const response = await api.get("/resources");
        const allData = response.data || [];
        const filteredRepos = allData.filter(
          (r: Resource) => r.type === "REPOSITORY",
        );
        setRepos(filteredRepos);
        if (evaluate) {
          evaluateAchievements({ resources: allData });
        }
      } catch (error) {
        console.error("Ошибка загрузки репозиториев", error);
      }
    },
    [evaluateAchievements],
  );

  useEffect(() => {
    fetchRepos();
  }, [fetchRepos]);

  const enrichGitHubMeta = useCallback(
    async (list: Resource[], forceRefresh = false) => {
      const now = Date.now();
      const targets = list
        .map((r) => parseGitHubRepo(r.url, r.title))
        .filter((parsed): parsed is NonNullable<typeof parsed> => Boolean(parsed))
        .filter((parsed, idx, arr) => arr.findIndex((p) => p.slug === parsed.slug) === idx)
        .filter((parsed) => {
          if (forceRefresh) return true;
          if (failedFetchRef.current.has(parsed.slug)) return false;
          const cached = metaMap[parsed.slug];
          return !cached || now - cached.fetchedAt > GH_META_TTL_MS;
        })
        .slice(0, 12);

      if (targets.length === 0) return;
      if (forceRefresh) setSyncingMeta(true);

      const updates: Record<string, GitHubRepoMeta> = {};
      await Promise.all(
        targets.map(async (parsed) => {
          try {
            const resp = await fetch(
              `https://api.github.com/repos/${parsed.owner}/${parsed.repo}`,
              { headers: { Accept: "application/vnd.github+json" } },
            );
            if (!resp.ok) {
              failedFetchRef.current.add(parsed.slug);
              return;
            }
            const data = await resp.json();
            updates[parsed.slug] = {
              stars: Number(data.stargazers_count || 0),
              forks: Number(data.forks_count || 0),
              language: data.language || null,
              description: data.description || null,
              fetchedAt: Date.now(),
            };
          } catch {
            failedFetchRef.current.add(parsed.slug);
          }
        }),
      );

      if (Object.keys(updates).length > 0) {
        setMetaMap((prev) => {
          const next = { ...prev, ...updates };
          try {
            localStorage.setItem(GH_META_CACHE_KEY, JSON.stringify(next));
          } catch {
            // ignore storage quota errors
          }
          return next;
        });
      }
      setSyncingMeta(false);
    },
    [metaMap],
  );

  useEffect(() => {
    if (repos.length > 0) {
      void enrichGitHubMeta(repos, false);
    }
  }, [repos]);

  const missingStarterCount = useMemo(
    () => getMissingStarterCount("github", undefined, repos),
    [repos],
  );

  const isStarterClaimed = useMemo(
    () => isPackClaimed("github", undefined, repos),
    [repos],
  );

  const handleLoadStarterRepos = async () => {
    try {
      setIsImporting(true);
      await api.post("/resources/bulk", { items: STARTER_GITHUB_REPOSITORIES });
      markPackClaimed("github");
      await fetchRepos(true);
    } catch (err) {
      console.error("Ошибка загрузки GitHub стартера", err);
    } finally {
      setIsImporting(false);
    }
  };

  const stats = useMemo(() => {
    const active = repos.filter((r) => r.status !== "COMPLETED").length;
    const completed = repos.filter((r) => r.status === "COMPLETED").length;
    const annotated = repos.filter((r) => Boolean(r.note?.trim())).length;
    return { total: repos.length, active, completed, annotated };
  }, [repos]);

  const stackTags = useMemo(() => {
    const counts = new Map<string, number>();
    repos.forEach((r) => {
      (r.tags || []).forEach((tg) => {
        const clean = tg.trim().toLowerCase();
        if (clean) counts.set(clean, (counts.get(clean) || 0) + 1);
      });
    });
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 12);
  }, [repos]);

  const handleUrlBlurOrChange = (nextUrl: string) => {
    setUrl(nextUrl);
    if (!title.trim()) {
      const parsed = parseGitHubRepo(nextUrl);
      if (parsed) setTitle(parsed.slug);
    }
  };

  const handleAddRepo = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedFromTitle = parseGitHubRepo(title);
    const parsedFromUrl = parseGitHubRepo(url, title);
    const finalTitle = title.trim() || parsedFromUrl?.slug || url.trim();
    const finalUrl = !url.trim() && parsedFromTitle
      ? parsedFromTitle.canonicalUrl
      : normalizeUrl(url);

    if (!finalTitle || !finalUrl) return;
    try {
      await api.post("/resources", {
        title: finalTitle,
        url: finalUrl,
        type: "REPOSITORY",
        status: "TO_LEARN",
        tags: parseTagInput(tagsInput),
        ...(quickNote.trim() ? { note: quickNote.trim() } : {}),
      });
      setTitle("");
      setUrl("");
      setTagsInput("");
      setQuickNote("");
      setShowQuickNote(false);
      fetchRepos(true);
    } catch (error) {
      console.error("Ошибка сохранения", error);
    }
  };

  const handleToggleStatus = async (item: Resource) => {
    const nextStatus = getNextLearningStatus(item.status);

    setRepos((prev) =>
      prev.map((r) => (r.id === item.id ? { ...r, status: nextStatus } : r)),
    );

    try {
      await api.patch(`/resources/${item.id}/status`, { status: nextStatus });
    } catch (error) {
      console.error("Ошибка смены статуса", error);
      fetchRepos();
    }
  };

  const handleDelete = async (id: string) => {
    const repoToDelete = repos.find((r) => r.id === id);
    const nameLabel = repoToDelete ? ` «${repoToDelete.title}»` : "";
    const confirmed = await confirmModal({
      title: t.git.deleteConfirmTitle,
      message: `${t.git.deleteConfirmMsgPrefix}${nameLabel} ${t.git.deleteConfirmMsgSuffix}`,
      confirmText: t.common.delete,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/resources/${id}`);
      fetchRepos();
    } catch (error) {
      console.error("Error deleting repository", error);
    }
  };

  const handleClearAll = async () => {
    if (repos.length === 0) return;
    const confirmed = await confirmModal({
      title: t.git.clearConfirmTitle,
      message: `${t.git.clearConfirmMsgPrefix} (${repos.length}) ${t.git.clearConfirmMsgSuffix}`,
      confirmText: t.common.yesDeleteAll,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete("/resources/clear/all?type=REPOSITORY");
      unmarkPackClaimed("github");
      fetchRepos();
    } catch (error) {
      console.error("Error clearing repositories", error);
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
      fetchRepos(true);
    } catch (error) {
      console.error("Ошибка сохранения заметки", error);
    }
  };

  const filteredRepos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return repos.filter((repo) => {
      if (statusFilter !== "ALL" && repo.status !== statusFilter) return false;
      if (
        selectedTag &&
        !(repo.tags || []).some((tg) => tg.toLowerCase() === selectedTag)
      ) {
        return false;
      }
      if (!q) return true;
      const parsed = parseGitHubRepo(repo.url, repo.title);
      const ghMeta = parsed ? metaMap[parsed.slug] : undefined;
      return (
        repo.title.toLowerCase().includes(q) ||
        repo.url.toLowerCase().includes(q) ||
        (repo.note && repo.note.toLowerCase().includes(q)) ||
        (repo.tags || []).some((tg) => tg.toLowerCase().includes(q)) ||
        (ghMeta?.description && ghMeta.description.toLowerCase().includes(q)) ||
        (ghMeta?.language && ghMeta.language.toLowerCase().includes(q))
      );
    });
  }, [repos, searchQuery, statusFilter, selectedTag, metaMap]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) ||
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
      {/* ── HERO СТУДИЯ GITHUB ПРОЕКТОВ ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "var(--space-6)",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.11) 50%, rgba(168, 85, 247, 0.09) 100%)",
          border: "1px solid rgba(16, 185, 129, 0.28)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "22px",
            top: "14px",
            color: "rgba(16, 185, 129, 0.10)",
            pointerEvents: "none",
          }}
        >
          <GitBranch size={88} />
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
                backgroundColor: "rgba(16, 185, 129, 0.14)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#10b981",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "0.05em",
                marginBottom: "10px",
              }}
            >
              <GitBranch size={13} /> {ui.vaultBadge}
            </div>
            <h2
              style={{
                fontSize: "28px",
                fontWeight: 700,
                margin: "0 0 6px 0",
                color: "var(--text-primary)",
              }}
            >
              {t.git.title}
            </h2>
            <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "14px" }}>
              {t.git.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {repos.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => void enrichGitHubMeta(repos, true)}
                disabled={syncingMeta}
                style={{ gap: "6px" }}
              >
                <RefreshCw
                  size={14}
                  style={
                    syncingMeta
                      ? { animation: "spin 1s linear infinite" }
                      : undefined
                  }
                />
                {ui.syncStarsBtn}
              </Button>
            )}
            {!isStarterClaimed && (
              <Button
                onClick={handleLoadStarterRepos}
                disabled={isImporting}
                style={{
                  gap: "8px",
                  background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  color: "#ffffff",
                  boxShadow: "0 8px 22px -8px rgba(16, 185, 129, 0.55)",
                }}
              >
                <Sparkles size={16} />
                {isImporting
                  ? ui.importingBtn
                  : repos.length > 0 && missingStarterCount > 0
                    ? `${ui.loadStarterBtn} (+${missingStarterCount})`
                    : ui.loadStarterBtn}
              </Button>
            )}
          </div>
        </div>

        {/* KPI чипы */}
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
            { label: ui.activeLabel, value: stats.active, color: "#3b82f6" },
            { label: ui.masteredLabel, value: stats.completed, color: "#10b981" },
            { label: ui.notesCountLabel, value: stats.annotated, color: "#a855f7" },
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

      {/* ── ДОБАВЛЕНИЕ РЕПОЗИТОРИЯ ── */}
      <Card style={{ padding: "var(--space-5)", borderRadius: "16px" }}>
        <h3 style={{ fontSize: "16px", margin: "0 0 var(--space-4) 0", fontWeight: 600 }}>
          {t.git.addRepo}
        </h3>
        <form
          onSubmit={handleAddRepo}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
        >
          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 230px" }}>
              <Input
                icon={<GitBranch size={16} />}
                placeholder={t.git.namePlaceholder}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div style={{ flex: "1 1 250px" }}>
              <Input
                icon={<Code2 size={16} />}
                placeholder={t.git.urlPlaceholder}
                value={url}
                onChange={(e) => handleUrlBlurOrChange(e.target.value)}
                required={!title.includes("/")}
              />
            </div>
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: "1 1 250px" }}>
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
              <Plus size={18} /> {t.git.saveBtn}
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

      {/* ── ПАНЕЛЬ ФИЛЬТРАЦИИ, ТЕГОВ И СПИСКА ПРОЕКТОВ ── */}
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
          <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
            <h3
              style={{
                fontSize: "16px",
                margin: 0,
                color: "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              {t.git.savedProjects} ({filteredRepos.length}/{repos.length})
            </h3>
            {repos.length > 0 && (
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
                title={t.git.clearAllBtn}
              >
                <Trash2 size={13} /> {t.git.clearAllBtn}
              </Button>
            )}
          </div>

          <div style={{ width: "260px", maxWidth: "100%" }}>
            <Input
              icon={<Search size={16} />}
              placeholder={t.git.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {repos.length > 0 && (
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
                      border: `1px solid ${active ? "#10b981" : "var(--border-subtle)"}`,
                      backgroundColor: active ? "#10b981" : "var(--bg-elevated)",
                      color: active ? "#ffffff" : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: 600,
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

            {stackTags.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
                  {ui.tagsLabel}
                </span>
                {stackTags.map(([tg, count]) => {
                  const active = selectedTag === tg;
                  return (
                    <button
                      key={tg}
                      type="button"
                      onClick={() => setSelectedTag(active ? null : tg)}
                      style={{
                        padding: "2px 8px",
                        borderRadius: "999px",
                        border: `1px solid ${active ? "#10b981" : "var(--border-subtle)"}`,
                        backgroundColor: active ? "rgba(16, 185, 129, 0.16)" : "var(--bg-elevated)",
                        color: active ? "#10b981" : "var(--text-secondary)",
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

        {filteredRepos.length === 0 ? (
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
              {hasActiveFilters ? t.git.noRepos : ui.emptyVaultDesc}
            </p>
            {!hasActiveFilters && !isStarterClaimed && (
              <Button
                onClick={handleLoadStarterRepos}
                disabled={isImporting}
                style={{
                  gap: "8px",
                  marginTop: "6px",
                  background: "linear-gradient(135deg, #10b981 0%, #3b82f6 100%)",
                  color: "#ffffff",
                }}
              >
                <Sparkles size={16} />
                {isImporting ? ui.importingBtn : ui.loadStarterFullBtn}
              </Button>
            )}
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(315px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filteredRepos.map((item) => {
              const parsed = parseGitHubRepo(item.url, item.title);
              const ghMeta = parsed ? metaMap[parsed.slug] : undefined;
              const langColor = ghMeta?.language
                ? LANG_COLORS[ghMeta.language] || "var(--accent)"
                : "var(--text-muted)";
              const showAvatar = parsed && !failedAvatars.has(parsed.owner);
              const notePreview = formatNotePreview(item.note);

              return (
                <Card
                  key={item.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "var(--space-5)",
                    gap: "var(--space-3)",
                    borderRadius: "16px",
                    borderTop: "3px solid #10b981",
                  }}
                >
                  {/* Шапка: аватар/владелец + звёзды */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        minWidth: 0,
                      }}
                    >
                      {showAvatar ? (
                        <img
                          src={`https://github.com/${parsed.owner}.png?size=64`}
                          alt={parsed.owner}
                          width={34}
                          height={34}
                          loading="lazy"
                          onError={() =>
                            setFailedAvatars((prev) => new Set(prev).add(parsed.owner))
                          }
                          style={{
                            borderRadius: "10px",
                            border: "1px solid var(--border-subtle)",
                            flexShrink: 0,
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: "34px",
                            height: "34px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(16, 185, 129, 0.14)",
                            border: "1px solid rgba(16, 185, 129, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                        >
                          <GitBranch size={16} color="#10b981" />
                        </div>
                      )}

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          minWidth: 0,
                          textDecoration: "none",
                          color: "var(--text-primary)",
                        }}
                      >
                        {parsed ? (
                          <div style={{ lineHeight: 1.25, wordBreak: "break-word" }}>
                            <div style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                              {parsed.owner} /
                            </div>
                            <div style={{ fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>
                              {parsed.repo}
                            </div>
                          </div>
                        ) : (
                          <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 700, wordBreak: "break-word" }}>
                            {item.title}
                          </h4>
                        )}
                      </a>
                    </div>

                    {ghMeta && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "3px 8px",
                            borderRadius: "999px",
                            backgroundColor: "rgba(245, 158, 11, 0.14)",
                            border: "1px solid rgba(245, 158, 11, 0.35)",
                            color: "#f59e0b",
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          <Star size={11} fill="#f59e0b" />
                          {formatCompactCount(ghMeta.stars)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Описание репозитория (из GitHub API, если доступно) */}
                  {ghMeta?.description && (
                    <p
                      style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        lineHeight: 1.45,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {ghMeta.description}
                    </p>
                  )}

                  {/* Мета-строка языка + форков + тегов */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                    {ghMeta?.language && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                          backgroundColor: "var(--bg-elevated)",
                          padding: "2px 8px",
                          borderRadius: "999px",
                          border: "1px solid var(--border-subtle)",
                        }}
                      >
                        <span
                          style={{
                            width: "7px",
                            height: "7px",
                            borderRadius: "50%",
                            backgroundColor: langColor,
                          }}
                        />
                        {ghMeta.language}
                      </span>
                    )}

                    {ghMeta && ghMeta.forks > 0 && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontFamily: "var(--font-mono)",
                          padding: "2px 6px",
                        }}
                      >
                        <GitFork size={11} />
                        {formatCompactCount(ghMeta.forks)}
                      </span>
                    )}

                    {(item.tags || []).map((tg) => (
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
                          color: selectedTag === tg ? "#10b981" : "var(--text-secondary)",
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                      >
                        #{tg}
                      </button>
                    ))}
                  </div>

                  {/* Превью заметки */}
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
                        color: notePreview ? "#10b981" : "var(--text-muted)",
                      }}
                    >
                      <FileText size={12} />
                      <span>{notePreview ? ui.noteBadge : ui.noNoteHint}</span>
                    </div>
                    {notePreview && (
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
                        {notePreview}
                      </div>
                    )}
                  </div>

                  {/* Нижняя панель статуса и действий */}
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
                          color: item.note ? "#10b981" : "inherit",
                        }}
                        title={t.git.notesBtnTitle}
                      >
                        <FileText size={14} />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => window.open(item.url, "_blank")}
                        style={{ padding: "6px 8px" }}
                        title={t.git.openRepoTitle}
                      >
                        <ExternalLink size={14} />
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => handleDelete(item.id)}
                        style={{ padding: "6px 8px", color: "var(--error)" }}
                        title={t.git.deleteBtnTitle}
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

      {/* ── МОДАЛКА ЗАМЕТОК ПО ПРОЕКТУ ── */}
      <Modal
        isOpen={isNoteModalOpen}
        onClose={() => setIsNoteModalOpen(false)}
        title={`${t.git.notesTitle} ${activeResource?.title || ""}`}
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
                  color: "#10b981",
                  textDecoration: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                <ExternalLink size={12} /> {activeResource.url}
              </a>
            </div>
          )}

          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder={t.git.notePlaceholder}
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
            <Button variant="secondary" onClick={() => setIsNoteModalOpen(false)}>
              {t.git.cancel}
            </Button>
            <Button onClick={saveNote}>{t.git.saveNote}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
