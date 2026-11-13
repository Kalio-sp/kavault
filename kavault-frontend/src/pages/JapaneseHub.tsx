import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  Volume2,
  GraduationCap,
  Headphones,
  Layers,
  Upload,
  Share2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { confirmModal } from "../context/DialogContext";
import {
  getStarterCardsForStudy,
  getMissingStarterCount,
  studyLanguageToPackType,
  isPackClaimed,
  markPackClaimed,
  unmarkPackClaimed,
} from "../data/starterPacks";
import {
  getGermanArticleStyle,
  STUDY_LEVELS,
  LEVEL_ROADMAP_LABELS,
  getDefaultStudyLevel,
} from "../data/studyVibes";
import {
  CulturalAmbientOverlay,
  CulturalHeroScene,
} from "../components/CulturalAtmosphere";
import {
  SKILL_STUDIO_TEXTS,
  type StudySkillTab,
} from "../data/languageCurriculum";
import {
  GrammarStudio,
  ReadingStudio,
  ListeningStudio,
  type StudyPassageRecord,
} from "../components/StudySkillsModules";
import { AlphabetStudio } from "../components/AlphabetStudio";
import { DeckImportModal } from "../components/DeckImportModal";
import { DeckShareModal } from "../components/DeckShareModal";
import { speakText } from "../utils/audioPlayer";

type HubSlot = "S1" | "S2";

interface StudyCard {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  example?: string;
  studyLevel?: string;
  type: string;
  language?: string;
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

const speakPhrase = (text: string, lang: string) => {
  void speakText(text, lang, { rate: lang.startsWith("ja") ? 0.9 : 0.95 });
};

const FlashcardItem = React.memo(function FlashcardItem({
  item,
  slot,
  onDelete,
}: {
  item: StudyCard;
  slot: HubSlot;
  onDelete: (id: string) => void;
}) {
  const { studyLanguage, studyText, studyPalette } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    playFlipSound();
    setIsFlipped(!isFlipped);
  };

  const isS1 = slot === "S1";
  const accentColor = isS1 ? studyPalette.accentHex : studyPalette.secondaryHex;
  const deArticle = studyLanguage === "de" ? getGermanArticleStyle(item.word) : null;
  const isJa = studyLanguage === "ja";

  return (
    <Card
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "145px",
        cursor: "pointer",
        textAlign: "center",
        padding: "12px 14px",
        transition: "all 0.18s ease",
        backgroundColor: isFlipped ? "var(--surface-raised)" : "var(--surface)",
        border: isFlipped
          ? `1.5px solid ${accentColor}`
          : deArticle?.article
            ? `1.5px solid ${deArticle.color}50`
            : "1px solid var(--border)",
        boxShadow: isFlipped ? `0 6px 18px -4px ${accentColor}30` : "none",
        position: "relative",
        userSelect: "none",
      }}
      onClick={handleFlip}
    >
      {/* Озвучка и удаление */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          right: "8px",
          display: "flex",
          alignItems: "center",
          gap: "2px",
          zIndex: 2,
        }}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            const cleanText = isJa ? item.reading || item.word : item.word;
            speakPhrase(cleanText, studyPalette.ttsLang);
          }}
          title={studyPalette.ttsLang}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <Volume2 size={15} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          title="Удалить карточку"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "var(--text-muted)",
            padding: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <Trash2 size={15} />
        </button>
      </div>

      {/* Бейдж типа раздела + артикль для немецкого */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          flexWrap: "wrap",
          maxWidth: "calc(100% - 65px)",
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 800,
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: `${accentColor}20`,
            color: accentColor,
            border: `1px solid ${accentColor}35`,
          }}
        >
          {isS1
            ? studyText.section1.cardBadge
            : studyText.section2.cardBadge}
        </div>
        {deArticle?.article && (
          <div
            style={{
              fontSize: "10px",
              fontWeight: 800,
              textTransform: "uppercase",
              padding: "2px 6px",
              borderRadius: "4px",
              backgroundColor: deArticle.bg,
              color: deArticle.color,
            }}
          >
            {deArticle.article}
          </div>
        )}
        {item.studyLevel && (
          <div
            style={{
              fontSize: "10px",
              fontWeight: 700,
              padding: "2px 5px",
              borderRadius: "4px",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
            }}
          >
            {item.studyLevel}
          </div>
        )}
      </div>

      {!isFlipped ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            marginTop: "16px",
          }}
        >
          {/* Подпись / чтение / транскрипция */}
          {item.reading && (isJa ? isS1 : false) && (
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
              fontSize: isJa ? (isS1 ? "30px" : "24px") : item.word.length > 20 ? "17px" : "20px",
              fontWeight: isJa ? 500 : 700,
              color: "var(--text-primary)",
              fontFamily: isJa ? "var(--font-jp)" : "inherit",
              lineHeight: "1.25",
              letterSpacing: isJa ? (isS1 ? "2px" : "1px") : "normal",
              wordBreak: "break-word",
            }}
          >
            {item.word}
          </span>

          {item.reading && !isJa && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "3px",
              }}
            >
              {item.reading}
            </span>
          )}

          <div style={{ marginTop: "10px" }}>
            <Badge variant={item.level > 0 ? "success" : "default"}>
              {studyText.levelPrefix} {item.level}
            </Badge>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            width: "100%",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          {item.reading && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                fontFamily: isJa ? "var(--font-jp)" : "inherit",
              }}
            >
              {item.reading}
            </span>
          )}
          <span
            style={{
              fontSize: "16px",
              color: accentColor,
              fontWeight: 700,
              wordBreak: "break-word",
            }}
          >
            {item.meaning}
          </span>
          {item.example && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                lineHeight: 1.35,
                fontStyle: "italic",
              }}
            >
              «{item.example}»
            </span>
          )}
          <span style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>
            {studyText.clickToHide}
          </span>
        </div>
      )}
    </Card>
  );
});

export function JapaneseHub() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    t,
    language,
    studyLanguage,
    studyText,
    studyPalette,
  } = useApp();
  const { evaluateAchievements } = useAchievements();

  const studioText = SKILL_STUDIO_TEXTS[language];
  const levelUi = LEVEL_ROADMAP_LABELS[language];
  const levelsMeta = STUDY_LEVELS[studyLanguage];
  const defaultLevel = getDefaultStudyLevel(studyLanguage);

  const resolveInitialTab = (): StudySkillTab => {
    const q = searchParams.get("tab");
    if (q === "alphabet" || q === "grammar" || q === "reading" || q === "listening" || q === "vocabulary") {
      return q;
    }
    return "vocabulary";
  };

  const [skillTab, setSkillTab] = useState<StudySkillTab>(resolveInitialTab);
  const [selectedLevel, setSelectedLevel] = useState<string>(() => {
    return localStorage.getItem(`kavault_study_level_${studyLanguage}`) || "ALL";
  });
  const [cardLevel, setCardLevel] = useState<string>(() => defaultLevel);
  const [ambientEnabled, setAmbientEnabled] = useState<boolean>(() => {
    return localStorage.getItem("kavault_ambient_vibe") !== "false";
  });
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);

  useEffect(() => {
    const savedLvl = localStorage.getItem(`kavault_study_level_${studyLanguage}`) || "ALL";
    setSelectedLevel(savedLvl);
    setCardLevel(savedLvl === "ALL" ? getDefaultStudyLevel(studyLanguage) : savedLvl);
  }, [studyLanguage]);

  const handleSelectLevel = (lvl: string) => {
    setSelectedLevel(lvl);
    localStorage.setItem(`kavault_study_level_${studyLanguage}`, lvl);
    if (lvl !== "ALL") {
      setCardLevel(lvl);
    }
  };

  useEffect(() => {
    const q = searchParams.get("tab");
    if (q === "alphabet" || q === "grammar" || q === "reading" || q === "listening" || q === "vocabulary") {
      setSkillTab(q);
    }
  }, [searchParams]);

  const handleSelectSkillTab = (tab: StudySkillTab) => {
    setSkillTab(tab);
    setSearchParams(tab === "vocabulary" ? {} : { tab });
  };

  const toggleAmbient = () => {
    const next = !ambientEnabled;
    setAmbientEnabled(next);
    localStorage.setItem("kavault_ambient_vibe", String(next));
  };

  const defaultSlotForLang = (lang: string): HubSlot => {
    const saved = localStorage.getItem(`kavault_lang_slot_${lang}`);
    if (saved === "S1" || saved === "S2") return saved;
    return lang === "ja" ? "S2" : "S1";
  };

  const [activeSlot, setActiveSlot] = useState<HubSlot>(() =>
    defaultSlotForLang(studyLanguage),
  );

  const [cards, setCards] = useState<StudyCard[]>([]);
  const [passages, setPassages] = useState<StudyPassageRecord[]>([]);
  const [word, setWord] = useState("");
  const [reading, setReading] = useState("");
  const [meaning, setMeaning] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  const activeLangPack = studyLanguageToPackType(studyLanguage);

  useEffect(() => {
    setActiveSlot(defaultSlotForLang(studyLanguage));
    setSearchQuery("");
  }, [studyLanguage]);

  const fetchCards = useCallback(
    async (evaluate = false) => {
      try {
        const [cardsResp, passResp] = await Promise.all([
          api.get(`/japanese?language=${studyLanguage}`),
          api
            .get<StudyPassageRecord[]>(`/japanese/passages?language=${studyLanguage}`)
            .catch(() => ({ data: [] as StudyPassageRecord[] })),
        ]);
        const list = cardsResp.data || [];
        setCards(list);
        setPassages(passResp.data || []);
        if (evaluate) {
          evaluateAchievements({ cards: list });
        }
      } catch (error) {
        console.error("Ошибка загрузки карточек", error);
      }
    },
    [studyLanguage, evaluateAchievements],
  );

  const fetchPassagesOnly = useCallback(async () => {
    try {
      const resp = await api.get<StudyPassageRecord[]>(
        `/japanese/passages?language=${studyLanguage}`,
      );
      setPassages(resp.data || []);
    } catch {
      // опционально
    }
  }, [studyLanguage]);

  const existingWords = useMemo(
    () => new Set(cards.map((c) => c.word)),
    [cards],
  );

  const handleAddCardFromStudio = async (card: {
    word: string;
    reading?: string;
    meaning: string;
    example?: string;
    studyLevel?: string;
    type: "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA";
  }) => {
    await api.post("/japanese", {
      ...card,
      studyLevel: card.studyLevel || defaultLevel,
      language: studyLanguage,
    });
    await fetchCards(true);
  };

  const missingStarterCount = useMemo(
    () => getMissingStarterCount(activeLangPack, cards),
    [activeLangPack, cards],
  );

  const isStarterClaimed = useMemo(
    () => isPackClaimed(activeLangPack, cards),
    [activeLangPack, cards],
  );

  const handleLoadStarterPack = async () => {
    try {
      setIsImporting(true);
      const items = getStarterCardsForStudy(studyLanguage, language);
      await api.post("/japanese/bulk", { items, language: studyLanguage });
      markPackClaimed(activeLangPack);
      await fetchCards(true);
    } catch (err) {
      console.error("Ошибка загрузки стартового набора", err);
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [studyLanguage]);

  const levelCounts = useMemo(() => {
    const map: Record<string, number> = { ALL: cards.length };
    levelsMeta.forEach((m) => {
      map[m.id] = 0;
    });
    cards.forEach((c) => {
      const lvl = c.studyLevel || defaultLevel;
      map[lvl] = (map[lvl] || 0) + 1;
    });
    return map;
  }, [cards, levelsMeta, defaultLevel]);

  // Разделение колоды на 2 независимых раздела + фильтр по выбранному уровню
  const { section1Cards, section2Cards } = useMemo(() => {
    const s1: StudyCard[] = [];
    const s2: StudyCard[] = [];

    cards.forEach((c) => {
      const cardLvl = c.studyLevel || defaultLevel;
      if (selectedLevel !== "ALL" && cardLvl !== selectedLevel) return;

      if (studyLanguage === "ja") {
        if (c.type === "KANJI" || hasKanji(c.word)) {
          s1.push(c);
        } else {
          s2.push(c);
        }
      } else {
        if (c.type === "GRAMMAR") {
          s2.push(c);
        } else {
          s1.push(c);
        }
      }
    });

    return { section1Cards: s1, section2Cards: s2 };
  }, [cards, studyLanguage, selectedLevel, defaultLevel]);

  const currentSectionCards =
    activeSlot === "S1" ? section1Cards : section2Cards;
  const currentSecText =
    activeSlot === "S1" ? studyText.section1 : studyText.section2;

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

  const handleSelectSlot = (slot: HubSlot) => {
    setActiveSlot(slot);
    localStorage.setItem(`kavault_lang_slot_${studyLanguage}`, slot);
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
        type: currentSecText.id,
        language: studyLanguage,
        studyLevel: cardLevel,
      });
      setWord("");
      setReading("");
      setMeaning("");
      fetchCards(true);
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
    const sectionName = currentSecText.title;
    const confirmed = await confirmModal({
      title: `${t.jap.clearSectionTitlePrefix} «${sectionName}»?`,
      message: `${t.jap.clearSectionMsgPrefix} (${currentSectionCards.length}) ${t.jap.clearSectionMsgSuffix}`,
      confirmText: t.jap.clearSectionConfirm,
      cancelText: t.common.cancel,
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await api.delete(
        `/japanese/clear/all?section=${currentSecText.id}&language=${studyLanguage}`,
      );
      unmarkPackClaimed(activeLangPack);
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
      await api.delete(`/japanese/clear/all?language=${studyLanguage}`);
      unmarkPackClaimed(activeLangPack);
      fetchCards();
    } catch (error) {
      console.error("Ошибка очистки всей колоды", error);
    }
  };

  const isS1 = activeSlot === "S1";
  const activeColor = isS1 ? studyPalette.accentHex : studyPalette.secondaryHex;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      <CulturalAmbientOverlay
        studyLanguage={studyLanguage}
        enabled={ambientEnabled}
      />

      {/* ── 1. ВЕРХНИЙ HERO-БАННЕР ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          padding: "16px 20px",
          borderRadius: "var(--radius-lg)",
          background: "var(--vibe-banner-bg)",
          border: "1px solid var(--vibe-banner-border)",
          boxShadow: `0 8px 24px -12px var(--vibe-glow, rgba(0,0,0,0.35))`,
        }}
      >
        <CulturalHeroScene studyLanguage={studyLanguage} compact={true} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "560px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "6px" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "3px 9px",
                borderRadius: "999px",
                backgroundColor: "var(--vibe-soft)",
                border: "1px solid var(--vibe-banner-border)",
                color: "var(--vibe-accent)",
                fontSize: "11px",
                fontWeight: 700,
              }}
            >
              <span>{studyPalette.flag}</span>
              <span>{studyText.vibeBadge}</span>
            </span>

            <button
              type="button"
              onClick={toggleAmbient}
              style={{
                padding: "3px 9px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: ambientEnabled ? studyPalette.accentHex : "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {ambientEnabled ? `✨ Атмосфера` : "Без фона"}
            </button>

            <button
              type="button"
              onClick={() => setShareModalOpen(true)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                padding: "3px 9px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-secondary)",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              <Share2 size={11} />
              Поделиться
            </button>
          </div>

          <h2
            style={{
              fontSize: "22px",
              fontWeight: 800,
              margin: "0 0 2px 0",
              color: "var(--text-primary)",
              lineHeight: "1.2",
            }}
          >
            {studyText.hubTitle}
          </h2>
          <p style={{ color: "var(--text-secondary)", margin: 0, fontSize: "12px", lineHeight: "1.4" }}>
            {studyText.vibeQuote}
          </p>
        </div>

        {/* Кнопка запуска сессии SRS */}
        <Button
          onClick={() =>
            navigate(
              `/review?mode=${currentSecText.id.toLowerCase()}${selectedLevel !== "ALL" ? `&level=${selectedLevel}` : ""}`,
            )
          }
          style={{
            position: "relative",
            zIndex: 2,
            gap: "6px",
            backgroundColor: activeColor,
            color: "#ffffff",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 700,
            boxShadow: `0 4px 14px -4px ${activeColor}`,
          }}
        >
          <Sparkles size={15} /> {currentSecText.repeatBtn} ({currentSectionCards.length}) →
        </Button>
      </div>

      {/* ── 2. МОДУЛИ ОБУЧЕНИЯ (СЕГМЕНТИРОВАННЫЙ ТАБ-БАР БЕЗ ЛИШНИХ ЦИФР) ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
          gap: "6px",
          padding: "4px",
          borderRadius: "14px",
          backgroundColor: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        {(
          [
            { id: "alphabet", icon: Languages, label: studioText.tabs.alphabet?.label || "Азбука" },
            { id: "vocabulary", icon: Layers, label: studioText.tabs.vocabulary.label },
            { id: "grammar", icon: GraduationCap, label: studioText.tabs.grammar.label },
            { id: "reading", icon: BookOpen, label: studioText.tabs.reading.label },
            { id: "listening", icon: Headphones, label: studioText.tabs.listening.label },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = skillTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectSkillTab(tab.id)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                padding: "9px 10px",
                borderRadius: "10px",
                border: active ? `1.5px solid ${studyPalette.accentHex}` : "1px solid transparent",
                backgroundColor: active ? "var(--vibe-soft)" : "transparent",
                color: active ? studyPalette.accentHex : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: active ? 800 : 600,
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap",
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ── 3. ПУТЬ ПО УРОВНЯМ ЯЗЫКА (ДЛЯ ЛЕКСИКИ, ГРАММАТИКИ, ЧТЕНИЯ И АУДИО — СКРЫТО В АЗБУКЕ) ── */}
      {skillTab !== "alphabet" && (
        <div
          style={{
            position: "relative",
            zIndex: 2,
            padding: "12px 14px",
            borderRadius: "14px",
            backgroundColor: "var(--surface)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <GraduationCap size={15} color={activeColor} />
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)" }}>
                {studyLanguage === "ja" ? "Уровни JLPT:" : "Уровни сложности:"}
              </span>
            </div>
            {(() => {
              const activeMeta = levelsMeta.find((m) => m.id === selectedLevel);
              return activeMeta ? (
                <span style={{ fontSize: "11px", fontWeight: 700, color: activeMeta.color }}>
                  {activeMeta.title[language]} · {activeMeta.subtitle[language]}
                </span>
              ) : null;
            })()}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
              gap: "8px",
              width: "100%",
            }}
          >
            <button
              type="button"
              onClick={() => handleSelectLevel("ALL")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: "10px",
                border: `1.5px solid ${selectedLevel === "ALL" ? activeColor : "var(--border-subtle)"}`,
                backgroundColor: selectedLevel === "ALL" ? activeColor : "var(--bg-elevated)",
                color: selectedLevel === "ALL" ? "#ffffff" : "var(--text-secondary)",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <span>Все уровни</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  padding: "1px 7px",
                  borderRadius: "999px",
                  backgroundColor: selectedLevel === "ALL" ? "rgba(255, 255, 255, 0.25)" : "var(--surface)",
                  color: selectedLevel === "ALL" ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {levelCounts.ALL || 0}
              </span>
            </button>

            {levelsMeta.map((lvl) => {
              const isActive = selectedLevel === lvl.id;
              const count = levelCounts[lvl.id] || 0;
              return (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleSelectLevel(lvl.id)}
                  title={`${lvl.title[language]} — ${lvl.subtitle[language]}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: `1.5px solid ${isActive ? lvl.color : "var(--border-subtle)"}`,
                    backgroundColor: isActive ? lvl.color : "var(--bg-elevated)",
                    color: isActive ? "#ffffff" : "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: isActive ? `0 2px 8px -2px ${lvl.color}` : "none",
                    transition: "all 0.15s ease",
                  }}
                >
                  <span>{lvl.badge}</span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 800,
                      padding: "1px 7px",
                      borderRadius: "999px",
                      backgroundColor: isActive ? "rgba(255, 255, 255, 0.25)" : "var(--surface)",
                      color: isActive ? "#ffffff" : "var(--text-muted)",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── 4. МОДУЛЬ 0: АЗБУКА И АЛФАВИТ ── */}
      {skillTab === "alphabet" && (
        <div style={{ position: "relative", zIndex: 2 }}>
          <AlphabetStudio
            studyLanguage={studyLanguage}
            accentColor={studyPalette.accentHex}
            ttsLang={studyPalette.ttsLang}
            onAddCard={handleAddCardFromStudio}
          />
        </div>
      )}

      {/* ── 5. МОДУЛЬ 1: ЛЕКСИКА И КАРТОЧКИ ── */}
      {skillTab === "vocabulary" && (
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          {/* СЕГМЕНТИРОВАННОЕ ПЕРЕКЛЮЧЕНИЕ МЕЖДУ S1 И S2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {/* Раздел 1 */}
            <button
              type="button"
              onClick={() => handleSelectSlot("S1")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "12px",
                cursor: "pointer",
                border: isS1
                  ? `2px solid ${studyPalette.accentHex}`
                  : "1px solid var(--border)",
                backgroundColor: isS1
                  ? "var(--surface-raised)"
                  : "var(--surface)",
                transition: "all 0.15s ease",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Scroll size={16} color={studyPalette.accentHex} />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {studyText.section1.title}
                </span>
              </div>
              <Badge variant={isS1 ? "accent" : "default"}>
                {section1Cards.length}
              </Badge>
            </button>

            {/* Раздел 2 */}
            <button
              type="button"
              onClick={() => handleSelectSlot("S2")}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 14px",
                borderRadius: "12px",
                cursor: "pointer",
                border: !isS1
                  ? `2px solid ${studyPalette.secondaryHex}`
                  : "1px solid var(--border)",
                backgroundColor: !isS1
                  ? "var(--surface-raised)"
                  : "var(--surface)",
                transition: "all 0.15s ease",
                textAlign: "left",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BookA size={16} color={studyPalette.secondaryHex} />
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                  }}
                >
                  {studyText.section2.title}
                </span>
              </div>
              <Badge variant={!isS1 ? "accent" : "default"}>
                {section2Cards.length}
              </Badge>
            </button>
          </div>

          {/* КОМПАКТНАЯ ПАНЕЛЬ ДОБАВЛЕНИЯ КАРТОЧКИ (СВОРАЧИВАЕМАЯ) */}
          <Card style={{ padding: "12px 16px" }}>
            <div
              onClick={() => setIsAddFormOpen(!isAddFormOpen)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Plus size={16} color={activeColor} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {currentSecText.addTitle}
                </span>
              </div>
              <button
                type="button"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {isAddFormOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>
            </div>

            {isAddFormOpen && (
              <form
                onSubmit={handleAddCard}
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  marginTop: "12px",
                  paddingTop: "12px",
                  borderTop: "1px solid var(--border-subtle)",
                }}
              >
                {/* Поле 1: Слово */}
                <div style={{ flex: "1 1 200px" }}>
                  <Input
                    icon={<Type size={15} />}
                    placeholder={currentSecText.wordPlaceholder}
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    required
                  />
                </div>

                {/* Поле 2: Чтение / Транскрипция */}
                {currentSecText.showReadingInput && (
                  <div style={{ flex: "1 1 180px" }}>
                    <Input
                      icon={<Languages size={15} />}
                      placeholder={currentSecText.readingPlaceholder || studyText.readingLabelPlaceholder}
                      value={reading}
                      onChange={(e) => setReading(e.target.value)}
                    />
                  </div>
                )}

                {/* Поле 3: Перевод */}
                <div style={{ flex: "1 1 180px" }}>
                  <Input
                    icon={<BookOpen size={15} />}
                    placeholder={currentSecText.meaningPlaceholder}
                    value={meaning}
                    onChange={(e) => setMeaning(e.target.value)}
                    required
                  />
                </div>

                {/* Выбор уровня */}
                <select
                  aria-label={levelUi.cardLevelLabel}
                  title={levelUi.cardLevelLabel}
                  value={cardLevel}
                  onChange={(e) => setCardLevel(e.target.value)}
                  style={{
                    height: "40px",
                    padding: "0 10px",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border-subtle)",
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-primary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {levelsMeta.map((lvl) => (
                    <option key={lvl.id} value={lvl.id}>
                      {lvl.badge}
                    </option>
                  ))}
                </select>

                <Button
                  type="submit"
                  style={{
                    height: "40px",
                    backgroundColor: activeColor,
                    color: "#ffffff",
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  <Plus size={16} /> Добавить
                </Button>
              </form>
            )}
          </Card>

          {/* ПОИСК И ДЕЙСТВИЯ НАД КОЛОДОЙ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-secondary)" }}>
                {currentSecText.deckTitle} ({filteredCards.length})
              </span>

              {!isStarterClaimed && (
                <Button
                  variant="secondary"
                  onClick={handleLoadStarterPack}
                  disabled={isImporting}
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    color: studyPalette.accentHex,
                    borderColor: "var(--vibe-banner-border)",
                    gap: "4px",
                  }}
                  title={studyText.starterFullBtn}
                >
                  <Sparkles size={12} />{" "}
                  {isImporting
                    ? t.jap.loadingBtn
                    : cards.length > 0 && missingStarterCount > 0
                      ? `Стартовый (+${missingStarterCount})`
                      : "Стартовый набор"}
                </Button>
              )}

              <Button
                variant="secondary"
                onClick={() => setImportModalOpen(true)}
                style={{
                  padding: "4px 8px",
                  fontSize: "11px",
                  color: "var(--text-primary)",
                  borderColor: "var(--border)",
                  gap: "4px",
                }}
              >
                <Upload size={12} />
                Импорт .csv
              </Button>

              {currentSectionCards.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={handleClearSection}
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    borderColor: "var(--border)",
                    gap: "4px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  title={currentSecText.clearBtn}
                >
                  <Trash2 size={12} /> {currentSecText.clearBtn}
                </Button>
              )}

              {cards.length > 0 && (
                <Button
                  variant="secondary"
                  onClick={handleClearAllDeck}
                  style={{
                    padding: "4px 8px",
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    borderColor: "var(--border)",
                    gap: "4px",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                  title={studyText.clearAllDeckBtn}
                >
                  <Trash2 size={12} /> Все ({cards.length})
                </Button>
              )}
            </div>

            <div style={{ width: "clamp(180px, 100%, 260px)" }}>
              <Input
                icon={<Search size={14} />}
                placeholder="Поиск по словам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* СПИСОК КАРТОЧЕК */}
          {filteredCards.length === 0 ? (
            <Card
              style={{
                padding: "var(--space-6)",
                textAlign: "center",
                color: "var(--text-muted)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <p style={{ margin: 0, fontSize: "14px" }}>
                {searchQuery ? studyText.notFound : currentSecText.emptyText}
              </p>
              {!searchQuery && !isStarterClaimed && (
                <Button
                  onClick={handleLoadStarterPack}
                  disabled={isImporting}
                  style={{
                    gap: "6px",
                    backgroundColor: studyPalette.accentHex,
                    color: "#ffffff",
                    fontSize: "12px",
                  }}
                >
                  <Sparkles size={14} />{" "}
                  {isImporting ? t.jap.importingCardsBtn : studyText.starterFullBtn}
                </Button>
              )}
            </Card>
          ) : (
            selectedLevel === "ALL" ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                {levelsMeta.map((lvl) => {
                  const lvlCards = filteredCards.filter(
                    (c) => (c.studyLevel || defaultLevel) === lvl.id,
                  );
                  if (lvlCards.length === 0) return null;
                  return (
                    <div
                      key={lvl.id}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          gap: "8px",
                          padding: "8px 12px",
                          borderRadius: "10px",
                          backgroundColor: "var(--bg-surface)",
                          border: `1px solid ${lvl.color}35`,
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                          <span
                            style={{
                              fontSize: "11px",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              backgroundColor: `${lvl.color}20`,
                              color: lvl.color,
                              border: `1px solid ${lvl.color}45`,
                              fontWeight: 800,
                            }}
                          >
                            {lvl.badge}
                          </span>
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 700,
                              color: "var(--text-primary)",
                            }}
                          >
                            {lvl.title[language]}
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: "var(--text-muted)",
                            }}
                          >
                            {lvlCards.length} {studyText.wordsUnit}
                          </span>
                        </div>

                        <Button
                          variant="secondary"
                          onClick={() =>
                            navigate(
                              `/review?mode=${currentSecText.id.toLowerCase()}&level=${lvl.id}`,
                            )
                          }
                          style={{
                            gap: "5px",
                            padding: "4px 10px",
                            fontSize: "11px",
                            borderColor: `${lvl.color}45`,
                            color: lvl.color,
                          }}
                        >
                          <Sparkles size={12} /> Повторить ({lvlCards.length})
                        </Button>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                          gap: "10px",
                        }}
                      >
                        {lvlCards.map((item) => (
                          <FlashcardItem
                            key={item.id}
                            item={item}
                            slot={activeSlot}
                            onDelete={handleDeleteCard}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                  gap: "10px",
                }}
              >
                {filteredCards.map((item) => (
                  <FlashcardItem
                    key={item.id}
                    item={item}
                    slot={activeSlot}
                    onDelete={handleDeleteCard}
                  />
                ))}
              </div>
            )
          )}
        </div>
      )}

      {/* ── МОДУЛЬ 2: ГРАММАТИКА ── */}
      {skillTab === "grammar" && (
        <div style={{ position: "relative", zIndex: 2 }}>
          <GrammarStudio
            studyLanguage={studyLanguage}
            uiLang={language}
            ttsLang={studyPalette.ttsLang}
            accentColor={studyPalette.accentHex}
            secondaryColor={studyPalette.secondaryHex}
            selectedLevel={selectedLevel}
            existingWords={existingWords}
            onAddCard={handleAddCardFromStudio}
            customPassages={passages}
            onRefreshPassages={fetchPassagesOnly}
          />
        </div>
      )}

      {/* ── МОДУЛЬ 3: ЧТЕНИЕ ── */}
      {skillTab === "reading" && (
        <div style={{ position: "relative", zIndex: 2 }}>
          <ReadingStudio
            studyLanguage={studyLanguage}
            uiLang={language}
            ttsLang={studyPalette.ttsLang}
            accentColor={studyPalette.accentHex}
            secondaryColor={studyPalette.secondaryHex}
            selectedLevel={selectedLevel}
            existingWords={existingWords}
            onAddCard={handleAddCardFromStudio}
            customPassages={passages}
            onRefreshPassages={fetchPassagesOnly}
          />
        </div>
      )}

      {/* ── МОДУЛЬ 4: АУДИРОВАНИЕ ── */}
      {skillTab === "listening" && (
        <div style={{ position: "relative", zIndex: 2 }}>
          <ListeningStudio
            studyLanguage={studyLanguage}
            uiLang={language}
            ttsLang={studyPalette.ttsLang}
            accentColor={studyPalette.accentHex}
            secondaryColor={studyPalette.secondaryHex}
            selectedLevel={selectedLevel}
            userCards={cards}
          />
        </div>
      )}

      <DeckImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        studyLanguage={studyLanguage}
        uiLang={language}
        existingWords={existingWords}
        defaultLevel={selectedLevel !== "ALL" ? selectedLevel : defaultLevel}
        defaultCardType={currentSecText.id}
        accentColor={studyPalette.accentHex}
        onImported={() => fetchCards(true)}
      />

      <DeckShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        studyLanguage={studyLanguage}
        uiLang={language}
        totalCards={cards.length}
        totalPassages={passages.length}
        selectedLevel={selectedLevel}
        accentColor={studyPalette.accentHex}
      />
    </div>
  );
}