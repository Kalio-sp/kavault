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

export const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  all: "Все",
  japanese: "Японский",
  dev: "Разработка",
  github: "GitHub",
  tracker: "Дисциплина",
  graph: "Граф Знаний",
  system: "Система",
  secret: "Секретные",
};

export const ACHIEVEMENTS: Achievement[] = [
  // ==========================================
  // ЯПОНСКИЙ ЯЗЫК (8 АЧИВОК)
  // ==========================================
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

  // ==========================================
  // РАЗРАБОТКА И КОД (6 АЧИВОК)
  // ==========================================
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

  // ==========================================
  // GITHUB COLLECTION (4 АЧИВКИ)
  // ==========================================
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

  // ==========================================
  // ТРЕКЕР И ДИСЦИПЛИНА (6 АЧИВОК)
  // ==========================================
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

  // ==========================================
  // ГРАФ ЗНАНИЙ (3 АЧИВКИ)
  // ==========================================
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

  // ==========================================
  // СИСТЕМА И ИССЛЕДОВАТЕЛЬ (3 АЧИВКИ)
  // ==========================================
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

  // ==========================================
  // СЕКРЕТНАЯ АЧИВКА (1 АЧИВКА ПОЛЬЗОВАТЕЛЯ!)
  // ==========================================
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
