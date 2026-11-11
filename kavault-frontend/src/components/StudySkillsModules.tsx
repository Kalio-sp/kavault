import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Badge } from "./ui/Badge";
import {
  Volume2,
  Square,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Headphones,
  GraduationCap,
  Eye,
  EyeOff,
  RotateCw,
  Turtle,
  Zap,
} from "lucide-react";
import { api } from "../api/axios";
import { useApp } from "../context/AppContext";
import type { Language } from "../i18n/translations";
import type { StudyLanguage } from "../data/studyVibes";
import {
  GRAMMAR_LESSONS,
  READING_PASSAGES,
  LISTENING_DIALOGUES,
  LISTENING_PROMPTS,
  SKILL_STUDIO_TEXTS,
} from "../data/languageCurriculum";
import { speakText, stopSpeaking } from "../utils/audioPlayer";

const awardedTaskCache = new Set<string>();

async function triggerTaskMmr(
  kind:
    | "grammar_quiz"
    | "reading_quiz"
    | "listening_quiz"
    | "listening_dictation"
    | "dialogue_practice",
  itemId: string,
  onEarned?: (delta: number, totalMmr?: number) => void,
) {
  const key = `${kind}:${itemId}`;
  if (awardedTaskCache.has(key)) return;
  awardedTaskCache.add(key);
  try {
    const resp = await api.post<{
      awarded?: boolean;
      delta?: number;
      totalMmr?: number;
    }>("/social/complete-task", { kind, itemId });
    if (resp.data?.awarded && (resp.data.delta || 0) > 0) {
      onEarned?.(resp.data.delta!, resp.data.totalMmr);
    }
  } catch {
    awardedTaskCache.delete(key);
  }
}

export interface StudyPassageRecord {
  id: string;
  language: string;
  kind: string;
  level: string;
  title: string;
  content: string;
  translation: string;
  notes?: string;
  createdAt: string;
}

export interface SimpleStudyCard {
  id: string;
  word: string;
  reading?: string;
  meaning: string;
  example?: string;
  studyLevel?: string;
  type: string;
}

function speakSentence(
  text: string,
  lang: string,
  rate = 0.95,
  onEnd?: () => void,
) {
  void speakText(text, lang, { rate, onEnd });
}

const normalizeForDictation = (s: string) =>
  s
    .toLowerCase()
    .replace(/[.,!?;:'"«»„“（）()\[\]/。、！？\s]+/g, " ")
    .trim();

/* ═══════════════════════════════════════════════════════════
   1. GRAMMAR STUDIO
   ═══════════════════════════════════════════════════════════ */

export function GrammarStudio({
  studyLanguage,
  selectedLevel,
  uiLang,
  ttsLang,
  accentColor,
  secondaryColor,
  existingWords,
  onAddCard,
  customPassages,
  onRefreshPassages,
}: {
  studyLanguage: StudyLanguage;
  selectedLevel: string;
  uiLang: Language;
  ttsLang: string;
  accentColor: string;
  secondaryColor: string;
  existingWords: Set<string>;
  onAddCard: (card: {
    word: string;
    reading?: string;
    meaning: string;
    example?: string;
    studyLevel?: string;
    type: "GRAMMAR";
  }) => Promise<void>;
  customPassages: StudyPassageRecord[];
  onRefreshPassages: () => Promise<void>;
}) {
  const { setLocalMmr } = useApp();
  const labels = SKILL_STUDIO_TEXTS[uiLang].grammar;
  const allLessons = GRAMMAR_LESSONS[studyLanguage];
  const lessons = useMemo(() => {
    if (selectedLevel === "ALL") return allLessons;
    const filtered = allLessons.filter((l) => l.level === selectedLevel);
    return filtered.length > 0 ? filtered : allLessons;
  }, [allLessons, selectedLevel]);

  const [selectedId, setSelectedId] = useState(lessons[0].id);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [addingPattern, setAddingPattern] = useState<string | null>(null);
  const [mmrEarnedBanner, setMmrEarnedBanner] = useState<number | null>(null);

  // Custom grammar form
  const [noteTitle, setNoteTitle] = useState("");
  const [noteLevel, setNoteLevel] = useState(
    selectedLevel !== "ALL" ? selectedLevel : studyLanguage === "ja" ? "N5" : "A1",
  );
  const [noteContent, setNoteContent] = useState("");
  const [noteExample, setNoteExample] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    setSelectedId(lessons[0].id);
    setQuizAnswers({});
    if (selectedLevel !== "ALL") {
      setNoteLevel(selectedLevel);
    }
  }, [studyLanguage, selectedLevel, lessons]);

  const activeLesson = useMemo(
    () => lessons.find((l) => l.id === selectedId) || lessons[0],
    [lessons, selectedId],
  );

  const grammarNotes = useMemo(
    () =>
      customPassages.filter(
        (p) =>
          p.kind === "GRAMMAR" &&
          (selectedLevel === "ALL" || p.level === selectedLevel),
      ),
    [customPassages, selectedLevel],
  );

  const handleSaveCustomRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim() || !noteContent.trim()) return;
    try {
      setSavingNote(true);
      await api.post("/japanese/passages", {
        language: studyLanguage,
        kind: "GRAMMAR",
        level: noteLevel.trim() || (studyLanguage === "ja" ? "N5" : "A1"),
        title: noteTitle.trim(),
        content: noteExample.trim() || noteTitle.trim(),
        translation: noteContent.trim(),
      });
      setNoteTitle("");
      setNoteContent("");
      setNoteExample("");
      await onRefreshPassages();
    } finally {
      setSavingNote(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    await api.delete(`/japanese/passages/${id}`);
    await onRefreshPassages();
  };

  const selectedQuizIdx = quizAnswers[activeLesson.id];
  const isRuleAdded = existingWords.has(activeLesson.pattern);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Уроки грамматики */}
      <Card style={{ padding: "var(--space-6)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "var(--space-4)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <GraduationCap size={20} color={accentColor} /> {labels.curatedTitle}
          </h3>
          <Badge variant="accent">
            {lessons.length} rules
          </Badge>
        </div>

        {/* Табы выбора правила */}
        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "var(--space-5)",
          }}
        >
          {lessons.map((lesson) => {
            const active = lesson.id === activeLesson.id;
            return (
              <button
                key={lesson.id}
                type="button"
                onClick={() => setSelectedId(lesson.id)}
                style={{
                  padding: "7px 12px",
                  borderRadius: "var(--radius-md)",
                  border: active ? `2px solid ${accentColor}` : "1px solid var(--border)",
                  backgroundColor: active ? "var(--vibe-soft)" : "var(--surface-raised)",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "1px 5px",
                    borderRadius: "4px",
                    backgroundColor: active ? accentColor : "var(--surface)",
                    color: active ? "#fff" : "var(--text-muted)",
                  }}
                >
                  {lesson.level}
                </span>
                <span>{lesson.pattern.split("/")[0].trim()}</span>
              </button>
            );
          })}
        </div>

        {/* Карточка выбранного правила */}
        <div
          style={{
            padding: "var(--space-5)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--surface-raised)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "12px",
            }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <Badge variant="accent">{activeLesson.level}</Badge>
                <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 600 }}>
                  {labels.formulaLabel}
                </span>
              </div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                {activeLesson.title[uiLang]}
              </h4>
              <div
                style={{
                  display: "inline-block",
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: `${accentColor}22`,
                  border: `1px solid ${accentColor}44`,
                  color: accentColor,
                  fontWeight: 700,
                  fontSize: "15px",
                  marginTop: "2px",
                }}
              >
                {activeLesson.pattern}
              </div>
            </div>

            <Button
              variant="secondary"
              disabled={isRuleAdded || addingPattern === activeLesson.id}
              onClick={async () => {
                try {
                  setAddingPattern(activeLesson.id);
                  await onAddCard({
                    word: activeLesson.pattern,
                    reading: activeLesson.title[uiLang],
                    meaning: activeLesson.examples[0]?.tr[uiLang] || activeLesson.title[uiLang],
                    example: activeLesson.examples[0]?.target,
                    studyLevel: activeLesson.level,
                    type: "GRAMMAR",
                  });
                } finally {
                  setAddingPattern(null);
                }
              }}
              style={{
                gap: "6px",
                fontSize: "13px",
                borderColor: isRuleAdded ? "var(--success)" : "var(--vibe-banner-border)",
                color: isRuleAdded ? "var(--success)" : accentColor,
              }}
            >
              {isRuleAdded ? <CheckCircle2 size={15} /> : <Plus size={15} />}
              {isRuleAdded ? labels.addedBadge : labels.addRuleToDeck}
            </Button>
          </div>

          <p
            style={{
              margin: 0,
              fontSize: "14px",
              lineHeight: 1.65,
              color: "var(--text-secondary)",
            }}
          >
            {activeLesson.explanation[uiLang]}
          </p>

          {/* Примеры с озвучкой */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "8px",
              }}
            >
              {labels.examplesLabel}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activeLesson.examples.map((ex, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    padding: "10px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        fontFamily: studyLanguage === "ja" ? "var(--font-jp)" : "inherit",
                      }}
                    >
                      {ex.target}
                    </div>
                    {ex.reading && (
                      <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                        {ex.reading}
                      </div>
                    )}
                    <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                      {ex.tr[uiLang]}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speakSentence(ex.target, ttsLang, 0.92)}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      backgroundColor: "var(--vibe-soft)",
                      border: `1px solid ${accentColor}44`,
                      color: accentColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      flexShrink: 0,
                    }}
                  >
                    <Volume2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Быстрая проверка понимания */}
          <div
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface)",
              border: `1px dashed ${secondaryColor}66`,
            }}
          >
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: secondaryColor,
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <Sparkles size={14} /> {labels.drillLabel}
            </div>
            <div style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>
              {activeLesson.quiz.prompt}
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {activeLesson.quiz.options.map((opt, idx) => {
                const chosen = selectedQuizIdx === idx;
                const isCorrect = idx === activeLesson.quiz.correctIdx;
                let borderCol = "var(--border)";
                let bg = "var(--surface-raised)";
                if (selectedQuizIdx !== undefined) {
                  if (isCorrect) {
                    borderCol = "var(--success)";
                    bg = "rgba(16, 185, 129, 0.14)";
                  } else if (chosen) {
                    borderCol = "var(--error)";
                    bg = "rgba(239, 68, 68, 0.14)";
                  }
                }
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      setQuizAnswers((prev) => ({ ...prev, [activeLesson.id]: idx }));
                      if (idx === activeLesson.quiz.correctIdx) {
                        triggerTaskMmr(
                          "grammar_quiz",
                          `${studyLanguage}:${activeLesson.id}`,
                          (delta, totalMmr) => {
                            setMmrEarnedBanner(delta);
                            if (typeof totalMmr === "number") setLocalMmr(totalMmr);
                            setTimeout(() => setMmrEarnedBanner(null), 3200);
                          },
                        );
                      }
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${borderCol}`,
                      backgroundColor: bg,
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
            {selectedQuizIdx !== undefined && (
              <div
                style={{
                  marginTop: "10px",
                  fontSize: "13px",
                  color:
                    selectedQuizIdx === activeLesson.quiz.correctIdx
                      ? "var(--success)"
                      : "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {selectedQuizIdx === activeLesson.quiz.correctIdx ? (
                  <>
                    <CheckCircle2 size={15} /> {labels.correctFeedback}{" "}
                    <span style={{ color: "var(--text-muted)" }}>
                      ({activeLesson.quiz.hint[uiLang]})
                    </span>
                    {mmrEarnedBanner && (
                      <Badge variant="success">+{mmrEarnedBanner} Task-System MMR</Badge>
                    )}
                  </>
                ) : (
                  <>
                    <XCircle size={15} color="var(--error)" /> {labels.wrongFeedback}{" "}
                    <span>({activeLesson.quiz.hint[uiLang]})</span>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Личные заметки по грамматике */}
      <Card style={{ padding: "var(--space-6)" }}>
        <h3 style={{ margin: "0 0 var(--space-4) 0", fontSize: "16px", fontWeight: 600 }}>
          {labels.customTitle} ({grammarNotes.length})
        </h3>
        <form
          onSubmit={handleSaveCustomRule}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: "10px",
            marginBottom: "var(--space-4)",
          }}
        >
          <Input
            placeholder={labels.ruleTitlePh}
            value={noteTitle}
            onChange={(e) => setNoteTitle(e.target.value)}
            required
          />
          <Input
            placeholder={labels.levelPh}
            value={noteLevel}
            onChange={(e) => setNoteLevel(e.target.value)}
          />
          <Input
            placeholder={labels.examplePh}
            value={noteExample}
            onChange={(e) => setNoteExample(e.target.value)}
          />
          <Input
            placeholder={labels.explanationPh}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            required
          />
          <Button
            type="submit"
            disabled={savingNote}
            style={{ backgroundColor: accentColor, color: "#fff" }}
          >
            <Plus size={16} /> {labels.saveNoteBtn}
          </Button>
        </form>

        {grammarNotes.length === 0 ? (
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
            {labels.emptyCustom}
          </p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "12px",
            }}
          >
            {grammarNotes.map((note) => (
              <div
                key={note.id}
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <Badge variant="accent">{note.level}</Badge>
                  <button
                    type="button"
                    onClick={() => handleDeleteNote(note.id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      padding: "2px",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)" }}>
                  {note.title}
                </div>
                <div style={{ fontSize: "13px", color: accentColor, margin: "4px 0" }}>
                  {note.content}
                </div>
                <div style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {note.translation}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. READING STUDIO
   ═══════════════════════════════════════════════════════════ */

export function ReadingStudio({
  studyLanguage,
  selectedLevel,
  uiLang,
  ttsLang,
  accentColor,
  secondaryColor,
  existingWords,
  onAddCard,
  customPassages,
  onRefreshPassages,
}: {
  studyLanguage: StudyLanguage;
  selectedLevel: string;
  uiLang: Language;
  ttsLang: string;
  accentColor: string;
  secondaryColor: string;
  existingWords: Set<string>;
  onAddCard: (card: {
    word: string;
    reading?: string;
    meaning: string;
    studyLevel?: string;
    type: "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA";
  }) => Promise<void>;
  customPassages: StudyPassageRecord[];
  onRefreshPassages: () => Promise<void>;
}) {
  const { setLocalMmr } = useApp();
  const labels = SKILL_STUDIO_TEXTS[uiLang].reading;
  const allPassages = READING_PASSAGES[studyLanguage];
  const passages = useMemo(() => {
    if (selectedLevel === "ALL") return allPassages;
    const filtered = allPassages.filter((p) => p.level === selectedLevel);
    return filtered.length > 0 ? filtered : allPassages;
  }, [allPassages, selectedLevel]);

  const [selectedId, setSelectedId] = useState(passages[0].id);
  const [speed, setSpeed] = useState(0.95);
  const [showHints, setShowHints] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);
  const [quizChoice, setQuizChoice] = useState<Record<string, number>>({});
  const [addingWord, setAddingWord] = useState<string | null>(null);
  const [mmrEarnedBanner, setMmrEarnedBanner] = useState<number | null>(null);

  // Custom reading passage form
  const [customTitle, setCustomTitle] = useState("");
  const [customBody, setCustomBody] = useState("");
  const [customTrans, setCustomTrans] = useState("");
  const [savingText, setSavingText] = useState(false);

  const seqAbortRef = useRef(false);

  useEffect(() => {
    seqAbortRef.current = true;
    stopSpeaking();
    setSpeakingIdx(null);
    setSelectedId(passages[0].id);
    setQuizChoice({});
  }, [studyLanguage, selectedLevel, passages]);

  useEffect(() => {
    return () => {
      seqAbortRef.current = true;
      stopSpeaking();
    };
  }, []);

  const activePassage = useMemo(
    () => passages.find((p) => p.id === selectedId) || passages[0],
    [passages, selectedId],
  );

  const stopPlayback = () => {
    seqAbortRef.current = true;
    stopSpeaking();
    setSpeakingIdx(null);
  };

  const playSequence = (index = 0) => {
    if (index === 0) seqAbortRef.current = false;
    if (seqAbortRef.current || index >= activePassage.sentences.length) {
      setSpeakingIdx(null);
      return;
    }
    setSpeakingIdx(index);
    speakSentence(activePassage.sentences[index].target, ttsLang, speed, () => {
      if (!seqAbortRef.current) {
        playSequence(index + 1);
      }
    });
  };

  const userReadings = useMemo(
    () =>
      customPassages.filter(
        (p) =>
          p.kind === "READING" &&
          (selectedLevel === "ALL" || p.level === selectedLevel),
      ),
    [customPassages, selectedLevel],
  );

  const handleSaveCustomText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim() || !customBody.trim()) return;
    try {
      setSavingText(true);
      await api.post("/japanese/passages", {
        language: studyLanguage,
        kind: "READING",
        level: selectedLevel !== "ALL" ? selectedLevel : studyLanguage === "ja" ? "N5" : "A1",
        title: customTitle.trim(),
        content: customBody.trim(),
        translation: customTrans.trim() || "—",
      });
      setCustomTitle("");
      setCustomBody("");
      setCustomTrans("");
      await onRefreshPassages();
    } finally {
      setSavingText(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      <Card style={{ padding: "var(--space-6)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "var(--space-4)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "17px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <BookOpen size={20} color={accentColor} /> {labels.libraryTitle}
          </h3>

          {/* Кнопки темпа и подсказок */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {[
              { val: 0.75, label: labels.speedSlow },
              { val: 0.95, label: labels.speedNormal },
              { val: 1.15, label: labels.speedFast },
            ].map((sp) => (
              <button
                key={sp.val}
                type="button"
                onClick={() => setSpeed(sp.val)}
                style={{
                  padding: "4px 10px",
                  borderRadius: "var(--radius-md)",
                  border: speed === sp.val ? `1px solid ${accentColor}` : "1px solid var(--border)",
                  backgroundColor: speed === sp.val ? "var(--vibe-soft)" : "transparent",
                  color: speed === sp.val ? accentColor : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {sp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Селектор текстов */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
          {passages.map((p) => {
            const active = p.id === activePassage.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  stopPlayback();
                  setSelectedId(p.id);
                }}
                style={{
                  padding: "8px 14px",
                  borderRadius: "var(--radius-md)",
                  border: active ? `2px solid ${accentColor}` : "1px solid var(--border)",
                  backgroundColor: active ? "var(--vibe-soft)" : "var(--surface-raised)",
                  color: active ? "var(--text-primary)" : "var(--text-secondary)",
                  fontSize: "13px",
                  fontWeight: active ? 600 : 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span>{p.emoji}</span>
                <span>{p.title[uiLang]}</span>
                <Badge variant="default">{p.level}</Badge>
              </button>
            );
          })}
        </div>

        {/* Основной текст */}
        <div
          style={{
            padding: "var(--space-5)",
            borderRadius: "var(--radius-lg)",
            backgroundColor: "var(--surface-raised)",
            border: "1px solid var(--border)",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-4)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                {activePassage.emoji} {activePassage.title[uiLang]}
              </h4>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {activePassage.subtitle[uiLang]} · {activePassage.level}
              </div>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Button
                variant="secondary"
                onClick={() => setShowHints((v) => !v)}
                style={{ fontSize: "12px", gap: "6px" }}
              >
                {showHints ? <Eye size={14} /> : <EyeOff size={14} />} {labels.showReadingHint}
              </Button>
              <Button
                variant="secondary"
                onClick={() => setShowTrans((v) => !v)}
                style={{ fontSize: "12px", gap: "6px" }}
              >
                {showTrans ? <Eye size={14} /> : <EyeOff size={14} />} {labels.showTranslation}
              </Button>
              {speakingIdx !== null ? (
                <Button
                  variant="secondary"
                  onClick={stopPlayback}
                  style={{ fontSize: "12px", gap: "6px", borderColor: "var(--error)", color: "var(--error)" }}
                >
                  <Square size={14} /> {labels.stopAudio}
                </Button>
              ) : (
                <Button
                  onClick={() => playSequence(0)}
                  style={{ fontSize: "12px", gap: "6px", backgroundColor: accentColor, color: "#fff" }}
                >
                  <Volume2 size={14} /> {labels.playAll}
                </Button>
              )}
            </div>
          </div>

          {/* Предложения с подсветкой озвучки */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activePassage.sentences.map((s, idx) => {
              const isReadingNow = speakingIdx === idx;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    seqAbortRef.current = true;
                    setSpeakingIdx(idx);
                    speakSentence(s.target, ttsLang, speed, () => setSpeakingIdx(null));
                  }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isReadingNow ? "var(--vibe-soft)" : "var(--surface)",
                    border: isReadingNow ? `1px solid ${accentColor}` : "1px solid var(--border)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: studyLanguage === "ja" ? "19px" : "16px",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        lineHeight: 1.5,
                        fontFamily: studyLanguage === "ja" ? "var(--font-jp)" : "inherit",
                      }}
                    >
                      {s.target}
                    </div>
                    {showHints && s.reading && (
                      <div style={{ fontSize: "13px", color: accentColor, marginTop: "3px" }}>
                        {s.reading}
                      </div>
                    )}
                    {showTrans && (
                      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "4px" }}>
                        {s.tr[uiLang]}
                      </div>
                    )}
                  </div>
                  <Volume2
                    size={16}
                    color={isReadingNow ? accentColor : "var(--text-muted)"}
                    style={{ marginTop: "4px", flexShrink: 0 }}
                  />
                </div>
              );
            })}
          </div>

          {/* Ключевые слова из текста с 1-клик добавлением */}
          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-muted)",
                marginBottom: "8px",
              }}
            >
              {labels.vocabTitle}
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "10px",
              }}
            >
              {activePassage.vocab.map((v) => {
                const added = existingWords.has(v.word);
                return (
                  <div
                    key={v.word}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--radius-md)",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-primary)" }}>
                        {v.word}
                      </div>
                      {v.reading && (
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{v.reading}</div>
                      )}
                      <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                        {v.meaning[uiLang]}
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      disabled={added || addingWord === v.word}
                      onClick={async () => {
                        try {
                          setAddingWord(v.word);
                          await onAddCard({
                            word: v.word,
                            reading: v.reading,
                            meaning: v.meaning[uiLang],
                            studyLevel: activePassage.level,
                            type: v.type,
                          });
                        } finally {
                          setAddingWord(null);
                        }
                      }}
                      style={{
                        padding: "5px 9px",
                        fontSize: "11px",
                        color: added ? "var(--success)" : accentColor,
                        borderColor: added ? "var(--success)" : "var(--vibe-banner-border)",
                        flexShrink: 0,
                      }}
                    >
                      {added ? labels.addedWordBtn : `+ ${labels.addWordBtn}`}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Вопросы на понимание */}
          <div
            style={{
              padding: "var(--space-4)",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--surface)",
              border: `1px dashed ${secondaryColor}66`,
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <div style={{ fontSize: "12px", fontWeight: 700, textTransform: "uppercase", color: secondaryColor, display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              <span>{labels.quizTitle}</span>
              {mmrEarnedBanner && (
                <Badge variant="success">+{mmrEarnedBanner} Task-System MMR</Badge>
              )}
            </div>
            {activePassage.questions.map((q, qIdx) => {
              const qKey = `${activePassage.id}-${qIdx}`;
              const chosen = quizChoice[qKey];
              return (
                <div key={qKey}>
                  <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
                    {qIdx + 1}. {q.question[uiLang]}
                  </div>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {q.options[uiLang].map((opt, oIdx) => {
                      const isRight = oIdx === q.correctIdx;
                      const isPicked = chosen === oIdx;
                      let bg = "var(--surface-raised)";
                      let brd = "var(--border)";
                      if (chosen !== undefined) {
                        if (isRight) {
                          bg = "rgba(16, 185, 129, 0.16)";
                          brd = "var(--success)";
                        } else if (isPicked) {
                          bg = "rgba(239, 68, 68, 0.16)";
                          brd = "var(--error)";
                        }
                      }
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => {
                            setQuizChoice((prev) => ({ ...prev, [qKey]: oIdx }));
                            if (oIdx === q.correctIdx) {
                              triggerTaskMmr(
                                "reading_quiz",
                                `${studyLanguage}:${qKey}`,
                                (delta, totalMmr) => {
                                  setMmrEarnedBanner(delta);
                                  if (typeof totalMmr === "number") setLocalMmr(totalMmr);
                                  setTimeout(() => setMmrEarnedBanner(null), 3200);
                                },
                              );
                            }
                          }}
                          style={{
                            padding: "6px 12px",
                            borderRadius: "var(--radius-md)",
                            border: `1px solid ${brd}`,
                            backgroundColor: bg,
                            color: "var(--text-primary)",
                            fontSize: "13px",
                            cursor: "pointer",
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Мои собственные тексты */}
      <Card style={{ padding: "var(--space-6)" }}>
        <h3 style={{ margin: "0 0 var(--space-4) 0", fontSize: "16px", fontWeight: 600 }}>
          {labels.myTextsTitle} ({userReadings.length})
        </h3>
        <form
          onSubmit={handleSaveCustomText}
          style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "var(--space-4)" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px" }}>
            <Input
              placeholder={labels.titlePh}
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              required
            />
            <Input
              placeholder={labels.translationPh}
              value={customTrans}
              onChange={(e) => setCustomTrans(e.target.value)}
            />
          </div>
          <textarea
            placeholder={labels.textPh}
            value={customBody}
            onChange={(e) => setCustomBody(e.target.value)}
            rows={3}
            required
            style={{
              width: "100%",
              padding: "10px 12px",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--border)",
              backgroundColor: "var(--surface-raised)",
              color: "var(--text-primary)",
              fontFamily: "inherit",
              fontSize: "14px",
              resize: "vertical",
            }}
          />
          <div>
            <Button
              type="submit"
              disabled={savingText}
              style={{ backgroundColor: accentColor, color: "#fff", gap: "6px" }}
            >
              <Plus size={16} /> {labels.saveTextBtn}
            </Button>
          </div>
        </form>

        {userReadings.length === 0 ? (
          <p style={{ margin: 0, fontSize: "13px", color: "var(--text-muted)" }}>
            {labels.emptyCustom}
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {userReadings.map((txt) => (
              <div
                key={txt.id}
                style={{
                  padding: "14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: "15px", color: "var(--text-primary)", marginBottom: "4px" }}>
                    {txt.title}
                  </div>
                  <div style={{ fontSize: "14px", color: "var(--text-primary)", lineHeight: 1.55, marginBottom: "4px" }}>
                    {txt.content}
                  </div>
                  {txt.translation && txt.translation !== "—" && (
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{txt.translation}</div>
                  )}
                </div>
                <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => speakSentence(txt.content, ttsLang, speed)}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "var(--vibe-soft)",
                      border: `1px solid ${accentColor}44`,
                      color: accentColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Volume2 size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await api.delete(`/japanese/passages/${txt.id}`);
                      await onRefreshPassages();
                    }}
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: "transparent",
                      border: "1px solid var(--border)",
                      color: "var(--text-muted)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. LISTENING STUDIO
   ═══════════════════════════════════════════════════════════ */

export function ListeningStudio({
  studyLanguage,
  selectedLevel,
  uiLang,
  ttsLang,
  accentColor,
  secondaryColor,
  userCards,
}: {
  studyLanguage: StudyLanguage;
  selectedLevel: string;
  uiLang: Language;
  ttsLang: string;
  accentColor: string;
  secondaryColor: string;
  userCards: SimpleStudyCard[];
}) {
  const { setLocalMmr } = useApp();
  const labels = SKILL_STUDIO_TEXTS[uiLang].listening;
  const allDialogues = LISTENING_DIALOGUES[studyLanguage];
  const dialogues = useMemo(() => {
    if (selectedLevel === "ALL") return allDialogues;
    const filtered = allDialogues.filter((d) => d.level === selectedLevel);
    return filtered.length > 0 ? filtered : allDialogues;
  }, [allDialogues, selectedLevel]);

  const [mode, setMode] = useState<"dialogues" | "quiz" | "dictation">("dialogues");
  const [selectedDlgId, setSelectedDlgId] = useState(dialogues[0].id);
  const [slowMode, setSlowMode] = useState(false);
  const [showTranscript, setShowTranscript] = useState(true);
  const [playingLineIdx, setPlayingLineIdx] = useState<number | null>(null);
  const [mmrEarnedBanner, setMmrEarnedBanner] = useState<number | null>(null);

  // Audio quiz & dictation state
  const [useDeckSource, setUseDeckSource] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [pickedOption, setPickedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [dictInput, setDictInput] = useState("");
  const [dictChecked, setDictChecked] = useState<"exact" | "wrong" | null>(null);

  const dlgAbortRef = useRef(false);
  const speechRate = slowMode ? 0.68 : 0.95;

  useEffect(() => {
    dlgAbortRef.current = true;
    stopSpeaking();
    setPlayingLineIdx(null);
    setSelectedDlgId(dialogues[0].id);
    setQuizIndex(0);
    setPickedOption(null);
    setDictInput("");
    setDictChecked(null);
    setScore(0);
    setStreak(0);
  }, [studyLanguage, selectedLevel, dialogues]);

  useEffect(() => {
    return () => {
      dlgAbortRef.current = true;
      stopSpeaking();
    };
  }, []);

  const activeDialogue = useMemo(
    () => dialogues.find((d) => d.id === selectedDlgId) || dialogues[0],
    [dialogues, selectedDlgId],
  );

  const levelScopedCards = useMemo(() => {
    if (selectedLevel === "ALL") return userCards;
    const matched = userCards.filter(
      (c) => (c.studyLevel || (studyLanguage === "ja" ? "N5" : "A1")) === selectedLevel,
    );
    return matched.length >= 4 ? matched : userCards;
  }, [userCards, selectedLevel, studyLanguage]);

  const promptPool = useMemo(() => {
    if (useDeckSource && levelScopedCards.length >= 4) {
      return levelScopedCards.map((c) => ({
        level: c.studyLevel || selectedLevel,
        text: c.word,
        reading: c.reading,
        meaning: { ru: c.meaning, en: c.meaning, ja: c.meaning },
      }));
    }
    const curated = LISTENING_PROMPTS[studyLanguage];
    if (selectedLevel === "ALL") return curated;
    const filtered = curated.filter((p) => p.level === selectedLevel);
    return filtered.length > 0 ? filtered : curated;
  }, [useDeckSource, levelScopedCards, studyLanguage, selectedLevel]);

  const safeIdx = promptPool.length > 0 ? quizIndex % promptPool.length : 0;
  const currentPrompt = promptPool[safeIdx];

  const quizOptions = useMemo(() => {
    if (!currentPrompt) return [];
    const distractorSource = [
      ...promptPool.filter((_, i) => i !== safeIdx),
      ...LISTENING_PROMPTS[studyLanguage].filter((p) => p.text !== currentPrompt.text),
    ];
    const seenLabels = new Set<string>([currentPrompt.meaning[uiLang]]);
    const others: { label: string; isTarget: boolean }[] = [];
    for (const candidate of distractorSource) {
      const lbl = candidate.meaning[uiLang];
      if (!seenLabels.has(lbl)) {
        seenLabels.add(lbl);
        others.push({ label: lbl, isTarget: false });
        if (others.length === 3) break;
      }
    }
    const list = [{ label: currentPrompt.meaning[uiLang], isTarget: true }, ...others];
    return list
      .map((item, idx) => ({ ...item, sortKey: (safeIdx * 7 + idx * 13) % 19 }))
      .sort((a, b) => a.sortKey - b.sortKey);
  }, [currentPrompt, promptPool, safeIdx, uiLang, studyLanguage]);

  const stopDlg = () => {
    dlgAbortRef.current = true;
    stopSpeaking();
    setPlayingLineIdx(null);
  };

  const playFullDialogue = useCallback(
    (idx = 0) => {
      if (idx === 0) dlgAbortRef.current = false;
      if (dlgAbortRef.current) {
        setPlayingLineIdx(null);
        return;
      }
      if (idx >= activeDialogue.lines.length) {
        setPlayingLineIdx(null);
        triggerTaskMmr(
          "dialogue_practice",
          `${studyLanguage}:${activeDialogue.id}`,
          (delta, totalMmr) => {
            setMmrEarnedBanner(delta);
            if (typeof totalMmr === "number") setLocalMmr(totalMmr);
            setTimeout(() => setMmrEarnedBanner(null), 3200);
          },
        );
        return;
      }
      setPlayingLineIdx(idx);
      speakSentence(activeDialogue.lines[idx].text, ttsLang, speechRate, () => {
        if (!dlgAbortRef.current) {
          playFullDialogue(idx + 1);
        }
      });
    },
    [activeDialogue, ttsLang, speechRate, studyLanguage, setLocalMmr],
  );

  const nextTrack = () => {
    setQuizIndex((prev) => (prev + 1) % Math.max(1, promptPool.length));
    setPickedOption(null);
    setDictInput("");
    setDictChecked(null);
  };

  const handleCheckDictation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrompt || !dictInput.trim()) return;
    const normInput = normalizeForDictation(dictInput);
    const targetWords = [currentPrompt.text, currentPrompt.reading || ""]
      .filter(Boolean)
      .map(normalizeForDictation);

    if (targetWords.includes(normInput)) {
      setDictChecked("exact");
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      triggerTaskMmr(
        "listening_dictation",
        `${studyLanguage}:${currentPrompt.text.slice(0, 30)}`,
        (delta, totalMmr) => {
          setMmrEarnedBanner(delta);
          if (typeof totalMmr === "number") setLocalMmr(totalMmr);
          setTimeout(() => setMmrEarnedBanner(null), 3200);
        },
      );
    } else {
      setDictChecked("wrong");
      setStreak(0);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
      {/* Верхний переключатель подрежимов Аудирования */}
      <Card style={{ padding: "var(--space-5)" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {(
              [
                { id: "dialogues", label: labels.dialoguesTab, icon: Headphones },
                { id: "quiz", label: labels.quizTab, icon: Sparkles },
                { id: "dictation", label: labels.dictationTab, icon: Zap },
              ] as const
            ).map((m) => {
              const Icon = m.icon;
              const active = mode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    stopDlg();
                    setMode(m.id);
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "var(--radius-md)",
                    border: active ? `2px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: active ? "var(--vibe-soft)" : "var(--surface-raised)",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: active ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Icon size={15} color={active ? accentColor : "var(--text-muted)"} />
                  <span>{m.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Button
              variant="secondary"
              onClick={() => setSlowMode((v) => !v)}
              style={{
                fontSize: "12px",
                gap: "6px",
                borderColor: slowMode ? accentColor : "var(--border)",
                color: slowMode ? accentColor : "var(--text-secondary)",
              }}
            >
              <Turtle size={14} /> {slowMode ? labels.slowMode : labels.normalMode}
            </Button>
          </div>
        </div>
      </Card>

      {/* Режим 1: Живые диалоги */}
      {mode === "dialogues" && (
        <Card style={{ padding: "var(--space-6)" }}>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "var(--space-5)" }}>
            {dialogues.map((d) => {
              const active = d.id === activeDialogue.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    stopDlg();
                    setSelectedDlgId(d.id);
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "var(--radius-md)",
                    border: active ? `2px solid ${accentColor}` : "1px solid var(--border)",
                    backgroundColor: active ? "var(--vibe-soft)" : "var(--surface-raised)",
                    color: active ? "var(--text-primary)" : "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 600,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span>{d.emoji}</span>
                  <span>{d.title[uiLang]}</span>
                  <Badge variant="default">{d.level}</Badge>
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "var(--space-4)",
            }}
          >
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "18px", fontWeight: 700, color: "var(--text-primary)" }}>
                {activeDialogue.emoji} {activeDialogue.title[uiLang]}
              </h4>
              <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                {activeDialogue.scene[uiLang]}
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <Button
                variant="secondary"
                onClick={() => setShowTranscript((v) => !v)}
                style={{ fontSize: "12px", gap: "6px" }}
              >
                {showTranscript ? <EyeOff size={14} /> : <Eye size={14} />}
                {showTranscript ? labels.hideTranscript : labels.showTranscript}
              </Button>
              {playingLineIdx !== null ? (
                <Button
                  variant="secondary"
                  onClick={stopDlg}
                  style={{ fontSize: "12px", gap: "6px", borderColor: "var(--error)", color: "var(--error)" }}
                >
                  <Square size={14} /> {labels.stopPlaying}
                </Button>
              ) : (
                <Button
                  onClick={() => playFullDialogue(0)}
                  style={{ fontSize: "12px", gap: "6px", backgroundColor: accentColor, color: "#fff" }}
                >
                  <Volume2 size={14} /> {labels.playFull}
                </Button>
              )}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeDialogue.lines.map((line, i) => {
              const isPlaying = playingLineIdx === i;
              return (
                <div
                  key={i}
                  onClick={() => {
                    dlgAbortRef.current = true;
                    setPlayingLineIdx(i);
                    speakSentence(line.text, ttsLang, speechRate, () => setPlayingLineIdx(null));
                  }}
                  style={{
                    padding: "12px 14px",
                    borderRadius: "var(--radius-md)",
                    backgroundColor: isPlaying ? "var(--vibe-soft)" : "var(--surface-raised)",
                    border: isPlaying ? `1px solid ${accentColor}` : "1px solid var(--border)",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: i % 2 === 0 ? accentColor : secondaryColor,
                        marginBottom: "4px",
                      }}
                    >
                      {line.speaker}
                    </div>
                    {showTranscript ? (
                      <>
                        <div
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            fontFamily: studyLanguage === "ja" ? "var(--font-jp)" : "inherit",
                          }}
                        >
                          {line.text}
                        </div>
                        {line.reading && (
                          <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                            {line.reading}
                          </div>
                        )}
                        <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "3px" }}>
                          {line.tr[uiLang]}
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: "13px", color: "var(--text-muted)", fontStyle: "italic" }}>
                        🔊 {labels.replay}
                      </div>
                    )}
                  </div>
                  <Volume2
                    size={16}
                    color={isPlaying ? accentColor : "var(--text-muted)"}
                    style={{ flexShrink: 0 }}
                  />
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Режимы 2 и 3: Квиз & Аудио-диктант */}
      {(mode === "quiz" || mode === "dictation") && currentPrompt && (
        <Card style={{ padding: "var(--space-6)" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "var(--space-5)",
            }}
          >
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => {
                  setUseDeckSource(false);
                  setQuizIndex(0);
                  setPickedOption(null);
                }}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: !useDeckSource ? `1px solid ${accentColor}` : "1px solid var(--border)",
                  backgroundColor: !useDeckSource ? "var(--vibe-soft)" : "transparent",
                  color: !useDeckSource ? accentColor : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {labels.sourceCurated}
              </button>
              <button
                type="button"
                disabled={userCards.length < 4}
                onClick={() => {
                  setUseDeckSource(true);
                  setQuizIndex(0);
                  setPickedOption(null);
                }}
                title={userCards.length < 4 ? labels.needMoreCards : undefined}
                style={{
                  padding: "6px 12px",
                  borderRadius: "var(--radius-md)",
                  border: useDeckSource ? `1px solid ${accentColor}` : "1px solid var(--border)",
                  backgroundColor: useDeckSource ? "var(--vibe-soft)" : "transparent",
                  color: useDeckSource ? accentColor : "var(--text-muted)",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: userCards.length < 4 ? "not-allowed" : "pointer",
                  opacity: userCards.length < 4 ? 0.5 : 1,
                }}
              >
                {labels.sourceMyCards} ({userCards.length})
              </button>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              <Badge variant="accent">
                {labels.scoreLabel}: {score}
              </Badge>
              <Badge variant="success">
                🔥 {labels.streakLabel}: {streak}
              </Badge>
              {mmrEarnedBanner && (
                <Badge variant="success">+{mmrEarnedBanner} Task-System MMR</Badge>
              )}
            </div>
          </div>

          <div
            style={{
              padding: "var(--space-6)",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--surface-raised)",
              border: "1px solid var(--border)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "var(--space-4)",
            }}
          >
            <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
              {mode === "quiz" ? labels.questionPrompt : labels.dictationPrompt}
            </div>

            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
              <Button
                onClick={() => speakSentence(currentPrompt.text, ttsLang, 0.95)}
                style={{ backgroundColor: accentColor, color: "#fff", gap: "8px", padding: "10px 18px" }}
              >
                <Volume2 size={18} /> {labels.replay}
              </Button>
              <Button
                variant="secondary"
                onClick={() => speakSentence(currentPrompt.text, ttsLang, 0.65)}
                style={{ gap: "6px" }}
              >
                <Turtle size={16} /> {labels.slowMode}
              </Button>
            </div>

            {mode === "quiz" ? (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "10px",
                  width: "100%",
                  marginTop: "6px",
                }}
              >
                {quizOptions.map((opt, idx) => {
                  const chosen = pickedOption === idx;
                  let brd = "var(--border)";
                  let bg = "var(--surface)";
                  if (pickedOption !== null) {
                    if (opt.isTarget) {
                      brd = "var(--success)";
                      bg = "rgba(16, 185, 129, 0.16)";
                    } else if (chosen) {
                      brd = "var(--error)";
                      bg = "rgba(239, 68, 68, 0.16)";
                    }
                  }
                  return (
                    <button
                      key={`${safeIdx}-${idx}`}
                      type="button"
                      onClick={() => {
                        if (pickedOption !== null) return;
                        setPickedOption(idx);
                        if (opt.isTarget) {
                          setScore((s) => s + 1);
                          setStreak((st) => st + 1);
                          triggerTaskMmr(
                            "listening_quiz",
                            `${studyLanguage}:${currentPrompt.text.slice(0, 30)}`,
                            (delta, totalMmr) => {
                              setMmrEarnedBanner(delta);
                              if (typeof totalMmr === "number") setLocalMmr(totalMmr);
                              setTimeout(() => setMmrEarnedBanner(null), 3200);
                            },
                          );
                        } else {
                          setStreak(0);
                        }
                      }}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "var(--radius-md)",
                        border: `1px solid ${brd}`,
                        backgroundColor: bg,
                        color: "var(--text-primary)",
                        fontSize: "14px",
                        fontWeight: 500,
                        cursor: pickedOption === null ? "pointer" : "default",
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <form
                onSubmit={handleCheckDictation}
                style={{
                  display: "flex",
                  gap: "8px",
                  width: "100%",
                  maxWidth: "460px",
                  flexWrap: "wrap",
                  justifyContent: "center",
                }}
              >
                <div style={{ flex: "1 1 240px" }}>
                  <Input
                    placeholder={labels.dictationPlaceholder}
                    value={dictInput}
                    onChange={(e) => setDictInput(e.target.value)}
                  />
                </div>
                <Button
                  type="submit"
                  style={{ backgroundColor: accentColor, color: "#fff" }}
                >
                  {labels.checkBtn}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setDictChecked("wrong")}
                >
                  {labels.revealBtn}
                </Button>
              </form>
            )}

            {(pickedOption !== null || dictChecked !== null) && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  width: "100%",
                  maxWidth: "520px",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "14px",
                    color:
                      dictChecked === "exact" ||
                      (pickedOption !== null && quizOptions[pickedOption]?.isTarget)
                        ? "var(--success)"
                        : accentColor,
                    marginBottom: "4px",
                  }}
                >
                  {dictChecked === "exact" ? labels.perfectMatch : labels.answerPrefix}{" "}
                  <span style={{ color: "var(--text-primary)" }}>{currentPrompt.text}</span>
                </div>
                {currentPrompt.reading && (
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                    {currentPrompt.reading}
                  </div>
                )}
                <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginTop: "2px" }}>
                  {currentPrompt.meaning[uiLang]}
                </div>
              </div>
            )}

            <Button
              variant="secondary"
              onClick={nextTrack}
              style={{ gap: "6px", marginTop: "4px" }}
            >
              <RotateCw size={15} /> {labels.nextBtn}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
