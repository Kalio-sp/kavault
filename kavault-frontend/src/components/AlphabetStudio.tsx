import { useState, useMemo, useCallback } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Volume2, Sparkles, CheckCircle2, XCircle, RotateCcw, Plus } from "lucide-react";
import type { StudyLanguage } from "../data/studyVibes";
import { speakText } from "../utils/audioPlayer";

// ── ЯПОНСКИЕ ЗНАКИ (ХИРАГАНА И КАТАКАНА) ──
interface KanaItem {
  char: string;
  romaji: string;
  row: string;
  example: string;
  exampleMeaning: string;
}

const HIRAGANA_DATA: KanaItem[] = [
  // A-ряд
  { char: "あ", romaji: "a", row: "a", example: "あさ (asa)", exampleMeaning: "Утро" },
  { char: "い", romaji: "i", row: "a", example: "いぬ (inu)", exampleMeaning: "Собака" },
  { char: "う", romaji: "u", row: "a", example: "うみ (umi)", exampleMeaning: "Море" },
  { char: "え", romaji: "e", row: "a", example: "えき (eki)", exampleMeaning: "Станция" },
  { char: "お", romaji: "o", row: "a", example: "お茶 (ocha)", exampleMeaning: "Чай" },
  // Ka-ряд
  { char: "か", romaji: "ka", row: "ka", example: "かさ (kasa)", exampleMeaning: "Зонт" },
  { char: "き", romaji: "ki", row: "ka", example: "き (ki)", exampleMeaning: "Дерево" },
  { char: "く", romaji: "ku", row: "ka", example: "くるま (kuruma)", exampleMeaning: "Машина" },
  { char: "け", romaji: "ke", row: "ka", example: "けさ (kesa)", exampleMeaning: "Сегодня утром" },
  { char: "こ", romaji: "ko", row: "ka", example: "こころ (kokoro)", exampleMeaning: "Сердце" },
  // Sa-ряд
  { char: "さ", romaji: "sa", row: "sa", example: "さくら (sakura)", exampleMeaning: "Сакура" },
  { char: "し", romaji: "shi", row: "sa", example: "しろ (shiro)", exampleMeaning: "Белый" },
  { char: "す", romaji: "su", row: "sa", example: "すし (sushi)", exampleMeaning: "Суши" },
  { char: "せ", romaji: "se", row: "sa", example: "せんせい (sensei)", exampleMeaning: "Учитель" },
  { char: "そ", romaji: "so", row: "sa", example: "そら (sora)", exampleMeaning: "Небо" },
  // Ta-ряд
  { char: "た", romaji: "ta", row: "ta", example: "たいよう (taiyou)", exampleMeaning: "Солнце" },
  { char: "ち", romaji: "chi", row: "ta", example: "ちから (chikara)", exampleMeaning: "Сила" },
  { char: "つ", romaji: "tsu", row: "ta", example: "つき (tsuki)", exampleMeaning: "Луна" },
  { char: "て", romaji: "te", row: "ta", example: "て (te)", exampleMeaning: "Рука" },
  { char: "と", romaji: "to", row: "ta", example: "ともだち (tomodachi)", exampleMeaning: "Друг" },
  // Na-ряд
  { char: "な", romaji: "na", row: "na", example: "なつ (natsu)", exampleMeaning: "Лето" },
  { char: "に", romaji: "ni", row: "na", example: "にほん (nihon)", exampleMeaning: "Япония" },
  { char: "ぬ", romaji: "nu", row: "na", example: "ぬいぐるみ (nuigurumi)", exampleMeaning: "Мягкая игрушка" },
  { char: "ね", romaji: "ne", row: "na", example: "ねこ (neko)", exampleMeaning: "Кошка" },
  { char: "の", romaji: "no", row: "na", example: "のみもの (nomimono)", exampleMeaning: "Напиток" },
  // Ha-ряд
  { char: "は", romaji: "ha", row: "ha", example: "はな (hana)", exampleMeaning: "Цветок" },
  { char: "ひ", romaji: "hi", row: "ha", example: "ひと (hito)", exampleMeaning: "Человек" },
  { char: "ふ", romaji: "fu", row: "ha", example: "ふゆ (fuyu)", exampleMeaning: "Зима" },
  { char: "へ", romaji: "he", row: "ha", example: "へや (heya)", exampleMeaning: "Комната" },
  { char: "ほ", romaji: "ho", row: "ha", example: "ほし (hoshi)", exampleMeaning: "Звезда" },
  // Ma-ряд
  { char: "ま", romaji: "ma", row: "ma", example: "まち (machi)", exampleMeaning: "Город" },
  { char: "み", romaji: "mi", row: "ma", example: "みず (mizu)", exampleMeaning: "Вода" },
  { char: "む", romaji: "mu", row: "ma", example: "むし (mushi)", exampleMeaning: "Насекомое" },
  { char: "め", romaji: "me", row: "ma", example: "め (me)", exampleMeaning: "Глаз" },
  { char: "も", romaji: "mo", row: "ma", example: "もり (mori)", exampleMeaning: "Лес" },
  // Ya-ряд
  { char: "や", romaji: "ya", row: "ya", example: "やま (yama)", exampleMeaning: "Гора" },
  { char: "ゆ", romaji: "yu", row: "ya", example: "ゆき (yuki)", exampleMeaning: "Снег" },
  { char: "よ", romaji: "yo", row: "ya", example: "よる (yoru)", exampleMeaning: "Ночь" },
  // Ra-ряд
  { char: "ら", romaji: "ra", row: "ra", example: "らいねん (rainen)", exampleMeaning: "Следующий год" },
  { char: "り", romaji: "ri", row: "ra", example: "りんご (ringo)", exampleMeaning: "Яблоко" },
  { char: "る", romaji: "ru", row: "ra", example: "るす (rusu)", exampleMeaning: "Отсутствие дома" },
  { char: "れ", romaji: "re", row: "ra", example: "れい (rei)", exampleMeaning: "Ноль / пример" },
  { char: "ろ", romaji: "ro", row: "ra", example: "ろうそく (rousoku)", exampleMeaning: "Свеча" },
  // Wa-ряд & N
  { char: "わ", romaji: "wa", row: "wa", example: "わたし (watashi)", exampleMeaning: "Я" },
  { char: "を", romaji: "wo (o)", row: "wa", example: "〜を (частица)", exampleMeaning: "Винительный падеж" },
  { char: "ん", romaji: "n", row: "wa", example: "ほん (hon)", exampleMeaning: "Книга" },
];

const KATAKANA_DATA: KanaItem[] = [
  // A-ряд
  { char: "ア", romaji: "a", row: "a", example: "アイス (aisu)", exampleMeaning: "Мороженое" },
  { char: "イ", romaji: "i", row: "a", example: "インターネット (netto)", exampleMeaning: "Интернет" },
  { char: "ウ", romaji: "u", row: "a", example: "ウェブ (webu)", exampleMeaning: "Веб" },
  { char: "エ", romaji: "e", row: "a", example: "エレベーター (erebeetaa)", exampleMeaning: "Лифт" },
  { char: "オ", romaji: "o", row: "a", example: "オレンジ (orenji)", exampleMeaning: "Апельсин" },
  // Ka-ряд
  { char: "カ", romaji: "ka", row: "ka", example: "カフェ (kafe)", exampleMeaning: "Кафе" },
  { char: "キ", romaji: "ki", row: "ka", example: "キーボード (kiiboudo)", exampleMeaning: "Клавиатура" },
  { char: "ク", romaji: "ku", row: "ka", example: "クラス (kurasu)", exampleMeaning: "Класс" },
  { char: "ケ", romaji: "ke", row: "ka", example: "ケーキ (keeki)", exampleMeaning: "Торт" },
  { char: "コ", romaji: "ko", row: "ka", example: "コーヒー (koohii)", exampleMeaning: "Кофе" },
  // Sa-ряд
  { char: "サ", romaji: "sa", row: "sa", example: "サラダ (sarada)", exampleMeaning: "Салат" },
  { char: "シ", romaji: "shi", row: "sa", example: "シャツ (shatsu)", exampleMeaning: "Рубашка" },
  { char: "ス", romaji: "su", row: "sa", example: "スポーツ (supootsu)", exampleMeaning: "Спорт" },
  { char: "セ", romaji: "se", row: "sa", example: "セーター (seetaa)", exampleMeaning: "Свитер" },
  { char: "ソ", romaji: "so", row: "sa", example: "ソフト (sofuto)", exampleMeaning: "Софт / ПО" },
  // Ta-ряд
  { char: "タ", romaji: "ta", row: "ta", example: "タクシー (takushii)", exampleMeaning: "Такси" },
  { char: "チ", romaji: "chi", row: "ta", example: "チーズ (chiizu)", exampleMeaning: "Сыр" },
  { char: "ツ", romaji: "tsu", row: "ta", example: "ツアー (tsuaa)", exampleMeaning: "Тур" },
  { char: "テ", romaji: "te", row: "ta", example: "テスト (tesuto)", exampleMeaning: "Тест" },
  { char: "ト", romaji: "to", row: "ta", example: "トマト (tomato)", exampleMeaning: "Томат" },
  // Na-ряд
  { char: "ナ", romaji: "na", row: "na", example: "ナイフ (naifu)", exampleMeaning: "Нож" },
  { char: "ニ", romaji: "ni", row: "na", example: "ニュース (nyuusu)", exampleMeaning: "Новости" },
  { char: "ヌ", romaji: "nu", row: "na", example: "ヌードル (nuudoru)", exampleMeaning: "Лапша" },
  { char: "ネ", romaji: "ne", row: "na", example: "ネクタイ (nekutai)", exampleMeaning: "Галстук" },
  { char: "ノ", romaji: "no", row: "na", example: "ノート (nooto)", exampleMeaning: "Тетрадь" },
  // Ha-ряд
  { char: "ハ", romaji: "ha", row: "ha", example: "ハンバーガー (hanbaagaa)", exampleMeaning: "Бургер" },
  { char: "ヒ", romaji: "hi", row: "ha", example: "ヒント (hinto)", exampleMeaning: "Подсказка" },
  { char: "フ", romaji: "fu", row: "ha", example: "フォーク (fooku)", exampleMeaning: "Вилка" },
  { char: "ヘ", romaji: "he", row: "ha", example: "ヘリコプター (herikoputaa)", exampleMeaning: "Вертолёт" },
  { char: "ホ", romaji: "ho", row: "ha", example: "ホテル (hoteru)", exampleMeaning: "Отель" },
  // Ma-ряд
  { char: "マ", romaji: "ma", row: "ma", example: "マスク (masuku)", exampleMeaning: "Маска" },
  { char: "ミ", romaji: "mi", row: "ma", example: "ミルク (miruku)", exampleMeaning: "Молоко" },
  { char: "ム", romaji: "mu", row: "ma", example: "ムービー (muubii)", exampleMeaning: "Кино" },
  { char: "メ", romaji: "me", row: "ma", example: "メニュー (menyuu)", exampleMeaning: "Меню" },
  { char: "モ", romaji: "mo", row: "ma", example: "モデル (moderu)", exampleMeaning: "Модель" },
  // Ya-ряд
  { char: "ヤ", romaji: "ya", row: "ya", example: "ヤング (yangu)", exampleMeaning: "Молодой" },
  { char: "ユ", romaji: "yu", row: "ya", example: "ユーザー (yuuzaa)", exampleMeaning: "Пользователь" },
  { char: "ヨ", romaji: "yo", row: "ya", example: "ヨット (yotto)", exampleMeaning: "Яхта" },
  // Ra-ряд
  { char: "ラ", romaji: "ra", row: "ra", example: "ラジオ (rajio)", exampleMeaning: "Радио" },
  { char: "リ", romaji: "ri", row: "ra", example: "リーダー (riidaa)", exampleMeaning: "Лидер" },
  { char: "ル", romaji: "ru", row: "ra", example: "ルール (ruuru)", exampleMeaning: "Правило" },
  { char: "レ", romaji: "re", row: "ra", example: "レストラン (resutoran)", exampleMeaning: "Ресторан" },
  { char: "ロ", romaji: "ro", row: "ra", example: "ロボット (robotto)", exampleMeaning: "Робот" },
  // Wa-ряд & N
  { char: "ワ", romaji: "wa", row: "wa", example: "ワイン (wain)", exampleMeaning: "Вино" },
  { char: "ヲ", romaji: "wo (o)", row: "wa", example: "ヲタク (wotaku)", exampleMeaning: "Отаку" },
  { char: "ン", romaji: "n", row: "wa", example: "パン (pan)", exampleMeaning: "Хлеб" },
];

const DAKUTEN_DATA: KanaItem[] = [
  { char: "が", romaji: "ga", row: "g", example: "がくせい (gakusei)", exampleMeaning: "Студент" },
  { char: "ぎ", romaji: "gi", row: "g", example: "ぎんこう (ginkou)", exampleMeaning: "Банк" },
  { char: "ぐ", romaji: "gu", row: "g", example: "ぐらい (gurai)", exampleMeaning: "Примерно" },
  { char: "げ", romaji: "ge", row: "g", example: "げんき (genki)", exampleMeaning: "Бодрый" },
  { char: "ご", romaji: "go", row: "g", example: "ごはん (gohan)", exampleMeaning: "Рис / еда" },
  { char: "ざ", romaji: "za", row: "z", example: "ざっし (zasshi)", exampleMeaning: "Журнал" },
  { char: "じ", romaji: "ji", row: "z", example: "じかん (jikan)", exampleMeaning: "Время" },
  { char: "ず", romaji: "zu", row: "z", example: "ずっと (zutto)", exampleMeaning: "Все время" },
  { char: "ぜ", romaji: "ze", row: "z", example: "ぜんぶ (zenbu)", exampleMeaning: "Всё" },
  { char: "ぞ", romaji: "zo", row: "z", example: "ぞう (zou)", exampleMeaning: "Слон" },
  { char: "だ", romaji: "da", row: "d", example: "だいがく (daigaku)", exampleMeaning: "Университет" },
  { char: "ぢ", romaji: "ji", row: "d", example: "はなぢ (hanaji)", exampleMeaning: "Кровь из носа" },
  { char: "づ", romaji: "zu", row: "d", example: "つづく (tsuzuku)", exampleMeaning: "Продолжаться" },
  { char: "で", romaji: "de", row: "d", example: "でんしゃ (densha)", exampleMeaning: "Поезд" },
  { char: "ど", romaji: "do", row: "d", example: "どこ (doko)", exampleMeaning: "Где" },
  { char: "ば", romaji: "ba", row: "b", example: "バス (basu)", exampleMeaning: "Автобус" },
  { char: "び", romaji: "bi", row: "b", example: "びょういん (byouin)", exampleMeaning: "Больница" },
  { char: "ぶ", romaji: "bu", row: "b", example: "ぶんか (bunka)", exampleMeaning: "Культура" },
  { char: "べ", romaji: "be", row: "b", example: "べんきょう (benkyou)", exampleMeaning: "Учёба" },
  { char: "ぼ", romaji: "bo", row: "b", example: "ぼく (boku)", exampleMeaning: "Я (муж.)" },
  { char: "ぱ", romaji: "pa", row: "p", example: "パン (pan)", exampleMeaning: "Хлеб" },
  { char: "ぴ", romaji: "pi", row: "p", example: "ピアノ (piano)", exampleMeaning: "Пианино" },
  { char: "ぷ", romaji: "pu", row: "p", example: "プレゼント (purezento)", exampleMeaning: "Подарок" },
  { char: "ぺ", romaji: "pe", row: "p", example: "ペン (pen)", exampleMeaning: "Ручка" },
  { char: "ぽ", romaji: "po", row: "p", example: "ポスト (posuto)", exampleMeaning: "Почта" },
];

// ── АНГЛИЙСКИЙ АЛФАВИТ ──
interface LatinLetter {
  upper: string;
  lower: string;
  name: string;
  sound: string;
  type: "vowel" | "consonant" | "special";
  example: string;
  exampleMeaning: string;
  emoji: string;
}

const ENGLISH_ALPHABET: LatinLetter[] = [
  { upper: "A", lower: "a", name: "[eɪ]", sound: "Эй", type: "vowel", example: "Apple", exampleMeaning: "Яблоко", emoji: "🍎" },
  { upper: "B", lower: "b", name: "[biː]", sound: "Би", type: "consonant", example: "Bear", exampleMeaning: "Медведь", emoji: "🐻" },
  { upper: "C", lower: "c", name: "[siː]", sound: "Си", type: "consonant", example: "Cat", exampleMeaning: "Кот", emoji: "🐱" },
  { upper: "D", lower: "d", name: "[diː]", sound: "Ди", type: "consonant", example: "Dog", exampleMeaning: "Собака", emoji: "🐶" },
  { upper: "E", lower: "e", name: "[iː]", sound: "И", type: "vowel", example: "Elephant", exampleMeaning: "Слон", emoji: "🐘" },
  { upper: "F", lower: "f", name: "[ɛf]", sound: "Эф", type: "consonant", example: "Fox", exampleMeaning: "Лиса", emoji: "🦊" },
  { upper: "G", lower: "g", name: "[dʒiː]", sound: "Джи", type: "consonant", example: "Guitar", exampleMeaning: "Гитара", emoji: "🎸" },
  { upper: "H", lower: "h", name: "[eɪtʃ]", sound: "Эйч", type: "consonant", example: "House", exampleMeaning: "Дом", emoji: "🏠" },
  { upper: "I", lower: "i", name: "[aɪ]", sound: "Ай", type: "vowel", example: "Ice", exampleMeaning: "Лёд", emoji: "❄️" },
  { upper: "J", lower: "j", name: "[dʒeɪ]", sound: "Джей", type: "consonant", example: "Jump", exampleMeaning: "Прыжок", emoji: "🦘" },
  { upper: "K", lower: "k", name: "[keɪ]", sound: "Кей", type: "consonant", example: "Kite", exampleMeaning: "Змей", emoji: "🪁" },
  { upper: "L", lower: "l", name: "[ɛl]", sound: "Эл", type: "consonant", example: "Lion", exampleMeaning: "Лев", emoji: "🦁" },
  { upper: "M", lower: "m", name: "[ɛm]", sound: "Эм", type: "consonant", example: "Moon", exampleMeaning: "Луна", emoji: "🌙" },
  { upper: "N", lower: "n", name: "[ɛn]", sound: "Эн", type: "consonant", example: "Night", exampleMeaning: "Ночь", emoji: "🌌" },
  { upper: "O", lower: "o", name: "[oʊ]", sound: "Оу", type: "vowel", example: "Ocean", exampleMeaning: "Океан", emoji: "🌊" },
  { upper: "P", lower: "p", name: "[piː]", sound: "Пи", type: "consonant", example: "Panda", exampleMeaning: "Панда", emoji: "🐼" },
  { upper: "Q", lower: "q", name: "[kjuː]", sound: "Кью", type: "consonant", example: "Queen", exampleMeaning: "Королева", emoji: "👑" },
  { upper: "R", lower: "r", name: "[ɑː]", sound: "Ар", type: "consonant", example: "Rocket", exampleMeaning: "Ракета", emoji: "🚀" },
  { upper: "S", lower: "s", name: "[ɛs]", sound: "Эс", type: "consonant", example: "Sun", exampleMeaning: "Солнце", emoji: "☀️" },
  { upper: "T", lower: "t", name: "[tiː]", sound: "Ти", type: "consonant", example: "Tiger", exampleMeaning: "Тигр", emoji: "🐯" },
  { upper: "U", lower: "u", name: "[juː]", sound: "Ю", type: "vowel", example: "Umbrella", exampleMeaning: "Зонт", emoji: "☂️" },
  { upper: "V", lower: "v", name: "[viː]", sound: "Ви", type: "consonant", example: "Volcano", exampleMeaning: "Вулкан", emoji: "🌋" },
  { upper: "W", lower: "w", name: "[ˈdʌbəl.juː]", sound: "Дабл-ю", type: "consonant", example: "Water", exampleMeaning: "Вода", emoji: "💧" },
  { upper: "X", lower: "x", name: "[ɛks]", sound: "Экс", type: "consonant", example: "Xylophone", exampleMeaning: "Ксилофон", emoji: "🎼" },
  { upper: "Y", lower: "y", name: "[waɪ]", sound: "Уай", type: "vowel", example: "Yacht", exampleMeaning: "Яхта", emoji: "⛵" },
  { upper: "Z", lower: "z", name: "[zɛd]", sound: "Зед", type: "consonant", example: "Zebra", exampleMeaning: "Зебра", emoji: "🦓" },
];

// ── НЕМЕЦКИЙ АЛФАВИТ ──
const GERMAN_ALPHABET: LatinLetter[] = [
  { upper: "A", lower: "a", name: "[aː]", sound: "А", type: "vowel", example: "der Apfel", exampleMeaning: "Яблоко", emoji: "🍎" },
  { upper: "B", lower: "b", name: "[beː]", sound: "Бе", type: "consonant", example: "der Bär", exampleMeaning: "Медведь", emoji: "🐻" },
  { upper: "C", lower: "c", name: "[tseː]", sound: "Це", type: "consonant", example: "der Computer", exampleMeaning: "Компьютер", emoji: "💻" },
  { upper: "D", lower: "d", name: "[deː]", sound: "Де", type: "consonant", example: "das Danke", exampleMeaning: "Спасибо", emoji: "🙏" },
  { upper: "E", lower: "e", name: "[eː]", sound: "Э", type: "vowel", example: "der Elefant", exampleMeaning: "Слон", emoji: "🐘" },
  { upper: "F", lower: "f", name: "[ɛf]", sound: "Эф", type: "consonant", example: "der Freund", exampleMeaning: "Друг", emoji: "🤝" },
  { upper: "G", lower: "g", name: "[geː]", sound: "Ге", type: "consonant", example: "die Gitarre", exampleMeaning: "Гитара", emoji: "🎸" },
  { upper: "H", lower: "h", name: "[haː]", sound: "Ха", type: "consonant", example: "das Haus", exampleMeaning: "Дом", emoji: "🏠" },
  { upper: "I", lower: "i", name: "[iː]", sound: "И", type: "vowel", example: "der Igel", exampleMeaning: "Ёжик", emoji: "🦔" },
  { upper: "J", lower: "j", name: "[jɔt]", sound: "Йот", type: "consonant", example: "das Jahr", exampleMeaning: "Год", emoji: "📅" },
  { upper: "K", lower: "k", name: "[kaː]", sound: "Ка", type: "consonant", example: "die Katze", exampleMeaning: "Кошка", emoji: "🐱" },
  { upper: "L", lower: "l", name: "[ɛl]", sound: "Эль", type: "consonant", example: "die Liebe", exampleMeaning: "Любовь", emoji: "❤️" },
  { upper: "M", lower: "m", name: "[ɛm]", sound: "Эм", type: "consonant", example: "der Mond", exampleMeaning: "Луна", emoji: "🌙" },
  { upper: "N", lower: "n", name: "[ɛn]", sound: "Эн", type: "consonant", example: "die Nacht", exampleMeaning: "Ночь", emoji: "🌌" },
  { upper: "O", lower: "o", name: "[oː]", sound: "О", type: "vowel", example: "der Ozean", exampleMeaning: "Океан", emoji: "🌊" },
  { upper: "P", lower: "p", name: "[peː]", sound: "Пе", type: "consonant", example: "die Pause", exampleMeaning: "Пауза", emoji: "☕" },
  { upper: "Q", lower: "q", name: "[kuː]", sound: "Ку", type: "consonant", example: "die Quelle", exampleMeaning: "Источник", emoji: "💧" },
  { upper: "R", lower: "r", name: "[ɛʁ]", sound: "Эр", type: "consonant", example: "der Regen", exampleMeaning: "Дождь", emoji: "🌧️" },
  { upper: "S", lower: "s", name: "[ɛs]", sound: "Эс", type: "consonant", example: "die Sonne", exampleMeaning: "Солнце", emoji: "☀️" },
  { upper: "T", lower: "t", name: "[teː]", sound: "Те", type: "consonant", example: "der Tag", exampleMeaning: "День", emoji: "🌅" },
  { upper: "U", lower: "u", name: "[uː]", sound: "У", type: "vowel", example: "die Uhr", exampleMeaning: "Часы", emoji: "⏱️" },
  { upper: "V", lower: "v", name: "[faʊ]", sound: "Фау", type: "consonant", example: "der Vogel", exampleMeaning: "Птица", emoji: "🐦" },
  { upper: "W", lower: "w", name: "[veː]", sound: "Ве", type: "consonant", example: "das Wasser", exampleMeaning: "Вода", emoji: "💧" },
  { upper: "X", lower: "x", name: "[ɪks]", sound: "Икс", type: "consonant", example: "das Xylofon", exampleMeaning: "Ксилофон", emoji: "🎼" },
  { upper: "Y", lower: "y", name: "[ˈʏpsilɔn]", sound: "Ипсилон", type: "vowel", example: "das Yoga", exampleMeaning: "Йога", emoji: "🧘" },
  { upper: "Z", lower: "z", name: "[tsɛt]", sound: "Цет", type: "consonant", example: "die Zeit", exampleMeaning: "Время", emoji: "⏳" },
  // Немецкие уникальные знаки: Умлауты и Эсцет
  { upper: "Ä", lower: "ä", name: "[ɛː]", sound: "Э-умлаут", type: "special", example: "die Äpfel", exampleMeaning: "Яблоки", emoji: "🍏" },
  { upper: "Ö", lower: "ö", name: "[øː]", sound: "О-умлаут", type: "special", example: "das Öl", exampleMeaning: "Масло", emoji: "🛢️" },
  { upper: "Ü", lower: "ü", name: "[yː]", sound: "У-умлаут", type: "special", example: "die Überraschung", exampleMeaning: "Сюрприз", emoji: "🎁" },
  { upper: "ß", lower: "ß", name: "[ɛs'tsɛt]", sound: "Эсцет", type: "special", example: "die Straße", exampleMeaning: "Улица", emoji: "🛣️" },
];

export function AlphabetStudio({
  studyLanguage,
  accentColor,
  ttsLang,
  onAddCard,
}: {
  studyLanguage: StudyLanguage;
  accentColor: string;
  ttsLang: string;
  onAddCard?: (card: { word: string; meaning: string; reading?: string; type: any }) => void;
}) {
  // Выбранный режим для Японского: "hiragana" | "katakana" | "dakuten" | "quiz"
  const [kanaTab, setKanaTab] = useState<"hiragana" | "katakana" | "dakuten" | "quiz">("hiragana");
  // Фильтр для Английского / Немецкого: "all" | "vowels" | "consonants" | "special" | "quiz"
  const [latinFilter, setLatinFilter] = useState<"all" | "vowels" | "consonants" | "special" | "quiz">("all");
  // Выбранный элемент для подробного просмотра
  const [selectedKana, setSelectedKana] = useState<KanaItem | null>(null);
  const [selectedLetter, setSelectedLetter] = useState<LatinLetter | null>(null);

  // Состояние викторины
  const [quizScore, setQuizScore] = useState(0);
  const [quizStreak, setQuizStreak] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<"correct" | "wrong" | null>(null);
  const [quizRound, setQuizRound] = useState(0);

  // Озвучивание текста
  const playSound = useCallback((text: string) => {
    void speakText(text, ttsLang, { rate: studyLanguage === "ja" ? 0.9 : 0.95 });
  }, [ttsLang, studyLanguage]);

  // Данные для японского
  const currentKanaList = useMemo(() => {
    if (kanaTab === "hiragana") return HIRAGANA_DATA;
    if (kanaTab === "katakana") return KATAKANA_DATA;
    if (kanaTab === "dakuten") return DAKUTEN_DATA;
    return HIRAGANA_DATA;
  }, [kanaTab]);

  // Данные для европейских языков
  const latinList = studyLanguage === "de" ? GERMAN_ALPHABET : ENGLISH_ALPHABET;
  const filteredLatin = useMemo(() => {
    if (latinFilter === "vowels") return latinList.filter((l) => l.type === "vowel");
    if (latinFilter === "consonants") return latinList.filter((l) => l.type === "consonant");
    if (latinFilter === "special") return latinList.filter((l) => l.type === "special");
    return latinList;
  }, [latinList, latinFilter]);

  // Генерация вопроса для викторины японского
  const kanaQuizQuestion = useMemo(() => {
    if (studyLanguage !== "ja" || kanaTab !== "quiz") return null;
    const pool = HIRAGANA_DATA;
    const targetIdx = (quizRound * 7 + 3) % pool.length;
    const target = pool[targetIdx];
    const wrongOptions = pool
      .filter((k) => k.romaji !== target.romaji)
      .slice(0, 3)
      .map((k) => k.romaji);
    const options = [...wrongOptions, target.romaji].sort(() => 0.5 - Math.random());
    return { target, options };
  }, [studyLanguage, kanaTab, quizRound]);

  // Генерация вопроса для викторины европейского языка
  const latinQuizQuestion = useMemo(() => {
    if (studyLanguage === "ja" || latinFilter !== "quiz") return null;
    const pool = latinList;
    const targetIdx = (quizRound * 5 + 2) % pool.length;
    const target = pool[targetIdx];
    const wrongOptions = pool
      .filter((l) => l.upper !== target.upper)
      .slice(0, 3)
      .map((l) => `${l.upper} (${l.name})`);
    const targetOption = `${target.upper} (${target.name})`;
    const options = [...wrongOptions, targetOption].sort(() => 0.5 - Math.random());
    return { target, targetOption, options };
  }, [studyLanguage, latinFilter, latinList, quizRound]);

  const handleAnswerKana = (selectedRomaji: string) => {
    if (!kanaQuizQuestion || quizFeedback !== null) return;
    if (selectedRomaji === kanaQuizQuestion.target.romaji) {
      setQuizFeedback("correct");
      setQuizScore((s) => s + 1);
      setQuizStreak((s) => s + 1);
      playSound(kanaQuizQuestion.target.char);
      setTimeout(() => {
        setQuizFeedback(null);
        setQuizRound((r) => r + 1);
      }, 700);
    } else {
      setQuizFeedback("wrong");
      setQuizStreak(0);
      playSound(kanaQuizQuestion.target.char);
      setTimeout(() => {
        setQuizFeedback(null);
      }, 1200);
    }
  };

  const handleAnswerLatin = (selectedOption: string) => {
    if (!latinQuizQuestion || quizFeedback !== null) return;
    if (selectedOption === latinQuizQuestion.targetOption) {
      setQuizFeedback("correct");
      setQuizScore((s) => s + 1);
      setQuizStreak((s) => s + 1);
      playSound(latinQuizQuestion.target.upper);
      setTimeout(() => {
        setQuizFeedback(null);
        setQuizRound((r) => r + 1);
      }, 700);
    } else {
      setQuizFeedback("wrong");
      setQuizStreak(0);
      playSound(latinQuizQuestion.target.upper);
      setTimeout(() => {
        setQuizFeedback(null);
      }, 1200);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      {/* ── 1. ВЕРХНИЙ ПЕРЕКЛЮЧАТЕЛЬ РЕЖИМОВ АЗБУКИ ── */}
      <Card style={{ padding: "10px 14px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {studyLanguage === "ja" ? (
              <>
                <button
                  type="button"
                  onClick={() => { setKanaTab("hiragana"); setSelectedKana(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: kanaTab === "hiragana" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: kanaTab === "hiragana" ? `${accentColor}25` : "transparent",
                    color: kanaTab === "hiragana" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🌸 Хирагана (46)
                </button>
                <button
                  type="button"
                  onClick={() => { setKanaTab("katakana"); setSelectedKana(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: kanaTab === "katakana" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: kanaTab === "katakana" ? `${accentColor}25` : "transparent",
                    color: kanaTab === "katakana" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ⚡ Катакана (46)
                </button>
                <button
                  type="button"
                  onClick={() => { setKanaTab("dakuten"); setSelectedKana(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: kanaTab === "dakuten" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: kanaTab === "dakuten" ? `${accentColor}25` : "transparent",
                    color: kanaTab === "dakuten" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ✨ Звонкие (25)
                </button>
                <button
                  type="button"
                  onClick={() => { setKanaTab("quiz"); setSelectedKana(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: kanaTab === "quiz" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: kanaTab === "quiz" ? `${accentColor}25` : "transparent",
                    color: kanaTab === "quiz" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🎯 Тренажер знаков
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => { setLatinFilter("all"); setSelectedLetter(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: latinFilter === "all" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: latinFilter === "all" ? `${accentColor}25` : "transparent",
                    color: latinFilter === "all" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Весь алфавит ({latinList.length})
                </button>
                <button
                  type="button"
                  onClick={() => { setLatinFilter("vowels"); setSelectedLetter(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: latinFilter === "vowels" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: latinFilter === "vowels" ? `${accentColor}25` : "transparent",
                    color: latinFilter === "vowels" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Гласные
                </button>
                <button
                  type="button"
                  onClick={() => { setLatinFilter("consonants"); setSelectedLetter(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: latinFilter === "consonants" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: latinFilter === "consonants" ? `${accentColor}25` : "transparent",
                    color: latinFilter === "consonants" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Согласные
                </button>
                {studyLanguage === "de" && (
                  <button
                    type="button"
                    onClick={() => { setLatinFilter("special"); setSelectedLetter(null); }}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "999px",
                      border: latinFilter === "special" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                      backgroundColor: latinFilter === "special" ? `${accentColor}25` : "transparent",
                      color: latinFilter === "special" ? accentColor : "var(--text-secondary)",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🇩🇪 Умлауты и ß (4)
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => { setLatinFilter("quiz"); setSelectedLetter(null); }}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "999px",
                    border: latinFilter === "quiz" ? `1.5px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: latinFilter === "quiz" ? `${accentColor}25` : "transparent",
                    color: latinFilter === "quiz" ? accentColor : "var(--text-secondary)",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  🎯 Викторина букв
                </button>
              </>
            )}
          </div>

          <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
            Нажмите на букву для озвучки и разбора
          </span>
        </div>
      </Card>

      {/* ── 2. РЕЖИМ ВИКТОРИНЫ / ТРЕНАЖЕРА (ДЛЯ ТЕЛЕФОНОВ) ── */}
      {((studyLanguage === "ja" && kanaTab === "quiz") ||
        (studyLanguage !== "ja" && latinFilter === "quiz")) && (
        <Card style={{ padding: "20px", textAlign: "center" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
              paddingBottom: "10px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Sparkles size={16} color={accentColor} />
              <span style={{ fontSize: "14px", fontWeight: 800, color: "var(--text-primary)" }}>
                Тренажер на запоминание
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", fontWeight: 700 }}>
              <span style={{ color: "var(--text-secondary)" }}>Очки: {quizScore}</span>
              <span style={{ color: accentColor }}>Серия: 🔥 {quizStreak}</span>
              <button
                type="button"
                onClick={() => { setQuizScore(0); setQuizStreak(0); setQuizRound((r) => r + 1); }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
                title="Сбросить счет"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {studyLanguage === "ja" && kanaQuizQuestion && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div
                onClick={() => playSound(kanaQuizQuestion.target.char)}
                style={{
                  fontSize: "56px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jp)",
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  padding: "10px 24px",
                  borderRadius: "16px",
                  backgroundColor: "var(--surface-raised)",
                  border: `1.5px solid ${accentColor}40`,
                  boxShadow: `0 4px 16px -4px ${accentColor}30`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                title="Нажмите для повтора звука"
              >
                <span>{kanaQuizQuestion.target.char}</span>
                <Volume2 size={22} color={accentColor} />
              </div>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Как читается этот знак?
              </span>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  width: "100%",
                  maxWidth: "340px",
                }}
              >
                {kanaQuizQuestion.options.map((opt) => (
                  <Button
                    key={opt}
                    onClick={() => handleAnswerKana(opt)}
                    style={{
                      padding: "12px",
                      fontSize: "16px",
                      fontWeight: 800,
                      backgroundColor: "var(--surface-raised)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {opt}
                  </Button>
                ))}
              </div>

              {quizFeedback === "correct" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Правильно!
                </div>
              )}
              {quizFeedback === "wrong" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--error)", fontWeight: 700 }}>
                  <XCircle size={16} /> Верный ответ: {kanaQuizQuestion.target.romaji}
                </div>
              )}
            </div>
          )}

          {studyLanguage !== "ja" && latinQuizQuestion && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
              <div
                onClick={() => playSound(latinQuizQuestion.target.upper)}
                style={{
                  fontSize: "48px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  cursor: "pointer",
                  padding: "10px 24px",
                  borderRadius: "16px",
                  backgroundColor: "var(--surface-raised)",
                  border: `1.5px solid ${accentColor}40`,
                  boxShadow: `0 4px 16px -4px ${accentColor}30`,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                }}
                title="Нажмите для повтора звука"
              >
                <span>{latinQuizQuestion.target.upper} {latinQuizQuestion.target.lower}</span>
                <Volume2 size={22} color={accentColor} />
              </div>
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                Пример слова: {latinQuizQuestion.target.emoji} {latinQuizQuestion.target.example} ({latinQuizQuestion.target.exampleMeaning})
              </span>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  width: "100%",
                  maxWidth: "340px",
                }}
              >
                {latinQuizQuestion.options.map((opt) => (
                  <Button
                    key={opt}
                    onClick={() => handleAnswerLatin(opt)}
                    style={{
                      padding: "12px",
                      fontSize: "14px",
                      fontWeight: 800,
                      backgroundColor: "var(--surface-raised)",
                      color: "var(--text-primary)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    {opt}
                  </Button>
                ))}
              </div>

              {quizFeedback === "correct" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--success)", fontWeight: 700 }}>
                  <CheckCircle2 size={16} /> Отлично! Буква изучена.
                </div>
              )}
              {quizFeedback === "wrong" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--error)", fontWeight: 700 }}>
                  <XCircle size={16} /> Правильно: {latinQuizQuestion.targetOption}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* ── 3. СЕТКА ЗНАКОВ КАНЫ (ЯПОНСКИЙ) ── */}
      {studyLanguage === "ja" && kanaTab !== "quiz" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(64px, 1fr))",
            gap: "8px",
          }}
        >
          {currentKanaList.map((item) => {
            const isSelected = selectedKana?.char === item.char;
            return (
              <div
                key={item.char}
                onClick={() => {
                  setSelectedKana(item);
                  playSound(item.char);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 4px",
                  borderRadius: "12px",
                  backgroundColor: isSelected ? "var(--surface-raised)" : "var(--surface)",
                  border: isSelected ? `2px solid ${accentColor}` : "1px solid var(--border)",
                  boxShadow: isSelected ? `0 4px 12px -2px ${accentColor}40` : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
              >
                <span
                  style={{
                    fontSize: "24px",
                    fontWeight: 600,
                    fontFamily: "var(--font-jp)",
                    color: isSelected ? accentColor : "var(--text-primary)",
                    lineHeight: "1.2",
                  }}
                >
                  {item.char}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {item.romaji}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 4. СЕТКА БУКВ АЛФАВИТА (АНГЛИЙСКИЙ / НЕМЕЦКИЙ) ── */}
      {studyLanguage !== "ja" && latinFilter !== "quiz" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))",
            gap: "8px",
          }}
        >
          {filteredLatin.map((item) => {
            const isSelected = selectedLetter?.upper === item.upper;
            return (
              <div
                key={item.upper}
                onClick={() => {
                  setSelectedLetter(item);
                  playSound(item.upper);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "10px 4px",
                  borderRadius: "12px",
                  backgroundColor: isSelected ? "var(--surface-raised)" : "var(--surface)",
                  border: isSelected ? `2px solid ${accentColor}` : "1px solid var(--border)",
                  boxShadow: isSelected ? `0 4px 12px -2px ${accentColor}40` : "none",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  userSelect: "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "2px" }}>
                  <span
                    style={{
                      fontSize: "20px",
                      fontWeight: 800,
                      color: isSelected ? accentColor : "var(--text-primary)",
                    }}
                  >
                    {item.upper}
                  </span>
                  <span
                    style={{
                      fontSize: "15px",
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {item.lower}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    marginTop: "2px",
                  }}
                >
                  {item.name}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── 5. ДЕТАЛЬНАЯ ПАНЕЛЬ ВЫБРАННОГО ЗНАКА (МОБИЛЬНАЯ КАРТОЧКА) ── */}
      {studyLanguage === "ja" && selectedKana && (
        <Card style={{ padding: "14px 16px", border: `1.5px solid ${accentColor}` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                onClick={() => playSound(selectedKana.char)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: `${accentColor}25`,
                  color: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "30px",
                  fontWeight: 700,
                  fontFamily: "var(--font-jp)",
                  cursor: "pointer",
                }}
                title="Нажмите для озвучки"
              >
                {selectedKana.char}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                    Чтение: [{selectedKana.romaji}]
                  </span>
                  <button
                    type="button"
                    onClick={() => playSound(selectedKana.char)}
                    style={{
                      background: "none",
                      border: "none",
                      color: accentColor,
                      cursor: "pointer",
                      padding: "2px",
                    }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Пример слова: <strong>{selectedKana.example}</strong> — {selectedKana.exampleMeaning}
                </div>
              </div>
            </div>

            {onAddCard && (
              <Button
                variant="secondary"
                onClick={() => {
                  onAddCard({
                    word: selectedKana.char,
                    reading: selectedKana.romaji,
                    meaning: selectedKana.exampleMeaning,
                    type: "KANA",
                  });
                }}
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  gap: "5px",
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                }}
              >
                <Plus size={14} /> В словарь
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* ── 6. ДЕТАЛЬНАЯ ПАНЕЛЬ ВЫБРАННОЙ БУКВЫ АЛФАВИТА ── */}
      {studyLanguage !== "ja" && selectedLetter && (
        <Card style={{ padding: "14px 16px", border: `1.5px solid ${accentColor}` }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                onClick={() => playSound(selectedLetter.upper)}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "12px",
                  backgroundColor: `${accentColor}25`,
                  color: accentColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  fontWeight: 800,
                  cursor: "pointer",
                }}
                title="Нажмите для озвучки"
              >
                {selectedLetter.upper}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--text-primary)" }}>
                    Буква {selectedLetter.upper}{selectedLetter.lower} — Произношение: {selectedLetter.name} ({selectedLetter.sound})
                  </span>
                  <button
                    type="button"
                    onClick={() => playSound(`${selectedLetter.upper}, ${selectedLetter.example}`)}
                    style={{
                      background: "none",
                      border: "none",
                      color: accentColor,
                      cursor: "pointer",
                      padding: "2px",
                    }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  Пример: {selectedLetter.emoji} <strong>{selectedLetter.example}</strong> — {selectedLetter.exampleMeaning}
                </div>
              </div>
            </div>

            {onAddCard && (
              <Button
                variant="secondary"
                onClick={() => {
                  onAddCard({
                    word: selectedLetter.example,
                    reading: selectedLetter.sound,
                    meaning: selectedLetter.exampleMeaning,
                    type: "VOCABULARY",
                  });
                }}
                style={{
                  fontSize: "12px",
                  padding: "6px 12px",
                  gap: "5px",
                  color: accentColor,
                  borderColor: `${accentColor}40`,
                }}
              >
                <Plus size={14} /> Добавить «{selectedLetter.example}»
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}