import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  ACHIEVEMENTS,
  checkIsMrA,
  localizeAchievement,
} from "../data/achievements";
import type { Achievement } from "../data/achievements";
import { useApp } from "./AppContext";
import { api } from "../api/axios";

export interface AchievementItem extends Achievement {
  unlocked: boolean;
  unlockedAt?: string;
}

interface EvaluationData {
  resources?: any[];
  cards?: any[];
  streak?: number;
  username?: string;
  userEmail?: string;
  themeSwitched?: boolean;
  goalsConfigured?: boolean;
}

interface AchievementContextType {
  achievements: AchievementItem[];
  unlockedCount: number;
  totalCount: number;
  totalPoints: number;
  earnedPoints: number;
  rankTitle: string;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  newlyUnlocked: Achievement | null;
  dismissToast: () => void;
  evaluateAchievements: (data?: EvaluationData) => void;
  trackPageVisit: (pathname: string) => void;
  incrementReviewCount: (count?: number) => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(
  undefined,
);

const LEGACY_STORAGE_KEY = "kavault_unlocked_achievements";

function getUserKeyFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const part = token.split(".")[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return payload.sub || payload.email || null;
  } catch {
    return null;
  }
}

// Проигрывание приятного звука победы через Web Audio API
function playChimeSound() {
  if (typeof window === "undefined") return;
  const soundEnabled = localStorage.getItem("kavault_sound_fx") !== "false";
  if (!soundEnabled) return;

  try {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (мажорный победный аккорд)
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(
        0.18,
        ctx.currentTime + index * 0.08 + 0.02,
      );
      gain.gain.exponentialRampToValueAtTime(
        0.0001,
        ctx.currentTime + index * 0.08 + 0.45,
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.5);
    });
  } catch {
    // игнорируем ошибку автовоспроизведения браузера
  }
}

export function AchievementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language, t } = useApp();

  const initialToken =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const initialUserKey = getUserKeyFromToken(initialToken);

  const [unlockedMap, setUnlockedMap] = useState<
    Record<string, { unlockedAt: string }>
  >(() => {
    if (!initialUserKey) return {};
    try {
      const raw = localStorage.getItem(
        `kavault_unlocked_achievements_${initialUserKey}`,
      );
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const unlockedMapRef = useRef<Record<string, { unlockedAt: string }>>(
    unlockedMap,
  );
  const serverLoadedRef = useRef<boolean>(false);
  const activeUserKeyRef = useRef<string | null>(initialUserKey);
  const pendingEvalRef = useRef<EvaluationData | null>(null);
  const pendingVisitsRef = useRef<string[]>([]);

  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Закрытие тоста
  const dismissToast = useCallback(() => {
    setToastQueue((prev) => prev.slice(1));
  }, []);

  // Автозакрытие тоста через 5.5 секунд
  useEffect(() => {
    if (toastQueue.length === 0) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 5500);
    return () => clearTimeout(timer);
  }, [toastQueue, dismissToast]);

  // Атомарная пакетная разблокировка (без перезаписи в замыкании React)
  const unlockAchievementsBatch = useCallback(
    (ids: string[], options?: { silent?: boolean }) => {
      if (ids.length === 0) return;

      const now = new Date().toISOString();
      const nextMap = { ...unlockedMapRef.current };
      const newlyAdded: Achievement[] = [];

      for (const id of ids) {
        if (nextMap[id]) continue;
        const ach = ACHIEVEMENTS.find((a) => a.id === id);
        if (!ach) continue;
        nextMap[id] = { unlockedAt: now };
        newlyAdded.push(ach);
      }

      if (newlyAdded.length === 0) return;

      unlockedMapRef.current = nextMap;
      setUnlockedMap(nextMap);

      const uKey = activeUserKeyRef.current;
      if (uKey) {
        try {
          localStorage.setItem(
            `kavault_unlocked_achievements_${uKey}`,
            JSON.stringify(nextMap),
          );
        } catch {
          // ignore storage quota errors
        }
      }

      const token = localStorage.getItem("access_token");
      if (token) {
        api
          .post("/auth/achievements/unlock", {
            ids: newlyAdded.map((a) => a.id),
          })
          .catch(() => {
            // если нет сети, локальный кэш сохранит достижение для текущей сессии
          });
      }

      if (!options?.silent) {
        setToastQueue((prev) => [...prev, ...newlyAdded]);
        playChimeSound();
      }
    },
    [],
  );

  // Логика проверки всех условий достижений
  const runEvaluate = useCallback(
    (data?: EvaluationData, options?: { silent?: boolean }) => {
      const toUnlock: string[] = [];
      const res = data?.resources || [];
      const cards = data?.cards || [];
      const streak = data?.streak ?? 0;
      const username =
        data?.username || localStorage.getItem("kavault_username") || "";
      const email = data?.userEmail || "";
      const uKey = activeUserKeyRef.current || "guest";

      // 1. СЕКРЕТНАЯ АЧИВКА: "Некий мистер А"
      if (checkIsMrA(username, email)) {
        toUnlock.push("secret_mr_a");
      }

      // 2. ЯПОНСКИЙ ХАБ
      if (cards.length >= 1) toUnlock.push("jap_first_word");
      if (cards.length >= 25) toUnlock.push("jap_words_25");
      if (cards.length >= 100) toUnlock.push("jap_words_100");

      const kanaCards = cards.filter(
        (c) =>
          c.type === "KANA" ||
          (!c.type &&
            /[\u3040-\u309F\u30A0-\u30FF]/.test(c.word || "") &&
            !/[\u4E00-\u9FAF]/.test(c.word || "")),
      );
      if (kanaCards.length >= 10) toUnlock.push("jap_kana_10");

      const kanjiCards = cards.filter(
        (c) => c.type === "KANJI" || /[\u4E00-\u9FAF]/.test(c.word || ""),
      );
      if (kanjiCards.length >= 10) toUnlock.push("jap_kanji_10");
      if (kanjiCards.length >= 25) toUnlock.push("jap_kanji_25");

      // Повторения
      const totalReviews = Number(
        localStorage.getItem(`kavault_total_reviews_${uKey}`) ||
          localStorage.getItem("kavault_total_reviews") ||
          0,
      );
      const hasReviewedCards = cards.some((c) => (c.level || 0) > 0);
      if (totalReviews >= 1 || hasReviewedCards) {
        toUnlock.push("jap_first_review");
      }
      if (totalReviews >= 50) toUnlock.push("jap_review_50");

      // 3. DEVELOPER HUB
      const devItems = res.filter((r) => r.type !== "REPOSITORY");
      if (devItems.length >= 1) toUnlock.push("dev_first_resource");
      if (devItems.length >= 10) toUnlock.push("dev_resources_10");
      if (devItems.length >= 25) toUnlock.push("dev_resources_25");

      const categories = new Set(devItems.map((r) => r.type));
      if (categories.size >= 3) toUnlock.push("dev_categories_3");

      if (
        devItems.some((r) => Boolean(r.note && r.note.trim().length > 0))
      ) {
        toUnlock.push("dev_with_notes");
      }

      const tagged = devItems.filter(
        (r) => Array.isArray(r.tags) && r.tags.length > 0,
      );
      if (tagged.length >= 3) toUnlock.push("dev_with_tags");

      // 4. GITHUB COLLECTION
      const gitRepos = res.filter((r) => r.type === "REPOSITORY");
      if (gitRepos.length >= 1) toUnlock.push("git_first_repo");
      if (gitRepos.length >= 5) toUnlock.push("git_repos_5");
      if (gitRepos.length >= 15) toUnlock.push("git_repos_15");

      const gitTags = new Set(gitRepos.flatMap((r) => r.tags || []));
      if (gitTags.size >= 3) toUnlock.push("git_multilang");

      // 5. ДИСЦИПЛИНА И ТРЕКЕР
      if (data?.goalsConfigured) {
        toUnlock.push("track_first_goal");
      }
      if (streak >= 3) toUnlock.push("track_streak_3");
      if (streak >= 7) toUnlock.push("track_streak_7");
      if (streak >= 14) toUnlock.push("track_streak_14");

      const studyMins = Number(
        localStorage.getItem("kavault_study_minutes") || 0,
      );
      if (studyMins >= 120) toUnlock.push("track_time_120");

      if (localStorage.getItem("kavault_daily_done") === "true") {
        toUnlock.push("track_daily_done");
      }

      // 6. ГРАФ ЗНАНИЙ
      const totalNodes = res.length + cards.length;
      if (totalNodes >= 20) toUnlock.push("graph_nodes_20");
      if (totalNodes >= 50) {
        toUnlock.push("graph_nodes_50");
        toUnlock.push("sys_total_50");
      }

      // 7. СИСТЕМА
      if (data?.themeSwitched) {
        toUnlock.push("sys_theme_switch");
      }

      if (toUnlock.length > 0) {
        unlockAchievementsBatch(toUnlock, options);
      }
    },
    [unlockAchievementsBatch],
  );

  // Обработка посещения страниц
  const applyPageVisit = useCallback(
    (pathname: string, options?: { silent?: boolean }) => {
      try {
        const uKey = activeUserKeyRef.current || "guest";
        const storageKey = `kavault_visited_pages_${uKey}`;
        const pagesRaw = localStorage.getItem(storageKey);
        const pages: string[] = pagesRaw ? JSON.parse(pagesRaw) : [];
        const toUnlock: string[] = [];

        if (!pages.includes(pathname)) {
          const updated = [...pages, pathname];
          localStorage.setItem(storageKey, JSON.stringify(updated));
          if (updated.length >= 6) {
            toUnlock.push("sys_all_pages");
          }
        }
        if (pathname.includes("graph")) {
          toUnlock.push("graph_first_visit");
        }

        if (toUnlock.length > 0) {
          unlockAchievementsBatch(toUnlock, options);
        }
      } catch (e) {
        console.error(e);
      }
    },
    [unlockAchievementsBatch],
  );

  // Загрузка разблокированных достижений аккаунта с сервера
  const loadServerAchievements = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    const uKey = getUserKeyFromToken(token);

    if (!token || !uKey) {
      activeUserKeyRef.current = null;
      serverLoadedRef.current = false;
      unlockedMapRef.current = {};
      pendingEvalRef.current = null;
      pendingVisitsRef.current = [];
      setUnlockedMap({});
      setToastQueue([]);
      return;
    }

    if (activeUserKeyRef.current !== uKey) {
      activeUserKeyRef.current = uKey;
      serverLoadedRef.current = false;
      setToastQueue([]);
      try {
        const cachedRaw = localStorage.getItem(
          `kavault_unlocked_achievements_${uKey}`,
        );
        const cachedMap = cachedRaw ? JSON.parse(cachedRaw) : {};
        unlockedMapRef.current = cachedMap;
        setUnlockedMap(cachedMap);
      } catch {
        unlockedMapRef.current = {};
        setUnlockedMap({});
      }
    }

    try {
      const resp = await api.get<{
        initialized: boolean;
        justBackfilled: boolean;
        achievements: Record<string, { unlockedAt: string }>;
      }>("/auth/achievements");

      if (activeUserKeyRef.current !== uKey) return;

      const merged = { ...(resp.data?.achievements || {}) };

      // Разово переносим локально накопленные клиентские ачивки (если были до обновления),
      // тихо без повторного показа всплывающих тостов
      const migratedFlag = `kavault_legacy_ach_migrated_${uKey}`;
      if (!localStorage.getItem(migratedFlag)) {
        const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacyRaw) {
          try {
            const legacyMap = JSON.parse(legacyRaw) as Record<
              string,
              { unlockedAt: string }
            >;
            const extraIds = Object.keys(legacyMap).filter((id) => !merged[id]);
            if (extraIds.length > 0) {
              extraIds.forEach((id) => {
                merged[id] = legacyMap[id] || {
                  unlockedAt: new Date().toISOString(),
                };
              });
              api
                .post("/auth/achievements/unlock", { ids: extraIds })
                .catch(() => {});
            }
          } catch {
            // ignore corrupted legacy json
          }
        }
        localStorage.setItem(migratedFlag, "true");
        localStorage.removeItem(LEGACY_STORAGE_KEY);
      }

      unlockedMapRef.current = merged;
      setUnlockedMap(merged);
      localStorage.setItem(
        `kavault_unlocked_achievements_${uKey}`,
        JSON.stringify(merged),
      );
      serverLoadedRef.current = true;

      // Применяем отложенные вызовы после загрузки серверного состояния:
      // всё, что уже было в базе данных, пропускается без тостов
      const visits = [...pendingVisitsRef.current];
      pendingVisitsRef.current = [];
      visits.forEach((p) => applyPageVisit(p));

      const pendingEval = pendingEvalRef.current;
      pendingEvalRef.current = null;
      if (pendingEval) {
        runEvaluate(pendingEval);
      }
    } catch {
      // При оффлайне разрешаем работу с локальным кэшем конкретного пользователя
      serverLoadedRef.current = true;
      const visits = [...pendingVisitsRef.current];
      pendingVisitsRef.current = [];
      visits.forEach((p) => applyPageVisit(p, { silent: true }));
    }
  }, [applyPageVisit, runEvaluate]);

  useEffect(() => {
    loadServerAchievements();
    const handleAuthChanged = () => {
      loadServerAchievements();
    };
    window.addEventListener("kavault-auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("kavault-auth-changed", handleAuthChanged);
    };
  }, [loadServerAchievements]);

  // Фиксация посещения страницы
  const trackPageVisit = useCallback(
    (pathname: string) => {
      if (!localStorage.getItem("access_token")) return;
      if (!serverLoadedRef.current) {
        if (!pendingVisitsRef.current.includes(pathname)) {
          pendingVisitsRef.current.push(pathname);
        }
        return;
      }
      applyPageVisit(pathname);
    },
    [applyPageVisit],
  );

  // Увеличение счётчика повторений карточек
  const incrementReviewCount = useCallback(
    (count = 1) => {
      const uKey = activeUserKeyRef.current || "guest";
      const storageKey = `kavault_total_reviews_${uKey}`;
      const prevRaw =
        localStorage.getItem(storageKey) ||
        localStorage.getItem("kavault_total_reviews") ||
        "0";
      const cur = Number(prevRaw) + count;
      localStorage.setItem(storageKey, String(cur));
      const toUnlock: string[] = [];
      if (cur >= 1) toUnlock.push("jap_first_review");
      if (cur >= 50) toUnlock.push("jap_review_50");
      if (serverLoadedRef.current && toUnlock.length > 0) {
        unlockAchievementsBatch(toUnlock);
      }
    },
    [unlockAchievementsBatch],
  );

  // Публичная функция оценки достижений
  const evaluateAchievements = useCallback(
    (data?: EvaluationData) => {
      if (!localStorage.getItem("access_token")) return;
      if (!serverLoadedRef.current) {
        pendingEvalRef.current = {
          ...(pendingEvalRef.current || {}),
          ...(data || {}),
        };
        return;
      }
      runEvaluate(data);
    },
    [runEvaluate],
  );

  // Подготовка списка с текущими статусами и локализацией
  const achievements: AchievementItem[] = ACHIEVEMENTS.map((ach) => ({
    ...localizeAchievement(ach, language),
    unlocked: Boolean(unlockedMap[ach.id]),
    unlockedAt: unlockedMap[ach.id]?.unlockedAt,
  }));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const totalPoints = ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);
  const earnedPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  // Определение ранга пользователя по очкам на текущем языке
  let rankTitle = t.achievements.ranks.novice;
  if (earnedPoints >= 100) rankTitle = t.achievements.ranks.seeker;
  if (earnedPoints >= 250) rankTitle = t.achievements.ranks.architect;
  if (earnedPoints >= 450) rankTitle = t.achievements.ranks.sensei;
  if (earnedPoints >= 700) rankTitle = t.achievements.ranks.magister;
  if (earnedPoints >= 1000) rankTitle = t.achievements.ranks.legend;

  const localizedToast = toastQueue[0]
    ? localizeAchievement(toastQueue[0], language)
    : null;

  return (
    <AchievementContext.Provider
      value={{
        achievements,
        unlockedCount,
        totalCount,
        totalPoints,
        earnedPoints,
        rankTitle,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        closeModal: () => setIsModalOpen(false),
        newlyUnlocked: localizedToast,
        dismissToast,
        evaluateAchievements,
        trackPageVisit,
        incrementReviewCount,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error(
      "useAchievements must be used within AchievementProvider",
    );
  }
  return context;
};
