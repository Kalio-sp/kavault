import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import {
  Type,
  Languages,
  BookOpen,
  Plus,
  Trash2,
  Search,
  Sparkles,
  BookA,
  Scroll,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { confirmModal } from "../context/DialogContext";
import {
  STARTER_JAPANESE_CARDS,
  isPackClaimed,
  markPackClaimed,
  unmarkPackClaimed,
} from "../data/starterPacks";

type HubSection = "KANJI" | "KANA";

interface JapaneseCard {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  type: string;
  level: number;
}

// Проверка наличия символов кандзи (иероглифов) в строке
const hasKanji = (str: string) => /[\u4e00-\u9faf\u3400-\u4dbf]/.test(str);

// Воспроизведение звука переворота через Web Audio API
const playFlipSound = () => {
  if (localStorage.getItem("kavault_sound_fx") === "false") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch {
    // звук опционален
  }
};

function FlashcardItem({
  item,
  section,
  onDelete,
}: {
  item: JapaneseCard;
  section: HubSection;
  onDelete: (id: string) => void;
}) {
  const { t } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    playFlipSound();
    setIsFlipped(!isFlipped);
  };

  const isKanjiSection = section === "KANJI";

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "155px",
        cursor: "pointer",
        textAlign: "center",
        padding: "var(--space-4)",
        transition: "all 0.2s ease",
        backgroundColor: isFlipped ? "var(--surface-raised)" : "var(--surface)",
        border: isFlipped
          ? `1px solid ${isKanjiSection ? "#a855f7" : "var(--accent)"}`
          : "1px solid var(--border)",
        position: "relative",
      }}
      onClick={handleFlip}
    >
      {/* Кнопка удаления */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(item.id);
        }}
        title={t.jap.deleteCardTitle}
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          padding: "4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "4px",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
      >
        <Trash2 size={14} />
      </button>

      {/* Бейдж типа раздела */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          fontSize: "10px",
          fontWeight: 700,
          textTransform: "uppercase",
          padding: "2px 6px",
          borderRadius: "4px",
          backgroundColor: isKanjiSection
            ? "rgba(168, 85, 247, 0.15)"
            : "rgba(59, 130, 246, 0.15)",
          color: isKanjiSection ? "#c084fc" : "#60a5fa",
        }}
      >
        {isKanjiSection ? `1. ${t.review.badgeKanji}` : `2. ${t.review.badgeKana}`}
      </div>

      {!isFlipped ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: "12px",
          }}
        >
          {/* Чтение (фуригана) показывается над словом, если есть */}
          {item.reading && isKanjiSection && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-jp)",
                marginBottom: "2px",
              }}
            >
              {item.reading}
            </span>
          )}

          <span
            style={{
              fontSize: isKanjiSection ? "34px" : "28px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-jp)",
              lineHeight: "1.2",
              letterSpacing: isKanjiSection ? "2px" : "1px",
            }}
          >
            {item.word}
          </span>

          <div style={{ marginTop: "var(--space-3)" }}>
            <Badge variant={item.level > 0 ? "success" : "default"}>
              {t.jap.levelPrefix} {item.level}
            </Badge>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            width: "100%",
            alignItems: "center",
            marginTop: "12px",
          }}
        >
          {item.reading && (
            <span
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                fontFamily: "var(--font-jp)",
              }}
            >
              {item.reading}
            </span>
          )}
          <span
            style={{
              fontSize: "18px",
              color: isKanjiSection ? "#c084fc" : "var(--accent)",
              fontWeight: 600,
            }}
          >
            {item.meaning}
          </span>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            {t.jap.clickToHide}
          </span>
        </div>
      )}
    </Card>
  );
}

export function JapaneseHub() {
  const navigate = useNavigate();
  const { t } = useApp();

  // Раздел: по умолчанию открываем КАНА (Хирагана и Катакана), если не сохранено иное,
  // так как пользователь начинает с азбуки и пока не знает кандзи
  const [activeSection, setActiveSection] = useState<HubSection>(() => {
    const saved = localStorage.getItem("kavault_japanese_section");
    if (saved === "KANJI" || saved === "KANA") return saved;
    return "KANA";
  });

  const [cards, setCards] = useState<JapaneseCard[]>([]);
  const [word, setWord] = useState("");
  const [reading, setReading] = useState("");
  const [meaning, setMeaning] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImporting, setIsImporting] = useState(false);

  const fetchCards = async () => {
    try {
      const response = await api.get("/japanese");
      setCards(response.data || []);
    } catch (error) {
      console.error("Ошибка загрузки карточек", error);
    }
  };

  const isStarterClaimed = useMemo(
    () => isPackClaimed("japanese", cards),
    [cards],
  );

  const handleLoadStarterPack = async () => {
    try {
      setIsImporting(true);
      await api.post("/japanese/bulk", { items: STARTER_JAPANESE_CARDS });
      markPackClaimed("japanese");
      await fetchCards();
    } catch (err) {
      console.error("Ошибка загрузки стартового набора", err);
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Разделение колоды на 2 независимых раздела
  const { kanaCards, kanjiCards } = useMemo(() => {
    const kana: JapaneseCard[] = [];
    const kanji: JapaneseCard[] = [];

    cards.forEach((c) => {
      // Если тип KANJI или в слове есть иероглифы кандзи
      if (c.type === "KANJI" || hasKanji(c.word)) {
        kanji.push(c);
      } else {
        // Слова без иероглифов (хирагана, катакана)
        kana.push(c);
      }
    });

    return { kanaCards: kana, kanjiCards: kanji };
  }, [cards]);

  // Карточки текущего активного раздела
  const currentSectionCards =
    activeSection === "KANJI" ? kanjiCards : kanaCards;

  // Фильтрация поиском
  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return currentSectionCards;
    const q = searchQuery.toLowerCase();
    return currentSectionCards.filter(
      (c) =>
        c.word.toLowerCase().includes(q) ||
        (c.reading && c.reading.toLowerCase().includes(q)) ||
        c.meaning.toLowerCase().includes(q),
    );
  }, [currentSectionCards, searchQuery]);

  const handleSelectSection = (section: HubSection) => {
    setActiveSection(section);
    localStorage.setItem("kavault_japanese_section", section);
    setSearchQuery("");
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!word.trim() || !meaning.trim()) return;

    try {
      await api.post("/japanese", {
        word: word.trim(),
        reading: reading.trim() || undefined,
        meaning: meaning.trim(),
        type: activeSection === "KANJI" ? "KANJI" : "KANA",
      });
      setWord("");
      setReading("");
      setMeaning("");
      fetchCards();
    } catch (error) {
      console.error("Ошибка сохранения карточки", error);
    }
  };

  const handleDeleteCard = async (id: string) => {
    const cardToDelete = cards.find((c) => c.id === id);
    const wordLabel = cardToDelete ? ` «${cardToDelete.word}»` : "";
    const confirmed = await confirmModal({
      title: t.jap.deleteCardTitle,
      message: `${t.jap.deleteCardMsgPrefix}${wordLabel}${t.jap.deleteCardMsgSuffix}`,
      confirmText: t.common.delete,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/japanese/${id}`);
      fetchCards();
    } catch (error) {
      console.error("Ошибка удаления карточки", error);
    }
  };

  const handleClearSection = async () => {
    if (currentSectionCards.length === 0) return;
    const sectionName =
      activeSection === "KANJI"
        ? t.jap.section1Title
        : t.jap.section2Title;
    const confirmed = await confirmModal({
      title: `${t.jap.clearSectionTitlePrefix} «${sectionName}»?`,
      message: `${t.jap.clearSectionMsgPrefix} (${currentSectionCards.length}) ${t.jap.clearSectionMsgSuffix}`,
      confirmText: t.jap.clearSectionConfirm,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(`/japanese/clear/all?section=${activeSection}`);
      unmarkPackClaimed("japanese");
      fetchCards();
    } catch (error) {
      console.error("Ошибка очистки раздела", error);
    }
  };

  const handleClearAllDeck = async () => {
    if (cards.length === 0) return;
    const confirmed = await confirmModal({
      title: t.jap.clearAllTitle,
      message: `${t.jap.clearAllMsgPrefix} (${cards.length}) ${t.jap.clearAllMsgSuffix}`,
      confirmText: t.jap.clearAllConfirm,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete("/japanese/clear/all");
      unmarkPackClaimed("japanese");
      fetchCards();
    } catch (error) {
      console.error("Ошибка очистки всей колоды", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      {/* Верхний заголовок */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "var(--space-4)",
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
            {t.jap.title}
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            {activeSection === "KANJI"
              ? t.jap.subtitleKanji
              : t.jap.subtitleKana}
          </p>
        </div>

        {/* Кнопка запуска сессии повторения с передачей режима */}
        <Button
          onClick={() => navigate(`/review?mode=${activeSection.toLowerCase()}`)}
          style={{
            gap: "8px",
            backgroundColor: activeSection === "KANJI" ? "#a855f7" : "var(--accent)",
          }}
        >
          <Sparkles size={16} />{" "}
          {activeSection === "KANJI" ? t.jap.repeatKanjiBtn : t.jap.repeatKanaBtn} (
          {currentSectionCards.length}) →
        </Button>
      </div>

      {/* ── 2 ГЛАВНЫХ РАЗДЕЛА: ТАБЫ ВЫБОРА (1. Кандзи | 2. Хирагана и Катакана) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {/* Раздел 1: Кандзи (Иероглифы) */}
        <Card
          onClick={() => handleSelectSection("KANJI")}
          style={{
            padding: "var(--space-5)",
            cursor: "pointer",
            border:
              activeSection === "KANJI"
                ? "2px solid #a855f7"
                : "1px solid var(--border)",
            backgroundColor:
              activeSection === "KANJI"
                ? "var(--surface-raised)"
                : "var(--surface)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor:
                  activeSection === "KANJI"
                    ? "#a855f7"
                    : "var(--surface-raised)",
                color: activeSection === "KANJI" ? "#fff" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Scroll size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {t.jap.section1Title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {t.jap.section1Desc}
              </div>
            </div>
          </div>
          <Badge variant={activeSection === "KANJI" ? "accent" : "default"}>
            {kanjiCards.length} {t.jap.wordsUnit}
          </Badge>
        </Card>

        {/* Раздел 2: Хирагана и Катакана */}
        <Card
          onClick={() => handleSelectSection("KANA")}
          style={{
            padding: "var(--space-5)",
            cursor: "pointer",
            border:
              activeSection === "KANA"
                ? "2px solid var(--accent)"
                : "1px solid var(--border)",
            backgroundColor:
              activeSection === "KANA"
                ? "var(--surface-raised)"
                : "var(--surface)",
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor:
                  activeSection === "KANA"
                    ? "var(--accent)"
                    : "var(--surface-raised)",
                color: activeSection === "KANA" ? "#fff" : "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BookA size={22} />
            </div>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {t.jap.section2Title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {t.jap.section2Desc}
              </div>
            </div>
          </div>
          <Badge variant={activeSection === "KANA" ? "accent" : "default"}>
            {kanaCards.length} {t.jap.wordsUnit}
          </Badge>
        </Card>
      </div>

      {/* ── ФОРМА ДОБАВЛЕНИЯ СЛОВА (АДАПТИВНАЯ ПОД РАЗДЕЛ) ── */}
      <Card style={{ padding: "var(--space-5)" }}>
        <h3
          style={{
            fontSize: "16px",
            margin: "0 0 var(--space-4) 0",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {activeSection === "KANJI" ? (
            <>
              <Scroll size={18} color="#a855f7" /> {t.jap.addKanjiTitle}
            </>
          ) : (
            <>
              <BookA size={18} color="var(--accent)" /> {t.jap.addKanaTitle}
            </>
          )}
        </h3>

        <form
          onSubmit={handleAddCard}
          style={{
            display: "flex",
            gap: "var(--space-3)",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Поле 1: Слово */}
          <div style={{ flex: "1 1 240px" }}>
            <Input
              icon={<Type size={16} />}
              placeholder={
                activeSection === "KANJI"
                  ? t.jap.wordKanjiPlaceholder
                  : t.jap.wordKanaPlaceholder
              }
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
          </div>

          {/* Поле 2: Чтение фуриганой (только для Кандзи) */}
          {activeSection === "KANJI" && (
            <div style={{ flex: "1 1 200px" }}>
              <Input
                icon={<Languages size={16} />}
                placeholder={t.jap.readingPlaceholder}
                value={reading}
                onChange={(e) => setReading(e.target.value)}
              />
            </div>
          )}

          {/* Поле 3: Перевод */}
          <div style={{ flex: "1 1 220px" }}>
            <Input
              icon={<BookOpen size={16} />}
              placeholder={
                activeSection === "KANJI"
                  ? t.jap.meaningKanjiPlaceholder
                  : t.jap.meaningKanaPlaceholder
              }
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            style={{
              height: "40px",
              backgroundColor:
                activeSection === "KANJI" ? "#a855f7" : "var(--accent)",
            }}
          >
            <Plus size={18} /> {t.jap.addBtn}
          </Button>
        </form>
      </Card>

      {/* ── СПИСОК КАРТОЧЕК ВЫБРАННОГО РАЗДЕЛА ── */}
      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "var(--space-4)",
            marginBottom: "var(--space-4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <h3
              style={{
                fontSize: "16px",
                margin: 0,
                color: "var(--text-secondary)",
                fontWeight: 600,
              }}
            >
              {activeSection === "KANJI"
                ? `${t.jap.deckKanjiTitle} (${filteredCards.length})`
                : `${t.jap.deckKanaTitle} (${filteredCards.length})`}
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
                title={t.jap.loadStarterFullBtn}
              >
                <Sparkles size={13} /> {isImporting ? t.jap.loadingBtn : t.jap.loadStarterBtn}
              </Button>
            )}

            {currentSectionCards.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleClearSection}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  borderColor: "var(--border)",
                  gap: "6px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                title={activeSection === "KANJI" ? t.jap.clearKanjiBtn : t.jap.clearKanaBtn}
              >
                <Trash2 size={13} /> {activeSection === "KANJI" ? t.jap.clearKanjiBtn : t.jap.clearKanaBtn}
              </Button>
            )}

            {cards.length > 0 && (
              <Button
                variant="secondary"
                onClick={handleClearAllDeck}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: "var(--text-muted)",
                  borderColor: "var(--border)",
                  gap: "6px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                title={t.jap.clearAllDeckBtn}
              >
                <Trash2 size={13} /> {t.jap.clearAllDeckBtn} ({cards.length})
              </Button>
            )}
          </div>

          <div style={{ width: "250px" }}>
            <Input
              icon={<Search size={15} />}
              placeholder={t.jap.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {filteredCards.length === 0 ? (
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
                ? t.jap.notFound
                : activeSection === "KANJI"
                  ? t.jap.emptyKanji
                  : t.jap.emptyKana}
            </p>
            {!searchQuery && !isStarterClaimed && (
              <Button
                onClick={handleLoadStarterPack}
                disabled={isImporting}
                style={{ gap: "8px", marginTop: "6px" }}
              >
                <Sparkles size={16} /> {isImporting ? t.jap.importingCardsBtn : t.jap.loadStarterFullBtn}
              </Button>
            )}
          </Card>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: "var(--space-4)",
            }}
          >
            {filteredCards.map((item) => (
              <FlashcardItem
                key={item.id}
                item={item}
                section={activeSection}
                onDelete={handleDeleteCard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
