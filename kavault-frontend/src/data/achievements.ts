import type { Language } from "../i18n/translations";

export type AchievementCategory =
  | "all"
  | "japanese"
  | "dev"
  | "github"
  | "tracker"
  | "graph"
  | "system"
  | "secret";

export type AchievementRarity = "common" | "rare" | "epic" | "legendary";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  rarity: AchievementRarity;
  points: number;
  isSecret?: boolean;
  secretHint?: string;
  secretUnlockedDesc?: string;
}

export const CATEGORY_LABELS_BY_LANG: Record<Language, Record<AchievementCategory, string>> = {
  ru: {
    all: "Все",
    japanese: "Японский",
    dev: "Разработка",
    github: "GitHub",
    tracker: "Дисциплина",
    graph: "Граф Знаний",
    system: "Система",
    secret: "Секретные",
  },
  en: {
    all: "All",
    japanese: "Japanese",
    dev: "Dev Hub",
    github: "GitHub",
    tracker: "Discipline",
    graph: "Knowledge Graph",
    system: "System",
    secret: "Secret",
  },
  ja: {
    all: "すべて",
    japanese: "日本語",
    dev: "開発ハブ",
    github: "GitHub",
    tracker: "継続力",
    graph: "ナレッジグラフ",
    system: "システム",
    secret: "シークレット",
  },
};

export const CATEGORY_LABELS: Record<AchievementCategory, string> = CATEGORY_LABELS_BY_LANG.ru;

export const ACHIEVEMENTS: Achievement[] = [
  // ЯПОНСКИЙ ЯЗЫК (8 АЧИВОК)
  {
    id: "jap_first_word",
    title: "Первый иероглиф",
    description: "Добавить своё первое японское слово или кандзи в словарь.",
    category: "japanese",
    icon: "🈸",
    rarity: "common",
    points: 10,
  },
  {
    id: "jap_kana_10",
    title: "Повелитель Каны",
    description: "Собрать 10 слов в разделе Хираганы и Катаканы.",
    category: "japanese",
    icon: "🌸",
    rarity: "common",
    points: 20,
  },
  {
    id: "jap_kanji_10",
    title: "Студент Кандзи",
    description: "Добавить 10 карточек с кандзи в раздел изучения.",
    category: "japanese",
    icon: "⛩️",
    rarity: "rare",
    points: 25,
  },
  {
    id: "jap_first_review",
    title: "Сенсей Памяти",
    description: "Успешно завершить первую тренировку интервального повторения (SRS).",
    category: "japanese",
    icon: "🧠",
    rarity: "common",
    points: 15,
  },
  {
    id: "jap_review_50",
    title: "Самурай Дисциплины",
    description: "Пройти 50 повторений карточек в режиме тренировки.",
    category: "japanese",
    icon: "⚡",
    rarity: "epic",
    points: 50,
  },
  {
    id: "jap_words_25",
    title: "Токийский Студент",
    description: "Собрать общую коллекцию из 25 японских слов.",
    category: "japanese",
    icon: "🍱",
    rarity: "rare",
    points: 30,
  },
  {
    id: "jap_kanji_25",
    title: "Мастер Онъёми",
    description: "Освоить и сохранить 25 сложных иероглифов кандзи.",
    category: "japanese",
    icon: "🗼",
    rarity: "epic",
    points: 50,
  },
  {
    id: "jap_words_100",
    title: "Живой Словарь N5",
    description: "Накопить более 100 японских карточек в своём хабе.",
    category: "japanese",
    icon: "📜",
    rarity: "legendary",
    points: 100,
  },

  // РАЗРАБОТКА И КОД (6 АЧИВОК)
  {
    id: "dev_first_resource",
    title: "Hello, World!",
    description: "Сохранить свой первый материал или сниппет в Developer Hub.",
    category: "dev",
    icon: "💻",
    rarity: "common",
    points: 10,
  },
  {
    id: "dev_categories_3",
    title: "Стек Технологий",
    description: "Сохранить материалы в трёх разных категориях или типах контента.",
    category: "dev",
    icon: "🧱",
    rarity: "rare",
    points: 25,
  },
  {
    id: "dev_resources_10",
    title: "Библиотека Знаний",
    description: "Накопить 10 полезных сниппетов, библиотек или статей.",
    category: "dev",
    icon: "📚",
    rarity: "rare",
    points: 30,
  },
  {
    id: "dev_resources_25",
    title: "Архитектор Систем",
    description: "Собрать обширную базу из 25 ресурсов в Developer Hub.",
    category: "dev",
    icon: "🏗️",
    rarity: "epic",
    points: 50,
  },
  {
    id: "dev_with_notes",
    title: "Чистый Код",
    description: "Написать персональную Markdown-заметку или инсайт к сохраненному ресурсу.",
    category: "dev",
    icon: "✍️",
    rarity: "common",
    points: 15,
  },
  {
    id: "dev_with_tags",
    title: "Повелитель Тегов",
    description: "Привязать теги для категоризации своих сниппетов и статей.",
    category: "dev",
    icon: "🏷️",
    rarity: "common",
    points: 15,
  },

  // GITHUB COLLECTION (4 АЧИВКИ)
  {
    id: "git_first_repo",
    title: "Звёздный Странник",
    description: "Добавить первый интересный репозиторий в GitHub Collection.",
    category: "github",
    icon: "⭐",
    rarity: "common",
    points: 10,
  },
  {
    id: "git_repos_5",
    title: "Open Source Исследователь",
    description: "Сохранить 5 крутых проектов с открытым исходным кодом.",
    category: "github",
    icon: "🐙",
    rarity: "common",
    points: 20,
  },
  {
    id: "git_repos_15",
    title: "Хранитель Репозиториев",
    description: "Собрать коллекцию из 15 GitHub проектов для изучения.",
    category: "github",
    icon: "📦",
    rarity: "rare",
    points: 35,
  },
  {
    id: "git_multilang",
    title: "Полиглот Технологий",
    description: "Сохранить репозитории на разных языках программирования.",
    category: "github",
    icon: "🌐",
    rarity: "rare",
    points: 30,
  },

  // ТРЕКЕР И ДИСЦИПЛИНА (6 АЧИВОК)
  {
    id: "track_first_goal",
    title: "Точный Прицел",
    description: "Настроить персональные учебные цели в Настройках или Трекере.",
    category: "tracker",
    icon: "🎯",
    rarity: "common",
    points: 10,
  },
  {
    id: "track_streak_3",
    title: "В огне!",
    description: "Поддерживать непрерывный стрик активности 3 дня подряд.",
    category: "tracker",
    icon: "🔥",
    rarity: "common",
    points: 20,
  },
  {
    id: "track_streak_7",
    title: "Железная Воля",
    description: "Удерживать стрик обучения в течение целой недели (7 дней).",
    category: "tracker",
    icon: "⚔️",
    rarity: "rare",
    points: 40,
  },
  {
    id: "track_streak_14",
    title: "Легенда Дисциплины",
    description: "Достичь выдающегося стрика в 14 дней непрерывной работы.",
    category: "tracker",
    icon: "👑",
    rarity: "epic",
    points: 75,
  },
  {
    id: "track_time_120",
    title: "Фокус и Погружение",
    description: "Провести за изучением материалов суммарно более 120 минут.",
    category: "tracker",
    icon: "⏳",
    rarity: "rare",
    points: 30,
  },
  {
    id: "track_daily_done",
    title: "Идеальный День",
    description: "Выполнить все дневные задачи и норму карточек на 100%.",
    category: "tracker",
    icon: "💯",
    rarity: "rare",
    points: 30,
  },

  // ГРАФ ЗНАНИЙ (3 АЧИВКИ)
  {
    id: "graph_first_visit",
    title: "Первая Нейросеть",
    description: "Открыть интерактивный Граф Знаний и исследовать связи.",
    category: "graph",
    icon: "🕸️",
    rarity: "common",
    points: 10,
  },
  {
    id: "graph_nodes_20",
    title: "Паутина Мыслей",
    description: "Развить свой граф знаний до 20 взаимосвязанных узлов.",
    category: "graph",
    icon: "🌌",
    rarity: "rare",
    points: 30,
  },
  {
    id: "graph_nodes_50",
    title: "Нейромозг",
    description: "Построить масштабную сеть из более чем 50 узлов в графе.",
    category: "graph",
    icon: "🔮",
    rarity: "epic",
    points: 60,
  },

  // СИСТЕМА И ИССЛЕДОВАТЕЛЬ (3 АЧИВКИ)
  {
    id: "sys_theme_switch",
    title: "Владыка Стиля",
    description: "Кастомизировать интерфейс KAVAULT (тема оформления или акцентный цвет).",
    category: "system",
    icon: "🌙",
    rarity: "common",
    points: 10,
  },
  {
    id: "sys_all_pages",
    title: "Инспектор KAVAULT",
    description: "Посетить все основные разделы хранилища хотя бы один раз.",
    category: "system",
    icon: "🗺️",
    rarity: "rare",
    points: 35,
  },
  {
    id: "sys_total_50",
    title: "Хранитель Хранилища",
    description: "Накопить суммарно более 50 карточек, сниппетов и репозиториев.",
    category: "system",
    icon: "💎",
    rarity: "epic",
    points: 50,
  },

  // СЕКРЕТНАЯ АЧИВКА (1 АЧИВКА ПОЛЬЗОВАТЕЛЯ!)
  {
    id: "secret_mr_a",
    title: "Некий мистер А",
    description: "Вы раскрыли тайну Создателя. Добро пожаловать, мистер А!",
    category: "secret",
    icon: "🕶️",
    rarity: "legendary",
    points: 100,
    isSecret: true,
    secretHint: "Личность скрыта завесой тайны. Известно лишь, что он стоит у самых истоков...",
    secretUnlockedDesc: "Зарегистрировать аккаунт и поставить себе никнейм Андрей на любом из языков.",
  },
];

interface LocalizedAchievementText {
  title: string;
  description: string;
  secretHint?: string;
  secretUnlockedDesc?: string;
}

const ACHIEVEMENT_TRANSLATIONS: Record<string, Record<"en" | "ja", LocalizedAchievementText>> = {
  jap_first_word: {
    en: { title: "First Character", description: "Add your first Japanese word or Kanji to the deck." },
    ja: { title: "最初の一文字", description: "最初の日本語の単語または漢字をデッキに追加する。" },
  },
  jap_kana_10: {
    en: { title: "Kana Master", description: "Collect 10 words in the Hiragana & Katakana section." },
    ja: { title: "かなマスター", description: "ひらがな・カタカナセクションに単語を10個集める。" },
  },
  jap_kanji_10: {
    en: { title: "Kanji Student", description: "Add 10 Kanji cards to your study deck." },
    ja: { title: "漢字の学習者", description: "漢字カードを10枚学習デッキに追加する。" },
  },
  jap_first_review: {
    en: { title: "Memory Sensei", description: "Complete your first Spaced Repetition (SRS) review session." },
    ja: { title: "記憶の先生", description: "最初の間隔反復学習（SRS）セッションを完了する。" },
  },
  jap_review_50: {
    en: { title: "Samurai of Discipline", description: "Complete 50 flashcard reviews in study mode." },
    ja: { title: "規律の侍", description: "練習モードで合計50回のカード復習を達成する。" },
  },
  jap_words_25: {
    en: { title: "Tokyo Scholar", description: "Build a Japanese vocabulary collection of 25 words." },
    ja: { title: "東京のスカラー", description: "合計25語の日本語単語コレクションを作る。" },
  },
  jap_kanji_25: {
    en: { title: "Onyomi Master", description: "Save and study 25 Kanji cards." },
    ja: { title: "音読みの達人", description: "25個の漢字カードを保存して学習する。" },
  },
  jap_words_100: {
    en: { title: "Living N5 Dictionary", description: "Accumulate over 100 Japanese cards in your hub." },
    ja: { title: "生きたN5辞典", description: "日本語ハブに100枚以上のカードを蓄積する。" },
  },
  dev_first_resource: {
    en: { title: "Hello, World!", description: "Save your first resource or snippet in Developer Hub." },
    ja: { title: "Hello, World!", description: "開発者ハブに最初の資料またはスニペットを保存する。" },
  },
  dev_categories_3: {
    en: { title: "Tech Stack", description: "Save materials across three different categories or types." },
    ja: { title: "テックスタック", description: "3種類の異なるカテゴリ・形式の資料を保存する。" },
  },
  dev_resources_10: {
    en: { title: "Knowledge Library", description: "Collect 10 helpful snippets, libraries, or articles." },
    ja: { title: "知識の図書館", description: "役立つスニペットや記事を10件集める。" },
  },
  dev_resources_25: {
    en: { title: "Systems Architect", description: "Build an extensive base of 25 resources in Developer Hub." },
    ja: { title: "システム設計者", description: "開発者ハブに25件のリソースを構築する。" },
  },
  dev_with_notes: {
    en: { title: "Clean Code", description: "Write a personal Markdown note on any saved resource." },
    ja: { title: "クリーンコード", description: "保存したリソースにMarkdownメモを書き残す。" },
  },
  dev_with_tags: {
    en: { title: "Tag Lord", description: "Attach tags to categorize your snippets and articles." },
    ja: { title: "タグの支配者", description: "記事やスニペットにタグを付けて整理する。" },
  },
  git_first_repo: {
    en: { title: "Star Voyager", description: "Bookmark your first repository in GitHub Collection." },
    ja: { title: "星の旅人", description: "GitHubコレクションに最初のリポジトリを追加する。" },
  },
  git_repos_5: {
    en: { title: "Open Source Explorer", description: "Save 5 awesome open-source projects." },
    ja: { title: "OSSエクスプローラー", description: "オープンソースプロジェクトを5件保存する。" },
  },
  git_repos_15: {
    en: { title: "Repository Keeper", description: "Gather a collection of 15 GitHub projects to study." },
    ja: { title: "リポジトリの番人", description: "学習用に15件のGitHubプロジェクトを集める。" },
  },
  git_multilang: {
    en: { title: "Tech Polyglot", description: "Save repositories across multiple programming languages." },
    ja: { title: "技術ポリグロット", description: "複数のプログラミング言語のリポジトリを保存する。" },
  },
  track_first_goal: {
    en: { title: "Sharp Focus", description: "Configure personal study goals in Settings or Tracker." },
    ja: { title: "正確な照準", description: "設定またはトラッカーで個人の学習目標を設定する。" },
  },
  track_streak_3: {
    en: { title: "On Fire!", description: "Maintain a continuous 3-day study streak." },
    ja: { title: "絶好調！", description: "3日連続の学習ストリークを維持する。" },
  },
  track_streak_7: {
    en: { title: "Iron Will", description: "Keep your learning streak alive for a full week (7 days)." },
    ja: { title: "鉄の意志", description: "1週間（7日間）連続で学習ストリークを保つ。" },
  },
  track_streak_14: {
    en: { title: "Legend of Discipline", description: "Reach an extraordinary 14-day continuous streak." },
    ja: { title: "規律の伝説", description: "14日連続の学習記録を達成する。" },
  },
  track_time_120: {
    en: { title: "Deep Immersion", description: "Spend over 120 cumulative minutes studying materials." },
    ja: { title: "深い没入", description: "合計120分以上の学習時間を達成する。" },
  },
  track_daily_done: {
    en: { title: "Perfect Day", description: "Complete 100% of daily tasks and flashcard reviews." },
    ja: { title: "完璧な一日", description: "その日のタスクと復習ノルマを100%達成する。" },
  },
  graph_first_visit: {
    en: { title: "First Neural Net", description: "Open the interactive Knowledge Graph and explore connections." },
    ja: { title: "最初の神経網", description: "ナレッジグラフを開いて知識のつながりを探索する。" },
  },
  graph_nodes_20: {
    en: { title: "Web of Thoughts", description: "Grow your Knowledge Graph to 20 interconnected nodes." },
    ja: { title: "思考のクモの巣", description: "ナレッジグラフを20ノード以上に成長させる。" },
  },
  graph_nodes_50: {
    en: { title: "Neural Brain", description: "Build a large network of over 50 nodes in the graph." },
    ja: { title: "ニューラルブレイン", description: "50ノード以上の大規模ナレッジネットワークを構築する。" },
  },
  sys_theme_switch: {
    en: { title: "Lord of Style", description: "Customize KAVAULT interface (color theme or accent color)." },
    ja: { title: "スタイルの主", description: "KAVAULTのテーマまたはアクセントカラーをカスタマイズする。" },
  },
  sys_all_pages: {
    en: { title: "KAVAULT Inspector", description: "Visit all main sections of your vault at least once." },
    ja: { title: "KAVAULT探索者", description: "アプリのすべての主要セクションを一度以上訪れる。" },
  },
  sys_total_50: {
    en: { title: "Keeper of the Vault", description: "Accumulate over 50 total cards, snippets, and repositories." },
    ja: { title: "保存庫の守護者", description: "単語・資料・リポジトリを合計50件以上蓄積する。" },
  },
  secret_mr_a: {
    en: {
      title: "A Certain Mr. A",
      description: "You uncovered the Creator's secret. Welcome, Mr. A!",
      secretHint: "His identity is shrouded in mystery. Only known to stand at the very beginning...",
      secretUnlockedDesc: "Register an account and set your nickname to Andrey in any language.",
    },
    ja: {
      title: "謎のミスターA",
      description: "開発者の秘密を解き明かしました。ようこそ、ミスターA！",
      secretHint: "正体は謎のベールに包まれている。原点に立つ者であることだけが知られている...",
      secretUnlockedDesc: "アカウント登録時または設定でニックネームを任意の言語で「Андрей / Andrey」にする。",
    },
  },
};

export function localizeAchievement<T extends Achievement>(ach: T, lang: Language): T {
  if (lang === "ru") return ach;
  const tr = ACHIEVEMENT_TRANSLATIONS[ach.id]?.[lang];
  if (!tr) return ach;
  return {
    ...ach,
    title: tr.title,
    description: tr.description,
    secretHint: tr.secretHint ?? ach.secretHint,
    secretUnlockedDesc: tr.secretUnlockedDesc ?? ach.secretUnlockedDesc,
  };
}

// Проверка секретного условия "Некий мистер А"
export function checkIsMrA(username?: string, email?: string): boolean {
  const normName = (username || "").trim().toLowerCase();
  const normEmail = (email || "").trim().toLowerCase();

  const andreyPatterns = [
    "андрей",
    "andrey",
    "andrei",
    "andrew",
    "andre",
    "andré",
    "andres",
    "andrij",
    "andriy",
    "andrea",
    "андрюха",
    "андрюша",
    "андрейка",
    "андрюс",
    "アンドレイ",
    "アンドリュー",
    "アンドレ",
    "安德烈",
  ];

  return (
    andreyPatterns.some((pattern) => normName.includes(pattern)) ||
    andreyPatterns.some((pattern) => normEmail.includes(pattern))
  );
}
