import type { Language } from "../i18n/translations";
import type { StudyLanguage } from "./studyVibes";

export interface StarterCard {
  word: string;
  reading?: string;
  meaning: string;
  type: "KANA" | "KANJI" | "VOCABULARY" | "GRAMMAR";
  language?: StudyLanguage;
}

interface LocalizedStarterCardRaw {
  word: string;
  reading?: string;
  meanings: Record<Language, string>;
  type: "KANA" | "KANJI" | "VOCABULARY" | "GRAMMAR";
}

export interface StarterResource {
  title: string;
  url: string;
  type: "ARTICLE" | "DOCUMENTATION" | "WEBSITE" | "REPOSITORY" | "VIDEO";
  tags: string[];
  note?: string;
}

const RAW_JAPANESE_CARDS: LocalizedStarterCardRaw[] = [
  // Приветствия и основы (Кана)
  { word: "ありがとう", reading: "arigatou", type: "KANA", meanings: { ru: "Спасибо", en: "Thank you", ja: "感謝の言葉" } },
  { word: "こんにちは", reading: "konnichiwa", type: "KANA", meanings: { ru: "Здравствуйте / Привет", en: "Hello / Good afternoon", ja: "昼の挨拶" } },
  { word: "さようなら", reading: "sayounara", type: "KANA", meanings: { ru: "До свидания", en: "Goodbye", ja: "別れの挨拶" } },
  { word: "はい", reading: "hai", type: "KANA", meanings: { ru: "Да", en: "Yes", ja: "肯定の返事" } },
  { word: "いいえ", reading: "iie", type: "KANA", meanings: { ru: "Нет", en: "No", ja: "否定の返事" } },
  { word: "すみません", reading: "sumimasen", type: "KANA", meanings: { ru: "Извините / Прошу прощения", en: "Excuse me / Sorry", ja: "謝罪・呼びかけ" } },
  { word: "おねがいします", reading: "onegaishimasu", type: "KANA", meanings: { ru: "Пожалуйста (просьба)", en: "Please", ja: "依頼の表現" } },
  { word: "おはよう", reading: "ohayou", type: "KANA", meanings: { ru: "Доброе утро", en: "Good morning", ja: "朝の挨拶" } },
  { word: "こんばんは", reading: "konbanwa", type: "KANA", meanings: { ru: "Добрый вечер", en: "Good evening", ja: "夜の挨拶" } },
  { word: "いただきます", reading: "itadakimasu", type: "KANA", meanings: { ru: "Приятного аппетита (перед едой)", en: "Phrase before eating", ja: "食事前の挨拶" } },

  // Базовые существительные (Кана)
  { word: "みず", reading: "mizu", type: "KANA", meanings: { ru: "Вода", en: "Water", ja: "水 (おひや)" } },
  { word: "おちゃ", reading: "ocha", type: "KANA", meanings: { ru: "Зелёный чай", en: "Green tea", ja: "お茶" } },
  { word: "ごはん", reading: "gohan", type: "KANA", meanings: { ru: "Рис / Еда", en: "Rice / Meal", ja: "ご飯・食事" } },
  { word: "ほん", reading: "hon", type: "KANA", meanings: { ru: "Книга", en: "Book", ja: "書物・本" } },
  { word: "ねこ", reading: "neko", type: "KANA", meanings: { ru: "Кот / Кошка", en: "Cat", ja: "猫" } },
  { word: "いぬ", reading: "inu", type: "KANA", meanings: { ru: "Собака", en: "Dog", ja: "犬" } },
  { word: "くるま", reading: "kuruma", type: "KANA", meanings: { ru: "Машина / Автомобиль", en: "Car", ja: "自動車" } },
  { word: "でんしゃ", reading: "densha", type: "KANA", meanings: { ru: "Поезд / Электричка", en: "Train", ja: "鉄道車両" } },
  { word: "ともだち", reading: "tomodachi", type: "KANA", meanings: { ru: "Друг / Приятель", en: "Friend", ja: "友人" } },
  { word: "せんせい", reading: "sensei", type: "KANA", meanings: { ru: "Учитель / Наставник", en: "Teacher / Sensei", ja: "教師" } },

  // Базовые глаголы (Кана)
  { word: "たべる", reading: "taberu", type: "KANA", meanings: { ru: "Кушать / Есть", en: "To eat", ja: "食事する" } },
  { word: "のむ", reading: "nomu", type: "KANA", meanings: { ru: "Пить", en: "To drink", ja: "飲み物を摂取する" } },
  { word: "みる", reading: "miru", type: "KANA", meanings: { ru: "Смотреть / Видеть", en: "To see / Watch", ja: "視覚で捉える" } },
  { word: "きく", reading: "kiku", type: "KANA", meanings: { ru: "Слушать / Слышать", en: "To listen / Ask", ja: "耳で聞く・尋ねる" } },
  { word: "いく", reading: "iku", type: "KANA", meanings: { ru: "Идти / Ехать", en: "To go", ja: "移動する" } },
  { word: "くる", reading: "kuru", type: "KANA", meanings: { ru: "Приходить / Приезжать", en: "To come", ja: "こちらへ移動する" } },

  // Первые базовые Кандзи (N5)
  { word: "日", reading: "ひ / にち (hi / nichi)", type: "KANJI", meanings: { ru: "День / Солнце", en: "Day / Sun", ja: "太陽・一日" } },
  { word: "月", reading: "つき / げつ (tsuki / getsu)", type: "KANJI", meanings: { ru: "Луна / Месяц", en: "Moon / Month", ja: "お月様・月日" } },
  { word: "木", reading: "き / もく (ki / moku)", type: "KANJI", meanings: { ru: "Дерево", en: "Tree / Wood", ja: "樹木" } },
  { word: "山", reading: "やま / さん (yama / san)", type: "KANJI", meanings: { ru: "Гора", en: "Mountain", ja: "高い地形" } },
  { word: "川", reading: "かわ / せん (kawa / sen)", type: "KANJI", meanings: { ru: "Река", en: "River", ja: "流れる水" } },
  { word: "人", reading: "ひと / じん (hito / jin)", type: "KANJI", meanings: { ru: "Человек", en: "Person", ja: "人間" } },
  { word: "水", reading: "みず / すい (mizu / sui)", type: "KANJI", meanings: { ru: "Вода (иероглиф)", en: "Water (Kanji)", ja: "お水" } },
  { word: "火", reading: "ひ / か (hi / ka)", type: "KANJI", meanings: { ru: "Огонь", en: "Fire", ja: "炎" } },
  { word: "今日", reading: "きょう (kyou)", type: "KANJI", meanings: { ru: "Сегодня", en: "Today", ja: "この日" } },
  { word: "時間", reading: "じかん (jikan)", type: "KANJI", meanings: { ru: "Время", en: "Time / Hour", ja: "時刻・長さ" } },
];

const RAW_ENGLISH_CARDS: LocalizedStarterCardRaw[] = [
  // Section 1: Vocabulary
  { word: "Resilient", reading: "[rɪˈzɪl.i.ənt]", type: "VOCABULARY", meanings: { ru: "Жизнестойкий, быстро восстанавливающийся", en: "Able to withstand or recover quickly", ja: "回復力のある・しなやかな" } },
  { word: "Eloquent", reading: "[ˈel.ə.kwənt]", type: "VOCABULARY", meanings: { ru: "Красноречивый, выразительный", en: "Fluent and persuasive in speaking", ja: "雄弁な・表現豊かな" } },
  { word: "Perspective", reading: "[pəˈspek.tɪv]", type: "VOCABULARY", meanings: { ru: "Точка зрения, ракурс", en: "A particular attitude or point of view", ja: "視点・見方" } },
  { word: "Milestone", reading: "[ˈmaɪl.stəʊn]", type: "VOCABULARY", meanings: { ru: "Важная веха, этап", en: "A significant stage or event", ja: "重要な節目・画期" } },
  { word: "Breakthrough", reading: "[ˈbreɪk.θruː]", type: "VOCABULARY", meanings: { ru: "Прорыв, важное открытие", en: "A sudden dramatic discovery", ja: "突破口・画期的な発見" } },
  { word: "Curiosity", reading: "[ˌkjʊə.riˈɒs.ə.ti]", type: "VOCABULARY", meanings: { ru: "Любознательность, интерес", en: "Strong desire to know or learn", ja: "好奇心" } },
  { word: "Endeavor", reading: "[ɪnˈdev.ər]", type: "VOCABULARY", meanings: { ru: "Усилие, стремление, попытка", en: "An attempt to achieve a goal", ja: "努力・試み" } },
  { word: "Inevitable", reading: "[ɪˈnev.ɪ.tə.bəl]", type: "VOCABULARY", meanings: { ru: "Неизбежный, неминуемый", en: "Certain to happen; unavoidable", ja: "避けられない・必然の" } },
  { word: "Insightful", reading: "[ˈɪn.saɪt.fəl]", type: "VOCABULARY", meanings: { ru: "Проницательный, глубокий", en: "Showing deep understanding", ja: "洞察力のある" } },
  { word: "Thorough", reading: "[ˈθʌr.ə]", type: "VOCABULARY", meanings: { ru: "Тщательный, обстоятельный", en: "Complete with regard to every detail", ja: "徹底的な・綿密な" } },
  { word: "Serendipity", reading: "[ˌser.ənˈdɪp.ə.ti]", type: "VOCABULARY", meanings: { ru: "Счастливая случайность", en: "Finding good things by chance", ja: "思いがけない幸運" } },
  { word: "Authentic", reading: "[ɔːˈθen.tɪk]", type: "VOCABULARY", meanings: { ru: "Подлинный, настоящий", en: "Genuine and original", ja: "本物の・信頼できる" } },
  { word: "Ambiguous", reading: "[æmˈbɪɡ.ju.əs]", type: "VOCABULARY", meanings: { ru: "Двусмысленный, неоднозначный", en: "Open to more than one interpretation", ja: "曖昧な・多義的な" } },
  { word: "Fluent", reading: "[ˈfluː.ənt]", type: "VOCABULARY", meanings: { ru: "Свободно владеющий (языком)", en: "Able to express oneself easily", ja: "流暢な" } },
  { word: "Gratitude", reading: "[ˈɡræt.ɪ.tʃuːd]", type: "VOCABULARY", meanings: { ru: "Благодарность", en: "The quality of being thankful", ja: "感謝の気持ち" } },

  // Section 2: Phrasal Verbs & Idioms
  { word: "Figure out", reading: "phrasal verb", type: "GRAMMAR", meanings: { ru: "Разобраться, понять, решить", en: "Understand or solve something", ja: "理解する・解決する" } },
  { word: "Carry on", reading: "phrasal verb", type: "GRAMMAR", meanings: { ru: "Продолжать (несмотря ни на что)", en: "Continue doing something", ja: "続ける・続行する" } },
  { word: "Look forward to", reading: "phrasal verb", type: "GRAMMAR", meanings: { ru: "Ждать с нетерпением", en: "Await eagerly with pleasure", ja: "〜を楽しみに待つ" } },
  { word: "Break the ice", reading: "idiom", type: "GRAMMAR", meanings: { ru: "Разрядить обстановку, начать общение", en: "Relieve tension at first meeting", ja: "打ち解ける・緊張をほぐす" } },
  { word: "Piece of cake", reading: "idiom", type: "GRAMMAR", meanings: { ru: "Проще простого, пустяк", en: "Something very easy to do", ja: "朝飯前・とても簡単なこと" } },
  { word: "Call it a day", reading: "idiom", type: "GRAMMAR", meanings: { ru: "Закончить работу на сегодня", en: "Stop working for the day", ja: "今日の作業を切り上げる" } },
  { word: "Get the hang of", reading: "idiom", type: "GRAMMAR", meanings: { ru: "Набить руку, освоиться", en: "Learn how to do something skillfully", ja: "コツをつかむ" } },
  { word: "Make up one's mind", reading: "idiom", type: "GRAMMAR", meanings: { ru: "Принять решение, решиться", en: "Make a firm decision", ja: "決心する" } },
  { word: "Keep in touch", reading: "expression", type: "GRAMMAR", meanings: { ru: "Поддерживать связь", en: "Maintain regular communication", ja: "連絡を取り合う" } },
  { word: "Run into", reading: "phrasal verb", type: "GRAMMAR", meanings: { ru: "Случайно встретить / столкнуться", en: "Meet unexpectedly or encounter", ja: "偶然出会う・直面する" } },
  { word: "Put off", reading: "phrasal verb", type: "GRAMMAR", meanings: { ru: "Откладывать на потом", en: "Postpone to a later time", ja: "延期する・後回しにする" } },
  { word: "Catch up", reading: "phrasal verb", type: "GRAMMAR", meanings: { ru: "Нагнать, обменяться новостями", en: "Reach the same level or talk after a break", ja: "追いつく・近況を話す" } },
  { word: "Take into account", reading: "expression", type: "GRAMMAR", meanings: { ru: "Принимать во внимание", en: "Consider when judging something", ja: "考慮に入れる" } },
  { word: "Give up", reading: "phrasal verb", type: "GRAMMAR", meanings: { ru: "Сдаваться / бросить привычку", en: "Stop trying or quit a habit", ja: "諦める・やめる" } },
  { word: "In the long run", reading: "idiom", type: "GRAMMAR", meanings: { ru: "В конечном счёте, в перспективе", en: "Over a long period of time eventually", ja: "長い目で見れば・結局は" } },
];

const RAW_GERMAN_CARDS: LocalizedStarterCardRaw[] = [
  // Section 1: Nouns with der/die/das
  { word: "der Bahnhof", reading: "die Bahnhöfe", type: "VOCABULARY", meanings: { ru: "Вокзал", en: "Train station", ja: "駅 (えき)" } },
  { word: "das Wasser", reading: "[ˈvasɐ] · unzählbar", type: "VOCABULARY", meanings: { ru: "Вода", en: "Water", ja: "水" } },
  { word: "die Zeit", reading: "die Zeiten", type: "VOCABULARY", meanings: { ru: "Время", en: "Time", ja: "時間" } },
  { word: "der Freund", reading: "die Freunde", type: "VOCABULARY", meanings: { ru: "Друг", en: "Friend", ja: "友達" } },
  { word: "das Buch", reading: "die Bücher", type: "VOCABULARY", meanings: { ru: "Книга", en: "Book", ja: "本" } },
  { word: "die Stadt", reading: "die Städte", type: "VOCABULARY", meanings: { ru: "Город", en: "City", ja: "都市・街" } },
  { word: "der Morgen", reading: "die Morgen", type: "VOCABULARY", meanings: { ru: "Утро", en: "Morning", ja: "朝" } },
  { word: "das Haus", reading: "die Häuser", type: "VOCABULARY", meanings: { ru: "Дом", en: "House", ja: "家" } },
  { word: "die Frage", reading: "die Fragen", type: "VOCABULARY", meanings: { ru: "Вопрос", en: "Question", ja: "質問" } },
  { word: "der Weg", reading: "die Wege", type: "VOCABULARY", meanings: { ru: "Путь / Дорога", en: "Way / Path", ja: "道" } },
  { word: "das Ziel", reading: "die Ziele", type: "VOCABULARY", meanings: { ru: "Цель", en: "Goal / Destination", ja: "目標・目的地" } },
  { word: "die Sprache", reading: "die Sprachen", type: "VOCABULARY", meanings: { ru: "Язык (речь)", en: "Language", ja: "言語" } },
  { word: "der Kaffee", reading: "die Kaffees", type: "VOCABULARY", meanings: { ru: "Кофе", en: "Coffee", ja: "コーヒー" } },
  { word: "das Wissen", reading: "[ˈvɪsn̩]", type: "VOCABULARY", meanings: { ru: "Знание", en: "Knowledge", ja: "知識" } },
  { word: "die Musik", reading: "[muˈziːk]", type: "VOCABULARY", meanings: { ru: "Музыка", en: "Music", ja: "音楽" } },
  { word: "der Traum", reading: "die Träume", type: "VOCABULARY", meanings: { ru: "Мечта / Сон", en: "Dream", ja: "夢" } },

  // Section 2: Verbs & Everyday Phrases
  { word: "Guten Morgen", reading: "[ˈɡuːtn̩ ˈmɔʁɡn̩]", type: "GRAMMAR", meanings: { ru: "Доброе утро", en: "Good morning", ja: "おはようございます" } },
  { word: "Vielen Dank", reading: "[ˈfiːlən daŋk]", type: "GRAMMAR", meanings: { ru: "Большое спасибо", en: "Thank you very much", ja: "どうもありがとうございます" } },
  { word: "verstehen", reading: "verstand · hat verstanden", type: "GRAMMAR", meanings: { ru: "Понимать", en: "To understand", ja: "理解する" } },
  { word: "lernen", reading: "lernte · hat gelernt", type: "GRAMMAR", meanings: { ru: "Учить / Изучать", en: "To learn / study", ja: "学ぶ" } },
  { word: "sprechen", reading: "sprach · hat gesprochen", type: "GRAMMAR", meanings: { ru: "Говорить", en: "To speak", ja: "話す" } },
  { word: "arbeiten", reading: "arbeitete · hat gearbeitet", type: "GRAMMAR", meanings: { ru: "Работать", en: "To work", ja: "働く" } },
  { word: "reisen", reading: "reiste · ist gereist", type: "GRAMMAR", meanings: { ru: "Путешествовать", en: "To travel", ja: "旅行する" } },
  { word: "träumen", reading: "träumte · hat geträumt", type: "GRAMMAR", meanings: { ru: "Мечтать / Видеть сны", en: "To dream", ja: "夢を見る" } },
  { word: "Entschuldigen Sie", reading: "höflich", type: "GRAMMAR", meanings: { ru: "Извините меня", en: "Excuse me (polite)", ja: "すみません（丁寧）" } },
  { word: "Wie geht es Ihnen?", reading: "höflich", type: "GRAMMAR", meanings: { ru: "Как ваши дела?", en: "How are you?", ja: "お元気ですか？" } },
  { word: "Ich hätte gern...", reading: "Bestellung", type: "GRAMMAR", meanings: { ru: "Я бы хотел(а)...", en: "I would like...", ja: "〜をお願いします" } },
  { word: "Kein Problem", reading: "Alltag", type: "GRAMMAR", meanings: { ru: "Без проблем", en: "No problem", ja: "問題ありません" } },
  { word: "Bis bald!", reading: "Abschied", type: "GRAMMAR", meanings: { ru: "До скорого!", en: "See you soon!", ja: "またね！" } },
  { word: "Viel Erfolg!", reading: "Wunsch", type: "GRAMMAR", meanings: { ru: "Большого успеха! Удачи!", en: "Good luck / Much success!", ja: "成功を祈ります！" } },
];

export function getStarterCardsForStudy(
  studyLanguage: StudyLanguage,
  uiLanguage: Language,
): StarterCard[] {
  const source =
    studyLanguage === "en"
      ? RAW_ENGLISH_CARDS
      : studyLanguage === "de"
        ? RAW_GERMAN_CARDS
        : RAW_JAPANESE_CARDS;
  return source.map((c) => ({
    word: c.word,
    reading: c.reading,
    meaning: c.meanings[uiLanguage] || c.meanings.ru,
    type: c.type,
    language: studyLanguage,
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
