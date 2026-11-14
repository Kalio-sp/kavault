import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import {
  Flame,
  Trophy,
  Sparkles,
  Calendar,
  Zap,
  Award,
  Lock,
  Plus,
  Minus,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useApp } from "../context/AppContext";

interface ActivityItem {
  createdAt: string;
  updatedAt?: string;
}

type TimeRange = "3m" | "6m" | "1y";

const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

const dayKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;

const readGoal = (key: string, fallback: number) => {
  const n = parseInt(localStorage.getItem(key) || "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

// Градация цветов активности в зависимости от культурного вайба изучаемого языка
const getCellBg = (count: number) => {
  if (count === 0) return "rgba(255, 255, 255, 0.05)";
  if (count <= 1)
    return "color-mix(in srgb, var(--vibe-accent) 35%, rgba(255,255,255,0.08))";
  if (count <= 3)
    return "color-mix(in srgb, var(--vibe-accent) 60%, rgba(255,255,255,0.08))";
  if (count <= 6)
    return "color-mix(in srgb, var(--vibe-accent) 85%, rgba(255,255,255,0.08))";
  return "var(--vibe-accent)";
};

const LEGEND_LEVELS = [0, 1, 3, 5, 8];

export function LearningTracker() {
  const {
    t,
    locale,
    studyLanguage,
    showProgramming,
    studyText,
    studyPalette,
  } = useApp();

  // Интерактивные цели с сохранением в localStorage
  const [goalCards, setGoalCards] = useState(() =>
    readGoal("kavault_goal_cards", 50),
  );
  const [goalResources, setGoalResources] = useState(() =>
    readGoal("kavault_goal_resources", 5),
  );

  const updateGoalCards = (delta: number) => {
    setGoalCards((prev) => {
      const next = Math.max(10, Math.min(500, prev + delta));
      localStorage.setItem("kavault_goal_cards", String(next));
      return next;
    });
  };

  const updateGoalResources = (delta: number) => {
    setGoalResources((prev) => {
      const next = Math.max(1, Math.min(50, prev + delta));
      localStorage.setItem("kavault_goal_resources", String(next));
      return next;
    });
  };

  const [resources, setResources] = useState<ActivityItem[]>([]);
  const [cards, setCards] = useState<ActivityItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("3m");

  // Тултип для ячеек хитмапа
  const [hoveredCell, setHoveredCell] = useState<{
    date: Date;
    count: number;
    resCount: number;
    cardCount: number;
    x: number;
    y: number;
  } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchActivity = async () => {
      try {
        const [resResp, japResp] = await Promise.all([
          showProgramming
            ? api.get<ActivityItem[]>("/resources").catch(() => ({ data: [] }))
            : Promise.resolve({ data: [] as ActivityItem[] }),
          api
            .get<ActivityItem[]>(`/japanese?language=${studyLanguage}`)
            .catch(() => ({ data: [] })),
        ]);
        if (cancelled) return;

        setResources(resResp.data || []);
        setCards(japResp.data || []);
        setLoaded(true);
      } catch (error) {
        console.error("Ошибка загрузки данных трекера", error);
      }
    };

    fetchActivity();
    return () => {
      cancelled = true;
    };
  }, [studyLanguage, showProgramming]);

  // Автоскролл вправо к текущей дате
  useEffect(() => {
    if (loaded && scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, [loaded, timeRange]);

  // Число недель в зависимости от диапазона
  const weeksCount = useMemo(() => {
    if (timeRange === "3m") return 14;
    if (timeRange === "6m") return 26;
    return 53;
  }, [timeRange]);

  /* Расчет матриц активности, стриков и статистики */
  const {
    cells,
    monthLabels,
    currentStreak,
    longestStreak,
    totalContributions,
    weeklyStats,
    todayCount,
    currentWeekDays,
  } = useMemo(() => {
    const today = startOfDay(new Date());

    // Карты активности по дням
    const totalDayMap = new Map<string, number>();
    const resDayMap = new Map<string, number>();
    const cardDayMap = new Map<string, number>();

    const weekAgo = Date.now() - 7 * DAY_MS;
    let recentRes = 0;
    let recentCards = 0;

    resources.forEach((r) => {
      const d = new Date(r.createdAt);
      const key = dayKey(d);
      totalDayMap.set(key, (totalDayMap.get(key) || 0) + 1);
      resDayMap.set(key, (resDayMap.get(key) || 0) + 1);
      if (d.getTime() >= weekAgo) recentRes++;
    });

    cards.forEach((c) => {
      const d = new Date(c.updatedAt || c.createdAt);
      const key = dayKey(d);
      totalDayMap.set(key, (totalDayMap.get(key) || 0) + 1);
      cardDayMap.set(key, (cardDayMap.get(key) || 0) + 1);
      if (d.getTime() >= weekAgo) recentCards++;
    });

    // ── Сетка дней текущей недели (Пн-Вс) для тактильного виджета привычек ──
    const currDayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const monday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - currDayOfWeek,
    );

    const dayNames = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
    const currentWeekDays: {
      date: Date;
      dayName: string;
      dayNum: number;
      isToday: boolean;
      isFuture: boolean;
      count: number;
      hasActivity: boolean;
    }[] = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(
        monday.getFullYear(),
        monday.getMonth(),
        monday.getDate() + i,
      );
      const key = dayKey(d);
      const count = totalDayMap.get(key) || 0;
      const isToday = d.getTime() === today.getTime();
      const isFuture = d > today;
      currentWeekDays.push({
        date: d,
        dayName: dayNames[i],
        dayNum: d.getDate(),
        isToday,
        isFuture,
        count,
        hasActivity: count > 0,
      });
    }

    // Сетка хитмапа: дни с понедельника
    const todayRow = (today.getDay() + 6) % 7;
    const firstDate = new Date(
      today.getTime() - ((weeksCount - 1) * 7 + todayRow) * DAY_MS,
    );

    const cells: {
      date: Date;
      count: number;
      resCount: number;
      cardCount: number;
      future: boolean;
    }[] = [];

    for (let i = 0; i < weeksCount * 7; i++) {
      const d = new Date(
        firstDate.getFullYear(),
        firstDate.getMonth(),
        firstDate.getDate() + i,
      );
      const key = dayKey(d);
      cells.push({
        date: d,
        count: totalDayMap.get(key) || 0,
        resCount: resDayMap.get(key) || 0,
        cardCount: cardDayMap.get(key) || 0,
        future: d > today,
      });
    }

    // Подписи месяцев
    const monthLabels: { col: number; label: string }[] = [];
    let prevMonth = -1;
    for (let w = 0; w < weeksCount; w++) {
      const d = cells[w * 7].date;
      if (d.getMonth() !== prevMonth) {
        prevMonth = d.getMonth();
        monthLabels.push({
          col: w,
          label: d.toLocaleDateString(locale, { month: "short" }),
        });
      }
    }

    // Расчет стрика (текущего и лучшего)
    const todayStr = dayKey(today);
    const todayCount = totalDayMap.get(todayStr) || 0;
    let currentStreak = 0;
    let longestStreak = 0;

    const cursor = new Date(today);
    if (todayCount === 0) {
      cursor.setDate(cursor.getDate() - 1);
    }
    while ((totalDayMap.get(dayKey(cursor)) || 0) > 0) {
      currentStreak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    // Расчет longest streak за все время
    let tempStreak = 0;
    const sortedDays = Array.from(totalDayMap.keys()).sort();
    if (sortedDays.length > 0) {
      let lastD: Date | null = null;
      sortedDays.forEach((k) => {
        const d = new Date(k);
        if (lastD) {
          const diff = Math.round((d.getTime() - lastD.getTime()) / DAY_MS);
          if (diff === 1) {
            tempStreak++;
          } else {
            tempStreak = 1;
          }
        } else {
          tempStreak = 1;
        }
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        lastD = d;
      });
    }
    longestStreak = Math.max(longestStreak, currentStreak);

    const totalContributions = resources.length + cards.length;

    return {
      cells,
      monthLabels,
      currentStreak,
      longestStreak,
      totalContributions,
      weeklyStats: { resources: recentRes, cards: recentCards },
      todayCount,
      currentWeekDays,
    };
  }, [resources, cards, weeksCount, locale]);

  /* Список достижений (Gamified Milestones) */
  const milestones = useMemo(() => {
    const base = [
      {
        id: "first_step",
        title: t.track.milestones.first_step.title,
        desc: t.track.milestones.first_step.desc,
        icon: Sparkles,
        color: "#3b82f6",
        unlocked: totalContributions >= 1,
        progress: `${Math.min(totalContributions, 1)} / 1`,
        percent: Math.min(100, totalContributions * 100),
      },
      {
        id: "streak_3",
        title: t.track.milestones.streak_3.title,
        desc: t.track.milestones.streak_3.desc,
        icon: Flame,
        color: "#f59e0b",
        unlocked: currentStreak >= 3 || longestStreak >= 3,
        progress: `${Math.min(Math.max(currentStreak, longestStreak), 3)} / 3 ${t.track.days}`,
        percent: Math.min(100, Math.round((Math.max(currentStreak, longestStreak) / 3) * 100)),
      },
      {
        id: "week_streak",
        title: t.track.milestones.week_streak.title,
        desc: t.track.milestones.week_streak.desc,
        icon: Trophy,
        color: "#eab308",
        unlocked: currentStreak >= 7 || longestStreak >= 7,
        progress: `${Math.min(Math.max(currentStreak, longestStreak), 7)} / 7 ${t.track.days}`,
        percent: Math.min(100, Math.round((Math.max(currentStreak, longestStreak) / 7) * 100)),
      },
      {
        id: "words_25",
        title: studyText.trackerMilestoneTitle,
        desc: studyText.trackerMilestoneDesc,
        icon: Award,
        color: studyPalette.accentHex,
        unlocked: cards.length >= 25,
        progress: `${Math.min(cards.length, 25)} / 25`,
        percent: Math.min(100, Math.round((cards.length / 25) * 100)),
      },
    ];

    if (showProgramming) {
      base.push({
        id: "collector",
        title: t.track.milestones.collector.title,
        desc: t.track.milestones.collector.desc,
        icon: Zap,
        color: "#10b981",
        unlocked: resources.length >= 15,
        progress: `${Math.min(resources.length, 15)} / 15`,
        percent: Math.min(100, Math.round((resources.length / 15) * 100)),
      });
    }

    return base;
  }, [
    totalContributions,
    currentStreak,
    longestStreak,
    cards.length,
    resources.length,
    t,
    showProgramming,
    studyText,
    studyPalette,
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-6)",
        width: "100%",
        maxWidth: "100%",
        overflowX: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* ── ВЕРХНИЙ ХЕДЕР ТРЕКЕРА ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 800,
              margin: 0,
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              letterSpacing: "-0.01em",
            }}
          >
            <span>{studyPalette.flag}</span>
            <span>{t.track.title}</span>
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              margin: "3px 0 0 0",
              fontSize: "13px",
            }}
          >
            {studyText.name} · {t.track.subtitle}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link
            to="/review"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "7px 14px",
              borderRadius: "12px",
              backgroundColor: "rgba(234, 179, 8, 0.15)",
              border: "1px solid rgba(234, 179, 8, 0.35)",
              color: "#f59e0b",
              fontSize: "12.5px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.15s ease",
            }}
          >
            <Sparkles size={14} />
            <span>Повторить слова →</span>
          </Link>
        </div>
      </div>

      {/* ── ГЛАВНЫЙ СТРИК-ХИРО БАННЕР (ОГОНЬ ДИСЦИПЛИНЫ) ── */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          borderRadius: "20px",
          padding: "20px 22px",
          background:
            currentStreak > 0
              ? "linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(239, 68, 68, 0.12) 60%, rgba(236, 72, 153, 0.08) 100%)"
              : "linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(168, 85, 247, 0.08) 100%)",
          border:
            currentStreak > 0
              ? "1px solid rgba(245, 158, 11, 0.35)"
              : "1px solid rgba(59, 130, 246, 0.25)",
          boxShadow:
            currentStreak > 0
              ? "0 10px 30px -10px rgba(245, 158, 11, 0.3)"
              : "0 10px 30px -10px rgba(0, 0, 0, 0.4)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          boxSizing: "border-box",
        }}
      >
        {/* Фоновое свечение */}
        <div
          style={{
            position: "absolute",
            right: "-20px",
            top: "-20px",
            width: "160px",
            height: "160px",
            borderRadius: "50%",
            background:
              currentStreak > 0
                ? "radial-gradient(circle, rgba(245, 158, 11, 0.3) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%)",
            filter: "blur(20px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: "16px", minWidth: 0 }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "18px",
              backgroundColor:
                currentStreak > 0
                  ? "rgba(245, 158, 11, 0.22)"
                  : "rgba(59, 130, 246, 0.15)",
              border:
                currentStreak > 0
                  ? "1px solid rgba(245, 158, 11, 0.45)"
                  : "1px solid rgba(59, 130, 246, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: currentStreak > 0 ? "#f59e0b" : "#60a5fa",
              boxShadow:
                currentStreak > 0 ? "0 0 20px rgba(245, 158, 11, 0.4)" : "none",
              flexShrink: 0,
            }}
          >
            <Flame size={28} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 800,
                color: currentStreak > 0 ? "#f59e0b" : "#60a5fa",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {currentStreak > 0 ? "Серия активна 🔥" : "Серия ожидает запуска"}
            </div>
            <div
              style={{
                fontSize: "26px",
                fontWeight: 900,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                margin: "2px 0",
              }}
            >
              {currentStreak} {t.track.days}{" "}
              <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-muted)" }}>
                (Рекорд: {longestStreak} дн.)
              </span>
            </div>
            <div style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>
              {todayCount > 0
                ? "✅ Сегодняшняя цель закрыта! Серия продлена."
                : "⚡ Сделайте хотя бы 1 повторение сегодня, чтобы сохранить стрик!"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "12px",
              backgroundColor: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Trophy size={14} color="#eab308" />
            <span>Всего: <b>{totalContributions}</b> действий</span>
          </div>

          <Link
            to="/review"
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              backgroundColor:
                todayCount > 0 ? "rgba(16, 185, 129, 0.2)" : "#f59e0b",
              border:
                todayCount > 0
                  ? "1px solid rgba(16, 185, 129, 0.4)"
                  : "1px solid rgba(245, 158, 11, 0.6)",
              color: todayCount > 0 ? "#34d399" : "#000000",
              fontSize: "12.5px",
              fontWeight: 800,
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow:
                todayCount > 0 ? "none" : "0 4px 16px rgba(245, 158, 11, 0.35)",
              transition: "all 0.15s ease",
            }}
          >
            {todayCount > 0 ? (
              <>
                <CheckCircle2 size={15} />
                <span>Завершено (+{todayCount})</span>
              </>
            ) : (
              <>
                <Flame size={15} />
                <span>Зажечь сегодня</span>
              </>
            )}
          </Link>
        </div>
      </div>

      {/* ── ТАКТИЛЬНЫЙ ВИДЖЕТ НЕДЕЛЬНЫХ ПРИВЫЧЕК (ПН-ВС) ДЛЯ ТЕЛЕФОНОВ ── */}
      <Card
        style={{
          padding: "16px 18px",
          background: "var(--surface, #121214)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Calendar size={15} color="var(--accent)" />
            <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
              Текущая неделя
            </span>
          </div>
          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            +{weeklyStats.cards + weeklyStats.resources} за последние 7 дней
          </span>
        </div>

        {/* Сетка 7 дней недели */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gap: "6px",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {currentWeekDays.map((d, idx) => {
            const activeBg = d.hasActivity
              ? "linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(236, 72, 153, 0.2) 100%)"
              : d.isToday
                ? "rgba(59, 130, 246, 0.12)"
                : "rgba(255, 255, 255, 0.03)";
            const activeBorder = d.hasActivity
              ? "1px solid rgba(245, 158, 11, 0.5)"
              : d.isToday
                ? "1px solid var(--accent, #3b82f6)"
                : "1px solid rgba(255, 255, 255, 0.06)";

            return (
              <div
                key={idx}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 4px",
                  borderRadius: "14px",
                  background: activeBg,
                  border: activeBorder,
                  transition: "all 0.15s ease",
                  minWidth: 0,
                  boxSizing: "border-box",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    color: d.isToday ? "var(--accent)" : "var(--text-muted)",
                    marginBottom: "2px",
                  }}
                >
                  {d.dayName}
                </span>

                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    fontWeight: 800,
                    color: d.hasActivity
                      ? "#f59e0b"
                      : d.isToday
                        ? "#ffffff"
                        : "var(--text-secondary)",
                    backgroundColor: d.hasActivity
                      ? "rgba(245, 158, 11, 0.15)"
                      : "transparent",
                  }}
                >
                  {d.hasActivity ? "🔥" : d.dayNum}
                </div>

                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: d.hasActivity ? "#34d399" : "transparent",
                    marginTop: "2px",
                    lineHeight: 1,
                  }}
                >
                  {d.hasActivity ? `+${d.count}` : "•"}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── ИНТЕРАКТИВНЫЙ БЛОК УПРАВЛЕНИЯ ЦЕЛЯМИ (STEPPER ДЛЯ ТЕЛЕФОНОВ) ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "14px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {/* Карточка цели: Слова языка */}
        <Card
          style={{
            padding: "16px 18px",
            background: "var(--surface, #121214)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "18px" }}>{studyPalette.flag}</span>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                  {studyText.trackerGoalLabel}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  Недельная цель изучения
                </div>
              </div>
            </div>

            {/* Интерактивный регулятор цели прямо в карточке */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                padding: "3px 6px",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <button
                onClick={() => updateGoalCards(-10)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Уменьшить цель"
              >
                <Minus size={12} />
              </button>
              <span style={{ fontSize: "12px", fontWeight: 800, padding: "0 6px", minWidth: "30px", textAlign: "center" }}>
                {goalCards}
              </span>
              <button
                onClick={() => updateGoalCards(10)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "6px",
                  border: "none",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Увеличить цель"
              >
                <Plus size={12} />
              </button>
            </div>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                marginBottom: "6px",
                color: "var(--text-secondary)",
              }}
            >
              <span>Прогресс недели</span>
              <span style={{ fontWeight: 700, color: studyPalette.accentHex }}>
                {weeklyStats.cards} / {goalCards} слов ({Math.min(100, Math.round((weeklyStats.cards / goalCards) * 100))}%)
              </span>
            </div>
            <div
              style={{
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "rgba(255, 255, 255, 0.07)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.min(100, Math.round((weeklyStats.cards / goalCards) * 100))}%`,
                  background: `linear-gradient(90deg, ${studyPalette.accentHex} 0%, #a855f7 100%)`,
                  borderRadius: "999px",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
          </div>
        </Card>

        {/* Карточка цели: Dev статьи (если включено) ИЛИ Прогресс повторений */}
        {showProgramming ? (
          <Card
            style={{
              padding: "16px 18px",
              background: "var(--surface, #121214)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>💻</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {t.track.artGoals}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Материалы разработки
                  </div>
                </div>
              </div>

              {/* Интерактивный регулятор цели */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  padding: "3px 6px",
                  borderRadius: "10px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <button
                  onClick={() => updateGoalResources(-1)}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Уменьшить цель"
                >
                  <Minus size={12} />
                </button>
                <span style={{ fontSize: "12px", fontWeight: 800, padding: "0 6px", minWidth: "24px", textAlign: "center" }}>
                  {goalResources}
                </span>
                <button
                  onClick={() => updateGoalResources(1)}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    border: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  title="Увеличить цель"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginBottom: "6px",
                  color: "var(--text-secondary)",
                }}
              >
                <span>Изучено статей</span>
                <span style={{ fontWeight: 700, color: "#10b981" }}>
                  {weeklyStats.resources} / {goalResources} ({Math.min(100, Math.round((weeklyStats.resources / goalResources) * 100))}%)
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, Math.round((weeklyStats.resources / goalResources) * 100))}%`,
                    background: "linear-gradient(90deg, #10b981 0%, #06b6d4 100%)",
                    borderRadius: "999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </Card>
        ) : (
          <Card
            style={{
              padding: "16px 18px",
              background: "var(--surface, #121214)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "18px" }}>🧠</span>
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>
                    Интервальная память
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                    Карточки SRS
                  </div>
                </div>
              </div>
              <Link
                to="/review"
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--accent, #3b82f6)",
                  textDecoration: "none",
                }}
              >
                Начать сессию →
              </Link>
            </div>

            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "12px",
                  marginBottom: "6px",
                  color: "var(--text-secondary)",
                }}
              >
                <span>Всего слов в словаре</span>
                <span style={{ fontWeight: 700, color: "#a855f7" }}>
                  {cards.length} карточек
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${Math.min(100, Math.round((cards.length / 100) * 100))}%`,
                    background: "linear-gradient(90deg, #a855f7 0%, #ec4899 100%)",
                    borderRadius: "999px",
                    transition: "width 0.4s ease",
                  }}
                />
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ── ХИТМАП АКТИВНОСТИ (С ИНТЕРАКТИВНЫМ ПЕРЕКЛЮЧАТЕЛЕМ) ── */}
      <Card
        style={{
          padding: "18px 20px",
          background: "var(--surface, #121214)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          position: "relative",
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <TrendingUp size={16} color={studyPalette.accentHex} />
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
              {t.track.heatmap}
            </h3>
            <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
              ({totalContributions} {t.track.allTimeSuffix})
            </span>
          </div>

          {/* Диапазон 3м / 6м / 1г */}
          <div
            style={{
              display: "inline-flex",
              backgroundColor: "rgba(255, 255, 255, 0.04)",
              padding: "3px",
              borderRadius: "10px",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            {[
              { id: "3m", label: t.track.range3m },
              { id: "6m", label: t.track.range6m },
              { id: "1y", label: t.track.range1y },
            ].map((r) => (
              <button
                key={r.id}
                onClick={() => setTimeRange(r.id as TimeRange)}
                style={{
                  padding: "4px 10px",
                  fontSize: "11px",
                  borderRadius: "7px",
                  border: "none",
                  backgroundColor:
                    timeRange === r.id ? "var(--accent, #3b82f6)" : "transparent",
                  color: timeRange === r.id ? "#ffffff" : "var(--text-muted)",
                  cursor: "pointer",
                  fontWeight: timeRange === r.id ? 700 : 500,
                  transition: "all 0.15s ease",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Область скролла хитмапа */}
        <div
          ref={scrollRef}
          style={{
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "8px",
            maxWidth: "100%",
          }}
        >
          <div style={{ minWidth: `${weeksCount * 16 + 28}px`, display: "flex", gap: "8px" }}>
            {/* Подписи дней недели */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(7, 13px)",
                rowGap: "4px",
                marginTop: "18px",
                fontSize: "10px",
                color: "var(--text-muted)",
                width: "20px",
                textAlign: "right",
              }}
            >
              {t.track.weekDays.map((day, i) => (
                <div key={i} style={{ lineHeight: "13px" }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Колонки недель */}
            <div style={{ flex: 1 }}>
              {/* Месяцы сверху */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${weeksCount}, minmax(0, 1fr))`,
                  columnGap: "4px",
                  height: "16px",
                  marginBottom: "4px",
                  fontSize: "10px",
                  color: "var(--text-muted)",
                }}
              >
                {monthLabels.map(({ col, label }) => (
                  <span key={col} style={{ gridColumn: col + 1, whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                ))}
              </div>

              {/* Ячейки хитмапа */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${weeksCount}, minmax(0, 1fr))`,
                  gridTemplateRows: "repeat(7, 13px)",
                  gridAutoFlow: "column",
                  gap: "4px",
                }}
              >
                {cells.map((cell) => (
                  <div
                    key={cell.date.getTime()}
                    onClick={() => {
                      if (!cell.future) {
                        setHoveredCell({
                          date: cell.date,
                          count: cell.count,
                          resCount: cell.resCount,
                          cardCount: cell.cardCount,
                          x: window.innerWidth / 2,
                          y: 200,
                        });
                      }
                    }}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setHoveredCell({
                        date: cell.date,
                        count: cell.count,
                        resCount: cell.resCount,
                        cardCount: cell.cardCount,
                        x: rect.left + rect.width / 2,
                        y: rect.top,
                      });
                    }}
                    onMouseLeave={() => setHoveredCell(null)}
                    style={{
                      height: "13px",
                      borderRadius: "3px",
                      backgroundColor: getCellBg(cell.count),
                      visibility: cell.future ? "hidden" : "visible",
                      cursor: cell.future ? "default" : "pointer",
                      transition: "transform 0.15s ease",
                      border:
                        cell.count > 0
                          ? "1px solid rgba(255, 255, 255, 0.12)"
                          : "1px solid transparent",
                    }}
                    onMouseOver={(e) => {
                      if (!cell.future) {
                        e.currentTarget.style.transform = "scale(1.3)";
                      }
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Легенда уровней внизу */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            color: "var(--text-muted)",
            justifyContent: "flex-end",
            marginTop: "6px",
          }}
        >
          <span>{t.track.less}</span>
          {LEGEND_LEVELS.map((lvl) => (
            <div
              key={lvl}
              style={{
                width: "11px",
                height: "11px",
                backgroundColor: getCellBg(lvl),
                borderRadius: "2px",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />
          ))}
          <span>{t.track.more}</span>
        </div>

        {/* Тултип дня */}
        {hoveredCell && (
          <div
            style={{
              position: "fixed",
              left: hoveredCell.x,
              top: hoveredCell.y - 8,
              transform: "translate(-50%, -100%)",
              backgroundColor: "rgba(18, 18, 20, 0.96)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "12px",
              padding: "8px 12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              pointerEvents: "none",
              zIndex: 1000,
              fontSize: "12px",
              backdropFilter: "blur(12px)",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
              {hoveredCell.date.toLocaleDateString(locale, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div style={{ color: hoveredCell.count > 0 ? studyPalette.accentHex : "var(--text-muted)", fontWeight: 600 }}>
              {hoveredCell.count === 0
                ? t.track.noActivity
                : showProgramming
                  ? `${hoveredCell.count} ${t.track.actionsLabel} (${hoveredCell.resCount} ${t.track.materialsLabel}, ${hoveredCell.cardCount} ${t.track.reviewsLabel})`
                  : `${hoveredCell.count} ${t.track.reviewsLabel} (${studyText.name})`}
            </div>
          </div>
        )}
      </Card>

      {/* ── ДОСТИЖЕНИЯ И ВЕХИ ПРОГРЕССА (GAMIFIED MILESTONES) ── */}
      <Card
        style={{
          padding: "18px 20px",
          background: "var(--surface, #121214)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          boxSizing: "border-box",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Trophy size={16} color="#eab308" />
            <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
              {t.track.milestonesTitle}
            </h3>
          </div>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#eab308" }}>
            {milestones.filter((m) => m.unlocked).length} / {milestones.length} открыто
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "10px",
          }}
        >
          {milestones.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  backgroundColor: item.unlocked
                    ? "rgba(16, 185, 129, 0.08)"
                    : "rgba(255, 255, 255, 0.03)",
                  borderRadius: "14px",
                  border: item.unlocked
                    ? "1px solid rgba(16, 185, 129, 0.3)"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                  boxSizing: "border-box",
                  minWidth: 0,
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    backgroundColor: item.unlocked
                      ? "rgba(16, 185, 129, 0.2)"
                      : "rgba(255, 255, 255, 0.06)",
                    color: item.unlocked ? "#10b981" : "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: item.unlocked ? "0 0 12px rgba(16, 185, 129, 0.3)" : "none",
                  }}
                >
                  {item.unlocked ? <Icon size={20} /> : <Lock size={18} />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      color: item.unlocked ? "var(--text-primary)" : "var(--text-secondary)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      color: "var(--text-muted)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "1px",
                    }}
                  >
                    {item.desc}
                  </div>

                  <div
                    style={{
                      marginTop: "6px",
                      height: "4px",
                      borderRadius: "999px",
                      backgroundColor: "rgba(255, 255, 255, 0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${item.percent}%`,
                        backgroundColor: item.unlocked ? "#10b981" : item.color,
                        borderRadius: "999px",
                      }}
                    />
                  </div>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: item.unlocked ? "#10b981" : "var(--text-muted)",
                    }}
                  >
                    {item.unlocked ? "Открыто ✓" : item.progress}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
