import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { api } from "../api/axios";
import { useAchievements } from "../context/AchievementContext";
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

interface JapaneseCard {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  type?: string;
  level: number;
  nextReview: string;
}

type SessionFilter = "KANA" | "KANJI" | "ALL";

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
  const { incrementReviewCount, evaluateAchievements } = useAchievements();

  // Режим повторения: по умолчанию KANA (для начинающих), либо из URL query (?mode=kanji / ?mode=kana)
  const initialMode: SessionFilter =
    searchParams.get("mode") === "kanji"
      ? "KANJI"
      : searchParams.get("mode") === "all"
        ? "ALL"
        : "KANA";

  const [sessionFilter, setSessionFilter] = useState<SessionFilter>(initialMode);

  const [rawCards, setRawCards] = useState<JapaneseCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  // Итоговая статистика сессии
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });

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
      const response = await api.get("/japanese");
      setRawCards(response.data || []);
    } catch (error) {
      console.error("Ошибка загрузки карточек", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Фильтрация колоды по выбранному режиму
  const activeDeck = useMemo(() => {
    const now = new Date();

    // 1. Фильтр по категории (Кана vs Кандзи vs Все)
    const categoryFiltered = rawCards.filter((card) => {
      if (sessionFilter === "KANA") {
        return card.type === "KANA" || !hasKanji(card.word);
      }
      if (sessionFilter === "KANJI") {
        return card.type === "KANJI" || hasKanji(card.word);
      }
      return true;
    });

    // 2. В режиме SRS — только готовые к повторению
    if (isPracticeMode) {
      return [...categoryFiltered].sort(() => Math.random() - 0.5);
    }

    const due = categoryFiltered.filter(
      (card) => new Date(card.nextReview) <= now,
    );
    return [...due].sort(() => Math.random() - 0.5);
  }, [rawCards, sessionFilter, isPracticeMode]);

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
    }
  }, [isFlipped]);

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
    [activeDeck, currentIndex, isPracticeMode],
  );

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
        Загрузка сессии повторения...
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
              Сессия завершена!
            </h2>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "14px" }}>
              Повторение колоды:{" "}
              {sessionFilter === "KANA"
                ? "Хирагана и Катакана (для начинающих)"
                : sessionFilter === "KANJI"
                  ? "Слова с Кандзи"
                  : "Все слова"}
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
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Повторено слов</div>
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
              <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Точность</div>
              <div
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: accuracy >= 70 ? "var(--success)" : "var(--accent)",
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
              <LayoutDashboard size={16} /> На главную
            </Button>
            <Button onClick={startPracticeMode} style={{ flex: 1, gap: "8px" }}>
              <RotateCcw size={16} /> Повторить ещё
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
          Все карточки повторены!
        </h2>
        <p style={{ color: "var(--text-secondary)", margin: 0 }}>
          {sessionFilter === "KANA"
            ? "В разделе «Хирагана & Катакана» на сегодня нет обязательных повторений."
            : sessionFilter === "KANJI"
              ? "В разделе «Кандзи» на сегодня всё повторено."
              : "Все слова в колоде повторены."}
        </p>

        {/* Переключатель разделов прямо отсюда */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px", flexWrap: "wrap", justifyContent: "center" }}>
          <button
            onClick={() => switchFilter("KANJI")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              border: sessionFilter === "KANJI" ? "1px solid #a855f7" : "1px solid var(--border)",
              backgroundColor: sessionFilter === "KANJI" ? "var(--surface-raised)" : "transparent",
              color: sessionFilter === "KANJI" ? "#a855f7" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Scroll size={14} /> 1. Кандзи
          </button>
          <button
            onClick={() => switchFilter("KANA")}
            style={{
              padding: "6px 14px",
              borderRadius: "var(--radius-md)",
              border: sessionFilter === "KANA" ? "1px solid var(--accent)" : "1px solid var(--border)",
              backgroundColor: sessionFilter === "KANA" ? "var(--surface-raised)" : "transparent",
              color: sessionFilter === "KANA" ? "var(--accent)" : "var(--text-muted)",
              cursor: "pointer",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <BookA size={14} /> 2. Хирагана & Катакана
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
            Все слова
          </button>
        </div>

        <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-3)" }}>
          <Button variant="secondary" onClick={() => navigate("/dashboard")}>
            На главную
          </Button>
          <Button onClick={startPracticeMode} style={{ gap: "6px" }}>
            <Sparkles size={16} /> Свободная практика
          </Button>
        </div>
      </div>
    );
  }

  if (activeDeck.length === 0) return null;

  const currentCard = activeDeck[currentIndex];
  const isCurrentCardKanji = currentCard.type === "KANJI" || hasKanji(currentCard.word);

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
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ margin: 0, fontSize: "20px", fontWeight: 600, color: "var(--text-primary)" }}>
              {isPracticeMode ? "Режим практики" : "Интервальное повторение"}
            </h2>
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                backgroundColor: isCurrentCardKanji
                  ? "rgba(168, 85, 247, 0.15)"
                  : "rgba(59, 130, 246, 0.15)",
                color: isCurrentCardKanji ? "#c084fc" : "#60a5fa",
              }}
            >
              {isCurrentCardKanji ? "Кандзи" : "Кана (Азбука)"}
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            Уровень: {currentCard.level}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Переключатель режимов повторения */}
          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={() => switchFilter("KANJI")}
              title="Повторять слова 1 раздела (Кандзи)"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: "var(--radius-md)",
                border: sessionFilter === "KANJI" ? "1px solid #a855f7" : "1px solid var(--border)",
                backgroundColor: sessionFilter === "KANJI" ? "var(--surface-raised)" : "transparent",
                color: sessionFilter === "KANJI" ? "#a855f7" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <Scroll size={13} /> 1. Кандзи
            </button>
            <button
              onClick={() => switchFilter("KANA")}
              title="Повторять слова 2 раздела (Кана)"
              style={{
                padding: "4px 8px",
                fontSize: "12px",
                borderRadius: "var(--radius-md)",
                border: sessionFilter === "KANA" ? "1px solid var(--accent)" : "1px solid var(--border)",
                backgroundColor: sessionFilter === "KANA" ? "var(--surface-raised)" : "transparent",
                color: sessionFilter === "KANA" ? "var(--accent)" : "var(--text-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <BookA size={13} /> 2. Кана
            </button>
          </div>

          {/* Звук */}
          <button
            onClick={toggleSound}
            style={{
              background: "none",
              border: "none",
              color: soundEnabled ? "var(--accent)" : "var(--text-muted)",
              cursor: "pointer",
              padding: "4px",
            }}
            title={soundEnabled ? "Звук включен" : "Звук выключен"}
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
            backgroundColor: isCurrentCardKanji ? "#a855f7" : "var(--accent)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      {/* Карточка */}
      <Card
        style={{
          width: "100%",
          minHeight: "320px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: isFlipped ? "default" : "pointer",
          textAlign: "center",
          transition: "all 0.25s ease",
          backgroundColor: isFlipped ? "var(--surface-raised)" : "var(--surface)",
          border: isFlipped
            ? `1px solid ${isCurrentCardKanji ? "#a855f7" : "var(--accent)"}`
            : "1px solid var(--border)",
          padding: "var(--space-6)",
          position: "relative",
        }}
        onClick={handleFlipCard}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-2)",
            marginBottom: "var(--space-4)",
          }}
        >
          {currentCard.reading && isCurrentCardKanji && (
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
          <span
            style={{
              fontSize: isCurrentCardKanji ? "64px" : "48px",
              fontFamily: "var(--font-jp)",
              color: "var(--text-primary)",
              lineHeight: "1.15",
              letterSpacing: isCurrentCardKanji ? "2px" : "1px",
            }}
          >
            {currentCard.word}
          </span>
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
            Нажмите или <kbd style={{ padding: "2px 6px", background: "var(--surface-raised)", borderRadius: "4px", border: "1px solid var(--border)" }}>Space</kbd> чтобы открыть перевод
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
            }}
          >
            <span
              style={{
                fontSize: "24px",
                color: isCurrentCardKanji ? "#c084fc" : "var(--accent)",
                fontWeight: 600,
              }}
            >
              {currentCard.meaning}
            </span>
          </div>
        )}
      </Card>

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
            <span>Не помню (1 / ←)</span>
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
            <span>Помню (2 / →)</span>
          </Button>
        </div>
      )}
    </div>
  );
}
