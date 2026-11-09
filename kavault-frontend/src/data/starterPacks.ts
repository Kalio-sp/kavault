export interface StarterCard {
  word: string;
  reading?: string;
  meaning: string;
  type: "KANA" | "KANJI" | "VOCABULARY";
}

export interface StarterResource {
  title: string;
  url: string;
  type: "ARTICLE" | "DOCUMENTATION" | "WEBSITE" | "REPOSITORY" | "VIDEO";
  tags: string[];
  note?: string;
}

export const STARTER_JAPANESE_CARDS: StarterCard[] = [
  // Приветствия и основы (Кана)
  { word: "ありがとう", reading: "arigatou", meaning: "Спасибо", type: "KANA" },
  { word: "こんにちは", reading: "konnichiwa", meaning: "Здравствуйте / Привет", type: "KANA" },
  { word: "さようなら", reading: "sayounara", meaning: "До свидания", type: "KANA" },
  { word: "はい", reading: "hai", meaning: "Да", type: "KANA" },
  { word: "いいえ", reading: "iie", meaning: "Нет", type: "KANA" },
  { word: "すみません", reading: "sumimasen", meaning: "Извините / Прошу прощения", type: "KANA" },
  { word: "おねがいします", reading: "onegaishimasu", meaning: "Пожалуйста (просьба)", type: "KANA" },
  { word: "おはよう", reading: "ohayou", meaning: "Доброе утро", type: "KANA" },
  { word: "こんばんは", reading: "konbanwa", meaning: "Добрый вечер", type: "KANA" },
  { word: "いただきます", reading: "itadakimasu", meaning: "Приятного аппетита (перед едой)", type: "KANA" },

  // Базовые существительные (Кана)
  { word: "みず", reading: "mizu", meaning: "Вода", type: "KANA" },
  { word: "おちゃ", reading: "ocha", meaning: "Зелёный чай", type: "KANA" },
  { word: "ごはん", reading: "gohan", meaning: "Рис / Еда", type: "KANA" },
  { word: "ほん", reading: "hon", meaning: "Книга", type: "KANA" },
  { word: "ねこ", reading: "neko", meaning: "Кот / Кошка", type: "KANA" },
  { word: "いぬ", reading: "inu", meaning: "Собака", type: "KANA" },
  { word: "くるま", reading: "kuruma", meaning: "Машина / Автомобиль", type: "KANA" },
  { word: "でんしゃ", reading: "densha", meaning: "Поезд / Электричка", type: "KANA" },
  { word: "ともだち", reading: "tomodachi", meaning: "Друг / Приятель", type: "KANA" },
  { word: "せんせい", reading: "sensei", meaning: "Учитель / Наставник", type: "KANA" },

  // Базовые глаголы (Кана)
  { word: "たべる", reading: "taberu", meaning: "Кушать / Есть", type: "KANA" },
  { word: "のむ", reading: "nomu", meaning: "Пить", type: "KANA" },
  { word: "みる", reading: "miru", meaning: "Смотреть / Видеть", type: "KANA" },
  { word: "きく", reading: "kiku", meaning: "Слушать / Слышать", type: "KANA" },
  { word: "いく", reading: "iku", meaning: "Идти / Ехать", type: "KANA" },
  { word: "くる", reading: "kuru", meaning: "Приходить / Приезжать", type: "KANA" },

  // Первые базовые Кандзи (N5)
  { word: "日", reading: "ひ / にち (hi / nichi)", meaning: "День / Солнце", type: "KANJI" },
  { word: "月", reading: "つき / げつ (tsuki / getsu)", meaning: "Луна / Месяц", type: "KANJI" },
  { word: "木", reading: "き / もく (ki / moku)", meaning: "Дерево", type: "KANJI" },
  { word: "山", reading: "やま / さん (yama / san)", meaning: "Гора", type: "KANJI" },
  { word: "川", reading: "かわ / せん (kawa / sen)", meaning: "Река", type: "KANJI" },
  { word: "人", reading: "ひと / じん (hito / jin)", meaning: "Человек", type: "KANJI" },
  { word: "水", reading: "みず / すい (mizu / sui)", meaning: "Вода (иероглиф)", type: "KANJI" },
  { word: "火", reading: "ひ / か (hi / ka)", meaning: "Огонь", type: "KANJI" },
  { word: "今日", reading: "きょう (kyou)", meaning: "Сегодня", type: "KANJI" },
  { word: "時間", reading: "じかん (jikan)", meaning: "Время", type: "KANJI" },
];

export const STARTER_DEVELOPER_RESOURCES: StarterResource[] = [
  {
    title: "React 19: Новые хуки use, useActionState и Server Actions",
    url: "https://react.dev/blog/2024/04/25/react-19",
    type: "DOCUMENTATION",
    tags: ["react", "frontend", "javascript"],
    note: "### Главное в React 19:\n- `use(Promise)` позволяет читать промисы прямо внутри компонентов без `useEffect`.\n- `useActionState` заменяет ручной стейт загрузки в формах.\n- Поддержка `ref` как обычного пропа без `forwardRef`.",
  },
  {
    title: "TypeScript Utility Types: Pick, Omit, Partial, Record",
    url: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
    type: "DOCUMENTATION",
    tags: ["typescript", "clean-code"],
    note: "### Шпаргалка типов:\n- `Pick<T, 'id' | 'title'>` — берет только указанные поля.\n- `Omit<T, 'password'>` — исключает поля.\n- `Record<string, User>` — словарь ключ-значение.",
  },
  {
    title: "Docker Essentials: Шпаргалка команд для разработки",
    url: "https://docs.docker.com/engine/reference/commandline/cli/",
    type: "ARTICLE",
    tags: ["docker", "devops", "backend"],
    note: "### Полезные команды:\n- `docker compose up -d --build` — собрать и запустить в фоне.\n- `docker compose logs -f backend` — стриминг логов бэкенда.\n- `docker system prune -f` — очистка неиспользуемых слоев.",
  },
  {
    title: "Modern Git: Rebase, Stash и интерактивная работа",
    url: "https://git-scm.com/book/ru/v2",
    type: "ARTICLE",
    tags: ["git", "workflow"],
    note: "### Горячие приемы Git:\n- `git stash push -m 'wip'` — спрятать изменения.\n- `git rebase -i HEAD~3` — объединить коммиты.\n- `git cherry-pick <hash>` — перенести один коммит в ветку.",
  },
  {
    title: "NestJS Architecture: Modules, Controllers, Services",
    url: "https://docs.nestjs.com/",
    type: "DOCUMENTATION",
    tags: ["nestjs", "backend", "nodejs"],
    note: "### Архитектурные принципы NestJS:\n- Контроллеры отвечают только за роутинг и валидацию HTTP.\n- Сервисы содержат чистую бизнес-логику.\n- PrismaService внедряется через DI (Dependency Injection).",
  },
  {
    title: "System Design Primer: Проектирование масштабных систем",
    url: "https://github.com/donnemartin/system-design-primer",
    type: "REPOSITORY",
    tags: ["architecture", "backend", "databases"],
    note: "Фундаментальный путеводитель по шардингу, кэшированию Redis, репликации PostgreSQL и балансировке нагрузок Nginx.",
  },
];

export const STARTER_GITHUB_REPOSITORIES: StarterResource[] = [
  {
    title: "facebook/react — Библиотека для создания интерфейсов",
    url: "https://github.com/facebook/react",
    type: "REPOSITORY",
    tags: ["react", "javascript", "frontend"],
    note: "Официальный репозиторий React 19.",
  },
  {
    title: "nestjs/nest — Прогрессивный фреймворк для Node.js",
    url: "https://github.com/nestjs/nest",
    type: "REPOSITORY",
    tags: ["nestjs", "typescript", "backend"],
    note: "Бэкенд KAVAULT построен именно на базе этой архитектуры.",
  },
  {
    title: "kamranahmedse/developer-roadmap — Интерактивные роадмапы",
    url: "https://github.com/kamranahmedse/developer-roadmap",
    type: "REPOSITORY",
    tags: ["roadmap", "learning", "career"],
    note: "Пошаговые карты развития для Frontend, Backend, DevOps и AI разработчиков.",
  },
  {
    title: "sindresorhus/awesome — Курируемые списки лучших инструментов",
    url: "https://github.com/sindresorhus/awesome",
    type: "REPOSITORY",
    tags: ["awesome", "resources"],
    note: "Огромная коллекция потрясающих библиотек и фреймворков для любого стека.",
  },
];
