import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/axios";

type Language = "en" | "ru" | "ja";
type Theme = "light" | "dark";

// ПОЛНЫЙ СЛОВАРЬ ПРИЛОЖЕНИЯ
const translations = {
  en: {
    nav: {
      dashboard: "Dashboard",
      developer: "Developer Hub",
      github: "GitHub Collection",
      japanese: "Japanese Hub",
      tracker: "Learning Tracker",
      graph: "Knowledge Graph",
      settings: "Settings",
      admin: "Creator Panel",
    },
    dash: {
      goodMorning: "Good morning",
      subtitle: "Keep going. Knowledge is power.",
      resources: "Total Resources",
      words: "Japanese Words",
      time: "Learning Time",
      progress: "Your Progress",
      keepGoing: "Keep going!",
      doingGreat:
        "You're doing great. You've completed most of your tasks for this week.",
      tasks: "Today's Tasks",
      allDone: "All done!",
      continue: "Continue Learning →",
      logout: "Logout",
    },
    dev: {
      title: "Developer Hub",
      subtitle: "Articles, tutorials, and documentation.",
      addResource: "Add Resource",
      titlePlaceholder: "Title (e.g. React 19 Features)",
      urlPlaceholder: "https://...",
      saveBtn: "Save",
      savedMaterials: "Saved Materials",
      searchPlaceholder: "Search...",
      noResources: "No resources found.",
      notesTitle: "Notes:",
      notePlaceholder:
        "Write your markdown notes, key takeaways, or summaries here...",
      cancel: "Cancel",
      saveNote: "Save Note",
    },
    git: {
      title: "GitHub Collection",
      subtitle: "Save and explore open-source projects.",
      addRepo: "Add Repository",
      namePlaceholder: "Repository Name (e.g. facebook/react)",
      urlPlaceholder: "https://github.com/...",
      saveBtn: "Save",
      savedProjects: "Saved Projects",
      searchPlaceholder: "Search repositories...",
      noRepos: "No repositories found.",
      notesTitle: "Notes:",
      notePlaceholder:
        "Write your markdown notes, architecture insights, or ideas here...",
      cancel: "Cancel",
      saveNote: "Save Note",
    },
    jap: {
      title: "Japanese Hub",
      subtitle: "Vocabulary, Kanji, and Grammar.",
      startReview: "Start Review →",
      addVocab: "Add Vocabulary",
      wordPlaceholder: "Word / Kanji (e.g. 未来)",
      readingPlaceholder: "Reading (e.g. みらい)",
      meaningPlaceholder: "Meaning (e.g. Future)",
      addBtn: "Add",
      yourDeck: "Your Deck",
      clickToFlip: "Click to flip",
      emptyDeck: "Your deck is empty. Add your first word above.",
    },
    track: {
      title: "Learning Tracker",
      subtitle: "Visualize your consistency and real goals.",
      heatmap: "Activity Heatmap",
      streak: "Current Streak",
      days: "Days",
      less: "Less",
      more: "More",
      goals: "Weekly Goals",
      artGoals: "React / Node.js Articles",
      japGoals: "Japanese SRS Reviews",
      milestones: "Recent Milestones",
      consistency: "Consistency is Key",
      logged: "Logged activity today!",
    },
    graph: {
      title: "Knowledge Graph",
      subtitle: "Discover connections between your resources.",
      nodes: "Nodes",
      vault: "Vault",
      topics: "Topics",
      resources: "Resources",
    },
  },
  ru: {
    nav: {
      dashboard: "Главная",
      developer: "База знаний",
      github: "GitHub Проекты",
      japanese: "Японский язык",
      tracker: "Трекер обучения",
      graph: "Граф знаний",
      settings: "Настройки",
      admin: "Панель Создателя",
    },
    dash: {
      goodMorning: "Доброе утро",
      subtitle: "Продолжай в том же духе. Знания — сила.",
      resources: "Всего ресурсов",
      words: "Японских слов",
      time: "Время обучения",
      progress: "Твой прогресс",
      keepGoing: "Так держать!",
      doingGreat: "Отличная работа. Большинство задач на эту неделю выполнено.",
      tasks: "Задачи на сегодня",
      allDone: "Выполнено!",
      continue: "Продолжить обучение →",
      logout: "Выйти",
    },
    dev: {
      title: "База знаний",
      subtitle: "Статьи, туториалы и документация.",
      addResource: "Добавить материал",
      titlePlaceholder: "Название (напр. Что нового в React 19)",
      urlPlaceholder: "https://...",
      saveBtn: "Сохранить",
      savedMaterials: "Сохраненные материалы",
      searchPlaceholder: "Поиск...",
      noResources: "Материалы не найдены.",
      notesTitle: "Заметки:",
      notePlaceholder:
        "Пиши свои конспекты, главные мысли или выводы здесь (поддерживается Markdown)...",
      cancel: "Отмена",
      saveNote: "Сохранить заметку",
    },
    git: {
      title: "GitHub Проекты",
      subtitle: "Сохраняй и изучай open-source проекты.",
      addRepo: "Добавить репозиторий",
      namePlaceholder: "Имя репозитория (напр. facebook/react)",
      urlPlaceholder: "https://github.com/...",
      saveBtn: "Сохранить",
      savedProjects: "Сохраненные проекты",
      searchPlaceholder: "Поиск проектов...",
      noRepos: "Репозитории не найдены.",
      notesTitle: "Заметки:",
      notePlaceholder:
        "Пиши свои заметки, разбор архитектуры или идеи здесь...",
      cancel: "Отмена",
      saveNote: "Сохранить заметку",
    },
    jap: {
      title: "Японский язык",
      subtitle: "Словарь, кандзи и грамматика.",
      startReview: "Начать повторение →",
      addVocab: "Добавить слово",
      wordPlaceholder: "Слово / Кандзи (напр. 未来)",
      readingPlaceholder: "Чтение (напр. みらい)",
      meaningPlaceholder: "Перевод (напр. Будущее)",
      addBtn: "Добавить",
      yourDeck: "Твоя колода",
      clickToFlip: "Нажми, чтобы перевернуть",
      emptyDeck: "Колода пуста. Добавь свое первое слово выше.",
    },
    track: {
      title: "Трекер обучения",
      subtitle: "Твоя стабильность и цели.",
      heatmap: "Активность",
      streak: "Текущий стрик",
      days: "Дней",
      less: "Меньше",
      more: "Больше",
      goals: "Цели на неделю",
      artGoals: "Статьи по React / Node.js",
      japGoals: "Повторение японского",
      milestones: "Недавние достижения",
      consistency: "Постоянство - ключ",
      logged: "Активность записана!",
    },
    graph: {
      title: "Граф знаний",
      subtitle: "Исследуй связи между твоими знаниями.",
      nodes: "Узлов",
      vault: "Хранилище",
      topics: "Темы",
      resources: "Материалы",
    },
  },
  ja: {
    nav: {
      dashboard: "ダッシュボード",
      developer: "開発者ハブ",
      github: "GitHubコレクション",
      japanese: "日本語ハブ",
      tracker: "学習トラッカー",
      graph: "ナレッジグラフ",
      settings: "設定",
      admin: "開発者パネル",
    },
    dash: {
      goodMorning: "おはよう",
      subtitle: "頑張って。知識は力なり。",
      resources: "リソース総数",
      words: "日本語の単語",
      time: "学習時間",
      progress: "進捗",
      keepGoing: "頑張って！",
      doingGreat: "よくやっています。今週のタスクのほとんどを完了しました。",
      tasks: "今日のタスク",
      allDone: "完了！",
      continue: "学習を続ける →",
      logout: "ログアウト",
    },
    dev: {
      title: "開発者ハブ",
      subtitle: "記事、チュートリアル、ドキュメント",
      addResource: "リソースを追加",
      titlePlaceholder: "タイトル（例：React 19の新機能）",
      urlPlaceholder: "https://...",
      saveBtn: "保存",
      savedMaterials: "保存された資料",
      searchPlaceholder: "検索...",
      noResources: "リソースが見つかりません。",
      notesTitle: "ノート：",
      notePlaceholder:
        "ここにマークダウンでノート、要点、まとめを書き込みます...",
      cancel: "キャンセル",
      saveNote: "ノートを保存",
    },
    git: {
      title: "GitHubコレクション",
      subtitle: "オープンソースプロジェクトの保存と探索",
      addRepo: "リポジトリを追加",
      namePlaceholder: "リポジトリ名（例：facebook/react）",
      urlPlaceholder: "https://github.com/...",
      saveBtn: "保存",
      savedProjects: "保存されたプロジェクト",
      searchPlaceholder: "リポジトリを検索...",
      noRepos: "リポジトリが見つかりません。",
      notesTitle: "ノート：",
      notePlaceholder: "ここにアーキテクチャの考察やアイデアを書き込みます...",
      cancel: "キャンセル",
      saveNote: "ノートを保存",
    },
    jap: {
      title: "日本語ハブ",
      subtitle: "語彙、漢字、文法",
      startReview: "復習を始める →",
      addVocab: "語彙を追加",
      wordPlaceholder: "単語 / 漢字（例：未来）",
      readingPlaceholder: "読み方（例：みらい）",
      meaningPlaceholder: "意味（例：未来）",
      addBtn: "追加",
      yourDeck: "あなたのデッキ",
      clickToFlip: "クリックして裏返す",
      emptyDeck: "デッキは空です。最初の単語を追加してください。",
    },
    track: {
      title: "学習トラッカー",
      subtitle: "一貫性と実際の目標を視覚化します。",
      heatmap: "アクティビティヒートマップ",
      streak: "現在のストリーク",
      days: "日",
      less: "少ない",
      more: "多い",
      goals: "今週の目標",
      artGoals: "React / Node.js の記事",
      japGoals: "日本語の復習",
      milestones: "最近の成果",
      consistency: "継続は力なり",
      logged: "今日のアクティビティを記録しました！",
    },
    graph: {
      title: "ナレッジグラフ",
      subtitle: "リソース間のつながりを発見します。",
      nodes: "ノード",
      vault: "ボルト",
      topics: "トピック",
      resources: "リソース",
    },
  },
};

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  t: typeof translations.en;
  isCreator: boolean;
  userEmail: string;
  checkUserRole: () => Promise<void>;
  activateCreatorMode: (pass: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("kavault_theme") as Theme) || "dark",
  );
  const [language, setLanguage] = useState<Language>(
    (localStorage.getItem("kavault_lang") as Language) || "en",
  );
  const [isCreator, setIsCreator] = useState<boolean>(() => {
    return localStorage.getItem("kavault_is_creator") === "true";
  });
  const [userEmail, setUserEmail] = useState("");

  const activateCreatorMode = (pass: string): boolean => {
    if (pass.trim() === "Redmi_1a") {
      setIsCreator(true);
      localStorage.setItem("kavault_is_creator", "true");
      return true;
    }
    return false;
  };

  const checkUserRole = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      if (localStorage.getItem("kavault_is_creator") !== "true") {
        setIsCreator(false);
      }
      setUserEmail("");
      return;
    }
    try {
      const resp = await api.get<{
        email?: string;
        isCreator?: boolean;
        role?: string;
      }>("/auth/profile");
      if (resp.data?.email) {
        setUserEmail(resp.data.email);
        const emailLower = resp.data.email.toLowerCase();
        const isAdm =
          Boolean(resp.data.isCreator) ||
          resp.data.role === "CREATOR" ||
          emailLower === "zerkalovandrey@kavoult.dev" ||
          emailLower === "zerkalovandrey@kavault.dev" ||
          emailLower.includes("zerkalovandrey") ||
          localStorage.getItem("kavault_is_creator") === "true";
        if (isAdm) {
          setIsCreator(true);
          localStorage.setItem("kavault_is_creator", "true");
        }
      }
    } catch {
      // При отсутствии сети сохраняем локальный статус Создателя
      if (localStorage.getItem("kavault_is_creator") === "true") {
        setIsCreator(true);
      }
    }
  };

  useEffect(() => {
    checkUserRole();
  }, []);

  // Установка темы на самый высокий уровень (HTML)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kavault_theme", theme);
  }, [theme]);

  // Сохранение языка
  useEffect(() => {
    localStorage.setItem("kavault_lang", language);
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        t: translations[language],
        isCreator,
        userEmail,
        checkUserRole,
        activateCreatorMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
