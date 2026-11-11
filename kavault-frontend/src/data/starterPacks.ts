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
  // ───────── N5: Кана и базовые фразы (15) ─────────
  { word: "ありがとう", reading: "arigatou", studyLevel: "N5", type: "KANA", example: "いつもありがとう！", meanings: { ru: "Спасибо", en: "Thank you", ja: "感謝の言葉" } },
  { word: "こんにちは", reading: "konnichiwa", studyLevel: "N5", type: "KANA", example: "こんにちは、お元気ですか。", meanings: { ru: "Здравствуйте / Привет", en: "Hello / Good afternoon", ja: "昼の挨拶" } },
  { word: "さようなら", reading: "sayounara", studyLevel: "N5", type: "KANA", meanings: { ru: "До свидания", en: "Goodbye", ja: "別れの挨拶" } },
  { word: "はい", reading: "hai", studyLevel: "N5", type: "KANA", meanings: { ru: "Да", en: "Yes", ja: "肯定の返事" } },
  { word: "いいえ", reading: "iie", studyLevel: "N5", type: "KANA", meanings: { ru: "Нет", en: "No", ja: "否定の返事" } },
  { word: "すみません", reading: "sumimasen", studyLevel: "N5", type: "KANA", example: "すみません、駅はどこですか。", meanings: { ru: "Извините / Прошу прощения", en: "Excuse me / Sorry", ja: "謝罪・呼びかけ" } },
  { word: "おねがいします", reading: "onegaishimasu", studyLevel: "N5", type: "KANA", meanings: { ru: "Пожалуйста (просьба)", en: "Please", ja: "依頼の表現" } },
  { word: "おはよう", reading: "ohayou", studyLevel: "N5", type: "KANA", meanings: { ru: "Доброе утро", en: "Good morning", ja: "朝の挨拶" } },
  { word: "みず", reading: "mizu", studyLevel: "N5", type: "KANA", meanings: { ru: "Вода", en: "Water", ja: "お水" } },
  { word: "おちゃ", reading: "ocha", studyLevel: "N5", type: "KANA", meanings: { ru: "Зелёный чай", en: "Green tea", ja: "お茶" } },
  { word: "ごはん", reading: "gohan", studyLevel: "N5", type: "KANA", meanings: { ru: "Рис / Еда", en: "Rice / Meal", ja: "ご飯・食事" } },
  { word: "ともだち", reading: "tomodachi", studyLevel: "N5", type: "KANA", meanings: { ru: "Друг / Приятель", en: "Friend", ja: "友人" } },
  { word: "たべる", reading: "taberu", studyLevel: "N5", type: "KANA", example: "朝ごはんをたべます。", meanings: { ru: "Кушать / Есть", en: "To eat", ja: "食事する" } },
  { word: "のむ", reading: "nomu", studyLevel: "N5", type: "KANA", example: "コーヒーをのみます。", meanings: { ru: "Пить", en: "To drink", ja: "飲み物を摂取する" } },
  { word: "コーヒー", reading: "koohii", studyLevel: "N5", type: "KANA", meanings: { ru: "Кофе", en: "Coffee", ja: "珈琲" } },

  // ───────── N5: Базовые Кандзи (15) ─────────
  { word: "日", reading: "ひ / にち (hi / nichi)", studyLevel: "N5", type: "KANJI", example: "今日はいい天気です。", meanings: { ru: "День / Солнце", en: "Day / Sun", ja: "太陽・一日" } },
  { word: "月", reading: "つき / げつ (tsuki / getsu)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Луна / Месяц", en: "Moon / Month", ja: "お月様・月日" } },
  { word: "火", reading: "ひ / か (hi / ka)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Огонь / Вторник", en: "Fire", ja: "火・火曜日" } },
  { word: "水", reading: "みず / すい (mizu / sui)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Вода (иероглиф)", en: "Water (Kanji)", ja: "お水" } },
  { word: "木", reading: "き / もく (ki / moku)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Дерево", en: "Tree / Wood", ja: "木・木曜日" } },
  { word: "山", reading: "やま / さん (yama / san)", studyLevel: "N5", type: "KANJI", example: "富士山は高いです。", meanings: { ru: "Гора", en: "Mountain", ja: "高い地形" } },
  { word: "川", reading: "かわ / せん (kawa / sen)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Река", en: "River", ja: "流れる水" } },
  { word: "人", reading: "ひと / じん (hito / jin)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Человек", en: "Person", ja: "人間" } },
  { word: "今日", reading: "きょう (kyou)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Сегодня", en: "Today", ja: "この日" } },
  { word: "明日", reading: "あした (ashita)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Завтра", en: "Tomorrow", ja: "次の日" } },
  { word: "駅", reading: "えき (eki)", studyLevel: "N5", type: "KANJI", example: "駅の前で会いましょう。", meanings: { ru: "Станция / Вокзал", en: "Train station", ja: "鉄道の駅" } },
  { word: "学校", reading: "がっこう (gakkou)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Школа / Учебное заведение", en: "School", ja: "学ぶ場所" } },
  { word: "先生", reading: "せんせい (sensei)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Учитель / Преподаватель", en: "Teacher", ja: "指導者" } },
  { word: "時間", reading: "じかん (jikan)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Время / Час", en: "Time / Hour", ja: "時刻・長さ" } },
  { word: "日本語", reading: "にほんご (nihongo)", studyLevel: "N5", type: "KANJI", meanings: { ru: "Японский язык", en: "Japanese language", ja: "日本の言葉" } },

  // ───────── N4: Кана и бытовая лексика (15) ─────────
  { word: "ちゅうもん", reading: "chuumon (注文)", studyLevel: "N4", type: "KANA", example: "すみません、ちゅうもんをお願いします。", meanings: { ru: "Заказ (в кафе/онлайн)", en: "Order", ja: "注文すること" } },
  { word: "まちがえる", reading: "machigaeru (間違える)", studyLevel: "N4", type: "KANA", meanings: { ru: "Ошибаться / Путать", en: "To make a mistake", ja: "誤る" } },
  { word: "れんしゅう", reading: "renshuu (練習)", studyLevel: "N4", type: "KANA", example: "毎日ピアノをれんしゅうします。", meanings: { ru: "Тренировка / Практика", en: "Practice", ja: "繰り返し学ぶこと" } },
  { word: "てつだう", reading: "tetsudau (手伝う)", studyLevel: "N4", type: "KANA", meanings: { ru: "Помогать", en: "To help", ja: "手を貸す" } },
  { word: "かたづける", reading: "katazukeru (片付ける)", studyLevel: "N4", type: "KANA", meanings: { ru: "Убираться / Приводить в порядок", en: "To tidy up", ja: "整理する" } },
  { word: "いそぐ", reading: "isogu (急ぐ)", studyLevel: "N4", type: "KANA", meanings: { ru: "Торопиться / Спешить", en: "To hurry", ja: "急いで動く" } },
  { word: "えらぶ", reading: "erabu (選ぶ)", studyLevel: "N4", type: "KANA", meanings: { ru: "Выбирать", en: "To choose", ja: "選択する" } },
  { word: "はこぶ", reading: "hakobu (運ぶ)", studyLevel: "N4", type: "KANA", meanings: { ru: "Нести / Перевозить", en: "To carry / transport", ja: "移動させる" } },
  { word: "きめる", reading: "kimeru (決める)", studyLevel: "N4", type: "KANA", meanings: { ru: "Решать / Назначать", en: "To decide", ja: "決定する" } },
  { word: "さがす", reading: "sagasu (探す)", studyLevel: "N4", type: "KANA", meanings: { ru: "Искать", en: "To look for", ja: "見つけようとする" } },
  { word: "おくれる", reading: "okureru (遅れる)", studyLevel: "N4", type: "KANA", meanings: { ru: "Опаздывать", en: "To be late", ja: "時間に間に合わない" } },
  { word: "おどろく", reading: "odoroku (驚く)", studyLevel: "N4", type: "KANA", meanings: { ru: "Удивляться", en: "To be surprised", ja: "びっくりする" } },
  { word: "おもう", reading: "omou (思う)", studyLevel: "N4", type: "KANA", meanings: { ru: "Думать / Считать", en: "To think", ja: "心に浮かぶ" } },
  { word: "しらせる", reading: "shiraseru (知らせる)", studyLevel: "N4", type: "KANA", meanings: { ru: "Сообщать / Информировать", en: "To notify / inform", ja: "伝える" } },
  { word: "プレゼント", reading: "purezento", studyLevel: "N4", type: "KANA", meanings: { ru: "Подарок", en: "Present / Gift", ja: "贈り物" } },

  // ───────── N4: Кандзи и составные слова (15) ─────────
  { word: "約束", reading: "やくそく (yakusoku)", studyLevel: "N4", type: "KANJI", example: "友だちと約束があります。", meanings: { ru: "Обещание / Договорённость", en: "Promise / Appointment", ja: "取り決め・約束" } },
  { word: "準備", reading: "じゅんび (junbi)", studyLevel: "N4", type: "KANJI", example: "旅行の準備をします。", meanings: { ru: "Подготовка", en: "Preparation", ja: "前もって用意すること" } },
  { word: "便利", reading: "べんり (benri)", studyLevel: "N4", type: "KANJI", example: "このアプリはとても便利です。", meanings: { ru: "Удобный", en: "Convenient", ja: "役に立って使いやすい" } },
  { word: "大切", reading: "たいせつ (taisetsu)", studyLevel: "N4", type: "KANJI", example: "時間はとても大切です。", meanings: { ru: "Важный / Дорогой", en: "Important / Precious", ja: "大事にすべきこと" } },
  { word: "説明する", reading: "せつめいする (setsumei suru)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Объяснять", en: "To explain", ja: "わかりやすく述べる" } },
  { word: "質問", reading: "しつもん (shitsumon)", studyLevel: "N4", type: "KANJI", example: "質問がありますか。", meanings: { ru: "Вопрос", en: "Question", ja: "疑問を聞くこと" } },
  { word: "案内", reading: "あんない (annai)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Сопровождение / Гид / Информация", en: "Guidance / Info", ja: "道や内容を教えること" } },
  { word: "予約", reading: "よやく (yoyaku)", studyLevel: "N4", type: "KANJI", example: "ホテルを予約しました。", meanings: { ru: "Бронирование / Резерв", en: "Reservation", ja: "前もって席や宿を取ること" } },
  { word: "必要", reading: "ひつよう (hitsuyou)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Необходимый / Нужный", en: "Necessary", ja: "なくてはならない" } },
  { word: "特別", reading: "とくべつ (tokubetsu)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Особый / Специальный", en: "Special", ja: "他と違うこと" } },
  { word: "地図", reading: "ちず (chizu)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Карта (местности)", en: "Map", ja: "地理の図面" } },
  { word: "電車", reading: "でんしゃ (densha)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Электричка / Поезд", en: "Train", ja: "電気で走る車" } },
  { word: "仕事", reading: "しごと (shigoto)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Работа / Дело", en: "Work / Job", ja: "職業・作業" } },
  { word: "親切", reading: "しんせつ (shinsetsu)", studyLevel: "N4", type: "KANJI", meanings: { ru: "Добрый / Отзывчивый", en: "Kind / Helpful", ja: "思いやりがある" } },
  { word: "旅行", reading: "りょこう (ryokou)", studyLevel: "N4", type: "KANJI", example: "夏休みに京都へ旅行します。", meanings: { ru: "Путешествие", en: "Travel / Trip", ja: "旅をすること" } },

  // ───────── N3: Кана, наречия и нюансы (15) ─────────
  { word: "きもち", reading: "kimochi (気持ち)", studyLevel: "N3", type: "KANA", meanings: { ru: "Чувство / Настроение", en: "Feeling / Mood", ja: "心持ち・感情" } },
  { word: "やはり", reading: "yahari", studyLevel: "N3", type: "KANA", example: "やはり日本の春は美しいですね。", meanings: { ru: "Всё-таки / Как и ожидалось", en: "As expected / After all", ja: "思った通り" } },
  { word: "せっかく", reading: "sekkaku", studyLevel: "N3", type: "KANA", meanings: { ru: "Столько усилий / Раз уж выдался случай", en: "With much trouble / Especially", ja: "わざわざ" } },
  { word: "なるほど", reading: "naruhodo", studyLevel: "N3", type: "KANA", meanings: { ru: "Вот оно как / Действительно", en: "I see / That makes sense", ja: "相手への納得" } },
  { word: "きちんと", reading: "kichinto", studyLevel: "N3", type: "KANA", meanings: { ru: "Аккуратно / Как следует", en: "Neatly / Properly", ja: "正しく整って" } },
  { word: "どんどん", reading: "dondon", studyLevel: "N3", type: "KANA", meanings: { ru: "Стремительно / Всё быстрее", en: "Rapidly / Steadily", ja: "勢いよく進む様子" } },
  { word: "ようやく", reading: "youyaku", studyLevel: "N3", type: "KANA", meanings: { ru: "Наконец-то (с трудом)", en: "Finally / At last", ja: "待ち望んだ末に" } },
  { word: "めったに", reading: "mettani (+ neg)", studyLevel: "N3", type: "KANA", meanings: { ru: "Редко / Почти никогда", en: "Rarely / Seldom", ja: "ほとんど〜ない" } },
  { word: "たとえば", reading: "tatoeba (例えば)", studyLevel: "N3", type: "KANA", meanings: { ru: "Например", en: "For example", ja: "例を挙げる時" } },
  { word: "つづける", reading: "tsuzukeru (続ける)", studyLevel: "N3", type: "KANA", example: "毎日勉強をつづけています。", meanings: { ru: "Продолжать", en: "To continue", ja: "途切れず行う" } },
  { word: "くらべる", reading: "kuraberu (比べる)", studyLevel: "N3", type: "KANA", meanings: { ru: "Сравнивать", en: "To compare", ja: "比較する" } },
  { word: "たしかめる", reading: "tashikameru (確かめる)", studyLevel: "N3", type: "KANA", meanings: { ru: "Удостовериться / Перепроверить", en: "To make sure / verify", ja: "確認する" } },
  { word: "なれる", reading: "nareru (慣れる)", studyLevel: "N3", type: "KANA", meanings: { ru: "Привыкать", en: "To get used to", ja: "経験して平気になる" } },
  { word: "スケジュール", reading: "sukejuuru", studyLevel: "N3", type: "KANA", meanings: { ru: "Расписание / График", en: "Schedule", ja: "予定表" } },
  { word: "コミュニケーション", reading: "komyunikeeshon", studyLevel: "N3", type: "KANA", meanings: { ru: "Общение / Коммуникация", en: "Communication", ja: "意思疎通" } },

  // ───────── N3: Средний уровень Кандзи (15) ─────────
  { word: "経験", reading: "けいけん (keiken)", studyLevel: "N3", type: "KANJI", example: "いい経験になりました。", meanings: { ru: "Опыт", en: "Experience", ja: "実際に体験したこと" } },
  { word: "集中", reading: "しゅうちゅう (shuuchuu)", studyLevel: "N3", type: "KANJI", example: "静かな所で集中します。", meanings: { ru: "Концентрация / Фокус", en: "Concentration / Focus", ja: "意識を一つに集めること" } },
  { word: "印象", reading: "いんしょう (inshou)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Впечатление", en: "Impression", ja: "心に強く残る感じ" } },
  { word: "機会", reading: "きかい (kikai)", studyLevel: "N3", type: "KANJI", example: "良い機会を逃しません。", meanings: { ru: "Возможность / Случай", en: "Opportunity / Chance", ja: "物事をするのに良い折" } },
  { word: "習慣", reading: "しゅうかん (shuukan)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Привычка / Обычай", en: "Habit / Custom", ja: "毎日繰り返すこと" } },
  { word: "影響", reading: "えいきょう (eikyou)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Влияние / Эффект", en: "Influence / Impact", ja: "働きかけて変える力" } },
  { word: "解決", reading: "かいけつ (kaiketsu)", studyLevel: "N3", type: "KANJI", example: "問題を解決しましょう。", meanings: { ru: "Решение (проблемы)", en: "Resolution / Solution", ja: "問題に決着をつけること" } },
  { word: "実現", reading: "じつげん (jitsugen)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Реализация / Воплощение", en: "Realization", ja: "現実の形にすること" } },
  { word: "判断", reading: "はんだん (handan)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Суждение / Решение", en: "Judgment / Decision", ja: "見極め" } },
  { word: "表現", reading: "ひょうげん (hyougen)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Выражение / Формулировка", en: "Expression", ja: "思いを外に出すこと" } },
  { word: "努力", reading: "どりょく (doryoku)", studyLevel: "N3", type: "KANJI", example: "努力は必ず報われます。", meanings: { ru: "Усилие / Старание", en: "Effort", ja: "力を尽くすこと" } },
  { word: "目的", reading: "もくてき (mokuteki)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Цель / Назначение", en: "Purpose / Goal", ja: "目指すところ" } },
  { word: "確認", reading: "かくにん (kakunin)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Подтверждение / Проверка", en: "Confirmation", ja: "はっきり確かめること" } },
  { word: "雰囲気", reading: "ふんいき (fun'iki)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Атмосфера / Обстановка", en: "Atmosphere / Mood", ja: "その場の空気" } },
  { word: "技術", reading: "ぎじゅつ (gijutsu)", studyLevel: "N3", type: "KANJI", meanings: { ru: "Технология / Мастерство", en: "Technology / Technique", ja: "ものづくりの技" } },
];

const RAW_ENGLISH_CARDS: LocalizedStarterCardRaw[] = [
  // ───────── A1: Survival & Daily Basics (20) ─────────
  { word: "Morning", reading: "[ˈmɔː.nɪŋ]", studyLevel: "A1", type: "VOCABULARY", example: "Good morning! Fancy a cup of tea?", meanings: { ru: "Утро", en: "The early part of the day", ja: "朝" } },
  { word: "Journey", reading: "[ˈdʒɜː.ni]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Путешествие, поездка", en: "An act of travelling", ja: "旅・道のり" } },
  { word: "Library", reading: "[ˈlaɪ.brər.i]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Библиотека", en: "A place with books for reading", ja: "図書館" } },
  { word: "Weather", reading: "[ˈweð.ər]", studyLevel: "A1", type: "VOCABULARY", example: "London weather changes quickly.", meanings: { ru: "Погода", en: "Condition of the atmosphere", ja: "天気" } },
  { word: "Ticket", reading: "[ˈtɪk.ɪt]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Билет", en: "Paper or pass for travel/events", ja: "切符・チケット" } },
  { word: "Breakfast", reading: "[ˈbrek.fəst]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Завтрак", en: "First meal of the day", ja: "朝食" } },
  { word: "Street", reading: "[striːt]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Улица", en: "Public road in a town", ja: "通り・道" } },
  { word: "Schedule", reading: "[ˈʃed.juːl]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Расписание", en: "A timetable of planned events", ja: "スケジュール" } },
  { word: "Important", reading: "[ɪmˈpɔː.tənt]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Важный", en: "Of great value or significance", ja: "重要な" } },
  { word: "Always", reading: "[ˈɔːl.weɪz]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Всегда", en: "At all times", ja: "いつも" } },
  { word: "Today", reading: "[təˈdeɪ]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Сегодня", en: "On this present day", ja: "今日" } },
  { word: "Answer", reading: "[ˈɑːn.sər]", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Ответ / Отвечать", en: "A reply to a question", ja: "答え" } },
  { word: "Wake up", reading: "phrasal verb", studyLevel: "A1", type: "GRAMMAR", example: "I usually wake up at 7 AM.", meanings: { ru: "Просыпаться", en: "Stop sleeping", ja: "目を覚ます" } },
  { word: "Check in", reading: "phrasal verb", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Заселиться / Зарегистрироваться", en: "Register at a hotel or airport", ja: "チェックインする" } },
  { word: "Look for", reading: "phrasal verb", studyLevel: "A1", type: "GRAMMAR", example: "I'm looking for my keys.", meanings: { ru: "Искать", en: "Try to find something", ja: "探す" } },
  { word: "Turn on", reading: "phrasal verb", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Включать (прибор/свет)", en: "Start a machine or light", ja: "電源を入れる" } },
  { word: "Could you please...?", reading: "polite request", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Не могли бы вы, пожалуйста...", en: "Polite way to ask", ja: "〜していただけますか" } },
  { word: "There is / There are", reading: "structure", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Есть / Находится (в месте)", en: "Express existence", ja: "〜がある・いる" } },
  { word: "How much is it?", reading: "shopping phrase", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Сколько это стоит?", en: "Ask for price", ja: "いくらですか" } },
  { word: "Sit down", reading: "phrasal verb", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Садиться", en: "Take a seat", ja: "座る" } },

  // ───────── A2: Everyday Confidence & Travel (20) ─────────
  { word: "Neighborhood", reading: "[ˈneɪ.bə.hʊd]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Район, окрестности", en: "Local district around home", ja: "近所・地域" } },
  { word: "Comfortable", reading: "[ˈkʌm.fə.tə.bəl]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Удобный, комфортный", en: "Giving physical or mental ease", ja: "快適な" } },
  { word: "Curiosity", reading: "[ˌkjʊə.riˈɒs.ə.ti]", studyLevel: "A2", type: "VOCABULARY", example: "Curiosity sparks every great discovery.", meanings: { ru: "Любознательность", en: "Strong desire to learn", ja: "好奇心" } },
  { word: "Luggage", reading: "[ˈlʌɡ.ɪdʒ]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Багаж", en: "Suitcases and travel bags", ja: "手荷物" } },
  { word: "Experience", reading: "[ɪkˈspɪə.ri.əns]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Опыт, впечатление", en: "Practical knowledge or event", ja: "経験" } },
  { word: "Advice", reading: "[ədˈvaɪs]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Совет (неисчисл.)", en: "Guidance or recommendations", ja: "アドバイス" } },
  { word: "Habit", reading: "[ˈhæb.ɪt]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Привычка", en: "A regular repeated practice", ja: "習慣" } },
  { word: "Promise", reading: "[ˈprɒm.ɪs]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Обещание / Обещать", en: "Commitment to do something", ja: "約束" } },
  { word: "Suggest", reading: "[səˈdʒest]", studyLevel: "A2", type: "VOCABULARY", example: "I suggest taking the express train.", meanings: { ru: "Предлагать (идею)", en: "Put forward an idea", ja: "提案する" } },
  { word: "Explore", reading: "[ɪkˈsplɔːr]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Исследовать / Изучать", en: "Travel through or examine", ja: "探索する" } },
  { word: "Crowded", reading: "[ˈkraʊ.dɪd]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Многолюдный, переполненный", en: "Full of people", ja: "混雑した" } },
  { word: "Receipt", reading: "[rɪˈsiːt]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Чек, квитанция", en: "Proof of purchase", ja: "レシート・領収書" } },
  { word: "Look forward to", reading: "phrasal verb", studyLevel: "A2", type: "GRAMMAR", example: "I look forward to visiting London.", meanings: { ru: "Ждать с нетерпением (+ V-ing)", en: "Await eagerly", ja: "〜を楽しみに待つ" } },
  { word: "Figure out", reading: "phrasal verb", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Разобраться, понять", en: "Understand or solve", ja: "理解・解決する" } },
  { word: "Keep in touch", reading: "expression", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Поддерживать связь", en: "Stay in contact", ja: "連絡を取り合う" } },
  { word: "Pick up", reading: "phrasal verb", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Подхватить / Забрать / Выучить", en: "Collect or learn naturally", ja: "迎えに行く・習得する" } },
  { word: "Run out of", reading: "phrasal verb", studyLevel: "A2", type: "GRAMMAR", example: "We ran out of coffee beans.", meanings: { ru: "Закончиться (о запасах)", en: "Have none left", ja: "使い切る" } },
  { word: "Get along with", reading: "phrasal verb", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Ладить с кем-то", en: "Have a friendly relationship", ja: "仲良くやる" } },
  { word: "Used to + V", reading: "past habit", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Раньше делал (привычка в прошлом)", en: "Past routine no longer true", ja: "以前は〜していた" } },
  { word: "Make sure", reading: "collocation", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Убедиться, перепроверить", en: "Verify something", ja: "確認する" } },

  // ───────── B1: Fluency, Opinions & Phrasals (20) ─────────
  { word: "Milestone", reading: "[ˈmaɪl.stəʊn]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Важная веха, этап", en: "Significant stage", ja: "重要な節目" } },
  { word: "Perspective", reading: "[pəˈspek.tɪv]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Точка зрения, ракурс", en: "Point of view", ja: "視点・見方" } },
  { word: "Authentic", reading: "[ɔːˈθen.tɪk]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Подлинный, настоящий", en: "Genuine and original", ja: "本物の" } },
  { word: "Challenge", reading: "[ˈtʃæl.ɪndʒ]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Вызов, сложная задача", en: "Demanding task", ja: "課題・挑戦" } },
  { word: "Achieve", reading: "[əˈtʃiːv]", studyLevel: "B1", type: "VOCABULARY", example: "Consistent effort helps you achieve fluency.", meanings: { ru: "Достигать (цели)", en: "Successfully reach a goal", ja: "達成する" } },
  { word: "Opportunity", reading: "[ˌɒp.əˈtjuː.nə.ti]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Возможность, шанс", en: "Favourable time or chance", ja: "機会" } },
  { word: "Reliable", reading: "[rɪˈlaɪ.ə.bəl]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Надёжный", en: "Consistently good; trustworthy", ja: "信頼できる" } },
  { word: "Environment", reading: "[ɪnˈvaɪ.rən.mənt]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Окружающая среда / Среда", en: "Surroundings or conditions", ja: "環境" } },
  { word: "Efficient", reading: "[ɪˈfɪʃ.ənt]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Эффективный, результативный", en: "Achieving maximum productivity", ja: "効率的な" } },
  { word: "Influence", reading: "[ˈɪn.flu.əns]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Влияние / Влиять", en: "Capacity to have an effect", ja: "影響" } },
  { word: "Consider", reading: "[kənˈsɪd.ər]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Обдумывать, учитывать", en: "Think carefully about", ja: "検討する" } },
  { word: "Deadline", reading: "[ˈded.laɪn]", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Крайний срок, дедлайн", en: "Latest time to finish", ja: "締め切り" } },
  { word: "Break the ice", reading: "idiom", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Разрядить обстановку, начать общение", en: "Relieve tension at first meeting", ja: "緊張をほぐす" } },
  { word: "Put off", reading: "phrasal verb", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Откладывать на потом", en: "Postpone to a later time", ja: "先延ばしにする" } },
  { word: "Call it a day", reading: "idiom", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Закончить работу на сегодня", en: "Stop working for the day", ja: "今日はここまでにする" } },
  { word: "Carry out", reading: "phrasal verb", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Проводить, выполнять (план/тест)", en: "Conduct or complete a task", ja: "実行する" } },
  { word: "Make up one's mind", reading: "idiom", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Решиться, принять решение", en: "Make a decision", ja: "決心する" } },
  { word: "On the other hand", reading: "discourse marker", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "С другой стороны", en: "Introducing a contrasting point", ja: "一方で" } },
  { word: "By the way", reading: "discourse marker", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Кстати, между прочим", en: "Introducing a side topic", ja: "ところで" } },
  { word: "Come up with", reading: "phrasal verb", studyLevel: "B1", type: "GRAMMAR", example: "She came up with a clever design.", meanings: { ru: "Придумать (идею/решение)", en: "Invent or produce an idea", ja: "思いつく" } },

  // ───────── B2: Nuance, Leadership & Precision (20) ─────────
  { word: "Resilient", reading: "[rɪˈzɪl.i.ənt]", studyLevel: "B2", type: "VOCABULARY", example: "Resilient systems recover gracefully.", meanings: { ru: "Жизнестойкий, гибкий", en: "Recovering quickly from difficulty", ja: "回復力のある" } },
  { word: "Eloquent", reading: "[ˈel.ə.kwənt]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Красноречивый, выразительный", en: "Fluent and persuasive", ja: "雄弁な" } },
  { word: "Serendipity", reading: "[ˌser.ənˈdɪp.ə.ti]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Счастливая случайность", en: "Finding good things by chance", ja: "思いがけない幸運" } },
  { word: "Inevitable", reading: "[ɪˈnev.ɪ.tə.bəl]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Неизбежный, неминуемый", en: "Unavoidable", ja: "避けられない" } },
  { word: "Pragmatic", reading: "[præɡˈmæt.ɪk]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Прагматичный, практичный", en: "Focused on practical results", ja: "実用的な" } },
  { word: "Ambiguous", reading: "[æmˈbɪɡ.ju.əs]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Двусмысленный, неоднозначный", en: "Open to multiple interpretations", ja: "曖昧な" } },
  { word: "Insight", reading: "[ˈɪn.saɪt]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Глубокое понимание, инсайт", en: "Clear deep understanding", ja: "深い洞察" } },
  { word: "Seamless", reading: "[ˈsiːm.ləs]", studyLevel: "B2", type: "VOCABULARY", example: "Users expect a seamless experience.", meanings: { ru: "Бесшовный, плавный", en: "Smooth and continuous", ja: "シームレスな・途切れない" } },
  { word: "Substantial", reading: "[səbˈstæn.ʃəl]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Существенный, весомый", en: "Considerable in size or value", ja: "かなりの・実質的な" } },
  { word: "Breakthrough", reading: "[ˈbreɪk.θruː]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Прорыв, крупное открытие", en: "Important sudden advance", ja: "画期的な進歩" } },
  { word: "Trade-off", reading: "[ˈtreɪd.ɒf]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Компромисс (баланс плюсов/минусов)", en: "Balance between two competing features", ja: "トレードオフ" } },
  { word: "Plausible", reading: "[ˈplɔː.zə.bəl]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Правдоподобный, убедительный", en: "Seeming reasonable or probable", ja: "もっともらしい" } },
  { word: "Take into account", reading: "expression", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Принимать во внимание", en: "Consider when judging", ja: "考慮に入れる" } },
  { word: "In the long run", reading: "idiom", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "В конечном счёте, в перспективе", en: "Over a long time eventually", ja: "長い目で見れば" } },
  { word: "Read between the lines", reading: "idiom", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Читать между строк", en: "Understand hidden meaning", ja: "行間を読む" } },
  { word: "Rule of thumb", reading: "idiom", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Практическое правило, ориентир", en: "Broadly accurate practical guideline", ja: "経験則" } },
  { word: "Bridge the gap", reading: "collocation", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Устранить разрыв / навести мосты", en: "Connect two different sides", ja: "隔たりを埋める" } },
  { word: "Cut corners", reading: "idiom", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Сэкономить в ущерб качеству", en: "Skip essential steps to save effort", ja: "手抜きをする" } },
  { word: "Point of view", reading: "expression", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Точка зрения", en: "Personal perspective", ja: "観点" } },
  { word: "Regardless of", reading: "preposition phrase", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Несмотря на / Вне зависимости от", en: "Without being affected by", ja: "〜に関わらず" } },
];

const RAW_GERMAN_CARDS: LocalizedStarterCardRaw[] = [
  // ───────── A1: Basisnomen (der/die/das) & Erste Sätze (20) ─────────
  { word: "das Wasser", reading: "[ˈvasɐ] · unzählbar", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Вода", en: "Water", ja: "水" } },
  { word: "das Buch", reading: "die Bücher", studyLevel: "A1", type: "VOCABULARY", example: "Ich lese ein interessantes Buch.", meanings: { ru: "Книга", en: "Book", ja: "本" } },
  { word: "der Kaffee", reading: "die Kaffees", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Кофе", en: "Coffee", ja: "コーヒー" } },
  { word: "die Stadt", reading: "die Städte", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Город", en: "City", ja: "都市" } },
  { word: "das Haus", reading: "die Häuser", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Дом", en: "House", ja: "家" } },
  { word: "der Freund", reading: "die Freunde", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Друг", en: "Friend (male)", ja: "男友達" } },
  { word: "die Arbeit", reading: "die Arbeiten", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Работа", en: "Work", ja: "仕事" } },
  { word: "das Brot", reading: "die Brote", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Хлеб", en: "Bread", ja: "パン" } },
  { word: "der Tag", reading: "die Tage", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "День", en: "Day", ja: "日" } },
  { word: "die Musik", reading: "unzählbar", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Музыка", en: "Music", ja: "音楽" } },
  { word: "der Tisch", reading: "die Tische", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Стол", en: "Table", ja: "机" } },
  { word: "die Sprache", reading: "die Sprachen", studyLevel: "A1", type: "VOCABULARY", meanings: { ru: "Язык (речь)", en: "Language", ja: "言語" } },
  { word: "Guten Morgen", reading: "[ˈɡuːtn̩ ˈmɔʁɡn̩]", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Доброе утро", en: "Good morning", ja: "おはようございます" } },
  { word: "Vielen Dank", reading: "[ˈfiːlən daŋk]", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Большое спасибо", en: "Thank you very much", ja: "ありがとうございます" } },
  { word: "Wie heißt du?", reading: "Vorstellung", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Как тебя зовут?", en: "What is your name?", ja: "お名前は何ですか？" } },
  { word: "Ich komme aus...", reading: "Herkunft", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Я из...", en: "I come from...", ja: "〜出身です" } },
  { word: "lernen", reading: "lernte · hat gelernt", studyLevel: "A1", type: "GRAMMAR", example: "Wir lernen zusammen Deutsch.", meanings: { ru: "Учить / Изучать", en: "To learn", ja: "学ぶ" } },
  { word: "sprechen", reading: "sprach · hat gesprochen", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Говорить / Разговаривать", en: "To speak", ja: "話す" } },
  { word: "trinken", reading: "trank · hat getrunken", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "Пить", en: "To drink", ja: "飲む" } },
  { word: "Auf Wiedersehen", reading: "Abschied", studyLevel: "A1", type: "GRAMMAR", meanings: { ru: "До свидания (вежливо)", en: "Goodbye", ja: "さようなら" } },

  // ───────── A2: Alltag, Reisen & Trennbare Verben (20) ─────────
  { word: "der Bahnhof", reading: "die Bahnhöfe", studyLevel: "A2", type: "VOCABULARY", example: "Der Zug fährt vom Bahnhof ab.", meanings: { ru: "Вокзал", en: "Train station", ja: "駅" } },
  { word: "die Haltestelle", reading: "die Haltestellen", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Остановка транспорта", en: "Bus / tram stop", ja: "停留所" } },
  { word: "die Zeit", reading: "die Zeiten", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Время", en: "Time", ja: "時間" } },
  { word: "der Weg", reading: "die Wege", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Путь / Дорога", en: "Way / Path", ja: "道" } },
  { word: "das Wetter", reading: "[ˈvɛtɐ]", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Погода", en: "Weather", ja: "天気" } },
  { word: "die Fahrkarte", reading: "die Fahrkarten", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Проездной билет", en: "Transit ticket", ja: "乗車券" } },
  { word: "das Restaurant", reading: "die Restaurants", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Ресторан", en: "Restaurant", ja: "レストラン" } },
  { word: "der Termin", reading: "die Termine", studyLevel: "A2", type: "VOCABULARY", example: "Ich habe morgen einen Arzttermin.", meanings: { ru: "Назначенная встреча / Запись", en: "Appointment", ja: "予約・約束" } },
  { word: "die Gesundheit", reading: "unzählbar", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Здоровье / Будьте здоровы!", en: "Health", ja: "健康" } },
  { word: "der Schlüssel", reading: "die Schlüssel", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Ключ", en: "Key", ja: "鍵" } },
  { word: "das Wochenende", reading: "die Wochenenden", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Выходные", en: "Weekend", ja: "週末" } },
  { word: "die Rechnung", reading: "die Rechnungen", studyLevel: "A2", type: "VOCABULARY", meanings: { ru: "Счёт (в кафе / оплата)", en: "Bill / Invoice", ja: "お会計" } },
  { word: "verstehen", reading: "verstand · hat verstanden", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Понимать", en: "To understand", ja: "理解する" } },
  { word: "umsteigen", reading: "stieg um · ist umgestiegen", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Пересаживаться (на транспорте)", en: "To transfer lines", ja: "乗り換える" } },
  { word: "einkaufen", reading: "kaufte ein · hat eingekauft", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Делать покупки", en: "To go shopping", ja: "買い物をする" } },
  { word: "anrufen", reading: "rief an · hat angerufen", studyLevel: "A2", type: "GRAMMAR", example: "Ich rufe dich heute Abend an.", meanings: { ru: "Звонить (по телефону)", en: "To call on the phone", ja: "電話をかける" } },
  { word: "aufstehen", reading: "stand auf · ist aufgestanden", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Вставать (с постели)", en: "To get up", ja: "起きる" } },
  { word: "Ich hätte gern...", reading: "Bestellung", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Я бы хотел(а)...", en: "I would like...", ja: "〜をお願いします" } },
  { word: "es gibt + Akk", reading: "Ausdruck", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Имеется / Есть (вообще)", en: "There is / There are", ja: "〜がある" } },
  { word: "mitnehmen", reading: "nahm mit · hat mitgenommen", studyLevel: "A2", type: "GRAMMAR", meanings: { ru: "Взять с собой", en: "To take along / takeaway", ja: "持ち帰る" } },

  // ───────── B1: Kultur, Beruf & Konjunktionen (20) ─────────
  { word: "das Wissen", reading: "[ˈvɪsn̩]", studyLevel: "B1", type: "VOCABULARY", example: "Wissen wächst jeden Tag.", meanings: { ru: "Знание", en: "Knowledge", ja: "知識" } },
  { word: "das Ziel", reading: "die Ziele", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Цель / Пункт назначения", en: "Goal / Destination", ja: "目標" } },
  { word: "die Erfahrung", reading: "die Erfahrungen", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Опыт", en: "Experience", ja: "経験" } },
  { word: "der Traum", reading: "die Träume", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Мечта / Сон", en: "Dream", ja: "夢" } },
  { word: "die Meinung", reading: "die Meinungen", studyLevel: "B1", type: "VOCABULARY", example: "Meiner Meinung nach ist das sinnvoll.", meanings: { ru: "Мнение", en: "Opinion", ja: "意見" } },
  { word: "die Lösung", reading: "die Lösungen", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Решение (задачи)", en: "Solution", ja: "解決策" } },
  { word: "der Vorteil", reading: "die Vorteile", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Преимущество, плюс", en: "Advantage", ja: "利点" } },
  { word: "das Erlebnis", reading: "die Erlebnisse", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Переживание, яркое событие", en: "Memorable experience", ja: "体験" } },
  { word: "der Erfolg", reading: "die Erfolge", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Успех", en: "Success", ja: "成功" } },
  { word: "die Gewohnheit", reading: "die Gewohnheiten", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Привычка", en: "Habit", ja: "習慣" } },
  { word: "die Umwelt", reading: "unzählbar", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Окружающая среда", en: "Environment", ja: "環境" } },
  { word: "der Unterschied", reading: "die Unterschiede", studyLevel: "B1", type: "VOCABULARY", meanings: { ru: "Разница, отличие", en: "Difference", ja: "違い" } },
  { word: "träumen", reading: "träumte · hat geträumt", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Мечтать / Видеть сны", en: "To dream", ja: "夢を見る" } },
  { word: "vorschlagen", reading: "schlug vor · hat vorgeschlagen", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Предлагать", en: "To suggest / propose", ja: "提案する" } },
  { word: "entscheiden", reading: "entschied · hat entschieden", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Решать", en: "To decide", ja: "決める" } },
  { word: "obwohl", reading: "Konjunktion (Nebensatz)", studyLevel: "B1", type: "GRAMMAR", example: "Obwohl es regnet, gehen wir spazieren.", meanings: { ru: "Хотя (глагол в конец)", en: "Although", ja: "〜だけれども" } },
  { word: "deshalb", reading: "Konjunktionaladverb", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Поэтому (глагол на 2 месте)", en: "Therefore / That's why", ja: "そのため" } },
  { word: "Entschuldigen Sie", reading: "höflich", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Извините меня", en: "Excuse me (polite)", ja: "すみません" } },
  { word: "sich gewöhnen an", reading: "Akkusativ", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Привыкать к чему-либо", en: "To get used to", ja: "〜に慣れる" } },
  { word: "auswendig lernen", reading: "Ausdruck", studyLevel: "B1", type: "GRAMMAR", meanings: { ru: "Учить наизусть", en: "To memorize by heart", ja: "暗記する" } },

  // ───────── B2: Abstrakte Begriffe & Feinheiten (20) ─────────
  { word: "die Entscheidung", reading: "die Entscheidungen", studyLevel: "B2", type: "VOCABULARY", example: "Eine kluge Entscheidung treffen.", meanings: { ru: "Решение, выбор", en: "Decision", ja: "決断・決定" } },
  { word: "die Verantwortung", reading: "unzählbar", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Ответственность", en: "Responsibility", ja: "責任" } },
  { word: "der Zusammenhang", reading: "die Zusammenhänge", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Контекст / Взаимосвязь", en: "Context / Connection", ja: "文脈・関連性" } },
  { word: "die Entwicklung", reading: "die Entwicklungen", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Развитие / Разработка", en: "Development", ja: "開発・発展" } },
  { word: "die Voraussetzung", reading: "die Voraussetzungen", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Предпосылка / Обязательное условие", en: "Prerequisite / Condition", ja: "前提条件" } },
  { word: "die Auswirkung", reading: "die Auswirkungen", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Последствие / Воздействие", en: "Impact / Consequence", ja: "影響・結果" } },
  { word: "der Schwerpunkt", reading: "die Schwerpunkte", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Главный фокус, акцент", en: "Main focus / Priority", ja: "重点" } },
  { word: "die Herausforderung", reading: "die Herausforderungen", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Вызов, непростая задача", en: "Challenge", ja: "挑戦・難題" } },
  { word: "die Begeisterung", reading: "unzählbar", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Восторг, энтузиазм", en: "Enthusiasm", ja: "熱意" } },
  { word: "nachhaltig", reading: "[ˈnaːxˌhaltɪç]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Устойчивый, долгосрочный", en: "Sustainable / Lasting", ja: "持続可能な" } },
  { word: "zuverlässig", reading: "[ˈtsuːfɛɐ̯ˌlɛsɪç]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Надёжный, безотказный", en: "Reliable / Dependable", ja: "信頼できる" } },
  { word: "umfassend", reading: "[ˈʊmˌfasənt]", studyLevel: "B2", type: "VOCABULARY", meanings: { ru: "Всесторонний, исчерпывающий", en: "Comprehensive", ja: "包括的な" } },
  { word: "in Betracht ziehen", reading: "Nomen-Verb-Verbindung", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Принимать в расчёт / рассматривать", en: "To take into consideration", ja: "考慮に入れる" } },
  { word: "zur Verfügung stehen", reading: "Dativ", studyLevel: "B2", type: "GRAMMAR", example: "Unser Team steht Ihnen gern zur Verfügung.", meanings: { ru: "Быть в распоряжении", en: "To be available", ja: "利用可能である" } },
  { word: "Stellung nehmen zu", reading: "Dativ", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Высказать позицию по поводу", en: "To take a stance on", ja: "見解を述べる" } },
  { word: "auf den Punkt bringen", reading: "Redewendung", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Попасть в самую точку / сформулировать чётко", en: "To hit the nail on the head", ja: "要点を突く" } },
  { word: "im Gegensatz zu", reading: "Dativ", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "В отличие от", en: "In contrast to", ja: "〜とは対照的に" } },
  { word: "je ..., desto ...", reading: "Satzgefüge", studyLevel: "B2", type: "GRAMMAR", example: "Je mehr du übst, desto sicherer wirst du.", meanings: { ru: "Чем ..., тем ...", en: "The more ..., the more ...", ja: "〜すればするほど" } },
  { word: "es kommt darauf an", reading: "Redewendung", studyLevel: "B2", type: "GRAMMAR", meanings: { ru: "Это зависит от обстоятельств", en: "It depends", ja: "状況による" } },
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
    title: "React 19: Хуки use, useActionState, Optimistic UI и Server Actions",
    url: "https://react.dev/blog/2024/04/25/react-19",
    type: "DOCUMENTATION",
    tags: ["react", "frontend", "javascript"],
    note: "### Главное в React 19:\n- `use(Promise)` читает промисы прямо внутри компонентов без `useEffect`.\n- `useActionState` заменяет ручной стейт загрузки и ошибок в формах.\n- `ref` передаётся как обычный проп без `forwardRef`.",
  },
  {
    title: "TypeScript Utility Types: Pick, Omit, Partial, Record, ReturnType",
    url: "https://www.typescriptlang.org/docs/handbook/utility-types.html",
    type: "DOCUMENTATION",
    tags: ["typescript", "clean-code", "frontend"],
    note: "### Шпаргалка типов:\n- `Pick<T, 'id' | 'title'>` — выбирает только нужные поля.\n- `Omit<T, 'password'>` — исключает поля.\n- `Record<string, User>` — строгий словарь ключ → значение.\n- `ReturnType<typeof fn>` — выводит тип возврата функции.",
  },
  {
    title: "Docker & Compose Essentials: шпаргалка команд и многоэтапные сборки",
    url: "https://docs.docker.com/engine/reference/commandline/cli/",
    type: "ARTICLE",
    tags: ["docker", "devops", "backend"],
    note: "### Полезные команды:\n- `docker compose up -d --build` — пересобрать и запустить в фоне.\n- `docker compose logs -f backend` — стриминг логов сервиса.\n- `docker system prune -f` — очистка неиспользуемых слоёв.",
  },
  {
    title: "Modern Git: Rebase, Stash, Cherry-Pick и чистая история",
    url: "https://git-scm.com/book/ru/v2",
    type: "ARTICLE",
    tags: ["git", "workflow"],
    note: "### Горячие приёмы Git:\n- `git stash push -m 'wip'` — временно спрятать изменения.\n- `git rebase -i HEAD~3` — склеить или переименовать коммиты.\n- `git cherry-pick <hash>` — точечно перенести коммит.",
  },
  {
    title: "NestJS Architecture: Modules, Guards, DI и Clean Services",
    url: "https://docs.nestjs.com/",
    type: "DOCUMENTATION",
    tags: ["nestjs", "backend", "nodejs"],
    note: "### Архитектурные принципы NestJS:\n- Контроллеры отвечают только за маршрутизацию и DTO-валидацию.\n- Сервисы содержат чистую бизнес-логику и работу с Prisma.\n- `@UseGuards(AuthGuard('jwt'))` защищает эндпоинты.",
  },
  {
    title: "PostgreSQL & Prisma: индексы, N+1 и быстрые запросы",
    url: "https://www.prisma.io/docs/orm/prisma-client/queries/query-optimization-performance",
    type: "DOCUMENTATION",
    tags: ["postgresql", "prisma", "databases"],
    note: "### Чек-лист ускорения БД:\n- Используй `select` вместо загрузки всей строки.\n- Проверяй `EXPLAIN ANALYZE` на медленных запросах.\n- Выноси частые `WHERE` поля в составные `@@index`.",
  },
  {
    title: "Nginx Reverse Proxy, Gzip/Brotli и WebSockets в продакшне",
    url: "https://nginx.org/en/docs/http/ngx_http_proxy_module.html",
    type: "DOCUMENTATION",
    tags: ["nginx", "devops", "networking"],
    note: "### Памятка Nginx:\n- Всегда передавай `X-Real-IP` и `X-Forwarded-For`.\n- Для SPA-роутинга добавляй `try_files $uri $uri/ /index.html`.\n- Кэшируй `/assets/*` с `Cache-Control: public, immutable`.",
  },
  {
    title: "Web Security & JWT: CSRF, CORS, Helmet и Refresh-токены",
    url: "https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html",
    type: "ARTICLE",
    tags: ["security", "auth", "backend"],
    note: "### Базовая безопасность API:\n- Не храни секреты в коде — только `.env` / секреты CI.\n- Хэшируй пароли через `bcrypt`/`argon2` с солью.\n- Ограничивай CORS доверенными origin.",
  },
  {
    title: "Modern CSS Layout: Grid, Container Queries и CSS Custom Properties",
    url: "https://web.dev/learn/css/",
    type: "WEBSITE",
    tags: ["css", "frontend", "ui-ux"],
    note: "### Гибкая вёрстка:\n- `repeat(auto-fill, minmax(300px, 1fr))` строит адаптивные сетки без медиа-запросов.\n- CSS-переменные `var(--bg-surface)` упрощают светлую и тёмную тему.",
  },
  {
    title: "Refactoring Guru: Паттерны проектирования и чистый код",
    url: "https://refactoring.guru/design-patterns",
    type: "WEBSITE",
    tags: ["architecture", "clean-code", "patterns"],
    note: "### Топ-5 паттернов на каждый день:\n- **Strategy** — замена громоздких `switch`.\n- **Adapter** — приведение внешнего API к единому контракту.\n- **Observer** — событийная синхронизация состояния.",
  },
  {
    title: "Vite Performance & Code Splitting: Lazy Loading и Tree Shaking",
    url: "https://vite.dev/guide/build.html",
    type: "DOCUMENTATION",
    tags: ["vite", "frontend", "performance"],
    note: "### Быстрый старт приложения:\n- Используй `React.lazy()` + `<Suspense>` для тяжёлых экранов.\n- Следи за размером чанков (< 500 kB) и разделяй словари по страницам.",
  },
  {
    title: "Full-Stack Testing Crash Course: Vitest, Supertest и E2E",
    url: "https://vitest.dev/guide/",
    type: "VIDEO",
    tags: ["testing", "vitest", "quality"],
    note: "### Пирамида тестирования:\n- Быстрые unit-тесты на чистых функциях и парсерах.\n- Интеграционные Supertest-проверки ключевых HTTP-эндпоинтов.",
  },
];

export const STARTER_GITHUB_REPOSITORIES: StarterResource[] = [
  {
    title: "facebook/react",
    url: "https://github.com/facebook/react",
    type: "REPOSITORY",
    tags: ["react", "typescript", "frontend"],
    note: "Библиотека для построения пользовательских интерфейсов (React 19, Concurrent Rendering, Server Components).",
  },
  {
    title: "nestjs/nest",
    url: "https://github.com/nestjs/nest",
    type: "REPOSITORY",
    tags: ["nestjs", "typescript", "backend"],
    note: "Прогрессивный Node.js-фреймворк с модульной архитектурой — именно на нём работает серверная часть KAVAULT.",
  },
  {
    title: "prisma/prisma",
    url: "https://github.com/prisma/prisma",
    type: "REPOSITORY",
    tags: ["prisma", "postgresql", "orm"],
    note: "Типобезопасная ORM следующего поколения для PostgreSQL с декларативной схемой и миграциями.",
  },
  {
    title: "vitejs/vite",
    url: "https://github.com/vitejs/vite",
    type: "REPOSITORY",
    tags: ["vite", "bundler", "frontend"],
    note: "Сверхбыстрый сборщик и dev-сервер нового поколения на ESM и Rollup.",
  },
  {
    title: "donnemartin/system-design-primer",
    url: "https://github.com/donnemartin/system-design-primer",
    type: "REPOSITORY",
    tags: ["architecture", "system-design", "backend"],
    note: "Фундаментальное руководство по проектированию масштабных систем: кэширование, шардинг, очереди и балансировка.",
  },
  {
    title: "kamranahmedse/developer-roadmap",
    url: "https://github.com/kamranahmedse/developer-roadmap",
    type: "REPOSITORY",
    tags: ["roadmap", "career", "learning"],
    note: "Интерактивные карты развития для Frontend, Backend, DevOps, PostgreSQL и AI-инженеров.",
  },
  {
    title: "sindresorhus/awesome",
    url: "https://github.com/sindresorhus/awesome",
    type: "REPOSITORY",
    tags: ["awesome", "curation", "resources"],
    note: "Главная коллекция курируемых списков лучших библиотек и инструментов по всем технологиям.",
  },
  {
    title: "shadcn-ui/ui",
    url: "https://github.com/shadcn-ui/ui",
    type: "REPOSITORY",
    tags: ["ui", "react", "design-system"],
    note: "Эталонная архитектура переиспользуемых доступных компонентов с полным контролем над стилями.",
  },
  {
    title: "TanStack/query",
    url: "https://github.com/TanStack/query",
    type: "REPOSITORY",
    tags: ["react", "state", "caching"],
    note: "Мощное управление серверным состоянием, кэшированием, ретраями и фоновой синхронизацией.",
  },
  {
    title: "pmndrs/zustand",
    url: "https://github.com/pmndrs/zustand",
    type: "REPOSITORY",
    tags: ["react", "state", "minimal"],
    note: "Минималистичный, быстрый и предсказуемый менеджер состояния без шаблонного кода.",
  },
  {
    title: "docker/compose",
    url: "https://github.com/docker/compose",
    type: "REPOSITORY",
    tags: ["docker", "devops", "containers"],
    note: "Определение и оркестрация многоконтейнерных приложений (DB + Backend + Nginx).",
  },
  {
    title: "public-apis/public-apis",
    url: "https://github.com/public-apis/public-apis",
    type: "REPOSITORY",
    tags: ["api", "projects", "ideas"],
    note: "Сотни бесплатных открытых API для пет-проектов, дашбордов и интеграций.",
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

export function getStarterPackCounts(studyLanguage: StudyLanguage) {
  const langPack = studyLanguageToPackType(studyLanguage);
  const langCount = CARD_STARTER_SET_BY_PACK[langPack].size;
  const devCount = STARTER_DEVELOPER_RESOURCES.length;
  const gitCount = STARTER_GITHUB_REPOSITORIES.length;
  return {
    langCount,
    devCount,
    gitCount,
    totalCount: langCount + devCount + gitCount,
  };
}

export function getMissingStarterCount(
  pack: StarterPackType,
  cards?: Array<{ word: string }>,
  resources?: Array<{ url: string }>,
): number {
  if (pack === "japanese" || pack === "english" || pack === "german") {
    const starterWords = CARD_STARTER_SET_BY_PACK[pack];
    if (!cards) return starterWords.size;
    const existing = new Set(cards.map((c) => c.word));
    let missing = 0;
    starterWords.forEach((w) => {
      if (!existing.has(w)) missing += 1;
    });
    return missing;
  }

  const starterUrls = RESOURCE_STARTER_SET_BY_PACK[pack];
  if (!resources) return starterUrls.size;
  const existingUrls = new Set(resources.map((r) => r.url));
  let missing = 0;
  starterUrls.forEach((u) => {
    if (!existingUrls.has(u)) missing += 1;
  });
  return missing;
}

export function isPackClaimed(
  pack: StarterPackType,
  cards?: Array<{ word: string }>,
  resources?: Array<{ url: string }>,
): boolean {
  const storageKey = `kavault_pack_claimed_${pack}`;

  if (pack === "japanese" || pack === "english" || pack === "german") {
    if (cards !== undefined) {
      const missing = getMissingStarterCount(pack, cards);
      if (missing > 0) {
        localStorage.removeItem(storageKey);
        return false;
      }
      return true;
    }
    return localStorage.getItem(storageKey) === "true";
  }

  if (pack === "developer" || pack === "github") {
    if (resources !== undefined) {
      const missing = getMissingStarterCount(pack, undefined, resources);
      if (missing > 0) {
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
