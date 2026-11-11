import type { Language } from "../i18n/translations";
import type { StudyLanguage } from "./studyVibes";

export type StudySkillTab = "vocabulary" | "grammar" | "reading" | "listening";

export interface SkillStudioLabels {
  tabs: Record<StudySkillTab, { label: string; shortDesc: string }>;
  atmosphereOn: string;
  atmosphereOff: string;
  grammar: {
    curatedTitle: string;
    customTitle: string;
    formulaLabel: string;
    examplesLabel: string;
    drillLabel: string;
    addRuleToDeck: string;
    addedBadge: string;
    correctFeedback: string;
    wrongFeedback: string;
    addNoteTitle: string;
    ruleTitlePh: string;
    patternPh: string;
    explanationPh: string;
    examplePh: string;
    levelPh: string;
    saveNoteBtn: string;
    emptyCustom: string;
  };
  reading: {
    libraryTitle: string;
    myTextsTitle: string;
    playAll: string;
    stopAudio: string;
    speedSlow: string;
    speedNormal: string;
    speedFast: string;
    showReadingHint: string;
    showTranslation: string;
    vocabTitle: string;
    addWordBtn: string;
    addedWordBtn: string;
    quizTitle: string;
    quizPassed: string;
    addCustomTitle: string;
    titlePh: string;
    textPh: string;
    translationPh: string;
    saveTextBtn: string;
    emptyCustom: string;
  };
  listening: {
    dialoguesTab: string;
    quizTab: string;
    dictationTab: string;
    sourceCurated: string;
    sourceMyCards: string;
    needMoreCards: string;
    playFull: string;
    stopPlaying: string;
    replay: string;
    slowMode: string;
    normalMode: string;
    showTranscript: string;
    hideTranscript: string;
    questionPrompt: string;
    dictationPrompt: string;
    dictationPlaceholder: string;
    checkBtn: string;
    revealBtn: string;
    nextBtn: string;
    scoreLabel: string;
    streakLabel: string;
    perfectMatch: string;
    almostMatch: string;
    answerPrefix: string;
  };
}

export const SKILL_STUDIO_TEXTS: Record<Language, SkillStudioLabels> = {
  ru: {
    tabs: {
      vocabulary: { label: "Лексика и Карточки", shortDesc: "Слова, иероглифы, SRS-повторение" },
      grammar: { label: "Грамматика", shortDesc: "Конструкции, схемы и мини-тесты" },
      reading: { label: "Чтение", shortDesc: "Тексты с озвучкой и разбором слов" },
      listening: { label: "Аудирование", shortDesc: "Диалоги, квиз и аудио-диктант" },
    },
    atmosphereOn: "Атмосфера вкл.",
    atmosphereOff: "Фокус без анимации",
    grammar: {
      curatedTitle: "Ключевые грамматические конструкции",
      customTitle: "Мои заметки по грамматике",
      formulaLabel: "Конструкция",
      examplesLabel: "Примеры с озвучкой",
      drillLabel: "Быстрая проверка",
      addRuleToDeck: "В карточки SRS",
      addedBadge: "Добавлено ✓",
      correctFeedback: "Верно! Отличное понимание.",
      wrongFeedback: "Не совсем — посмотри подсказку выше и попробуй снова.",
      addNoteTitle: "Добавить своё правило / шаблон",
      ruleTitlePh: "Название правила (напр. Сослагательное наклонение)",
      patternPh: "Формула (напр. Would + Infinitive)",
      explanationPh: "Объяснение и нюансы...",
      examplePh: "Пример предложения",
      levelPh: "Уровень (A2, B1, N4...)",
      saveNoteBtn: "Сохранить правило",
      emptyCustom: "Добавляй собственные грамматические правила и конспекты — они синхронизируются на всех устройствах.",
    },
    reading: {
      libraryTitle: "Тексты для чтения и практики",
      myTextsTitle: "Мои тексты",
      playAll: "Читать вслух",
      stopAudio: "Стоп",
      speedSlow: "0.75x Медл.",
      speedNormal: "0.95x Норм.",
      speedFast: "1.15x Быстр.",
      showReadingHint: "Чтение / подсказки",
      showTranslation: "Перевод",
      vocabTitle: "Ключевые слова из текста (1 клик → в SRS)",
      addWordBtn: "В словарь",
      addedWordBtn: "В колоде ✓",
      quizTitle: "Проверка понимания",
      quizPassed: "Верно!",
      addCustomTitle: "Добавить свой текст для чтения и озвучки",
      titlePh: "Заголовок (напр. Статья из блога)",
      textPh: "Вставьте текст на изучаемом языке...",
      translationPh: "Перевод или заметки (необязательно)",
      saveTextBtn: "Сохранить текст",
      emptyCustom: "Вставь любой текст на изучаемом языке — сможешь слушать его вслух на разной скорости и разбирать!",
    },
    listening: {
      dialoguesTab: "Живые диалоги",
      quizTab: "Аудио-квиз",
      dictationTab: "Аудио-диктант",
      sourceCurated: "Курсовые фразы",
      sourceMyCards: "Мои SRS карточки",
      needMoreCards: "Добавь хотя бы 4 карточки в словарь, чтобы тренировать аудирование по своей колоде!",
      playFull: "Проиграть весь диалог",
      stopPlaying: "Остановить",
      replay: "Прослушать",
      slowMode: "Черепаха 0.7x",
      normalMode: "Обычно 1.0x",
      showTranscript: "Показать текст",
      hideTranscript: "Скрыть текст",
      questionPrompt: "Прослушай фразу и выбери точный перевод:",
      dictationPrompt: "Прослушай запись и введи услышанное слово или фразу:",
      dictationPlaceholder: "Введи то, что услышал(а)...",
      checkBtn: "Проверить",
      revealBtn: "Показать ответ",
      nextBtn: "Следующая фраза →",
      scoreLabel: "Счёт",
      streakLabel: "Серия",
      perfectMatch: "Идеально! Отличный слух!",
      almostMatch: "Почти точно — обрати внимание на детали.",
      answerPrefix: "Правильный ответ:",
    },
  },
  en: {
    tabs: {
      vocabulary: { label: "Vocabulary & Cards", shortDesc: "Words, kanji/idioms & SRS deck" },
      grammar: { label: "Grammar", shortDesc: "Patterns, explanations & drills" },
      reading: { label: "Reading", shortDesc: "Stories with audio & 1-click vocab" },
      listening: { label: "Listening", shortDesc: "Dialogues, audio quiz & dictation" },
    },
    atmosphereOn: "Atmosphere On",
    atmosphereOff: "Focus Mode",
    grammar: {
      curatedTitle: "Core Grammar Patterns",
      customTitle: "My Grammar Notes",
      formulaLabel: "Pattern",
      examplesLabel: "Spoken Examples",
      drillLabel: "Quick Check",
      addRuleToDeck: "Add to SRS",
      addedBadge: "Added ✓",
      correctFeedback: "Spot on! Great grasp of the rule.",
      wrongFeedback: "Not quite — review the pattern above and try again.",
      addNoteTitle: "Save custom grammar rule",
      ruleTitlePh: "Rule name (e.g. Conditionals)",
      patternPh: "Formula (e.g. If + Past, would + V)",
      explanationPh: "Notes & usage exceptions...",
      examplePh: "Example sentence",
      levelPh: "Level (A2, B1, N4...)",
      saveNoteBtn: "Save Rule",
      emptyCustom: "Create personal grammar summaries that sync across all your devices.",
    },
    reading: {
      libraryTitle: "Graded Reading Room",
      myTextsTitle: "My Texts",
      playAll: "Read Aloud",
      stopAudio: "Stop",
      speedSlow: "0.75x Slow",
      speedNormal: "0.95x Normal",
      speedFast: "1.15x Fast",
      showReadingHint: "Reading Hints",
      showTranslation: "Translation",
      vocabTitle: "Key Words (1 click → SRS Deck)",
      addWordBtn: "Add Card",
      addedWordBtn: "In Deck ✓",
      quizTitle: "Comprehension Check",
      quizPassed: "Correct!",
      addCustomTitle: "Add your own text for audio & study",
      titlePh: "Title (e.g. News excerpt)",
      textPh: "Paste any text in your target language...",
      translationPh: "Translation or study notes (optional)",
      saveTextBtn: "Save Text",
      emptyCustom: "Paste any article or story to listen with adjustable speed and study.",
    },
    listening: {
      dialoguesTab: "Real Dialogues",
      quizTab: "Listening Quiz",
      dictationTab: "Audio Dictation",
      sourceCurated: "Curated Phrases",
      sourceMyCards: "My SRS Cards",
      needMoreCards: "Add at least 4 flashcards to train listening with your own deck!",
      playFull: "Play Full Dialogue",
      stopPlaying: "Stop",
      replay: "Play Audio",
      slowMode: "Slow 0.7x",
      normalMode: "Normal 1.0x",
      showTranscript: "Show Transcript",
      hideTranscript: "Hide Transcript",
      questionPrompt: "Listen carefully and pick the matching meaning:",
      dictationPrompt: "Listen to the audio and type exactly what you hear:",
      dictationPlaceholder: "Type what you hear...",
      checkBtn: "Check",
      revealBtn: "Reveal Answer",
      nextBtn: "Next Track →",
      scoreLabel: "Score",
      streakLabel: "Streak",
      perfectMatch: "Perfect! Sharp ear!",
      almostMatch: "Close! Check small details.",
      answerPrefix: "Answer:",
    },
  },
  ja: {
    tabs: {
      vocabulary: { label: "語彙・単語帳", shortDesc: "単語・漢字・間隔反復(SRS)" },
      grammar: { label: "文法スタジオ", shortDesc: "文型・解説・練習問題" },
      reading: { label: "読解ルーム", shortDesc: "音声付き読み物・ワンクリック追加" },
      listening: { label: "リスニング", shortDesc: "会話・聴き取りクイズ・ディクテーション" },
    },
    atmosphereOn: "演出オン",
    atmosphereOff: "集中モード",
    grammar: {
      curatedTitle: "重要文法パターン",
      customTitle: "マイ文法ノート",
      formulaLabel: "文型",
      examplesLabel: "音声付き例文",
      drillLabel: "確認クイズ",
      addRuleToDeck: "単語帳に追加",
      addedBadge: "追加済み ✓",
      correctFeedback: "正解！よく理解できています。",
      wrongFeedback: "もう一度上の解説を確認してみましょう。",
      addNoteTitle: "オリジナル文法メモを追加",
      ruleTitlePh: "文法名",
      patternPh: "形・パターン",
      explanationPh: "使い方のポイント...",
      examplePh: "例文",
      levelPh: "レベル (N5, B1...)",
      saveNoteBtn: "保存する",
      emptyCustom: "自分だけの文法ノートを保存して、全デバイスで同期できます。",
    },
    reading: {
      libraryTitle: "レベル別リーディング",
      myTextsTitle: "マイテキスト",
      playAll: "音読する",
      stopAudio: "停止",
      speedSlow: "0.75x ゆっくり",
      speedNormal: "0.95x 標準",
      speedFast: "1.15x 速め",
      showReadingHint: "読み・ヒント",
      showTranslation: "対訳",
      vocabTitle: "重要単語（クリックで単語帳へ）",
      addWordBtn: "追加",
      addedWordBtn: "登録済 ✓",
      quizTitle: "内容理解チェック",
      quizPassed: "正解！",
      addCustomTitle: "自分の文章を追加して音声で練習",
      titlePh: "タイトル",
      textPh: "学習中の言語で文章を入力...",
      translationPh: "訳やメモ（任意）",
      saveTextBtn: "テキストを保存",
      emptyCustom: "好きな文章を貼り付けて、スピード調整付きで音読練習ができます。",
    },
    listening: {
      dialoguesTab: "会話トレーニング",
      quizTab: "聴き取りクイズ",
      dictationTab: "ディクテーション",
      sourceCurated: "厳選フレーズ",
      sourceMyCards: "マイ単語帳",
      needMoreCards: "自分のカードで練習するには、まず単語を4つ以上登録してください。",
      playFull: "会話を通しで再生",
      stopPlaying: "停止",
      replay: "再生",
      slowMode: "スロー 0.7x",
      normalMode: "通常 1.0x",
      showTranscript: "スクリプト表示",
      hideTranscript: "スクリプト非表示",
      questionPrompt: "音声を聴いて、正しい意味を選びましょう：",
      dictationPrompt: "聴こえた単語やフレーズを入力してください：",
      dictationPlaceholder: "聴こえた内容を入力...",
      checkBtn: "判定する",
      revealBtn: "答えを見る",
      nextBtn: "次の問題 →",
      scoreLabel: "スコア",
      streakLabel: "連続正解",
      perfectMatch: "完璧です！",
      almostMatch: "惜しい！細かい点を確認しよう。",
      answerPrefix: "正解：",
    },
  },
};

export interface GrammarLesson {
  id: string;
  level: string;
  pattern: string;
  title: Record<Language, string>;
  explanation: Record<Language, string>;
  examples: { target: string; reading?: string; tr: Record<Language, string> }[];
  quiz: {
    prompt: string;
    options: string[];
    correctIdx: number;
    hint: Record<Language, string>;
  };
}

export interface ReadingPassageItem {
  id: string;
  level: string;
  emoji: string;
  title: Record<Language, string>;
  subtitle: Record<Language, string>;
  sentences: { target: string; reading?: string; tr: Record<Language, string> }[];
  vocab: {
    word: string;
    reading?: string;
    meaning: Record<Language, string>;
    type: "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA";
  }[];
  questions: {
    question: Record<Language, string>;
    options: Record<Language, string[]>;
    correctIdx: number;
  }[];
}

export interface ListeningDialogue {
  id: string;
  level: string;
  emoji: string;
  title: Record<Language, string>;
  scene: Record<Language, string>;
  lines: { speaker: string; text: string; reading?: string; tr: Record<Language, string> }[];
}

export interface ListeningPromptItem {
  text: string;
  reading?: string;
  meaning: Record<Language, string>;
}

export const GRAMMAR_LESSONS: Record<StudyLanguage, GrammarLesson[]> = {
  ja: [
    {
      id: "ja-wa-ga",
      level: "N5",
      pattern: "A は B です / が あります",
      title: {
        ru: "Частицы は (тема) и が (субъект)",
        en: "Topic は vs Subject が",
        ja: "助詞「は」と「が」の使い分け",
      },
      explanation: {
        ru: "は (читается «ва») задаёт тему разговора («Что касается меня...»). が выделяет конкретный субъект нового факта или используется с глаголами наличия あります / います.",
        en: "は (pronounced 'wa') marks the broader topic, whereas が spotlights a specific subject, new information, or existence (あります / います).",
        ja: "「は」は文の主題（「〜について言えば」）を示し、「が」は新しい情報や存在（「〜がある/いる」）の主語を表します。",
      },
      examples: [
        {
          target: "私は学生です。",
          reading: "わたしは がくせいです。",
          tr: { ru: "Я — студент.", en: "I am a student.", ja: "（自分のこととして）学生です。" },
        },
        {
          target: "机の上に本があります。",
          reading: "つくえの うえに ほんが あります。",
          tr: { ru: "На столе лежит книга.", en: "There is a book on the desk.", ja: "机の上に本が存在します。" },
        },
      ],
      quiz: {
        prompt: "あそこに 猫（ねこ）＿＿ います。",
        options: ["は", "が", "を"],
        correctIdx: 1,
        hint: {
          ru: "С глаголом наличия живых существ います всегда используется субъектная частица が.",
          en: "Existence verbs (います / あります) pair with が.",
          ja: "存在を表す「いる/ある」の主語には「が」を使います。",
        },
      },
    },
    {
      id: "ja-masu",
      level: "N5",
      pattern: "V-ます / V-ません / V-ました",
      title: {
        ru: "Вежливая форма глаголов (〜ます)",
        en: "Polite Verb Conjugation (〜ます)",
        ja: "動詞の丁寧形（〜ます・〜ません・〜ました）",
      },
      explanation: {
        ru: "Стандартный вежливый стиль речи в Японии: 〜ます (настоящее/будущее), 〜ません (отрицание), 〜ました (прошедшее), 〜ませんでした (отрицание в прошлом).",
        en: "Standard polite form: 〜ます (present/future), 〜ません (negative), 〜ました (past), 〜ませんでした (past negative).",
        ja: "日常会話の基本となる丁寧形です。肯定・否定・過去・過去否定の4つをセットで覚えましょう。",
      },
      examples: [
        {
          target: "毎日 日本語を 勉強します。",
          reading: "まいにち にほんごを べんきょうします。",
          tr: { ru: "Я каждый день учу японский.", en: "I study Japanese every day.", ja: "毎日の習慣として日本語を学習します。" },
        },
        {
          target: "昨日は テレビを 見ませんでした。",
          reading: "きのうは テレビを みませんでした。",
          tr: { ru: "Вчера я не смотрел телевизор.", en: "Yesterday I didn't watch TV.", ja: "昨日の過去の否定です。" },
        },
      ],
      quiz: {
        prompt: "今朝 コーヒーを 飲み＿＿。（прошедшее время）",
        options: ["ます", "ません", "ました"],
        correctIdx: 2,
        hint: {
          ru: "Указатель времени «сегодня утром» (今朝) в завершённом действии требует прошедшего времени 〜ました.",
          en: "Past completed polite ending is 〜ました.",
          ja: "今朝起きた過去の出来事なので「〜ました」を使います。",
        },
      },
    },
    {
      id: "ja-tai",
      level: "N5",
      pattern: "V-stem + たいです",
      title: {
        ru: "Желание действия (〜たいです — хочу...)",
        en: "Expressing Desire (〜たいです)",
        ja: "願望を表す「〜たいです」",
      },
      explanation: {
        ru: "Уберите ます у вежливого глагола и добавьте たいです, чтобы сказать «я хочу что-то сделать». Объект можно выделять через が или を.",
        en: "Attach たいです to the verb ます-stem to say 'I want to [verb]'. Direct objects use が or を.",
        ja: "動詞のます形から「ます」を取り、「たいです」をつけると自分の希望を表せます。",
      },
      examples: [
        {
          target: "京都へ 行きたいです。",
          reading: "きょうとへ いきたいです。",
          tr: { ru: "Я хочу поехать в Киото.", en: "I want to go to Kyoto.", ja: "京都へ行く希望を表しています。" },
        },
        {
          target: "冷たい 水が 飲みたいです。",
          reading: "つめたい みずが のみたいです。",
          tr: { ru: "Я хочу выпить холодной воды.", en: "I want to drink cold water.", ja: "冷たい水を飲むことを希望しています。" },
        },
      ],
      quiz: {
        prompt: "日本の ラーメンを 食べ＿＿。",
        options: ["たいです", "ますです", "でした"],
        correctIdx: 0,
        hint: {
          ru: "食べます − ます + たいです → 食べたいです.",
          en: "Drop ます from 食べます and attach たいです.",
          ja: "「食べます」の「ます」を「たいです」に変えます。",
        },
      },
    },
    {
      id: "ja-te-iru",
      level: "N4",
      pattern: "V-て + います",
      title: {
        ru: "Длительное действие и состояние (〜ています)",
        en: "Ongoing Actions & States (〜ています)",
        ja: "進行中の動作・状態（〜ています）",
      },
      explanation: {
        ru: "Показывает либо процесс прямо сейчас (аналог Continuous: «читаю сейчас»), либо постоянное состояние/результат («живу в Токио», «женат», «знаю»).",
        en: "Used both for ongoing actions ('is doing right now') and resulting ongoing states ('lives in Tokyo', 'is married', 'knows').",
        ja: "今まさに進行している動作だけでなく、「住んでいます・知っています」のような継続した状態も表します。",
      },
      examples: [
        {
          target: "今 雨が 降っています。",
          reading: "いま あめが ふっています。",
          tr: { ru: "Сейчас идёт дождь.", en: "It is raining right now.", ja: "今雨が降っている最中です。" },
        },
        {
          target: "兄は 東京に 住んでいます。",
          reading: "あには とうきょうに すんでいます。",
          tr: { ru: "Старший брат живёт в Токио.", en: "My older brother lives in Tokyo.", ja: "居住という継続した状態です。" },
        },
      ],
      quiz: {
        prompt: "田中さんは 今 本を 読んで＿＿。",
        options: ["います", "あります", "します"],
        correctIdx: 0,
        hint: {
          ru: "Конструкция длительного действия: て-форма глагола + います.",
          en: "Progressive tense combines the て-form with います.",
          ja: "「動詞て形＋います」で進行形になります。",
        },
      },
    },
    {
      id: "ja-kara-node",
      level: "N4",
      pattern: "〜から / 〜ので (причина)",
      title: {
        ru: "Причина и следствие (потому что)",
        en: "Reasons: から vs ので",
        ja: "理由を表す「から」と「ので」",
      },
      explanation: {
        ru: "Оба слова ставятся в конце первой части («так как...»). から звучит более прямо и субъективно, а ので звучит мягче, вежливее и объективнее (популярно при извинениях и просьбах).",
        en: "Both mean 'because / since' and follow the reason clause. から is direct/personal; ので sounds softer and more polite.",
        ja: "「から」は主観的で話し言葉寄り、「ので」は丁寧で柔らかい客観的な理由を表します。",
      },
      examples: [
        {
          target: "時間が ないですから、急ぎましょう。",
          reading: "じかんが ないですから、いそぎましょう。",
          tr: { ru: "Так как времени нет, давай поспешим.", en: "Since we have no time, let's hurry.", ja: "時間がないので急ごうという意味です。" },
        },
        {
          target: "風邪を ひいたので、今日は 休みます。",
          reading: "かぜを ひいたので、きょうは やすみます。",
          tr: { ru: "Так как я простудился, сегодня отдохну.", en: "Because I caught a cold, I'll take today off.", ja: "丁寧な欠席の理由です。" },
        },
      ],
      quiz: {
        prompt: "雨が 降っている＿＿、傘を 持っていきます。",
        options: ["を", "ので", "へ"],
        correctIdx: 1,
        hint: {
          ru: "Связка причины мягкого стиля после глагола — ので.",
          en: "Use ので to connect a reason smoothly to the result.",
          ja: "理由をつなぐ接続助詞「ので」を入れます。",
        },
      },
    },
    {
      id: "ja-nagara",
      level: "N3",
      pattern: "V1-stem + ながら V2",
      title: {
        ru: "Одновременные действия (делая X, делать Y)",
        en: "Simultaneous Actions (〜ながら)",
        ja: "並行動作を表す「〜ながら」",
      },
      explanation: {
        ru: "Соединяет два одновременных действия одного человека. Главное действие (V2) всегда стоит во второй части фразы, фоновое (V1) — с ながら.",
        en: "Describes doing two things at the same time: while doing V1, one does the main action V2.",
        ja: "同じ人が2つの動作を同時に行うときに使います。後ろの動詞がメインの動作です。",
      },
      examples: [
        {
          target: "音楽を 聴きながら 散歩します。",
          reading: "おんがくを ききながら さんぽします。",
          tr: { ru: "Гуляю, слушая музыку.", en: "I go for a walk while listening to music.", ja: "音楽をBGMに散歩します。" },
        },
        {
          target: "コーヒーを 飲みながら 本を 読みました。",
          reading: "コーヒーを のみながら ほんを よみました。",
          tr: { ru: "Читал книгу, попивая кофе.", en: "I read a book while drinking coffee.", ja: "コーヒーと共に読書をしました。" },
        },
      ],
      quiz: {
        prompt: "ラジオを 聞き＿＿ 料理を します。",
        options: ["ながら", "たり", "てから"],
        correctIdx: 0,
        hint: {
          ru: "Слушать и готовить одновременно — форма основы на ます + ながら.",
          en: "Use ながら directly after the ます-stem for simultaneous actions.",
          ja: "同時に行う動作には「ます形語幹＋ながら」を使います。",
        },
      },
    },
  ],
  en: [
    {
      id: "en-pres-perf",
      level: "A2/B1",
      pattern: "have / has + V3 (Past Participle)",
      title: {
        ru: "Present Perfect: опыт и результат сейчас",
        en: "Present Perfect vs Past Simple",
        ja: "現在完了形 (have / has + 過去分詞)",
      },
      explanation: {
        ru: "Present Perfect связывает прошлое действие с настоящим: жизненный опыт («когда-либо был»), свежие новости (just/already/yet) или результат, видимый прямо сейчас. Если указано точное время в прошлом (yesterday, in 2020) — используем Past Simple.",
        en: "Connects past actions to the present: life experience (ever/never), recent news (just/yet), or current results. If a finished past time is stated (yesterday, in 2020), use Past Simple.",
        ja: "過去の経験・完了・今の結果を表します。「yesterday / in 2020」など過去の特定時点があるときは過去形を使います。",
      },
      examples: [
        {
          target: "I have lived in London for three years.",
          reading: "/aɪ həv lɪvd ɪn ˈlʌndən fɔː θriː jɪəz/",
          tr: { ru: "Я живу в Лондоне уже три года (и всё ещё здесь).", en: "Duration continuing up to now.", ja: "3年間ずっとロンドンに住んでいます。" },
        },
        {
          target: "She has just finished her presentation.",
          reading: "/ʃiː həz dʒʌst ˈfɪnɪʃt/",
          tr: { ru: "Она только что закончила презентацию.", en: "Fresh completed action with present impact.", ja: "彼女はちょうどプレゼンを終えたところです。" },
        },
      ],
      quiz: {
        prompt: "Have you ever ___ to Edinburgh?",
        options: ["went", "been", "going"],
        correctIdx: 1,
        hint: {
          ru: "После have + ever нужен 3-й глагол (Past Participle) от be → been.",
          en: "Experience questions use have/has + past participle ('been').",
          ja: "経験を表すときは「have + ever + been」を使います。",
        },
      },
    },
    {
      id: "en-conditionals",
      level: "B1",
      pattern: "1st (will) vs 2nd Conditional (would + V)",
      title: {
        ru: "Условные предложения (реальные и воображаемые)",
        en: "1st vs 2nd Conditionals",
        ja: "条件文：第1条件文と仮定法過去",
      },
      explanation: {
        ru: "1st Conditional (If + Present, will + V) — реальная ситуация в будущем. 2nd Conditional (If + Past Simple, would + V) — гипотетическая или маловероятная ситуация сейчас/в будущем («если бы у меня было...»).",
        en: "1st Conditional (If + present, will + V) describes realistic future plans. 2nd Conditional (If + past, would + V) imagines unlikely or hypothetical scenarios.",
        ja: "現実的な未来には第1条件文（現在＋will）、今の事実と異なる仮定には第2条件文（過去＋would）を使います。",
      },
      examples: [
        {
          target: "If it rains tomorrow, we will stay inside.",
          tr: { ru: "Если завтра пойдёт дождь, мы останемся дома.", en: "Real future possibility.", ja: "明日雨が降ったら、中にいます。" },
        },
        {
          target: "If I spoke fluent English, I would move to Oxford.",
          tr: { ru: "Если бы я свободно говорил по-английски, я бы переехал в Оксфорд.", en: "Imaginary hypothetical situation.", ja: "もし英語が流暢なら、オックスフォードに引っ越すのに。" },
        },
      ],
      quiz: {
        prompt: "If I had more free time, I ___ learn Japanese too.",
        options: ["will", "would", "am"],
        correctIdx: 1,
        hint: {
          ru: "В условии стоит Past Simple (had), значит это 2nd Conditional → в результате используем would.",
          en: "'If I had...' signals 2nd Conditional, paired with 'would + verb'.",
          ja: "条件節が過去形「had」なので帰結節は「would」を使います。",
        },
      },
    },
    {
      id: "en-modals",
      level: "A2/B1",
      pattern: "must / should / might / used to",
      title: {
        ru: "Модальные глаголы оттенков смысла",
        en: "Modal Verbs of Advice & Deduction",
        ja: "助動詞（must / should / might）のニュアンス",
      },
      explanation: {
        ru: "must — уверенность или строгая обязанность; should — дружеский совет («стоит»); might / could — вероятность («возможно»); used to + V — привычка в прошлом, которой уже нет.",
        en: "'must' shows obligation/certainty; 'should' gives advice; 'might' expresses possibility; 'used to' expresses past habits now ended.",
        ja: "mustは義務や確信、shouldは助言、mightは可能性を表します。",
      },
      examples: [
        {
          target: "You should take an umbrella; it might rain later.",
          tr: { ru: "Тебе стоит взять зонт — позже может пойти дождь.", en: "Advice + mild possibility.", ja: "傘を持っていった方がいいよ、後で雨が降るかも。" },
        },
        {
          target: "We used to drink tea every evening at 5.",
          tr: { ru: "Раньше мы пили чай каждый вечер в 5.", en: "Discontinued past habit.", ja: "以前は毎晩5時に紅茶を飲んでいました。" },
        },
      ],
      quiz: {
        prompt: "That light is on — someone ___ be in the office.",
        options: ["must", "should to", "used"],
        correctIdx: 0,
        hint: {
          ru: "Для логической уверенности по факту («точно кто-то есть») используем must.",
          en: "Logical deduction based on evidence takes 'must'.",
          ja: "根拠に基づく強い推量には「must」を使います。",
        },
      },
    },
    {
      id: "en-passive",
      level: "B1",
      pattern: "be (is/was/has been) + V3 (by ...)",
      title: {
        ru: "Страдательный залог (Passive Voice)",
        en: "The Passive Voice",
        ja: "受動態 (be + 過去分詞)",
      },
      explanation: {
        ru: "Используем Passive, когда важнее сам объект и результат, а не тот, кто выполнил действие (в новостях, технологиях, научных статьях).",
        en: "Use the passive when the action or receiver matters more than who performed it — very common in tech, science, and news.",
        ja: "行為者よりも「何がされたか」を強調したいときに使います。",
      },
      examples: [
        {
          target: "This bridge was built in 1894.",
          tr: { ru: "Этот мост был построен в 1894 году.", en: "Past passive.", ja: "この橋は1894年に建てられました。" },
        },
        {
          target: "English is spoken in over 60 countries.",
          tr: { ru: "На английском говорят более чем в 60 странах.", en: "Present passive.", ja: "英語は60か国以上で話されています。" },
        },
      ],
      quiz: {
        prompt: "The new app update was ___ last night.",
        options: ["release", "released", "releasing"],
        correctIdx: 1,
        hint: {
          ru: "Пассив образуется через was + третья форма глагола (Past Participle) → released.",
          en: "Passive construction requires the past participle: 'was released'.",
          ja: "受動態は「be動詞＋過去分詞（released）」の形です。",
        },
      },
    },
    {
      id: "en-gerund-inf",
      level: "B1/B2",
      pattern: "enjoy + V-ing  vs  decide + to V",
      title: {
        ru: "Герундий (-ing) или Инфинитив (to + V)",
        en: "Gerund (-ing) vs Infinitive (to V)",
        ja: "動名詞 (-ing) と 不定詞 (to V)",
      },
      explanation: {
        ru: "Глаголы процесса и эмоций (enjoy, avoid, suggest, keep, mind) требуют -ing. Глаголы намерения и решений (decide, plan, hope, manage, promise) требуют to + глагол.",
        en: "Process/attitude verbs (enjoy, avoid, suggest, keep) take -ing; decision/goal verbs (decide, hope, manage, plan) take 'to + infinitive'.",
        ja: "楽しむ・避ける等の動詞は-ing、決める・望む等の動詞はto不定詞を取ります。",
      },
      examples: [
        {
          target: "I really enjoy reading in quiet cafés.",
          tr: { ru: "Мне очень нравится читать в тихих кафе.", en: "enjoy + V-ing.", ja: "静かなカフェで読書をするのが大好きです。" },
        },
        {
          target: "They decided to launch the project in autumn.",
          tr: { ru: "Они решили запустить проект осенью.", en: "decide + to V.", ja: "彼らは秋にプロジェクトを開始することに決めました。" },
        },
      ],
      quiz: {
        prompt: "Would you mind ___ the window?",
        options: ["open", "opening", "to open"],
        correctIdx: 1,
        hint: {
          ru: "После выражения 'Would you mind...' всегда идёт форма на -ing.",
          en: "'mind' always takes a gerund (-ing).",
          ja: "「Would you mind」の後ろは必ず動名詞（-ing）になります。",
        },
      },
    },
    {
      id: "en-phrasals",
      level: "B1/B2",
      pattern: "Verb + Particle (figure out / put off / look forward to)",
      title: {
        ru: "Фразовые глаголы и предлоги (look forward to + -ing)",
        en: "Key Phrasal Verbs in Action",
        ja: "実用句動詞のルール",
      },
      explanation: {
        ru: "В фразовых глаголах вроде look forward to («с нетерпением ждать») частица to — это предлог, поэтому после него ставится -ing или существительное!",
        en: "In multi-word verbs like 'look forward to' or 'get used to', 'to' is a preposition — follow it with a noun or -ing!",
        ja: "「look forward to」などの「to」は前置詞なので、後ろには名詞や動名詞(-ing)が続きます。",
      },
      examples: [
        {
          target: "I'm looking forward to visiting Brighton next week.",
          tr: { ru: "С нетерпением жду поездки в Брайтон на следующей неделе.", en: "to + V-ing after look forward to.", ja: "来週ブライトンを訪れるのを楽しみにしています。" },
        },
        {
          target: "Don't put off learning what sparks your curiosity.",
          tr: { ru: "Не откладывай изучение того, что зажигает интерес.", en: "put off = postpone.", ja: "興味をひくものの学習を後回しにしないで。" },
        },
      ],
      quiz: {
        prompt: "I look forward to ___ from you soon!",
        options: ["hear", "hearing", "heard"],
        correctIdx: 1,
        hint: {
          ru: "look forward to + глагол с окончанием -ing!",
          en: "'look forward to' requires the -ing form.",
          ja: "「look forward to」の後ろは動名詞「hearing」になります。",
        },
      },
    },
  ],
  de: [
    {
      id: "de-articles",
      level: "A1",
      pattern: "der (m) · die (f) · das (n) · die (Pl.)",
      title: {
        ru: "Артикли der / die / das и умные подсказки рода",
        en: "German Genders: der, die, das",
        ja: "ドイツ語の名詞の性（der / die / das）",
      },
      explanation: {
        ru: "В немецком все существительные пишутся с заглавной буквы и имеют род: мужской (der — суффиксы -er, -ling, дни недели), женский (die — почти все слова на -ung, -heit, -keit, -schaft, -tion, и часто на -e), средний (das — уменьшительные -chen, -lein, инфинитивы как существительные).",
        en: "Every German noun is capitalized and has a gender: der (m: days, -er, -ling), die (f: -ung, -heit, -keit, -schaft, -tion), das (n: -chen, -lein, nominalized infinitives). All plurals use die!",
        ja: "すべての名詞は大文字で始まり、男性(der)・女性(die)・中性(das)の性があります。複数形は常にdieです。",
      },
      examples: [
        {
          target: "die Freiheit · die Erfahrung · die Station",
          tr: { ru: "Суффиксы -heit, -ung, -tion почти всегда женского рода (die).", en: "-heit, -ung, -tion are always feminine (die).", ja: "-heit / -ung / -tion は女性名詞(die)になります。" },
        },
        {
          target: "das Mädchen · das Lesen · das Brötchen",
          tr: { ru: "Суффикс -chen и субстантивированные глаголы всегда среднего рода (das).", en: "-chen diminutives and verb-nouns take das.", ja: "-chen や動詞の名詞化は中性名詞(das)です。" },
        },
      ],
      quiz: {
        prompt: "___ Entscheidung (решение) war richtig.",
        options: ["Der", "Die", "Das"],
        correctIdx: 1,
        hint: {
          ru: "Существительные на -ung всегда женского рода → die Entscheidung!",
          en: "Nouns ending in -ung are always feminine (die).",
          ja: "「-ung」で終わる名詞は常に女性名詞「Die」です。",
        },
      },
    },
    {
      id: "de-v2",
      level: "A1",
      pattern: "[Тема / Время] + Verb (Позиция 2) + Подлежащее",
      title: {
        ru: "Железное правило глагола на 2-м месте (V2)",
        en: "The V2 Verb Rule (Verb Always 2nd)",
        ja: "動詞第2位の法則（V2ルール）",
      },
      explanation: {
        ru: "В повествовательном немецком предложении спрягаемый глагол ВСЕГДА стоит на 2-й смысловой позиции. Если на 1-е место вынести время или место («Heute...», «In Berlin...»), подлежащее сразу перемещается ПОСЛЕ глагола (на 3-е место).",
        en: "In main statements, the conjugated verb is ALWAYS in position 2. If you start with time or place ('Heute...', 'In Berlin...'), the subject moves right after the verb!",
        ja: "平叙文では定動詞が必ず2番目に置かれます。1番目に時間や場所が来ると、主語は動詞の直後に移ります。",
      },
      examples: [
        {
          target: "Heute lerne ich zwanzig neue Wörter.",
          tr: { ru: "Сегодня я учу двадцать новых слов (не ich lerne!).", en: "Time first → verb 'lerne' stays 2nd!", ja: "「Heute」が1番目なので動詞「lerne」が2番目に来ます。" },
        },
        {
          target: "Am Wochenende fahren wir nach München.",
          tr: { ru: "На выходных мы едем в Мюнхен.", en: "'Am Wochenende' = slot 1, 'fahren' = slot 2.", ja: "週末に私たちはミュンヘンへ行きます。" },
        },
      ],
      quiz: {
        prompt: "Morgen ___ wir zusammen Kaffee.",
        options: ["trinken", "wir trinken", "trinkt"],
        correctIdx: 0,
        hint: {
          ru: "Morgen (позиция 1) + спрягаемый глагол (позиция 2) → trinken!",
          en: "'Morgen' fills position 1, so the conjugated verb 'trinken' takes position 2.",
          ja: "1番目が「Morgen」なので2番目に動詞「trinken」が来ます。",
        },
      },
    },
    {
      id: "de-cases",
      level: "A2",
      pattern: "Nom: der/ein · Akk: den/einen · Dat: dem/einem",
      title: {
        ru: "Падежи Akkusativ (кого/что?) и Dativ (кому/где?)",
        en: "Accusative vs Dative Case Shifts",
        ja: "4格（対格）と3格（与格）の変化",
      },
      explanation: {
        ru: "В мужском роде в Akkusativ (прямое дополнение: «я вижу...», «у меня есть...») der → den, ein → einen. В Dativ (кому-то, либо предлоги mit, bei, nach, aus, von, zu) мужской и средний род становятся dem / einem, а женский die → der!",
        en: "Masculine changes to den/einen in Accusative (direct objects: haben, sehen, kaufen). In Dative (indirect recipient or mit/zu/nach/bei), der/das → dem and die → der.",
        ja: "直接目的語（4格）では男性名詞がden/einenに変化します。間接目的語やmit/zuなどの前置詞（3格）では男性・中性はdem、女性はderになります。",
      },
      examples: [
        {
          target: "Ich trinke einen schwarzen Kaffee.",
          tr: { ru: "Я пью чёрный кофе (муж. род, Akkusativ: einen).", en: "Direct object → Akkusativ 'einen'.", ja: "コーヒーを飲む（4格：einen）。" },
        },
        {
          target: "Ich fahre mit dem Zug nach Hamburg.",
          tr: { ru: "Я еду на поезде в Гамбург (mit всегда требует Dativ → dem).", en: "'mit' always takes Dative → dem.", ja: "「mit」は常に3格支配なので「dem」になります。" },
        },
      ],
      quiz: {
        prompt: "Ich spreche mit ___ Lehrerin. (die Lehrerin)",
        options: ["die", "der", "den"],
        correctIdx: 1,
        hint: {
          ru: "Предлог mit всегда требует Dativ. Женский род die в Dativ → der!",
          en: "'mit' demands Dative; feminine 'die' shifts to 'der'.",
          ja: "「mit」は3格支配なので女性名詞「die」は「der」に変化します。",
        },
      },
    },
    {
      id: "de-weil",
      level: "A2/B1",
      pattern: "..., weil / dass / obwohl + ... + Verb am Ende!",
      title: {
        ru: "Придаточные с weil, dass, obwohl (глагол в самый конец!)",
        en: "Subordinate Clauses: Verb at the End",
        ja: "従属接続詞（weil / dass / obwohl）の語順",
      },
      explanation: {
        ru: "После союзов weil (потому что), dass (что), wenn (если/когда), obwohl (хотя) спрягаемый глагол улетает в самый КОНЕЦ придаточного предложения, а перед союзом всегда ставится запятая!",
        en: "After subordinating conjunctions (weil, dass, wenn, obwohl), the conjugated verb kicks straight to the VERY END of the clause, preceded by a comma.",
        ja: "weil・dass・obwohlなどの後ろでは、定動詞が文の最後に移動します。カンマを忘れないようにしましょう。",
      },
      examples: [
        {
          target: "Ich lerne Deutsch, weil ich Berlin sehr mag.",
          tr: { ru: "Я учу немецкий, потому что мне очень нравится Берлин.", en: "Verb 'mag' moves to the end after 'weil'.", ja: "ベルリンがとても好きなのでドイツ語を学んでいます。" },
        },
        {
          target: "Ich glaube, dass diese Übung leicht ist.",
          tr: { ru: "Я думаю, что это упражнение лёгкое.", en: "Verb 'ist' goes to the very end.", ja: "この練習は簡単だと思います。" },
        },
      ],
      quiz: {
        prompt: "Sie bleibt zu Hause, weil sie müde ___.",
        options: ["ist", "wird sein", "ist gewesen hat"],
        correctIdx: 0,
        hint: {
          ru: "Спрягаемый глагол ist уходит в самый конец придаточного с weil.",
          en: "The conjugated verb 'ist' sits at the end.",
          ja: "weil節の末尾に動詞「ist」を置きます。",
        },
      },
    },
    {
      id: "de-perfekt",
      level: "A2",
      pattern: "haben / sein (Позиция 2) + ... + Partizip II (Конец)",
      title: {
        ru: "Разговорное прошедшее Perfekt (рамочная конструкция)",
        en: "Conversational Past: Perfekt (haben / sein)",
        ja: "現在完了形（Perfekt）と枠構造",
      },
      explanation: {
        ru: "Основное прошедшее время в живой речи! На 2-м месте стоит вспомогательный haben (большинство глаголов) или sein (движение A→B и смена состояния: gehen, fahren, fliegen, bleiben), а форма ge-... в самом конце предложения.",
        en: "Standard spoken past! Place conjugated haben (most verbs) or sein (movement A→B / state change: gehen, fahren, bleiben) in position 2, and the Partizip II at the very end.",
        ja: "会話の過去表現の基本です。habenまたは移動を表すseinを2番目に置き、過去分詞を文末に置きます。",
      },
      examples: [
        {
          target: "Wir haben gestern eine lange E-Mail geschrieben.",
          tr: { ru: "Вчера мы написали длинное письмо.", en: "haben + ... + geschrieben.", ja: "昨日長いメールを書きました。" },
        },
        {
          target: "Er ist schon mit dem Fahrrad angekommen.",
          tr: { ru: "Он уже приехал на велосипеде (движение → ist!).", en: "Movement takes 'ist' + 'angekommen'.", ja: "彼はすでに自転車で到着しました。" },
        },
      ],
      quiz: {
        prompt: "Am Samstag ___ wir ins Kino gegangen.",
        options: ["haben", "sind", "werden"],
        correctIdx: 1,
        hint: {
          ru: "gehen — глагол движения, поэтому в Perfekt используется sein → sind!",
          en: "'gehen' expresses movement, so it pairs with 'sein' (wir sind).",
          ja: "移動動詞「gehen」の完了助動詞は「sein（sind）」です。",
        },
      },
    },
    {
      id: "de-trennbare",
      level: "A2/B1",
      pattern: "Präfix-Verb: Ich stehe um 7 Uhr auf.",
      title: {
        ru: "Отделяемые приставки (auf-, an-, ein-, mit-, zurück-)",
        en: "Separable Prefix Verbs",
        ja: "分離動詞のルール",
      },
      explanation: {
        ru: "У глаголов с ударными приставками (aufstehen — вставать, einkaufen — закупаться, anfangen — начинать) в настоящем времени корень остаётся на 2-м месте, а приставка уходит в конец фразы!",
        en: "Stressed prefixes (auf-, an-, ein-, mit-, zurück-) split off in present statements: the stem takes position 2 and the prefix jumps to the end!",
        ja: "アクセントのある前綴り（auf, ein, an等）は平叙文で文末に切り離されます。",
      },
      examples: [
        {
          target: "Der Unterricht fängt pünktlich um neun Uhr an.",
          tr: { ru: "Урок начинается ровно в девять часов (anfangen).", en: "anfangen → fängt ... an.", ja: "授業は9時ちょうどに始まります。" },
        },
        {
          target: "Kaufst du heute frisches Brot ein?",
          tr: { ru: "Ты купишь сегодня свежего хлеба (einkaufen)?", en: "einkaufen → Kaufst ... ein?", ja: "今日新鮮なパンを買ってきますか？" },
        },
      ],
      quiz: {
        prompt: "Der Film fängt um 20 Uhr ___.",
        options: ["auf", "an", "ein"],
        correctIdx: 1,
        hint: {
          ru: "Начинаться = anfangen, отделяемая приставка — an!",
          en: "'to start' is 'anfangen' → separable prefix 'an'.",
          ja: "「始まる」は分離動詞「anfangen」なので文末に「an」が来ます。",
        },
      },
    },
  ],
};

export const READING_PASSAGES: Record<StudyLanguage, ReadingPassageItem[]> = {
  ja: [
    {
      id: "ja-read-shibuya",
      level: "N5",
      emoji: "☕",
      title: { ru: "Утро в кафе в Токио", en: "Morning at a Tokyo Café", ja: "東京の朝のカフェ" },
      subtitle: {
        ru: "Повседневная лексика, время и частицы",
        en: "Daily routine, time & core particles",
        ja: "日常会話・時間・基本助詞",
      },
      sentences: [
        {
          target: "毎朝、七時に起きます。",
          reading: "まいあさ、しちじに おきます。",
          tr: { ru: "Каждое утро я просыпаюсь в семь часов.", en: "Every morning I wake up at 7 o'clock.", ja: "毎朝7時の習慣です。" },
        },
        {
          target: "駅の前で 友だちと 会います。",
          reading: "えきの まえで ともだちと あいます。",
          tr: { ru: "Перед станцией я встречаюсь с другом.", en: "I meet my friend in front of the station.", ja: "駅の前での待ち合わせです。" },
        },
        {
          target: "いっしょに 静かな カフェで コーヒーを 飲みます。",
          reading: "いっしょに しずかな カフェで コーヒーを のみます。",
          tr: { ru: "Вместе пьём кофе в тихом кафе.", en: "Together we drink coffee at a quiet café.", ja: "落ち着いたカフェでコーヒーを楽しみます。" },
        },
        {
          target: "この カフェの パンは とても おいしいです。",
          reading: "この カフェの パンは とても おいしいです。",
          tr: { ru: "Выпечка в этом кафе очень вкусная.", en: "The bread at this café is very delicious.", ja: "パンの味が素晴らしいという感想です。" },
        },
      ],
      vocab: [
        { word: "毎朝", reading: "まいあさ", meaning: { ru: "каждое утро", en: "every morning", ja: "毎日朝" }, type: "KANJI" },
        { word: "駅", reading: "えき", meaning: { ru: "станция, вокзал", en: "train station", ja: "駅" }, type: "KANJI" },
        { word: "静か", reading: "しずか", meaning: { ru: "тихий, спокойный", en: "quiet, peaceful", ja: "静か" }, type: "KANJI" },
        { word: "いっしょに", reading: "いっしょに", meaning: { ru: "вместе", en: "together", ja: "一緒に" }, type: "KANA" },
      ],
      questions: [
        {
          question: { ru: "Во сколько рассказчик просыпается?", en: "What time does the speaker wake up?", ja: "何時に起きますか？" },
          options: { ru: ["В 6:00", "В 7:00", "В 8:00"], en: ["6:00", "7:00", "8:00"], ja: ["6時", "7時", "8時"] },
          correctIdx: 1,
        },
        {
          question: { ru: "Какое это кафе?", en: "What is the café like?", ja: "カフェはどんな所ですか？" },
          options: { ru: ["Шумное", "Тихое", "Закрытое"], en: ["Noisy", "Quiet", "Closed"], ja: ["にぎやか", "静か", "休み"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "ja-read-kyoto",
      level: "N4",
      emoji: "🌸",
      title: { ru: "Весна и сакура в Киото", en: "Spring Blossoms in Kyoto", ja: "京都の桜と春" },
      subtitle: {
        ru: "Культура ханами, прилагательные и впечатления",
        en: "Hanami culture, nature & impressions",
        ja: "お花見・季節の表現・感想",
      },
      sentences: [
        {
          target: "四月に なると、京都の 街は 桜の 花で いっぱいに なります。",
          reading: "しがつに なると、きょうとの まちは さくらの はなで いっぱいに なります。",
          tr: { ru: "Когда наступает апрель, улицы Киото наполняются цветами сакуры.", en: "When April arrives, Kyoto fills with cherry blossoms.", ja: "春の京都の美しい風景です。" },
        },
        {
          target: "日曜日に 家族と 公園へ お花見に 行きました。",
          reading: "にちようびに かぞくと こうえんへ おはなみに いきました。",
          tr: { ru: "В воскресенье я ходил с семьёй в парк на любование сакурой.", en: "On Sunday I went cherry-blossom viewing with my family.", ja: "家族で公園へ花見に出かけました。" },
        },
        {
          target: "風が 吹くと、ピンク色の 花びらが 雪のように 舞います。",
          reading: "かぜが ふくと、ピンクいろの はなびらが ゆきの ように まいます。",
          tr: { ru: "Когда дует ветер, розовые лепестки кружатся словно снег.", en: "When the wind blows, pink petals dance like snow.", ja: "桜吹雪の様子です。" },
        },
        {
          target: "お茶を 飲みながら、本当に きれいな 時間を 過ごしました。",
          reading: "おちゃを のみながら、ほんとうに きれいな じかんを すごしました。",
          tr: { ru: "Попивая чай, мы провели по-настоящему прекрасное время.", en: "Drinking tea, we spent a truly lovely afternoon.", ja: "穏やかな春の一日でした。" },
        },
      ],
      vocab: [
        { word: "桜", reading: "さくら", meaning: { ru: "сакура, вишня", en: "cherry blossom", ja: "桜" }, type: "KANJI" },
        { word: "花びら", reading: "はなびら", meaning: { ru: "лепесток цветка", en: "flower petal", ja: "花びら" }, type: "KANJI" },
        { word: "風", reading: "かぜ", meaning: { ru: "ветер", en: "wind", ja: "風" }, type: "KANJI" },
        { word: "過ごす", reading: "すごす", meaning: { ru: "проводить (время)", en: "to spend time", ja: "過ごす" }, type: "KANJI" },
      ],
      questions: [
        {
          question: { ru: "С кем ходили на ханами в воскресенье?", en: "Who did the author go hanami with?", ja: "誰とお花見に行きましたか？" },
          options: { ru: ["С коллегами", "С семьёй", "Один"], en: ["Coworkers", "Family", "Alone"], ja: ["会社の人", "家族", "ひとり"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "ja-read-konbini",
      level: "N4",
      emoji: "🏪",
      title: { ru: "Магия японского комбини", en: "The Magic of Konbini", ja: "日本のコンビニ" },
      subtitle: {
        ru: "Современная жизнь Японии и глаголы удобства",
        en: "Everyday Japanese culture & practical verbs",
        ja: "現代生活・便利な表現",
      },
      sentences: [
        {
          target: "日本には 二十四時間 あいている コンビニが たくさん あります。",
          reading: "にほんには にじゅうよじかん あいている コンビニが たくさん あります。",
          tr: { ru: "В Японии множество комбини, открытых 24 часа в сутки.", en: "Japan has many convenience stores open 24 hours.", ja: "24時間営業の便利なお店がたくさんあります。" },
        },
        {
          target: "あたたかい お弁当や おにぎりだけでなく、おいしい コーヒーも 買えます。",
          reading: "あたたかい おべんとうや おにぎりだけでなく、おいしい コーヒーも かえます。",
          tr: { ru: "Там можно купить не только тёплые бэнто и онигири, но и вкусный кофе.", en: "You can buy not just warm bento and onigiri, but delicious coffee too.", ja: "食べ物だけでなくコーヒーも充実しています。" },
        },
        {
          target: "荷物も 送れるし、とても 便利です。",
          reading: "にもつも おくれるし、とても べんりです。",
          tr: { ru: "Даже посылку можно отправить — это невероятно удобно!", en: "You can even ship parcels — it is super convenient!", ja: "配送サービスも利用できます。" },
        },
      ],
      vocab: [
        { word: "便利", reading: "べんり", meaning: { ru: "удобный", en: "convenient", ja: "便利" }, type: "KANJI" },
        { word: "荷物", reading: "にもつ", meaning: { ru: "багаж, посылка", en: "luggage / parcel", ja: "荷物" }, type: "KANJI" },
        { word: "お弁当", reading: "おべんとう", meaning: { ru: "ланч-бокс бэнто", en: "bento lunch box", ja: "お弁当" }, type: "KANJI" },
      ],
      questions: [
        {
          question: { ru: "Что можно сделать в комбини кроме покупки еды?", en: "What besides buying food can you do at a konbini?", ja: "食べ物を買う以外に何ができますか？" },
          options: { ru: ["Отправить посылку", "Помыть машину", "Арендовать велосипед"], en: ["Ship a parcel", "Wash a car", "Rent a bike"], ja: ["荷物を送る", "洗車する", "自転車を借りる"] },
          correctIdx: 0,
        },
      ],
    },
  ],
  en: [
    {
      id: "en-read-notting-hill",
      level: "A2",
      emoji: "📚",
      title: { ru: "Книжная лавка в Ноттинг-Хилле", en: "A Quiet Bookshop in Notting Hill", ja: "ノッティング・ヒルの小さな書店" },
      subtitle: {
        ru: "Британская атмосфера, лексика города",
        en: "London atmosphere & everyday storytelling",
        ja: "ロンドンの日常と描写表現",
      },
      sentences: [
        {
          target: "Every Saturday morning, Oliver walks along Portobello Road before the crowds arrive.",
          tr: { ru: "Каждое субботнее утро Оливер прогуливается по Портобелло-роуд, пока не собрались толпы.", en: "Opening routine in Notting Hill.", ja: "毎週土曜の朝、人混みが来る前にオリバーはポートベロー通りを歩きます。" },
        },
        {
          target: "At the corner stands a tiny secondhand bookshop painted deep Oxford blue.",
          tr: { ru: "На углу стоит крошечный букинистический магазинчик, выкрашенный в глубокий оксфордский синий.", en: "Describing a landmark.", ja: "角には濃いオックスフォードブルーに塗られた小さな古書店があります。" },
        },
        {
          target: "Inside, the air smells of roasted coffee and crisp paper pages.",
          tr: { ru: "Внутри воздух пахнет свежеобжаренным кофе и хрустящими книжными страницами.", en: "Sensory description.", ja: "店内には焙煎コーヒーと紙のページの心地よい香りが広がっています。" },
        },
        {
          target: "He usually picks up one classic novel and reads the first chapter beside the rain-streaked window.",
          tr: { ru: "Обычно он берёт один классический роман и читает первую главу у окна, по которому стекают капли дождя.", en: "Present Simple habit.", ja: "いつも名作小説を一冊選び、雨粒の伝う窓際で第1章を読みます。" },
        },
      ],
      vocab: [
        { word: "to stand out", reading: "/stænd aʊt/", meaning: { ru: "выделяться", en: "to be clearly noticeable", ja: "目立つ" }, type: "GRAMMAR" },
        { word: "Secondhand", reading: "/ˌsekəndˈhænd/", meaning: { ru: "подержанный, букинистический", en: "pre-owned / vintage", ja: "中古の・古書の" }, type: "VOCABULARY" },
        { word: "Crisp", reading: "/krɪsp/", meaning: { ru: "свежий, хрустящий", en: "fresh, clean, sharp", ja: "パリッとした・爽やかな" }, type: "VOCABULARY" },
        { word: "Crowd", reading: "/kraʊd/", meaning: { ru: "толпа, скопление людей", en: "large group of people", ja: "人混み・群衆" }, type: "VOCABULARY" },
      ],
      questions: [
        {
          question: { ru: "Какого цвета книжный магазин?", en: "What color is the bookshop painted?", ja: "書店は何色に塗られていますか？" },
          options: { ru: ["Ярко-зелёного", "Оксфордского синего", "Жёлтого"], en: ["Bright green", "Oxford blue", "Bright yellow"], ja: ["緑", "オックスフォードブルー", "黄色"] },
          correctIdx: 1,
        },
        {
          question: { ru: "Когда Оливер приходит на прогулку?", en: "When does Oliver take his walk?", ja: "オリバーはいつ散歩しますか？" },
          options: { ru: ["По воскресеньям вечером", "В субботу утром до толпы", "В пятницу ночью"], en: ["Sunday evening", "Saturday morning before crowds", "Friday night"], ja: ["日曜の夜", "土曜の朝・人混みの前", "金曜の夜"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "en-read-museum",
      level: "B1",
      emoji: "🏛️",
      title: { ru: "Послеполуденный час в Британском музее", en: "An Afternoon at the British Museum", ja: "大英博物館の午後" },
      subtitle: {
        ru: "Present Perfect в контексте и культурный словарь",
        en: "Present Perfect storytelling & museum vocabulary",
        ja: "現在完了形と文化ボキャブラリー",
      },
      sentences: [
        {
          target: "Although Mia has visited London twice before, she had never explored the Great Court until today.",
          tr: { ru: "Хотя Миа уже бывала в Лондоне дважды, до сегодняшнего дня она ни разу не заходила в Большой двор музея.", en: "Present & Past Perfect contrast.", ja: "ミアは以前2回ロンドンを訪れたことがありましたが、グレート・コートを探検したのは今日が初めてでした。" },
        },
        {
          target: "Sunlight filtered effortlessly through the glass roof, casting geometric shadows across the stone floor.",
          tr: { ru: "Солнечный свет легко струился сквозь стеклянную крышу, отбрасывая геометрические тени на каменный пол.", en: "Descriptive narrative.", ja: "ガラス屋根から日光が差し込み、石の床に幾何学的な影を落としていました。" },
        },
        {
          target: "She spent over an hour sketching ancient artifacts in her notebook and listening to an audio guide.",
          tr: { ru: "Она провела больше часа, зарисовывая древние артефакты в блокнот и слушая аудиогид.", en: "Gerund verbs after spend time.", ja: "1時間以上かけて古代の遺物をスケッチし、音声ガイドを聴きました。" },
        },
      ],
      vocab: [
        { word: "Artifact", reading: "/ˈɑːtɪfækt/", meaning: { ru: "артефакт, памятник старины", en: "historical handmade object", ja: "人工遺物・歴史的品" }, type: "VOCABULARY" },
        { word: "Effortlessly", reading: "/ˈefətləsli/", meaning: { ru: "без усилий, легко", en: "smoothly without difficulty", ja: "楽々と・自然に" }, type: "VOCABULARY" },
        { word: "To sketch", reading: "/sketʃ/", meaning: { ru: "делать набросок", en: "to draw roughly quickly", ja: "スケッチする" }, type: "VOCABULARY" },
      ],
      questions: [
        {
          question: { ru: "Сколько раз Миа бывала в Лондоне раньше?", en: "How many times had Mia visited London before?", ja: "ミアは以前ロンドンに何回行ったことがありますか？" },
          options: { ru: ["Ни разу", "Дважды", "Пять раз"], en: ["Never", "Twice", "Five times"], ja: ["0回", "2回", "5回"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "en-read-edinburgh",
      level: "B2",
      emoji: "💻",
      title: { ru: "Удалённая работа из Эдинбурга", en: "Deep Focus in Edinburgh", ja: "エディンバラでの集中時間" },
      subtitle: {
        ru: "Современная лексика продуктивности и идиомы",
        en: "Modern focus vocabulary & nuanced expressions",
        ja: "仕事・集中・実践イディオム",
      },
      sentences: [
        {
          target: "Working from a historic stone café overlooking Edinburgh Castle gave Daniel an unexpected creative spark.",
          tr: { ru: "Работа из старинного каменного кафе с видом на Эдинбургский замок подарила Дэниелу неожиданный творческий импульс.", en: "Descriptive gerund opening.", ja: "エディンバラ城を見渡す歴史ある石造りのカフェでの作業は、ダニエルに思いがけない創造のひらめきを与えました。" },
        },
        {
          target: "Whenever complex tasks felt overwhelming, he broke them down into tiny twenty-minute sprints.",
          tr: { ru: "Каждый раз, когда сложные задачи казались неподъёмными, он разбивал их на короткие 20-минутные спринты.", en: "Phrasal verb: break down.", ja: "複雑な課題に圧倒されそうなときは、20分間の小さなスプリントに分割しました。" },
        },
        {
          target: "By the time evening mist settled over the rooftops, the whole prototype had finally come together.",
          tr: { ru: "К тому времени, как вечерний туман опустился на крыши, весь прототип наконец сложился воедино.", en: "Idiomatic phrasing: come together.", ja: "屋根に夕霧が立ち込める頃には、プロトタイプ全体がついに完成しました。" },
        },
      ],
      vocab: [
        { word: "Overwhelming", reading: "/ˌəʊvəˈwelmɪŋ/", meaning: { ru: "ошеломляющий, непосильный", en: "very intense or hard to manage", ja: "圧倒的な" }, type: "VOCABULARY" },
        { word: "to break down", reading: "/breɪk daʊn/", meaning: { ru: "разбивать на части / анализировать", en: "to split into smaller pieces", ja: "分解する・整理する" }, type: "GRAMMAR" },
        { word: "Creative spark", reading: "/kriˈeɪtɪv spɑːk/", meaning: { ru: "творческий импульс", en: "flash of inspiration", ja: "創造のひらめき" }, type: "VOCABULARY" },
      ],
      questions: [
        {
          question: { ru: "Как Дэниел справлялся со сложными задачами?", en: "How did Daniel tackle overwhelming tasks?", ja: "難しい課題にどうやって取り組みましたか？" },
          options: { ru: ["Откладывал на завтра", "Разбивал на 20-минутные спринты", "Просил помощи у коллег"], en: ["Delayed them", "Split them into 20-min sprints", "Asked his manager"], ja: ["翌日に回した", "20分刻みに分けた", "同僚に任せた"] },
          correctIdx: 1,
        },
      ],
    },
  ],
  de: [
    {
      id: "de-read-berlin",
      level: "A1/A2",
      emoji: "🥐",
      title: { ru: "Завтрак в Берлине-Митте", en: "Breakfast in Berlin-Mitte", ja: "ベルリン・ミッテの朝食" },
      subtitle: {
        ru: "Еда, артикли der/die/das и порядок слов V2",
        en: "Food vocabulary, articles & V2 word order",
        ja: "食事ボキャブラリーとV2語順",
      },
      sentences: [
        {
          target: "Am Sonntagmorgen geht Lukas früh in eine kleine Bäckerei in Berlin-Mitte.",
          tr: { ru: "В воскресное утро Лукас рано заходит в небольшую пекарню в районе Берлин-Митте.", en: "V2 sentence starting with time.", ja: "日曜の朝、ルーカスはベルリン中心部の小さなパン屋に早めに行きます。" },
        },
        {
          target: "Auf dem Holztisch duften frische Brötchen und heißer Filterkaffee.",
          tr: { ru: "На деревянном столе ароматно пахнут свежие булочки и горячий фильтр-кофе.", en: "Atmospheric description.", ja: "木のテーブルの上には焼きたてのパンと熱いコーヒーの香りが漂います。" },
        },
        {
          target: "Er bestellt zwei Croissants, ein Glas Orangensaft und bezahlt direkt mit Karte.",
          tr: { ru: "Он заказывает два круассана, стакан апельсинового сока и сразу расплачивается картой.", en: "Practical ordering phrases.", ja: "クロワッサン2つとオレンジジュースを注文し、カードで支払います。" },
        },
        {
          target: "Danach liest er die Zeitung in der warmen Morgensonne.",
          tr: { ru: "После этого он читает газету на тёплом утреннем солнце.", en: "Strong verb 'lesen → liest'.", ja: "その後、朝の暖かい日差しの中で新聞を読みます。" },
        },
      ],
      vocab: [
        { word: "die Bäckerei", reading: "die Bäckereien", meaning: { ru: "пекарня, булочная", en: "bakery", ja: "パン屋" }, type: "VOCABULARY" },
        { word: "das Brötchen", reading: "die Brötchen", meaning: { ru: "булочка", en: "bread roll", ja: "小さな丸パン" }, type: "VOCABULARY" },
        { word: "die Zeitung", reading: "die Zeitungen", meaning: { ru: "газета", en: "newspaper", ja: "新聞" }, type: "VOCABULARY" },
        { word: "duften", meaning: { ru: "благоухать, ароматно пахнуть", en: "to smell fragrant", ja: "香る" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Что Лукас заказал в пекарне?", en: "What did Lukas order?", ja: "ルーカスは何を注文しましたか？" },
          options: { ru: ["Торт и молоко", "Два круассана и апельсиновый сок", "Только чай"], en: ["Cake and milk", "Two croissants and orange juice", "Just tea"], ja: ["ケーキと牛乳", "クロワッサンとジュース", "紅茶だけ"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "de-read-munich",
      level: "A2/B1",
      emoji: "🚆",
      title: { ru: "На метро через Мюнхен", en: "Crossing Munich by U-Bahn", ja: "地下鉄で巡るミュンヘン" },
      subtitle: {
        ru: "Городской транспорт, предлоги с Dativ и Perfekt",
        en: "Transit verbs, Dative prepositions & Perfekt",
        ja: "交通表現・3格前置詞・現在完了",
      },
      sentences: [
        {
          target: "Gestern bin ich zum ersten Mal mit der U-Bahn zum Englischen Garten gefahren.",
          tr: { ru: "Вчера я впервые поехал на метро к Английскому саду.", en: "Perfekt with 'sein' + movement.", ja: "昨日初めて地下鉄でイングリッシュ・ガーデンへ行きました。" },
        },
        {
          target: "An der Haltestelle Marienplatz musste ich schnell in die Linie U6 umsteigen.",
          tr: { ru: "На станции Мариенплац мне нужно было быстро пересесть на линию U6.", en: "Modal verb past + umsteigen.", ja: "マリエンプラッツ駅でU6線に素早く乗り換えました。" },
        },
        {
          target: "Obwohl viele Touristen unterwegs waren, habe ich sofort einen freien Platz gefunden.",
          tr: { ru: "Хотя вокруг было много туристов, я сразу нашёл свободное место.", en: "'obwohl' pushes 'waren' to the end.", ja: "観光客が多かったにもかかわらず、すぐ空席が見つかりました。" },
        },
      ],
      vocab: [
        { word: "die Haltestelle", reading: "die Haltestellen", meaning: { ru: "остановка / станция", en: "stop / station", ja: "停留所・駅" }, type: "VOCABULARY" },
        { word: "umsteigen", meaning: { ru: "пересаживаться (на транспорте)", en: "to transfer / change lines", ja: "乗り換える" }, type: "GRAMMAR" },
        { word: "unterwegs sein", meaning: { ru: "быть в пути", en: "to be out and about / on the way", ja: "移動中・外出中" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "На какую линию пересели на Мариенплац?", en: "Which line did the narrator transfer to?", ja: "マリエンプラッツでどの路線に乗り換えましたか？" },
          options: { ru: ["U2", "U6", "S8"], en: ["U2", "U6", "S8"], ja: ["U2", "U6", "S8"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "de-read-schwarzwald",
      level: "B1",
      emoji: "🌲",
      title: { ru: "Прогулка по Шварцвальду", en: "Hiking in the Black Forest", ja: "黒い森（シュヴァルツヴァルト）の散策" },
      subtitle: {
        ru: "Природа Германии, придаточные weil и эмоции",
        en: "Nature storytelling & subordinate clauses",
        ja: "自然描写と接続詞の文章",
      },
      sentences: [
        {
          target: "Viele Menschen besuchen den Schwarzwald, weil die Luft dort besonders klar und ruhig ist.",
          tr: { ru: "Многие люди приезжают в Шварцвальд, потому что воздух там особенно чистый и спокойный.", en: "'weil' pushes 'ist' to the end.", ja: "空気が澄んで静かなため、多くの人が黒い森を訪れます。" },
        },
        {
          target: "Zwischen hohen Tannen schlängelt sich ein schmaler Wanderweg bis zu einem kleinen See.",
          tr: { ru: "Среди высоких елей вьётся узкая туристическая тропа прямо к маленькому озеру.", en: "Reflexive verb + inverted V2.", ja: "高いモミの木の合間を細いハイキング道が小さな湖まで続いています。" },
        },
        {
          target: "Am Abend schmeckt ein Stück traditionelle Kirschtorte nach so einer Wanderung doppelt so gut.",
          tr: { ru: "Вечером после такого похода кусочек традиционного вишнёвого торта кажется вдвое вкуснее.", en: "Cultural German tradition.", ja: "ハイキングの後の伝統的なさくらんぼケーキは格別です。" },
        },
      ],
      vocab: [
        { word: "der Wanderweg", reading: "die Wanderwege", meaning: { ru: "пешая туристическая тропа", en: "hiking trail", ja: "ハイキングコース" }, type: "VOCABULARY" },
        { word: "der See", reading: "die Seen", meaning: { ru: "озеро (der See!)", en: "lake", ja: "湖" }, type: "VOCABULARY" },
        { word: "ruhig", meaning: { ru: "спокойный, тихий", en: "calm, quiet", ja: "静かな・落ち着いた" }, type: "VOCABULARY" },
      ],
      questions: [
        {
          question: { ru: "Куда ведёт узкая тропа?", en: "Where does the narrow trail lead?", ja: "細い道はどこへ続いていますか？" },
          options: { ru: ["К аэропорту", "К маленькому озеру", "К морю"], en: ["To the airport", "To a small lake", "To the sea"], ja: ["空港", "小さな湖", "海"] },
          correctIdx: 1,
        },
      ],
    },
  ],
};

export const LISTENING_DIALOGUES: Record<StudyLanguage, ListeningDialogue[]> = {
  ja: [
    {
      id: "ja-dlg-cafe",
      level: "N5",
      emoji: "🍵",
      title: { ru: "В токийской кофейне", en: "Ordering at a Tokyo Café", ja: "東京のカフェで注文する" },
      scene: { ru: "Учимся вежливо делать заказ в кафе", en: "Polite ordering basics", ja: "丁寧な注文フレーズ" },
      lines: [
        {
          speaker: "店員",
          text: "いらっしゃいませ！ ご注文は お決まりですか？",
          reading: "いらっしゃいませ！ ごちゅうもんは おきまりですか？",
          tr: { ru: "Добро пожаловать! Вы уже выбрали заказ?", en: "Welcome! Are you ready to order?", ja: "店員の丁寧な案内です。" },
        },
        {
          speaker: "客",
          text: "はい、抹茶ラテを 一つ お願いします。",
          reading: "はい、まっちゃラテを ひとつ おねがいします。",
          tr: { ru: "Да, один матча-латте, пожалуйста.", en: "Yes, one matcha latte, please.", ja: "飲み物を1つ注文しています。" },
        },
        {
          speaker: "店員",
          text: "ホットと アイス、どちらに なさいますか？",
          reading: "ホットと アイス、どちらに なさいますか？",
          tr: { ru: "Горячий или холодный?", en: "Would you like hot or iced?", ja: "温度を選んでもらいます。" },
        },
        {
          speaker: "客",
          text: "アイスで お願いします。あと、ここで 飲みます。",
          reading: "アイスで おねがいします。あと、ここで のみます。",
          tr: { ru: "Холодный, пожалуйста. И я буду пить здесь.", en: "Iced please. Also, for here.", ja: "店内で飲むことを伝えています。" },
        },
      ],
    },
    {
      id: "ja-dlg-station",
      level: "N4",
      emoji: "🚉",
      title: { ru: "Как пройти к выходу на Синдзюку", en: "Directions at Shinjuku Station", ja: "新宿駅で道を聞く" },
      scene: { ru: "Ориентирование и вежливые вопросы", en: "Asking for directions politely", ja: "駅構内での質問" },
      lines: [
        {
          speaker: "旅行者",
          text: "すみません、東口は どちらですか？",
          reading: "すみません、ひがしぐちは どちらですか？",
          tr: { ru: "Извините, где восточный выход?", en: "Excuse me, which way is the East Exit?", ja: "出口の場所を尋ねます。" },
        },
        {
          speaker: "駅員",
          text: "この 階段を 上って、まっすぐ 行ってください。",
          reading: "この かいだんを のぼって、まっすぐ いってください。",
          tr: { ru: "Поднимитесь по этой лестнице и идите прямо.", en: "Go up these stairs and walk straight ahead.", ja: "行き方の案内です。" },
        },
        {
          speaker: "旅行者",
          text: "わかりました！ ありがとう ございます。",
          reading: "わかりました！ ありがとう ございます。",
          tr: { ru: "Понятно! Большое спасибо!", en: "Understood! Thank you very much.", ja: "お礼を伝えます。" },
        },
      ],
    },
  ],
  en: [
    {
      id: "en-dlg-soho",
      level: "A2",
      emoji: "☕",
      title: { ru: "Заказ кофе в лондонском Сохо", en: "Ordering Coffee in Soho", ja: "ソーホーのカフェでの会話" },
      scene: { ru: "Естественный британский диалог у бариста", en: "Natural British café small talk", ja: "自然な英国カフェ会話" },
      lines: [
        {
          speaker: "Barista",
          text: "Morning! What can I get for you today?",
          tr: { ru: "Доброе утро! Что вам приготовить сегодня?", en: "Friendly morning greeting.", ja: "おはようございます！今日は何にしますか？" },
        },
        {
          speaker: "You",
          text: "Hi there! Could I have an oat flat white, please?",
          tr: { ru: "Привет! Можно флэт-уайт на овсяном молоке, пожалуйста?", en: "Polite British café request.", ja: "オーツミルクのフラットホワイトを一つお願いします。" },
        },
        {
          speaker: "Barista",
          text: "Certainly! Drinking in or taking away?",
          tr: { ru: "Конечно! Здесь будете пить или с собой?", en: "Standard UK phrasing for 'for here or to go'.", ja: "店内ですか、お持ち帰りですか？" },
        },
        {
          speaker: "You",
          text: "To take away, thanks. Cheers!",
          tr: { ru: "С собой, спасибо. Всего доброго!", en: "'Cheers!' = casual British thank you.", ja: "持ち帰りでお願いします。ありがとう！" },
        },
      ],
    },
    {
      id: "en-dlg-meetup",
      level: "B1",
      emoji: "💡",
      title: { ru: "Знакомство на митапе разработчиков", en: "Tech Meetup Networking", ja: "テックミートアップでの会話" },
      scene: { ru: "Смол-ток и обсуждение проектов", en: "Professional networking & Present Perfect", ja: "自己紹介と近況の会話" },
      lines: [
        {
          speaker: "Claire",
          text: "Have you been to many events here in London lately?",
          tr: { ru: "Ты часто бывал на таких встречах в Лондоне в последнее время?", en: "Natural icebreaker question.", ja: "最近ロンドンのイベントにはよく参加していますか？" },
        },
        {
          speaker: "Alex",
          text: "Actually, this is only my second time. I moved here three months ago.",
          tr: { ru: "Вообще-то я тут всего второй раз — переехал три месяца назад.", en: "Contrast Present & Past Simple.", ja: "実はまだ2回目なんです。3か月前に引っ越してきました。" },
        },
        {
          speaker: "Claire",
          text: "Oh brilliant! Welcome to the city — I hope you're settling in well.",
          tr: { ru: "О, здорово! Добро пожаловать в город — надеюсь, осваиваешься отлично!", en: "Warm British reaction ('brilliant!').", ja: "素敵ですね！街へようこそ、うまく馴染めますように。" },
        },
      ],
    },
  ],
  de: [
    {
      id: "de-dlg-bakery",
      level: "A1/A2",
      emoji: "🥨",
      title: { ru: "Утром в берлинской булочной", en: "At a Berlin Bakery", ja: "ベルリンのパン屋さんで" },
      scene: { ru: "Покупки, вежливые просьбы и формы на -en", en: "Polite requests with möchten / hätte gern", ja: "丁寧な注文表現" },
      lines: [
        {
          speaker: "Verkäuferin",
          text: "Guten Morgen! Was darf es heute sein?",
          tr: { ru: "Доброе утро! Что бы вы хотели сегодня?", en: "Classic German shop greeting.", ja: "おはようございます！今日は何になさいますか？" },
        },
        {
          speaker: "Kunde",
          text: "Guten Morgen! Ich hätte gern zwei Laugenbrezeln und ein Vollkornbrot.",
          tr: { ru: "Доброе утро! Я бы взял два кренделя и один цельнозерновой хлеб.", en: "'Ich hätte gern...' = I would like.", ja: "プレッツェル2つと全粒粉パンを1つお願いします。" },
        },
        {
          speaker: "Verkäuferin",
          text: "Sehr gern. Sonst noch ein Wunsch?",
          tr: { ru: "С удовольствием. Что-нибудь ещё?", en: "Polite follow-up.", ja: "かしこまりました。他にご注文は？" },
        },
        {
          speaker: "Kunde",
          text: "Nein danke, das ist alles. Ich zahle bar.",
          tr: { ru: "Нет спасибо, это всё. Оплачу наличными.", en: "Closing purchase.", ja: "いいえ、以上です。現金で払います。" },
        },
      ],
    },
    {
      id: "de-dlg-train",
      level: "A2/B1",
      emoji: "🚅",
      title: { ru: "Билет на вокзале Hauptbahnhof", en: "At Berlin Hauptbahnhof", ja: "ベルリン中央駅で切符を買う" },
      scene: { ru: "Поездка на ICE, время и платформы", en: "Train travel & platforms (Gleis)", ja: "電車の時間とホームを尋ねる" },
      lines: [
        {
          speaker: "Reisender",
          text: "Entschuldigung, wann fährt der nächste Zug nach Hamburg ab?",
          tr: { ru: "Простите, когда отправляется следующий поезд до Гамбурга?", en: "Separable verb 'abfahren'.", ja: "すみません、次のハンブルク行きは何時発ですか？" },
        },
        {
          speaker: "Mitarbeiter",
          text: "Der ICE fährt in zehn Minuten von Gleis acht ab.",
          tr: { ru: "Скоростной поезд ICE отправляется через десять минут с 8-й платформы.", en: "'Gleis acht' = Platform 8.", ja: "ICEは10分後に8番ホームから出発します。" },
        },
        {
          speaker: "Reisender",
          text: "Vielen Dank! Muss ich unterwegs umsteigen?",
          tr: { ru: "Большое спасибо! Мне нужно делать пересадку в пути?", en: "Asking about connections.", ja: "ありがとうございます！途中で乗り換えは必要ですか？" },
        },
        {
          speaker: "Mitarbeiter",
          text: "Nein, das ist eine direkte Verbindung. Gute Fahrt!",
          tr: { ru: "Нет, это прямой маршрут. Счастливого пути!", en: "'Gute Fahrt!' = Have a nice trip.", ja: "いいえ、直通です。よい旅を！" },
        },
      ],
    },
  ],
};

export const LISTENING_PROMPTS: Record<StudyLanguage, ListeningPromptItem[]> = {
  ja: [
    { text: "おはよう ございます", reading: "Ohayō gozaimasu", meaning: { ru: "Доброе утро (вежливо)", en: "Good morning (polite)", ja: "丁寧な朝の挨拶" } },
    { text: "ちょっと 待ってください", reading: "Chotto matte kudasai", meaning: { ru: "Подождите минутку, пожалуйста", en: "Wait a moment, please", ja: "少し待ってもらう表現" } },
    { text: "これは いくらですか", reading: "Kore wa ikura desu ka", meaning: { ru: "Сколько это стоит?", en: "How much is this?", ja: "値段を聞く表現" } },
    { text: "駅は どこですか", reading: "Eki wa doko desu ka", meaning: { ru: "Где находится станция?", en: "Where is the station?", ja: "場所を尋ねる表現" } },
    { text: "日本語が 少し わかります", reading: "Nihongo ga sukoshi wakarimasu", meaning: { ru: "Я немного понимаю по-японски", en: "I understand a little Japanese", ja: "言語能力を伝える表現" } },
    { text: "お会計を お願いします", reading: "Okaikei o onegaishimasu", meaning: { ru: "Счёт, пожалуйста", en: "Check / bill, please", ja: "支払いを頼む表現" } },
    { text: "明日は 休みの 日です", reading: "Ashita wa yasumi no hi desu", meaning: { ru: "Завтра — выходной день", en: "Tomorrow is a day off", ja: "休日を伝える文" } },
    { text: "とても おいしいですね", reading: "Totemo oishii desu ne", meaning: { ru: "Как же это вкусно!", en: "It's so delicious, isn't it!", ja: "味への感想" } },
  ],
  en: [
    { text: "Could you speak a bit more slowly, please?", meaning: { ru: "Не могли бы вы говорить чуть медленнее?", en: "Request to slow down speech", ja: "もう少しゆっくり話していただけますか？" } },
    { text: "I'm really looking forward to the weekend.", meaning: { ru: "Я с нетерпением жду выходных.", en: "Excited for the weekend", ja: "週末をとても楽しみにしています。" } },
    { text: "It took me a while to figure it out.", meaning: { ru: "Мне потребовалось время, чтобы разобраться.", en: "Took time to solve/understand", ja: "理解するのに少し時間がかかりました。" } },
    { text: "By the way, have we met somewhere before?", meaning: { ru: "Кстати, мы раньше нигде не встречались?", en: "Checking prior acquaintance", ja: "ところで、以前どこかでお会いしましたか？" } },
    { text: "Let's call it a day and continue tomorrow.", meaning: { ru: "Давай закончим на сегодня и продолжим завтра.", en: "Finish work for today", ja: "今日はここまでにして明日続けましょう。" } },
    { text: "That makes complete sense now!", meaning: { ru: "Теперь всё стало абсолютно понятно!", en: "Totally clear now", ja: "これで完全に腑に落ちました！" } },
    { text: "Could you recommend a quiet place for coffee?", meaning: { ru: "Можете порекомендовать тихое место для кофе?", en: "Asking for café tips", ja: "落ち着いたカフェをおすすめしてもらえますか？" } },
    { text: "Practice consistently and progress will follow.", meaning: { ru: "Занимайся регулярно, и прогресс обязательно придёт.", en: "Consistency builds mastery", ja: "継続して練習すれば、上達は必ずついてきます。" } },
  ],
  de: [
    { text: "Ich hätte gern einen Kaffee mit Milch.", meaning: { ru: "Мне, пожалуйста, кофе с молоком.", en: "I would like a coffee with milk.", ja: "ミルク入りのコーヒーをお願いします。" } },
    { text: "Entschuldigung, wie komme ich zum Zentrum?", meaning: { ru: "Извините, как добраться до центра?", en: "Excuse me, how do I get to the center?", ja: "すみません、中心街へはどう行けばいいですか？" } },
    { text: "Das Wetter ist heute wunderbar sonnig.", meaning: { ru: "Сегодня чудесная солнечная погода.", en: "The weather is wonderfully sunny today.", ja: "今日は素晴らしく晴れた天気です。" } },
    { text: "Ich lerne jeden Tag ein bisschen Deutsch.", meaning: { ru: "Я учу понемногу немецкий каждый день.", en: "I study a little German every day.", ja: "毎日少しずつドイツ語を勉強しています。" } },
    { text: "Könnten Sie das bitte wiederholen?", meaning: { ru: "Не могли бы вы это повторить, пожалуйста?", en: "Could you repeat that, please?", ja: "もう一度おっしゃっていただけますか？" } },
    { text: "Am Wochenende treffen wir unsere Freunde.", meaning: { ru: "На выходных мы встречаемся с нашими друзьями.", en: "We're meeting our friends on the weekend.", ja: "週末に友達と会います。" } },
    { text: "Ich interessiere mich sehr für Musik und Kunst.", meaning: { ru: "Я очень интересуюсь музыкой и искусством.", en: "I am very interested in music and art.", ja: "音楽と芸術にとても興味があります。" } },
    { text: "Alles klar, wir sehen uns morgen!", meaning: { ru: "Всё ясно, увидимся завтра!", en: "Alright, see you tomorrow!", ja: "了解、また明日ね！" } },
  ],
};
