import type { Language } from "../i18n/translations";
import type { StudyLanguage } from "./studyVibes";

export interface StarterCard {
  word: string;
  reading?: string;
  meaning: string;
  example?: string;
  type: "KANA" | "KANJI" | "VOCABULARY" | "GRAMMAR";
  language?: StudyLanguage;
  studyLevel?: string;
}

interface LocalizedStarterCardRaw {
  word: string;
  reading?: string;
  meanings: Record<Language, string>;
  example?: string;
  type: "KANA" | "KANJI" | "VOCABULARY" | "GRAMMAR";
  studyLevel: string;
}

export interface StarterResource {
  title: string;
  url: string;
  type: "ARTICLE" | "DOCUMENTATION" | "WEBSITE" | "REPOSITORY" | "VIDEO";
  tags: string[];
  note?: string;
}

const RAW_JAPANESE_CARDS: LocalizedStarterCardRaw[] = [
  // N5: Приветствия и базовые слова (Кана)
  { word: "ありがとう", reading: "arigatou", studyLevel: "N5", type: "KANA", example: "いつもありがとう！", meanings: { ru: "Спасибо", en: "Thank you", ja: "感謝の言葉" } },
  { word: "こんにちは", reading: "konnichiwa", studyLevel: "N5", type: "KANA", example: "こんにちは、お元気ですか。", meanings: { ru: "Здравствуйте / Привет", en: "Hello / Good afternoon", ja: "昼の挨拶" } },
  { word: "さようなら", reading: "sayounara", studyLevel: "N5", type: "KANA", meanings: { ru: "До свидания", en: "Goodbye", ja: "別れの挨拶" } },
  { word: "はい", reading: "hai", studyLevel: "N5", type: "KANA", meanings: { ru: "Да", en: "Yes", ja: "肯定の返事" } },
  { word: "いいえ", reading: "iie", studyLevel: "N5", type: "KANA", meanings: { ru: "Нет", en: "No", ja: "否定の返事" } },
  { word: "すみません", reading: "sumimasen", studyLevel: "N5", type: "KANA", example: "すみません、駅はどこですか。", meanings: { ru: "Извините / Прошу прощения", en: "Excuse me / Sorry", ja: "謝罪・呼びかけ" } },
  { word: "おねがいします", reading: "onegaishimasu", studyLevel: "N5", type: "KANA", meanings: { ru: "Пожалуйста (просьба)", en: "Please", ja: "依頼の表現" } },
  { word: "おはよう", reading: "ohayou", studyLevel: "N5", type: "KANA", meanings: { ru: "Доброе утро", en: "Good morning", ja: "朝の挨拶" } },
  { word: "みず", reading: "mizu", studyLevel: "N5", type: "KANA", meanings: { ru: "Вода", en: "Water", ja: "水 (おひや)" } },
  { word: "おちゃ", reading: "ocha", studyLevel: "N5", type: "KANA", meanings: { ru: "Зелёный чай", en: "Green tea", ja: "お茶" } },
  { word: "ごはん", reading: "gohan", studyLevel: "N5", type: "KANA", meanings: { ru: "Рис / Еда", en: "Rice / Meal", ja: "ご飯・食事" } },
  { word: "ともだち", reading: "tomodachi", studyLevel: "N5", type: "KANA", meanings: { ru: "Друг / Приятель", en: "Friend", ja: "友人" } },
  { word: "たべる", reading: "taberu", studyLevel: "N5", type: "KANA", meanings: { ru: "Кушать / Есть", en: "To eat", ja: "食事する" } },
  { word: "のむ", reading: "nomu", studyLevel: "N5", type: "KANA", meanings: { ru: "Пить", en: "To drink", ja: "飲み物を摂取する" } },

  // N5: Базовые Кандзи
  { word: "日", reading: "ひ / にち (hi / nichi)", studyLevel: "N5", type: "KANJI", meanings: { ru: "День / Солнце", en: "Day / Sun", ja: "太陽・一日" } },
  { word: "月", reading: "つき / げつ (tsuki / getsu)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Луна / Месяц", en: "Moon / Month", ja: "お月様・月日" } },
  { word: "山", reading: "やま / さん (yama / san)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Гора", en: "Mountain", ja: "高い地形" } },
  { word: "川", reading: "かわ / せん (kawa / sen)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Река", en: "River", ja: "流れる水" } },
  { word: "水", reading: "みず / すい (mizu / sui)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Вода (иероглиф)", en: "Water (Kanji)", ja: "お水" } },
  { word: "今日", reading: "きょう (kyou)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Сегодня", en: "Today", ja: "この日" } },

  // N4: Повседневные глаголы, прилагательные и иероглифы
  { word: "約束", reading: "やくそく (yakusoku)", studyLevel: "N4", type: "KANJI", example: "友だちと約束があります。", meanings: { ru: "Обещание / Договорённость", en: "Promise / Appointment", ja: "取り決め・約束" } },
  { word: "準備", reading: "じゅんび (junbi)", studyLevel: "N4", type: "KANJI", example: "旅行の準備をします。", meanings: { ru: "Подготовка", en: "Preparation", ja: "前もって用意すること" } },
  { word: "便利", reading: "べんり (benri)", studyLevel: "N4", type: "KANJI", example: "このアプリはとても便利です。", meanings: { ru: "Удобный", en: "Convenient", ja: "役に立って使いやすい" } },
  { word: "大切", reading: "たいせつ (taisetsu)", studyLevel: "N4", type: "KANJI", example: "時間はとても大切です。", meanings: { ru: "Важный / Дорогой", en: "Important / Precious", ja: "大事にすべきこと" } },
  { word: "説明する", reading: "せつめいする (setsumei suru)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Объяснять", en: "To explain", ja: "わかりやすく述べる" } },
  { word: "ちゅうもん", reading: "chuumon (注文)", studyLevel: "N4", type: "KANA", meanings: { ru: "Заказ (в кафе/онлайн)", en: "Order", ja: "注文すること" } },
  { word: "まちがえる", reading: "machigaeru", studyLevel: "N4", type: "KANA", meanings: { ru: "Ошибаться / Путать", en: "To make a mistake", ja: "誤る" } },
  { word: "れんしゅう", reading: "renshuu (練習)", studyLevel: "N4", type: "KANA", meanings: { ru: "Тренировка / Практика", en: "Practice", ja: "繰り返し学ぶこと" } },

  // N3: Средний уровень и культурная лексика
  { word: "経験", reading: "けいけん (keiken)", studyLevel: "N3", type: "KANJI", example: "いい経験になりました。", meanings: { ru: "Опыт", en: "Experience", ja: "実際に体験したこと" } },
  { word: "集中", reading: "しゅうちゅう (shuuchuu)", studyLevel: "N3", type: "KANJI", example: "静かな所で集中します。", meanings: { ru: "Концентрация / Фокус", en: "Concentration / Focus", ja: "意識を一つに集めること" } },
  { word: "印象", reading: "いんしょう (inshou)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Впечатление", en: "Impression", ja: "心に強く残る感じ" } },
  { word: "機会", reading: "きかい (kikai)", studyLevel: "N3", type: "KANJI", example: "良い機会を逃しません。", meanings: { ru: "Возможность / Случай", en: "Opportunity / Chance", ja: "物事をするのに良い折" } },
  { word: "きもち", reading: "kimochi (気持ち)", studyLevel: "N3", type: "KANA", meanings: { ru: "Чувство / Настроение", en: "Feeling / Mood", ja: "心持ち・感情" } },
  { word: "やはり", reading: "yahari", studyLevel: "N3", type: "KANA", meanings: { ru: "Всё-таки / Как и ожидалось", en: "As expected / After all", ja: "思った通り" } },
];

const RAW_ENGLISH_CARDS: LocalizedStarterCardRaw[] = [
  // A1: Basics & Daily Survival
  { word: "Morning", reading: "[ˈmɔː.nɪŋ]", studyLevel: "A1", type: "VOCABULARY", example: "Good morning! Fancy a coffee?", meanings: { ru: "Утро", en: "The early part of the day", ja: "朝" } },
  { word: "Journey", reading: "[ˈdʒɜː.ni]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Путешествие, поездка", en: "An act of travelling from one place to another", ja: "旅・道のり" } },
  { word: "Library", reading: "[ˈlaɪ.brər.i]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Библиотека", en: "A place filled with books for reading", ja: "図書館" } },
  { word: "Wake up", reading: "phrasal verb", studyLevel: "A1", type: "GRAMMAR", example: "I usually wake up at 7 AM.", meanings: { ru: "Просыпаться", en: "Stop sleeping", ja: "目を覚ます" } },
  { word: "Check in", reading: "phrasal verb", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Заселиться / Зарегистрироваться", en: "Register at a hotel or airport", ja: "チェックインする" } },

  // A2: Everyday Confidence & Conversations
  { word: "Neighborhood", reading: "[ˈneɪ.bə.hʊd]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Район, окрестности", en: "Local area or district around home", ja: "近所・地域" } },
  { word: "Comfortable", reading: "[ˈkʌm.fə.tə.bəl]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Удобный, комфортный", en: "Giving physical or mental ease", ja: "快適な・心地よい" } },
  { word: "Curiosity", reading: "[ˌkjʊə.riˈɒs.ə.ti]", studyLevel: "A2", type: "VOCABULARY", example: "Curiosity sparks every great discovery.", meanings: { ru: "Любознательность", en: "Strong desire to know or learn", ja: "好奇心" } },
  { word: "Look forward to", reading: "phrasal verb", studyLevel: "A2", type: "GRAMMAR", example: "I look forward to visiting London.", meanings: { ru: "Ждать с нетерпением", en: "Await eagerly with pleasure", ja: "〜を楽しみに待つ" } },
  { word: "Figure out", reading: "phrasal verb", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Разобраться, понять", en: "Understand or solve something", ja: "理解する・解決する" } },
  { word: "Keep in touch", reading: "expression", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Поддерживать связь", en: "Maintain regular communication", ja: "連絡を取り合う" } },

  // B1: Fluency, Storytelling & Idioms
  { word: "Milestone", reading: "[ˈmaɪl.stəʊn]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Важная веха, этап", en: "A significant stage or achievement", ja: "重要な節目" } },
  { word: "Perspective", reading: "[pəˈspek.tɪv]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Точка зрения, ракурс", en: "A particular attitude or point of view", ja: "視点・見方" } },
  { word: "Authentic", reading: "[ɔːˈθen.tɪk]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Подлинный, настоящий", en: "Genuine and original", ja: "本物の" } },
  { word: "Break the ice", reading: "idiom", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Разрядить обстановку, начать общение", en: "Relieve tension at first meeting", ja: "緊張をほぐす" } },
  { word: "Put off", reading: "phrasal verb", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Откладывать на потом", en: "Postpone to a later time", ja: "先延ばしにする" } },
  { word: "Call it a day", reading: "idiom", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Закончить работу на сегодня", en: "Stop working for the day", ja: "今日はここまでにする" } },

  // B2: Nuanced, Academic & C1-bridge Vocabulary
  { word: "Resilient", reading: "[rɪˈzɪl.i.ənt]", studyLevel: "B2", type: "VOCABULARY", example: "Resilient learners adapt fast.", meanings: { ru: "Жизнестойкий, гибкий", en: "Able to recover quickly from challenges", ja: "回復力のある・しなやかな" } },
  { word: "Eloquent", reading: "[ˈel.ə.kwənt]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Красноречивый, выразительный", en: "Fluent and persuasive in speaking", ja: "雄弁な" } },
  { word: "Serendipity", reading: "[ˌser.ənˈdɪp.ə.ti]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Счастливая случайность", en: "Finding good things by chance", ja: "思いがけない幸運" } },
  { word: "Inevitable", reading: "[ɪˈnev.ɪ.tə.bəl]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Неизбежный, неминуемый", en: "Certain to happen; unavoidable", ja: "避けられない" } },
  { word: "Take into account", reading: "expression", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Принимать во внимание", en: "Consider when judging something", ja: "考慮に入れる" } },
  { word: "In the long run", reading: "idiom", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "В конечном счёте, в перспективе", en: "Over a long period eventually", ja: "長い目で見れば" } },
];

const RAW_GERMAN_CARDS: LocalizedStarterCardRaw[] = [
  // A1: Basisnomen (der/die/das) & Grußformeln
  { word: "das Wasser", reading: "[ˈvasɐ] · unzählbar", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Вода", en: "Water", ja: "水" } },
  { word: "das Buch", reading: "die Bücher", studyLevel: "A1", type: "VOCABULARY", example: "Ich lese ein interessantes Buch.", meanings: { ru: "Книга", en: "Book", ja: "本" } },
  { word: "der Kaffee", reading: "die Kaffees", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Кофе", en: "Coffee", ja: "コーヒー" } },
  { word: "die Stadt", reading: "die Städte", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Город", en: "City", ja: "都市・街" } },
  { word: "Guten Morgen", reading: "[ˈɡuːtn̩ ˈmɔʁɡn̩]", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Доброе утро", en: "Good morning", ja: "おはようございます" } },
  { word: "Vielen Dank", reading: "[ˈfiːlən daŋk]", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Большое спасибо", en: "Thank you very much", ja: "ありがとうございます" } },

  // A2: Alltag, Reisen & Trennbare Verben
  { word: "der Bahnhof", reading: "die Bahnhöfe", studyLevel: "A2", type: "VOCABULARY", example: "Der Zug fährt vom Bahnhof ab.", meanings: { ru: "Вокзал", en: "Train station", ja: "駅" } },
  { word: "die Haltestelle", reading: "die Haltestellen", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Остановка транспорта", en: "Bus / tram stop", ja: "停留所" } },
  { word: "die Zeit", reading: "die Zeiten", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Время", en: "Time", ja: "時間" } },
  { word: "der Weg", reading: "die Wege", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Путь / Дорога", en: "Way / Path", ja: "道" } },
  { word: "verstehen", reading: "verstand · hat verstanden", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Понимать", en: "To understand", ja: "理解する" } },
  { word: "umsteigen", reading: "stieg um · ist umgestiegen", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Пересаживаться (на транспорте)", en: "To change lines / transfer", ja: "乗り換える" } },
  { word: "Ich hätte gern...", reading: "Bestellung", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Я бы хотел(а)...", en: "I would like...", ja: "〜をお願いします" } },

  // B1: Kultur, Beruf & Ausdrücke
  { word: "das Wissen", reading: "[ˈvɪsn̩]", studyLevel: "B1", type: "VOCABULARY", example: "Wissen wächst jeden Tag.", meanings: { ru: "Знание", en: "Knowledge", ja: "知識" } },
  { word: "das Ziel", reading: "die Ziele", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Цель", en: "Goal / Destination", ja: "目標" } },
  { word: "die Erfahrung", reading: "die Erfahrungen", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Опыт", en: "Experience", ja: "経験" } },
  { word: "der Traum", reading: "die Träume", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Мечта / Сон", en: "Dream", ja: "夢" } },
  { word: "träumen", reading: "träumte · hat geträumt", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Мечтать / Видеть сны", en: "To dream", ja: "夢を見る" } },
  { word: "Entschuldigen Sie", reading: "höflich", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Извините меня", en: "Excuse me (polite)", ja: "すみません" } },

  // B2: Abstrakte Begriffe & Feinheiten
  { word: "die Entscheidung", reading: "die Entscheidungen", studyLevel: "B2", type: "VOCABULARY", example: "Eine kluge Entscheidung treffen.", meanings: { ru: "Решение, выбор", en: "Decision", ja: "決断・決定" } },
  { word: "die Verantwortung", reading: "unzählbar", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Ответственность", en: "Responsibility", ja: "責任" } },
  { word: "der Zusammenhang", reading: "die Zusammenhänge", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Контекст / Взаимосвязь", en: "Context / Connection", ja: "文脈・関連性" } },
  { word: "in Betracht ziehen", reading: "Redewendung", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Принимать в расчёт / рассматривать", en: "To take into consideration", ja: "考慮に入れる" } },
  { word: "Viel Erfolg!", reading: "Wunsch", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Большого успеха!", en: "Wishing great success!", ja: "成功を祈ります！" } },
];

export function getStarterCardsForStudy(
  studyLanguage: StudyLanguage,
  uiLanguage: Language,
  levelFilter?: string,
): StarterCard[] {
  const source =
    studyLanguage === "en"
      ? RAW_ENGLISH_CARDS
      : studyLanguage === "de"
        ? RAW_GERMAN_CARDS
        : RAW_JAPANESE_CARDS;
  const filtered =
    levelFilter && levelFilter !== "ALL"
      ? source.filter((c) => c.studyLevel === levelFilter)
      : source;
  return filtered.map((c) => ({
    word: c.word,
    reading: c.reading,
    meaning: c.meanings[uiLanguage] || c.meanings.ru,
    example: c.example,
    type: c.type,
    language: studyLanguage,
    studyLevel: c.studyLevel,
  }));
}

export const STARTER_JAPANESE_CARDS: StarterCard[] = getStarterCardsForStudy("ja", "ru");
export const STARTER_ENGLISH_CARDS: StarterCard[] = getStarterCardsForStudy("en", "ru");
export const STARTER_GERMAN_CARDS: StarterCard[] = getStarterCardsForStudy("de", "ru");

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

/* ───────────── Утилиты отслеживания использования стартовых наборов ───────────── */

export type StarterPackType =
  | "japanese"
  | "english"
  | "german"
  | "developer"
  | "github";

const CARD_STARTER_SET_BY_PACK: Record<"japanese" | "english" | "german", Set<string>> = {
  japanese: new Set(RAW_JAPANESE_CARDS.map((c) => c.word)),
  english: new Set(RAW_ENGLISH_CARDS.map((c) => c.word)),
  german: new Set(RAW_GERMAN_CARDS.map((c) => c.word)),
};

const RESOURCE_STARTER_SET_BY_PACK: Record<"developer" | "github", Set<string>> = {
  developer: new Set(STARTER_DEVELOPER_RESOURCES.map((r) => r.url)),
  github: new Set(STARTER_GITHUB_REPOSITORIES.map((r) => r.url)),
};

export function studyLanguageToPackType(studyLanguage: StudyLanguage): "japanese" | "english" | "german" {
  if (studyLanguage === "en") return "english";
  if (studyLanguage === "de") return "german";
  return "japanese";
}

export function isPackClaimed(
  pack: StarterPackType,
  cards?: Array<{ word: string }>,
  resources?: Array<{ url: string }>,
): boolean {
  const storageKey = `kavault_pack_claimed_${pack}`;

  if (pack === "japanese" || pack === "english" || pack === "german") {
    if (cards !== undefined) {
      if (cards.length === 0) {
        localStorage.removeItem(storageKey);
        return false;
      }
      const starterWords = CARD_STARTER_SET_BY_PACK[pack];
      const matchingCount = cards.filter((c) => starterWords.has(c.word)).length;
      if (matchingCount < 2) {
        localStorage.removeItem(storageKey);
        return false;
      }
      return true;
    }
    return localStorage.getItem(storageKey) === "true";
  }

  if (pack === "developer" || pack === "github") {
    if (resources !== undefined) {
      if (resources.length === 0) {
        localStorage.removeItem(storageKey);
        return false;
      }
      const starterUrls = RESOURCE_STARTER_SET_BY_PACK[pack];
      const matchingCount = resources.filter((r) => starterUrls.has(r.url)).length;
      if (matchingCount < 2) {
        localStorage.removeItem(storageKey);
        return false;
      }
      return true;
    }
    return localStorage.getItem(storageKey) === "true";
  }

  return false;
}

export function markPackClaimed(pack: StarterPackType | "all") {
  if (pack === "all") {
    localStorage.setItem("kavault_pack_claimed_japanese", "true");
    localStorage.setItem("kavault_pack_claimed_english", "true");
    localStorage.setItem("kavault_pack_claimed_german", "true");
    localStorage.setItem("kavault_pack_claimed_developer", "true");
    localStorage.setItem("kavault_pack_claimed_github", "true");
  } else {
    localStorage.setItem(`kavault_pack_claimed_${pack}`, "true");
  }
}

export function unmarkPackClaimed(pack?: StarterPackType | "all") {
  if (!pack || pack === "all") {
    localStorage.removeItem("kavault_pack_claimed_japanese");
    localStorage.removeItem("kavault_pack_claimed_english");
    localStorage.removeItem("kavault_pack_claimed_german");
    localStorage.removeItem("kavault_pack_claimed_developer");
    localStorage.removeItem("kavault_pack_claimed_github");
  } else {
    localStorage.removeItem(`kavault_pack_claimed_${pack}`);
  }
}
