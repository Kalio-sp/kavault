import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import {
  ArrowUpRight,
  CheckCircle2,
  BookOpen,
  Languages as LangIcon,
  Flame,
  ExternalLink,
  Plus,
  Play,
  RotateCw,
  Sparkles,
  TrendingUp,
  Circle,
  Trophy,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useAchievements } from "../context/AchievementContext";
import { api } from "../api/axios";
import {
  STARTER_DEVELOPER_RESOURCES,
  STARTER_GITHUB_REPOSITORIES,
  getStarterCardsForStudy,
  studyLanguageToPackType,
  isPackClaimed,
  markPackClaimed,
} from "../data/starterPacks";
import { getGermanArticleStyle } from "../data/studyVibes";

interface Resource {
  id: string;
  title: string;
  url: string;
  type: string;
  status: "TO_LEARN" | "LEARNING" | "COMPLETED";
  note?: string;
  createdAt: string;
}

interface JapaneseCard {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  type: string;
  language?: string;
  level: number;
  nextReview: string;
  createdAt: string;
  updatedAt: string;
}

export function Dashboard() {
  const navigate = useNavigate();
  const {
    t,
    locale,
    language,
    studyLanguage,
    showProgramming,
    studyText,
    studyPalette,
  } = useApp();
  const {
    achievements,
    unlockedCount,
    totalCount,
    earnedPoints,
    totalPoints,
    rankTitle,
    openModal,
    evaluateAchievements,
  } = useAchievements();

  const [username, setUsername] = useState(() => {
    return localStorage.getItem("kavault_username") || "";
  });
  const [resources, setResources] = useState<Resource[]>([]);
  const [cards, setCards] = useState<JapaneseCard[]>([]);
  const [streak, setStreak] = useState(0);
  const [dateStr, setDateStr] = useState("");
  const [importingPack, setImportingPack] = useState<string | null>(null);

  const activeLangPack = studyLanguageToPackType(studyLanguage);

  // Проверка: использованы ли стартовые наборы на аккаунте
  const isLangPackClaimed = useMemo(
    () => isPackClaimed(activeLangPack, cards, resources),
    [activeLangPack, cards, resources],
  );
  const isDeveloperClaimed = useMemo(
    () => isPackClaimed("developer", cards, resources),
    [cards, resources],
  );
  const isGithubClaimed = useMemo(
    () => isPackClaimed("github", cards, resources),
    [cards, resources],
  );

  const hasAnyUnclaimedPack = showProgramming
    ? !isLangPackClaimed || !isDeveloperClaimed || !isGithubClaimed
    : !isLangPackClaimed;

  /* Загрузка стартовых наборов данных */
  const handleLoadStarterPack = async (
    packType: "language" | "developer" | "github" | "all",
  ) => {
    try {
      setImportingPack(packType);
      if (packType === "language" || packType === "all") {
        const items = getStarterCardsForStudy(studyLanguage, language);
        await api.post("/japanese/bulk", { items, language: studyLanguage });
        markPackClaimed(activeLangPack);
      }
      if (showProgramming && (packType === "developer" || packType === "all")) {
        await api.post("/resources/bulk", { items: STARTER_DEVELOPER_RESOURCES });
        markPackClaimed("developer");
      }
      if (showProgramming && (packType === "github" || packType === "all")) {
        await api.post("/resources/bulk", { items: STARTER_GITHUB_REPOSITORIES });
        markPackClaimed("github");
      }
      await fetchData();
    } catch (err) {
      console.error("Ошибка загрузки стартового набора", err);
    } finally {
      setImportingPack(null);
    }
  };

  /* Получение данных */
  const fetchData = async () => {
    try {
      const [resResp, japResp, profileResp, statsResp] = await Promise.all([
        showProgramming
          ? api.get<Resource[]>("/resources").catch(() => ({ data: [] as Resource[] }))
          : Promise.resolve({ data: [] as Resource[] }),
        api
          .get<JapaneseCard[]>(`/japanese?language=${studyLanguage}`)
          .catch(() => ({ data: [] as JapaneseCard[] })),
        api.get<{ email?: string }>("/auth/profile").catch(() => ({ data: {} as { email?: string } })),
        api.get("/stats/tracker").catch(() => ({ data: null })),
      ]);

      const resData = resResp.data || [];
      const japData = japResp.data || [];
      setResources(resData);
      setCards(japData);

      let currentUsername = username;
      // Имя пользователя
      if (!username) {
        const userEmail = profileResp.data?.email;
        if (userEmail) {
          const emailName = userEmail.split("@")[0];
          const capitalized = emailName.charAt(0).toUpperCase() + emailName.slice(1);
          setUsername(capitalized);
          currentUsername = capitalized;
        } else {
          setUsername("Explorer");
          currentUsername = "Explorer";
        }
      }

      // Стрик активности
      let calculatedStreak = 0;
      if (statsResp.data?.currentStreak !== undefined) {
        setStreak(statsResp.data.currentStreak);
        calculatedStreak = statsResp.data.currentStreak;
      } else {
        // Локальный расчет стрика, если эндпоинт вернул пустоту
        const today = new Date();
        const dates = new Set<string>();
        [...resData, ...japData].forEach((item) => {
          const d = new Date(item.createdAt || (item as any).updatedAt);
          dates.add(d.toISOString().split("T")[0]);
        });
        let cur = 0;
        const cursor = new Date(today);
        const todayStr = cursor.toISOString().split("T")[0];
        if (!dates.has(todayStr)) {
          cursor.setDate(cursor.getDate() - 1);
        }
        while (dates.has(cursor.toISOString().split("T")[0])) {
          cur++;
          cursor.setDate(cursor.getDate() - 1);
        }
        setStreak(cur);
        calculatedStreak = cur;
      }

      // Проверка ачивок при загрузке реальных данных дашборда
      evaluateAchievements({
        resources: resData,
        cards: japData,
        streak: calculatedStreak,
        username: currentUsername,
        userEmail: profileResp.data?.email,
      });
    } catch (err) {
      console.error("Ошибка загрузки данных дашборда", err);
    }
  };

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    setDateStr(new Date().toLocaleDateString(locale, options));
  }, [locale]);

  useEffect(() => {
    fetchData();
  }, [studyLanguage, showProgramming]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    window.dispatchEvent(new Event("kavault-auth-changed"));
    navigate("/login");
  };

  /* Аналитика и расчет метрик */
  const metrics = useMemo(() => {
    const now = new Date();

    // Карточки, готовые к повторению
    const dueCards = cards.filter((c) => new Date(c.nextReview) <= now);

    // Добавлено за последние 7 дней
    const weekAgo = new Date();
    weekAgo.setDate(now.getDate() - 7);

    const visibleResources = showProgramming ? resources : [];

    const recentResources = visibleResources.filter(
      (r) => new Date(r.createdAt) >= weekAgo,
    ).length;

    const recentCards = cards.filter(
      (c) => new Date(c.createdAt) >= weekAgo,
    ).length;

    // Выученные слова (уровень >= 2)
    const masteredWords = cards.filter((c) => c.level >= 2).length;

    // Прогресс по материалам
    const completedResources = visibleResources.filter(
      (r) => r.status === "COMPLETED",
    ).length;

    // Общий процент освоения (Materials completed + Cards mastered)
    const totalItems = visibleResources.length + cards.length;
    const completedItems = completedResources + masteredWords;
    const progressPercent =
      totalItems > 0 ? Math.min(100, Math.round((completedItems / totalItems) * 100)) : 0;

    // Задачи на сегодня
    const pendingResources = visibleResources
      .filter((r) => r.status !== "COMPLETED")
      .slice(0, 3);

    return {
      totalResources: visibleResources.length,
      recentResources,
      totalCards: cards.length,
      recentCards,
      dueCardsCount: dueCards.length,
      masteredWords,
      progressPercent,
      pendingResources,
    };
  }, [resources, cards, showProgramming]);

  // Быстрое переключение статуса ресурса
  const handleToggleResourceStatus = async (resource: Resource) => {
    const newStatus =
      resource.status === "COMPLETED" ? "LEARNING" : "COMPLETED";
    try {
      await api.patch(`/resources/${resource.id}/note`, {
        // обновляем локально для мгновенной обратной связи
      });
      // Обновляем список ресурсов
      setResources((prev) =>
        prev.map((r) => (r.id === resource.id ? { ...r, status: newStatus } : r)),
      );
    } catch (e) {
      console.error(e);
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
      {/* Верхний Header с культурным вайбом */}
      <div
        style={{
          position: "relative",
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
        }}
      >
        <div
          style={{
            position: "absolute",
            right: "18px",
            top: "-6px",
            fontSize: "78px",
            fontWeight: 800,
            opacity: 0.06,
            pointerEvents: "none",
            userSelect: "none",
            color: studyPalette.accentHex,
            lineHeight: 1,
          }}
        >
          {studyPalette.watermark}
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
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
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            <span>{studyPalette.flag}</span>
            <span>{studyText.vibeBadge}</span>
          </div>
          <h2
            style={{
              fontSize: "30px",
              fontWeight: 600,
              margin: "0 0 var(--space-2) 0",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {t.dash.goodMorning}, {username || t.dash.friend}!
            <Sparkles size={24} color={studyPalette.accentHex} />
          </h2>
          <p style={{ color: "var(--text-secondary)", margin: "0 0 4px 0", fontSize: "15px" }}>
            {studyText.vibeQuote}
          </p>
          <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "13px" }}>
            {t.dash.subtitle}
          </p>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            gap: "var(--space-4)",
            alignItems: "center",
          }}
        >
          <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
            {dateStr}
          </span>
          <Button variant="secondary" onClick={handleLogout}>
            {t.dash.logout}
          </Button>
        </div>
      </div>

      {/* KPI Метрики (Реальные данные) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {/* Карточка 1: Ресурсы (если вкл. программирование) ИЛИ Освоение языка */}
        {showProgramming ? (
          <Card
            style={{
              padding: "var(--space-5)",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onClick={() => navigate("/developer")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                <BookOpen size={16} color="var(--accent)" /> {t.dash.resources}
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </div>
            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              {metrics.totalResources}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--success)",
                fontSize: "13px",
              }}
            >
              <TrendingUp size={14} /> +{metrics.recentResources} {t.dash.addedWeekSuffix}
            </div>
          </Card>
        ) : (
          <Card
            style={{
              padding: "var(--space-5)",
              cursor: "pointer",
              transition: "transform 0.2s ease, border-color 0.2s ease",
            }}
            onClick={() => navigate("/tracker")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = studyPalette.secondaryHex;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "var(--space-3)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                <TrendingUp size={16} color={studyPalette.secondaryHex} /> {t.dash.progress}
              </div>
              <ArrowUpRight size={16} color="var(--text-muted)" />
            </div>
            <div
              style={{
                fontSize: "34px",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: "6px",
              }}
            >
              {metrics.progressPercent}%
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: "var(--success)",
                fontSize: "13px",
              }}
            >
              <TrendingUp size={14} /> +{metrics.recentCards} {t.dash.addedWeekSuffix}
            </div>
          </Card>
        )}

        {/* Карточка 2: Слова выбранного языка */}
        <Card
          style={{
            padding: "var(--space-5)",
            cursor: "pointer",
            transition: "transform 0.2s ease, border-color 0.2s ease",
          }}
          onClick={() => navigate("/japanese")}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = studyPalette.accentHex;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              <LangIcon size={16} color={studyPalette.accentHex} /> {studyText.dashWordsCardTitle}
            </div>
            <ArrowUpRight size={16} color="var(--text-muted)" />
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            {metrics.totalCards}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--success)",
              fontSize: "13px",
            }}
          >
            <TrendingUp size={14} /> {metrics.masteredWords} {t.dash.masteredSuffix}
          </div>
        </Card>

        {/* Карточка 3: Повторение SRS карточек */}
        <Card
          style={{
            padding: "var(--space-5)",
            cursor: "pointer",
            transition: "transform 0.2s ease, border-color 0.2s ease",
            borderColor: metrics.dueCardsCount > 0 ? "var(--vibe-banner-border)" : "var(--border)",
            backgroundColor:
              metrics.dueCardsCount > 0 ? "var(--vibe-soft)" : "var(--surface)",
          }}
          onClick={() => navigate("/review")}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              <RotateCw size={16} color={studyPalette.accentHex} /> {t.dash.dueTodayTitle}
            </div>
            <Badge variant={metrics.dueCardsCount > 0 ? "accent" : "default"}>
              {metrics.dueCardsCount > 0 ? t.dash.dueBadge : t.dash.clearBadge}
            </Badge>
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            {metrics.dueCardsCount}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color:
                metrics.dueCardsCount > 0 ? "var(--accent)" : "var(--text-muted)",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {metrics.dueCardsCount > 0
              ? t.dash.tapToStartReview
              : t.dash.allWordsReviewed}
          </div>
        </Card>

        {/* Карточка 4: Стрик обучения */}
        <Card
          style={{
            padding: "var(--space-5)",
            cursor: "pointer",
            transition: "transform 0.2s ease, border-color 0.2s ease",
          }}
          onClick={() => navigate("/tracker")}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#f59e0b";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-3)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: "var(--text-secondary)",
                fontSize: "14px",
              }}
            >
              <Flame size={16} color="#f59e0b" /> {t.track.streak}
            </div>
            <ArrowUpRight size={16} color="var(--text-muted)" />
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: "6px",
            }}
          >
            {streak} <span style={{ fontSize: "16px", fontWeight: 400 }}>{t.dash.daysUnit}</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              color: "#f59e0b",
              fontSize: "13px",
            }}
          >
            {streak > 0 ? t.dash.streakActiveHint : t.dash.streakZeroHint}
          </div>
        </Card>
      </div>

      {/* ── ВИДЖЕТ ДОСТИЖЕНИЙ KAVAULT ── */}
      <Card
        style={{
          padding: "var(--space-6)",
          background: "linear-gradient(135deg, rgba(234, 179, 8, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)",
          border: "1px solid rgba(234, 179, 8, 0.25)",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                backgroundColor: "rgba(234, 179, 8, 0.15)",
                border: "1px solid rgba(234, 179, 8, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f59e0b",
                fontSize: "22px",
              }}
            >
              🏆
            </div>
            <div>
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                {t.dash.achievementsRankTitle}
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(234, 179, 8, 0.15)",
                    color: "#eab308",
                    border: "1px solid rgba(234, 179, 8, 0.3)",
                  }}
                >
                  {rankTitle}
                </span>
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                {t.dash.earnedPrefix} <span style={{ color: "#eab308", fontWeight: 700 }}>{earnedPoints} XP</span> {t.dash.ofText} {totalPoints} XP
              </div>
            </div>
          </div>

          <Button
            variant="secondary"
            onClick={openModal}
            style={{
              borderColor: "rgba(234, 179, 8, 0.3)",
              color: "#eab308",
              gap: "8px",
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              padding: "8px 16px",
            }}
          >
            <Trophy size={15} /> {t.dash.openHall} ({unlockedCount}/{totalCount})
          </Button>
        </div>

        {/* Прогресс-бар и превью ачивок */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              <span>{t.dash.unlockProgress} ({unlockedCount} / {totalCount})</span>
              <span>{Math.round((unlockedCount / totalCount) * 100) || 0}%</span>
            </div>
            <div
              style={{
                height: "8px",
                borderRadius: "999px",
                backgroundColor: "var(--surface-raised)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${Math.round((unlockedCount / totalCount) * 100) || 0}%`,
                  background: "linear-gradient(90deg, #f59e0b 0%, #3b82f6 100%)",
                  borderRadius: "999px",
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>

          {/* Быстрые плашки последних достижений */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginTop: "4px",
            }}
          >
            {achievements
              .filter((a) => a.unlocked)
              .slice(0, 5)
              .map((ach) => (
                <div
                  key={ach.id}
                  onClick={openModal}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    borderRadius: "8px",
                    backgroundColor: "var(--surface)",
                    border: ach.isSecret ? "1px solid #eab308" : "1px solid var(--border)",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: ach.isSecret ? "#d97706" : "var(--text-primary)",
                    cursor: "pointer",
                  }}
                  title={ach.description}
                >
                  <span>{ach.icon}</span>
                  <span>{ach.title}</span>
                </div>
              ))}
            {unlockedCount === 0 && (
              <div style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>
                {t.dash.emptyAchHint}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Блок быстрого старта (Starter Packs) — отображается только если на аккаунте ещё не использованы наборы */}
      {hasAnyUnclaimedPack && (
        <Card
          style={{
            padding: "var(--space-6)",
            background: "var(--vibe-banner-bg)",
            border: "1px solid var(--vibe-banner-border)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "var(--vibe-soft)",
                  color: studyPalette.accentHex,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Sparkles size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {t.dash.starterTitle}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)" }}>
                  {t.dash.starterDesc}
                </p>
              </div>
            </div>
            <Badge variant="accent">{studyPalette.flag} {studyText.name}</Badge>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {/* Стартовый набор выбранного языка */}
            {!isLangPackClaimed && (
              <Button
                variant="secondary"
                onClick={() => handleLoadStarterPack("language")}
                disabled={importingPack !== null}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  height: "auto",
                  textAlign: "left",
                  gap: "4px",
                  borderColor: "var(--vibe-banner-border)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                  {studyPalette.flag} {studyText.starterTitle}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {importingPack === "language" ? t.common.importing : studyText.starterDesc}
                </div>
              </Button>
            )}

            {/* База разработчика */}
            {showProgramming && !isDeveloperClaimed && (
              <Button
                variant="secondary"
                onClick={() => handleLoadStarterPack("developer")}
                disabled={importingPack !== null}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  height: "auto",
                  textAlign: "left",
                  gap: "4px",
                  borderColor: "rgba(168, 85, 247, 0.3)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                  {t.dash.starterDevTitle}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {importingPack === "developer" ? t.common.importing : t.dash.starterDevDesc}
                </div>
              </Button>
            )}

            {/* GitHub закладки */}
            {showProgramming && !isGithubClaimed && (
              <Button
                variant="secondary"
                onClick={() => handleLoadStarterPack("github")}
                disabled={importingPack !== null}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  height: "auto",
                  textAlign: "left",
                  gap: "4px",
                  borderColor: "rgba(245, 158, 11, 0.3)",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "14px", color: "var(--text-primary)" }}>
                  {t.dash.starterGitTitle}
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {importingPack === "github" ? t.common.importing : t.dash.starterGitDesc}
                </div>
              </Button>
            )}

            {/* Всё сразу */}
            {showProgramming && !isLangPackClaimed && !isDeveloperClaimed && !isGithubClaimed && (
              <Button
                onClick={() => handleLoadStarterPack("all")}
                disabled={importingPack !== null}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  height: "auto",
                  textAlign: "left",
                  gap: "4px",
                  background: `linear-gradient(135deg, ${studyPalette.accentHex} 0%, ${studyPalette.secondaryHex} 100%)`,
                  color: "#fff",
                }}
              >
                <div style={{ fontWeight: 700, fontSize: "14px" }}>
                  {t.dash.starterAllTitle}
                </div>
                <div style={{ fontSize: "12px", opacity: 0.9 }}>
                  {importingPack === "all" ? t.dash.loadingAll : t.dash.starterAllDesc}
                </div>
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Основная часть: Прогресс + Задачи на сегодня */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "var(--space-4)",
        }}
      >
        {/* Реальный Donut Chart Прогресса */}
        <Card
          style={{
            padding: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-6)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
              {t.dash.progress}
            </h3>
            <Badge variant="default">
              {showProgramming ? metrics.totalResources + metrics.totalCards : metrics.totalCards}{" "}
              {t.dash.vaultItemsSuffix}
            </Badge>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-8)",
              flex: 1,
              flexWrap: "wrap",
            }}
          >
            {/* Анимированный SVG Donut */}
            <div style={{ position: "relative", width: "130px", height: "130px" }}>
              <svg width="130" height="130" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="var(--surface-raised)"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={studyPalette.accentHex}
                  strokeWidth="12"
                  strokeDasharray="251.2"
                  strokeDashoffset={
                    251.2 - (251.2 * (metrics.progressPercent || 0)) / 100
                  }
                  strokeLinecap="round"
                  fill="none"
                  transform="rotate(-90 50 50)"
                  style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
              </svg>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {metrics.progressPercent}%
              </div>
            </div>

            <div style={{ flex: 1, minWidth: "200px" }}>
              <h4
                style={{
                  fontSize: "17px",
                  margin: "0 0 8px 0",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                }}
              >
                {metrics.progressPercent >= 70
                  ? t.dash.greatDynamic
                  : metrics.progressPercent > 0
                    ? t.dash.keepGoing
                    : t.dash.welcomeTitle}
              </h4>
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: "1.5",
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                }}
              >
                {showProgramming
                  ? metrics.totalResources === 0 && metrics.totalCards === 0
                    ? t.dash.emptyVaultDesc
                    : `${t.dash.progressSummaryPrefix} ${metrics.masteredWords} ${t.dash.progressSummaryMid}`
                  : metrics.totalCards === 0
                    ? studyText.section1.emptyText
                    : `${metrics.masteredWords} / ${metrics.totalCards} ${studyText.wordsUnit} (${t.dash.masteredSuffix})`}
              </p>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <Button
                  variant="secondary"
                  onClick={() => navigate("/graph")}
                  style={{ fontSize: "13px", padding: "6px 12px" }}
                >
                  {t.dash.openGraph}
                </Button>
                <Button
                  onClick={() => navigate(showProgramming ? "/developer" : "/japanese")}
                  style={{ fontSize: "13px", padding: "6px 12px" }}
                >
                  {showProgramming ? t.dash.addMaterial : studyText.hubTitle}
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Реальные Задачи на сегодня */}
        <Card
          style={{
            padding: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-5)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 600 }}>
              {t.dash.tasks}
            </h3>
            <Badge
              variant={
                metrics.dueCardsCount === 0 && metrics.pendingResources.length === 0
                  ? "accent"
                  : "default"
              }
            >
              {metrics.dueCardsCount === 0 && metrics.pendingResources.length === 0
                ? t.dash.allDone
                : t.dash.inProgress}
            </Badge>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-3)",
              flex: 1,
            }}
          >
            {/* Задача 1: Повторение карточек */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 12px",
                backgroundColor: "var(--surface-raised)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {metrics.dueCardsCount === 0 ? (
                  <CheckCircle2 size={18} color="var(--success)" />
                ) : (
                  <Circle size={18} color="var(--accent)" />
                )}
                <div>
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      textDecoration:
                        metrics.dueCardsCount === 0 ? "line-through" : "none",
                    }}
                  >
                    {studyText.dashReviewTaskTitle} ({metrics.dueCardsCount})
                  </div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {t.dash.srsLabel}
                  </div>
                </div>
              </div>

              {metrics.dueCardsCount > 0 && (
                <Button
                  style={{ padding: "4px 10px", fontSize: "12px" }}
                  onClick={() => navigate("/review")}
                >
                  <Play size={12} /> {t.dash.startBtn}
                </Button>
              )}
            </div>

            {/* Задачи из реальных ресурсов */}
            {showProgramming &&
              metrics.pendingResources.map((res) => (
                <div
                  key={res.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 12px",
                    backgroundColor: "var(--surface-raised)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      overflow: "hidden",
                    }}
                  >
                    <Circle
                      size={18}
                      color="var(--text-muted)"
                      style={{ flexShrink: 0, cursor: "pointer" }}
                      onClick={() => handleToggleResourceStatus(res)}
                    />
                    <div style={{ overflow: "hidden" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {res.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {res.type}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => window.open(res.url, "_blank")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      padding: "4px",
                    }}
                    title={t.common.open}
                  >
                    <ExternalLink size={15} />
                  </button>
                </div>
              ))}

            {metrics.pendingResources.length === 0 && metrics.dueCardsCount === 0 && (
              <div
                style={{
                  textAlign: "center",
                  padding: "var(--space-6) 0",
                  color: "var(--text-muted)",
                  fontSize: "14px",
                }}
              >
                {t.dash.todayAllDoneMsg}
              </div>
            )}
          </div>

          <Button
            style={{ width: "100%", marginTop: "var(--space-4)" }}
            onClick={() =>
              metrics.dueCardsCount > 0
                ? navigate("/review")
                : navigate(showProgramming ? "/developer" : "/japanese")
            }
          >
            {metrics.dueCardsCount > 0
              ? t.dash.startReviewCta
              : showProgramming
                ? t.dash.continue
                : studyText.hubTitle}
          </Button>
        </Card>
      </div>

      {/* Секция: Недавно добавленные материалы или карточки языка (Quick Access) */}
      {showProgramming ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-4)",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                margin: 0,
                color: "var(--text-primary)",
              }}
            >
              {t.dash.recentMaterials}
            </h3>
            <Button
              variant="ghost"
              onClick={() => navigate("/developer")}
              style={{ fontSize: "13px" }}
            >
              {t.dash.allMaterials} ({resources.length}) →
            </Button>
          </div>

          {resources.length === 0 ? (
            <Card
              style={{
                padding: "var(--space-8)",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              <BookOpen size={32} style={{ marginBottom: "12px", opacity: 0.5 }} />
              <p style={{ margin: "0 0 12px 0", fontSize: "15px" }}>
                {t.dash.noMaterialsYet}
              </p>
              <Button onClick={() => navigate("/developer")}>
                <Plus size={16} /> {t.dash.addFirstMaterial}
              </Button>
            </Card>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {resources.slice(0, 4).map((item) => (
                <Card
                  key={item.id}
                  style={{
                    padding: "var(--space-4)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "var(--space-2)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Badge variant="default">{item.type}</Badge>
                    <button
                      onClick={() => window.open(item.url, "_blank")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                      }}
                      title={t.common.open}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>

                  <h4
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      margin: "4px 0",
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </h4>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "auto",
                      paddingTop: "6px",
                      fontSize: "12px",
                      color: "var(--text-muted)",
                    }}
                  >
                    <span>
                      {new Date(item.createdAt).toLocaleDateString(locale, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span
                      style={{
                        color:
                          item.status === "COMPLETED"
                            ? "var(--success)"
                            : "var(--text-secondary)",
                      }}
                    >
                      {t.dash.statusLabels[item.status] || item.status.replace("_", " ")}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "var(--space-4)",
            }}
          >
            <h3
              style={{
                fontSize: "18px",
                fontWeight: 600,
                margin: 0,
                color: "var(--text-primary)",
              }}
            >
              {studyPalette.flag} {studyText.hubTitle}
            </h3>
            <Button
              variant="ghost"
              onClick={() => navigate("/japanese")}
              style={{ fontSize: "13px" }}
            >
              {studyText.navLabel} ({cards.length}) →
            </Button>
          </div>

          {cards.length === 0 ? (
            <Card
              style={{
                padding: "var(--space-8)",
                textAlign: "center",
                color: "var(--text-muted)",
              }}
            >
              <LangIcon size={32} style={{ marginBottom: "12px", opacity: 0.5 }} />
              <p style={{ margin: "0 0 12px 0", fontSize: "15px" }}>
                {studyText.section1.emptyText}
              </p>
              <Button onClick={() => navigate("/japanese")}>
                <Plus size={16} /> {studyText.section1.addTitle}
              </Button>
            </Card>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: "var(--space-4)",
              }}
            >
              {cards.slice(0, 4).map((card) => {
                const deArt = studyLanguage === "de" ? getGermanArticleStyle(card.word) : null;
                return (
                  <Card
                    key={card.id}
                    onClick={() => navigate("/japanese")}
                    style={{
                      padding: "var(--space-4)",
                      display: "flex",
                      flexDirection: "column",
                      gap: "var(--space-2)",
                      cursor: "pointer",
                      borderColor: deArt?.article ? `${deArt.color}33` : "var(--border)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Badge variant="default">
                        {card.type === studyText.section2.id
                          ? studyText.section2.cardBadge
                          : studyText.section1.cardBadge}
                      </Badge>
                      {deArt?.article && (
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            backgroundColor: deArt.bg,
                            color: deArt.color,
                          }}
                        >
                          {deArt.article}
                        </span>
                      )}
                    </div>

                    <h4
                      style={{
                        fontSize: "17px",
                        fontWeight: 700,
                        margin: "4px 0 2px",
                        color: "var(--text-primary)",
                      }}
                    >
                      {card.word}
                    </h4>

                    {card.reading && (
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                        {card.reading}
                      </div>
                    )}

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "auto",
                        paddingTop: "6px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <span>{card.meaning}</span>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--vibe-accent)",
                          fontWeight: 600,
                        }}
                      >
                        {studyText.levelPrefix} {card.level}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
