import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  ACHIEVEMENTS,
  checkIsMrA,
} from "../data/achievements";
import type { Achievement } from "../data/achievements";

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

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

const STORAGE_KEY = "kavault_unlocked_achievements";

// Проигрывание приятного звука победы через Web Audio API
function playChimeSound() {
  if (typeof window === "undefined") return;
  const soundEnabled = localStorage.getItem("kavault_sound_fx") !== "false";
  if (!soundEnabled) return;

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (мажорный победный аккорд)
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);

      gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.08 + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + index * 0.08);
      osc.stop(ctx.currentTime + index * 0.08 + 0.5);
    });
  } catch {
    // игнорируем ошибку автовоспроизведения браузера
  }
}

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [unlockedMap, setUnlockedMap] = useState<Record<string, { unlockedAt: string }>>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  const [toastQueue, setToastQueue] = useState<Achievement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Сохранение в LocalStorage при изменении
  const saveUnlocked = (newMap: Record<string, { unlockedAt: string }>) => {
    setUnlockedMap(newMap);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newMap));
  };

  // Закрытие тоста
  const dismissToast = useCallback(() => {
    setToastQueue((prev) => prev.slice(1));
  }, []);

  // Автозакрытие тоста через 5 секунд
  useEffect(() => {
    if (toastQueue.length === 0) return;
    const timer = setTimeout(() => {
      dismissToast();
    }, 5500);
    return () => clearTimeout(timer);
  }, [toastQueue, dismissToast]);

  // Разблокировать ачивку
  const unlockAchievement = useCallback(
    (id: string) => {
      if (unlockedMap[id]) return; // уже открыта

      const ach = ACHIEVEMENTS.find((a) => a.id === id);
      if (!ach) return;

      const updated = {
        ...unlockedMap,
        [id]: { unlockedAt: new Date().toISOString() },
      };
      saveUnlocked(updated);
      setToastQueue((prev) => [...prev, ach]);
      playChimeSound();
    },
    [unlockedMap],
  );

  // Фиксация посещения страницы
  const trackPageVisit = useCallback(
    (pathname: string) => {
      try {
        const pagesRaw = localStorage.getItem("kavault_visited_pages");
        const pages: string[] = pagesRaw ? JSON.parse(pagesRaw) : [];
        if (!pages.includes(pathname)) {
          const updated = [...pages, pathname];
          localStorage.setItem("kavault_visited_pages", JSON.stringify(updated));
          if (updated.length >= 6) {
            unlockAchievement("sys_all_pages");
          }
        }
        if (pathname.includes("graph")) {
          localStorage.setItem("kavault_visited_graph", "true");
          unlockAchievement("graph_first_visit");
        }
      } catch (e) {
        console.error(e);
      }
    },
    [unlockAchievement],
  );

  // Увеличение счётчика повторений карточек
  const incrementReviewCount = useCallback(
    (count = 1) => {
      const cur = Number(localStorage.getItem("kavault_total_reviews") || 0) + count;
      localStorage.setItem("kavault_total_reviews", String(cur));
      if (cur >= 1) unlockAchievement("jap_first_review");
      if (cur >= 50) unlockAchievement("jap_review_50");
    },
    [unlockAchievement],
  );

  // Основной движок проверки всех ачивок
  const evaluateAchievements = useCallback(
    (data?: EvaluationData) => {
      const res = data?.resources || [];
      const cards = data?.cards || [];
      const streak = data?.streak ?? 0;
      const username = data?.username || localStorage.getItem("kavault_username") || "";
      const email = data?.userEmail || "";

      // 1. СЕКРЕТНАЯ АЧИВКА: "Некий мистер А"
      if (checkIsMrA(username, email)) {
        unlockAchievement("secret_mr_a");
      }

      // 2. ЯПОНСКИЙ ХАБ
      if (cards.length >= 1) unlockAchievement("jap_first_word");
      if (cards.length >= 25) unlockAchievement("jap_words_25");
      if (cards.length >= 100) unlockAchievement("jap_words_100");

      const kanaCards = cards.filter(
        (c) =>
          c.type === "KANA" ||
          (!c.type && /[\u3040-\u309F\u30A0-\u30FF]/.test(c.word || "") && !/[\u4E00-\u9FAF]/.test(c.word || ""))
      );
      if (kanaCards.length >= 10) unlockAchievement("jap_kana_10");

      const kanjiCards = cards.filter(
        (c) => c.type === "KANJI" || /[\u4E00-\u9FAF]/.test(c.word || "")
      );
      if (kanjiCards.length >= 10) unlockAchievement("jap_kanji_10");
      if (kanjiCards.length >= 25) unlockAchievement("jap_kanji_25");

      // Повторения
      const totalReviews = Number(localStorage.getItem("kavault_total_reviews") || 0);
      const hasReviewedCards = cards.some((c) => (c.level || 0) > 0);
      if (totalReviews >= 1 || hasReviewedCards) unlockAchievement("jap_first_review");
      if (totalReviews >= 50) unlockAchievement("jap_review_50");

      // 3. DEVELOPER HUB
      const devItems = res.filter((r) => r.type !== "REPOSITORY");
      if (devItems.length >= 1) unlockAchievement("dev_first_resource");
      if (devItems.length >= 10) unlockAchievement("dev_resources_10");
      if (devItems.length >= 25) unlockAchievement("dev_resources_25");

      const categories = new Set(devItems.map((r) => r.type));
      if (categories.size >= 3) unlockAchievement("dev_categories_3");

      if (devItems.some((r) => Boolean(r.note && r.note.trim().length > 0))) {
        unlockAchievement("dev_with_notes");
      }

      const tagged = devItems.filter((r) => Array.isArray(r.tags) && r.tags.length > 0);
      if (tagged.length >= 3) unlockAchievement("dev_with_tags");

      // 4. GITHUB COLLECTION
      const gitRepos = res.filter((r) => r.type === "REPOSITORY");
      if (gitRepos.length >= 1) unlockAchievement("git_first_repo");
      if (gitRepos.length >= 5) unlockAchievement("git_repos_5");
      if (gitRepos.length >= 15) unlockAchievement("git_repos_15");

      const gitTags = new Set(gitRepos.flatMap((r) => r.tags || []));
      if (gitTags.size >= 3) unlockAchievement("git_multilang");

      // 5. ДИСЦИПЛИНА И ТРЕКЕР
      const goalRes = localStorage.getItem("kavault_goal_resources");
      const goalCrd = localStorage.getItem("kavault_goal_cards");
      if (goalRes || goalCrd) unlockAchievement("track_first_goal");

      if (streak >= 3) unlockAchievement("track_streak_3");
      if (streak >= 7) unlockAchievement("track_streak_7");
      if (streak >= 14) unlockAchievement("track_streak_14");

      const studyMins = Number(localStorage.getItem("kavault_study_minutes") || 0);
      if (studyMins >= 120) unlockAchievement("track_time_120");

      if (localStorage.getItem("kavault_daily_done") === "true") {
        unlockAchievement("track_daily_done");
      }

      // 6. ГРАФ ЗНАНИЙ
      if (localStorage.getItem("kavault_visited_graph") === "true") {
        unlockAchievement("graph_first_visit");
      }
      const totalNodes = res.length + cards.length;
      if (totalNodes >= 20) unlockAchievement("graph_nodes_20");
      if (totalNodes >= 50) unlockAchievement("graph_nodes_50");

      // 7. СИСТЕМА
      if (localStorage.getItem("kavault_accent") || localStorage.getItem("kavault_theme")) {
        unlockAchievement("sys_theme_switch");
      }

      try {
        const pages: string[] = JSON.parse(localStorage.getItem("kavault_visited_pages") || "[]");
        if (pages.length >= 6) unlockAchievement("sys_all_pages");
      } catch {}

      if (totalNodes >= 50) unlockAchievement("sys_total_50");
    },
    [unlockAchievement],
  );

  // Первичная проверка при монтировании
  useEffect(() => {
    evaluateAchievements();
  }, [evaluateAchievements]);

  // Подготовка списка с текущими статусами
  const achievements: AchievementItem[] = ACHIEVEMENTS.map((ach) => ({
    ...ach,
    unlocked: Boolean(unlockedMap[ach.id]),
    unlockedAt: unlockedMap[ach.id]?.unlockedAt,
  }));

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = ACHIEVEMENTS.length;
  const totalPoints = ACHIEVEMENTS.reduce((sum, a) => sum + a.points, 0);
  const earnedPoints = achievements
    .filter((a) => a.unlocked)
    .reduce((sum, a) => sum + a.points, 0);

  // Определение ранга пользователя по очкам
  let rankTitle = "Новичок";
  if (earnedPoints >= 100) rankTitle = "Искатель Знаний";
  if (earnedPoints >= 250) rankTitle = "Архитектор Памяти";
  if (earnedPoints >= 450) rankTitle = "Сенсей Продуктивности";
  if (earnedPoints >= 700) rankTitle = "Магистр KAVAULT";
  if (earnedPoints >= 1000) rankTitle = "Легенда Хранилища";

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
        newlyUnlocked: toastQueue[0] || null,
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
    throw new Error("useAchievements must be used within AchievementProvider");
  }
  return context;
};
