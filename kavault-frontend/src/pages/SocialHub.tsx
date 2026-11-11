import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Award,
  Check,
  Crown,
  Edit3,
  Globe,
  History,
  LogIn,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trophy,
  UserCheck,
  UserMinus,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import type { Language } from "../i18n/translations";

interface RankTierInfo {
  key: string;
  title: string;
  minMmr: number;
  emoji: string;
  color: string;
}

interface LeaderboardEntry {
  rank: number;
  id: string;
  isSelf?: boolean;
  nickname: string;
  mmr: number;
  rankTier: RankTierInfo;
  studyLanguage: string;
  cardsCount: number;
  resourcesCount: number;
  passagesCount: number;
  joinedAt?: string;
}

interface MmrLogEntry {
  id: string;
  reason: string;
  delta: number;
  meta?: Record<string, any> | null;
  createdAt: string;
}

interface MySocialSummary {
  id: string;
  nickname: string;
  mmr: number;
  rankTier: RankTierInfo;
  globalRank: number;
  studyLanguage: string;
  friendsCount: number;
  pendingIncomingCount: number;
  recentLogs: MmrLogEntry[];
  tiers: RankTierInfo[];
}

interface FriendUserItem {
  friendshipId: string;
  id: string;
  nickname: string;
  mmr: number;
  rankTier: RankTierInfo;
  studyLanguage: string;
  cardsCount: number;
  resourcesCount: number;
}

interface SearchUserResult {
  id: string;
  nickname: string;
  mmr: number;
  rankTier: RankTierInfo;
  studyLanguage: string;
  cardsCount: number;
  resourcesCount: number;
  friendshipId: string | null;
  relationStatus: "NONE" | "FRIENDS" | "PENDING_SENT" | "PENDING_RECEIVED";
}

const LANG_FLAGS: Record<string, string> = {
  ja: "🇯🇵",
  en: "🇬🇧",
  de: "🇩🇪",
};

const TEXTS: Record<
  Language,
  {
    pageTitle: string;
    pageSubtitle: string;
    publicSubtitle: string;
    tabs: {
      leaderboard: string;
      friends: string;
      history: string;
    };
    yourRankLabel: string;
    globalPlace: string;
    friendsLabel: string;
    nextRankPrefix: string;
    maxRankReached: string;
    editNickBtn: string;
    saveNickBtn: string;
    cancelBtn: string;
    nickPlaceholder: string;
    searchPlaceholder: string;
    allLangs: string;
    playersCount: string;
    colRank: string;
    colPlayer: string;
    colTier: string;
    colActivity: string;
    colMmr: string;
    cardsShort: string;
    resShort: string;
    addFriendTitle: string;
    addFriendPlaceholder: string;
    addByNickBtn: string;
    searchingUsers: string;
    noUsersFound: string;
    incomingTitle: string;
    outgoingTitle: string;
    friendsLeaderboardTitle: string;
    noFriendsYet: string;
    acceptBtn: string;
    declineBtn: string;
    removeFriendBtn: string;
    requestSent: string;
    alreadyFriends: string;
    addBtn: string;
    tiersTitle: string;
    howToEarnTitle: string;
    recentLogsTitle: string;
    noLogsYet: string;
    openMyProfile: string;
    signInCta: string;
    openWorkspace: string;
    youBadge: string;
    rulesList: Array<{ label: string; mmr: string }>;
    reasonsMap: Record<string, string>;
  }
> = {
  ru: {
    pageTitle: "Task-System и Друзья",
    pageSubtitle:
      "Единый соревновательный рейтинг KAVAULT: проходите материалы, зарабатывайте MMR и соревнуйтесь с друзьями.",
    publicSubtitle:
      "Открытая таблица лидеров Task-System. Просматривайте топ учеников по MMR без авторизации.",
    tabs: {
      leaderboard: "Рейтинг Task-System",
      friends: "Друзья по никнейму",
      history: "История MMR и Правила",
    },
    yourRankLabel: "Ваш ранг",
    globalPlace: "Место в мире",
    friendsLabel: "Друзей",
    nextRankPrefix: "До ранга",
    maxRankReached: "Максимальный ранг достигнут!",
    editNickBtn: "Сменить ник",
    saveNickBtn: "Сохранить",
    cancelBtn: "Отмена",
    nickPlaceholder: "Ваш уникальный никнейм",
    searchPlaceholder: "Поиск игрока по никнейму...",
    allLangs: "Все языки",
    playersCount: "Участников:",
    colRank: "#",
    colPlayer: "Игрок",
    colTier: "Ранг Task-System",
    colActivity: "Изучено",
    colMmr: "MMR",
    cardsShort: "слов",
    resShort: "тем",
    addFriendTitle: "Найти и добавить в друзья",
    addFriendPlaceholder: "Введите никнейм друга (от 2 символов)...",
    addByNickBtn: "Отправить запрос",
    searchingUsers: "Поиск...",
    noUsersFound: "Игроки с таким никнеймом не найдены.",
    incomingTitle: "Входящие заявки в друзья",
    outgoingTitle: "Исходящие заявки",
    friendsLeaderboardTitle: "Рейтинг среди друзей",
    noFriendsYet: "У вас пока нет друзей. Найдите знакомых по никнейму выше!",
    acceptBtn: "Принять",
    declineBtn: "Отклонить",
    removeFriendBtn: "Удалить",
    requestSent: "Заявка отправлена",
    alreadyFriends: "В друзьях",
    addBtn: "Добавить",
    tiersTitle: "Лиги и ранги Task-System",
    howToEarnTitle: "Как начисляется MMR",
    recentLogsTitle: "Последние начисления MMR",
    noLogsYet: "Начислений пока нет — начните повторять карточки или решать квизы!",
    openMyProfile: "Мои друзья и профиль →",
    signInCta: "Войти / Регистрация",
    openWorkspace: "К приложению",
    youBadge: "Вы",
    rulesList: [
      { label: "Завершение темы в Базе знаний или GitHub-проекта", mmr: "+35 MMR" },
      { label: "Тест по чтению / грамматике", mmr: "+20..25 MMR" },
      { label: "Добавление своего текста или правила в языковой хаб", mmr: "+20 MMR" },
      { label: "Уверенное повторение карточки (SRS уровень 4–5)", mmr: "+15 MMR" },
      { label: "Аудирование: диалог, квиз или аудио-диктант", mmr: "+12..15 MMR" },
      { label: "Запись мысли в дневнике (>= 15 символов)", mmr: "+8 MMR" },
    ],
    reasonsMap: {
      BASELINE_SYNC: "Стартовый пересчёт прогресса",
      SRS_REVIEW: "Повторение карточки SRS",
      RESOURCE_COMPLETE: "Завершение материала / репозитория",
      PASSAGE_ADD: "Добавление своего текста / правила",
      GRAMMAR_QUIZ: "Практика грамматики",
      READING_QUIZ: "Тест по чтению",
      LISTENING_QUIZ: "Аудирование-квиз",
      LISTENING_DICTATION: "Успешный аудио-диктант",
      DIALOGUE_PRACTICE: "Прослушивание диалога",
      THOUGHT_JOURNAL: "Запись в разделе Мысли",
    },
  },
  en: {
    pageTitle: "Task-System & Friends",
    pageSubtitle:
      "KAVAULT competitive learning rating: complete study tasks, earn MMR, and compare progress with friends.",
    publicSubtitle:
      "Public Task-System Leaderboard. Anyone can browse top learners by MMR without signing in.",
    tabs: {
      leaderboard: "Task-System Rating",
      friends: "Friends by Nickname",
      history: "MMR Log & Tiers",
    },
    yourRankLabel: "Your Tier",
    globalPlace: "Global Rank",
    friendsLabel: "Friends",
    nextRankPrefix: "To",
    maxRankReached: "Highest tier reached!",
    editNickBtn: "Edit Nickname",
    saveNickBtn: "Save",
    cancelBtn: "Cancel",
    nickPlaceholder: "Your unique nickname",
    searchPlaceholder: "Search player by nickname...",
    allLangs: "All languages",
    playersCount: "Players:",
    colRank: "#",
    colPlayer: "Player",
    colTier: "Task-System Tier",
    colActivity: "Progress",
    colMmr: "MMR",
    cardsShort: "cards",
    resShort: "topics",
    addFriendTitle: "Find & Add Friends",
    addFriendPlaceholder: "Type friend's nickname (min 2 chars)...",
    addByNickBtn: "Send Request",
    searchingUsers: "Searching...",
    noUsersFound: "No players matched that nickname.",
    incomingTitle: "Incoming Friend Requests",
    outgoingTitle: "Pending Sent Requests",
    friendsLeaderboardTitle: "Friends Leaderboard",
    noFriendsYet: "No friends added yet. Search by nickname above to connect!",
    acceptBtn: "Accept",
    declineBtn: "Decline",
    removeFriendBtn: "Remove",
    requestSent: "Requested",
    alreadyFriends: "Friends",
    addBtn: "Add",
    tiersTitle: "Task-System Rank Tiers",
    howToEarnTitle: "How to earn MMR",
    recentLogsTitle: "Recent MMR Activity",
    noLogsYet: "No MMR earned yet — review cards, finish resources, or pass quizzes!",
    openMyProfile: "My Friends & Profile →",
    signInCta: "Sign In / Register",
    openWorkspace: "Back to App",
    youBadge: "You",
    rulesList: [
      { label: "Complete a Dev Hub resource or GitHub item", mmr: "+35 MMR" },
      { label: "Add a custom reading passage or grammar note", mmr: "+20 MMR" },
      { label: "Mastered SRS card review (Level 4–5)", mmr: "+15 MMR" },
      { label: "Pass Grammar, Reading, or Listening quizzes", mmr: "+12..14 MMR" },
      { label: "Write a Thought entry (>= 15 chars)", mmr: "+8 MMR" },
    ],
    reasonsMap: {
      BASELINE_SYNC: "Initial Progress Sync",
      SRS_REVIEW: "SRS Card Review",
      RESOURCE_COMPLETE: "Resource Completed",
      PASSAGE_ADD: "Custom Text / Rule Added",
      QUIZ_GRAMMAR: "Grammar Drill Passed",
      QUIZ_READING: "Reading Quiz Passed",
      QUIZ_LISTENING: "Listening Quiz Passed",
      LISTENING_DICTATION: "Audio Dictation Passed",
      DIALOGUE_PRACTICE: "Dialogue Completed",
      THOUGHT_ENTRY: "Thought Note Created",
    },
  },
  ja: {
    pageTitle: "Task-System・フレンド",
    pageSubtitle:
      "学習タスクをクリアして MMR を獲得し、フレンドや世界中の学習者とランキングで競い合いましょう。",
    publicSubtitle:
      "Task-System 公開ランキング。ログイン不要で全学習者の MMR スコアを閲覧できます。",
    tabs: {
      leaderboard: "Task-System ランキング",
      friends: "ニックネームでフレンド",
      history: "MMR 履歴・ルール",
    },
    yourRankLabel: "現在のランク",
    globalPlace: "世界順位",
    friendsLabel: "フレンド",
    nextRankPrefix: "次のランクまで",
    maxRankReached: "最高ランクに到達しました！",
    editNickBtn: "ニックネーム変更",
    saveNickBtn: "保存",
    cancelBtn: "キャンセル",
    nickPlaceholder: "ユニークなニックネーム",
    searchPlaceholder: "ニックネームで検索...",
    allLangs: "すべての言語",
    playersCount: "参加者:",
    colRank: "#",
    colPlayer: "プレイヤー",
    colTier: "ランク",
    colActivity: "学習量",
    colMmr: "MMR",
    cardsShort: "単語",
    resShort: "トピック",
    addFriendTitle: "フレンドを検索・追加",
    addFriendPlaceholder: "ニックネームを入力 (2文字以上)...",
    addByNickBtn: "申請を送る",
    searchingUsers: "検索中...",
    noUsersFound: "該当するユーザーが見つかりません。",
    incomingTitle: "届いたフレンド申請",
    outgoingTitle: "送信済みの申請",
    friendsLeaderboardTitle: "フレンドランキング",
    noFriendsYet: "まだフレンドがいません。上の検索から追加できます！",
    acceptBtn: "承認",
    declineBtn: "拒否",
    removeFriendBtn: "解除",
    requestSent: "申請済",
    alreadyFriends: "フレンド",
    addBtn: "追加",
    tiersTitle: "Task-System ランク一覧",
    howToEarnTitle: "MMR 獲得方法",
    recentLogsTitle: "最近の MMR 獲得履歴",
    noLogsYet: "まだ履歴がありません。単語復習やクイズに挑戦しましょう！",
    openMyProfile: "フレンド・プロフィールへ →",
    signInCta: "ログイン / 登録",
    openWorkspace: "アプリへ戻る",
    youBadge: "あなた",
    rulesList: [
      { label: "開発者ハブ / GitHub リソースを完了", mmr: "+35 MMR" },
      { label: "オリジナル長文・文法ノートを追加", mmr: "+20 MMR" },
      { label: "SRS 復習で高評価 (Lv 4–5)", mmr: "+15 MMR" },
      { label: "文法・読解・リスニングクイズに合格", mmr: "+12..14 MMR" },
      { label: "思考ノートを投稿 (15文字以上)", mmr: "+8 MMR" },
    ],
    reasonsMap: {
      BASELINE_SYNC: "初期進捗ボーナス",
      SRS_REVIEW: "SRS カード復習",
      RESOURCE_COMPLETE: "学習リソース完了",
      PASSAGE_ADD: "長文/文法追加",
      QUIZ_GRAMMAR: "文法クイズ合格",
      QUIZ_READING: "読解クイズ合格",
      QUIZ_LISTENING: "リスニングクイズ合格",
      LISTENING_DICTATION: "ディクテーション正解",
      DIALOGUE_PRACTICE: "会話リスニング完了",
      THOUGHT_ENTRY: "思考ノート記録",
    },
  },
};

export function SocialHub({ publicOnly = false }: { publicOnly?: boolean }) {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    locale,
    setLocalNickname,
    setLocalMmr,
  } = useApp();
  const txt = TEXTS[language];
  const hasToken = Boolean(localStorage.getItem("access_token"));
  const canUsePersonal = !publicOnly && hasToken;

  const [tab, setTab] = useState<"leaderboard" | "friends" | "history">("leaderboard");
  const [summary, setSummary] = useState<MySocialSummary | null>(null);
  const [globalBoard, setGlobalBoard] = useState<{
    totalPlayers: number;
    tiers: RankTierInfo[];
    entries: LeaderboardEntry[];
  }>({ totalPlayers: 0, tiers: [], entries: [] });
  const [friendsBoard, setFriendsBoard] = useState<LeaderboardEntry[]>([]);
  const [friendsData, setFriendsData] = useState<{
    friends: FriendUserItem[];
    incoming: FriendUserItem[];
    outgoing: FriendUserItem[];
  }>({ friends: [], incoming: [], outgoing: [] });

  const [searchBoard, setSearchBoard] = useState("");
  const [langFilter, setLangFilter] = useState<"" | "ja" | "en" | "de">("");
  const [loadingBoard, setLoadingBoard] = useState(true);

  // Nickname edit state
  const [editingNick, setEditingNick] = useState(false);
  const [nickInput, setNickInput] = useState("");
  const [nickError, setNickError] = useState("");
  const [savingNick, setSavingNick] = useState(false);

  // Friend search state
  const [friendSearchQuery, setFriendSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [friendActionMsg, setFriendActionMsg] = useState("");

  const fetchPublicBoard = useCallback(async () => {
    setLoadingBoard(true);
    try {
      const resp = await api.get("/social/leaderboard", {
        params: {
          ...(searchBoard.trim() ? { search: searchBoard.trim() } : {}),
          ...(langFilter ? { lang: langFilter } : {}),
        },
      });
      setGlobalBoard({
        totalPlayers: resp.data.totalPlayers || 0,
        tiers: resp.data.tiers || [],
        entries: resp.data.entries || [],
      });
    } catch (e) {
      console.error("Failed to fetch public leaderboard", e);
    } finally {
      setLoadingBoard(false);
    }
  }, [searchBoard, langFilter]);

  const fetchPersonalSocial = useCallback(async () => {
    if (!canUsePersonal) return;
    try {
      const [meResp, fbResp, frResp] = await Promise.all([
        api.get<MySocialSummary>("/social/me"),
        api.get<{ entries: LeaderboardEntry[] }>("/social/leaderboard/friends"),
        api.get("/social/friends"),
      ]);
      setSummary(meResp.data);
      setNickInput(meResp.data.nickname || "");
      setLocalNickname(meResp.data.nickname);
      setLocalMmr(meResp.data.mmr);
      setFriendsBoard(fbResp.data.entries || []);
      setFriendsData({
        friends: frResp.data.friends || [],
        incoming: frResp.data.incoming || [],
        outgoing: frResp.data.outgoing || [],
      });
    } catch (e) {
      console.error("Failed to fetch personal social profile", e);
    }
  }, [canUsePersonal, setLocalNickname, setLocalMmr]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPublicBoard();
    }, 180);
    return () => clearTimeout(timer);
  }, [fetchPublicBoard]);

  useEffect(() => {
    fetchPersonalSocial();
  }, [fetchPersonalSocial]);

  useEffect(() => {
    if (!canUsePersonal) return;
    const clean = friendSearchQuery.trim();
    if (clean.length < 2) {
      setSearchResults([]);
      return;
    }
    let active = true;
    setIsSearchingUsers(true);
    const timer = setTimeout(async () => {
      try {
        const resp = await api.get<SearchUserResult[]>("/social/users/search", {
          params: { q: clean },
        });
        if (active) setSearchResults(resp.data || []);
      } catch {
        if (active) setSearchResults([]);
      } finally {
        if (active) setIsSearchingUsers(false);
      }
    }, 250);
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [friendSearchQuery, canUsePersonal]);

  const handleSaveNickname = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickInput.trim()) return;
    setSavingNick(true);
    setNickError("");
    try {
      const resp = await api.patch("/social/nickname", {
        nickname: nickInput.trim(),
      });
      setLocalNickname(resp.data.nickname);
      setEditingNick(false);
      await Promise.all([fetchPersonalSocial(), fetchPublicBoard()]);
    } catch (err: any) {
      setNickError(err.response?.data?.message || "Nickname update failed");
    } finally {
      setSavingNick(false);
    }
  };

  const handleSendFriendRequest = async (targetNickname: string) => {
    if (!targetNickname.trim()) return;
    setFriendActionMsg("");
    try {
      const resp = await api.post("/social/friends/request", {
        nickname: targetNickname.trim(),
      });
      setFriendActionMsg(resp.data?.message || txt.requestSent);
      await Promise.all([
        fetchPersonalSocial(),
        friendSearchQuery.trim().length >= 2
          ? api
              .get<SearchUserResult[]>("/social/users/search", {
                params: { q: friendSearchQuery.trim() },
              })
              .then((r) => setSearchResults(r.data || []))
          : Promise.resolve(),
      ]);
    } catch (err: any) {
      setFriendActionMsg(err.response?.data?.message || "Error");
    }
  };

  const handleRespondRequest = async (friendshipId: string, accept: boolean) => {
    try {
      await api.post(`/social/friends/${friendshipId}/respond`, { accept });
      await fetchPersonalSocial();
    } catch (e) {
      console.error(e);
    }
  };

  const handleRemoveFriend = async (friendshipId: string) => {
    try {
      await api.delete(`/social/friends/${friendshipId}`);
      await Promise.all([
        fetchPersonalSocial(),
        friendSearchQuery.trim().length >= 2
          ? api
              .get<SearchUserResult[]>("/social/users/search", {
                params: { q: friendSearchQuery.trim() },
              })
              .then((r) => setSearchResults(r.data || []))
          : Promise.resolve(),
      ]);
    } catch (e) {
      console.error(e);
    }
  };

  const nextTierProgress = useMemo(() => {
    if (!summary || !summary.tiers.length) return null;
    const sorted = [...summary.tiers].sort((a, b) => a.minMmr - b.minMmr);
    const next = sorted.find((tr) => tr.minMmr > summary.mmr);
    if (!next) return { pct: 100, next: null, remaining: 0 };
    const prevMmr = summary.rankTier.minMmr;
    const span = Math.max(1, next.minMmr - prevMmr);
    const pct = Math.min(100, Math.round(((summary.mmr - prevMmr) / span) * 100));
    return { pct, next, remaining: next.minMmr - summary.mmr };
  }, [summary]);

  const topThree = useMemo(
    () => (searchBoard.trim() || langFilter ? [] : globalBoard.entries.slice(0, 3)),
    [globalBoard.entries, searchBoard, langFilter],
  );

  const visibleTiers = summary?.tiers?.length ? summary.tiers : globalBoard.tiers;

  return (
    <div
      style={{
        minHeight: publicOnly ? "100vh" : undefined,
        backgroundColor: publicOnly ? "var(--bg-primary)" : undefined,
        color: "var(--text-primary)",
        padding: publicOnly ? "var(--space-5)" : undefined,
      }}
    >
      <div
        style={{
          maxWidth: publicOnly ? "1040px" : undefined,
          margin: publicOnly ? "0 auto" : undefined,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        {/* Публичный топ-бар при открытии /leaderboard */}
        {publicOnly && (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
              paddingBottom: "var(--space-3)",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                  color: "#ffffff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                }}
              >
                <Trophy size={16} />
              </span>
              <span style={{ fontWeight: 700, fontSize: "16px" }}>
                KAVAULT • Task-System
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <button
                type="button"
                onClick={() =>
                  setLanguage(language === "ru" ? "en" : language === "en" ? "ja" : "ru")
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px",
                  padding: "6px 10px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-secondary)",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                <Globe size={13} />
                {language.toUpperCase()}
              </button>

              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "6px 9px",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  backgroundColor: "var(--surface)",
                  color: "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
              </button>

              {hasToken ? (
                <Link to="/social" style={{ textDecoration: "none" }}>
                  <Button style={{ gap: "6px", fontSize: "12.5px" }}>
                    <Users size={14} /> {txt.openMyProfile}
                  </Button>
                </Link>
              ) : (
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <Button style={{ gap: "6px", fontSize: "12.5px" }}>
                    <LogIn size={14} /> {txt.signInCta}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Заголовок */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <Badge variant="accent">Task-System Rating</Badge>
              <Badge variant="default">
                {txt.playersCount} {globalBoard.totalPlayers}
              </Badge>
            </div>
            <h1 style={{ margin: "0 0 6px 0", fontSize: "26px", fontWeight: 700 }}>
              {txt.pageTitle}
            </h1>
            <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>
              {canUsePersonal ? txt.pageSubtitle : txt.publicSubtitle}
            </p>
          </div>
        </div>

        {/* Личная карточка рейтинга и никнейма */}
        {canUsePersonal && summary && (
          <Card
            style={{
              padding: "var(--space-6)",
              borderColor: `${summary.rankTier.color}55`,
              background: `linear-gradient(135deg, ${summary.rankTier.color}18, var(--surface))`,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "18px",
                alignItems: "center",
              }}
            >
              {/* Никнейм и ранг */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "26px" }}>{summary.rankTier.emoji}</span>
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        textTransform: "uppercase",
                        fontWeight: 700,
                        color: summary.rankTier.color,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {txt.yourRankLabel}: {summary.rankTier.title}
                    </div>
                    {!editingNick ? (
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "20px", fontWeight: 700 }}>
                          @{summary.nickname}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setNickInput(summary.nickname);
                            setNickError("");
                            setEditingNick(true);
                          }}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "3px 8px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--surface)",
                            color: "var(--text-secondary)",
                            fontSize: "11.5px",
                            cursor: "pointer",
                          }}
                        >
                          <Edit3 size={11} /> {txt.editNickBtn}
                        </button>
                      </div>
                    ) : (
                      <form
                        onSubmit={handleSaveNickname}
                        style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap" }}
                      >
                        <input
                          value={nickInput}
                          onChange={(e) => setNickInput(e.target.value)}
                          placeholder={txt.nickPlaceholder}
                          style={{
                            height: "32px",
                            padding: "0 10px",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--border)",
                            backgroundColor: "var(--surface)",
                            color: "var(--text-primary)",
                            fontSize: "13px",
                            outline: "none",
                          }}
                        />
                        <Button
                          type="submit"
                          disabled={savingNick}
                          style={{ padding: "4px 10px", fontSize: "12px" }}
                        >
                          {txt.saveNickBtn}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setEditingNick(false)}
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                        >
                          {txt.cancelBtn}
                        </Button>
                      </form>
                    )}
                    {nickError && (
                      <div style={{ color: "var(--error)", fontSize: "12px", marginTop: "4px" }}>
                        {nickError}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Показатели MMR & Место */}
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    Task-System MMR
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 800, color: summary.rankTier.color }}>
                    {summary.mmr}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    {txt.globalPlace}
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 800 }}>
                    #{summary.globalRank}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                    {txt.friendsLabel}
                  </div>
                  <div style={{ fontSize: "26px", fontWeight: 800 }}>
                    {summary.friendsCount}
                  </div>
                </div>
              </div>

              {/* Прогресс до следующей лиги */}
              {nextTierProgress && (
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <span>
                      {nextTierProgress.next
                        ? `${txt.nextRankPrefix} ${nextTierProgress.next.emoji} ${nextTierProgress.next.title}`
                        : txt.maxRankReached}
                    </span>
                    {nextTierProgress.next && (
                      <strong>+{nextTierProgress.remaining} MMR</strong>
                    )}
                  </div>
                  <div
                    style={{
                      height: "8px",
                      borderRadius: "999px",
                      backgroundColor: "var(--bg-surface)",
                      border: "1px solid var(--border-subtle)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${nextTierProgress.pct}%`,
                        height: "100%",
                        backgroundColor: summary.rankTier.color,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Вкладки */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <Button
            variant={tab === "leaderboard" ? "primary" : "secondary"}
            onClick={() => setTab("leaderboard")}
            style={{ gap: "7px" }}
          >
            <Trophy size={15} /> {txt.tabs.leaderboard}
          </Button>
          {canUsePersonal && (
            <Button
              variant={tab === "friends" ? "primary" : "secondary"}
              onClick={() => setTab("friends")}
              style={{ gap: "7px" }}
            >
              <Users size={15} /> {txt.tabs.friends}
              {friendsData.incoming.length > 0 && (
                <Badge variant="accent">{friendsData.incoming.length}</Badge>
              )}
            </Button>
          )}
          <Button
            variant={tab === "history" ? "primary" : "secondary"}
            onClick={() => setTab("history")}
            style={{ gap: "7px" }}
          >
            <History size={15} /> {txt.tabs.history}
          </Button>
        </div>

        {/* ── ВКЛАДКА 1: ОБЩЕДОСТУПНЫЙ РЕЙТИНГ TASK-SYSTEM ── */}
        {tab === "leaderboard" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            {/* Подиум Top-3 */}
            {topThree.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "12px",
                }}
              >
                {topThree.map((entry, idx) => {
                  const medals = ["🥇", "🥈", "🥉"];
                  const borders = ["#f59e0b", "#94a3b8", "#d97706"];
                  return (
                    <Card
                      key={entry.id}
                      style={{
                        padding: "16px",
                        borderColor: `${borders[idx]}88`,
                        backgroundColor: "var(--surface)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "22px" }}>{medals[idx]}</span>
                        <span
                          style={{
                            fontSize: "11.5px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "999px",
                            color: entry.rankTier.color,
                            border: `1px solid ${entry.rankTier.color}55`,
                          }}
                        >
                          {entry.rankTier.emoji} {entry.rankTier.title}
                        </span>
                      </div>
                      <div style={{ fontSize: "17px", fontWeight: 700 }}>
                        {LANG_FLAGS[entry.studyLanguage] || "🌐"} @{entry.nickname}
                        {summary?.id === entry.id && (
                          <span style={{ marginLeft: "8px" }}>
                            <Badge variant="accent">{txt.youBadge}</Badge>
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                        <span style={{ fontSize: "22px", fontWeight: 800, color: borders[idx] }}>
                          {entry.mmr} MMR
                        </span>
                        <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                          {entry.cardsCount} {txt.cardsShort} • {entry.resourcesCount}{" "}
                          {txt.resShort}
                        </span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Фильтр и поиск */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: "220px", maxWidth: "360px" }}>
                <Input
                  icon={<Search size={15} />}
                  placeholder={txt.searchPlaceholder}
                  value={searchBoard}
                  onChange={(e) => setSearchBoard(e.target.value)}
                />
              </div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {(
                  [
                    { id: "", label: txt.allLangs },
                    { id: "ja", label: "🇯🇵 JA" },
                    { id: "en", label: "🇬🇧 EN" },
                    { id: "de", label: "🇩🇪 DE" },
                  ] as const
                ).map((opt) => (
                  <Button
                    key={opt.id || "all"}
                    variant={langFilter === opt.id ? "primary" : "secondary"}
                    onClick={() => setLangFilter(opt.id)}
                    style={{ padding: "6px 12px", fontSize: "12.5px" }}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Таблица */}
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: "13.5px",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        textAlign: "left",
                        borderBottom: "1px solid var(--border)",
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-muted)",
                        fontSize: "12px",
                      }}
                    >
                      <th style={{ padding: "12px 14px", width: "55px" }}>{txt.colRank}</th>
                      <th style={{ padding: "12px 14px" }}>{txt.colPlayer}</th>
                      <th style={{ padding: "12px 14px" }}>{txt.colTier}</th>
                      <th style={{ padding: "12px 14px" }}>{txt.colActivity}</th>
                      <th style={{ padding: "12px 14px", textAlign: "right" }}>{txt.colMmr}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingBoard ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ padding: "28px", textAlign: "center", color: "var(--text-muted)" }}
                        >
                          KAVAULT...
                        </td>
                      </tr>
                    ) : globalBoard.entries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          style={{ padding: "28px", textAlign: "center", color: "var(--text-muted)" }}
                        >
                          {txt.noUsersFound}
                        </td>
                      </tr>
                    ) : (
                      globalBoard.entries.map((entry) => {
                        const isMe = summary?.id === entry.id;
                        return (
                          <tr
                            key={entry.id}
                            style={{
                              borderBottom: "1px solid var(--border-subtle)",
                              backgroundColor: isMe
                                ? "rgba(59, 130, 246, 0.08)"
                                : "transparent",
                            }}
                          >
                            <td style={{ padding: "12px 14px", fontWeight: 700 }}>
                              {entry.rank === 1
                                ? "🥇"
                                : entry.rank === 2
                                  ? "🥈"
                                  : entry.rank === 3
                                    ? "🥉"
                                    : `#${entry.rank}`}
                            </td>
                            <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                              <span style={{ marginRight: "6px" }}>
                                {LANG_FLAGS[entry.studyLanguage] || "🌐"}
                              </span>
                              @{entry.nickname}
                              {isMe && (
                                <span style={{ marginLeft: "8px" }}>
                                  <Badge variant="accent">
                                    {txt.youBadge}
                                  </Badge>
                                </span>
                              )}
                            </td>
                            <td style={{ padding: "12px 14px" }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: "5px",
                                  fontSize: "12px",
                                  fontWeight: 600,
                                  color: entry.rankTier.color,
                                }}
                              >
                                {entry.rankTier.emoji} {entry.rankTier.title}
                              </span>
                            </td>
                            <td style={{ padding: "12px 14px", color: "var(--text-muted)", fontSize: "12.5px" }}>
                              {entry.cardsCount} {txt.cardsShort} • {entry.resourcesCount}{" "}
                              {txt.resShort}
                            </td>
                            <td
                              style={{
                                padding: "12px 14px",
                                textAlign: "right",
                                fontWeight: 800,
                                color: entry.rankTier.color,
                              }}
                            >
                              {entry.mmr}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )}

        {/* ── ВКЛАДКА 2: ДРУЗЬЯ ПО НИКНЕЙМУ И ЛОКАЛЬНЫЙ РЕЙТИНГ ── */}
        {tab === "friends" && canUsePersonal && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            {/* Поиск и добавление друга по никнейму */}
            <Card style={{ padding: "var(--space-5)" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600 }}>
                {txt.addFriendTitle}
              </h3>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: "220px" }}>
                  <Input
                    icon={<Search size={15} />}
                    value={friendSearchQuery}
                    onChange={(e) => {
                      setFriendSearchQuery(e.target.value);
                      setFriendActionMsg("");
                    }}
                    placeholder={txt.addFriendPlaceholder}
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => handleSendFriendRequest(friendSearchQuery)}
                  disabled={friendSearchQuery.trim().length < 2}
                  style={{ gap: "6px" }}
                >
                  <UserPlus size={15} /> {txt.addByNickBtn}
                </Button>
              </div>

              {friendActionMsg && (
                <div style={{ marginTop: "10px", fontSize: "13px", color: "var(--accent)", fontWeight: 500 }}>
                  {friendActionMsg}
                </div>
              )}

              {friendSearchQuery.trim().length >= 2 && (
                <div style={{ marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {isSearchingUsers ? (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {txt.searchingUsers}
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {txt.noUsersFound}
                    </div>
                  ) : (
                    searchResults.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          flexWrap: "wrap",
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 600, fontSize: "14px" }}>
                            {LANG_FLAGS[u.studyLanguage] || "🌐"} @{u.nickname}{" "}
                            <span style={{ color: u.rankTier.color, fontSize: "12.5px", marginLeft: "6px" }}>
                              {u.rankTier.emoji} {u.mmr} MMR
                            </span>
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                            {u.cardsCount} {txt.cardsShort} • {u.resourcesCount} {txt.resShort}
                          </div>
                        </div>

                        <div>
                          {u.relationStatus === "NONE" && (
                            <Button
                              variant="secondary"
                              onClick={() => handleSendFriendRequest(u.nickname)}
                              style={{ padding: "5px 12px", fontSize: "12.5px", gap: "5px" }}
                            >
                              <UserPlus size={13} /> {txt.addBtn}
                            </Button>
                          )}
                          {u.relationStatus === "PENDING_SENT" && (
                            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                              <Badge variant="default">{txt.requestSent}</Badge>
                              {u.friendshipId && (
                                <Button
                                  variant="ghost"
                                  onClick={() => handleRemoveFriend(u.friendshipId!)}
                                  style={{ padding: "4px 8px", fontSize: "12px" }}
                                >
                                  <X size={13} />
                                </Button>
                              )}
                            </div>
                          )}
                          {u.relationStatus === "PENDING_RECEIVED" && u.friendshipId && (
                            <div style={{ display: "flex", gap: "6px" }}>
                              <Button
                                onClick={() => handleRespondRequest(u.friendshipId!, true)}
                                style={{ padding: "5px 10px", fontSize: "12px", gap: "4px" }}
                              >
                                <Check size={13} /> {txt.acceptBtn}
                              </Button>
                              <Button
                                variant="ghost"
                                onClick={() => handleRespondRequest(u.friendshipId!, false)}
                                style={{ padding: "5px 10px", fontSize: "12px" }}
                              >
                                {txt.declineBtn}
                              </Button>
                            </div>
                          )}
                          {u.relationStatus === "FRIENDS" && (
                            <Badge variant="success">
                              <UserCheck size={11} style={{ marginRight: "4px" }} />
                              {txt.alreadyFriends}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </Card>

            {/* Входящие заявки */}
            {friendsData.incoming.length > 0 && (
              <Card style={{ padding: "var(--space-5)", borderColor: "var(--accent)" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 600 }}>
                  {txt.incomingTitle} ({friendsData.incoming.length})
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {friendsData.incoming.map((req) => (
                    <div
                      key={req.friendshipId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div>
                        <strong>@{req.nickname}</strong>{" "}
                        <span style={{ color: req.rankTier.color, fontSize: "12.5px" }}>
                          • {req.rankTier.emoji} {req.mmr} MMR
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <Button
                          onClick={() => handleRespondRequest(req.friendshipId, true)}
                          style={{ padding: "5px 12px", fontSize: "12px", gap: "4px" }}
                        >
                          <Check size={13} /> {txt.acceptBtn}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => handleRespondRequest(req.friendshipId, false)}
                          style={{ padding: "5px 10px", fontSize: "12px" }}
                        >
                          {txt.declineBtn}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Исходящие заявки */}
            {friendsData.outgoing.length > 0 && (
              <Card style={{ padding: "var(--space-5)" }}>
                <h3 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: 600 }}>
                  {txt.outgoingTitle} ({friendsData.outgoing.length})
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {friendsData.outgoing.map((out) => (
                    <div
                      key={out.friendshipId}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        padding: "6px 10px",
                        borderRadius: "999px",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border)",
                        fontSize: "12.5px",
                      }}
                    >
                      <span>@{out.nickname}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFriend(out.friendshipId)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "var(--text-muted)",
                          cursor: "pointer",
                          padding: 0,
                          display: "inline-flex",
                        }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Рейтинг среди друзей + управление списком друзей */}
            <Card style={{ padding: "var(--space-5)" }}>
              <h3 style={{ margin: "0 0 14px 0", fontSize: "16px", fontWeight: 600 }}>
                {txt.friendsLeaderboardTitle}
              </h3>
              {friendsData.friends.length === 0 ? (
                <div style={{ color: "var(--text-muted)", fontSize: "13.5px" }}>
                  {txt.noFriendsYet}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {friendsBoard.map((entry) => {
                    const friendRecord = friendsData.friends.find((f) => f.id === entry.id);
                    return (
                      <div
                        key={entry.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: "12px",
                          padding: "12px 14px",
                          borderRadius: "var(--radius-md)",
                          border: `1px solid ${entry.isSelf ? "var(--accent)" : "var(--border-subtle)"}`,
                          backgroundColor: entry.isSelf
                            ? "rgba(59, 130, 246, 0.08)"
                            : "var(--bg-surface)",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span style={{ fontWeight: 800, width: "26px" }}>#{entry.rank}</span>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: "14px" }}>
                              {LANG_FLAGS[entry.studyLanguage] || "🌐"} @{entry.nickname}
                              {entry.isSelf && (
                                <span style={{ marginLeft: "8px" }}>
                                  <Badge variant="accent">
                                    {txt.youBadge}
                                  </Badge>
                                </span>
                              )}
                            </div>
                            <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                              {entry.rankTier.emoji} {entry.rankTier.title} • {entry.cardsCount}{" "}
                              {txt.cardsShort}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: 800,
                              color: entry.rankTier.color,
                            }}
                          >
                            {entry.mmr} MMR
                          </span>
                          {friendRecord && (
                            <button
                              type="button"
                              onClick={() => handleRemoveFriend(friendRecord.friendshipId)}
                              title={txt.removeFriendBtn}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-muted)",
                                cursor: "pointer",
                                padding: "4px",
                              }}
                            >
                              <UserMinus size={15} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── ВКЛАДКА 3: ПРАВИЛА TASK-SYSTEM И ИСТОРИЯ MMR ── */}
        {tab === "history" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                gap: "16px",
              }}
            >
              {/* Лиги Task-System */}
              <Card style={{ padding: "var(--space-5)" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Crown size={17} style={{ color: "#f59e0b" }} />
                  {txt.tiersTitle}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {visibleTiers.map((tier) => (
                    <div
                      key={tier.key}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "9px 12px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-surface)",
                        border:
                          summary?.rankTier.key === tier.key
                            ? `1px solid ${tier.color}`
                            : "1px solid var(--border-subtle)",
                      }}
                    >
                      <span style={{ fontWeight: 600, color: tier.color }}>
                        {tier.emoji} {tier.title}
                      </span>
                      <Badge variant="default">{tier.minMmr}+ MMR</Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Как получать MMR */}
              <Card style={{ padding: "var(--space-5)" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Zap size={17} style={{ color: "#10b981" }} />
                  {txt.howToEarnTitle}
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {txt.rulesList.map((rule) => (
                    <div
                      key={rule.label}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        padding: "9px 12px",
                        borderRadius: "var(--radius-md)",
                        backgroundColor: "var(--bg-surface)",
                        border: "1px solid var(--border-subtle)",
                        fontSize: "13px",
                      }}
                    >
                      <span style={{ color: "var(--text-secondary)" }}>{rule.label}</span>
                      <Badge variant="success">{rule.mmr}</Badge>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Журнал начислений пользователя */}
            {canUsePersonal && summary && (
              <Card style={{ padding: "var(--space-5)" }}>
                <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}>
                  <Award size={17} style={{ color: "var(--accent)" }} />
                  {txt.recentLogsTitle}
                </h3>
                {summary.recentLogs.length === 0 ? (
                  <div style={{ color: "var(--text-muted)", fontSize: "13px" }}>
                    {txt.noLogsYet}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {summary.recentLogs.map((log) => (
                      <div
                        key={log.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "9px 12px",
                          borderRadius: "var(--radius-md)",
                          backgroundColor: "var(--bg-surface)",
                          border: "1px solid var(--border-subtle)",
                          fontSize: "13px",
                        }}
                      >
                        <div>
                          <span style={{ fontWeight: 600 }}>
                            <Sparkles size={12} style={{ display: "inline", marginRight: "6px", color: "#f59e0b" }} />
                            {txt.reasonsMap[log.reason] || log.reason}
                          </span>
                          <span style={{ marginLeft: "10px", fontSize: "11.5px", color: "var(--text-muted)" }}>
                            {new Date(log.createdAt).toLocaleString(locale)}
                          </span>
                        </div>
                        <Badge variant="success">+{log.delta} MMR</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
