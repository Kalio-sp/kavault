import { useState, useEffect, useRef, useMemo } from "react";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Flame,
  Trophy,
  Target,
  Sparkles,
  Calendar,
  Zap,
  Award,
  Lock,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

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
  if (count === 0) return "var(--surface-raised)";
  if (count <= 1)
    return "color-mix(in srgb, var(--vibe-accent) 30%, var(--surface-raised))";
  if (count <= 3)
    return "color-mix(in srgb, var(--vibe-accent) 55%, var(--surface-raised))";
  if (count <= 6)
    return "color-mix(in srgb, var(--vibe-accent) 80%, var(--surface-raised))";
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
  const navigate = useNavigate();

  const goalResources = useMemo(
    () => readGoal("kavault_goal_resources", 5),
    [],
  );
  const goalCards = useMemo(() => readGoal("kavault_goal_cards", 50), []);

  const [resources, setResources] = useState<ActivityItem[]>([]);
  const [cards, setCards] = useState<ActivityItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("6m");

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

  // Автоскролл вправо при первой загрузке
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

    // Сетка: дни с понедельника
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
    };
  }, [resources, cards, weeksCount, locale]);

  /* Список достижений (Gamified Milestones) */
  const achievements = useMemo(() => {
    const base = [
      {
        id: "first_step",
        title: t.track.milestones.first_step.title,
        desc: t.track.milestones.first_step.desc,
        icon: Sparkles,
        unlocked: totalContributions >= 1,
        progress: `${Math.min(totalContributions, 1)} / 1`,
      },
      {
        id: "streak_3",
        title: t.track.milestones.streak_3.title,
        desc: t.track.milestones.streak_3.desc,
        icon: Flame,
        unlocked: currentStreak >= 3 || longestStreak >= 3,
        progress: `${Math.min(currentStreak, 3)} / 3 ${t.track.days}`,
      },
      {
        id: "week_streak",
        title: t.track.milestones.week_streak.title,
        desc: t.track.milestones.week_streak.desc,
        icon: Trophy,
        unlocked: currentStreak >= 7 || longestStreak >= 7,
        progress: `${Math.min(currentStreak, 7)} / 7 ${t.track.days}`,
      },
      {
        id: "words_25",
        title: studyText.trackerMilestoneTitle,
        desc: studyText.trackerMilestoneDesc,
        icon: Award,
        unlocked: cards.length >= 25,
        progress: `${cards.length} / 25`,
      },
    ];

    if (showProgramming) {
      base.push({
        id: "collector",
        title: t.track.milestones.collector.title,
        desc: t.track.milestones.collector.desc,
        icon: Zap,
        unlocked: resources.length >= 15,
        progress: `${resources.length} / 15`,
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
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      {/* Заголовок */}
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
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span>{studyPalette.flag}</span>
            <span>{t.track.title}</span>
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            {t.track.subtitle} · {studyText.name}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Badge variant="accent">
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Zap size={14} /> {totalContributions} {t.track.totalActionsSuffix}
            </span>
          </Badge>
        </div>
      </div>

      {/* KPI карточки сверху */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        <Card style={{ padding: "var(--space-5)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              fontSize: "13px",
              marginBottom: "var(--space-2)",
            }}
          >
            <Flame size={16} color="#f59e0b" /> {t.track.streak}
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)" }}>
            {currentStreak} <span style={{ fontSize: "16px", fontWeight: 400 }}>{t.track.days}</span>
          </div>
          <div style={{ fontSize: "12px", color: "#f59e0b", marginTop: "4px" }}>
            {todayCount > 0 ? t.track.todayLogged : t.track.todayReminder}
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              fontSize: "13px",
              marginBottom: "var(--space-2)",
            }}
          >
            <Trophy size={16} color={studyPalette.accentHex} /> {t.track.bestRecord}
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)" }}>
            {longestStreak} <span style={{ fontSize: "16px", fontWeight: 400 }}>{t.track.days}</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "4px" }}>
            {t.track.bestRecordDesc}
          </div>
        </Card>

        <Card style={{ padding: "var(--space-5)" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-secondary)",
              fontSize: "13px",
              marginBottom: "var(--space-2)",
            }}
          >
            <Calendar size={16} color="var(--success)" /> {t.track.thisWeekActions}
          </div>
          <div style={{ fontSize: "32px", fontWeight: 700, color: "var(--text-primary)" }}>
            {weeklyStats.resources + weeklyStats.cards}
          </div>
          <div style={{ fontSize: "12px", color: "var(--success)", marginTop: "4px" }}>
            {showProgramming
              ? `+${weeklyStats.resources} ${t.track.materialsLabel}, +${weeklyStats.cards} ${t.track.reviewsLabel}`
              : `+${weeklyStats.cards} ${t.track.reviewsLabel} (${studyText.name})`}
          </div>
        </Card>
      </div>

      {/* Основная карточка: Хитмап активности */}
      <Card style={{ padding: "var(--space-6)", position: "relative" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-5)",
            flexWrap: "wrap",
            gap: "var(--space-3)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
              {t.track.heatmap}
            </h3>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              ({totalContributions} {t.track.allTimeSuffix})
            </span>
          </div>

          {/* Переключатель диапазона: 3 мес, 6 мес, год */}
          <div style={{ display: "flex", gap: "4px" }}>
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
                  fontSize: "12px",
                  borderRadius: "var(--radius-md)",
                  border: timeRange === r.id ? "1px solid var(--accent)" : "1px solid var(--border)",
                  backgroundColor: timeRange === r.id ? "var(--surface-raised)" : "transparent",
                  color: timeRange === r.id ? "var(--accent)" : "var(--text-muted)",
                  cursor: "pointer",
                  fontWeight: timeRange === r.id ? 600 : 400,
                  transition: "all 0.15s ease",
                }}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Область сетки хитмапа */}
        <div
          ref={scrollRef}
          style={{
            overflowX: "auto",
            paddingBottom: "8px",
          }}
        >
          <div style={{ minWidth: `${weeksCount * 16 + 32}px`, display: "flex", gap: "8px" }}>
            {/* Подписи дней недели слева (Пн, Ср, Пт) */}
            <div
              style={{
                display: "grid",
                gridTemplateRows: "repeat(7, 13px)",
                rowGap: "4px",
                marginTop: "20px",
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
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                {monthLabels.map(({ col, label }) => (
                  <span key={col} style={{ gridColumn: col + 1, whiteSpace: "nowrap" }}>
                    {label}
                  </span>
                ))}
              </div>

              {/* Ячейки: 7 строк на кол-во недель */}
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
                      borderRadius: "2px",
                      backgroundColor: getCellBg(cell.count),
                      visibility: cell.future ? "hidden" : "visible",
                      cursor: cell.future ? "default" : "pointer",
                      transition: "transform 0.15s ease",
                      border:
                        cell.count > 0
                          ? "1px solid var(--border)"
                          : "1px solid transparent",
                    }}
                    onMouseOver={(e) => {
                      if (!cell.future) {
                        e.currentTarget.style.transform = "scale(1.25)";
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
            gap: "8px",
            fontSize: "12px",
            color: "var(--text-muted)",
            justifyContent: "flex-end",
            marginTop: "16px",
          }}
        >
          <span>{t.track.less}</span>
          {LEGEND_LEVELS.map((lvl) => (
            <div
              key={lvl}
              style={{
                width: "12px",
                height: "12px",
                backgroundColor: getCellBg(lvl),
                borderRadius: "2px",
                border: "1px solid var(--border)",
              }}
            />
          ))}
          <span>{t.track.more}</span>
        </div>

        {/* Плавающий тултип ячейки */}
        {hoveredCell && (
          <div
            style={{
              position: "fixed",
              left: hoveredCell.x,
              top: hoveredCell.y - 8,
              transform: "translate(-50%, -100%)",
              backgroundColor: "var(--tooltip-bg)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "8px 12px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
              pointerEvents: "none",
              zIndex: 1000,
              fontSize: "12px",
              backdropFilter: "blur(6px)",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
              {hoveredCell.date.toLocaleDateString(locale, {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
            <div style={{ color: hoveredCell.count > 0 ? studyPalette.accentHex : "var(--text-muted)" }}>
              {hoveredCell.count === 0
                ? t.track.noActivity
                : showProgramming
                  ? `${hoveredCell.count} ${t.track.actionsLabel} (${hoveredCell.resCount} ${t.track.materialsLabel}, ${hoveredCell.cardCount} ${t.track.reviewsLabel})`
                  : `${hoveredCell.count} ${t.track.reviewsLabel} (${studyText.name})`}
            </div>
          </div>
        )}
      </Card>

      {/* Нижний ряд: Недельные цели + Достижения (Ачивки) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "var(--space-6)",
        }}
      >
        {/* Недельные цели с прогресс-барами */}
        <Card style={{ padding: "var(--space-6)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-5)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: "16px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 600,
              }}
            >
              <Target size={18} color={studyPalette.accentHex} /> {t.track.goals}
            </h3>
            <button
              onClick={() => navigate("/settings")}
              style={{
                background: "none",
                border: "none",
                color: studyPalette.accentHex,
                cursor: "pointer",
                fontSize: "12px",
                padding: 0,
              }}
            >
              {t.track.editGoals} →
            </button>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}
          >
            {/* Статьи (только при включённом программировании) */}
            {showProgramming && (
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    fontSize: "14px",
                  }}
                >
                  <span style={{ color: "var(--text-secondary)" }}>
                    {t.track.artGoals}
                  </span>
                  <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                    {weeklyStats.resources} / {goalResources}
                  </span>
                </div>
                <div
                  style={{
                    height: "8px",
                    backgroundColor: "var(--surface-raised)",
                    borderRadius: "4px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.min(
                        (weeklyStats.resources / goalResources) * 100,
                        100,
                      )}%`,
                      height: "100%",
                      backgroundColor: "var(--accent)",
                      borderRadius: "4px",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Карточки изучаемого языка */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  fontSize: "14px",
                }}
              >
                <span style={{ color: "var(--text-secondary)" }}>
                  {studyPalette.flag} {studyText.trackerGoalLabel}
                </span>
                <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>
                  {weeklyStats.cards} / {goalCards}
                </span>
              </div>
              <div
                style={{
                  height: "8px",
                  backgroundColor: "var(--surface-raised)",
                  borderRadius: "4px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      (weeklyStats.cards / goalCards) * 100,
                      100,
                    )}%`,
                    height: "100%",
                    backgroundColor: studyPalette.accentHex,
                    borderRadius: "4px",
                    transition: "width 0.5s ease",
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Коллекция достижений (Milestones & Badges) */}
        <Card style={{ padding: "var(--space-6)" }}>
          <h3
            style={{
              margin: "0 0 var(--space-4) 0",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: 600,
            }}
          >
            <Trophy size={18} color="var(--accent)" /> {t.track.milestonesTitle}
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
            }}
          >
            {achievements.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    backgroundColor: "var(--surface-raised)",
                    borderRadius: "var(--radius-md)",
                    border: item.unlocked
                      ? "1px solid rgba(16, 185, 129, 0.3)"
                      : "1px solid var(--border)",
                    opacity: item.unlocked ? 1 : 0.6,
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        backgroundColor: item.unlocked
                          ? "rgba(16, 185, 129, 0.15)"
                          : "var(--surface)",
                        color: item.unlocked ? "var(--success)" : "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {item.unlocked ? <Icon size={18} /> : <Lock size={16} />}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 600,
                          color: "var(--text-primary)",
                        }}
                      >
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: "12px", fontWeight: 500, color: item.unlocked ? "var(--success)" : "var(--text-muted)" }}>
                    {item.unlocked ? t.track.unlockedBadge : item.progress}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
