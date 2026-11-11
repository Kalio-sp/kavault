import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { getGermanArticleStyle } from "../data/studyVibes";
import {
  CheckCircle2,
  Sparkles,
  Trophy,
  RotateCcw,
  LayoutDashboard,
  Volume2,
  VolumeX,
  BookA,
  Scroll,
} from "lucide-react";

interface StudyCard {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  type?: string;
  language?: string;
  level: number;
  nextReview: string;
}

type SessionFilter = "S1" | "S2" | "ALL";

// Проверка наличия иероглифов кандзи
const hasKanji = (str: string) => /[\u4e00-\u9faf\u3400-\u4dbf]/.test(str);

/* ───────────── Web Audio API генератор звуков ───────────── */

const playSound = (type: "flip" | "correct" | "wrong" | "victory") => {
  if (localStorage.getItem("kavault_sound_fx") === "false") return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    if (type === "flip") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.08);
    } else if (type === "correct") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.08);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.25);
    } else if (type === "wrong") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.linearRampToValueAtTime(160, now + 0.15);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.2);
    } else if (type === "victory") {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        gain.gain.setValueAtTime(0.12, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.35);
      });
    }
  } catch {
    // игнорируем ошибку звука
  }
};

export function ReviewSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t, studyLanguage, studyText, studyPalette } = useApp();
  const { incrementReviewCount, evaluateAchievements } = useAchievements();

  const resolveModeFromParams = (): SessionFilter => {
    const mode = (searchParams.get("mode") || "").toLowerCase();
    if (mode === "kanji" || mode === "vocabulary") return "S1";
    if (mode === "kana" || mode === "grammar") return "S2";
    if (mode === "all") return "ALL";
    return studyLanguage === "ja" ? "S2" : "S1";
  };

  const [sessionFilter, setSessionFilter] = useState<SessionFilter>(
    resolveModeFromParams,
  );

  const [rawCards, setRawCards] = useState<StudyCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // Итоговая статистика сессии
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

  // Свайп-жесты (Tinder/Anki Style)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState<"left" | "right" | null>(null);
  const dragStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Озвучка слова на изучаемом языке
  const speakWord = useCallback(
    (text: string) => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        try {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(text);
          u.lang = studyPalette.ttsLang;
          u.rate = studyLanguage === "ja" ? 0.85 : 0.95;
          window.speechSynthesis.speak(u);
        } catch (err) {
          console.warn("Speech synthesis error", err);
        }
      }
    },
    [studyLanguage, studyPalette.ttsLang],
  );

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem("kavault_sound_fx") !== "false";
  });

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    localStorage.setItem("kavault_sound_fx", String(next));
  };

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/japanese?language=${studyLanguage}`);
      setRawCards(response.data || []);
    } catch (error) {
      console.error("Ошибка загрузки карточек", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [studyLanguage]);

  // Фильтрация колоды по выбранному режиму и изучаемому языку
  const activeDeck = useMemo(() => {
    const now = new Date();

    const isCardS1 = (card: StudyCard) => {
      if (studyLanguage === "ja") {
        return card.type === "KANJI" || hasKanji(card.word);
      }
      return card.type !== "GRAMMAR";
    };

    const categoryFiltered = rawCards.filter((card) => {
      if (sessionFilter === "S1") return isCardS1(card);
      if (sessionFilter === "S2") return !isCardS1(card);
      return true;
    });

    // В режиме SRS — только готовые к повторению
    if (isPracticeMode) {
      return [...categoryFiltered].sort(() => Math.random() - 0.5);
    }

    const due = categoryFiltered.filter(
      (card) => new Date(card.nextReview) <= now,
    );
    return [...due].sort(() => Math.random() - 0.5);
  }, [rawCards, sessionFilter, isPracticeMode, studyLanguage]);

  const switchFilter = (newFilter: SessionFilter) => {
    setSessionFilter(newFilter);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setStats({ correct: 0, wrong: 0 });
  };

  const startPracticeMode = () => {
    setIsPracticeMode(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setStats({ correct: 0, wrong: 0 });
  };

  const handleFlipCard = useCallback(() => {
    if (!isFlipped) {
      playSound("flip");
      setIsFlipped(true);
      const cur = activeDeck[currentIndex];
      if (cur && soundEnabled) {
        speakWord(cur.word);
      }
    }
  }, [isFlipped, activeDeck, currentIndex, soundEnabled, speakWord]);

  const handleAnswer = useCallback(
    async (isCorrect: boolean) => {
      const currentCard = activeDeck[currentIndex];
      if (!currentCard) return;

      if (isCorrect) {
        playSound("correct");
        setStats((prev) => ({ ...prev, correct: prev.correct + 1 }));
      } else {
        playSound("wrong");
        setStats((prev) => ({ ...prev, wrong: prev.wrong + 1 }));
      }

      try {
        if (!isPracticeMode) {
          await api.post(`/japanese/${currentCard.id}/review`, { isCorrect });
          incrementReviewCount(1);
        }

        if (currentIndex + 1 < activeDeck.length) {
          setCurrentIndex((prev) => prev + 1);
          setIsFlipped(false);
        } else {
          playSound("victory");
          setSessionCompleted(true);
          evaluateAchievements();
        }
      } catch (error) {
        console.error("Ошибка отправки результата", error);
      }
    },
    [activeDeck, currentIndex, isPracticeMode, incrementReviewCount, evaluateAchievements],
  );

  // Обработка свайпов (Touch и Mouse)
  const finalizeDrag = useCallback(() => {
    if (!dragStartRef.current) {
      setIsDragging(false);
      return;
    }
    const dx = dragOffset.x;
    const dy = dragOffset.y;
    const dist = Math.hypot(dx, dy);
    const duration = Date.now() - dragStartRef.current.time;
    const velocity = Math.abs(dx) / Math.max(1, duration);

    dragStartRef.current = null;
    setIsDragging(false);

    // 1. Короткий клик/тап на карточку -> Переворот
    if (dist < 12 && duration < 350) {
      handleFlipCard();
      setDragOffset({ x: 0, y: 0 });
      return;
    }

    // 2. Свайп вправо (ПОМНЮ)
    if (dx > 85 || (dx > 45 && velocity > 0.35)) {
      setFlyDirection("right");
      setTimeout(() => {
        handleAnswer(true);
        setDragOffset({ x: 0, y: 0 });
        setFlyDirection(null);
      }, 200);
      return;
    }

    // 3. Свайп влево (НЕ ПОМНЮ)
    if (dx < -85 || (dx < -45 && velocity > 0.35)) {
      setFlyDirection("left");
      setTimeout(() => {
        handleAnswer(false);
        setDragOffset({ x: 0, y: 0 });
        setFlyDirection(null);
      }, 200);
      return;
    }

    // Иначе плавный возврат карточки
    setDragOffset({ x: 0, y: 0 });
  }, [dragOffset.x, dragOffset.y, handleFlipCard, handleAnswer]);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX, y: touch.clientY, time: Date.now() };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragStartRef.current) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setDragOffset({ x: dx, y: dy });
  };

  const handleTouchEnd = () => {
    finalizeDrag();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    dragStartRef.current = { x: e.clientX, y: e.clientY, time: Date.now() };
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragStartRef.current) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setDragOffset({ x: dx, y: dy });
    };

    const handleMouseUp = () => {
      if (isDragging) {
        finalizeDrag();
      }
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, finalizeDrag]);

  /* Горячие клавиши */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault();
        if (!isFlipped) {
          handleFlipCard();
        }
      } else if (isFlipped) {
        if (e.key === "1" || e.code === "ArrowLeft") {
          e.preventDefault();
          handleAnswer(false);
        } else if (e.key === "2" || e.code === "ArrowRight") {
          e.preventDefault();
          handleAnswer(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped, handleFlipCard, handleAnswer]);

  if (loading) {
    return (
      <div style={{ color: "var(--text-secondary)", padding: "var(--space-8)", textAlign: "center" }}>
        {t.review.loading}
      </div>
    );
  }

  /* Экран результатов сессии */
  if (sessionCompleted) {
    const total = stats.correct + stats.wrong;
    const accuracy = total > 0 ? Math.round((stats.correct / total) * 100) : 100;

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "520px",
          margin: "40px auto 0 auto",
          gap: "var(--space-6)",
          textAlign: "center",
        }}
      >
        <Card
          style={{
            padding: "var(--space-8)",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-5)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "rgba(16, 185, 129, 0.15)",
              color: "var(--success)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Trophy size={32} />
          </div>

          <div>
            <h2 style={{ fontSize: "24px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--text-primary)" }}>
              {t.review.sessionDoneTitle}
            </h2>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
              {t.review.sessionDeckLabel}{" "}
              {sessionFilter === "S2"
                ? studyText.section2.deckTitle
                : sessionFilter === "S1"
                  ? studyText.section1.deckTitle
                  : t.review.deckAll}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
              width: "100%",
            }}
          >
            <div
              style={{
                padding: "16px",
                backgroundColor: "var(--surface-raised)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.review.reviewedCount}</div>
              <div style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)" }}>
                {total}
              </div>
            </div>

            <div
              style={{
                padding: "16px",
                backgroundColor: "var(--surface-raised)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>{t.review.accuracy}</div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: accuracy >= 70 ? "var(--success)" : studyPalette.accentHex,
                }}
              >
                {accuracy}%
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", width: "100%", marginTop: "12px" }}>
            <Button
              variant="secondary"
              onClick={() => navigate("/dashboard")}
              style={{ flex: 1, gap: "8px" }}
            >
              <LayoutDashboard size={16} /> {t.review.backToDash}
            </Button>
            <Button onClick={startPracticeMode} style={{ flex: 1, gap: "8px", backgroundColor: studyPalette.accentHex, color: "#ffffff" }}>
              <RotateCcw size={16} /> {t.review.practiceMore}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  /* Если нет слов к повторению в этом разделе */
  if (activeDeck.length === 0 && !isPracticeMode) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: "var(--space-4)",
          textAlign: "center",
          maxWidth: "500px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            backgroundColor: "rgba(16, 185, 129, 0.15)",
            color: "var(--success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CheckCircle2 size={30} />
        </div>
        <h2 style={{ color: "var(--text-primary)", margin: 0, fontSize: "24px" }}>
          {studyPalette.flag} {t.review.allReviewedTitle}
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          {sessionFilter === "S2"
            ? studyText.section2.allReviewedText
            : sessionFilter === "S1"
              ? studyText.section1.allReviewedText
              : t.review.allReviewedAll}
        </p>

        {/* Переключатель разделов прямо отсюда */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => switchFilter("S1")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              border: sessionFilter === "S1" ? `1px solid ${studyPalette.accentHex}` : "1px solid var(--border)",
              backgroundColor: sessionFilter === "S1" ? "var(--surface-raised)" : "transparent",
              color: sessionFilter === "S1" ? studyPalette.accentHex : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Scroll size={14} /> {studyText.section1.badge}
          </button>
          <button
            onClick={() => switchFilter("S2")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              border: sessionFilter === "S2" ? `1px solid ${studyPalette.secondaryHex}` : "1px solid var(--border)",
              backgroundColor: sessionFilter === "S2" ? "var(--surface-raised)" : "transparent",
              color: sessionFilter === "S2" ? studyPalette.secondaryHex : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <BookA size={14} /> {studyText.section2.badge}
          </button>
          <button
            onClick={() => switchFilter("ALL")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              border: sessionFilter === "ALL" ? "1px solid var(--text-primary)" : "1px solid var(--border)",
              backgroundColor: sessionFilter === "ALL" ? "var(--surface-raised)" : "transparent",
              color: sessionFilter === "ALL" ? "var(--text-primary)" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            {t.review.allTab}
          </button>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            {t.review.backToDash}
          </Button>
          <Button
            onClick={startPracticeMode}
            style={{ gap: "6px", backgroundColor: studyPalette.accentHex, color: "#ffffff" }}
          >
            <Sparkles size={16} /> {t.review.freePractice}
          </Button>
        </div>
      </div>
    );
  }

  if (activeDeck.length === 0) return null;

  const currentCard = activeDeck[currentIndex];
  const isJa = studyLanguage === "ja";
  const isCurrentCardS1 = isJa
    ? currentCard.type === "KANJI" || hasKanji(currentCard.word)
    : currentCard.type !== "GRAMMAR";
  const cardAccent = isCurrentCardS1 ? studyPalette.accentHex : studyPalette.secondaryHex;
  const deArticle = studyLanguage === "de" ? getGermanArticleStyle(currentCard.word) : null;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: "620px",
        margin: "0 auto",
        gap: "var(--space-5)",
        paddingTop: "var(--space-4)",
      }}
    >
      {/* Верхний статус-бар сессии */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "18px" }}>{studyPalette.flag}</span>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "var(--text-primary)" }}>
              {isPracticeMode ? t.review.modeTitlePractice : t.review.modeTitleSrs}
            </h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: `${cardAccent}22`,
                color: cardAccent,
              }}
            >
              {isCurrentCardS1 ? studyText.section1.cardBadge : studyText.section2.cardBadge}
            </span>
            {deArticle?.article && (
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  backgroundColor: deArticle.bg,
                  color: deArticle.color,
                }}
              >
                {deArticle.article}
              </span>
            )}
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            {studyText.name} · {studyText.levelPrefix} {currentCard.level}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Переключатель режимов повторения */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => switchFilter("S1")}
              title={studyText.section1.deckTitle}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: "var(--radius-md)",
                border: sessionFilter === "S1" ? `1px solid ${studyPalette.accentHex}` : "1px solid var(--border)",
                backgroundColor: sessionFilter === "S1" ? "var(--surface-raised)" : "transparent",
                color: sessionFilter === "S1" ? studyPalette.accentHex : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Scroll size={13} /> {studyText.section1.badge}
            </button>
            <button
              onClick={() => switchFilter("S2")}
              title={studyText.section2.deckTitle}
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: "var(--radius-md)",
                border: sessionFilter === "S2" ? `1px solid ${studyPalette.secondaryHex}` : "1px solid var(--border)",
                backgroundColor: sessionFilter === "S2" ? "var(--surface-raised)" : "transparent",
                color: sessionFilter === "S2" ? studyPalette.secondaryHex : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <BookA size={13} /> {studyText.section2.badge}
            </button>
          </div>

          {/* Звук */}
          <button
            onClick={toggleSound}
            style={{
              background: "none",
              border: "none",
              color: soundEnabled ? cardAccent : "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
            title={soundEnabled ? t.review.soundOn : t.review.soundOff}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          <Badge variant="accent">
            {currentIndex + 1} / {activeDeck.length}
          </Badge>
        </div>
      </div>

      {/* Прогресс-бар */}
      <div
        style={{
          width: "100%",
          height: "4px",
          backgroundColor: "var(--surface-raised)",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${((currentIndex + 1) / activeDeck.length) * 100}%`,
            height: "100%",
            backgroundColor: cardAccent,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Интерактивная карточка со свайп-жестами */}
      <div
        style={{
          width: "100%",
          position: "relative",
          perspective: "1000px",
          touchAction: "pan-y",
          userSelect: "none",
        }}
      >
        <Card
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          style={{
            width: "100%",
            minHeight: "340px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: isDragging ? "grabbing" : "grab",
            textAlign: "center",
            backgroundColor: isFlipped ? "var(--surface-raised)" : "var(--surface)",
            border: isFlipped
              ? `1px solid ${cardAccent}`
              : deArticle?.article
                ? `1px solid ${deArticle.color}44`
                : "1px solid var(--border)",
            padding: "var(--space-6)",
            position: "relative",
            overflow: "hidden",
            boxShadow: isDragging
              ? "0 20px 40px rgba(0,0,0,0.4)"
              : "0 4px 20px rgba(0,0,0,0.15)",
            transform:
              flyDirection === "right"
                ? "translate3d(120vw, 30px, 0) rotate(30deg)"
                : flyDirection === "left"
                  ? "translate3d(-120vw, 30px, 0) rotate(-30deg)"
                  : `translate3d(${dragOffset.x}px, ${dragOffset.y * 0.35}px, 0) rotate(${dragOffset.x * 0.08}deg)`,
            transition: isDragging
              ? "none"
              : flyDirection
                ? "transform 0.22s cubic-bezier(0.2, 0.9, 0.3, 1), opacity 0.22s ease"
                : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
            opacity: flyDirection ? 0 : 1,
          }}
        >
          {/* Визуальный штамп свайпа ВПРАВО (ПОМНЮ) */}
          <div
            style={{
              position: "absolute",
              top: "22px",
              left: "22px",
              padding: "6px 14px",
              border: "3px solid var(--success)",
              borderRadius: "8px",
              color: "var(--success)",
              fontWeight: 800,
              fontSize: "16px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              transform: "rotate(-12deg)",
              opacity: Math.min(1, Math.max(0, dragOffset.x / 75)),
              pointerEvents: "none",
              zIndex: 10,
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              backdropFilter: "blur(4px)",
              transition: isDragging ? "none" : "opacity 0.2s ease",
            }}
          >
            {t.review.swipeRightStamp}
          </div>

          {/* Визуальный штамп свайпа ВЛЕВО (НЕ ПОМНЮ) */}
          <div
            style={{
              position: "absolute",
              top: "22px",
              right: "22px",
              padding: "6px 14px",
              border: "3px solid var(--error)",
              borderRadius: "8px",
              color: "var(--error)",
              fontWeight: 800,
              fontSize: "16px",
              letterSpacing: "1px",
              textTransform: "uppercase",
              transform: "rotate(12deg)",
              opacity: Math.min(1, Math.max(0, -dragOffset.x / 75)),
              pointerEvents: "none",
              zIndex: 10,
              backgroundColor: "rgba(239, 68, 68, 0.12)",
              backdropFilter: "blur(4px)",
              transition: isDragging ? "none" : "opacity 0.2s ease",
            }}
          >
            {t.review.swipeLeftStamp}
          </div>

          {/* Контент карточки */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--space-2)",
              marginBottom: "var(--space-4)",
            }}
          >
            {currentCard.reading && isJa && isCurrentCardS1 && (
              <span
                style={{
                  fontSize: "18px",
                  color: "var(--text-secondary)",
                  fontFamily: "var(--font-jp)",
                }}
              >
                {currentCard.reading}
              </span>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
              <span
                style={{
                  fontSize: isJa
                    ? isCurrentCardS1
                      ? "60px"
                      : "48px"
                    : currentCard.word.length > 20
                      ? "28px"
                      : "40px",
                  fontWeight: isJa ? 500 : 700,
                  fontFamily: isJa ? "var(--font-jp)" : "inherit",
                  color: "var(--text-primary)",
                  lineHeight: "1.2",
                  letterSpacing: isJa ? (isCurrentCardS1 ? "2px" : "1px") : "normal",
                }}
              >
                {currentCard.word}
              </span>

              {/* Кнопка произношения голосом */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  speakWord(currentCard.word);
                }}
                style={{
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "50%",
                  width: "38px",
                  height: "38px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: cardAccent,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  flexShrink: 0,
                }}
                title={`${t.review.speakTitle} (${studyPalette.ttsLang})`}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <Volume2 size={18} />
              </button>
            </div>

            {currentCard.reading && !isJa && (
              <span
                style={{
                  fontSize: "15px",
                  color: "var(--text-muted)",
                }}
              >
                {currentCard.reading}
              </span>
            )}
          </div>

          {!isFlipped ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--text-muted)",
                fontSize: "14px",
              }}
            >
              {t.review.tapHintPrefix}{" "}
              <kbd style={{ padding: "2px 6px", background: "var(--surface-raised)", borderRadius: "4px", border: "1px solid var(--border)" }}>Space</kbd>{" "}
              {t.review.tapHintSuffix}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "var(--space-2)",
                alignItems: "center",
                borderTop: "1px solid var(--border)",
                paddingTop: "var(--space-4)",
                width: "100%",
                animation: "fadeIn 0.2s ease",
              }}
            >
              <span
                style={{
                  fontSize: "24px",
                  color: cardAccent,
                  fontWeight: 600,
                }}
              >
                {currentCard.meaning}
              </span>
            </div>
          )}
        </Card>
      </div>

      {/* Подсказка жестов для мобильных и десктопа */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          color: "var(--text-muted)",
          fontSize: "12px",
          userSelect: "none",
          flexWrap: "wrap",
        }}
      >
        <span>{t.review.gestureHintLeft}</span>
        <span>•</span>
        <span>{t.review.gestureHintTap}</span>
        <span>•</span>
        <span>{t.review.gestureHintRight}</span>
      </div>

      {/* Кнопки ответа */}
      {isFlipped && (
        <div style={{ display: "flex", gap: "var(--space-4)", width: "100%" }}>
          <Button
            variant="secondary"
            style={{
              flex: 1,
              height: "50px",
              borderColor: "rgba(239, 68, 68, 0.4)",
              color: "var(--error)",
              fontSize: "15px",
            }}
            onClick={() => handleAnswer(false)}
          >
            <span>{t.review.forgotBtn}</span>
          </Button>

          <Button
            style={{
              flex: 1,
              height: "50px",
              backgroundColor: "var(--success)",
              color: "#fff",
              fontSize: "15px",
            }}
            onClick={() => handleAnswer(true)}
          >
            <span>{t.review.rememberBtn}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
