import type { Language } from "../i18n/translations";

export type StudyLanguage = "ja" | "en" | "de";

export interface StudySectionConfig {
  id: "KANJI" | "KANA" | "VOCABULARY" | "GRAMMAR";
  badge: string;
  title: string;
  desc: string;
  cardBadge: string;
  addTitle: string;
  wordPlaceholder: string;
  readingPlaceholder?: string;
  meaningPlaceholder: string;
  repeatBtn: string;
  deckTitle: string;
  clearBtn: string;
  emptyText: string;
  allReviewedText: string;
  deckLabel: string;
  showReadingInput: boolean;
}

export interface StudyLocaleText {
  name: string;
  nativeName: string;
  shortTag: string;
  onboardingTagline: string;
  vibeBadge: string;
  vibeQuote: string;
  navLabel: string;
  mobileNavLabel: string;
  hubTitle: string;
  subtitleS1: string;
  subtitleS2: string;
  wordsUnit: string;
  dashWordsCardTitle: string;
  dashReviewTaskTitle: string;
  starterTitle: string;
  starterDesc: string;
  starterBtn: string;
  starterFullBtn: string;
  clearAllDeckBtn: string;
  notFound: string;
  clickToHide: string;
  levelPrefix: string;
  readingLabelPlaceholder: string;
  trackerGoalLabel: string;
  trackerMilestoneTitle: string;
  trackerMilestoneDesc: string;
  section1: StudySectionConfig;
  section2: StudySectionConfig;
}

export interface StudyVibePalette {
  id: StudyLanguage;
  flag: string;
  ttsLang: string;
  accentHex: string;
  secondaryHex: string;
  softTint: string;
  watermark: string;
  heroPattern: "sakura" | "oxford" | "bauhaus";
  onboardingColors: {
    border: string;
    bg: string;
    glow: string;
  };
}

export const STUDY_VIBE_PALETTES: Record<StudyLanguage, StudyVibePalette> = {
  ja: {
    id: "ja",
    flag: "🇯🇵",
    ttsLang: "ja-JP",
    accentHex: "#ec4899",
    secondaryHex: "#a855f7",
    softTint: "rgba(236, 72, 153, 0.14)",
    watermark: "和 ・ 桜",
    heroPattern: "sakura",
    onboardingColors: {
      border: "rgba(236, 72, 153, 0.45)",
      bg: "linear-gradient(135deg, rgba(236, 72, 153, 0.14) 0%, rgba(168, 85, 247, 0.1) 100%)",
      glow: "0 12px 32px rgba(236, 72, 153, 0.18)",
    },
  },
  en: {
    id: "en",
    flag: "🇬🇧",
    ttsLang: "en-GB",
    accentHex: "#3b82f6",
    secondaryHex: "#e11d48",
    softTint: "rgba(59, 130, 246, 0.14)",
    watermark: "OXFORD · UK",
    heroPattern: "oxford",
    onboardingColors: {
      border: "rgba(59, 130, 246, 0.45)",
      bg: "linear-gradient(135deg, rgba(37, 99, 235, 0.16) 0%, rgba(225, 29, 72, 0.1) 100%)",
      glow: "0 12px 32px rgba(59, 130, 246, 0.2)",
    },
  },
  de: {
    id: "de",
    flag: "🇩🇪",
    ttsLang: "de-DE",
    accentHex: "#f59e0b",
    secondaryHex: "#dc2626",
    softTint: "rgba(245, 158, 11, 0.15)",
    watermark: "BERLIN · DE",
    heroPattern: "bauhaus",
    onboardingColors: {
      border: "rgba(245, 158, 11, 0.48)",
      bg: "linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(220, 38, 38, 0.1) 100%)",
      glow: "0 12px 32px rgba(245, 158, 11, 0.2)",
    },
  },
};

export const STUDY_TEXTS: Record<
  StudyLanguage,
  Record<Language, StudyLocaleText>
> = {
  ja: {
    ru: {
      name: "Японский язык",
      nativeName: "日本語",
      shortTag: "Tokyo · JLPT N5",
      onboardingTagline: "Кандзи с фуриганой, хирагана, катакана и японская озвучка.",
      vibeBadge: "🌸 Киото · Сакура",
      vibeQuote: "七転び八起き — «Семь раз упади, восемь — поднимись»",
      navLabel: "Японский язык",
      mobileNavLabel: "Японский",
      hubTitle: "Японский хаб",
      subtitleS1: "1 раздел: Слова с иероглифами кандзи и фуриганой",
      subtitleS2: "2 раздел: Слова на хирагане и катакане (без кандзи)",
      wordsUnit: "слов",
      dashWordsCardTitle: "Японских слов",
      dashReviewTaskTitle: "Повторить японские слова",
      starterTitle: "🌸 Японский N5 (36 слов)",
      starterDesc: "Азбука Кана + базовые Кандзи",
      starterBtn: "Загрузить набор N5 (36 слов)",
      starterFullBtn: "🌸 Загрузить стартовый набор N5 (36 слов)",
      clearAllDeckBtn: "Очистить всю колоду",
      notFound: "Ничего не найдено по запросу.",
      clickToHide: "(нажмите, чтобы скрыть)",
      levelPrefix: "Ур.",
      readingLabelPlaceholder: "Чтение каной / фуригана (напр. みらい)",
      trackerGoalLabel: "Японских слов за неделю",
      trackerMilestoneTitle: "Словарный запас",
      trackerMilestoneDesc: "Добавить 25 японских карточек",
      section1: {
        id: "KANJI",
        badge: "1. Кандзи",
        title: "1. Слова с Кандзи",
        desc: "Иероглифы с фуриганой и чтениями",
        cardBadge: "Кандзи",
        addTitle: "Раздел 1: Добавить слово с Кандзи",
        wordPlaceholder: "Кандзи / Иероглиф (напр. 未来, 桜, 日本語)",
        readingPlaceholder: "Чтение каной / фуригана (напр. みらい)",
        meaningPlaceholder: "Перевод (напр. Будущее, Сакура)",
        repeatBtn: "Повторить Кандзи",
        deckTitle: "Раздел 1: Колода «Кандзи»",
        clearBtn: "Очистить Кандзи",
        emptyText: "В разделе Кандзи пока пусто. Добавляйте слова с иероглифами, когда будете готовы!",
        allReviewedText: "В разделе «Кандзи» на сегодня всё повторено.",
        deckLabel: "Слова с Кандзи",
        showReadingInput: true,
      },
      section2: {
        id: "KANA",
        badge: "2. Кана",
        title: "2. Хирагана и Катакана",
        desc: "Слова азбукой без иероглифов",
        cardBadge: "Кана",
        addTitle: "Раздел 2: Добавить слово на Хирагане / Катакане",
        wordPlaceholder: "Слово на кане (напр. ありがとう, ねこ)",
        meaningPlaceholder: "Перевод (напр. Спасибо, Кот)",
        repeatBtn: "Повторить Кану",
        deckTitle: "Раздел 2: Колода «Хирагана & Катакана»",
        clearBtn: "Очистить Кану",
        emptyText: "В разделе Хираганы и Катаканы пока нет слов. Добавьте первые слова выше или загрузите готовый набор!",
        allReviewedText: "В разделе «Хирагана & Катакана» на сегодня нет обязательных повторений.",
        deckLabel: "Хирагана и Катакана",
        showReadingInput: false,
      },
    },
    en: {
      name: "Japanese",
      nativeName: "日本語",
      shortTag: "Tokyo · JLPT N5",
      onboardingTagline: "Kanji with furigana, Hiragana, Katakana, and ja-JP voice.",
      vibeBadge: "🌸 Kyoto · Sakura",
      vibeQuote: "七転び八起き — Fall seven times, stand up eight",
      navLabel: "Japanese Hub",
      mobileNavLabel: "Japanese",
      hubTitle: "Japanese Hub",
      subtitleS1: "Section 1: Words with Kanji & Furigana",
      subtitleS2: "Section 2: Hiragana & Katakana words (no Kanji)",
      wordsUnit: "words",
      dashWordsCardTitle: "Japanese Words",
      dashReviewTaskTitle: "Review Japanese Words",
      starterTitle: "🌸 Japanese N5 (36 words)",
      starterDesc: "Kana basics + N5 Kanji",
      starterBtn: "Load N5 Pack (36)",
      starterFullBtn: "🌸 Load N5 Starter Pack (36 words)",
      clearAllDeckBtn: "Clear entire deck",
      notFound: "Nothing found matching your query.",
      clickToHide: "(tap to hide)",
      levelPrefix: "Lvl",
      readingLabelPlaceholder: "Kana reading / Furigana (e.g. みらい)",
      trackerGoalLabel: "Japanese Words per week",
      trackerMilestoneTitle: "Vocabulary",
      trackerMilestoneDesc: "Add 25 Japanese flashcards",
      section1: {
        id: "KANJI",
        badge: "1. Kanji",
        title: "1. Words with Kanji",
        desc: "Characters with furigana & readings",
        cardBadge: "Kanji",
        addTitle: "Section 1: Add Kanji Word",
        wordPlaceholder: "Kanji (e.g. 未来, 桜, 日本語)",
        readingPlaceholder: "Kana reading / Furigana (e.g. みらい)",
        meaningPlaceholder: "Meaning (e.g. Future, Sakura)",
        repeatBtn: "Review Kanji",
        deckTitle: "Section 1: Kanji Deck",
        clearBtn: "Clear Kanji",
        emptyText: "Kanji section is empty. Add words with Kanji whenever you're ready!",
        allReviewedText: "No due reviews left in Kanji section today.",
        deckLabel: "Words with Kanji",
        showReadingInput: true,
      },
      section2: {
        id: "KANA",
        badge: "2. Kana",
        title: "2. Hiragana & Katakana",
        desc: "Syllabary words without Kanji",
        cardBadge: "Kana",
        addTitle: "Section 2: Add Hiragana / Katakana Word",
        wordPlaceholder: "Kana word (e.g. ありがとう, ねこ)",
        meaningPlaceholder: "Meaning (e.g. Thank you, Cat)",
        repeatBtn: "Review Kana",
        deckTitle: "Section 2: Hiragana & Katakana Deck",
        clearBtn: "Clear Kana",
        emptyText: "Hiragana & Katakana section has no words yet. Add your first words above or load the starter pack!",
        allReviewedText: "No due reviews left in Hiragana & Katakana today.",
        deckLabel: "Hiragana & Katakana",
        showReadingInput: false,
      },
    },
    ja: {
      name: "日本語",
      nativeName: "日本語",
      shortTag: "東京・JLPT N5",
      onboardingTagline: "ふりがな付き漢字・ひらがな・カタカナと日本語音声",
      vibeBadge: "🌸 京都・桜モード",
      vibeQuote: "七転び八起き — 何度転んでも立ち上がる",
      navLabel: "日本語ハブ",
      mobileNavLabel: "日本語",
      hubTitle: "日本語ハブ",
      subtitleS1: "セクション1：漢字とふりがなの単語",
      subtitleS2: "セクション2：ひらがな・カタカナの単語",
      wordsUnit: "語",
      dashWordsCardTitle: "日本語の単語",
      dashReviewTaskTitle: "日本語の単語を復習",
      starterTitle: "🌸 日本語 N5 (36語)",
      starterDesc: "かな基本単語 + 基本漢字",
      starterBtn: "N5セット読込 (36語)",
      starterFullBtn: "🌸 N5スターターパックを読み込む (36語)",
      clearAllDeckBtn: "デッキをすべて削除",
      notFound: "検索に一致する単語が見つかりません。",
      clickToHide: "(タップして閉じる)",
      levelPrefix: "Lvl",
      readingLabelPlaceholder: "読み方 / ふりがな（例：みらい）",
      trackerGoalLabel: "週あたりの日本語単語数",
      trackerMilestoneTitle: "語彙マスター",
      trackerMilestoneDesc: "日本語カードを25枚追加する",
      section1: {
        id: "KANJI",
        badge: "1. 漢字",
        title: "1. 漢字の単語",
        desc: "ふりがな・読み方付きの漢字",
        cardBadge: "漢字",
        addTitle: "セクション1：漢字の単語を追加",
        wordPlaceholder: "漢字（例：未来, 桜, 日本語）",
        readingPlaceholder: "読み方 / ふりがな（例：みらい）",
        meaningPlaceholder: "意味（例：未来、桜）",
        repeatBtn: "漢字を復習",
        deckTitle: "セクション1：「漢字」デッキ",
        clearBtn: "漢字を削除",
        emptyText: "漢字セクションはまだ空です。",
        allReviewedText: "漢字セクションの今日の復習は完了しています。",
        deckLabel: "漢字の単語",
        showReadingInput: true,
      },
      section2: {
        id: "KANA",
        badge: "2. かな",
        title: "2. ひらがな・カタカナ",
        desc: "漢字なしのかな単語",
        cardBadge: "かな",
        addTitle: "セクション2：ひらがな・カタカナの単語を追加",
        wordPlaceholder: "かなの単語（例：ありがとう, ねこ）",
        meaningPlaceholder: "意味（例：ありがとう、猫）",
        repeatBtn: "かなを復習",
        deckTitle: "セクション2：「ひらがな・カタカナ」デッキ",
        clearBtn: "かなを削除",
        emptyText: "かなセクションにはまだ単語がありません。",
        allReviewedText: "ひらがな・カタカナの今日の復習は完了しています。",
        deckLabel: "ひらがな・カタカナ",
        showReadingInput: false,
      },
    },
  },
  en: {
    ru: {
      name: "Английский язык",
      nativeName: "English",
      shortTag: "London · Oxford",
      onboardingTagline: "Лексика с транскрипцией, фразовые глаголы, идиомы и озвучка.",
      vibeBadge: "🇬🇧 Лондон · Oxford",
      vibeQuote: "Knowledge speaks, wisdom listens — Знание говорит, мудрость слушает",
      navLabel: "Английский язык",
      mobileNavLabel: "English",
      hubTitle: "Английский хаб",
      subtitleS1: "1 раздел: Слова и выражения с транскрипцией",
      subtitleS2: "2 раздел: Фразовые глаголы и идиомы",
      wordsUnit: "слов",
      dashWordsCardTitle: "Английских слов",
      dashReviewTaskTitle: "Повторить английские слова",
      starterTitle: "🇬🇧 English Pack (30 слов)",
      starterDesc: "Лексика + фразовые глаголы и идиомы",
      starterBtn: "Загрузить набор (30 слов)",
      starterFullBtn: "🇬🇧 Загрузить стартовый набор English (30 слов)",
      clearAllDeckBtn: "Очистить всю колоду",
      notFound: "Ничего не найдено по запросу.",
      clickToHide: "(нажмите, чтобы скрыть)",
      levelPrefix: "Ур.",
      readingLabelPlaceholder: "Транскрипция / IPA (напр. [rɪˈzɪliənt])",
      trackerGoalLabel: "Английских слов за неделю",
      trackerMilestoneTitle: "Словарный запас",
      trackerMilestoneDesc: "Добавить 25 английских карточек",
      section1: {
        id: "VOCABULARY",
        badge: "1. Лексика",
        title: "1. Слова и лексика",
        desc: "Ключевые слова, определения и транскрипция",
        cardBadge: "Лексика",
        addTitle: "Раздел 1: Добавить английское слово",
        wordPlaceholder: "Слово на английском (напр. Resilient, Perspective)",
        readingPlaceholder: "Транскрипция / IPA (напр. [rɪˈzɪliənt])",
        meaningPlaceholder: "Перевод (напр. Жизнестойкий, Перспектива)",
        repeatBtn: "Повторить Лексику",
        deckTitle: "Раздел 1: Колода «Лексика»",
        clearBtn: "Очистить Лексику",
        emptyText: "В разделе лексики пока пусто. Добавьте первое слово выше или загрузите стартовый набор!",
        allReviewedText: "Все английские слова в разделе лексики на сегодня повторены.",
        deckLabel: "Английская лексика",
        showReadingInput: true,
      },
      section2: {
        id: "GRAMMAR",
        badge: "2. Идиомы",
        title: "2. Фразовые глаголы и идиомы",
        desc: "Живая речь, выражения и разговорные обороты",
        cardBadge: "Идиома",
        addTitle: "Раздел 2: Добавить фразу или идиому",
        wordPlaceholder: "Фраза / идиома (напр. Figure out, Break the ice)",
        readingPlaceholder: "Контекст / пометка (напр. informal)",
        meaningPlaceholder: "Перевод (напр. Разобраться, Разрядить обстановку)",
        repeatBtn: "Повторить Идиомы",
        deckTitle: "Раздел 2: Колода «Идиомы & Фразы»",
        clearBtn: "Очистить Идиомы",
        emptyText: "В разделе идиом и фразовых глаголов пока пусто.",
        allReviewedText: "Все идиомы и фразы на сегодня повторены.",
        deckLabel: "Фразовые глаголы и идиомы",
        showReadingInput: true,
      },
    },
    en: {
      name: "English",
      nativeName: "English",
      shortTag: "London · Oxford",
      onboardingTagline: "Vocabulary with phonetic transcription, idioms & UK pronunciation.",
      vibeBadge: "🇬🇧 London · Oxford",
      vibeQuote: "Knowledge speaks, wisdom listens — Keep mastering every word",
      navLabel: "English Hub",
      mobileNavLabel: "English",
      hubTitle: "English Hub",
      subtitleS1: "Section 1: Core Vocabulary & Phonetics",
      subtitleS2: "Section 2: Phrasal Verbs & Idioms",
      wordsUnit: "words",
      dashWordsCardTitle: "English Cards",
      dashReviewTaskTitle: "Review English Cards",
      starterTitle: "🇬🇧 English Pack (30 cards)",
      starterDesc: "Vocabulary + Phrasal Verbs & Idioms",
      starterBtn: "Load English Pack (30)",
      starterFullBtn: "🇬🇧 Load English Starter Pack (30 cards)",
      clearAllDeckBtn: "Clear entire deck",
      notFound: "Nothing found matching your query.",
      clickToHide: "(tap to hide)",
      levelPrefix: "Lvl",
      readingLabelPlaceholder: "IPA / Note (e.g. [rɪˈzɪliənt])",
      trackerGoalLabel: "English Cards per week",
      trackerMilestoneTitle: "Lexicon Builder",
      trackerMilestoneDesc: "Add 25 English flashcards",
      section1: {
        id: "VOCABULARY",
        badge: "1. Vocab",
        title: "1. Vocabulary & Words",
        desc: "High-impact words with phonetic notes",
        cardBadge: "Vocab",
        addTitle: "Section 1: Add English Word",
        wordPlaceholder: "English word (e.g. Resilient, Perspective)",
        readingPlaceholder: "IPA / Phonetics (e.g. [rɪˈzɪliənt])",
        meaningPlaceholder: "Definition / Meaning",
        repeatBtn: "Review Vocab",
        deckTitle: "Section 1: Vocabulary Deck",
        clearBtn: "Clear Vocab",
        emptyText: "Vocabulary deck is empty. Add words above or load the starter pack!",
        allReviewedText: "All vocabulary cards are reviewed for today.",
        deckLabel: "English Vocabulary",
        showReadingInput: true,
      },
      section2: {
        id: "GRAMMAR",
        badge: "2. Idioms",
        title: "2. Phrasal Verbs & Idioms",
        desc: "Natural expressions and fluent speech",
        cardBadge: "Idiom",
        addTitle: "Section 2: Add Phrasal Verb or Idiom",
        wordPlaceholder: "Expression (e.g. Figure out, Break the ice)",
        readingPlaceholder: "Context / usage note",
        meaningPlaceholder: "Meaning / Explanation",
        repeatBtn: "Review Idioms",
        deckTitle: "Section 2: Idioms Deck",
        clearBtn: "Clear Idioms",
        emptyText: "Idioms & Phrasal Verbs deck has no cards yet.",
        allReviewedText: "No due idiom reviews remaining today.",
        deckLabel: "Phrasal Verbs & Idioms",
        showReadingInput: true,
      },
    },
    ja: {
      name: "英語",
      nativeName: "English",
      shortTag: "ロンドン・オックスフォード",
      onboardingTagline: "発音記号付き英単語・句動詞・イディオムと英語音声",
      vibeBadge: "🇬🇧 ロンドン・オックスフォード",
      vibeQuote: "Knowledge speaks, wisdom listens — 一歩ずつ語彙を極める",
      navLabel: "英語ハブ",
      mobileNavLabel: "英語",
      hubTitle: "英語ハブ",
      subtitleS1: "セクション1：重要英単語と発音",
      subtitleS2: "セクション2：句動詞・イディオム",
      wordsUnit: "語",
      dashWordsCardTitle: "英語の単語",
      dashReviewTaskTitle: "英語カードを復習",
      starterTitle: "🇬🇧 英語パック (30語)",
      starterDesc: "必須英単語 + 句動詞・イディオム",
      starterBtn: "英語パック読込 (30語)",
      starterFullBtn: "🇬🇧 英語スターターパックを読み込む (30語)",
      clearAllDeckBtn: "デッキをすべて削除",
      notFound: "一致するカードが見つかりません。",
      clickToHide: "(タップして閉じる)",
      levelPrefix: "Lvl",
      readingLabelPlaceholder: "発音記号 (例: [rɪˈzɪliənt])",
      trackerGoalLabel: "週あたりの英語単語数",
      trackerMilestoneTitle: "英語ボキャブラリー",
      trackerMilestoneDesc: "英語カードを25枚追加する",
      section1: {
        id: "VOCABULARY",
        badge: "1. 英単語",
        title: "1. 重要ボキャブラリー",
        desc: "発音記号と意味で覚える英単語",
        cardBadge: "単語",
        addTitle: "セクション1：英単語を追加",
        wordPlaceholder: "英単語 (例: Resilient, Perspective)",
        readingPlaceholder: "発音記号 / メモ (例: [rɪˈzɪliənt])",
        meaningPlaceholder: "意味（例：回復力のある）",
        repeatBtn: "英単語を復習",
        deckTitle: "セクション1：「英単語」デッキ",
        clearBtn: "英単語を削除",
        emptyText: "英単語セクションはまだ空です。",
        allReviewedText: "今日の英単語の復習は完了しました。",
        deckLabel: "重要英単語",
        showReadingInput: true,
      },
      section2: {
        id: "GRAMMAR",
        badge: "2. 表現",
        title: "2. 句動詞・イディオム",
        desc: "ネイティブがよく使う実践表現",
        cardBadge: "イディオム",
        addTitle: "セクション2：表現・句動詞を追加",
        wordPlaceholder: "表現 (例: Figure out, Break the ice)",
        readingPlaceholder: "ニュアンス / メモ",
        meaningPlaceholder: "意味（例：理解する）",
        repeatBtn: "表現を復習",
        deckTitle: "セクション2：「句動詞・イディオム」",
        clearBtn: "表現を削除",
        emptyText: "表現セクションはまだ空です。",
        allReviewedText: "イディオムの復習は完了しました。",
        deckLabel: "句動詞・イディオム",
        showReadingInput: true,
      },
    },
  },
  de: {
    ru: {
      name: "Немецкий язык",
      nativeName: "Deutsch",
      shortTag: "Berlin · A1–B2",
      onboardingTagline: "Существительные с артиклями der/die/das, глаголы и немецкое аудио.",
      vibeBadge: "🇩🇪 Берлин · Баухаус",
      vibeQuote: "Übung macht den Meister — «Повторение — путь к мастерству»",
      navLabel: "Немецкий язык",
      mobileNavLabel: "Deutsch",
      hubTitle: "Немецкий хаб",
      subtitleS1: "1 раздел: Существительные с артиклями (der / die / das)",
      subtitleS2: "2 раздел: Глаголы, фразы и разговорные обороты",
      wordsUnit: "слов",
      dashWordsCardTitle: "Немецких слов",
      dashReviewTaskTitle: "Повторить немецкие слова",
      starterTitle: "🇩🇪 Deutsch Pack (30 слов)",
      starterDesc: "Артикли der/die/das + глаголы и фразы",
      starterBtn: "Загрузить набор (30 слов)",
      starterFullBtn: "🇩🇪 Загрузить стартовый набор Deutsch (30 слов)",
      clearAllDeckBtn: "Очистить всю колоду",
      notFound: "Ничего не найдено по запросу.",
      clickToHide: "(нажмите, чтобы скрыть)",
      levelPrefix: "Ур.",
      readingLabelPlaceholder: "Мн. число / произношение (напр. die Bahnhöfe)",
      trackerGoalLabel: "Немецких слов за неделю",
      trackerMilestoneTitle: "Немецкий словарь",
      trackerMilestoneDesc: "Добавить 25 немецких карточек",
      section1: {
        id: "VOCABULARY",
        badge: "1. Существительные",
        title: "1. Существительные (der / die / das)",
        desc: "Род выделяется цветом, мн. число и транскрипция",
        cardBadge: "Nomen",
        addTitle: "Раздел 1: Добавить существительное с артиклем",
        wordPlaceholder: "С артиклем (напр. der Bahnhof, das Wasser, die Zeit)",
        readingPlaceholder: "Множественное число / чтение (напр. die Bahnhöfe)",
        meaningPlaceholder: "Перевод (напр. Вокзал, Вода, Время)",
        repeatBtn: "Повторить Существительные",
        deckTitle: "Раздел 1: Существительные",
        clearBtn: "Очистить Существительные",
        emptyText: "В разделе существительных пока пусто. Добавляйте слова с der / die / das!",
        allReviewedText: "Все существительные на сегодня повторены.",
        deckLabel: "Существительные (der / die / das)",
        showReadingInput: true,
      },
      section2: {
        id: "GRAMMAR",
        badge: "2. Глаголы",
        title: "2. Глаголы и фразы",
        desc: "Базовые глаголы, устойчивые фразы и диалоги",
        cardBadge: "Verben",
        addTitle: "Раздел 2: Добавить глагол или фразу",
        wordPlaceholder: "Слово / фраза (напр. verstehen, Vielen Dank)",
        readingPlaceholder: "Форма / примечание (напр. verstand · hat verstanden)",
        meaningPlaceholder: "Перевод (напр. Понимать, Большое спасибо)",
        repeatBtn: "Повторить Глаголы",
        deckTitle: "Раздел 2: Глаголы и фразы",
        clearBtn: "Очистить Глаголы",
        emptyText: "В разделе глаголов и фраз пока пусто.",
        allReviewedText: "Все глаголы и фразы на сегодня повторены.",
        deckLabel: "Глаголы и фразы",
        showReadingInput: true,
      },
    },
    en: {
      name: "German",
      nativeName: "Deutsch",
      shortTag: "Berlin · A1–B2",
      onboardingTagline: "Nouns with color-coded der/die/das articles, verbs & German speech.",
      vibeBadge: "🇩🇪 Berlin · Bauhaus",
      vibeQuote: "Übung macht den Meister — Practice makes the master",
      navLabel: "German Hub",
      mobileNavLabel: "Deutsch",
      hubTitle: "German Hub",
      subtitleS1: "Section 1: Nouns & Articles (der / die / das)",
      subtitleS2: "Section 2: Verbs & Everyday Phrases",
      wordsUnit: "words",
      dashWordsCardTitle: "German Words",
      dashReviewTaskTitle: "Review German Words",
      starterTitle: "🇩🇪 German Pack (30 words)",
      starterDesc: "der/die/das Nouns + Verbs & Phrases",
      starterBtn: "Load German Pack (30)",
      starterFullBtn: "🇩🇪 Load German Starter Pack (30 words)",
      clearAllDeckBtn: "Clear entire deck",
      notFound: "Nothing found matching your query.",
      clickToHide: "(tap to hide)",
      levelPrefix: "Lvl",
      readingLabelPlaceholder: "Plural / Pronunciation note (e.g. die Bahnhöfe)",
      trackerGoalLabel: "German Words per week",
      trackerMilestoneTitle: "German Lexicon",
      trackerMilestoneDesc: "Add 25 German flashcards",
      section1: {
        id: "VOCABULARY",
        badge: "1. Nouns",
        title: "1. Nouns (der / die / das)",
        desc: "Color-coded gender articles & plural forms",
        cardBadge: "Nomen",
        addTitle: "Section 1: Add German Noun",
        wordPlaceholder: "Noun with article (e.g. der Bahnhof, das Wasser)",
        readingPlaceholder: "Plural form / Phonetics (e.g. die Bahnhöfe)",
        meaningPlaceholder: "Translation / Meaning",
        repeatBtn: "Review Nouns",
        deckTitle: "Section 1: Nouns Deck",
        clearBtn: "Clear Nouns",
        emptyText: "Nouns section is empty. Add words with der / die / das!",
        allReviewedText: "All German nouns are reviewed for today.",
        deckLabel: "Nouns (der / die / das)",
        showReadingInput: true,
      },
      section2: {
        id: "GRAMMAR",
        badge: "2. Verbs",
        title: "2. Verbs & Phrases",
        desc: "Essential German verbs & conversational expressions",
        cardBadge: "Verben",
        addTitle: "Section 2: Add Verb or Phrase",
        wordPlaceholder: "Verb or phrase (e.g. verstehen, Vielen Dank)",
        readingPlaceholder: "Verb forms / Usage note",
        meaningPlaceholder: "Translation / Meaning",
        repeatBtn: "Review Verbs",
        deckTitle: "Section 2: Verbs & Phrases Deck",
        clearBtn: "Clear Verbs",
        emptyText: "Verbs & Phrases section has no cards yet.",
        allReviewedText: "All verbs & phrases are reviewed for today.",
        deckLabel: "Verbs & Phrases",
        showReadingInput: true,
      },
    },
    ja: {
      name: "ドイツ語",
      nativeName: "Deutsch",
      shortTag: "ベルリン・バウハウス",
      onboardingTagline: "冠詞(der/die/das)色分け付き名詞、動詞、ドイツ語音声",
      vibeBadge: "🇩🇪 ベルリン・バウハウス",
      vibeQuote: "Übung macht den Meister — 習うより慣れよ",
      navLabel: "ドイツ語ハブ",
      mobileNavLabel: "ドイツ語",
      hubTitle: "ドイツ語ハブ",
      subtitleS1: "セクション1：冠詞付き名詞 (der / die / das)",
      subtitleS2: "セクション2：動詞と日常フレーズ",
      wordsUnit: "語",
      dashWordsCardTitle: "ドイツ語の単語",
      dashReviewTaskTitle: "ドイツ語を復習",
      starterTitle: "🇩🇪 ドイツ語パック (30語)",
      starterDesc: "der/die/das 名詞 + 基本動詞・フレーズ",
      starterBtn: "ドイツ語読込 (30語)",
      starterFullBtn: "🇩🇪 ドイツ語スターターパックを読み込む (30語)",
      clearAllDeckBtn: "デッキをすべて削除",
      notFound: "一致する単語が見つかりません。",
      clickToHide: "(タップして閉じる)",
      levelPrefix: "Lvl",
      readingLabelPlaceholder: "複数形 / 発音メモ (例: die Bahnhöfe)",
      trackerGoalLabel: "週あたりのドイツ語単語数",
      trackerMilestoneTitle: "ドイツ語ボキャブラリー",
      trackerMilestoneDesc: "ドイツ語カードを25枚追加する",
      section1: {
        id: "VOCABULARY",
        badge: "1. 名詞",
        title: "1. 名詞 (der / die / das)",
        desc: "性の色分け付きドイツ語名詞と複数形",
        cardBadge: "名詞",
        addTitle: "セクション1：名詞を追加",
        wordPlaceholder: "冠詞付き名詞 (例: der Bahnhof, das Wasser)",
        readingPlaceholder: "複数形 / メモ (例: die Bahnhöfe)",
        meaningPlaceholder: "意味（例：駅、水）",
        repeatBtn: "名詞を復習",
        deckTitle: "セクション1：「名詞」デッキ",
        clearBtn: "名詞を削除",
        emptyText: "名詞セクションはまだ空です。",
        allReviewedText: "今日の名詞の復習は完了しました。",
        deckLabel: "名詞 (der / die / das)",
        showReadingInput: true,
      },
      section2: {
        id: "GRAMMAR",
        badge: "2. 動詞",
        title: "2. 動詞とフレーズ",
        desc: "基本動詞と実用会話表現",
        cardBadge: "動詞",
        addTitle: "セクション2：動詞・表現を追加",
        wordPlaceholder: "動詞 / 表現 (例: verstehen, Vielen Dank)",
        readingPlaceholder: "活用 / メモ",
        meaningPlaceholder: "意味（例：理解する、ありがとう）",
        repeatBtn: "動詞を復習",
        deckTitle: "セクション2：「動詞・フレーズ」",
        clearBtn: "動詞を削除",
        emptyText: "動詞セクションはまだ空です。",
        allReviewedText: "動詞の復習は完了しました。",
        deckLabel: "動詞とフレーズ",
        showReadingInput: true,
      },
    },
  },
};

export interface OnboardingUiTexts {
  stepBadgePrefix: string;
  step1Title: string;
  step1Subtitle: string;
  step2Title: string;
  step2Subtitle: string;
  step2Note: string;
  optionProgYesTitle: string;
  optionProgYesDesc: string;
  optionProgNoTitle: string;
  optionProgNoDesc: string;
  continueBtn: string;
  backBtn: string;
  finishBtn: string;
  savingBtn: string;
}

export const ONBOARDING_TEXTS: Record<Language, OnboardingUiTexts> = {
  ru: {
    stepBadgePrefix: "Шаг",
    step1Title: "Какой язык ты хочешь изучать?",
    step1Subtitle: "KAVAULT полностью подстроит словари, озвучку, карточки и визуальный вайб под твой выбор.",
    step2Title: "Нужны ли вкладки для программирования?",
    step2Subtitle: "Выбери формат рабочего пространства. Граф знаний и Трекер обучения всегда будут с тобой.",
    step2Note: "Ты в любой момент сможешь изменить это в Настройках.",
    optionProgYesTitle: "Да, оставить программирование",
    optionProgYesDesc: "Включить Developer Hub (ссылки, статьи) и коллекцию GitHub-проектов.",
    optionProgNoTitle: "Нет, только языки и знания",
    optionProgNoDesc: "Скрыть Dev Hub и GitHub — чистый фокус на изучении языка, трекере и графе знаний.",
    continueBtn: "Далее →",
    backBtn: "← Назад",
    finishBtn: "Настроить KAVAULT →",
    savingBtn: "Настройка...",
  },
  en: {
    stepBadgePrefix: "Step",
    step1Title: "Which language do you want to learn?",
    step1Subtitle: "KAVAULT adapts flashcards, voice pronunciation, starter decks, and visual vibe to your target language.",
    step2Title: "Do you need programming tabs?",
    step2Subtitle: "Choose your workspace layout. Knowledge Graph and Learning Tracker are always included for everyone.",
    step2Note: "You can switch this anytime in Settings.",
    optionProgYesTitle: "Yes, keep programming tabs",
    optionProgYesDesc: "Keep Developer Hub (articles & bookmarks) and GitHub Projects collection.",
    optionProgNoTitle: "No, languages only",
    optionProgNoDesc: "Hide Dev Hub & GitHub — clean distraction-free space for language learning, tracker & graph.",
    continueBtn: "Continue →",
    backBtn: "← Back",
    finishBtn: "Launch My KAVAULT →",
    savingBtn: "Setting up...",
  },
  ja: {
    stepBadgePrefix: "ステップ",
    step1Title: "どの言語を学びたいですか？",
    step1Subtitle: "KAVAULTは単語帳、音声発音、初期パック、全体の雰囲気を選択した言語に最適化します。",
    step2Title: "プログラミング関連のタブは必要ですか？",
    step2Subtitle: "ワークスペースを選択してください。ナレッジグラフと学習トラッカーは全員が利用できます。",
    step2Note: "設定からいつでも変更できます。",
    optionProgYesTitle: "はい、プログラミングタブも使う",
    optionProgYesDesc: "開発者ハブ（記事・リンク集）とGitHubコレクションを表示します。",
    optionProgNoTitle: "いいえ、語学学習のみに集中する",
    optionProgNoDesc: "開発者ハブとGitHubを非表示にし、語学・トラッカー・グラフに集中します。",
    continueBtn: "次へ →",
    backBtn: "← 戻る",
    finishBtn: "KAVAULTを開始 →",
    savingBtn: "設定中...",
  },
};

export function getGermanArticleStyle(word: string): {
  article: "der" | "die" | "das" | null;
  color: string;
  bg: string;
} | null {
  const lower = word.trim().toLowerCase();
  if (lower.startsWith("der ")) {
    return { article: "der", color: "#60a5fa", bg: "rgba(59, 130, 246, 0.16)" };
  }
  if (lower.startsWith("die ")) {
    return { article: "die", color: "#fb7185", bg: "rgba(244, 63, 94, 0.16)" };
  }
  if (lower.startsWith("das ")) {
    return { article: "das", color: "#34d399", bg: "rgba(16, 185, 129, 0.16)" };
  }
  return null;
}

export interface StudyLevelMeta {
  id: string;
  badge: string;
  color: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
}

export const STUDY_LEVELS: Record<StudyLanguage, StudyLevelMeta[]> = {
  ja: [
    {
      id: "N5",
      badge: "🌱 N5",
      color: "#10b981",
      title: { ru: "JLPT N5 — Начальный", en: "JLPT N5 — Beginner", ja: "JLPT N5（初級基礎）" },
      subtitle: { ru: "Азбука, базовые фразы, ~100 иероглифов", en: "Kana, polite basics, ~100 kanji", ja: "かな・基本表現・基礎漢字" },
    },
    {
      id: "N4",
      badge: "🌿 N4",
      color: "#3b82f6",
      title: { ru: "JLPT N4 — Базовый", en: "JLPT N4 — Elementary", ja: "JLPT N4（初級応用）" },
      subtitle: { ru: "Повседневное общение, длительное время, причины", en: "Everyday conversation & て-forms", ja: "日常会話・て形・理由表現" },
    },
    {
      id: "N3",
      badge: "🎋 N3",
      color: "#ec4899",
      title: { ru: "JLPT N3 — Средний", en: "JLPT N3 — Intermediate", ja: "JLPT N3（中級）" },
      subtitle: { ru: "Сложные обороты, чтение статей и оттенки", en: "Natural speech, reading & nuance", ja: "自然表現・読解・複合文法" },
    },
  ],
  en: [
    {
      id: "A1",
      badge: "🌱 A1",
      color: "#10b981",
      title: { ru: "CEFR A1 — Старт", en: "CEFR A1 — Beginner", ja: "CEFR A1（入門）" },
      subtitle: { ru: "Алфавит жизни, знакомство, базовые времена", en: "Core phrases & everyday survival", ja: "基本表現と日常の挨拶" },
    },
    {
      id: "A2",
      badge: "🌿 A2",
      color: "#3b82f6",
      title: { ru: "CEFR A2 — Базовый", en: "CEFR A2 — Elementary", ja: "CEFR A2（初級）" },
      subtitle: { ru: "Город, путешествия, модальные глаголы", en: "City life, routines & modals", ja: "街歩き・日常・助動詞" },
    },
    {
      id: "B1",
      badge: "🏛️ B1",
      color: "#8b5cf6",
      title: { ru: "CEFR B1 — Средний", en: "CEFR B1 — Intermediate", ja: "CEFR B1（中級）" },
      subtitle: { ru: "Present Perfect, пассив, живые дискуссии", en: "Fluency, conditionals & stories", ja: "現在完了・条件文・長文理解" },
    },
    {
      id: "B2",
      badge: "🎓 B2",
      color: "#f43f5e",
      title: { ru: "CEFR B2 — Продвинутый", en: "CEFR B2 — Upper-Int", ja: "CEFR B2（中上級）" },
      subtitle: { ru: "Сложные идиомы, дебаты и академический стиль", en: "Nuance, idioms & sharp expression", ja: "高度な語彙・イディオム・議論" },
    },
  ],
  de: [
    {
      id: "A1",
      badge: "🌱 A1",
      color: "#10b981",
      title: { ru: "Goethe A1 — Старт", en: "Goethe A1 — Beginner", ja: "A1（入門・基礎）" },
      subtitle: { ru: "Артикли der/die/das, порядок V2, кафе", en: "Articles der/die/das & V2 rule", ja: "冠詞と動詞第2位のルール" },
    },
    {
      id: "A2",
      badge: "🌿 A2",
      color: "#3b82f6",
      title: { ru: "Goethe A2 — Базовый", en: "Goethe A2 — Elementary", ja: "A2（初級日常）" },
      subtitle: { ru: "Akkusativ / Dativ, прошедшее Perfekt", en: "Cases, transit & Perfekt past", ja: "3・4格変化と完了形" },
    },
    {
      id: "B1",
      badge: "🏛️ B1",
      color: "#f59e0b",
      title: { ru: "Goethe B1 — Средний", en: "Goethe B1 — Intermediate", ja: "B1（中級）" },
      subtitle: { ru: "Придаточные weil/obwohl, природа, работа", en: "Subordinate clauses & stories", ja: "従属節と長文ストーリー" },
    },
    {
      id: "B2",
      badge: "🎓 B2",
      color: "#ef4444",
      title: { ru: "Goethe B2 — Продвинутый", en: "Goethe B2 — Upper-Int", ja: "B2（中上級）" },
      subtitle: { ru: "Konjunktiv II, Passiv и деловой немецкий", en: "Konjunktiv II, passive & nuance", ja: "接続法II式と受動態の応用" },
    },
  ],
};

export function getDefaultStudyLevel(lang: StudyLanguage): string {
  return lang === "ja" ? "N5" : "A1";
}

export const LEVEL_ROADMAP_LABELS: Record<
  Language,
  {
    roadmapTitle: string;
    allLevels: string;
    sectionReviewBtn: string;
    cardLevelLabel: string;
  }
> = {
  ru: {
    roadmapTitle: "Уровни программы",
    allLevels: "Все уровни",
    sectionReviewBtn: "Повторить уровень",
    cardLevelLabel: "Уровень программы",
  },
  en: {
    roadmapTitle: "Course Levels",
    allLevels: "All Levels",
    sectionReviewBtn: "Review Level",
    cardLevelLabel: "Course Level",
  },
  ja: {
    roadmapTitle: "レベル別コース",
    allLevels: "全レベル",
    sectionReviewBtn: "このレベルを復習",
    cardLevelLabel: "コースレベル",
  },
};
