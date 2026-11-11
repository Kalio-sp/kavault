import React, { useMemo, useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Trash2, Sparkles } from "lucide-react";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { api } from "../api/axios";
import type { Language } from "../i18n/translations";
import { STUDY_LEVELS, type StudyLanguage } from "../data/studyVibes";

type DelimiterOption = "auto" | "\t" | ";" | "," | "|" | " - ";
type ColumnMapping =
  | "auto"
  | "w_m"
  | "w_r_m"
  | "w_m_e"
  | "w_r_m_e";

interface ParsedCardRow {
  id: number;
  word: string;
  reading?: string;
  meaning: string;
  example?: string;
  isDuplicate: boolean;
}

interface DeckImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyLanguage: StudyLanguage;
  uiLang: Language;
  existingWords: Set<string>;
  defaultLevel: string;
  defaultCardType: "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA";
  accentColor: string;
  onImported: () => Promise<void> | void;
}

const TEXTS: Record<
  Language,
  {
    title: string;
    subtitle: string;
    uploadFile: string;
    pasteHint: string;
    delimiterLabel: string;
    autoLabel: string;
    mappingLabel: string;
    mapAuto: string;
    mapWM: string;
    mapWRM: string;
    mapWME: string;
    mapWRME: string;
    skipHeader: string;
    levelLabel: string;
    typeLabel: string;
    previewTitle: string;
    colWord: string;
    colReading: string;
    colMeaning: string;
    colExample: string;
    colStatus: string;
    statusNew: string;
    statusDup: string;
    summaryNew: string;
    summaryDups: string;
    emptyPreview: string;
    importBtn: string;
    importingBtn: string;
    successMsg: string;
    errorMsg: string;
    sampleBtn: string;
    clearBtn: string;
  }
> = {
  ru: {
    title: "Импорт колоды из Anki / CSV / Quizlet",
    subtitle:
      "Загрузите .csv, .tsv или .txt файл, либо вставьте список слов с новой строки. Дубликаты пропускаются автоматически.",
    uploadFile: "Выбрать файл (.csv / .txt / .tsv)",
    pasteHint:
      "Вставьте строки формата Anki / Quizlet / Excel, например:\nword;meaning или word[Tab]reading[Tab]meaning",
    delimiterLabel: "Разделитель:",
    autoLabel: "Авто",
    mappingLabel: "Формат колонок:",
    mapAuto: "Автоопределение",
    mapWM: "2: Слово → Перевод",
    mapWRM: "3: Слово → Чтение → Перевод",
    mapWME: "3: Слово → Перевод → Пример",
    mapWRME: "4: Слово → Чтение → Перевод → Пример",
    skipHeader: "Пропустить 1-ю строку (заголовок)",
    levelLabel: "Уровень:",
    typeLabel: "Раздел:",
    previewTitle: "Предпросмотр",
    colWord: "Слово",
    colReading: "Чтение",
    colMeaning: "Перевод",
    colExample: "Пример",
    colStatus: "Статус",
    statusNew: "Новое",
    statusDup: "Уже есть",
    summaryNew: "К импорту:",
    summaryDups: "Пропущено дублей:",
    emptyPreview: "Загрузите файл или вставьте строки выше, чтобы увидеть предпросмотр.",
    importBtn: "Импортировать карточки",
    importingBtn: "Импорт...",
    successMsg: "Успешно добавлено карточек:",
    errorMsg: "Не удалось импортировать карточки",
    sampleBtn: "Пример",
    clearBtn: "Очистить",
  },
  en: {
    title: "Import Deck from Anki / CSV / Quizlet",
    subtitle:
      "Upload a .csv, .tsv or .txt file or paste lines below. Existing cards are automatically deduplicated.",
    uploadFile: "Choose file (.csv / .txt / .tsv)",
    pasteHint:
      "Paste Anki / Quizlet / spreadsheet rows, e.g.:\nword;meaning or word[Tab]reading[Tab]meaning",
    delimiterLabel: "Delimiter:",
    autoLabel: "Auto",
    mappingLabel: "Columns:",
    mapAuto: "Auto detect",
    mapWM: "2: Word → Meaning",
    mapWRM: "3: Word → Reading → Meaning",
    mapWME: "3: Word → Meaning → Example",
    mapWRME: "4: Word → Reading → Meaning → Example",
    skipHeader: "Skip first line (header)",
    levelLabel: "Level:",
    typeLabel: "Type:",
    previewTitle: "Preview",
    colWord: "Word",
    colReading: "Reading",
    colMeaning: "Meaning",
    colExample: "Example",
    colStatus: "Status",
    statusNew: "New",
    statusDup: "Duplicate",
    summaryNew: "To import:",
    summaryDups: "Duplicates skipped:",
    emptyPreview: "Upload a file or paste rows above to preview cards.",
    importBtn: "Import cards",
    importingBtn: "Importing...",
    successMsg: "Imported cards:",
    errorMsg: "Failed to import cards",
    sampleBtn: "Sample",
    clearBtn: "Clear",
  },
  ja: {
    title: "Anki / CSV / Quizlet からインポート",
    subtitle:
      ".csv / .tsv / .txt ファイルを読み込むか、下にテキストを貼り付けてください。重複カードは自動でスキップされます。",
    uploadFile: "ファイルを選択 (.csv / .txt / .tsv)",
    pasteHint:
      "Anki / Quizlet / スプレッドシートの行を貼り付け:\n単語;意味 または 単語[Tab]読み[Tab]意味",
    delimiterLabel: "区切り文字:",
    autoLabel: "自動",
    mappingLabel: "列の形式:",
    mapAuto: "自動判定",
    mapWM: "2: 単語 → 意味",
    mapWRM: "3: 単語 → 読み → 意味",
    mapWME: "3: 単語 → 意味 → 例文",
    mapWRME: "4: 単語 → 読み → 意味 → 例文",
    skipHeader: "1行目（ヘッダー）をスキップ",
    levelLabel: "レベル:",
    typeLabel: "種類:",
    previewTitle: "プレビュー",
    colWord: "単語",
    colReading: "読み",
    colMeaning: "意味",
    colExample: "例文",
    colStatus: "状態",
    statusNew: "新規",
    statusDup: "重複",
    summaryNew: "インポート:",
    summaryDups: "重複スキップ:",
    emptyPreview: "ファイルを選択するかテキストを貼り付けるとプレビューが表示されます。",
    importBtn: "カードをインポート",
    importingBtn: "インポート中...",
    successMsg: "インポート完了:",
    errorMsg: "インポートに失敗しました",
    sampleBtn: "サンプル",
    clearBtn: "クリア",
  },
};

function cleanAnkiCell(raw: string): string {
  return raw
    .replace(/\[sound:[^\]]*\]/gi, "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\u00a0/g, " ")
    .trim();
}

function splitCsvLine(line: string, delim: string): string[] {
  if (delim === " - ") {
    return line.split(/\s+-\s+/).map(cleanAnkiCell);
  }
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (!inQuotes && ch === delim) {
      result.push(cleanAnkiCell(current));
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(cleanAnkiCell(current));
  return result;
}

function detectDelimiter(lines: string[]): string {
  const sample = lines.slice(0, 8);
  const candidates: Array<"\t" | ";" | "," | "|" | " - "> = ["\t", ";", "|", ",", " - "];
  let best: string = "\t";
  let bestScore = -1;

  for (const delim of candidates) {
    let counts = 0;
    for (const line of sample) {
      const parts = splitCsvLine(line, delim);
      if (parts.length >= 2) counts += parts.length;
    }
    if (counts > bestScore) {
      bestScore = counts;
      best = delim;
    }
  }
  return bestScore > 0 ? best : ";";
}

export function DeckImportModal({
  isOpen,
  onClose,
  studyLanguage,
  uiLang,
  existingWords,
  defaultLevel,
  defaultCardType,
  accentColor,
  onImported,
}: DeckImportModalProps) {
  const txt = TEXTS[uiLang];
  const levels = STUDY_LEVELS[studyLanguage];

  const [rawText, setRawText] = useState("");
  const [delimiter, setDelimiter] = useState<DelimiterOption>("auto");
  const [mapping, setMapping] = useState<ColumnMapping>("auto");
  const [skipHeader, setSkipHeader] = useState(false);
  const [targetLevel, setTargetLevel] = useState(defaultLevel);
  const [targetType, setTargetType] = useState<
    "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA"
  >(defaultCardType);
  const [excludedIds, setExcludedIds] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultBanner, setResultBanner] = useState<{
    type: "ok" | "err";
    text: string;
  } | null>(null);

  const parsedRows = useMemo<ParsedCardRow[]>(() => {
    const rawLines = rawText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith("#"));

    if (rawLines.length === 0) return [];
    const effectiveLines = skipHeader ? rawLines.slice(1) : rawLines;
    if (effectiveLines.length === 0) return [];

    const activeDelim =
      delimiter === "auto" ? detectDelimiter(effectiveLines) : delimiter;

    const seenInImport = new Set<string>();
    const existingLower = new Set(
      Array.from(existingWords).map((w) => w.trim().toLowerCase()),
    );

    const rows: ParsedCardRow[] = [];
    effectiveLines.forEach((line, index) => {
      const cols = splitCsvLine(line, activeDelim).filter((c, i) => i < 4 || c.length > 0);
      if (cols.length < 2) return;

      const word = cols[0];
      if (!word) return;

      let reading: string | undefined;
      let meaning = "";
      let example: string | undefined;

      if (mapping === "w_m" || (mapping === "auto" && cols.length === 2)) {
        meaning = cols[1] || "";
      } else if (mapping === "w_r_m") {
        reading = cols[1] || undefined;
        meaning = cols[2] || "";
      } else if (mapping === "w_m_e") {
        meaning = cols[1] || "";
        example = cols[2] || undefined;
      } else if (mapping === "w_r_m_e" || cols.length >= 4) {
        reading = cols[1] || undefined;
        meaning = cols[2] || "";
        example = cols[3] || undefined;
      } else {
        // auto с 3 колонками: для ja обычно word + reading + meaning, для en/de — word + meaning + example
        if (studyLanguage === "ja") {
          reading = cols[1] || undefined;
          meaning = cols[2] || "";
        } else {
          meaning = cols[1] || "";
          example = cols[2] || undefined;
        }
      }

      if (!meaning) return;
      const key = word.toLowerCase();
      const isDuplicate = existingLower.has(key) || seenInImport.has(key);
      seenInImport.add(key);

      rows.push({
        id: index,
        word,
        reading,
        meaning,
        example,
        isDuplicate,
      });
    });

    return rows;
  }, [rawText, delimiter, mapping, skipHeader, existingWords, studyLanguage]);

  const activeNewRows = useMemo(
    () => parsedRows.filter((r) => !r.isDuplicate && !excludedIds.has(r.id)),
    [parsedRows, excludedIds],
  );
  const dupCount = useMemo(
    () => parsedRows.filter((r) => r.isDuplicate).length,
    [parsedRows],
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setRawText(text);
    setExcludedIds(new Set());
    setResultBanner(null);
    e.target.value = "";
  };

  const handleLoadSample = () => {
    setExcludedIds(new Set());
    setResultBanner(null);
    if (studyLanguage === "ja") {
      setRawText(
        "図書館\tとしょかん\tбиблиотека / library\t毎日図書館へ行きます。\n約束\tやくそく\tобещание / promise\t友達と約束をしました。\n景色\tけしき\tпейзаж / view\t山の景色がきれいです。",
      );
    } else if (studyLanguage === "de") {
      setRawText(
        "die Geduld;терпение / patience;Geduld bringt Rosen.\nnachdenken;размышлять / to reflect;Ich muss darüber nachdenken.\ndie Erfahrung;опыт / experience;Das war eine gute Erfahrung.",
      );
    } else {
      setRawText(
        "resilience;устойчивость / стойкость;She showed remarkable resilience.\nconcise;лаконичный / чёткий;Keep your explanation concise.\nbreakthrough;прорыв;A major scientific breakthrough.",
      );
    }
  };

  const handleImport = async () => {
    if (activeNewRows.length === 0) return;
    setIsSubmitting(true);
    setResultBanner(null);
    try {
      const items = activeNewRows.map((row) => ({
        word: row.word,
        reading: row.reading,
        meaning: row.meaning,
        example: row.example,
        type: targetType,
        language: studyLanguage,
        studyLevel: targetLevel,
      }));
      await api.post("/japanese/bulk", {
        language: studyLanguage,
        items,
      });
      setResultBanner({
        type: "ok",
        text: `${txt.successMsg} ${items.length}`,
      });
      await onImported();
      setRawText("");
      setExcludedIds(new Set());
    } catch {
      setResultBanner({ type: "err", text: txt.errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const typeOptions: Array<{ value: "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA"; label: string }> =
    studyLanguage === "ja"
      ? [
          { value: "VOCABULARY", label: "Vocabulary (単語)" },
          { value: "KANJI", label: "Kanji (漢字)" },
          { value: "GRAMMAR", label: "Grammar (文法)" },
          { value: "KANA", label: "Kana (仮名)" },
        ]
      : [
          { value: "VOCABULARY", label: "Vocabulary" },
          { value: "GRAMMAR", label: "Grammar" },
        ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={txt.title} size="lg">
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <p style={{ margin: 0, fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
          {txt.subtitle}
        </p>

        {/* Панель загрузки файла + пример */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <label
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 14px",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${accentColor}`,
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <Upload size={15} style={{ color: accentColor }} />
            <span>{txt.uploadFile}</span>
            <input
              type="file"
              accept=".csv,.tsv,.txt,text/csv,text/plain"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
          </label>

          <Button
            type="button"
            variant="secondary"
            onClick={handleLoadSample}
            style={{ padding: "7px 12px", fontSize: "12px", gap: "6px" }}
          >
            <Sparkles size={13} /> {txt.sampleBtn}
          </Button>

          {rawText && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setRawText("");
                setExcludedIds(new Set());
                setResultBanner(null);
              }}
              style={{ padding: "7px 12px", fontSize: "12px", color: "var(--text-muted)" }}
            >
              {txt.clearBtn}
            </Button>
          )}
        </div>

        {/* Текстовое поле для вставки */}
        <textarea
          value={rawText}
          onChange={(e) => {
            setRawText(e.target.value);
            setResultBanner(null);
          }}
          placeholder={txt.pasteHint}
          rows={5}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            backgroundColor: "var(--bg-surface)",
            color: "var(--text-primary)",
            fontSize: "13px",
            fontFamily: "var(--font-mono, monospace)",
            resize: "vertical",
            outline: "none",
          }}
        />

        {/* Настройки разбора и цели */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(175px, 1fr))",
            gap: "10px",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
              {txt.delimiterLabel}
            </span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value as DelimiterOption)}
              style={{
                height: "34px",
                padding: "0 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "12.5px",
              }}
            >
              <option value="auto">{txt.autoLabel}</option>
              <option value={"\t"}>Tab (\t) — Anki / Quizlet</option>
              <option value=";">Semicolon (;)</option>
              <option value=",">Comma (,)</option>
              <option value="|">Pipe (|)</option>
              <option value=" - ">Dash ( - )</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
              {txt.mappingLabel}
            </span>
            <select
              value={mapping}
              onChange={(e) => setMapping(e.target.value as ColumnMapping)}
              style={{
                height: "34px",
                padding: "0 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "12.5px",
              }}
            >
              <option value="auto">{txt.mapAuto}</option>
              <option value="w_m">{txt.mapWM}</option>
              <option value="w_r_m">{txt.mapWRM}</option>
              <option value="w_m_e">{txt.mapWME}</option>
              <option value="w_r_m_e">{txt.mapWRME}</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
              {txt.levelLabel}
            </span>
            <select
              value={targetLevel}
              onChange={(e) => setTargetLevel(e.target.value)}
              style={{
                height: "34px",
                padding: "0 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "12.5px",
              }}
            >
              {levels.map((lvl) => (
                <option key={lvl.id} value={lvl.id}>
                  {lvl.badge}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontSize: "11px", color: "var(--text-muted)", fontWeight: 600 }}>
              {txt.typeLabel}
            </span>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value as any)}
              style={{
                height: "34px",
                padding: "0 8px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border)",
                backgroundColor: "var(--surface)",
                color: "var(--text-primary)",
                fontSize: "12.5px",
              }}
            >
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <label
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "12.5px",
            color: "var(--text-secondary)",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={skipHeader}
            onChange={(e) => setSkipHeader(e.target.checked)}
          />
          <span>{txt.skipHeader}</span>
        </label>

        {/* Предпросмотр */}
        <div
          style={{
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            backgroundColor: "var(--bg-surface)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 12px",
              borderBottom: "1px solid var(--border-subtle)",
              backgroundColor: "var(--surface)",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-primary)",
              }}
            >
              <FileSpreadsheet size={15} style={{ color: accentColor }} />
              {txt.previewTitle} ({parsedRows.length})
            </span>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Badge variant="success">
                {txt.summaryNew} {activeNewRows.length}
              </Badge>
              {dupCount > 0 && (
                <Badge variant="default">
                  {txt.summaryDups} {dupCount}
                </Badge>
              )}
            </div>
          </div>

          {parsedRows.length === 0 ? (
            <div
              style={{
                padding: "24px",
                textAlign: "center",
                fontSize: "13px",
                color: "var(--text-muted)",
              }}
            >
              {txt.emptyPreview}
            </div>
          ) : (
            <div style={{ maxHeight: "220px", overflowY: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "12.5px",
                }}
              >
                <thead>
                  <tr
                    style={{
                      textAlign: "left",
                      color: "var(--text-muted)",
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <th style={{ padding: "8px 10px" }}>{txt.colWord}</th>
                    <th style={{ padding: "8px 10px" }}>{txt.colReading}</th>
                    <th style={{ padding: "8px 10px" }}>{txt.colMeaning}</th>
                    <th style={{ padding: "8px 10px" }}>{txt.colStatus}</th>
                    <th style={{ padding: "8px 6px", width: "32px" }} />
                  </tr>
                </thead>
                <tbody>
                  {parsedRows.slice(0, 100).map((row) => {
                    const isExcluded = excludedIds.has(row.id);
                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: "1px solid var(--border-subtle)",
                          opacity: row.isDuplicate || isExcluded ? 0.45 : 1,
                        }}
                      >
                        <td
                          style={{
                            padding: "7px 10px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                          }}
                        >
                          {row.word}
                        </td>
                        <td style={{ padding: "7px 10px", color: "var(--text-secondary)" }}>
                          {row.reading || "—"}
                        </td>
                        <td style={{ padding: "7px 10px", color: "var(--text-secondary)" }}>
                          {row.meaning}
                        </td>
                        <td style={{ padding: "7px 10px" }}>
                          <Badge variant={row.isDuplicate ? "default" : "accent"}>
                            {row.isDuplicate ? txt.statusDup : txt.statusNew}
                          </Badge>
                        </td>
                        <td style={{ padding: "7px 6px" }}>
                          {!row.isDuplicate && !isExcluded && (
                            <button
                              type="button"
                              onClick={() =>
                                setExcludedIds((prev) => new Set([...prev, row.id]))
                              }
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--text-muted)",
                                cursor: "pointer",
                                padding: "2px",
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {resultBanner && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${
                resultBanner.type === "ok" ? "var(--success)" : "var(--error)"
              }`,
              color: resultBanner.type === "ok" ? "var(--success)" : "var(--error)",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            {resultBanner.type === "ok" ? (
              <CheckCircle2 size={16} />
            ) : (
              <AlertCircle size={16} />
            )}
            <span>{resultBanner.text}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
          <Button variant="ghost" onClick={onClose}>
            {uiLang === "ru" ? "Закрыть" : uiLang === "ja" ? "閉じる" : "Close"}
          </Button>
          <Button
            onClick={handleImport}
            disabled={activeNewRows.length === 0 || isSubmitting}
            style={{
              backgroundColor: accentColor,
              color: "#ffffff",
            }}
          >
            {isSubmitting
              ? txt.importingBtn
              : `${txt.importBtn} (${activeNewRows.length})`}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
