import type { Language } from "../i18n/translations";
import type { StudyLanguage } from "./studyVibes";

export type StudySkillTab = "alphabet" | "vocabulary" | "grammar" | "reading" | "listening";

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
      alphabet: { label: "Азбука", shortDesc: "Знаки, буквы, звуки и тренировка" },
      vocabulary: { label: "Лексика", shortDesc: "Слова, карточки, SRS-повторение" },
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
      alphabet: { label: "Alphabet", shortDesc: "Letters, sounds, phonics & drill" },
      vocabulary: { label: "Vocabulary", shortDesc: "Words, flashcards & SRS deck" },
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
      alphabet: { label: "文字・五十音", shortDesc: "かな・アルファベット・発音クイズ" },
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
  level: string;
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
    {
      id: "ja-n3-tara",
      level: "N3",
      pattern: "V-た形 + ら / A-かったら (условие «если / когда»)",
      title: {
        ru: "Условное наклонение 〜たら («если / как только...»)",
        en: "Natural Conditional Form (〜たら)",
        ja: "仮定・条件を表す「〜たら」",
      },
      explanation: {
        ru: "Самый универсальный способ выразить условие в разговорном японском («если закончу», «когда приеду в Японию»). Берём прошедшую простую форму (た-форма) и добавляем ら.",
        en: "The most versatile spoken conditional in Japanese: take the plain past (た-form) and attach ら to say 'if / once / when something happens'.",
        ja: "「もし〜なら」「〜した後で」を表す最も自然な条件表現です。動詞や形容詞のた形に「ら」をつけます。",
      },
      examples: [
        {
          target: "東京に 着いたら、すぐ 連絡します。",
          reading: "とうきょうに ついたら、すぐ れんらくします。",
          tr: { ru: "Как только приеду в Токио, сразу напишу.", en: "Once I arrive in Tokyo, I'll contact you right away.", ja: "東京到着後にすぐ連絡することを伝えます。" },
        },
        {
          target: "時間があったら、一緒に お茶を 飲みませんか。",
          reading: "じかんが あったら、いっしょに おちゃを のみませんか。",
          tr: { ru: "Если будет время, выпьем вместе чаю?", en: "If you have time, shall we get tea together?", ja: "時間がある場合の誘いです。" },
        },
      ],
      quiz: {
        prompt: "仕事が 終わっ＿＿、映画を 見に 行きましょう。",
        options: ["たら", "ながら", "ので"],
        correctIdx: 0,
        hint: {
          ru: "終わった + ら → 終わったら («когда/как только закончится работа»).",
          en: "Attach ら to plain past 終わった → 終わったら.",
          ja: "た形「終わった」に「ら」をつけます。",
        },
      },
    },
    {
      id: "ja-n5-de-ni",
      level: "N5",
      pattern: "場所 + で (действие)  /  場所 + に (направление·наличие)",
      title: {
        ru: "Место: で (где делаем) и に (куда / где находится)",
        en: "Location Particles: で vs に",
        ja: "場所を表す助詞「で」と「に」",
      },
      explanation: {
        ru: "Частица で указывает место активного действия («читаю в библиотеке», «ем в кафе»). Частица に показывает пункт назначения с 行きます / 来ます или статичное нахождение с います / あります.",
        en: "Use で where an active action takes place ('study at the library'), and に for destinations or static existence ('in Tokyo', 'go to Kyoto').",
        ja: "動作が行われる場所には「で」、移動の目的地や存在場所には「に」を使います。",
      },
      examples: [
        {
          target: "図書館で 本を 読みます。",
          reading: "としょかんで ほんを よみます。",
          tr: { ru: "Я читаю книгу в библиотеке.", en: "I read a book at the library.", ja: "図書館という場所で読書します。" },
        },
        {
          target: "明日 駅に 行きます。",
          reading: "あした えきに いきます。",
          tr: { ru: "Завтра пойду на станцию.", en: "I'm going to the station tomorrow.", ja: "駅という目的地へ向かいます。" },
        },
      ],
      quiz: {
        prompt: "カフェ＿＿ コーヒーを 飲みました。",
        options: ["で", "へ", "を"],
        correctIdx: 0,
        hint: {
          ru: "Выпили кофе (активное действие) внутри кафе → で!",
          en: "Active action taking place at a venue takes で.",
          ja: "飲むという動作の場所なので「で」を選びます。",
        },
      },
    },
    {
      id: "ja-n4-te-kudasai",
      level: "N4",
      pattern: "V-て + ください  /  V-て + もいいですか",
      title: {
        ru: "Просьбы и разрешения (〜てください / 〜てもいいですか)",
        en: "Polite Requests & Permission",
        ja: "依頼と許可（〜てください・〜てもいいですか）",
      },
      explanation: {
        ru: "て-форма + ください — вежливая просьба («подождите, пожалуйста»). Конструкция て-форма + もいいですか позволяет мягко спросить разрешение («можно ли мне...?»).",
        en: "Attach ください to the て-form to make polite requests, and もいいですか to politely ask permission ('May I...?').",
        ja: "「〜てください」で丁寧なお願い、「〜てもいいですか」で許可を求める表現になります。",
      },
      examples: [
        {
          target: "すみません、もう一度 ゆっくり 言ってください。",
          reading: "すみません、もういちど ゆっくり いってください。",
          tr: { ru: "Извините, скажите, пожалуйста, ещё раз помедленнее.", en: "Excuse me, please say that once more slowly.", ja: "丁寧な依頼表現です。" },
        },
        {
          target: "ここに 座っても いいですか。",
          reading: "ここに すわっても いいですか。",
          tr: { ru: "Можно мне сесть здесь?", en: "May I sit here?", ja: "座ることへの許可を求めます。" },
        },
      ],
      quiz: {
        prompt: "写真を 撮っ＿＿ いいですか。",
        options: ["ても", "たら", "ながら"],
        correctIdx: 0,
        hint: {
          ru: "Разрешение всегда строится по формуле て-форма + もいいですか.",
          en: "Permission pattern is V-て + もいいですか.",
          ja: "「撮って＋もいいですか」で許可を尋ねます。",
        },
      },
    },
    {
      id: "ja-n4-koto-ga-dekiru",
      level: "N4",
      pattern: "V-辞書形 + ことができます",
      title: {
        ru: "Способность и возможность (〜ことができます)",
        en: "Expressing Ability (〜ことができます)",
        ja: "可能を表す「〜ことができます」",
      },
      explanation: {
        ru: "Словарная форма глагола + ことができます означает «могу / умею делать что-либо». Идеально для рассказа о своих навыках на уровне N4.",
        en: "Pair the dictionary form of any verb with ことができます to express 'can do / able to do something'.",
        ja: "動詞の辞書形＋「ことができます」で能力や状況的な可能を表します。",
      },
      examples: [
        {
          target: "私は ひらがなを 読む ことが できます。",
          reading: "わたしは ひらがなを よむ ことが できます。",
          tr: { ru: "Я умею читать хирагану.", en: "I can read hiragana.", ja: "ひらがなを読める能力を表します。" },
        },
        {
          target: "カードで 払う ことが できますか。",
          reading: "カードで はらう ことが できますか。",
          tr: { ru: "Можно ли оплатить картой?", en: "Is it possible to pay by card?", ja: "支払方法の可能を聞いています。" },
        },
      ],
      quiz: {
        prompt: "日本へ 行った ら、富士山を 見る ＿＿ できます。",
        options: ["ことが", "のを", "には"],
        correctIdx: 0,
        hint: {
          ru: "Фиксированная конструкция: глагол + ことが できます.",
          en: "Standard pattern: Dictionary Verb + ことが できます.",
          ja: "「動詞＋ことができます」が定型文です。",
        },
      },
    },
    {
      id: "ja-n3-you-ni-naru",
      level: "N3",
      pattern: "V-る / V-ない + ようになる  ·  V-て + みる",
      title: {
        ru: "Прогресс навыков (〜ようになる) и попытка (〜てみる)",
        en: "Gradual Change (〜ようになる) & Trying Out (〜てみる)",
        ja: "変化の「〜ようになる」と試行の「〜てみる」",
      },
      explanation: {
        ru: "〜ようになる показывает естественный прогресс («со временем начал понимать/уметь»). А V-て + みる означает «попробовать сделать и посмотреть, что выйдет».",
        en: "〜ようになる expresses reaching a new ability over time ('came to be able to'), while て + みる means 'try doing something to see how it goes'.",
        ja: "「〜ようになる」は練習の結果できるようになった変化、「〜てみる」は試しの行動を表します。",
      },
      examples: [
        {
          target: "毎日 聞いていたら、ニュースが わかる ように なりました。",
          reading: "まいにち きいていたら、ニュースが わかる ように なりました。",
          tr: { ru: "Слушая каждый день, я постепенно начал понимать новости.", en: "After listening daily, I became able to understand the news.", ja: "聴解力が伸びた変化を表します。" },
        },
        {
          target: "新しい カフェの 抹茶ラテを 飲んで みました。",
          reading: "あたらしい カフェの まっちゃラテを のんで みました。",
          tr: { ru: "Я попробовал матча-латте в новом кафе.", en: "I tried drinking the matcha latte at the new café.", ja: "試しに飲んでみた表現です。" },
        },
      ],
      quiz: {
        prompt: "漢字を たくさん 書いて、読める ＿＿ なりました。",
        options: ["ように", "ことに", "ために"],
        correctIdx: 0,
        hint: {
          ru: "Изменение способности: потенциальный глагол + ように なる.",
          en: "Skill progression uses ように なる.",
          ja: "能力の変化には「ように＋なる」を使います。",
        },
      },
    },
    {
      id: "ja-n3-tame-ni-noni",
      level: "N3",
      pattern: "〜ために (ради / чтобы)  vs  〜のに (хотя / вопреки)",
      title: {
        ru: "Цель (〜ために) и неожиданный контраст (〜のに)",
        en: "Purpose (〜ために) vs Regretful Contrast (〜のに)",
        ja: "目的の「〜ために」と逆接の「〜のに」",
      },
      explanation: {
        ru: "Существительное の / Глагол + ために выражает чёткую цель («ради здоровья», «чтобы поехать в Японию»). Частица のに подчёркивает удивление или досаду вопреки ожиданиям («хотя я старался, но...»).",
        en: "Use ために for clear purpose ('in order to / for the sake of'), and のに for an unexpected or frustrating contrast ('even though...').",
        ja: "「〜ために」は明確な目的、「〜のに」は予想に反する残念な結果を表します。",
      },
      examples: [
        {
          target: "日本へ 留学する ために、日本語を 勉強しています。",
          reading: "にほんへ りゅうがくする ために、にほんごを べんきょうしています。",
          tr: { ru: "Я учу японский, чтобы учиться в Японии по обмену.", en: "I study Japanese in order to study abroad in Japan.", ja: "留学という目的を表しています。" },
        },
        {
          target: "せっかく 早く 起きた のに、電車が 遅れました。",
          reading: "せっかく はやく おきた のに、でんしゃが おくれました。",
          tr: { ru: "Хотя я с таким трудом встал пораньше, электричка всё равно опоздала.", en: "Even though I went through the trouble of waking up early, the train was delayed.", ja: "期待に反する残念な気持ちです。" },
        },
      ],
      quiz: {
        prompt: "健康（けんこう）＿＿ ために、毎日 走っています。",
        options: ["の", "な", "に"],
        correctIdx: 0,
        hint: {
          ru: "После существительного перед ために обязательно ставится связка の!",
          en: "Nouns connect to ために using の.",
          ja: "名詞＋「の」＋ために、となります。",
        },
      },
    },
  ],
  en: [
    {
      id: "en-a1-present",
      level: "A1",
      pattern: "Subject + am/is/are  |  V / V-s (Present Simple)",
      title: {
        ru: "Базовые глаголы be и Present Simple (привычки и факты)",
        en: "Verb 'to be' & Present Simple Habits",
        ja: "be動詞と現在形（習慣・事実）",
      },
      explanation: {
        ru: "Глагол to be меняется по лицам (I am, you/we/they are, he/she/it is). Для регулярных действий и фактов используем Present Simple: с he/she/it к глаголу добавляется окончание -s!",
        en: "Use am / is / are for identity and states. For daily routines and general facts use Present Simple, adding -s for he / she / it.",
        ja: "状態や立場にはbe動詞（am/is/are）、毎日の習慣や事実には現在形を使います。三人称単数(he/she/it)には-sをつけます。",
      },
      examples: [
        {
          target: "My sister lives in London and drinks tea every morning.",
          tr: { ru: "Моя сестра живёт в Лондоне и каждое утро пьёт чай.", en: "Third-person -s on regular habits.", ja: "姉はロンドンに住んでいて毎朝紅茶を飲みます。" },
        },
        {
          target: "Are you ready for your first English lesson?",
          tr: { ru: "Ты готов(а) к своему первому уроку английского?", en: "Question word order with 'Are you...'", ja: "最初の英語のレッスンの準備はできましたか？" },
        },
      ],
      quiz: {
        prompt: "She ___ English for twenty minutes every evening.",
        options: ["study", "studies", "is study"],
        correctIdx: 1,
        hint: {
          ru: "Для he / she / it в Present Simple глагол получает окончание -s / -es → studies.",
          en: "Third-person singular 'she' takes '-ies' → studies.",
          ja: "主語がsheの習慣なので三単現の「studies」になります。",
        },
      },
    },
    {
      id: "en-a1-there-is",
      level: "A1",
      pattern: "There is (singular) / There are (plural) + some / any",
      title: {
        ru: "Конструкция There is / There are (что где находится)",
        en: "There is / There are + Some & Any",
        ja: "存在を表す There is / There are",
      },
      explanation: {
        ru: "Чтобы сказать, что где-то что-то есть, начните с There is (единственное число) или There are (множественное число). В утверждениях обычно ставим some, а в вопросах и отрицаниях — any.",
        en: "Start with 'There is' (singular) or 'There are' (plural) to show something exists in a place. Pair 'some' with positives and 'any' with questions/negatives.",
        ja: "「〜に…がある」はThere is（単数）/ There are（複数）から始めます。肯定文ではsome、疑問・否定文ではanyを使います。",
      },
      examples: [
        {
          target: "There are two cosy cafés near the station.",
          tr: { ru: "Рядом со станцией есть два уютных кафе.", en: "Plural existence.", ja: "駅の近くに居心地の良いカフェが2つあります。" },
        },
        {
          target: "Is there any sugar in the kitchen?",
          tr: { ru: "На кухне есть немного сахара?", en: "Question with uncountable 'any'.", ja: "キッチンに砂糖はありますか？" },
        },
      ],
      quiz: {
        prompt: "Look! ___ three libraries in our town.",
        options: ["There is", "There are", "It is"],
        correctIdx: 1,
        hint: {
          ru: "Множественное число (three libraries) требует There are.",
          en: "Plural 'three libraries' pairs with 'There are'.",
          ja: "複数形（three libraries）なので「There are」を使います。",
        },
      },
    },
    {
      id: "en-pres-perf",
      level: "A2",
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
      id: "en-modals",
      level: "A2",
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
      level: "B2",
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
      level: "B2",
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
    {
      id: "en-a1-can-modal",
      level: "A1",
      pattern: "can / can't + Verb (base)  |  Can I / Could you...?",
      title: {
        ru: "Модальный глагол Can (умения и вежливые просьбы)",
        en: "Modal 'Can' for Ability & Polite Requests",
        ja: "助動詞 can（能力と丁寧なお願い）",
      },
      explanation: {
        ru: "Can всегда стоит в начальной форме (без -s для he/she!) и требует чистого инфинитива без to: «She can speak English», «Can I help you?».",
        en: "Use 'can' + base verb (never add -s or 'to') to express skills or ask simple questions like 'Can I pay by card?'.",
        ja: "canの後ろは主語に関わらず常に動詞の原形（toなし）を置きます。",
      },
      examples: [
        {
          target: "Can I sit near the window, please?",
          tr: { ru: "Можно мне сесть у окна, пожалуйста?", en: "Polite everyday café request.", ja: "窓際の席に座ってもいいですか？" },
        },
        {
          target: "He can read maps very quickly.",
          tr: { ru: "Он умеет очень быстро читать карты.", en: "No -s after he/she with 'can'.", ja: "彼は地図を読むのがとても速いです。" },
        },
      ],
      quiz: {
        prompt: "Maria ___ play the piano very well.",
        options: ["can", "cans", "can to"],
        correctIdx: 0,
        hint: {
          ru: "После модального can не бывает ни -s, ни частицы to.",
          en: "Modals take no -s and no 'to'.",
          ja: "助動詞canに三単現のsやtoは不要です。",
        },
      },
    },
    {
      id: "en-a1-prepositions",
      level: "A1",
      pattern: "in (месяц/город) · on (день/улица) · at (время/точка)",
      title: {
        ru: "Предлоги времени и места: in / on / at",
        en: "Time & Place Prepositions: in, on, at",
        ja: "前置詞の基本（in / on / at）",
      },
      explanation: {
        ru: "Золотая пирамида: at — точный момент или адрес (at 8:00, at the station); on — дни и даты (on Monday); in — крупные отрезки и страны/города (in May, in London).",
        en: "Think pyramid scale: 'at' = exact point (at 9 AM, at home); 'on' = days & dates (on Friday); 'in' = months, seasons, cities (in July, in Oxford).",
        ja: "点＝at（時刻・駅）、面・日＝on（曜日・日付）、広い範囲＝in（月・都市）と覚えましょう。",
      },
      examples: [
        {
          target: "The train arrives at seven o'clock on Monday.",
          tr: { ru: "Поезд прибывает в семь часов в понедельник.", en: "at + clock time; on + weekday.", ja: "電車は月曜日の7時に到着します。" },
        },
        {
          target: "I stayed in London during winter.",
          tr: { ru: "Я жил в Лондоне зимой.", en: "in + city.", ja: "冬の間ロンドンに滞在しました。" },
        },
      ],
      quiz: {
        prompt: "Our English lesson starts ___ Friday morning.",
        options: ["in", "on", "at"],
        correctIdx: 1,
        hint: {
          ru: "Любой конкретный день недели (даже с уточнением morning) требует предлога on!",
          en: "Days of the week always use 'on'.",
          ja: "特定の曜日がつく場合は必ず「on」を使います。",
        },
      },
    },
    {
      id: "en-a2-past-vs-perf",
      level: "A2",
      pattern: "Past Simple (yesterday) vs Present Perfect (ever / already)",
      title: {
        ru: "Past Simple или Present Perfect: в чём разница",
        en: "Past Simple vs Present Perfect",
        ja: "過去形と現在完了形の違い",
      },
      explanation: {
        ru: "Если есть чёткое «когда» в прошлом (yesterday, in 2023, two hours ago) — всегда Past Simple. Если важен сам жизненный опыт или результат к сейчас (ever, already, yet) — Present Perfect (have/has + V3).",
        en: "Use Past Simple when time is finished ('visited yesterday'); use Present Perfect ('have visited') when life experience or current result matters without a finished timestamp.",
        ja: "yesterday等いつ起きたかが明確なら過去形、経験や今の結果が大切ならhave+過去分詞を使います。",
      },
      examples: [
        {
          target: "Have you ever visited the British Museum?",
          tr: { ru: "Ты когда-нибудь был в Британском музее?", en: "Life experience with 'ever'.", ja: "これまでに大英博物館を訪れたことはありますか？" },
        },
        {
          target: "Yes, I went there two years ago.",
          tr: { ru: "Да, я ходил туда два года назад.", en: "'two years ago' anchors a finished time -> Past Simple.", ja: "はい、2年前に行きました。" },
        },
      ],
      quiz: {
        prompt: "I have already ___ dinner, thank you!",
        options: ["finish", "finished", "finishing"],
        correctIdx: 1,
        hint: {
          ru: "have + already требует 3-ю форму глагола (finished).",
          en: "Present Perfect uses past participle V3.",
          ja: "have/hasの後ろには過去分詞「finished」を置きます。",
        },
      },
    },
    {
      id: "en-a2-comparatives",
      level: "A2",
      pattern: "short: adj-er + than  |  long: more + adj + than",
      title: {
        ru: "Сравнение и превосходная степень (-er / more / the most)",
        en: "Comparatives & Superlatives",
        ja: "比較級と最上級（-er / more / the most）",
      },
      explanation: {
        ru: "Короткие прилагательные (1–2 слога) берут -er / -est (faster, the fastest). Длинные берут more / the most (more comfortable). Исключения: good → better → the best!",
        en: "Short adjectives add -er/-est ('faster'), longer words use 'more/most' ('more reliable'), and remember irregulars like 'good → better → best'.",
        ja: "短い形容詞は-er/-est、長い語はmore/mostをつけます。goodの不規則変化に注意。",
      },
      examples: [
        {
          target: "Taking the underground is faster than driving at rush hour.",
          tr: { ru: "Ехать на метро быстрее, чем на машине в час пик.", en: "Short adjective + -er than.", ja: "ラッシュ時は地下鉄の方が車より速いです。" },
        },
        {
          target: "This neighbourhood is the quietest part of Oxford.",
          tr: { ru: "Этот район — самая тихая часть Оксфорда.", en: "Superlative with 'the'.", ja: "この地域はオックスフォードで最も静かです。" },
        },
      ],
      quiz: {
        prompt: "This book is much ___ interesting than the movie.",
        options: ["more", "most", "er"],
        correctIdx: 0,
        hint: {
          ru: "Длинное прилагательное interesting сравнивается через more ... than.",
          en: "Multi-syllable adjectives pair with 'more ... than'.",
          ja: "長い形容詞の比較は「more ＋ 形容詞 ＋ than」です。",
        },
      },
    },
    {
      id: "en-b1-used-to",
      level: "B1",
      pattern: "used to + Verb  (привычка в прошлом)  vs  be used to + V-ing",
      title: {
        ru: "Прошлые привычки (used to) vs Привыкание (be used to)",
        en: "'Used to' Past Habits vs 'Be used to' + -ing",
        ja: "used to（昔の習慣）と be used to -ing（慣れている）",
      },
      explanation: {
        ru: "I used to drink 5 coffees = раньше пил (сейчас нет). Но I am used to working late = я привык работать допоздна (здесь -ing после to!).",
        en: "'used to + V' describes past routines that stopped. 'be used to + -ing/noun' means you are already comfortable with something now.",
        ja: "「used to V」は過去の習慣、「be used to -ing」は今すでに慣れている状態を表します。",
      },
      examples: [
        {
          target: "She used to live in Manchester before moving to London.",
          tr: { ru: "Раньше она жила в Манчестере до переезда в Лондон.", en: "Past state that changed.", ja: "彼女は以前マンチェスターに住んでいました。" },
        },
        {
          target: "Now I'm used to cycling in busy traffic.",
          tr: { ru: "Теперь я привык ездить на велосипеде в плотном потоке.", en: "be used to + gerund (-ing).", ja: "今は交通量の多い場所での自転車に慣れています。" },
        },
      ],
      quiz: {
        prompt: "It took a month, but I'm finally used to ___ on the left!",
        options: ["drive", "driving", "drove"],
        correctIdx: 1,
        hint: {
          ru: "После связки be used to (или get used to) всегда идёт -ing!",
          en: "'be used to' is followed by a gerund (-ing).",
          ja: "「be used to」の後は動名詞「driving」が来ます。",
        },
      },
    },
    {
      id: "en-b1-passive",
      level: "B1",
      pattern: "be (is / was / has been) + Past Participle (V3)",
      title: {
        ru: "Пассивный залог в речи и новостях (Passive Voice)",
        en: "Passive Voice in Context",
        ja: "英語の受動態（be + 過去分詞）",
      },
      explanation: {
        ru: "Используется, когда действие важнее исполнителя, например в технологиях, описании процессов или новостях. Время задаётся формой глагола be.",
        en: "Focus on the object or process rather than who did it: shift 'to be' into the right tense and follow with V3.",
        ja: "誰がしたかより動作の対象が重要な時に使い、時制はbe動詞で表現します。",
      },
      examples: [
        {
          target: "The system was upgraded last night without any downtime.",
          tr: { ru: "Систему обновили вчера ночью без простоев.", en: "Past passive tech reporting.", ja: "システムは昨夜ダウンタイムなしでアップグレードされました。" },
        },
        {
          target: "English is spoken as a working language worldwide.",
          tr: { ru: "На английском говорят как на рабочем языке по всему миру.", en: "Present passive fact.", ja: "英語は世界中で実務言語として話されています。" },
        },
      ],
      quiz: {
        prompt: "All files have ___ safely backed up to the server.",
        options: ["be", "been", "being"],
        correctIdx: 1,
        hint: {
          ru: "Present Perfect Passive: have/has + been + V3!",
          en: "Perfect passive uses 'been'.",
          ja: "現在完了の受動態は「have + been + 過去分詞」です。",
        },
      },
    },
    {
      id: "en-b2-third-cond",
      level: "B2",
      pattern: "If + Past Perfect (had + V3), would have + V3",
      title: {
        ru: "Третье условное наклонение (нереальное прошлое)",
        en: "Third Conditional (Hypothetical Past)",
        ja: "仮定法過去完了（もしあの時〜していたら）",
      },
      explanation: {
        ru: "Описывает ситуации в прошлом, которые уже нельзя изменить («если бы я тогда не опоздал на поезд, мы бы встретились раньше»).",
        en: "Talk about unreal past outcomes and hindsight reflections using 'If + had V3, would have V3'.",
        ja: "過去の事実と異なる後悔や振り返りを「If + had p.p., would have p.p.」で表します。",
      },
      examples: [
        {
          target: "If I had known earlier, I would have caught the morning express.",
          tr: { ru: "Если бы я знал раньше, я бы успел на утренний экспресс.", en: "Classic 3rd conditional.", ja: "もっと早く知っていれば、朝の特急に乗れたのに。" },
        },
        {
          target: "She wouldn't have missed the flight if traffic hadn't stalled.",
          tr: { ru: "Она бы не опоздала на рейс, если бы движение не встало.", en: "Negative result clause.", ja: "渋滞がなければ飛行機に乗り遅れなかったでしょう。" },
        },
      ],
      quiz: {
        prompt: "If they had tested the feature thoroughly, the bug ___.",
        options: ["wouldn't happen", "wouldn't have happened", "didn't happen"],
        correctIdx: 1,
        hint: {
          ru: "После If + had tested во второй части обязательно идёт would have + V3.",
          en: "Third conditional main clause requires 'would have + V3'.",
          ja: "主節は「wouldn't have happened」の形になります。",
        },
      },
    },
    {
      id: "en-b2-inversion",
      level: "B2",
      pattern: "Not only did + S + V ...  /  Never have I seen ...",
      title: {
        ru: "Инверсия для сильной и выразительной речи (B2–C1)",
        en: "Emphatic Negative Inversion (Not only / Never)",
        ja: "強調のための倒置（Not only / Never）",
      },
      explanation: {
        ru: "Когда фраза начинается с отрицательного или ограничительного оборота (Never, Seldom, Not only, Rarely), вспомогательный глагол выносится перед подлежащим, как в вопросе.",
        en: "Starting a sentence with 'Not only', 'Never', or 'Rarely' swaps the auxiliary verb before the subject to add dramatic rhetorical punch.",
        ja: "文頭に否定や強調の副詞（Never / Not only）が来ると、疑問文と同じ語順（助動詞＋主語）に倒置されます。",
      },
      examples: [
        {
          target: "Not only did she learn Japanese, but she also mastered kanji.",
          tr: { ru: "Мало того что она выучила японский, так она ещё и освоила кандзи.", en: "Emphatic 'Not only did + S + V'.", ja: "彼女は日本語を学んだだけでなく、漢字まで習得しました。" },
        },
        {
          target: "Never have I seen such a peaceful harbour sunset.",
          tr: { ru: "Никогда в жизни я не видел такого спокойного заката в гавани.", en: "Literary 'Never have I...'.", ja: "これほど穏やかな港の夕暮れを見たことがありません。" },
        },
      ],
      quiz: {
        prompt: "Not only ___ fast, but the app also feels effortless.",
        options: ["it works", "does it work", "works it"],
        correctIdx: 1,
        hint: {
          ru: "Инверсия: вспомогательный глагол does ставится перед подлежащим it!",
          en: "Invert auxiliary 'does' before subject 'it'.",
          ja: "Not onlyで始まるため「does it work」と倒置させます。",
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
      level: "B1",
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
      level: "B1",
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
    {
      id: "de-konjunktiv",
      level: "B2",
      pattern: "würde + Infinitiv  |  könnte / hätte / wäre",
      title: {
        ru: "Сослагательное наклонение и вежливость (Konjunktiv II)",
        en: "Konjunktiv II: Wishes & Polite Hypotheticals",
        ja: "接続法II式（仮定と丁寧な依頼）",
      },
      explanation: {
        ru: "Konjunktiv II выражает мечты, гипотетические ситуации («если бы у меня было время...») и особо вежливые просьбы. Для haben → hätte, sein → wäre, können → könnte, для всех остальных — würde + инфинитив.",
        en: "Used for polite requests ('Könnten Sie bitte...') and unreal wishes ('Ich hätte gern mehr Zeit'). Key forms: wäre, hätte, könnte, or 'würde + infinitive'.",
        ja: "丁寧な依頼や非現実的な願望・仮定を表します。hätte・wäre・könnte、またはwürde＋不定詞を使います。",
      },
      examples: [
        {
          target: "Könnten Sie diesen Satz bitte etwas langsamer wiederholen?",
          tr: { ru: "Не могли бы вы повторить эту фразу чуть медленнее?", en: "Very polite request with könnte.", ja: "この文をもう少しゆっくり繰り返していただけませんか？" },
        },
        {
          target: "Wenn ich mehr Zeit hätte, würde ich jeden Tag lesen.",
          tr: { ru: "Если бы у меня было больше времени, я бы читал каждый день.", en: "Hypothetical conditional with hätte + würde.", ja: "もしもっと時間があれば毎日読むのに。" },
        },
      ],
      quiz: {
        prompt: "Ich ___ jetzt sehr gern in Berlin.",
        options: ["wäre", "bin sein", "hätte sein"],
        correctIdx: 0,
        hint: {
          ru: "Сослагательная форма от sein («я бы сейчас с радостью был...») — wäre.",
          en: "Hypothetical form of 'sein' is 'wäre'.",
          ja: "「今ベルリンにいたらなあ」はseinの接続法II式「wäre」を使います。",
        },
      },
    },
    {
      id: "de-passiv",
      level: "B2",
      pattern: "werden (Präs./Prät.) + ... + Partizip II",
      title: {
        ru: "Пассивный залог (Vorgangspassiv с werden)",
        en: "German Passive Voice (werden + Partizip II)",
        ja: "ドイツ語の受動態 (werden + 過去分詞)",
      },
      explanation: {
        ru: "Когда важен сам процесс или результат действия, а не исполнитель, используем werden (wird / werden / wurde) на 2-м месте и Partizip II в конце. Исполнитель добавляется через von.",
        en: "Highlights processes and actions using conjugated 'werden' (wird / wurde) in slot 2 plus Partizip II at the end. Optional agent takes 'von'.",
        ja: "動作のプロセスを強調する受動態です。2番目にwerdenを置き、文末に過去分詞を置きます。",
      },
      examples: [
        {
          target: "Das neue Projekt wird gerade von unserem Team vorbereitet.",
          tr: { ru: "Новый проект прямо сейчас готовится нашей командой.", en: "Present passive process.", ja: "新しいプロジェクトは現在私たちのチームによって準備されています。" },
        },
        {
          target: "Das Gebäude wurde im Jahr 1919 gebaut.",
          tr: { ru: "Здание было построено в 1919 году.", en: "Past passive with wurde.", ja: "その建物は1919年に建てられました。" },
        },
      ],
      quiz: {
        prompt: "Die Ergebnisse ___ morgen veröffentlicht.",
        options: ["werden", "sind haben", "würde"],
        correctIdx: 0,
        hint: {
          ru: "Множественное число (die Ergebnisse) требует werden!",
          en: "Plural 'Die Ergebnisse' takes 'werden' + Partizip II.",
          ja: "複数形が主語なので「werden」を使います。",
        },
      },
    },
    {
      id: "de-a1-fragen",
      level: "A1",
      pattern: "W-Frage: Wer / Was / Wo / Wie + Verb(2) + Subjekt?",
      title: {
        ru: "Вопросительные слова (W-Fragen) и порядок слов",
        en: "German Question Words (W-Fragen)",
        ja: "ドイツ語の疑問詞（Wer / Wo / Wie / Wann）",
      },
      explanation: {
        ru: "В специальных вопросах на 1-е место ставится вопросительное слово (Wo, Wann, Warum, Wie viel), а на 2-е — обязательно спрягаемый глагол!",
        en: "Place the W-word first and keep the conjugated verb strictly in position 2.",
        ja: "疑問詞が1番目、活用した動詞が必ず2番目に配置されます。",
      },
      examples: [
        {
          target: "Wo wohnen Sie in Berlin?",
          tr: { ru: "Где вы живёте в Берлине?", en: "Polite question with Wo + Verb.", ja: "ベルリンのどこにお住まいですか？" },
        },
        {
          target: "Wann fährt der Zug nach München ab?",
          tr: { ru: "Во сколько отправляется поезд в Мюнхен?", en: "Separable verb splits to the end.", ja: "ミュンヘン行きの電車はいつ出発しますか？" },
        },
      ],
      quiz: {
        prompt: "___ kostet ein Kaffee mit Milch?",
        options: ["Wie viel", "Wer", "Wohin"],
        correctIdx: 0,
        hint: {
          ru: "Цену спрашивают через Wie viel («сколько»).",
          en: "Use 'Wie viel' to ask prices.",
          ja: "価格を尋ねるときは「Wie viel」を使います。",
        },
      },
    },
    {
      id: "de-a1-haben-sein",
      level: "A1",
      pattern: "haben (иметь) · sein (быть) — спряжение в настоящем времени",
      title: {
        ru: "Главные глаголы sein и haben (Präsens)",
        en: "Core Verbs: sein (to be) & haben (to have)",
        ja: "基本動詞 sein と haben の活用",
      },
      explanation: {
        ru: "Ich bin / du bist / er ist / wir sind (быть) и ich habe / du hast / er hat / wir haben (иметь) — фундамент любого рассказа о себе и для прошедшего времени Perfekt.",
        en: "Master 'ich bin, du bist, er ist' and 'ich habe, du hast, er hat' — they form greetings and Perfekt past tense too.",
        ja: "自己表現だけでなく未来・過去完了（Perfekt）でも必須となる最重要動詞です。",
      },
      examples: [
        {
          target: "Ich bin heute sehr motiviert und habe viel Zeit.",
          tr: { ru: "Я сегодня полон мотивации, и у меня много времени.", en: "Combines both sein & haben.", ja: "今日はとてもやる気があり、時間もたくさんあります。" },
        },
        {
          target: "Habt ihr schon den neuen Plan gesehen?",
          tr: { ru: "Вы уже видели новый план?", en: "Plural 'ihr habt' auxiliary.", ja: "みんなはもう新しい計画を見ましたか？" },
        },
      ],
      quiz: {
        prompt: "Lukas ___ einen neuen Laptop für die Arbeit.",
        options: ["ist", "hat", "haben"],
        correctIdx: 1,
        hint: {
          ru: "Владение («у Лукаса есть») требует haben в 3-м лице: hat.",
          en: "Third-person singular possession uses 'hat'.",
          ja: "3人称単数Lukasには「hat」を使います。",
        },
      },
    },
    {
      id: "de-a2-modalverben",
      level: "A2",
      pattern: "können / müssen / dürfen / wollen(2) + ... + Infinitiv(Ende)",
      title: {
        ru: "Модальные глаголы и глагольная рамка (können / müssen)",
        en: "Modal Verbs & Sentence Frame",
        ja: "話法の助動詞（können / müssen / dürfen）",
      },
      explanation: {
        ru: "Модальный глагол стоит на 2-м месте (ich kann, wir müssen), а смысловой инфинитив без «zu» уходит в самый конец предложения!",
        en: "Place the modal verb in slot 2 and kick the bare infinitive (without 'zu') all the way to the final position.",
        ja: "助動詞が2番目、本動詞の不定詞が文末に来る枠構造を作ります。",
      },
      examples: [
        {
          target: "Am Bahnhof müssen wir leider in die S-Bahn umsteigen.",
          tr: { ru: "На вокзале нам, к сожалению, нужно пересесть на S-Bahn.", en: "müssen + infinitive at end.", ja: "駅で残念ながらSバーンに乗り換えなければなりません。" },
        },
        {
          target: "Kannst du bitte das Fenster öffnen?",
          tr: { ru: "Можешь, пожалуйста, открыть окно?", en: "Yes/no modal question.", ja: "窓を開けてもらえますか？" },
        },
      ],
      quiz: {
        prompt: "Hier ___ man nicht laut telefonieren.",
        options: ["darf", "darft", "dürfen"],
        correctIdx: 0,
        hint: {
          ru: "Безличное местоимение man спрягается как er/sie/es: darf!",
          en: "Pronoun 'man' takes 3rd-person singular 'darf'.",
          ja: "不定代名詞「man」は3人称単数扱いで「darf」です。",
        },
      },
    },
    {
      id: "de-a2-wechselpraep",
      level: "A2",
      pattern: "in / auf / an / unter  +  Dativ (Wo?) vs Akkusativ (Wohin?)",
      title: {
        ru: "Предлоги места: Dativ (Где?) vs Akkusativ (Куда?)",
        en: "Two-Way Prepositions: Wo (Dativ) vs Wohin (Akkusativ)",
        ja: "2格支配と場所の前置詞（Dativ＝場所 / Akkusativ＝方向）",
      },
      explanation: {
        ru: "Двойные предлоги (in, auf, an, über, unter) требуют Dativ при ответе на вопрос Wo? (статично: im Café = in dem Café), и Akkusativ на вопрос Wohin? (движение: ins Café = in das Café).",
        en: "Two-way prepositions take Dative when stationary ('im Büro' = inside) and Accusative when showing direction/movement ('ins Büro' = into).",
        ja: "静止の位置（Wo?）には3格（Dativ）、移動の方向（Wohin?）には4格（Akkusativ）を使います。",
      },
      examples: [
        {
          target: "Das Buch liegt auf dem Tisch. (Wo? -> Dativ)",
          tr: { ru: "Книга лежит на столе.", en: "Stationary position on the table.", ja: "本は机の上に置いてあります（静止・3格）。" },
        },
        {
          target: "Ich lege das Buch auf den Tisch. (Wohin? -> Akkusativ)",
          tr: { ru: "Я кладу книгу на стол.", en: "Directional placement onto the table.", ja: "本を机の上に置きます（移動・4格）。" },
        },
      ],
      quiz: {
        prompt: "Wir treffen uns heute Abend ___ Kino. (Wo?)",
        options: ["im (in dem)", "ins (in das)", "auf das"],
        correctIdx: 0,
        hint: {
          ru: "Встреча происходит в конкретном месте (Wo?) → Dativ: in dem = im.",
          en: "Fixed location ('Wo?') requires Dative: im Kino.",
          ja: "場所「Wo?」の表現なので3格の「im」を選びます。",
        },
      },
    },
    {
      id: "de-b1-relativsaetze",
      level: "B1",
      pattern: "Nomen, der / die / das ... Verb(Ende)",
      title: {
        ru: "Относительные придаточные предложения (Relativsätze)",
        en: "Relative Clauses (der, die, das, denen)",
        ja: "ドイツ語の関係代名詞節",
      },
      explanation: {
        ru: "Чтобы уточнить существительное («книга, которую я читаю»), после запятой ставим относительное местоимение в роде этого слова (der/die/das), а глагол убираем в конец придаточного!",
        en: "Match gender/number from the noun in the main clause, match case from the verb inside the relative clause, and send the relative verb to the end.",
        ja: "先行詞の性・数に合わせ、関係節内の格に応じた関係代名詞を選び、動詞を文末に置きます。",
      },
      examples: [
        {
          target: "Das ist die App, die mir jeden Tag beim Lernen hilft.",
          tr: { ru: "Это приложение, которое помогает мне учиться каждый день.", en: "Feminine subject 'die'.", ja: "これが毎日私の学習を助けてくれるアプリです。" },
        },
        {
          target: "Der Freund, mit dem ich in Berlin war, lernt jetzt Japanisch.",
          tr: { ru: "Друг, с которым я был в Берлине, теперь учит японский.", en: "mit + Dative masculine -> dem.", ja: "ベルリンに一緒に行った友人は今日本語を学んでいます。" },
        },
      ],
      quiz: {
        prompt: "Das Projekt, ___ wir gerade bauen, wächst schnell.",
        options: ["das", "der", "denen"],
        correctIdx: 0,
        hint: {
          ru: "das Projekt — среднего рода (Akkusativ среднего рода = das!).",
          en: "Neuter singular Akkusativ for 'das Projekt' is 'das'.",
          ja: "das Projekt（中性名詞）の4格は「das」になります。",
        },
      },
    },
    {
      id: "de-b1-praeteritum",
      level: "B1",
      pattern: "Perfekt (разговор) vs Präteritum (книги, статьи, war/hatte)",
      title: {
        ru: "Прошедшее время Präteritum vs Perfekt",
        en: "Narrative Past: Präteritum vs Spoken Perfekt",
        ja: "過去形（Präteritum）と現在完了形（Perfekt）の使い分け",
      },
      explanation: {
        ru: "В устной речи обычно используют Perfekt (Ich habe gelernt), но глаголы sein (war), haben (hatte) и модальные (konnte, musste) почти всегда ставят в краткий Präteritum!",
        en: "In daily conversation Germans prefer Perfekt, except 'sein (war)', 'haben (hatte)', and modals ('konnte, musste'), which sound much more natural in Präteritum.",
        ja: "会話ではPerfektが主流ですが、sein/haben/助動詞は文章・会話ともに簡潔なPräteritumがよく使われます。",
      },
      examples: [
        {
          target: "Gestern hatte ich wenig Zeit, aber das Konzert war wunderbar.",
          tr: { ru: "Вчера у меня было мало времени, но концерт был чудесным.", en: "hatte & war sound natural in speech.", ja: "昨日は時間が少なかったけれど、コンサートは素晴らしかったです。" },
        },
        {
          target: "Danach sind wir gemeinsam nach Hause gegangen.",
          tr: { ru: "После этого мы вместе пошли домой.", en: "Motion verb Perfekt with 'sind'.", ja: "その後、私たちは一緒に家に帰りました。" },
        },
      ],
      quiz: {
        prompt: "Letzte Woche ___ ich leider krank und konnte nicht kommen.",
        options: ["war", "gewesen", "bin"],
        correctIdx: 0,
        hint: {
          ru: "Прошедшее время для «я был» без вспомогательных — ich war.",
          en: "Simple past of 'sein' for 'ich' is 'war'.",
          ja: "「私は先週病気だった」は簡潔な過去形「war」を使います。",
        },
      },
    },
    {
      id: "de-b2-je-desto",
      level: "B2",
      pattern: "Je + Komparativ ... Verb(Ende), desto + Komparativ + Verb(1)",
      title: {
        ru: "Парный союз «Чем ..., тем ...» (je ..., desto ...)",
        en: "Proportional Correlatives: je ..., desto ...",
        ja: "比例構文「je 〜, desto 〜」（〜すればするほど）",
      },
      explanation: {
        ru: "В первой части («je mehr...») глагол уходит в конец придаточного. Во второй части («desto schneller...») глагол встаёт СРАЗУ после сравнительного прилагательного!",
        en: "First half acts as a subordinate clause (verb last); second half puts the conjugated verb right after 'desto + comparative'.",
        ja: "je節では動詞が文末、desto節では「desto＋比較級」の直後に動詞が続きます。",
      },
      examples: [
        {
          target: "Je öfter man laut spricht, desto sicherer wird das Sprachgefühl.",
          tr: { ru: "Чем чаще говоришь вслух, тем увереннее становится чувство языка.", en: "Clean B2 double comparative structure.", ja: "声に出して話す回数が増えるほど、語感が確実になります。" },
        },
        {
          target: "Je tiefer wir ein Thema verstehen, desto einfacher wirkt es.",
          tr: { ru: "Чем глубже мы понимаем тему, тем проще она кажется.", en: "Contrastive balance.", ja: "テーマを深く理解するほど、シンプルに見えてきます。" },
        },
      ],
      quiz: {
        prompt: "Je länger du wartest, ___ schwieriger wird der Start.",
        options: ["desto", "weil", "obwohl"],
        correctIdx: 0,
        hint: {
          ru: "Пара к союзу je — только desto (или umso).",
          en: "'je ...' always pairs with 'desto ...'.",
          ja: "「je」に対応するペアは「desto」です。",
        },
      },
    },
    {
      id: "de-b2-nomenverb",
      level: "B2",
      pattern: "eine Entscheidung treffen · zur Verfügung stehen · Wert legen auf",
      title: {
        ru: "Устойчивые связки Nomen-Verb-Verbindungen (B2–C1)",
        en: "High-Register Nomen-Verb Expressions",
        ja: "フォーマルな名詞・動詞の固定表現",
      },
      explanation: {
        ru: "Деловой и академический немецкий ценит устойчивые пары «существительное + глагол» вместо простого глагола: eine Entscheidung treffen (принять решение) вместо nur entscheiden.",
        en: "Academic & business German uses fixed noun+verb idioms like 'eine Frage stellen' or 'eine Entscheidung treffen' instead of bare single verbs.",
        ja: "ビジネスや学術表現では「entscheiden」を「eine Entscheidung treffen」のように名詞＋機能動詞で表します。",
      },
      examples: [
        {
          target: "Unser Team legt großen Wert auf hohe Codequalität.",
          tr: { ru: "Наша команда придаёт большое значение высокому качеству кода.", en: "Wert legen auf (+ Akkusativ).", ja: "私たちのチームは高いコード品質を非常に重視しています。" },
        },
        {
          target: "Diese Funktion steht ab sofort allen Nutzern zur Verfügung.",
          tr: { ru: "Эта функция отныне доступна всем пользователям.", en: "zur Verfügung stehen.", ja: "この機能はただいまより全ユーザーにご利用いただけます。" },
        },
      ],
      quiz: {
        prompt: "Wir müssen heute eine wichtige Entscheidung ___.",
        options: ["treffen", "machen", "tun"],
        correctIdx: 0,
        hint: {
          ru: "Решение по-немецки буквально «встречают»: eine Entscheidung treffen!",
          en: "Fixed collocation is 'eine Entscheidung treffen'.",
          ja: "「決断を下す」の定型動詞は「treffen」です。",
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
    {
      id: "ja-read-ryokan",
      level: "N3",
      emoji: "♨️",
      title: { ru: "Вечер в традиционном рёкане", en: "An Evening at an Onsen Ryokan", ja: "温泉旅館での週末" },
      subtitle: {
        ru: "Уровень N3: условная форма 〜たら и культурные впечатления",
        en: "N3 narrative: 〜たら conditionals & Japanese hospitality",
        ja: "N3読解：〜たら条件文と日本のおもてなし",
      },
      sentences: [
        {
          target: "金曜日、仕事が 終わったら、山の 温泉旅館へ 出かけます。",
          reading: "きんようび、しごとが おわったら、やまの おんせんりょかんへ でかけます。",
          tr: { ru: "В пятницу, как только закончится работа, я отправляюсь в горный онсэн-рёкан.", en: "Once work ends on Friday, I set off for a mountain onsen ryokan.", ja: "金曜に仕事が終わったら温泉旅館へ向かいます。" },
        },
        {
          target: "畳の 部屋に 入ると、木の 優しい 香りが しました。",
          reading: "たたみの へやに はいると、きの やさしい かおりが しました。",
          tr: { ru: "Стоило войти в комнату с татами, как почувствовался мягкий аромат дерева.", en: "Stepping onto the tatami room, a gentle scent of cedar filled the air.", ja: "畳の部屋に入ると落ち着いた木の香りが広がります。" },
        },
        {
          target: "温かい 温泉に 入ってから、季節の 料理を ゆっくり 味わいました。",
          reading: "あたたかい おんせんに はいってから、きせつの りょうりを ゆっくり あじわいました。",
          tr: { ru: "После тёплого горячего источника я не спеша насладился сезонными блюдами.", en: "After soaking in the hot spring, I savored seasonal dishes unhurriedly.", ja: "温泉に入った後で季節の会席を楽しみました。" },
        },
      ],
      vocab: [
        { word: "経験", reading: "けいけん", meaning: { ru: "опыт, переживание", en: "experience", ja: "経験" }, type: "KANJI" },
        { word: "季節", reading: "きせつ", meaning: { ru: "время года, сезон", en: "season", ja: "季節" }, type: "KANJI" },
        { word: "ゆっくり", reading: "ゆっくり", meaning: { ru: "не спеша, спокойно", en: "slowly, unhurriedly", ja: "ゆっくり" }, type: "KANA" },
      ],
      questions: [
        {
          question: { ru: "Чем пахло в комнате с татами?", en: "What scent greeted the guest in the tatami room?", ja: "畳の部屋ではどんな香りがしましたか？" },
          options: { ru: ["Кофе", "Мягкий аромат дерева", "Цветами апельсина"], en: ["Coffee", "Gentle scent of wood", "Fresh paint"], ja: ["コーヒー", "木の優しい香り", "海の風"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "ja-read-n5-park",
      level: "N5",
      emoji: "🌳",
      title: { ru: "Прогулка в парке Уэно", en: "A Walk in Ueno Park", ja: "上野公園の散歩" },
      subtitle: {
        ru: "Уровень N5: природа, цвета и простые действия (〜ます)",
        en: "N5 nature walk: simple verbs & adjectives",
        ja: "N5初級：自然の言葉と基本動詞",
      },
      sentences: [
        {
          target: "日曜日、ともだちと 上野公園（うえのこうえん）へ 行きました。",
          reading: "にちようび、ともだちと うえのこうえんへ いきました。",
          tr: { ru: "В воскресенье я пошёл в парк Уэно с другом.", en: "On Sunday I went to Ueno Park with a friend.", ja: "日曜日に友達と上野公園へ行きました。" },
        },
        {
          target: "公園に きれいな 桜の 木が たくさん あります。",
          reading: "こうえんに きれいな さくらの きが たくさん あります。",
          tr: { ru: "В парке много красивых деревьев сакуры.", en: "There are many pretty cherry blossom trees in the park.", ja: "公園には美しい桜がたくさん咲いています。" },
        },
        {
          target: "私たちは 冷たい お茶を 飲んで、写真を 撮りました。",
          reading: "わたしたちは つめたい おちゃを のんで、しゃしんを とりました。",
          tr: { ru: "Мы выпили холодного чаю и сделали фотографии.", en: "We drank cold green tea and took photos.", ja: "冷たいお茶を飲みながら写真撮影をしました。" },
        },
      ],
      vocab: [
        { word: "公園", reading: "こうえん", meaning: { ru: "парк", en: "park", ja: "公園" }, type: "KANJI" },
        { word: "木", reading: "き", meaning: { ru: "дерево", en: "tree", ja: "木" }, type: "KANJI" },
        { word: "たくさん", reading: "たくさん", meaning: { ru: "много", en: "many / a lot", ja: "たくさん" }, type: "KANA" },
      ],
      questions: [
        {
          question: { ru: "С кем рассказчик пошёл в парк Уэно?", en: "Who did the narrator visit the park with?", ja: "誰と上野公園へ行きましたか？" },
          options: { ru: ["Один", "С другом", "С учителем"], en: ["Alone", "With a friend", "With a teacher"], ja: ["一人で", "友達と", "先生と"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "ja-read-n3-shinkansen",
      level: "N3",
      emoji: "🚅",
      title: { ru: "Первый синкансэн в Киото", en: "First Shinkansen to Kyoto", ja: "初めての新幹線と京都" },
      subtitle: {
        ru: "Уровень N3: путешествия, 〜ように и 〜ために",
        en: "N3 travel journal: speed, focus & purpose",
        ja: "N3読解：新幹線の旅と目標表現",
      },
      sentences: [
        {
          target: "朝 早く 新幹線に 乗る ために、駅の 近くで 駅弁を 買いました。",
          reading: "あさ はやく しんかんせんに のる ために、えきの ちかくで えきべんを かいました。",
          tr: { ru: "Чтобы успеть на утренний синкансэн, я купил экибэн рядом со станцией.", en: "To catch the early Shinkansen, I bought a bento box near the station.", ja: "早朝の新幹線に乗るために駅弁を買いました。" },
        },
        {
          target: "窓から 富士山が 見えた ときは、その 大きさに 驚きました。",
          reading: "まどから ふじさんが みえた ときは、その おおきさに おどろきました。",
          tr: { ru: "Когда из окна показалась гора Фудзи, я был поражён её масштабом.", en: "When Mt. Fuji appeared outside the window, I was amazed by its size.", ja: "車窓から富士山が見えて感動しました。" },
        },
        {
          target: "京都で 静かな 寺を 歩く ことで、毎日 集中できる ように なりました。",
          reading: "きょうとで しずかな てらを あるく ことで、まいにち しゅうちゅうできる ように なりました。",
          tr: { ru: "Прогулки по тихим храмам Киото помогли мне научиться сосредотачиваться каждый день.", en: "Walking through calm Kyoto temples helped me focus better each day.", ja: "京都の寺院を歩き、日々集中できるようになりました。" },
        },
      ],
      vocab: [
        { word: "駅弁", reading: "えきべん", meaning: { ru: "вокзальный обед-бенто", en: "station bento box", ja: "駅弁" }, type: "KANJI" },
        { word: "驚く", reading: "おどろく", meaning: { ru: "удивляться, поражаться", en: "to be amazed", ja: "驚く" }, type: "KANJI" },
        { word: "静か", reading: "しずか", meaning: { ru: "тихий, спокойный", en: "quiet / peaceful", ja: "静か" }, type: "KANJI" },
      ],
      questions: [
        {
          question: { ru: "Что автор увидел из окна синкансэна?", en: "What landmark did the author spot from the train window?", ja: "車窓から何が見えましたか？" },
          options: { ru: ["Остров Хоккайдо", "Гору Фудзи", "Башню Скайтри"], en: ["Hokkaido", "Mount Fuji", "Tokyo Skytree"], ja: ["北海道", "富士山", "スカイツリー"] },
          correctIdx: 1,
        },
      ],
    },
  ],
  en: [
    {
      id: "en-read-morning",
      level: "A1",
      emoji: "🌤️",
      title: { ru: "Утро в солнечном Челси", en: "A Sunny Morning in Chelsea", ja: "チェルシーの晴れた朝" },
      subtitle: {
        ru: "Уровень A1: простые привычки, время и повседневные слова",
        en: "A1 starter reading: Present Simple & city basics",
        ja: "A1初級：現在形と朝のルーティン",
      },
      sentences: [
        {
          target: "Hello! My name is Emma and I live in a small flat near the river.",
          tr: { ru: "Привет! Меня зовут Эмма, и я живу в небольшой квартире у реки.", en: "Simple introduction.", ja: "こんにちは！私の名前はエマで、川の近くの小さなアパートに住んでいます。" },
        },
        {
          target: "There is a bakery next to my house and a green park across the street.",
          tr: { ru: "Рядом с моим домом есть пекарня, а через дорогу — зелёный парк.", en: "'There is...' sentence structure.", ja: "家の隣にはパン屋があり、通りの向かいには緑の公園があります。" },
        },
        {
          target: "At eight o'clock, I drink warm tea, read ten new words, and walk to work.",
          tr: { ru: "В восемь часов я пью тёплый чай, читаю десять новых слов и иду пешком на работу.", en: "Daily routine verbs.", ja: "8時に温かい紅茶を飲み、10個の新出単語を読んで仕事へ歩いて行きます。" },
        },
      ],
      vocab: [
        { word: "Morning", reading: "[ˈmɔː.nɪŋ]", meaning: { ru: "утро", en: "early part of the day", ja: "朝" }, type: "VOCABULARY" },
        { word: "Next to", reading: "preposition", meaning: { ru: "рядом с, возле", en: "beside / right beside", ja: "〜の隣に" }, type: "GRAMMAR" },
        { word: "Across the street", reading: "phrase", meaning: { ru: "через дорогу", en: "on the opposite side", ja: "通りの向かいに" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Что находится через дорогу от дома Эммы?", en: "What is across the street from Emma's flat?", ja: "エマの家の通りの向かいには何がありますか？" },
          options: { ru: ["Вокзал", "Зелёный парк", "Кинотеатр"], en: ["A train station", "A green park", "A cinema"], ja: ["駅", "緑の公園", "映画館"] },
          correctIdx: 1,
        },
      ],
    },
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
    {
      id: "en-read-a1-market",
      level: "A1",
      emoji: "🥐",
      title: { ru: "Суббота на рынке Боро", en: "Saturday at Borough Market", ja: "バラ・マーケットの土曜日" },
      subtitle: {
        ru: "Уровень A1: еда, цены, цвета и вежливые покупки",
        en: "A1 city shopping: food, prices & everyday phrases",
        ja: "A1初級：買い物・食べ物・簡単な会話",
      },
      sentences: [
        {
          target: "Every Saturday morning, Oliver visits the food market near London Bridge.",
          tr: { ru: "Каждое субботнее утро Оливер заходит на продуктовый рынок у Лондонского моста.", en: "Present Simple routine.", ja: "毎週土曜の朝、オリバーはロンドン橋近くの市場を訪れます。" },
        },
        {
          target: "There are fresh apples, warm bread, and cups of hot coffee on every table.",
          tr: { ru: "На каждом прилавке — свежие яблоки, тёплый хлеб и чашки горячего кофе.", en: "There is / There are with plurals.", ja: "どのテーブルにも新鮮なリンゴや温かいパン、コーヒーが並んでいます。" },
        },
        {
          target: "He buys two croissants for three pounds and walks by the river.",
          tr: { ru: "Он покупает два круассана за три фунта и гуляет вдоль реки.", en: "Simple prices and verbs.", ja: "彼は3ポンドでクロワッサンを2つ買い、川沿いを歩きます。" },
        },
      ],
      vocab: [
        { word: "Market", reading: "[ˈmɑː.kɪt]", meaning: { ru: "рынок", en: "open-air or hall market", ja: "市場" }, type: "VOCABULARY" },
        { word: "Fresh", reading: "[freʃ]", meaning: { ru: "свежий", en: "newly made or picked", ja: "新鮮な" }, type: "VOCABULARY" },
        { word: "River", reading: "[ˈrɪv.ər]", meaning: { ru: "река", en: "large stream of water", ja: "川" }, type: "VOCABULARY" },
      ],
      questions: [
        {
          question: { ru: "Что покупает Оливер на рынке?", en: "What does Oliver buy at the market?", ja: "オリバーは市場で何を買いますか？" },
          options: { ru: ["Билет в кино", "Два круассана", "Зонтик"], en: ["A train ticket", "Two croissants", "An umbrella"], ja: ["電車の切符", "クロワッサン2つ", "傘"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "en-read-a2-rainy",
      level: "A2",
      emoji: "☔",
      title: { ru: "Музей и дождь в Оксфорде", en: "Rainy Afternoon in Oxford", ja: "オックスフォードの雨の午後" },
      subtitle: {
        ru: "Уровень A2: Past Simple и сравнительные степени",
        en: "A2 narrative: Past Simple & comparisons",
        ja: "A2：過去形と比較級を使った小話",
      },
      sentences: [
        {
          target: "Yesterday afternoon it suddenly started to rain while Kate was exploring the town.",
          tr: { ru: "Вчера днём внезапно пошёл дождь, пока Кейт гуляла по городу.", en: "Past Simple + Past Continuous contrast.", ja: "昨日の午後、ケイトが街を散策していると急に雨が降り始めました。" },
        },
        {
          target: "Luckily, the Ashmolean Museum was closer than the bus station, so she ran inside.",
          tr: { ru: "К счастью, музей Ашмола оказался ближе, чем автовокзал, и она забежала внутрь.", en: "Comparative 'closer than'.", ja: "幸運なことに博物館がバス停より近かったため、彼女は中へ駆け込みました。" },
        },
        {
          target: "She spent two peaceful hours there and found a great bookshop afterwards.",
          tr: { ru: "Она провела там два спокойных часа, а потом нашла отличный книжный магазин.", en: "Irregular verbs: spent, found.", ja: "そこで穏やかな2時間を過ごし、その後素敵な本屋を見つけました。" },
        },
      ],
      vocab: [
        { word: "Luckily", reading: "[ˈlʌk.əl.i]", meaning: { ru: "к счастью", en: "fortunately", ja: "幸運にも" }, type: "VOCABULARY" },
        { word: "Peaceful", reading: "[ˈpiːs.fəl]", meaning: { ru: "спокойный, умиротворяющий", en: "calm and quiet", ja: "穏やかな" }, type: "VOCABULARY" },
        { word: "run inside", reading: "phrasal verb", meaning: { ru: "забежать внутрь", en: "enter quickly", ja: "中に駆け込む" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Почему Кейт зашла в музей Ашмола?", en: "Why did Kate enter the museum?", ja: "なぜケイトは博物館に入りましたか？" },
          options: { ru: ["Она там работала", "Пошёл дождь, и музей был ближе", "Ей нужен был кофе"], en: ["She worked there", "It rained and the museum was closer", "She lost her map"], ja: ["働いていたから", "雨が降り出し博物館が近かったから", "地図を落としたから"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "en-read-b1-habits",
      level: "B1",
      emoji: "📓",
      title: { ru: "Правило двадцати минут в день", en: "The Twenty-Minute Habit", ja: "1日20分の学習習慣" },
      subtitle: {
        ru: "Уровень B1: Present Perfect, used to и мотивация",
        en: "B1 lifestyle article: used to & Present Perfect",
        ja: "B1：習慣化と現在完了・used to",
      },
      sentences: [
        {
          target: "Two years ago, Maya used to cram dozens of random words once a month and quickly forget them.",
          tr: { ru: "Два года назад Майя зубрила десятки случайных слов раз в месяц и быстро их забывала.", en: "'used to' past habit.", ja: "2年前、マヤは月に一度ランダムな単語を詰め込んで、すぐ忘れてしまっていました。" },
        },
        {
          target: "Since she switched to twenty focused minutes each morning, her recall has improved dramatically.",
          tr: { ru: "С тех пор как она перешла на 20 сфокусированных минут по утрам, её память заметно окрепла.", en: "Since + Present Perfect.", ja: "毎朝20分の集中学習に切り替えてから、記憶力が飛躍的に向上しました。" },
        },
        {
          target: "Consistency may sound simple, yet small daily steps turn curiosity into real fluency.",
          tr: { ru: "Регулярность может звучать просто, но маленькие ежедневные шаги превращают интерес в живую речь.", en: "Fluent contrastive linker 'yet'.", ja: "継続は単純に聞こえますが、毎日の小さな一歩が知的好奇心を確かな語学力へと変えてくれます。" },
        },
      ],
      vocab: [
        { word: "Fluency", reading: "[ˈfluː.ən.si]", meaning: { ru: "беглость (речи)", en: "smooth effortless command", ja: "流暢さ" }, type: "VOCABULARY" },
        { word: "Consistency", reading: "[kənˈsɪs.tən.si]", meaning: { ru: "последовательность, регулярность", en: "steady habit over time", ja: "継続性・一貫性" }, type: "VOCABULARY" },
        { word: "switch to", reading: "phrasal verb", meaning: { ru: "переключиться на", en: "change over to a new method", ja: "〜に切り替える" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Что изменило результаты Майи?", en: "What improved Maya's vocabulary retention?", ja: "マヤの記憶力を高めた習慣は何ですか？" },
          options: { ru: ["Зубрёжка раз в месяц", "Ежедневные 20-минутные занятия утром", "Отказ от чтения"], en: ["Monthly cramming", "Twenty focused minutes every morning", "Skipping audio"], ja: ["月1回の詰め込み", "毎朝20分の集中学習", "リスニングをやめたこと"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "en-read-b2-architecture",
      level: "B2",
      emoji: "🏛️",
      title: { ru: "Цифровой минимализм и ясный дизайн", en: "Digital Minimalism & Calm Design", ja: "デジタル・ミニマリズムの設計思想" },
      subtitle: {
        ru: "Уровень B2: абстрактная лексика и инверсия",
        en: "B2 essay: product clarity & advanced phrasing",
        ja: "B2上級：プロダクト設計と抽象語彙",
      },
      sentences: [
        {
          target: "Not only do cluttered interfaces distract learners, but they also drain mental energy within minutes.",
          tr: { ru: "Перегруженные интерфейсы не только отвлекают учащихся, но и за считанные минуты истощают внимание.", en: "Negative inversion with 'Not only do...'.", ja: "雑然としたUIは学習者の気を散らすだけでなく、数分で精神的なエネルギーを消耗させます。" },
        },
        {
          target: "Pragmatic designers prioritize calm typography and clear visual hierarchy over flashy bells and whistles.",
          tr: { ru: "Прагматичные дизайнеры ставят спокойную типографику и ясную иерархию выше кричащих украшений.", en: "B2 idiom 'bells and whistles'.", ja: "実用的なデザイナーは派手な装飾よりも、落ち着いたタイポグラフィと明確な視覚階層を優先します。" },
        },
        {
          target: "In the long run, thoughtful restraint creates software people genuinely look forward to opening.",
          tr: { ru: "В конечном счёте продуманная сдержанность рождает программы, которые действительно хочется открывать.", en: "B2 collocations & phrasal ending.", ja: "長い目で見れば、思慮深い引き算こそが、開くのが楽しみになるソフトウェアを生み出すのです。" },
        },
      ],
      vocab: [
        { word: "Restraint", reading: "[rɪˈstreɪnt]", meaning: { ru: "сдержанность, мера", en: "controlled simplicity", ja: "節制・控えめな美学" }, type: "VOCABULARY" },
        { word: "Hierarchy", reading: "[ˈhaɪə.rɑː.ki]", meaning: { ru: "иерархия", en: "clear ordering of importance", ja: "階層構造" }, type: "VOCABULARY" },
        { word: "bells and whistles", reading: "idiom", meaning: { ru: "лишние навороты и украшения", en: "non-essential extras", ja: "過剰な飾り・おまけ機能" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Что, по мнению эссе, важнее всего в интерфейсе в долгосрочной перспективе?", en: "What creates lasting value in software design?", ja: "長期的に見て良いソフトウェアを生むものは何ですか？" },
          options: { ru: ["Максимум мигающих эффектов", "Спокойная типографика и продуманная сдержанность", "Отказ от структуры"], en: ["Flashy bells and whistles", "Calm hierarchy & thoughtful restraint", "Removing contrast"], ja: ["派手な演出", "明確な階層と思慮深いシンプルさ", "構造の廃止"] },
          correctIdx: 1,
        },
      ],
    },
  ],
  de: [
    {
      id: "de-read-berlin",
      level: "A1",
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
      level: "A2",
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
    {
      id: "de-read-bauhaus",
      level: "B2",
      emoji: "📐",
      title: { ru: "Наследие Баухауса: форма следует за смыслом", en: "The Bauhaus Legacy in Germany", ja: "バウハウスの美学と建築" },
      subtitle: {
        ru: "Уровень B2: пассивный залог, дизайн и история культуры",
        en: "B2 cultural essay: Passive Voice & design philosophy",
        ja: "B2上級：受動態とデザインの思想",
      },
      sentences: [
        {
          target: "Im Jahr 1919 wurde das berühmte Bauhaus von Walter Gropius in Weimar gegründet.",
          tr: { ru: "В 1919 году знаменитая школа Баухаус была основана Вальтером Гропиусом в Веймаре.", en: "Historical Passive with 'wurde'.", ja: "1919年、有名なバウハウスはヴァルター・グロピウスによってヴァイマルに設立されました。" },
        },
        {
          target: "Bis heute wird die schlichte Klarheit dieser Architektur weltweit bewundert und weiterentwickelt.",
          tr: { ru: "По сей день лаконичная ясность этой архитектуры вызывает восхищение и развивается по всему миру.", en: "Present passive + compound verb.", ja: "今日に至るまで、この建築の洗練された明快さは世界中で称賛され続けています。" },
        },
        {
          target: "Wenn wir moderne Räume betrachten, würden wir viele Ideen ohne diese Bewegung kaum wiedererkennen.",
          tr: { ru: "Глядя на современные интерьеры, без этого движения мы бы едва узнали многие привычные идеи.", en: "Konjunktiv II conditional reflection.", ja: "現代の空間を見るとき、この運動がなければ多くのアイデアは思い浮かばなかったでしょう。" },
        },
      ],
      vocab: [
        { word: "die Entscheidung", reading: "die Entscheidungen", meaning: { ru: "решение, выбор", en: "decision", ja: "決定" }, type: "VOCABULARY" },
        { word: "die Klarheit", reading: "[ˈklaːɐ̯haɪ̯t]", meaning: { ru: "ясность, чистота форм", en: "clarity / crispness", ja: "明快さ" }, type: "VOCABULARY" },
        { word: "betrachten", meaning: { ru: "рассматривать, наблюдать", en: "to observe / contemplate", ja: "観察する・見渡す" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Где и кем был основан Баухаус в 1919 году?", en: "Where was the Bauhaus founded in 1919?", ja: "バウハウスは1919年にどこで設立されましたか？" },
          options: { ru: ["В Мюнхене", "В Веймаре Вальтером Гропиусом", "В Гамбурге"], en: ["In Munich", "In Weimar by Walter Gropius", "In Hamburg"], ja: ["ミュンヘン", "ヴァイマル（グロピウスによる）", "ハンブルク"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "de-read-a1-bibliothek",
      level: "A1",
      emoji: "📖",
      title: { ru: "Воскресенье в мюнхенском парке", en: "Sunday in the English Garden", ja: "ミュンヘン公園の日曜日" },
      subtitle: {
        ru: "Уровень A1: простые существительные, артикли и Präsens",
        en: "A1 beginner story: articles & present tense",
        ja: "A1初級：基本名詞・定冠詞・現在形",
      },
      sentences: [
        {
          target: "Heute ist Sonntag und das Wetter in München ist sonnig und warm.",
          tr: { ru: "Сегодня воскресенье, и погода в Мюнхене солнечная и тёплая.", en: "Present tense with sein & weather.", ja: "今日は日曜日で、ミュンヘンの天気は晴れて暖かいです。" },
        },
        {
          target: "Hanna sitzt unter einem großen Baum und liest ein deutsches Buch.",
          tr: { ru: "Ханна сидит под большим деревом и читает немецкую книгу.", en: "Indefinite Dative & Accusative articles.", ja: "ハンナは大きな木の下に座ってドイツ語の本を読んでいます。" },
        },
        {
          target: "Danach trinkt sie einen kalten Apfelsaft und spricht mit Freunden.",
          tr: { ru: "После этого она пьёт холодный яблочный сок и болтает с друзьями.", en: "Masculine Accusative 'einen'.", ja: "その後、冷たいりんごジュースを飲み、友人たちと話します。" },
        },
      ],
      vocab: [
        { word: "der Baum", reading: "die Bäume", meaning: { ru: "дерево", en: "tree", ja: "木" }, type: "VOCABULARY" },
        { word: "sonnig", reading: "[ˈzɔnɪç]", meaning: { ru: "солнечный", en: "sunny", ja: "晴れた" }, type: "VOCABULARY" },
        { word: "danach", reading: "[daˈnaːx]", meaning: { ru: "после этого, затем", en: "afterwards", ja: "その後" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Что делает Ханна под деревом?", en: "What is Hanna doing under the tree?", ja: "ハンナは木の下で何をしていますか？" },
          options: { ru: ["Спит", "Читает немецкую книгу", "Готовит кофе"], en: ["Sleeping", "Reading a German book", "Playing chess"], ja: ["寝ている", "ドイツ語の本を読んでいる", "チェスをしている"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "de-read-a2-zug",
      level: "A2",
      emoji: "🚆",
      title: { ru: "Поездка на поезде из Гамбурга в Бремен", en: "A Day Trip to Bremen", ja: "ハンブルクからブレーメンへの日帰り旅" },
      subtitle: {
        ru: "Уровень A2: отделяемые приставки и модальные глаголы",
        en: "A2 travel narrative: modal verbs & separable verbs",
        ja: "A2：電車旅行・分離動詞・助動詞",
      },
      sentences: [
        {
          target: "Am Samstagmorgen steht Jonas um sieben Uhr auf und packt seinen Rucksack.",
          tr: { ru: "В субботу утром Йонас встаёт в семь часов и собирает рюкзак.", en: "Separable verb 'aufstehen'.", ja: "土曜の朝、ヨナスは7時に起きてリュックを詰めます。" },
        },
        {
          target: "Am Hauptbahnhof muss er sich beeilen, weil sein Regionalzug pünktlich abfährt.",
          tr: { ru: "На центральном вокзале ему приходится поторопиться, потому что поезд уходит точно по расписанию.", en: "'müssen' + 'weil' subordinate clause.", ja: "中央駅では電車が定刻に出発するため急がなければなりません。" },
        },
        {
          target: "Nachmittags entdeckt er die alte Altstadt und kauft ein kleines Souvenir ein.",
          tr: { ru: "Днём он исследует старый центр и покупает небольшой сувенир.", en: "Separable 'einkaufen'.", ja: "午後には旧市街を散策し、小さなお土産を買います。" },
        },
      ],
      vocab: [
        { word: "der Rucksack", reading: "die Rucksäcke", meaning: { ru: "рюкзак", en: "backpack", ja: "リュックサック" }, type: "VOCABULARY" },
        { word: "pünktlich", reading: "[ˈpʏŋktlɪç]", meaning: { ru: "пунктуальный / точно вовремя", en: "punctual / on time", ja: "時間通りの" }, type: "VOCABULARY" },
        { word: "sich beeilen", reading: "reflexiv", meaning: { ru: "торопиться", en: "to hurry", ja: "急ぐ" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Почему Йонас спешит на центральном вокзале?", en: "Why does Jonas hurry at the central station?", ja: "なぜヨナスは中央駅で急いでいますか？" },
          options: { ru: ["Он потерял билет", "Поезд отправляется точно по расписанию", "Идёт сильный снег"], en: ["He lost his ticket", "His train leaves on time", "The café is closing"], ja: ["切符をなくしたから", "電車が定刻通り出発するから", "大雪が降っているから"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "de-read-b1-sprint",
      level: "B1",
      emoji: "💻",
      title: { ru: "Как работает коворкинг в Берлине", en: "Coworking Culture in Berlin", ja: "ベルリンのコワーキング文化" },
      subtitle: {
        ru: "Уровень B1: относительные придаточные и профессиональная лексика",
        en: "B1 workplace story: Relativsätze & Präteritum",
        ja: "B1：関係代名詞と現代の働き方",
      },
      sentences: [
        {
          target: "Letztes Jahr arbeitete Leon in einem hellen Coworking-Space, der ganz in der Nähe vom Kanal lag.",
          tr: { ru: "В прошлом году Леон работал в светлом коворкинге, который находился совсем рядом с каналом.", en: "Präteritum + masculine relative clause 'der'.", ja: "昨年レオンは、運河のすぐ近くにある明るいコワーキングスペースで働いていました。" },
        },
        {
          target: "Obwohl dort viele Teams aus verschiedenen Ländern zusammenkamen, blieb die Atmosphäre ruhig.",
          tr: { ru: "Хотя там собиралось много команд из разных стран, атмосфера оставалась спокойной.", en: "Concessive 'obwohl'.", ja: "多国籍のチームが集まっていましたが、雰囲気は落ち着いていました。" },
        },
        {
          target: "Die Gespräche beim Mittagessen waren eine große Inspiration für seine eigenen Software-Ideen.",
          tr: { ru: "Разговоры за обедом стали большим источником вдохновения для его собственных IT-идей.", en: "Plural Präteritum 'waren'.", ja: "ランチタイムの会話は彼自身のソフトウェアのアイデアへの大きな刺激になりました。" },
        },
      ],
      vocab: [
        { word: "die Inspiration", reading: "die Inspirationen", meaning: { ru: "вдохновение", en: "inspiration", ja: "インスピレーション" }, type: "VOCABULARY" },
        { word: "verschieden", reading: "[fɛɐ̯ˈʃiːdn̩]", meaning: { ru: "различный, разный", en: "different / diverse", ja: "様々な" }, type: "VOCABULARY" },
        { word: "zusammenkommen", reading: "trennbar", meaning: { ru: "собираться вместе", en: "to gather together", ja: "集まる" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Какой была атмосфера в коворкинге Леона?", en: "What was the coworking atmosphere like?", ja: "コワーキングスペースの雰囲気はどうでしたか？" },
          options: { ru: ["Шумной и хаотичной", "Спокойной и вдохновляющей", "Пустой и скучной"], en: ["Loud and chaotic", "Calm and inspiring", "Cold and empty"], ja: ["騒がしく混沌としていた", "落ち着いていて刺激的だった", "誰もおらず退屈だった"] },
          correctIdx: 1,
        },
      ],
    },
    {
      id: "de-read-b2-energie",
      level: "B2",
      emoji: "⚡",
      title: { ru: "Будущее открытого ПО и цифрового образования", en: "Open Knowledge & Lifelong Learning", ja: "オープンソースと生涯学習の未来" },
      subtitle: {
        ru: "Уровень B2: je ... desto и Nomen-Verb-Verbindungen",
        en: "B2 essay: correlative structures & fluent style",
        ja: "B2上級：比例構文と抽象的な議論",
      },
      sentences: [
        {
          target: "Je offener Software und Lernmaterialien geteilt werden, desto schneller wächst globales Wissen.",
          tr: { ru: "Чем свободнее распространяются открытый код и учебные материалы, тем быстрее растёт мировое знание.", en: "je ..., desto ... + passive present.", ja: "ソフトウェアや教材がオープンに共有されるほど、世界の知識は急速に成長します。" },
        },
        {
          target: "Dennoch müssen Entwickler großen Wert auf Verständlichkeit und klare Dokumentation legen.",
          tr: { ru: "Тем не менее разработчикам необходимо придавать большое значение понятности и чёткой документации.", en: "Nomen-Verb: Wert legen auf.", ja: "それでも開発者は分かりやすさと明確なドキュメントを重視しなければなりません。" },
        },
        {
          target: "Nur wer Feedback ernsthaft in Betracht zieht, kann Werkzeuge schaffen, die lange Bestand haben.",
          tr: { ru: "Лишь тот, кто всерьёз принимает во внимание обратную связь, способен создать инструменты на долгие годы.", en: "'in Betracht ziehen' + relative clause.", ja: "フィードバックを真剣に考慮に入れる者だけが、長く使われるツールを作れるのです。" },
        },
      ],
      vocab: [
        { word: "die Verständlichkeit", reading: "unzählbar", meaning: { ru: "понятность, доходчивость", en: "clarity / comprehensibility", ja: "分かりやすさ" }, type: "VOCABULARY" },
        { word: "der Bestand", reading: "[bəˈʃtant]", meaning: { ru: "устойчивость, долговечность", en: "durability / permanence", ja: "持続性" }, type: "VOCABULARY" },
        { word: "Wert legen auf", reading: "Akkusativ", meaning: { ru: "придавать значение чему-либо", en: "to attach value to", ja: "〜を重視する" }, type: "GRAMMAR" },
      ],
      questions: [
        {
          question: { ru: "Что необходимо для создания долговечных инструментов согласно тексту?", en: "What is essential to build lasting tools?", ja: "長く続くツールを作るために不可欠なのは何ですか？" },
          options: { ru: ["Скрывать документацию", "Серьёзно учитывать обратную связь", "Не обновлять код"], en: ["Hiding docs", "Taking feedback seriously into account", "Ignoring clarity"], ja: ["文書を隠すこと", "フィードバックを真剣に考慮すること", "明快さを無視すること"] },
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
      scene: { ru: "N5: вежливый заказ напитков", en: "N5: Polite ordering basics", ja: "N5：丁寧な注文フレーズ" },
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
      scene: { ru: "N4: ориентирование на вокзале", en: "N4: Asking for directions politely", ja: "N4：駅構内での質問" },
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
    {
      id: "ja-dlg-weekend",
      level: "N3",
      emoji: "🏮",
      title: { ru: "Планы на выходные и онсэн", en: "Weekend Onsen Plans", ja: "週末と温泉の計画" },
      scene: { ru: "N3: естественный разговор друзей с 〜たら", en: "N3: Natural friend chat with 〜たら", ja: "N3：自然な友人会話（〜たら）" },
      lines: [
        {
          speaker: "美咲",
          text: "今週の 金曜日、仕事が 終わったら 何を する 予定ですか？",
          reading: "こんしゅうの きんようび、しごとが おわったら なにを する よていですか？",
          tr: { ru: "Что планируешь делать в эту пятницу, как только закончится работа?", en: "What are your plans once work finishes this Friday?", ja: "金曜日の退勤後の予定を聞いています。" },
        },
        {
          speaker: "健太",
          text: "天気が よかったら、箱根の 温泉へ 行こうと 思っています。",
          reading: "てんきが よかったら、はこねの おんせんへ いこうと おもっています。",
          tr: { ru: "Если погода будет хорошей, думаю съездить на горячие источники в Хаконэ.", en: "If the weather is nice, I'm thinking of heading to Hakone hot springs.", ja: "天候が良ければ箱根の温泉に行くつもりです。" },
        },
        {
          speaker: "美咲",
          text: "いいですね！ ゆっくり 休んで きて くださいね。",
          reading: "いいですね！ ゆっくり やすんで きて くださいね。",
          tr: { ru: "Здорово! Хорошенько отдохни там.", en: "Sounds wonderful! Enjoy a relaxing rest there.", ja: "ゆっくり休むよう声をかけています。" },
        },
      ],
    },
    {
      id: "ja-dlg-shop-n5",
      level: "N5",
      emoji: "🛍️",
      title: { ru: "Покупка сувениров в Асакусе", en: "Shopping in Asakusa", ja: "浅草でのお買い物" },
      scene: { ru: "N5: цены, указательные слова これ/それ и вежливая просьба", en: "N5: Asking prices & choosing items", ja: "N5：値段の質問と丁寧な買い物" },
      lines: [
        {
          speaker: "店員",
          text: "いらっしゃいませ！ 何か お探しですか？",
          reading: "いらっしゃいませ！ なにか おさがしですか？",
          tr: { ru: "Добро пожаловать! Вы что-то ищете?", en: "Welcome! Are you looking for anything specific?", ja: "店員さんの挨拶です。" },
        },
        {
          speaker: "客",
          text: "すみません、この 緑の お茶は いくらですか？",
          reading: "すみません、この みどりの おちゃは いくらですか？",
          tr: { ru: "Извините, сколько стоит вот этот зелёный чай?", en: "Excuse me, how much is this green tea?", ja: "お茶の値段を聞いています。" },
        },
        {
          speaker: "店員",
          text: "それは 千二百円です。 とても 人気が ありますよ。",
          reading: "それは せんにひゃくえんです。 とても にんきが ありますよ。",
          tr: { ru: "Он стоит 1200 иен. Очень популярный сорт!", en: "That one is 1,200 yen. It's very popular!", ja: "値段と人気を案内しています。" },
        },
        {
          speaker: "客",
          text: "じゃあ、これを 二つ お願いします。",
          reading: "じゃあ、これを ふたつ おねがいします。",
          tr: { ru: "Тогда дайте, пожалуйста, две штуки.", en: "Then two of these, please.", ja: "2つ購入する注文です。" },
        },
      ],
    },
    {
      id: "ja-dlg-hotel-n4",
      level: "N4",
      emoji: "🏨",
      title: { ru: "Бронь и заселение в отель", en: "Hotel Check-in Request", ja: "ホテルでのチェックイン" },
      scene: { ru: "N4: 〜てもいいですか, просьбы 〜てください", en: "N4: Asking permission & polite hotel requests", ja: "N4：許可と丁寧な依頼" },
      lines: [
        {
          speaker: "フロント",
          text: "こんにちは。 お名前を 教えて いただけますか？",
          reading: "こんにちは。 おなまえを おしえて いただけますか？",
          tr: { ru: "Здравствуйте! Подскажите, пожалуйста, ваше имя?", en: "Hello. Could you tell me your name?", ja: "受付での名前確認です。" },
        },
        {
          speaker: "客",
          text: "佐藤と 申します。 先週 インターネットで 予約しました。",
          reading: "さとうと もうします。 せんしゅう インターネットで よやくしました。",
          tr: { ru: "Меня зовут Сато. На прошлой неделе я бронировал через интернет.", en: "My name is Sato. I booked online last week.", ja: "予約済みであることを伝えます。" },
        },
        {
          speaker: "フロント",
          text: "確認できました。 こちらが 鍵です。 朝食は 朝 七時から 九時までです。",
          reading: "かくにんできました。 こちらが かぎです。 ちょうしょくは あさ しちじから くじまでです。",
          tr: { ru: "Подтверждено! Вот ваш ключ. Завтрак с семи до девяти утра.", en: "Confirmed! Here is your key. Breakfast is from 7 to 9 AM.", ja: "鍵と朝食時間の案内です。" },
        },
        {
          speaker: "客",
          text: "ありがとう ございます。 ロビーで Wi-Fiを 使っても いいですか？",
          reading: "ありがとう ございます。 ロビーで ワイファイを つかっても いいですか？",
          tr: { ru: "Спасибо! Можно пользоваться Wi-Fi в лобби?", en: "Thank you. May I use Wi-Fi in the lobby?", ja: "Wi-Fi利用の許可を確認しています。" },
        },
      ],
    },
    {
      id: "ja-dlg-study-n3",
      level: "N3",
      emoji: "🗣️",
      title: { ru: "Как заговорить увереннее на японском", en: "Talking About Study Progress", ja: "日本語の上達と学習法" },
      scene: { ru: "N3: 〜ようになる, 〜てみる, естественное согласие", en: "N3: Progress reflection & trying new methods", ja: "N3：〜ようになる・〜てみるを使った会話" },
      lines: [
        {
          speaker: "翔太",
          text: "最近 日本語で 話すのが とても 上手に なりましたね！",
          reading: "さいきん にほんごで はなすのが とても じょうずに なりましたね！",
          tr: { ru: "В последнее время ты стал гораздо лучше говорить по-японски!", en: "Your Japanese speaking has gotten really good lately!", ja: "上達を褒めています。" },
        },
        {
          speaker: "ゆい",
          text: "ありがとう！ 毎朝 短い ニュースを 聞いて みる ことに したんです。",
          reading: "ありがとう！ まいあさ みじかい ニュースを きいて みる ことに したんです。",
          tr: { ru: "Спасибо! Я решила пробовать слушать короткие новости каждое утро.", en: "Thanks! I decided to try listening to short news clips every morning.", ja: "毎朝の試み（〜てみる）を説明しています。" },
        },
        {
          speaker: "翔太",
          text: "なるほど、私も 今日から やって みます！",
          reading: "なるほど、わたしも きょうから やって みます！",
          tr: { ru: "Вот как! Я тоже попробую начать с сегодняшнего дня!", en: "I see! I'll give that a try starting today too!", ja: "納得して自分も試そうとしています。" },
        },
      ],
    },
  ],
  en: [
    {
      id: "en-dlg-station-a1",
      level: "A1",
      emoji: "🚇",
      title: { ru: "Билет на лондонском вокзале", en: "At Victoria Station", ja: "ヴィクトリア駅での会話" },
      scene: { ru: "A1: простые вопросы и время", en: "A1: Simple questions & tickets", ja: "A1：切符と時間の基本表現" },
      lines: [
        {
          speaker: "Traveller",
          text: "Excuse me, is there a train to Oxford right now?",
          tr: { ru: "Извините, сейчас есть поезд до Оксфорда?", en: "Simple polite station question.", ja: "すみません、今オックスフォード行きの電車はありますか？" },
        },
        {
          speaker: "Staff",
          text: "Yes! The next train leaves at ten past two from platform four.",
          tr: { ru: "Да! Следующий поезд отправляется в 14:10 с четвёртой платформы.", en: "Platform & clear time.", ja: "はい！次の電車は2時10分に4番ホームから出発します。" },
        },
        {
          speaker: "Traveller",
          text: "Thank you very much! Have a lovely day.",
          tr: { ru: "Большое спасибо! Хорошего дня!", en: "Warm polite closing.", ja: "どうもありがとうございます！良い一日を！" },
        },
      ],
    },
    {
      id: "en-dlg-soho",
      level: "A2",
      emoji: "☕",
      title: { ru: "Заказ кофе в лондонском Сохо", en: "Ordering Coffee in Soho", ja: "ソーホーのカフェでの会話" },
      scene: { ru: "A2: естественный британский диалог", en: "A2: Natural British café small talk", ja: "A2：自然な英国カフェ会話" },
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
      scene: { ru: "B1: смол-ток и Present Perfect", en: "B1: Networking & Present Perfect", ja: "B1：自己紹介と現在完了" },
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
    {
      id: "en-dlg-review-b2",
      level: "B2",
      emoji: "🚀",
      title: { ru: "Обсуждение стратегии продукта", en: "Product Design Discussion", ja: "プロダクト戦略の議論" },
      scene: { ru: "B2: аргументация, идиомы и предложения", en: "B2: Nuanced feedback & phrasal verbs", ja: "B2：意見交換と句動詞" },
      lines: [
        {
          speaker: "Sophie",
          text: "We need to take user feedback into account before launching the redesign.",
          tr: { ru: "Нам нужно учесть отзывы пользователей до запуска редизайна.", en: "Using 'take into account'.", ja: "リデザイン公開前にユーザーの声を考慮に入れる必要があります。" },
        },
        {
          speaker: "Liam",
          text: "Agreed. Even though deadlines feel tight, rushing quality never works in the long run.",
          tr: { ru: "Согласен. Хотя сроки поджимают, спешка в ущерб качеству в перспективе не работает.", en: "Nuanced reasoning + 'in the long run'.", ja: "賛成です。締切が厳しくても品質を急ぐのは長い目で見ると逆効果です。" },
        },
      ],
    },
    {
      id: "en-dlg-weather-a1",
      level: "A1",
      emoji: "🌤️",
      title: { ru: "Планы на утро и погода", en: "Morning Weather & Plans", ja: "朝の天気と予定" },
      scene: { ru: "A1: приветствия, погода и can", en: "A1: Everyday greeting & weekend plans", ja: "A1：簡単な挨拶と天気の会話" },
      lines: [
        {
          speaker: "Emma",
          text: "Good morning, Sam! Look outside — the sun is shining today.",
          tr: { ru: "Доброе утро, Сэм! Посмотри в окно — сегодня светит солнце.", en: "Friendly greeting & weather comment.", ja: "おはよう、サム！外を見て、今日は太陽が出ていますよ。" },
        },
        {
          speaker: "Sam",
          text: "Lovely! Can we walk to the park after breakfast?",
          tr: { ru: "Прекрасно! Можем прогуляться в парк после завтрака?", en: "Polite 'Can we...' plan.", ja: "素敵だね！朝食のあと公園まで歩けますか？" },
        },
        {
          speaker: "Emma",
          text: "Yes, of course! Meet me downstairs at ten o'clock.",
          tr: { ru: "Да, конечно! Встретимся внизу в десять утра.", en: "Clear time preposition 'at'.", ja: "ええ、もちろん！10時に下の階で会いましょう。" },
        },
      ],
    },
    {
      id: "en-dlg-directions-a2",
      level: "A2",
      emoji: "🗺️",
      title: { ru: "Дорога к книжному магазину", en: "Finding a Bookshop in Camden", ja: "本屋さんへの道案内" },
      scene: { ru: "A2: ориентиры в городе и Past Simple", en: "A2: Asking directions smoothly", ja: "A2：街中での道案内" },
      lines: [
        {
          speaker: "Visitor",
          text: "Excuse me, I'm trying to figure out where the vintage bookshop is.",
          tr: { ru: "Извините, пытаюсь понять, где находится винтажный книжный магазин.", en: "Phrasal verb 'figure out'.", ja: "すみません、ビンテージ書店がどこにあるか探しているのですが。" },
        },
        {
          speaker: "Local",
          text: "Walk past the bridge, turn left on Canal Street, and you'll spot a blue door.",
          tr: { ru: "Пройдите мимо моста, поверните налево на Канал-стрит и увидите синюю дверь.", en: "Step-by-step street directions.", ja: "橋を過ぎてキャナル通りを左に曲がると青いドアが見えますよ。" },
        },
        {
          speaker: "Visitor",
          text: "Brilliant, thank you so much! Have you ever checked out their upstairs room?",
          tr: { ru: "Здорово, большое спасибо! А вы бывали на их втором этаже?", en: "Present Perfect 'Have you ever...'.", ja: "素晴らしい、ありがとうございます！上の階は見たことがありますか？" },
        },
      ],
    },
    {
      id: "en-dlg-podcast-b1",
      level: "B1",
      emoji: "🎙️",
      title: { ru: "Обсуждение подкаста и привычек", en: "Sharing Learning Habits", ja: "ポッドキャストと学習のコツ" },
      scene: { ru: "B1: фразовые глаголы и привычки", en: "B1: Fluent exchange on study routines", ja: "B1：習慣についての自然な会話" },
      lines: [
        {
          speaker: "Hannah",
          text: "I used to put off listening practice because native speakers talked so fast.",
          tr: { ru: "Раньше я откладывала аудирование, потому что носители говорили слишком быстро.", en: "used to + put off.", ja: "以前はネイティブが速すぎてリスニング練習を先延ばしにしていました。" },
        },
        {
          speaker: "Tom",
          text: "Same here! What helped you finally get over that barrier?",
          tr: { ru: "У меня так же было! Что помогло тебе наконец преодолеть этот барьер?", en: "Natural agreement + 'get over'.", ja: "僕も同じでした！どうやってその壁を乗り越えたんですか？" },
        },
        {
          speaker: "Hannah",
          text: "I started shadowing five-minute dialogues every morning until my ear got used to it.",
          tr: { ru: "Я начала повторять вслух короткие 5-минутные диалоги каждое утро, пока слух не привык.", en: "get used to + phrasing.", ja: "毎朝5分の短い会話をシャドーイングして耳を慣らしたんです。" },
        },
      ],
    },
    {
      id: "en-dlg-architect-b2",
      level: "B2",
      emoji: "🏗️",
      title: { ru: "Ретроспектива релиза и компромиссы", en: "Release Retrospective & Trade-offs", ja: "リリースの振り返りと技術的判断" },
      scene: { ru: "B2: условные фразы, идиомы и дипломатия", en: "B2: Workplace nuance & Third Conditional", ja: "B2：仮定法過去完了と技術会議" },
      lines: [
        {
          speaker: "Nora",
          text: "If we had shipped without lazy loading, mobile startup would have felt sluggish.",
          tr: { ru: "Если бы мы выкатили релиз без ленивой подгрузки, запуск на телефоне ощущался бы медленным.", en: "Third conditional in engineering.", ja: "遅延読み込みなしでリリースしていたら、モバイルの起動が重くなっていたでしょう。" },
        },
        {
          speaker: "David",
          text: "True. As a rule of thumb, splitting heavy bundles early saves headaches later.",
          tr: { ru: "Верно. По золотому правилу, разделение тяжёлых бандлов заранее экономит массу сил позже.", en: "B2 idiom 'rule of thumb'.", ja: "その通りですね。経験則として重いバンドルの分割を早めに行うと後が楽になります。" },
        },
        {
          speaker: "Nora",
          text: "Exactly — and we stayed pragmatic without cutting corners on reliability.",
          tr: { ru: "Именно — мы остались прагматичными и не сэкономили на надёжности.", en: "'pragmatic' + 'cut corners'.", ja: "まさにその通り、信頼性を妥協せずに現実的な解決ができました。" },
        },
      ],
    },
  ],
  de: [
    {
      id: "de-dlg-bakery",
      level: "A1",
      emoji: "🥨",
      title: { ru: "Утром в берлинской булочной", en: "At a Berlin Bakery", ja: "ベルリンのパン屋さんで" },
      scene: { ru: "A1: вежливый заказ и числа", en: "A1: Ordering gently at the bakery", ja: "A1：パン屋さんでの丁寧な注文" },
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
      level: "A2",
      emoji: "🚅",
      title: { ru: "Билет на вокзале Hauptbahnhof", en: "At Berlin Hauptbahnhof", ja: "ベルリン中央駅で切符を買う" },
      scene: { ru: "A2: поезда, платформы и отделяемые глаголы", en: "A2: Train travel & platforms (Gleis)", ja: "A2：電車の時間とホーム" },
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
    {
      id: "de-dlg-plans-b1",
      level: "B1",
      emoji: "🌲",
      title: { ru: "Планы на выходные с weil", en: "Weekend Plans Dialogue", ja: "週末の計画についての会話" },
      scene: { ru: "B1: аргументы с союзами weil / obwohl", en: "B1: Explaining reasons with weil", ja: "B1：weilを使った理由の説明" },
      lines: [
        {
          speaker: "Nina",
          text: "Fährst du am Wochenende an den See, weil das Wetter so sonnig wird?",
          tr: { ru: "Ты поедешь на выходных на озеро, раз погода обещает быть такой солнечной?", en: "'weil' pushes 'wird' to the end.", ja: "天気が晴れるので週末は湖に行きますか？" },
        },
        {
          speaker: "Tobias",
          text: "Ja, bestimmt! Ich nehme mein Fahrrad mit, damit wir durch den Wald fahren können.",
          tr: { ru: "Да, точно! Я возьму велосипед, чтобы мы смогли прокатиться через лес.", en: "Natural planning dialogue.", ja: "ええ！森をサイクリングできるように自転車を持っていきます。" },
        },
      ],
    },
    {
      id: "de-dlg-office-b2",
      level: "B2",
      emoji: "💼",
      title: { ru: "Обсуждение на совещании (Konjunktiv II)", en: "Project Workshop Discussion", ja: "会議での丁寧な提案" },
      scene: { ru: "B2: вежливые предложения с könnten / würden", en: "B2: Diplomatic feedback with Konjunktiv II", ja: "B2：接続法II式を使ったビジネス会話" },
      lines: [
        {
          speaker: "Frau Weber",
          text: "Könnten wir den Zeitplan bitte noch einmal gemeinsam durchgehen?",
          tr: { ru: "Не могли бы мы, пожалуйста, ещё раз вместе пройтись по графику?", en: "Polite diplomatic question.", ja: "スケジュールをもう一度一緒に確認していただけますか？" },
        },
        {
          speaker: "Herr Klein",
          text: "Selbstverständlich. Ich würde vorschlagen, dass wir zuerst die wichtigsten Ziele festlegen.",
          tr: { ru: "Конечно. Я бы предложил сперва определить самые важные цели.", en: "Konjunktiv II 'würde vorschlagen'.", ja: "もちろんです。まず最重要目標を定めることを提案します。" },
        },
      ],
    },
    {
      id: "de-dlg-intro-a1",
      level: "A1",
      emoji: "👋",
      title: { ru: "Первое знакомство на языковом курсе", en: "First Day at German Class", ja: "ドイツ語コースでの自己紹介" },
      scene: { ru: "A1: имя, город, sein и fragen", en: "A1: Introductions with sein & W-Fragen", ja: "A1：名前・出身・基本動詞" },
      lines: [
        {
          speaker: "Mia",
          text: "Hallo! Ich heiße Mia. Wie heißt du und woher kommst du?",
          tr: { ru: "Привет! Меня зовут Миа. Как тебя зовут и откуда ты?", en: "Friendly beginner introduction.", ja: "こんにちは！ミアと言います。お名前と出身はどちらですか？" },
        },
        {
          speaker: "Lukas",
          text: "Ich bin Lukas. Ich komme aus München und wohne jetzt in Berlin.",
          tr: { ru: "Я Лукас. Я из Мюнхена, а сейчас живу в Берлине.", en: "Simple 'sein' + 'wohnen'.", ja: "ルカスです。ミュンヘン出身で、今はベルリンに住んでいます。" },
        },
        {
          speaker: "Mia",
          text: "Super! Hast du heute Nachmittag Lust auf einen Kaffee?",
          tr: { ru: "Супер! Не хочешь сегодня днём выпить кофе?", en: "Casual 'Lust auf...' invitation.", ja: "いいね！今日の午後コーヒーでもどう？" },
        },
      ],
    },
    {
      id: "de-dlg-apotheke-a2",
      level: "A2",
      emoji: "🚉",
      title: { ru: "Пересадка на центральном вокзале", en: "Changing Trains in Frankfurt", ja: "フランクフルト中央駅での乗り換え" },
      scene: { ru: "A2: модальные глаголы и предлоги места", en: "A2: Transit help with müssen & Wo/Wohin", ja: "A2：乗り換え案内と助動詞" },
      lines: [
        {
          speaker: "Reisender",
          text: "Entschuldigung, muss ich am Hauptbahnhof in die Linie U2 umsteigen?",
          tr: { ru: "Извините, мне нужно на центральном вокзале пересесть на линию U2?", en: "müssen + separable verb umsteigen.", ja: "すみません、中央駅でU2路線に乗り換える必要がありますか？" },
        },
        {
          speaker: "Mitarbeiterin",
          text: "Ja, genau. Gehen Sie zuerst nach links in den Tunnel. Der Zug fährt auf Gleis vier ab.",
          tr: { ru: "Да, верно. Сперва пройдите налево в переход. Поезд отправляется с четвёртого пути.", en: "Wohin (in den) vs Wo (auf Gleis).", ja: "ええ、そうです。まず左の通路へ進んでください。電車は4番線から発車します。" },
        },
        {
          speaker: "Reisender",
          text: "Vielen Dank für Ihre freundliche Hilfe!",
          tr: { ru: "Большое спасибо за вашу любезную помощь!", en: "Polite appreciation.", ja: "ご親切な案内ありがとうございます！" },
        },
      ],
    },
    {
      id: "de-dlg-buch-b1",
      level: "B1",
      emoji: "📚",
      title: { ru: "Совет хорошей книги и фильма", en: "Recommending a Great Book", ja: "おすすめの本の紹介" },
      scene: { ru: "B1: относительные придаточные и мнение", en: "B1: Relativsätze & expressing opinions", ja: "B1：関係代名詞と感想の伝え方" },
      lines: [
        {
          speaker: "Anna",
          text: "Kennst du einen deutschen Roman, der leicht zu lesen und gleichzeitig spannend ist?",
          tr: { ru: "Ты знаешь немецкий роман, который легко читать и который при этом захватывающий?", en: "Masculine relative clause 'der'.", ja: "読みやすくて同時にワクワクするようなドイツ語の小説を知っていますか？" },
        },
        {
          speaker: "Paul",
          text: "Ja, ich habe letzte Woche ein Buch gelesen, das in Hamburg spielt. Es war fantastisch!",
          tr: { ru: "Да, на прошлой неделе я прочитал книгу, действие которой происходит в Гамбурге. Было здорово!", en: "Perfekt + neuter relative pronoun 'das'.", ja: "うん、先週ハンブルクが舞台の本を読んだよ。とても素晴らしかった！" },
        },
        {
          speaker: "Anna",
          text: "Klingt großartig! Könntest du mir den Titel später schicken?",
          tr: { ru: "Звучит потрясающе! Можешь прислать мне название чуть позже?", en: "Polite request.", ja: "素敵だね！あとでタイトルを送ってもらえる？" },
        },
      ],
    },
    {
      id: "de-dlg-architektur-b2",
      level: "B2",
      emoji: "🧩",
      title: { ru: "Интервью о продуктивном обучении", en: "Deep Learning Method Interview", ja: "効果的な学習法についての対談" },
      scene: { ru: "B2: je ... desto и Nomen-Verb-Verbindungen", en: "B2: Fluent dialogue with je...desto", ja: "B2：比例構文と高度なコロケーション" },
      lines: [
        {
          speaker: "Moderatorin",
          text: "Herr Sommer, was macht Ihrer Erfahrung nach beim Sprachenlernen den größten Unterschied?",
          tr: { ru: "Господин Зоммер, что, по вашему опыту, даёт самую большую разницу в изучении языков?", en: "Formal interview phrasing.", ja: "ゾンマーさん、ご経験上、語学学習で最も大きな差を生むものは何ですか？" },
        },
        {
          speaker: "Herr Sommer",
          text: "Je regelmäßiger man aktiv spricht und zuhört, desto schneller wächst das Vertrauen.",
          tr: { ru: "Чем регулярнее человек активно говорит и слушает, тем быстрее растёт уверенность.", en: "Correlative je ... desto.", ja: "定期的に声に出して話し聞くほど、自信が早く育ちます。" },
        },
        {
          speaker: "Moderatorin",
          text: "Das bringt die Sache wirklich genau auf den Punkt!",
          tr: { ru: "Это действительно попадает прямо в точку!", en: "Idiom: auf den Punkt bringen.", ja: "まさに核心を突いていますね！" },
        },
      ],
    },
  ],
};

export const LISTENING_PROMPTS: Record<StudyLanguage, ListeningPromptItem[]> = {
  ja: [
    // N5 (6)
    { level: "N5", text: "おはよう ございます", reading: "Ohayō gozaimasu", meaning: { ru: "Доброе утро (вежливо)", en: "Good morning (polite)", ja: "丁寧な朝の挨拶" } },
    { level: "N5", text: "これは いくらですか", reading: "Kore wa ikura desu ka", meaning: { ru: "Сколько это стоит?", en: "How much is this?", ja: "値段を聞く表現" } },
    { level: "N5", text: "駅は どこですか", reading: "Eki wa doko desu ka", meaning: { ru: "Где находится станция?", en: "Where is the station?", ja: "場所を尋ねる表現" } },
    { level: "N5", text: "お会計を お願いします", reading: "Okaikei o onegaishimasu", meaning: { ru: "Счёт, пожалуйста", en: "Check / bill, please", ja: "支払いを頼む表現" } },
    { level: "N5", text: "図書館で 本を 読みます", reading: "Toshokan de hon o yomimasu", meaning: { ru: "Я читаю книгу в библиотеке", en: "I read a book in the library", ja: "図書館で読書する表現" } },
    { level: "N5", text: "京都へ 行きたいです", reading: "Kyōto e ikitai desu", meaning: { ru: "Я хочу поехать в Киото", en: "I want to go to Kyoto", ja: "希望を伝える表現" } },
    // N4 (6)
    { level: "N4", text: "ちょっと 待ってください", reading: "Chotto matte kudasai", meaning: { ru: "Подождите минутку, пожалуйста", en: "Wait a moment, please", ja: "少し待ってもらう表現" } },
    { level: "N4", text: "日本語が 少し わかります", reading: "Nihongo ga sukoshi wakarimasu", meaning: { ru: "Я немного понимаю по-японски", en: "I understand a little Japanese", ja: "言語能力を伝える表現" } },
    { level: "N4", text: "とても 便利ですね", reading: "Totemo benri desu ne", meaning: { ru: "Как же это удобно!", en: "It's so convenient!", ja: "便利さへの感想" } },
    { level: "N4", text: "ここに 座っても いいですか", reading: "Koko ni suwatte mo ii desu ka", meaning: { ru: "Можно мне сесть здесь?", en: "May I sit here?", ja: "許可を求める表現" } },
    { level: "N4", text: "ホテルを 予約しました", reading: "Hoteru o yoyaku shimashita", meaning: { ru: "Я забронировал отель", en: "I booked a hotel", ja: "予約完了の表現" } },
    { level: "N4", text: "雨が 降っています", reading: "Ame ga futte imasu", meaning: { ru: "Сейчас идёт дождь", en: "It is raining right now", ja: "進行形の表現" } },
    // N3 (6)
    { level: "N3", text: "東京に 着いたら すぐ 連絡します", reading: "Tōkyō ni tsuitara sugu renraku shimasu", meaning: { ru: "Как только приеду в Токио, сразу напишу", en: "Once I arrive in Tokyo I'll contact you", ja: "到着後の連絡を伝える表現" } },
    { level: "N3", text: "良い 経験に なりました", reading: "Ii keiken ni narimashita", meaning: { ru: "Это стал отличный опыт", en: "It turned into a great experience", ja: "感想・振り返りの表現" } },
    { level: "N3", text: "ニュースが わかる ように なりました", reading: "Nyūsu ga wakaru yō ni narimashita", meaning: { ru: "Я постепенно начал понимать новости", en: "I came to understand the news", ja: "上達の変化を表す表現" } },
    { level: "N3", text: "抹茶ラテを 飲んで みました", reading: "Matcha rate o nonde mimashita", meaning: { ru: "Я попробовал выпить матча-латте", en: "I tried drinking a matcha latte", ja: "試みの表現" } },
    { level: "N3", text: "健康の ために 毎日 走ります", reading: "Kenkō no tame ni mainichi hashirimasu", meaning: { ru: "Я бегаю каждый день ради здоровья", en: "I run daily for my health", ja: "目的を表す表現" } },
    { level: "N3", text: "良い 機会を 逃しません", reading: "Ii kikai o nogashimasen", meaning: { ru: "Я не упущу хорошую возможность", en: "I won't miss a good opportunity", ja: "決意を表す表現" } },
  ],
  en: [
    // A1 (6)
    { level: "A1", text: "There is a cosy café near the station.", meaning: { ru: "Рядом со станцией есть уютное кафе.", en: "Describing local places", ja: "駅の近くに居心地の良いカフェがあります。" } },
    { level: "A1", text: "I drink warm tea every morning at eight.", meaning: { ru: "Я пью тёплый чай каждое утро в восемь.", en: "Simple morning habit", ja: "毎朝8時に温かい紅茶を飲みます。" } },
    { level: "A1", text: "Can I pay by card at this counter?", meaning: { ru: "Можно оплатить картой на этой кассе?", en: "Polite payment question", ja: "このカウンターでカード払いはできますか？" } },
    { level: "A1", text: "Our lesson starts on Friday morning.", meaning: { ru: "Наш урок начинается в пятницу утром.", en: "Weekday schedule time", ja: "レッスンは金曜の朝に始まります。" } },
    { level: "A1", text: "Two croissants and one flat white, please.", meaning: { ru: "Два круассана и один флэт-уайт, пожалуйста.", en: "Ordering at a bakery", ja: "クロワッサン2つとフラットホワイトを1つお願いします。" } },
    { level: "A1", text: "She can read maps very quickly.", meaning: { ru: "Она умеет очень быстро читать карты.", en: "Expressing skill with can", ja: "彼女は地図を読むのがとても速いです。" } },
    // A2 (6)
    { level: "A2", text: "Could you speak a bit more slowly, please?", meaning: { ru: "Не могли бы вы говорить чуть медленнее?", en: "Request to slow down speech", ja: "もう少しゆっくり話していただけますか？" } },
    { level: "A2", text: "I'm really looking forward to the weekend.", meaning: { ru: "Я с нетерпением жду выходных.", en: "Excited for the weekend", ja: "週末をとても楽しみにしています。" } },
    { level: "A2", text: "Have you ever visited the British Museum?", meaning: { ru: "Ты когда-нибудь бывал в Британском музее?", en: "Life experience question", ja: "大英博物館に行ったことはありますか？" } },
    { level: "A2", text: "The underground is faster than the bus today.", meaning: { ru: "Сегодня метро быстрее автобуса.", en: "City transit comparison", ja: "今日は地下鉄の方がバスより速いです。" } },
    { level: "A2", text: "Turn left after the bridge to reach the market.", meaning: { ru: "Поверните налево после моста, чтобы дойти до рынка.", en: "Simple walking directions", ja: "橋を過ぎたら左に曲がると市場に着きます。" } },
    { level: "A2", text: "We ran out of coffee beans this morning.", meaning: { ru: "У нас сегодня утром закончились кофейные зёрна.", en: "Phrasal verb 'run out of'", ja: "今朝コーヒー豆を切らしてしまいました。" } },
    // B1 (6)
    { level: "B1", text: "It took me a while to figure it out.", meaning: { ru: "Мне потребовалось время, чтобы разобраться.", en: "Took time to solve/understand", ja: "理解するのに少し時間がかかりました。" } },
    { level: "B1", text: "If I had more free time, I would visit Scotland.", meaning: { ru: "Если бы у меня было больше времени, я бы посетил Шотландию.", en: "Hypothetical 2nd Conditional", ja: "もっと時間があればスコットランドを訪れるのに。" } },
    { level: "B1", text: "I am finally used to waking up early.", meaning: { ru: "Я наконец привык рано вставать.", en: "be used to + -ing", ja: "ようやく早起きに慣れてきました。" } },
    { level: "B1", text: "The new release was shipped without any downtime.", meaning: { ru: "Новый релиз выкатили без единого простоя.", en: "Passive voice tech update", ja: "新しいリリースは無停止で公開されました。" } },
    { level: "B1", text: "Small daily steps turn curiosity into real fluency.", meaning: { ru: "Маленькие ежедневные шаги превращают интерес в беглую речь.", en: "Steady habit growth", ja: "毎日の小さな一歩が好奇心を確かな語学力に変えます。" } },
    { level: "B1", text: "She came up with an elegant design in ten minutes.", meaning: { ru: "Она придумала элегантное решение за десять минут.", en: "Phrasal verb 'come up with'", ja: "彼女は10分で洗練されたデザインを思いつきました。" } },
    // B2 (6)
    { level: "B2", text: "Let's take user feedback into account.", meaning: { ru: "Давайте учтём отзывы пользователей.", en: "Diplomatic workplace phrasing", ja: "ユーザーのフィードバックを考慮しましょう。" } },
    { level: "B2", text: "Practice consistently and mastery follows in the long run.", meaning: { ru: "Занимайся регулярно, и мастерство придёт в перспективе.", en: "Consistent habit payoff", ja: "継続して練習すれば、長い目で見て必ず上達します。" } },
    { level: "B2", text: "Not only did the app load faster, it also felt effortless.", meaning: { ru: "Приложение не только загрузилось быстрее, но и стало ощущаться лёгким.", en: "Negative inversion structure", ja: "アプリは速くなっただけでなく、操作感も軽やかになりました。" } },
    { level: "B2", text: "If we had waited longer, we would have missed the opportunity.", meaning: { ru: "Если бы мы ждали дольше, то упустили бы эту возможность.", en: "Third conditional hindsight", ja: "もっと長く待っていたら機会を逃していたでしょう。" } },
    { level: "B2", text: "As a rule of thumb, keep interfaces calm and readable.", meaning: { ru: "Золотое правило — сохранять интерфейс спокойным и читаемым.", en: "Idiomatic practical guideline", ja: "経験則としてUIは落ち着いて読みやすく保つべきです。" } },
    { level: "B2", text: "Resilient teams stay pragmatic without cutting corners.", meaning: { ru: "Сильные команды остаются прагматичными и не халтурят на качестве.", en: "Nuanced leadership vocabulary", ja: "しなやかなチームは手抜きをせず実用的に進みます。" } },
  ],
  de: [
    // A1 (6)
    { level: "A1", text: "Ich hätte gern einen Kaffee mit Milch.", meaning: { ru: "Мне, пожалуйста, кофе с молоком.", en: "I would like a coffee with milk.", ja: "ミルク入りのコーヒーをお願いします。" } },
    { level: "A1", text: "Guten Morgen! Was darf es heute sein?", meaning: { ru: "Доброе утро! Что вам предложить сегодня?", en: "Friendly bakery greeting", ja: "おはようございます！今日は何になさいますか？" } },
    { level: "A1", text: "Wie viel kostet das Buch dort links?", meaning: { ru: "Сколько стоит вон та книга слева?", en: "Asking price in bookstore", ja: "左側のあの本はいくらですか？" } },
    { level: "A1", text: "Wo wohnen Sie und woher kommen Sie?", meaning: { ru: "Где вы живёте и откуда вы приехали?", en: "Polite W-Fragen greeting", ja: "どちらにお住まいで、ご出身はどちらですか？" } },
    { level: "A1", text: "Das Wetter in München ist heute sonnig und warm.", meaning: { ru: "Погода в Мюнхене сегодня солнечная и тёплая.", en: "Simple weather statement", ja: "今日のミュンヘンの天気は晴れて暖かいです。" } },
    { level: "A1", text: "Wir lernen zusammen Deutsch und trinken Tee.", meaning: { ru: "Мы вместе учим немецкий и пьём чай.", en: "Plural present tense", ja: "私たちは一緒にドイツ語を学び、お茶を飲みます。" } },
    // A2 (6)
    { level: "A2", text: "Entschuldigung, wie komme ich zum Zentrum?", meaning: { ru: "Извините, как добраться до центра?", en: "Excuse me, how do I get to the center?", ja: "すみません、中心街へはどう行けばいいですか？" } },
    { level: "A2", text: "Der ICE fährt in zehn Minuten von Gleis acht ab.", meaning: { ru: "Скоростной поезд отправляется через 10 минут с 8-го пути.", en: "Platform announcement", ja: "ICEは10分後に8番ホームから出発します。" } },
    { level: "A2", text: "Am Bahnhof müssen wir in die S-Bahn umsteigen.", meaning: { ru: "На вокзале нам нужно пересесть на S-Bahn.", en: "Modal + separable verb", ja: "駅でSバーンに乗り換えなければなりません。" } },
    { level: "A2", text: "Das Buch liegt direkt auf dem großen Tisch.", meaning: { ru: "Книга лежит прямо на большом столе.", en: "Stationary Dative position", ja: "本は大きなテーブルのすぐ上にあります。" } },
    { level: "A2", text: "Ich rufe dich heute Abend nach der Arbeit an.", meaning: { ru: "Я позвоню тебе сегодня вечером после работы.", en: "Separable verb anrufen", ja: "今晩仕事のあとに電話しますね。" } },
    { level: "A2", text: "Mein Zug kommt pünktlich um achtzehn Uhr an.", meaning: { ru: "Мой поезд прибывает точно по расписанию в 18:00.", en: "Arrival time sentence", ja: "私の電車は18時ちょうどに到着します。" } },
    // B1 (6)
    { level: "B1", text: "Ich lerne Deutsch, weil ich Berlin sehr mag.", meaning: { ru: "Я учу немецкий, потому что мне очень нравится Берлин.", en: "Using 'weil' subordinate clause", ja: "ベルリンが好きなのでドイツ語を学んでいます。" } },
    { level: "B1", text: "Am Wochenende fahren wir zusammen an den See.", meaning: { ru: "На выходных мы вместе поедем на озеро.", en: "Weekend outdoor trip", ja: "週末に一緒に湖へ行きます。" } },
    { level: "B1", text: "Das ist die App, die mir jeden Tag beim Lernen hilft.", meaning: { ru: "Это приложение, которое помогает мне учиться каждый день.", en: "Relative clause 'die'", ja: "これが毎日学習を助けてくれるアプリです。" } },
    { level: "B1", text: "Obwohl es leicht regnet, gehen wir spazieren.", meaning: { ru: "Хотя идёт лёгкий дождь, мы идём гулять.", en: "Concessive 'obwohl'", ja: "小雨が降っていますが散歩に出かけます。" } },
    { level: "B1", text: "Gestern hatte ich wenig Zeit, aber der Abend war schön.", meaning: { ru: "Вчера было мало времени, но вечер прошёл прекрасно.", en: "Präteritum hatte & war", ja: "昨日は時間が少なかったけれど素敵な夜でした。" } },
    { level: "B1", text: "Ich habe meine Erfahrungen in einem Notizbuch gesammelt.", meaning: { ru: "Я собрал свой опыт в записной книжке.", en: "Perfekt narrative", ja: "経験をノートにまとめました。" } },
    // B2 (6)
    { level: "B2", text: "Könnten Sie das bitte etwas langsamer wiederholen?", meaning: { ru: "Не могли бы вы повторить это чуть медленнее?", en: "Polite Konjunktiv II request", ja: "もう少しゆっくり繰り返していただけますか？" } },
    { level: "B2", text: "Die Entscheidung wird morgen gemeinsam besprochen.", meaning: { ru: "Решение будет совместно обсуждено завтра.", en: "Passive voice discussion", ja: "その決定は明日一緒に議論されます。" } },
    { level: "B2", text: "Je mehr man laut übt, desto sicherer spricht man.", meaning: { ru: "Чем больше тренируешься вслух, тем увереннее говоришь.", en: "je ..., desto ... structure", ja: "声に出して練習するほど、自信を持って話せます。" } },
    { level: "B2", text: "Unser Team legt großen Wert auf klare Dokumentation.", meaning: { ru: "Наша команда придаёт большое значение ясной документации.", en: "Wert legen auf collocation", ja: "私たちのチームは明確な文書化を重視しています。" } },
    { level: "B2", text: "Wir ziehen alle Argumente sorgfältig in Betracht.", meaning: { ru: "Мы тщательно принимаем во внимание все аргументы.", en: "in Betracht ziehen", ja: "すべての議論を慎重に考慮に入れます。" } },
    { level: "B2", text: "Das bringt die gesamte Idee genau auf den Punkt.", meaning: { ru: "Это выражает всю идею предельно точно.", en: "auf den Punkt bringen", ja: "それがアイデア全体を的確に言い表しています。" } },
  ],
};
