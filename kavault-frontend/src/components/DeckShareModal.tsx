import React, { useEffect, useState } from "react";
import { Share2, Copy, Check, Trash2, ExternalLink, Sparkles, BookOpen } from "lucide-react";
import { Capacitor } from "@capacitor/core";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import { api, getApiBaseURL } from "../api/axios";
import type { Language } from "../i18n/translations";
import { STUDY_LEVELS, type StudyLanguage } from "../data/studyVibes";

interface SharedDeckItem {
  id: string;
  slug: string;
  title: string;
  description?: string | null;
  language: string;
  levelFilter?: string | null;
  importCount: number;
  createdAt: string;
  cardsCount: number;
  passagesCount: number;
}

interface DeckShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyLanguage: StudyLanguage;
  uiLang: Language;
  totalCards: number;
  totalPassages: number;
  selectedLevel: string;
  accentColor: string;
}

const TEXTS: Record<
  Language,
  {
    title: string;
    subtitle: string;
    deckTitleLabel: string;
    deckTitlePh: string;
    descLabel: string;
    descPh: string;
    levelLabel: string;
    allLevels: string;
    includePassages: string;
    createBtn: string;
    creatingBtn: string;
    emptyCardsWarn: string;
    createdBanner: string;
    copyLink: string;
    copied: string;
    openLink: string;
    myLinksTitle: string;
    noLinks: string;
    cardsWord: string;
    passagesWord: string;
    importsWord: string;
    errMsg: string;
    closeBtn: string;
  }
> = {
  ru: {
    title: "Публичная ссылка на набор (Share Deck)",
    subtitle:
      "Создайте короткую ссылку на ваш текущий словарь. Любой пользователь сможет открыть её и скопировать колоду себе в 1 клик.",
    deckTitleLabel: "Название набора",
    deckTitlePh: "Например: Японский для поездок / Мои слова B2",
    descLabel: "Описание (необязательно)",
    descPh: "Коротко о том, что внутри этого набора...",
    levelLabel: "Фильтр уровня",
    allLevels: "Все уровни сразу",
    includePassages: "Включить также мои сохранённые тексты и грамматику",
    createBtn: "Создать публичную ссылку",
    creatingBtn: "Создание...",
    emptyCardsWarn: "Сначала добавьте хотя бы 1 карточку в этом языке, чтобы поделиться набором.",
    createdBanner: "Ссылка готова! Отправьте её друзьям или коллегам:",
    copyLink: "Копировать",
    copied: "Скопировано",
    openLink: "Открыть",
    myLinksTitle: "Мои созданные ссылки",
    noLinks: "Вы пока не создали ни одной публичной ссылки.",
    cardsWord: "карт.",
    passagesWord: "текст.",
    importsWord: "импортов",
    errMsg: "Не удалось создать ссылку. Проверьте, что в выбранном уровне есть карточки.",
    closeBtn: "Закрыть",
  },
  en: {
    title: "Public Share Deck Link",
    subtitle:
      "Generate a short public link to a snapshot of your current deck. Anyone can preview and clone it in 1 click.",
    deckTitleLabel: "Deck title",
    deckTitlePh: "e.g. Travel Japanese / Essential B2 Pack",
    descLabel: "Description (optional)",
    descPh: "Brief summary of what is inside...",
    levelLabel: "Level filter",
    allLevels: "All levels",
    includePassages: "Also include my saved reading texts & grammar notes",
    createBtn: "Generate public link",
    creatingBtn: "Creating...",
    emptyCardsWarn: "Add at least 1 study card in this language before sharing.",
    createdBanner: "Link created! Share it with friends:",
    copyLink: "Copy",
    copied: "Copied",
    openLink: "Open",
    myLinksTitle: "My shared links",
    noLinks: "No shared links yet.",
    cardsWord: "cards",
    passagesWord: "texts",
    importsWord: "imports",
    errMsg: "Could not create share link. Make sure cards match the selected filter.",
    closeBtn: "Close",
  },
  ja: {
    title: "デッキの共有リンクを作成 (Share Deck)",
    subtitle:
      "現在の単語帳のスナップショットへの共有リンクを発行します。他のユーザーはワンクリックで自分のデッキにコピーできます。",
    deckTitleLabel: "デッキ名",
    deckTitlePh: "例: 旅行のための日本語 / N4重要単語",
    descLabel: "説明（任意）",
    descPh: "このセットの内容について...",
    levelLabel: "レベル絞り込み",
    allLevels: "全レベル",
    includePassages: "保存済みの長文・文法ノートも含める",
    createBtn: "共有リンクを作成",
    creatingBtn: "作成中...",
    emptyCardsWarn: "共有する前にカードを1枚以上追加してください。",
    createdBanner: "共有リンクを作成しました:",
    copyLink: "コピー",
    copied: "コピー済",
    openLink: "開く",
    myLinksTitle: "作成済みの共有リンク",
    noLinks: "共有リンクはまだありません。",
    cardsWord: "枚",
    passagesWord: "記事",
    importsWord: "回取得",
    errMsg: "リンクを作成できませんでした。対象カードがあるか確認してください。",
    closeBtn: "閉じる",
  },
};

export function buildPublicDeckUrl(slug: string): string {
  if (typeof window !== "undefined") {
    const proto = window.location.protocol;
    const host = window.location.hostname;
    if (
      !Capacitor.isNativePlatform() &&
      (proto === "http:" || proto === "https:") &&
      host &&
      !proto.startsWith("file")
    ) {
      return `${window.location.origin}/#/share/${slug}`;
    }
  }
  const webBase = getApiBaseURL().replace(/\/+$/, "").replace(/:4000$/, "");
  return `${webBase}/#/share/${slug}`;
}

export function DeckShareModal({
  isOpen,
  onClose,
  studyLanguage,
  uiLang,
  totalCards,
  totalPassages,
  selectedLevel,
  accentColor,
}: DeckShareModalProps) {
  const txt = TEXTS[uiLang];
  const levels = STUDY_LEVELS[studyLanguage];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>(selectedLevel || "ALL");
  const [includePassages, setIncludePassages] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [latestSlug, setLatestSlug] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [myDecks, setMyDecks] = useState<SharedDeckItem[]>([]);

  const loadMyDecks = async () => {
    try {
      const resp = await api.get<SharedDeckItem[]>("/social/decks/mine");
      setMyDecks(resp.data || []);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (isOpen) {
      setLevelFilter(selectedLevel || "ALL");
      setErrorMsg("");
      loadMyDecks();
    }
  }, [isOpen, selectedLevel]);

  const handleCopy = async (slug: string) => {
    const url = buildPublicDeckUrl(slug);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug((cur) => (cur === slug ? null : cur)), 2200);
    } catch {
      // fallback prompt if clipboard blocked
      window.prompt(txt.copyLink, url);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (totalCards === 0) return;
    setIsCreating(true);
    setErrorMsg("");
    try {
      const resp = await api.post<SharedDeckItem>("/social/decks/share", {
        title: title.trim() || `${studyLanguage.toUpperCase()} Study Deck`,
        description: description.trim() || undefined,
        language: studyLanguage,
        levelFilter,
        includePassages,
      });
      setLatestSlug(resp.data.slug);
      setTitle("");
      setDescription("");
      await loadMyDecks();
      handleCopy(resp.data.slug);
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || txt.errMsg);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/social/decks/${id}`);
      setMyDecks((prev) => prev.filter((d) => d.id !== id));
    } catch {
      // ignore
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={txt.title} size="md">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {txt.subtitle}
        </p>

        {totalCards === 0 ? (
          <div
            style={{
              padding: "14px",
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--border)",
              color: "var(--text-muted)",
              fontSize: "13px",
            }}
          >
            {txt.emptyCardsWarn}
          </div>
        ) : (
          <form
            onSubmit={handleCreate}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "14px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>
                {txt.deckTitleLabel}
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={txt.deckTitlePh}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <label style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>
                {txt.descLabel}
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={txt.descPh}
                style={{
                  height: "36px",
                  padding: "0 12px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "10px",
                alignItems: "end",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-secondary)" }}>
                  {txt.levelLabel}
                </span>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  style={{
                    height: "36px",
                    padding: "0 10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                    backgroundColor: "var(--surface)",
                    color: "var(--text-primary)",
                    fontSize: "13px",
                  }}
                >
                  <option value="ALL">{txt.allLevels}</option>
                  {levels.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.badge}
                    </option>
                  ))}
                </select>
              </div>

              {totalPassages > 0 && (
                <label
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "12.5px",
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    paddingBottom: "6px",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={includePassages}
                    onChange={(e) => setIncludePassages(e.target.checked)}
                  />
                  <span>
                    {txt.includePassages} ({totalPassages})
                  </span>
                </label>
              )}
            </div>

            {errorMsg && (
              <div style={{ color: "var(--error)", fontSize: "12.5px", fontWeight: 500 }}>
                {errorMsg}
              </div>
            )}

            <Button
              type="submit"
              disabled={isCreating}
              style={{
                backgroundColor: accentColor,
                color: "#ffffff",
                gap: "8px",
                alignSelf: "flex-start",
              }}
            >
              <Share2 size={15} /> {isCreating ? txt.creatingBtn : txt.createBtn}
            </Button>
          </form>
        )}

        {latestSlug && (
          <div
            style={{
              padding: "12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--success)",
              backgroundColor: "rgba(16, 185, 129, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            <div style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--success)" }}>
              <Sparkles size={13} style={{ display: "inline", marginRight: "6px" }} />
              {txt.createdBanner}
            </div>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <input
                readOnly
                value={buildPublicDeckUrl(latestSlug)}
                onClick={(e) => e.currentTarget.select()}
                style={{
                  flex: 1,
                  height: "32px",
                  padding: "0 10px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-primary)",
                  fontSize: "12px",
                }}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => handleCopy(latestSlug)}
                style={{ padding: "5px 10px", fontSize: "12px", gap: "5px" }}
              >
                {copiedSlug === latestSlug ? <Check size={13} /> : <Copy size={13} />}
                {copiedSlug === latestSlug ? txt.copied : txt.copyLink}
              </Button>
            </div>
          </div>
        )}

        {/* Список ранее созданных ссылок */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
            {txt.myLinksTitle} ({myDecks.length})
          </div>
          {myDecks.length === 0 ? (
            <div style={{ fontSize: "12.5px", color: "var(--text-muted)", padding: "8px 0" }}>
              {txt.noLinks}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {myDecks.map((d) => (
                <div
                  key={d.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 12px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {d.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        flexWrap: "wrap",
                        marginTop: "4px",
                        alignItems: "center",
                      }}
                    >
                      <Badge variant="default">
                        <BookOpen size={10} style={{ marginRight: "4px" }} />
                        {d.cardsCount} {txt.cardsWord}
                      </Badge>
                      {d.passagesCount > 0 && (
                        <Badge variant="default">
                          {d.passagesCount} {txt.passagesWord}
                        </Badge>
                      )}
                      <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                        {d.importCount} {txt.importsWord}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleCopy(d.slug)}
                      style={{ padding: "5px 8px", fontSize: "11.5px", gap: "4px" }}
                    >
                      {copiedSlug === d.slug ? <Check size={12} /> : <Copy size={12} />}
                      {copiedSlug === d.slug ? txt.copied : txt.copyLink}
                    </Button>
                    <a
                      href={`#/share/${d.slug}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "5px 7px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                        color: "var(--text-secondary)",
                        textDecoration: "none",
                      }}
                      title={txt.openLink}
                    >
                      <ExternalLink size={13} />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(d.id)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "5px",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button variant="ghost" onClick={onClose}>
            {txt.closeBtn}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
