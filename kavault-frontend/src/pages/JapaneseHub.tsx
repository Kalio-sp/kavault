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
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { confirmModal } from "../context/DialogContext";
import {
  getStarterCardsForStudy,
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
  const { t, studyLanguage, studyText, studyPalette } = useApp();
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
        minHeight: "160px",
        cursor: "pointer",
        textAlign: "center",
        padding: "var(--space-4)",
        transition: "all 0.2s ease",
        backgroundColor: isFlipped ? "var(--surface-raised)" : "var(--surface)",
        border: isFlipped
          ? `1px solid ${accentColor}`
          : deArticle?.article
            ? `1px solid ${deArticle.color}40`
            : "1px solid var(--border)",
        position: "relative",
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
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "color 0.2s ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = accentColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <Volume2 size={14} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          title={t.jap.deleteCardTitle}
          style={{
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
        }}
      >
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: "4px",
            backgroundColor: `${accentColor}22`,
            color: accentColor,
          }}
        >
          {isS1
            ? `1. ${studyText.section1.cardBadge}`
            : `2. ${studyText.section2.cardBadge}`}
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
            marginTop: "14px",
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
              fontSize: isJa ? (isS1 ? "32px" : "26px") : item.word.length > 22 ? "17px" : "21px",
              fontWeight: isJa ? 500 : 700,
              color: "var(--text-primary)",
              fontFamily: isJa ? "var(--font-jp)" : "inherit",
              lineHeight: "1.28",
              letterSpacing: isJa ? (isS1 ? "2px" : "1px") : "normal",
            }}
          >
            {item.word}
          </span>

          {item.reading && !isJa && (
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "4px",
              }}
            >
              {item.reading}
            </span>
          )}

          <div style={{ marginTop: "var(--space-3)" }}>
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
            gap: "var(--space-2)",
            width: "100%",
            alignItems: "center",
            marginTop: "14px",
          }}
        >
          {item.reading && (
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                fontFamily: isJa ? "var(--font-jp)" : "inherit",
              }}
            >
              {item.reading}
            </span>
          )}
          <span
            style={{
              fontSize: "17px",
              color: accentColor,
              fontWeight: 600,
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
              }}
            >
              «{item.example}»
            </span>
          )}
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
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
    if (q === "grammar" || q === "reading" || q === "listening" || q === "vocabulary") {
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
    if (q === "grammar" || q === "reading" || q === "listening" || q === "vocabulary") {
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
        gap: "var(--space-6)",
      }}
    >
      <CulturalAmbientOverlay
        studyLanguage={studyLanguage}
        enabled={ambientEnabled}
      />

      {/* Верхний Hero-баннер с богатой культурной архитектурой */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          overflow: "hidden",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-4)",
          padding: "var(--space-6)",
          borderRadius: "var(--radius-lg)",
          background: "var(--vibe-banner-bg)",
          border: "1px solid var(--vibe-banner-border)",
          boxShadow: `0 12px 32px -18px var(--vibe-glow, rgba(0,0,0,0.4))`,
        }}
      >
        <CulturalHeroScene studyLanguage={studyLanguage} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "640px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", marginBottom: "10px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "var(--vibe-soft)",
                border: "1px solid var(--vibe-banner-border)",
                color: "var(--vibe-accent)",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              <span>{studyPalette.flag}</span>
              <span>{studyText.vibeBadge}</span>
            </div>

            <button
              type="button"
              onClick={toggleAmbient}
              style={{
                padding: "4px 10px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: ambientEnabled ? studyPalette.accentHex : "var(--text-muted)",
                fontSize: "11px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {ambientEnabled ? `✨ ${studioText.atmosphereOn}` : studioText.atmosphereOff}
            </button>
          </div>

          <h2
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: "0 0 var(--space-1) 0",
              color: "var(--text-primary)",
            }}
          >
            {studyText.hubTitle}
          </h2>
          <p style={{ color: "var(--text-secondary)", margin: "0 0 4px 0", fontSize: "14px" }}>
            {skillTab === "vocabulary"
              ? isS1
                ? studyText.subtitleS1
                : studyText.subtitleS2
              : studioText.tabs[skillTab].shortDesc}
          </p>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "12px" }}>
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
            gap: "8px",
            backgroundColor: activeColor,
            color: "#ffffff",
            boxShadow: `0 6px 20px -6px ${activeColor}`,
          }}
        >
          <Sparkles size={16} /> {currentSecText.repeatBtn} (
          {currentSectionCards.length}) →
        </Button>
      </div>

      {/* ── ПУТЬ ПО УРОВНЯМ ЯЗЫКА (N5 -> N4 -> N3 / A1 -> B2) ── */}
      {(() => {
        const activeMeta = levelsMeta.find((m) => m.id === selectedLevel);
        return (
          <Card
            style={{
              position: "relative",
              zIndex: 2,
              padding: "var(--space-3) var(--space-4)",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              border: `1px solid ${activeMeta ? `${activeMeta.color}45` : "var(--border-subtle)"}`,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                <GraduationCap size={16} style={{ color: activeColor }} />
                <span>{levelUi.roadmapTitle}</span>
              </div>
              {activeMeta && (
                <span
                  style={{
                    fontSize: "12px",
                    color: activeMeta.color,
                    fontWeight: 600,
                  }}
                >
                  {activeMeta.title[language]} · {activeMeta.subtitle[language]}
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <button
                type="button"
                onClick={() => handleSelectLevel("ALL")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  border: `1px solid ${selectedLevel === "ALL" ? activeColor : "var(--border-subtle)"}`,
                  backgroundColor:
                    selectedLevel === "ALL" ? activeColor : "var(--bg-elevated)",
                  color:
                    selectedLevel === "ALL" ? "#ffffff" : "var(--text-secondary)",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                <span>{levelUi.allLevels}</span>
                <span
                  style={{
                    fontSize: "11px",
                    opacity: selectedLevel === "ALL" ? 0.92 : 0.75,
                    fontWeight: 600,
                  }}
                >
                  ({levelCounts.ALL || 0})
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
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "6px 12px",
                      borderRadius: "999px",
                      border: `1px solid ${isActive ? lvl.color : "var(--border-subtle)"}`,
                      backgroundColor: isActive ? lvl.color : "var(--bg-elevated)",
                      color: isActive ? "#ffffff" : "var(--text-primary)",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: isActive ? `0 4px 12px -4px ${lvl.color}` : "none",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{lvl.badge}</span>
                    <span
                      style={{
                        fontSize: "11px",
                        opacity: isActive ? 0.92 : 0.68,
                        fontWeight: 600,
                      }}
                    >
                      ({count})
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>
        );
      })()}

      {/* ── ПАНЕЛЬ 4-Х ЯЗЫКОВЫХ МОДУЛЕЙ: ЛЕКСИКА · ГРАММАТИКА · ЧТЕНИЕ · АУДИРОВАНИЕ ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(195px, 1fr))",
          gap: "var(--space-3)",
        }}
      >
        {(
          [
            { id: "vocabulary", icon: Layers, count: cards.length },
            { id: "grammar", icon: GraduationCap },
            { id: "reading", icon: BookOpen },
            { id: "listening", icon: Headphones },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = skillTab === tab.id;
          const info = studioText.tabs[tab.id];
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleSelectSkillTab(tab.id)}
              style={{
                textAlign: "left",
                padding: "12px 14px",
                borderRadius: "var(--radius-lg)",
                border: active
                  ? `2px solid ${studyPalette.accentHex}`
                  : "1px solid var(--border)",
                backgroundColor: active ? "var(--vibe-soft)" : "var(--surface)",
                cursor: "pointer",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  backgroundColor: active ? studyPalette.accentHex : "var(--surface-raised)",
                  color: active ? "#ffffff" : "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={18} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{info.label}</span>
                  {"count" in tab && (
                    <span
                      style={{
                        fontSize: "11px",
                        padding: "1px 6px",
                        borderRadius: "999px",
                        backgroundColor: "var(--surface-raised)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {tab.count}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {info.shortDesc}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── МОДУЛЬ 1: ЛЕКСИКА И КАРТОЧКИ ── */}
      {skillTab === "vocabulary" && (
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* ── 2 ГЛАВНЫХ РАЗДЕЛА ДЛЯ ИЗУЧАЕМОГО ЯЗЫКА ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {/* Раздел 1 */}
        <Card
          onClick={() => handleSelectSlot("S1")}
          style={{
            padding: "var(--space-5)",
            cursor: "pointer",
            border: isS1
              ? `2px solid ${studyPalette.accentHex}`
              : "1px solid var(--border)",
            backgroundColor: isS1
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
                backgroundColor: isS1
                  ? studyPalette.accentHex
                  : "var(--surface-raised)",
                color: isS1 ? "#fff" : "var(--text-muted)",
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
                {studyText.section1.title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {studyText.section1.desc}
              </div>
            </div>
          </div>
          <Badge variant={isS1 ? "accent" : "default"}>
            {section1Cards.length} {studyText.wordsUnit}
          </Badge>
        </Card>

        {/* Раздел 2 */}
        <Card
          onClick={() => handleSelectSlot("S2")}
          style={{
            padding: "var(--space-5)",
            cursor: "pointer",
            border: !isS1
              ? `2px solid ${studyPalette.secondaryHex}`
              : "1px solid var(--border)",
            backgroundColor: !isS1
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
                backgroundColor: !isS1
                  ? studyPalette.secondaryHex
                  : "var(--surface-raised)",
                color: !isS1 ? "#fff" : "var(--text-muted)",
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
                {studyText.section2.title}
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {studyText.section2.desc}
              </div>
            </div>
          </div>
          <Badge variant={!isS1 ? "accent" : "default"}>
            {section2Cards.length} {studyText.wordsUnit}
          </Badge>
        </Card>
      </div>

      {/* ── ФОРМА ДОБАВЛЕНИЯ СЛОВА (АДАПТИВНАЯ ПОД ЯЗЫК И РАЗДЕЛ) ── */}
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
          {isS1 ? (
            <>
              <Scroll size={18} color={studyPalette.accentHex} /> {currentSecText.addTitle}
            </>
          ) : (
            <>
              <BookA size={18} color={studyPalette.secondaryHex} /> {currentSecText.addTitle}
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
              placeholder={currentSecText.wordPlaceholder}
              value={word}
              onChange={(e) => setWord(e.target.value)}
              required
            />
          </div>

          {/* Поле 2: Чтение / Транскрипция / Форма */}
          {currentSecText.showReadingInput && (
            <div style={{ flex: "1 1 200px" }}>
              <Input
                icon={<Languages size={16} />}
                placeholder={currentSecText.readingPlaceholder || studyText.readingLabelPlaceholder}
                value={reading}
                onChange={(e) => setReading(e.target.value)}
              />
            </div>
          )}

          {/* Поле 3: Перевод */}
          <div style={{ flex: "1 1 200px" }}>
            <Input
              icon={<BookOpen size={16} />}
              placeholder={currentSecText.meaningPlaceholder}
              value={meaning}
              onChange={(e) => setMeaning(e.target.value)}
              required
            />
          </div>

          {/* Выбор уровня карточки (N5/N4/N3 или A1-B2) */}
          <select
            aria-label={levelUi.cardLevelLabel}
            title={levelUi.cardLevelLabel}
            value={cardLevel}
            onChange={(e) => setCardLevel(e.target.value)}
            style={{
              height: "40px",
              padding: "0 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border-subtle)",
              backgroundColor: "var(--bg-elevated)",
              color: "var(--text-primary)",
              fontSize: "13px",
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
              {currentSecText.deckTitle} ({filteredCards.length})
            </h3>

            {!isStarterClaimed && (
              <Button
                variant="secondary"
                onClick={handleLoadStarterPack}
                disabled={isImporting}
                style={{
                  padding: "4px 10px",
                  fontSize: "12px",
                  color: studyPalette.accentHex,
                  borderColor: "var(--vibe-banner-border)",
                  gap: "6px",
                }}
                title={studyText.starterFullBtn}
              >
                <Sparkles size={13} /> {isImporting ? t.jap.loadingBtn : studyText.starterBtn}
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
                title={currentSecText.clearBtn}
              >
                <Trash2 size={13} /> {currentSecText.clearBtn}
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
                title={studyText.clearAllDeckBtn}
              >
                <Trash2 size={13} /> {studyText.clearAllDeckBtn} ({cards.length})
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
              {searchQuery ? studyText.notFound : currentSecText.emptyText}
            </p>
            {!searchQuery && !isStarterClaimed && (
              <Button
                onClick={handleLoadStarterPack}
                disabled={isImporting}
                style={{
                  gap: "8px",
                  marginTop: "6px",
                  backgroundColor: studyPalette.accentHex,
                  color: "#ffffff",
                }}
              >
                <Sparkles size={16} />{" "}
                {isImporting ? t.jap.importingCardsBtn : studyText.starterFullBtn}
              </Button>
            )}
          </Card>
        ) : (
          selectedLevel === "ALL" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
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
                      gap: "var(--space-3)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: "10px",
                        padding: "10px 14px",
                        borderRadius: "12px",
                        backgroundColor: "var(--bg-surface)",
                        border: `1px solid ${lvl.color}40`,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <span
                          style={{
                            fontSize: "12px",
                            padding: "3px 10px",
                            borderRadius: "999px",
                            backgroundColor: `${lvl.color}20`,
                            color: lvl.color,
                            border: `1px solid ${lvl.color}45`,
                            fontWeight: 700,
                          }}
                        >
                          {lvl.badge}
                        </span>
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                          }}
                        >
                          {lvl.title[language]}
                        </span>
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-muted)",
                          }}
                        >
                          {lvl.subtitle[language]} · {lvlCards.length}
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
                          gap: "6px",
                          padding: "6px 12px",
                          fontSize: "12px",
                          borderColor: `${lvl.color}45`,
                          color: lvl.color,
                        }}
                      >
                        <Sparkles size={13} /> {levelUi.sectionReviewBtn} ({lvlCards.length})
                      </Button>
                    </div>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                        gap: "var(--space-4)",
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
                gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
                gap: "var(--space-4)",
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
    </div>
  );
}
