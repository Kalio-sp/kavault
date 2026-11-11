import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Archive,
  ArchiveRestore,
  Check,
  CheckSquare,
  Copy,
  Edit3,
  LayoutGrid,
  List,
  Palette,
  Pin,
  PinOff,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Type,
} from "lucide-react";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import { Modal } from "../components/ui/Modal";
import { confirmModal } from "../context/DialogContext";
import type { Language } from "../i18n/translations";

type CanvasStyle = "minimal" | "paper" | "grid" | "midnight" | "vibe";
type LayoutMode = "masonry" | "journal" | "compact";
type FontStyle = "sans" | "serif" | "mono";
type CardStyleMode = "glass" | "paper" | "sharp";
type ColorTag = "default" | "amber" | "blue" | "emerald" | "rose" | "violet";

interface ThoughtPreferences {
  canvasStyle: CanvasStyle;
  layoutMode: LayoutMode;
  fontStyle: FontStyle;
  cardStyle: CardStyleMode;
  defaultColor: ColorTag;
  showMoodBadge: boolean;
}

interface ThoughtNote {
  id: string;
  title?: string | null;
  content: string;
  mood: string;
  colorTag: ColorTag;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_PREFS: ThoughtPreferences = {
  canvasStyle: "vibe",
  layoutMode: "masonry",
  fontStyle: "sans",
  cardStyle: "glass",
  defaultColor: "default",
  showMoodBadge: true,
};

const MOOD_PRESETS = ["💭", "💡", "🎯", "🔥", "📚", "🌿", "✨", "⚡"];

const COLOR_STYLES: Record<
  ColorTag,
  { border: string; tintLight: string; tintDark: string; dot: string }
> = {
  default: {
    border: "var(--border)",
    tintLight: "var(--surface)",
    tintDark: "var(--surface)",
    dot: "#94a3b8",
  },
  amber: {
    border: "rgba(245, 158, 11, 0.45)",
    tintLight: "rgba(254, 243, 199, 0.55)",
    tintDark: "rgba(245, 158, 11, 0.09)",
    dot: "#f59e0b",
  },
  blue: {
    border: "rgba(59, 130, 246, 0.45)",
    tintLight: "rgba(219, 234, 254, 0.55)",
    tintDark: "rgba(59, 130, 246, 0.09)",
    dot: "#3b82f6",
  },
  emerald: {
    border: "rgba(16, 185, 129, 0.45)",
    tintLight: "rgba(209, 250, 229, 0.55)",
    tintDark: "rgba(16, 185, 129, 0.09)",
    dot: "#10b981",
  },
  rose: {
    border: "rgba(244, 63, 94, 0.45)",
    tintLight: "rgba(255, 228, 230, 0.55)",
    tintDark: "rgba(244, 63, 94, 0.09)",
    dot: "#f43f5e",
  },
  violet: {
    border: "rgba(168, 85, 247, 0.45)",
    tintLight: "rgba(243, 232, 255, 0.55)",
    tintDark: "rgba(168, 85, 247, 0.09)",
    dot: "#a855f7",
  },
};

const TEXTS: Record<
  Language,
  {
    title: string;
    subtitle: string;
    customizeBtn: string;
    activeTab: string;
    archiveTab: string;
    pinnedSection: string;
    othersSection: string;
    searchPh: string;
    allTags: string;
    titlePh: string;
    contentPh: string;
    tagsPh: string;
    addCheckBtn: string;
    saveNoteBtn: string;
    savingBtn: string;
    pinLabel: string;
    mmrHint: string;
    mmrEarnedToast: string;
    emptyActive: string;
    emptyArchive: string;
    editModalTitle: string;
    saveEditBtn: string;
    closeBtn: string;
    deleteConfirmTitle: string;
    deleteConfirmText: string;
    copied: string;
    prefs: {
      panelTitle: string;
      canvas: string;
      canvases: Record<CanvasStyle, string>;
      layout: string;
      layouts: Record<LayoutMode, string>;
      font: string;
      fonts: Record<FontStyle, string>;
      cardLook: string;
      cards: Record<CardStyleMode, string>;
      defaultColor: string;
      showMood: string;
    };
  }
> = {
  ru: {
    title: "Мысли и личный дневник",
    subtitle:
      "Свободное пространство для идей, рефлексии и быстрых чек-листов. Настраивайте оформление целиком под себя.",
    customizeBtn: "Оформление",
    activeTab: "Мысли",
    archiveTab: "Архив",
    pinnedSection: "Закреплённые",
    othersSection: "Лента мыслей",
    searchPh: "Поиск по мыслям и #тегам...",
    allTags: "Все теги",
    titlePh: "Заголовок (необязательно)...",
    contentPh:
      "Запишите мысль, идею или список задач (- [ ] пункт). Ctrl+Enter — сохранить мгновенно...",
    tagsPh: "Теги через запятую (например: идеи, инсайт, цели)",
    addCheckBtn: "+ Чекбокс",
    saveNoteBtn: "Сохранить мысль",
    savingBtn: "Сохранение...",
    pinLabel: "Закрепить",
    mmrHint: "+8 Task-System MMR за мысль от 15 симв.",
    mmrEarnedToast: "Мысль сохранена! За осмысленную запись начислено +8 MMR",
    emptyActive: "Здесь пока тихо. Запишите первую мысль или инсайт дня выше ✨",
    emptyArchive: "В архиве пока нет записей.",
    editModalTitle: "Редактировать мысль",
    saveEditBtn: "Сохранить изменения",
    closeBtn: "Закрыть",
    deleteConfirmTitle: "Удалить мысль?",
    deleteConfirmText: "Запись будет удалена без возможности восстановления.",
    copied: "Скопировано",
    prefs: {
      panelTitle: "Персонализация пространства мыслей",
      canvas: "Фон полотна",
      canvases: {
        vibe: "Вайб языка",
        minimal: "Чистый минимал",
        paper: "Бумага-блокнот",
        grid: "Сетка-чертёж",
        midnight: "Глубокий фокус",
      },
      layout: "Макет сетки",
      layouts: {
        masonry: "Доска (Плитки)",
        journal: "Дневник (Колонка)",
        compact: "Компакт-сетка",
      },
      font: "Шрифт",
      fonts: {
        sans: "Современный Sans",
        serif: "Книжный Serif",
        mono: "Технический Mono",
      },
      cardLook: "Стиль карточек",
      cards: {
        glass: "Стекло",
        paper: "Плотная бумага",
        sharp: "Чёткий акцент",
      },
      defaultColor: "Цвет новой заметки",
      showMood: "Показывать иконку настроения",
    },
  },
  en: {
    title: "Thoughts & Mind Journal",
    subtitle:
      "A calm space for spontaneous ideas, reflections, and interactive checklists — styled your way.",
    customizeBtn: "Customize",
    activeTab: "Notes",
    archiveTab: "Archive",
    pinnedSection: "Pinned",
    othersSection: "Stream",
    searchPh: "Search thoughts & #tags...",
    allTags: "All tags",
    titlePh: "Title (optional)...",
    contentPh:
      "Capture a thought, idea, or checklist (- [ ] task). Press Ctrl+Enter to save instantly...",
    tagsPh: "Comma-separated tags (e.g. ideas, mindset, coding)",
    addCheckBtn: "+ Checkbox",
    saveNoteBtn: "Save thought",
    savingBtn: "Saving...",
    pinLabel: "Pin",
    mmrHint: "+8 Task-System MMR for notes >= 15 chars",
    mmrEarnedToast: "Saved! Meaningful thoughts award +8 Task-System MMR",
    emptyActive: "Your mind canvas is clear. Capture your first thought above ✨",
    emptyArchive: "Archive is empty.",
    editModalTitle: "Edit Thought",
    saveEditBtn: "Save changes",
    closeBtn: "Close",
    deleteConfirmTitle: "Delete thought?",
    deleteConfirmText: "This note will be permanently removed.",
    copied: "Copied",
    prefs: {
      panelTitle: "Workspace Customization",
      canvas: "Canvas style",
      canvases: {
        vibe: "Language Vibe",
        minimal: "Clean Minimal",
        paper: "Tactile Paper",
        grid: "Blueprint Grid",
        midnight: "Deep Focus",
      },
      layout: "Layout",
      layouts: {
        masonry: "Board (Masonry)",
        journal: "Journal Stream",
        compact: "Compact Grid",
      },
      font: "Typography",
      fonts: {
        sans: "Modern Sans",
        serif: "Editorial Serif",
        mono: "Tech Mono",
      },
      cardLook: "Card aesthetic",
      cards: {
        glass: "Frosted Glass",
        paper: "Solid Paper",
        sharp: "Accent Stripe",
      },
      defaultColor: "Default color",
      showMood: "Show mood sticker",
    },
  },
  ja: {
    title: "思考ノート・ジャーナル",
    subtitle:
      "日々のひらめきや振り返り、チェックリストを自由に記録。背景やレイアウトも好みにカスタマイズできます。",
    customizeBtn: "デザイン設定",
    activeTab: "ノート",
    archiveTab: "アーカイブ",
    pinnedSection: "ピン留め",
    othersSection: "タイムライン",
    searchPh: "ノートや #タグ で検索...",
    allTags: "すべて",
    titlePh: "タイトル（任意）...",
    contentPh:
      "思考やメモ、チェックリスト (- [ ] タスク) を入力... (Ctrl+Enter で保存)",
    tagsPh: "タグをカンマ区切りで入力 (例: アイデア, 振り返り)",
    addCheckBtn: "+ チェック",
    saveNoteBtn: "ノートを保存",
    savingBtn: "保存中...",
    pinLabel: "ピン留め",
    mmrHint: "15文字以上の記録で +8 Task-System MMR",
    mmrEarnedToast: "保存しました！ +8 Task-System MMR を獲得",
    emptyActive: "まだ思考ノートがありません。上から最初の記録を残してみましょう ✨",
    emptyArchive: "アーカイブされたノートはありません。",
    editModalTitle: "ノートを編集",
    saveEditBtn: "変更を保存",
    closeBtn: "閉じる",
    deleteConfirmTitle: "ノートを削除しますか？",
    deleteConfirmText: "削除すると元に戻せません。",
    copied: "コピー済",
    prefs: {
      panelTitle: "思考スタジオのカスタマイズ",
      canvas: "背景スタイル",
      canvases: {
        vibe: "言語バイブ",
        minimal: "ミニマル",
        paper: "ノート用紙",
        grid: "方眼グリッド",
        midnight: "ディープフォーカス",
      },
      layout: "レイアウト",
      layouts: {
        masonry: "ボード (タイル)",
        journal: "ジャーナル (1列)",
        compact: "コンパクト",
      },
      font: "フォント",
      fonts: {
        sans: "Sans",
        serif: "Serif",
        mono: "Mono",
      },
      cardLook: "カードスタイル",
      cards: {
        glass: "ガラス",
        paper: "ペーパー",
        sharp: "アクセントライン",
      },
      defaultColor: "標準カラー",
      showMood: "ムードアイコンを表示",
    },
  },
};

export function ThoughtsHub() {
  const { language, theme, locale, studyPalette, checkUserRole } = useApp();
  const txt = TEXTS[language];

  const [notes, setNotes] = useState<ThoughtNote[]>([]);
  const [prefs, setPrefs] = useState<ThoughtPreferences>(DEFAULT_PREFS);
  const [loading, setLoading] = useState(true);

  // Studio UI states
  const [showCustomize, setShowCustomize] = useState(false);
  const [viewMode, setViewMode] = useState<"active" | "archived">("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string>("");

  // Composer state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("💡");
  const [colorTag, setColorTag] = useState<ColorTag>("default");
  const [tagsRaw, setTagsRaw] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [savingNew, setSavingNew] = useState(false);

  // Edit modal state
  const [editingNote, setEditingNote] = useState<ThoughtNote | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editMood, setEditMood] = useState("💡");
  const [editColor, setEditColor] = useState<ColorTag>("default");
  const [editTagsRaw, setEditTagsRaw] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const loadThoughts = useCallback(async () => {
    try {
      const resp = await api.get<{
        items: ThoughtNote[];
        preferences: ThoughtPreferences;
      }>("/thoughts");
      setNotes(resp.data.items || []);
      if (resp.data.preferences) {
        setPrefs(resp.data.preferences);
        setColorTag(resp.data.preferences.defaultColor || "default");
      }
    } catch (e) {
      console.error("Failed to fetch thoughts", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadThoughts();
  }, [loadThoughts]);

  const updatePref = async <K extends keyof ThoughtPreferences>(
    key: K,
    val: ThoughtPreferences[K],
  ) => {
    const next = { ...prefs, [key]: val };
    setPrefs(next);
    if (key === "defaultColor") {
      setColorTag(val as ColorTag);
    }
    try {
      const resp = await api.patch<ThoughtPreferences>("/thoughts/preferences", {
        [key]: val,
      });
      if (resp.data) setPrefs(resp.data);
    } catch (e) {
      console.error("Failed to save preference", e);
    }
  };

  const parseTags = (raw: string): string[] =>
    raw
      .split(/[,#\s]+/)
      .map((t) => t.trim().toLowerCase())
      .filter((t, i, arr) => t.length > 0 && arr.indexOf(t) === i)
      .slice(0, 8);

  const handleCreateNote = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanContent = content.trim();
    if (!cleanContent) return;

    setSavingNew(true);
    try {
      const resp = await api.post<ThoughtNote>("/thoughts", {
        title: title.trim() || undefined,
        content: cleanContent,
        mood,
        colorTag,
        tags: parseTags(tagsRaw),
        isPinned,
      });
      setNotes((prev) => [resp.data, ...prev]);
      setTitle("");
      setContent("");
      setTagsRaw("");
      setIsPinned(false);
      setColorTag(prefs.defaultColor);

      if (cleanContent.length >= 15) {
        setToastMsg(txt.mmrEarnedToast);
        checkUserRole();
        setTimeout(() => setToastMsg(""), 3500);
      }
    } catch (err) {
      console.error("Create thought failed", err);
    } finally {
      setSavingNew(false);
    }
  };

  const handlePatchNote = async (
    id: string,
    patch: Partial<{
      title: string;
      content: string;
      mood: string;
      colorTag: ColorTag;
      tags: string[];
      isPinned: boolean;
      isArchived: boolean;
    }>,
  ) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...patch } : n)),
    );
    try {
      const resp = await api.patch<ThoughtNote>(`/thoughts/${id}`, patch);
      setNotes((prev) => prev.map((n) => (n.id === id ? resp.data : n)));
    } catch {
      loadThoughts();
    }
  };

  const handleToggleChecklistLine = (note: ThoughtNote, lineIndex: number) => {
    const lines = note.content.split(/\r?\n/);
    const line = lines[lineIndex];
    if (!line) return;
    if (/^\s*-\s+\[\s\]/.test(line)) {
      lines[lineIndex] = line.replace(/^(\s*-\s+)\[\s\]/, "$1[x]");
    } else if (/^\s*-\s+\[[xX]\]/.test(line)) {
      lines[lineIndex] = line.replace(/^(\s*-\s+)\[[xX]\]/, "$1[ ]");
    } else {
      return;
    }
    handlePatchNote(note.id, { content: lines.join("\n") });
  };

  const handleDeleteNote = async (note: ThoughtNote) => {
    const ok = await confirmModal({
      title: txt.deleteConfirmTitle,
      message: txt.deleteConfirmText,
      variant: "danger",
    });
    if (!ok) return;
    setNotes((prev) => prev.filter((n) => n.id !== note.id));
    try {
      await api.delete(`/thoughts/${note.id}`);
    } catch {
      loadThoughts();
    }
  };

  const openEditModal = (note: ThoughtNote) => {
    setEditingNote(note);
    setEditTitle(note.title || "");
    setEditContent(note.content);
    setEditMood(note.mood || "💡");
    setEditColor(note.colorTag || "default");
    setEditTagsRaw((note.tags || []).join(", "));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNote || !editContent.trim()) return;
    setSavingEdit(true);
    try {
      await handlePatchNote(editingNote.id, {
        title: editTitle.trim(),
        content: editContent.trim(),
        mood: editMood,
        colorTag: editColor,
        tags: parseTags(editTagsRaw),
      });
      setEditingNote(null);
    } finally {
      setSavingEdit(false);
    }
  };

  const allTags = useMemo(() => {
    const counts = new Map<string, number>();
    notes
      .filter((n) => (viewMode === "archived" ? n.isArchived : !n.isArchived))
      .forEach((n) => {
        (n.tags || []).forEach((tag) => {
          counts.set(tag, (counts.get(tag) || 0) + 1);
        });
      });
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [notes, viewMode]);

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return notes
      .filter((n) => (viewMode === "archived" ? n.isArchived : !n.isArchived))
      .filter((n) => {
        if (selectedTag && !(n.tags || []).includes(selectedTag)) return false;
        if (!q) return true;
        return (
          (n.title || "").toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          (n.tags || []).some((tg) => tg.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
  }, [notes, viewMode, selectedTag, searchQuery]);

  const pinnedNotes = useMemo(
    () => (viewMode === "active" ? filteredNotes.filter((n) => n.isPinned) : []),
    [filteredNotes, viewMode],
  );
  const regularNotes = useMemo(
    () => (viewMode === "active" ? filteredNotes.filter((n) => !n.isPinned) : filteredNotes),
    [filteredNotes, viewMode],
  );

  const fontFamilyCss =
    prefs.fontStyle === "serif"
      ? 'Georgia, "Times New Roman", serif'
      : prefs.fontStyle === "mono"
        ? 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'
        : "inherit";

  const canvasWrapperStyle = useMemo<React.CSSProperties>(() => {
    const isLight = theme === "light";
    const base: React.CSSProperties = {
      borderRadius: "var(--radius-lg)",
      padding: "var(--space-5)",
      transition: "all 0.25s ease",
      minHeight: "calc(100vh - 140px)",
    };

    if (prefs.canvasStyle === "paper") {
      return {
        ...base,
        backgroundColor: isLight ? "#faf7f0" : "#151412",
        backgroundImage: isLight
          ? "radial-gradient(rgba(120,100,70,0.14) 1px, transparent 1px)"
          : "radial-gradient(rgba(255,240,210,0.08) 1px, transparent 1px)",
        backgroundSize: "18px 18px",
        border: "1px solid var(--border-subtle)",
      };
    }
    if (prefs.canvasStyle === "grid") {
      return {
        ...base,
        backgroundImage: isLight
          ? "linear-gradient(rgba(59,130,246,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.07) 1px, transparent 1px)"
          : "linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)",
        backgroundSize: "24px 24px",
        border: "1px solid var(--border-subtle)",
      };
    }
    if (prefs.canvasStyle === "midnight") {
      return {
        ...base,
        background: isLight
          ? "linear-gradient(145deg, #eef2ff 0%, #f8fafc 60%, #e0f2fe 100%)"
          : "radial-gradient(circle at top right, rgba(99, 102, 241, 0.16), transparent 55%), radial-gradient(circle at bottom left, rgba(16, 185, 129, 0.1), transparent 55%), #0b0f19",
        border: "1px solid var(--border-subtle)",
      };
    }
    if (prefs.canvasStyle === "vibe") {
      return {
        ...base,
        background: `radial-gradient(circle at 85% 10%, ${studyPalette.softTint}, transparent 45%), radial-gradient(circle at 10% 80%, ${studyPalette.secondaryHex}14, transparent 45%)`,
      };
    }
    return base;
  }, [prefs.canvasStyle, theme, studyPalette]);

  const getNoteCardStyle = (noteColor: ColorTag): React.CSSProperties => {
    const isLight = theme === "light";
    const col = COLOR_STYLES[noteColor] || COLOR_STYLES.default;
    const bgTint = isLight ? col.tintLight : col.tintDark;

    if (prefs.cardStyle === "paper") {
      return {
        backgroundColor: bgTint,
        borderColor: col.border,
        boxShadow: isLight
          ? "0 6px 18px rgba(15, 23, 42, 0.06)"
          : "0 8px 20px rgba(0, 0, 0, 0.35)",
      };
    }
    if (prefs.cardStyle === "sharp") {
      return {
        backgroundColor: bgTint,
        borderColor: "var(--border)",
        borderLeftWidth: "4px",
        borderLeftColor: col.dot,
      };
    }
    return {
      backgroundColor: bgTint,
      borderColor: col.border,
      backdropFilter: "blur(8px)",
    };
  };

  const renderGridContainerStyle = (): React.CSSProperties => {
    if (prefs.layoutMode === "journal") {
      return {
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        maxWidth: "820px",
        width: "100%",
        margin: "0 auto",
      };
    }
    if (prefs.layoutMode === "compact") {
      return {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "12px",
      };
    }
    return {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))",
      gap: "14px",
      alignItems: "start",
    };
  };

  const renderNoteCard = (note: ThoughtNote) => {
    const lines = note.content.split(/\r?\n/);
    return (
      <Card
        key={note.id}
        style={{
          padding: prefs.layoutMode === "compact" ? "14px" : "18px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          fontFamily: fontFamilyCss,
          transition: "transform 0.15s ease, box-shadow 0.15s ease",
          ...getNoteCardStyle(note.colorTag || "default"),
        }}
      >
        {/* Верх карточки: Настроение + Заголовок + Pin */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }}>
            {prefs.showMoodBadge && (
              <span style={{ fontSize: "20px", lineHeight: 1 }}>{note.mood || "💡"}</span>
            )}
            {note.title && (
              <h3
                style={{
                  margin: 0,
                  fontSize: prefs.layoutMode === "compact" ? "15px" : "16.5px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  lineHeight: 1.3,
                  wordBreak: "break-word",
                }}
              >
                {note.title}
              </h3>
            )}
          </div>

          <button
            type="button"
            onClick={() => handlePatchNote(note.id, { isPinned: !note.isPinned })}
            title={txt.pinLabel}
            style={{
              background: "none",
              border: "none",
              color: note.isPinned ? studyPalette.accentHex : "var(--text-muted)",
              cursor: "pointer",
              padding: "3px",
              flexShrink: 0,
            }}
          >
            {note.isPinned ? <Pin size={15} /> : <PinOff size={15} />}
          </button>
        </div>

        {/* Содержимое мысли с кликабельными чекбоксами */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            fontSize: prefs.layoutMode === "compact" ? "13px" : "14px",
            lineHeight: 1.55,
            color: "var(--text-primary)",
            wordBreak: "break-word",
          }}
        >
          {lines.map((line, lIdx) => {
            const uncheckedMatch = line.match(/^\s*-\s+\[\s\]\s*(.*)$/);
            const checkedMatch = line.match(/^\s*-\s+\[[xX]\]\s*(.*)$/);
            if (uncheckedMatch || checkedMatch) {
              const checked = Boolean(checkedMatch);
              const labelText = (checkedMatch ? checkedMatch[1] : uncheckedMatch![1]) || "";
              return (
                <button
                  key={`${note.id}-l-${lIdx}`}
                  type="button"
                  onClick={() => handleToggleChecklistLine(note, lIdx)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                    background: "none",
                    border: "none",
                    padding: "2px 0",
                    textAlign: "left",
                    color: checked ? "var(--text-muted)" : "var(--text-primary)",
                    textDecoration: checked ? "line-through" : "none",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                  }}
                >
                  {checked ? (
                    <CheckSquare
                      size={15}
                      style={{ color: "var(--success)", marginTop: "3px", flexShrink: 0 }}
                    />
                  ) : (
                    <Square
                      size={15}
                      style={{ color: "var(--text-muted)", marginTop: "3px", flexShrink: 0 }}
                    />
                  )}
                  <span>{labelText}</span>
                </button>
              );
            }
            if (!line.trim()) {
              return <div key={`${note.id}-l-${lIdx}`} style={{ height: "6px" }} />;
            }
            return (
              <div key={`${note.id}-l-${lIdx}`} style={{ whiteSpace: "pre-wrap" }}>
                {line}
              </div>
            );
          })}
        </div>

        {/* Теги */}
        {note.tags && note.tags.length > 0 && (
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {note.tags.map((tg) => (
              <button
                key={tg}
                type="button"
                onClick={() => setSelectedTag((cur) => (cur === tg ? "" : tg))}
                style={{
                  padding: "2px 8px",
                  borderRadius: "999px",
                  border: "1px solid var(--border-subtle)",
                  backgroundColor: "var(--bg-surface)",
                  color: selectedTag === tg ? studyPalette.accentHex : "var(--text-secondary)",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                #{tg}
              </button>
            ))}
          </div>
        )}

        {/* Подвал карточки */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "8px",
            borderTop: "1px solid var(--border-subtle)",
            gap: "6px",
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {new Date(note.updatedAt).toLocaleDateString(locale, {
              day: "numeric",
              month: "short",
            })}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {/* Быстрая смена цвета точками */}
            {(["default", "amber", "blue", "emerald", "rose", "violet"] as ColorTag[]).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => handlePatchNote(note.id, { colorTag: c })}
                  style={{
                    width: "11px",
                    height: "11px",
                    borderRadius: "999px",
                    border:
                      note.colorTag === c
                        ? "2px solid var(--text-primary)"
                        : "1px solid var(--border)",
                    backgroundColor: COLOR_STYLES[c].dot,
                    padding: 0,
                    cursor: "pointer",
                  }}
                />
              ),
            )}

            <button
              type="button"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    note.title ? `${note.title}\n\n${note.content}` : note.content,
                  );
                  setCopiedId(note.id);
                  setTimeout(() => setCopiedId((cur) => (cur === note.id ? null : cur)), 1800);
                } catch {
                  // ignore
                }
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
              }}
              title={txt.copied}
            >
              {copiedId === note.id ? <Check size={14} color="var(--success)" /> : <Copy size={14} />}
            </button>

            <button
              type="button"
              onClick={() => openEditModal(note)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <Edit3 size={14} />
            </button>

            <button
              type="button"
              onClick={() => handlePatchNote(note.id, { isArchived: !note.isArchived })}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              {note.isArchived ? <ArchiveRestore size={14} /> : <Archive size={14} />}
            </button>

            <button
              type="button"
              onClick={() => handleDeleteNote(note)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div style={canvasWrapperStyle}>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
        {/* Верхняя панель */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Badge variant="accent">Thoughts Studio</Badge>
              <Badge variant="default">
                {notes.filter((n) => !n.isArchived).length}
              </Badge>
            </div>
            <h1 style={{ margin: "0 0 6px 0", fontSize: "26px", fontWeight: 700 }}>
              {txt.title}
            </h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
              {txt.subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <Button
              variant={viewMode === "active" ? "primary" : "secondary"}
              onClick={() => setViewMode("active")}
              style={{ padding: "7px 12px", fontSize: "13px" }}
            >
              {txt.activeTab}
            </Button>
            <Button
              variant={viewMode === "archived" ? "primary" : "secondary"}
              onClick={() => setViewMode("archived")}
              style={{ padding: "7px 12px", fontSize: "13px", gap: "6px" }}
            >
              <Archive size={14} /> {txt.archiveTab}
            </Button>
            <Button
              variant={showCustomize ? "primary" : "secondary"}
              onClick={() => setShowCustomize((s) => !s)}
              style={{ padding: "7px 12px", fontSize: "13px", gap: "6px" }}
            >
              <SlidersHorizontal size={14} /> {txt.customizeBtn}
            </Button>
          </div>
        </div>

        {/* ── ПАНЕЛЬ КАСТОМИЗАЦИИ ПОЛЬЗОВАТЕЛЯ ── */}
        {showCustomize && (
          <Card
            style={{
              padding: "var(--space-5)",
              borderColor: studyPalette.accentHex,
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "14px" }}>
              <Palette size={16} style={{ color: studyPalette.accentHex }} />
              <span>{txt.prefs.panelTitle}</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                gap: "14px",
              }}
            >
              {/* Фон */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  {txt.prefs.canvas}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(["vibe", "minimal", "paper", "grid", "midnight"] as CanvasStyle[]).map(
                    (c) => (
                      <Button
                        key={c}
                        type="button"
                        variant={prefs.canvasStyle === c ? "primary" : "secondary"}
                        onClick={() => updatePref("canvasStyle", c)}
                        style={{ padding: "4px 10px", fontSize: "12px" }}
                      >
                        {txt.prefs.canvases[c]}
                      </Button>
                    ),
                  )}
                </div>
              </div>

              {/* Макет */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  {txt.prefs.layout}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(
                    [
                      { id: "masonry", icon: LayoutGrid },
                      { id: "journal", icon: List },
                      { id: "compact", icon: Type },
                    ] as const
                  ).map((l) => {
                    const Icon = l.icon;
                    return (
                      <Button
                        key={l.id}
                        type="button"
                        variant={prefs.layoutMode === l.id ? "primary" : "secondary"}
                        onClick={() => updatePref("layoutMode", l.id)}
                        style={{ padding: "4px 10px", fontSize: "12px", gap: "5px" }}
                      >
                        <Icon size={12} /> {txt.prefs.layouts[l.id]}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Шрифт и Карточки */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  {txt.prefs.font} & {txt.prefs.cardLook}
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {(["sans", "serif", "mono"] as FontStyle[]).map((f) => (
                    <Button
                      key={f}
                      type="button"
                      variant={prefs.fontStyle === f ? "primary" : "secondary"}
                      onClick={() => updatePref("fontStyle", f)}
                      style={{ padding: "4px 10px", fontSize: "12px" }}
                    >
                      {txt.prefs.fonts[f]}
                    </Button>
                  ))}
                  {(["glass", "paper", "sharp"] as CardStyleMode[]).map((cs) => (
                    <Button
                      key={cs}
                      type="button"
                      variant={prefs.cardStyle === cs ? "primary" : "secondary"}
                      onClick={() => updatePref("cardStyle", cs)}
                      style={{ padding: "4px 10px", fontSize: "12px" }}
                    >
                      {txt.prefs.cards[cs]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Цвет и бейдж настроения */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>
                  {txt.prefs.defaultColor}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  {(["default", "amber", "blue", "emerald", "rose", "violet"] as ColorTag[]).map(
                    (c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => updatePref("defaultColor", c)}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "999px",
                          border:
                            prefs.defaultColor === c
                              ? "2px solid var(--text-primary)"
                              : "1px solid var(--border)",
                          backgroundColor: COLOR_STYLES[c].dot,
                          cursor: "pointer",
                        }}
                      />
                    ),
                  )}
                </div>
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    fontSize: "12.5px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={prefs.showMoodBadge}
                    onChange={(e) => updatePref("showMoodBadge", e.target.checked)}
                  />
                  <span>{txt.prefs.showMood}</span>
                </label>
              </div>
            </div>
          </Card>
        )}

        {/* ── БЫСТРЫЙ КОМПОЗЕР МЫСЛИ ── */}
        {viewMode === "active" && (
          <Card
            style={{
              padding: "var(--space-5)",
              fontFamily: fontFamilyCss,
              ...getNoteCardStyle(colorTag),
            }}
          >
            <form
              onSubmit={handleCreateNote}
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
                {/* Настроения */}
                <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                  {MOOD_PRESETS.map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMood(m)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        border:
                          mood === m
                            ? `2px solid ${studyPalette.accentHex}`
                            : "1px solid var(--border-subtle)",
                        backgroundColor: mood === m ? studyPalette.softTint : "var(--surface)",
                        cursor: "pointer",
                        fontSize: "15px",
                      }}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={txt.titlePh}
                  style={{
                    flex: 1,
                    minWidth: "200px",
                    height: "34px",
                    padding: "0 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "inherit",
                    outline: "none",
                  }}
                />
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={(e) => {
                  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
                    e.preventDefault();
                    handleCreateNote();
                  }
                }}
                placeholder={txt.contentPh}
                rows={3}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  lineHeight: 1.55,
                  fontFamily: "inherit",
                  resize: "vertical",
                  outline: "none",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", flex: 1 }}>
                  <input
                    type="text"
                    value={tagsRaw}
                    onChange={(e) => setTagsRaw(e.target.value)}
                    placeholder={txt.tagsPh}
                    style={{
                      minWidth: "200px",
                      flex: 1,
                      maxWidth: "300px",
                      height: "32px",
                      padding: "0 10px",
                      borderRadius: "var(--radius-sm)",
                      border: "1px solid var(--border)",
                      backgroundColor: "var(--surface)",
                      color: "var(--text-primary)",
                      fontSize: "12.5px",
                      outline: "none",
                    }}
                  />

                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      setContent((prev) =>
                        prev && !prev.endsWith("\n") ? `${prev}\n- [ ] ` : `${prev}- [ ] `,
                      )
                    }
                    style={{ padding: "5px 10px", fontSize: "12px" }}
                  >
                    {txt.addCheckBtn}
                  </Button>

                  <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                    {(["default", "amber", "blue", "emerald", "rose", "violet"] as ColorTag[]).map(
                      (c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColorTag(c)}
                          style={{
                            width: "15px",
                            height: "15px",
                            borderRadius: "999px",
                            border:
                              colorTag === c
                                ? "2px solid var(--text-primary)"
                                : "1px solid var(--border)",
                            backgroundColor: COLOR_STYLES[c].dot,
                            cursor: "pointer",
                          }}
                        />
                      ),
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPinned((p) => !p)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      padding: "5px 9px",
                      borderRadius: "var(--radius-sm)",
                      border: `1px solid ${isPinned ? studyPalette.accentHex : "var(--border)"}`,
                      backgroundColor: isPinned ? studyPalette.softTint : "var(--surface)",
                      color: isPinned ? studyPalette.accentHex : "var(--text-secondary)",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    <Pin size={12} /> {txt.pinLabel}
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    {txt.mmrHint}
                  </span>
                  <Button
                    type="submit"
                    disabled={!content.trim() || savingNew}
                    style={{
                      backgroundColor: studyPalette.accentHex,
                      color: "#ffffff",
                      gap: "6px",
                    }}
                  >
                    <Plus size={15} />
                    {savingNew ? txt.savingBtn : txt.saveNoteBtn}
                  </Button>
                </div>
              </div>
            </form>
          </Card>
        )}

        {toastMsg && (
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--success)",
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              color: "var(--success)",
              fontSize: "13px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={15} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Поиск + Фильтр по #тегам */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ width: "260px", maxWidth: "100%" }}>
            <Input
              icon={<Search size={15} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={txt.searchPh}
            />
          </div>

          {allTags.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              <Button
                variant={selectedTag === "" ? "primary" : "secondary"}
                onClick={() => setSelectedTag("")}
                style={{ padding: "5px 10px", fontSize: "12px" }}
              >
                {txt.allTags}
              </Button>
              {allTags.map(([tg, count]) => (
                <Button
                  key={tg}
                  variant={selectedTag === tg ? "primary" : "secondary"}
                  onClick={() => setSelectedTag((cur) => (cur === tg ? "" : tg))}
                  style={{ padding: "5px 10px", fontSize: "12px" }}
                >
                  #{tg} ({count})
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* Сетка заметок */}
        {loading ? (
          <Card style={{ padding: "40px", textAlign: "center", color: "var(--text-muted)" }}>
            KAVAULT...
          </Card>
        ) : filteredNotes.length === 0 ? (
          <Card style={{ padding: "42px", textAlign: "center", color: "var(--text-muted)" }}>
            {viewMode === "archived" ? txt.emptyArchive : txt.emptyActive}
          </Card>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Pin size={12} /> {txt.pinnedSection} ({pinnedNotes.length})
                </div>
                <div style={renderGridContainerStyle()}>
                  {pinnedNotes.map(renderNoteCard)}
                </div>
              </div>
            )}

            {regularNotes.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {pinnedNotes.length > 0 && (
                  <div
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-muted)",
                    }}
                  >
                    {txt.othersSection} ({regularNotes.length})
                  </div>
                )}
                <div style={renderGridContainerStyle()}>
                  {regularNotes.map(renderNoteCard)}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Модальное окно редактирования */}
      <Modal
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        title={txt.editModalTitle}
        size="md"
      >
        <form
          onSubmit={handleSaveEdit}
          style={{ display: "flex", flexDirection: "column", gap: "12px" }}
        >
          <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
            {MOOD_PRESETS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setEditMood(m)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  border:
                    editMood === m
                      ? `2px solid ${studyPalette.accentHex}`
                      : "1px solid var(--border-subtle)",
                  backgroundColor: editMood === m ? studyPalette.softTint : "var(--surface)",
                  cursor: "pointer",
                  fontSize: "15px",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder={txt.titlePh}
          />

          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={7}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-primary)",
              fontSize: "14px",
              lineHeight: 1.55,
              fontFamily: fontFamilyCss,
              resize: "vertical",
              outline: "none",
            }}
          />

          <Input
            value={editTagsRaw}
            onChange={(e) => setEditTagsRaw(e.target.value)}
            placeholder={txt.tagsPh}
          />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {(["default", "amber", "blue", "emerald", "rose", "violet"] as ColorTag[]).map(
              (c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setEditColor(c)}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "999px",
                    border:
                      editColor === c
                        ? "2px solid var(--text-primary)"
                        : "1px solid var(--border)",
                    backgroundColor: COLOR_STYLES[c].dot,
                    cursor: "pointer",
                  }}
                />
              ),
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button type="button" variant="ghost" onClick={() => setEditingNote(null)}>
              {txt.closeBtn}
            </Button>
            <Button
              type="submit"
              disabled={!editContent.trim() || savingEdit}
              style={{ backgroundColor: studyPalette.accentHex, color: "#ffffff" }}
            >
              {savingEdit ? txt.savingBtn : txt.saveEditBtn}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
