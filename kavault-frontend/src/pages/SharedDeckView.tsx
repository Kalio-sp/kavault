import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Download,
  Globe,
  LogIn,
  Moon,
  Scroll,
  Sparkles,
  Sun,
  Trophy,
  Volume2,
} from "lucide-react";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { STUDY_VIBE_PALETTES, type StudyLanguage } from "../data/studyVibes";
import { speakText } from "../utils/audioPlayer";

interface PublicCardItem {
  word: string;
  reading?: string | null;
  meaning: string;
  example?: string | null;
  type?: string;
  studyLevel?: string | null;
}

interface PublicPassageItem {
  language?: string;
  kind?: string;
  level?: string;
  title: string;
  content: string;
  translation: string;
  notes?: string | null;
}

interface PublicSharedDeckResponse {
  slug: string;
  title: string;
  description?: string | null;
  language: string;
  levelFilter?: string | null;
  importCount: number;
  createdAt: string;
  authorNickname: string;
  authorRankTier: {
    key: string;
    title: string;
    emoji: string;
    color: string;
  };
  cards: PublicCardItem[];
  passages: PublicPassageItem[];
}

export function SharedDeckView() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage, checkUserRole } = useApp();

  const [deck, setDeck] = useState<PublicSharedDeckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    importedCards: number;
    importedPassages: number;
    totalCardsInDeck: number;
  } | null>(null);
  const [importError, setImportError] = useState("");

  const hasToken = Boolean(localStorage.getItem("access_token"));

  useEffect(() => {
    if (!slug) return;
    let active = true;
    setLoading(true);
    setNotFound(false);
    api
      .get<PublicSharedDeckResponse>(`/social/decks/public/${slug}`)
      .then((resp) => {
        if (active) setDeck(resp.data);
      })
      .catch(() => {
        if (active) setNotFound(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  const langKey = (
    deck?.language === "en" || deck?.language === "de" ? deck.language : "ja"
  ) as StudyLanguage;
  const palette = STUDY_VIBE_PALETTES[langKey];

  const handleSpeak = (text: string) => {
    if (hasToken) {
      speakText(text, palette.ttsLang);
      return;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = palette.ttsLang;
        window.speechSynthesis.speak(u);
      } catch {
        // ignore
      }
    }
  };

  const handleCloneDeck = async () => {
    if (!slug) return;
    if (!localStorage.getItem("access_token")) {
      navigate("/login");
      return;
    }
    setImporting(true);
    setImportError("");
    try {
      const resp = await api.post(`/social/decks/public/${slug}/import`);
      setImportResult(resp.data);
      await checkUserRole();
    } catch (err: any) {
      setImportError(
        err.response?.data?.message ||
          (language === "ru"
            ? "Ошибка при импорте колоды"
            : language === "ja"
              ? "デッキのインポートに失敗しました"
              : "Failed to import deck"),
      );
    } finally {
      setImporting(false);
    }
  };

  const ui = {
    ru: {
      backHub: "В мой словарь",
      login: "Войти / Регистрация",
      leaderboard: "Рейтинг Task-System",
      author: "Автор:",
      cardsCount: "Карточек:",
      passagesCount: "Текстов/правил:",
      importsCount: "Скачиваний:",
      cloneBtn: "Скопировать себе в 1 клик",
      cloningBtn: "Копирование...",
      loginToClone: "Войдите, чтобы скопировать в свой словарь",
      clonedOk: "Готово! Скопировано новых карточек:",
      openMyDeck: "Открыть мой словарь →",
      cardsSection: "Карточки в наборе",
      passagesSection: "Тексты и заметки",
      notFoundTitle: "Набор не найден",
      notFoundDesc: "Ссылка недействительна или автор удалил этот набор.",
    },
    en: {
      backHub: "Open My Hub",
      login: "Sign in / Register",
      leaderboard: "Task-System Leaderboard",
      author: "Author:",
      cardsCount: "Cards:",
      passagesCount: "Texts/notes:",
      importsCount: "Imports:",
      cloneBtn: "Clone to My Deck in 1 click",
      cloningBtn: "Cloning...",
      loginToClone: "Sign in to clone into your deck",
      clonedOk: "Done! New cards added:",
      openMyDeck: "Go to My Study Hub →",
      cardsSection: "Cards in this deck",
      passagesSection: "Texts & notes",
      notFoundTitle: "Deck not found",
      notFoundDesc: "This share link is invalid or was removed by its author.",
    },
    ja: {
      backHub: "マイ単語帳へ",
      login: "ログイン / 登録",
      leaderboard: "Task-System ランキング",
      author: "作成者:",
      cardsCount: "カード:",
      passagesCount: "長文/文法:",
      importsCount: "取得数:",
      cloneBtn: "ワンクリックで自分のデッキに追加",
      cloningBtn: "コピー中...",
      loginToClone: "ログインして自分のデッキに追加",
      clonedOk: "完了！追加されたカード:",
      openMyDeck: "学習ハブを開く →",
      cardsSection: "セット内のカード",
      passagesSection: "長文・ノート",
      notFoundTitle: "デッキが見つかりません",
      notFoundDesc: "リンクが無効か、作成者によって削除されました。",
    },
  }[language];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-primary)",
        color: "var(--text-primary)",
        padding: "var(--space-5)",
      }}
    >
      <div
        style={{
          maxWidth: "960px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        {/* Верхняя публичная шапка */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            paddingBottom: "var(--space-3)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Link
              to={hasToken ? "/japanese" : "/login"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                textDecoration: "none",
                color: "var(--text-primary)",
                fontWeight: 700,
                fontSize: "15px",
              }}
            >
              <ArrowLeft size={16} />
              <span>KAVAULT Share Deck</span>
            </Link>
            <Link
              to="/leaderboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "4px 10px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-secondary)",
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              <Trophy size={12} style={{ color: "#f59e0b" }} />
              {ui.leaderboard}
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              type="button"
              onClick={() =>
                setLanguage(language === "ru" ? "en" : language === "en" ? "ja" : "ru")
              }
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "6px 10px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-secondary)",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <Globe size={13} />
              {language.toUpperCase()}
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 9px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {hasToken ? (
              <Link to="/japanese" style={{ textDecoration: "none" }}>
                <Button variant="secondary" style={{ fontSize: "12.5px" }}>
                  {ui.backHub}
                </Button>
              </Link>
            ) : (
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button style={{ fontSize: "12.5px", gap: "6px" }}>
                  <LogIn size={14} /> {ui.login}
                </Button>
              </Link>
            )}
          </div>
        </div>

        {loading && (
          <Card style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>
            KAVAULT...
          </Card>
        )}

        {!loading && notFound && (
          <Card style={{ padding: "48px", textAlign: "center" }}>
            <h2 style={{ margin: "0 0 8px 0" }}>{ui.notFoundTitle}</h2>
            <p style={{ color: "var(--text-muted)", margin: "0 0 20px 0" }}>
              {ui.notFoundDesc}
            </p>
            <Link to={hasToken ? "/dashboard" : "/login"}>
              <Button>{hasToken ? ui.backHub : ui.login}</Button>
            </Link>
          </Card>
        )}

        {!loading && deck && (
          <>
            {/* Шапка колоды */}
            <Card
              style={{
                padding: "var(--space-6)",
                borderColor: `${palette.accentHex}55`,
                background: `linear-gradient(135deg, ${palette.softTint}, var(--surface))`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "16px",
                }}
              >
                <div style={{ flex: 1, minWidth: "240px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "10px" }}>
                    <Badge variant="accent">
                      {palette.flag} {deck.language.toUpperCase()}
                    </Badge>
                    {deck.levelFilter && deck.levelFilter !== "ALL" && (
                      <Badge variant="default">{deck.levelFilter}</Badge>
                    )}
                    <span
                      style={{
                        fontSize: "12px",
                        padding: "3px 9px",
                        borderRadius: "999px",
                        border: `1px solid ${deck.authorRankTier.color}55`,
                        color: deck.authorRankTier.color,
                        fontWeight: 600,
                      }}
                    >
                      {ui.author} @{deck.authorNickname} • {deck.authorRankTier.emoji}{" "}
                      {deck.authorRankTier.title}
                    </span>
                  </div>

                  <h1 style={{ margin: "0 0 8px 0", fontSize: "26px", fontWeight: 700 }}>
                    {deck.title}
                  </h1>

                  {deck.description && (
                    <p style={{ margin: "0 0 12px 0", color: "var(--text-secondary)", fontSize: "14px" }}>
                      {deck.description}
                    </p>
                  )}

                  <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13px", color: "var(--text-muted)" }}>
                    <span>
                      <BookOpen size={13} style={{ display: "inline", marginRight: "4px" }} />
                      {ui.cardsCount} <strong style={{ color: "var(--text-primary)" }}>{deck.cards.length}</strong>
                    </span>
                    {deck.passages.length > 0 && (
                      <span>
                        <Scroll size={13} style={{ display: "inline", marginRight: "4px" }} />
                        {ui.passagesCount} <strong style={{ color: "var(--text-primary)" }}>{deck.passages.length}</strong>
                      </span>
                    )}
                    <span>
                      <Sparkles size={13} style={{ display: "inline", marginRight: "4px" }} />
                      {ui.importsCount} <strong style={{ color: "var(--text-primary)" }}>{deck.importCount}</strong>
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end" }}>
                  <Button
                    onClick={handleCloneDeck}
                    disabled={importing}
                    style={{
                      backgroundColor: palette.accentHex,
                      color: "#ffffff",
                      gap: "8px",
                      padding: "10px 18px",
                    }}
                  >
                    <Download size={16} />
                    {importing
                      ? ui.cloningBtn
                      : hasToken
                        ? ui.cloneBtn
                        : ui.loginToClone}
                  </Button>
                </div>
              </div>

              {importResult && (
                <div
                  style={{
                    marginTop: "16px",
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--success)",
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  <span style={{ color: "var(--success)", fontWeight: 600, fontSize: "13.5px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <CheckCircle2 size={16} />
                    {ui.clonedOk} +{importResult.importedCards}
                    {importResult.importedPassages > 0 && ` (+${importResult.importedPassages})`}
                  </span>
                  <Link
                    to="/japanese"
                    style={{ color: palette.accentHex, fontWeight: 600, fontSize: "13px", textDecoration: "none" }}
                  >
                    {ui.openMyDeck}
                  </Link>
                </div>
              )}

              {importError && (
                <div style={{ marginTop: "12px", color: "var(--error)", fontSize: "13px" }}>
                  {importError}
                </div>
              )}
            </Card>

            {/* Карточки */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>
                {ui.cardsSection} ({deck.cards.length})
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: "12px",
                }}
              >
                {deck.cards.map((card, i) => (
                  <Card
                    key={`${card.word}-${i}`}
                    style={{
                      padding: "14px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {card.type && <Badge variant="default">{card.type}</Badge>}
                        {card.studyLevel && <Badge variant="accent">{card.studyLevel}</Badge>}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSpeak(card.word)}
                        style={{
                          background: "none",
                          border: "none",
                          color: palette.accentHex,
                          cursor: "pointer",
                          padding: "4px",
                        }}
                      >
                        <Volume2 size={15} />
                      </button>
                    </div>
                    <div style={{ fontSize: "19px", fontWeight: 700, color: "var(--text-primary)" }}>
                      {card.word}
                    </div>
                    {card.reading && (
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>
                        {card.reading}
                      </div>
                    )}
                    <div style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
                      {card.meaning}
                    </div>
                    {card.example && (
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        «{card.example}»
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Тексты / грамматика */}
            {deck.passages.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600 }}>
                  {ui.passagesSection} ({deck.passages.length})
                </h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {deck.passages.map((p, i) => (
                    <Card key={`${p.title}-${i}`} style={{ padding: "16px" }}>
                      <div style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                        {p.kind && <Badge variant="accent">{p.kind}</Badge>}
                        {p.level && <Badge variant="default">{p.level}</Badge>}
                      </div>
                      <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "6px" }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: "14px", color: "var(--text-primary)", marginBottom: "6px", whiteSpace: "pre-wrap" }}>
                        {p.content}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        {p.translation}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
