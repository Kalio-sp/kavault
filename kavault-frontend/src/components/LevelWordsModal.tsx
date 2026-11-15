import React, { useState, useMemo, useEffect } from "react";
import {
  X,
  Search,
  Plus,
  Volume2,
  Trash2,
  CheckCircle2,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { speakText } from "../utils/audioPlayer";

export interface LevelWordItem {
  id: string;
  word: string;
  reading?: string | null;
  meaning: string;
  example?: string | null;
  type: "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA";
  studyLevel?: string | null;
  level: number; // SRS level
  nextReview?: string | null;
}

interface LevelWordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  levelMeta: {
    id: string;
    badge: string;
    name: string;
    desc: string;
    color: string;
  };
  cards: LevelWordItem[];
  onAddCard: (card: {
    word: string;
    reading?: string;
    meaning: string;
    example?: string;
    studyLevel: string;
    type: "VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA";
  }) => Promise<void>;
  onDeleteCard: (id: string) => Promise<void>;
  studyLanguage: string;
  ttsLang: string;
}

export const LevelWordsModal: React.FC<LevelWordsModalProps> = ({
  isOpen,
  onClose,
  levelMeta,
  cards,
  onAddCard,
  onDeleteCard,
  studyLanguage,
  ttsLang,
}) => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isAdding, setIsAdding] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newReading, setNewReading] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newType, setNewType] = useState<"VOCABULARY" | "KANJI" | "GRAMMAR" | "KANA">("VOCABULARY");
  const [submitting, setSubmitting] = useState(false);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setTypeFilter("ALL");
      setIsAdding(false);
      setNewType(studyLanguage === "ja" ? "KANJI" : "VOCABULARY");
    }
  }, [isOpen, studyLanguage]);

  // Filter cards by level, search, and type
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return cards.filter((c) => {
      if (typeFilter !== "ALL" && c.type !== typeFilter) return false;
      if (!q) return true;
      return (
        c.word.toLowerCase().includes(q) ||
        (c.reading && c.reading.toLowerCase().includes(q)) ||
        c.meaning.toLowerCase().includes(q) ||
        (c.example && c.example.toLowerCase().includes(q))
      );
    });
  }, [cards, search, typeFilter]);

  // Progress metrics within this level
  const stats = useMemo(() => {
    const total = cards.length;
    const mastered = cards.filter((c) => c.level >= 3).length;
    const learning = cards.filter((c) => c.level > 0 && c.level < 3).length;
    const newWords = cards.filter((c) => c.level === 0).length;
    return { total, mastered, learning, newWords };
  }, [cards]);

  const handlePlayAudio = (text: string) => {
    setPlayingWord(text);
    speakText(text, ttsLang, { rate: studyLanguage === "ja" ? 0.9 : 0.95 });
    setTimeout(() => setPlayingWord(null), 1200);
  };

  const handleCreateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;
    setSubmitting(true);
    try {
      await onAddCard({
        word: newWord.trim(),
        reading: newReading.trim() || undefined,
        meaning: newMeaning.trim(),
        example: newExample.trim() || undefined,
        studyLevel: levelMeta.id,
        type: newType,
      });
      setNewWord("");
      setNewReading("");
      setNewMeaning("");
      setNewExample("");
      setIsAdding(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.78)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "16px",
        paddingTop: "max(24px, env(safe-area-inset-top, 24px))",
        paddingBottom: "max(24px, env(safe-area-inset-bottom, 24px))",
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        animation: "fadeIn 0.2s ease-out",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "800px",
          marginTop: "0",
          marginBottom: "auto",
          borderRadius: "22px",
          overflow: "hidden",
          backgroundColor: "var(--surface, #121214)",
          border: `1px solid ${levelMeta.color}45`,
          boxShadow: `0 24px 70px rgba(0, 0, 0, 0.85), 0 0 1px ${levelMeta.color}60`,
          display: "flex",
          flexDirection: "column",
          maxHeight: "calc(100dvh - 48px)",
          animation: "scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          flexShrink: 0,
        }}
      >
        {/* ВЕРХНЯЯ ШАПКА УРОВНЯ */}
        <div
          style={{
            padding: "18px 20px",
            background: `linear-gradient(135deg, ${levelMeta.color}18 0%, rgba(18, 18, 20, 0.95) 75%)`,
            borderBottom: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "6px 14px",
                borderRadius: "12px",
                backgroundColor: `${levelMeta.color}25`,
                color: levelMeta.color,
                border: `1.5px solid ${levelMeta.color}`,
                fontSize: "16px",
                fontWeight: 900,
                letterSpacing: "0.05em",
                boxShadow: `0 0 16px ${levelMeta.color}35`,
              }}
            >
              {levelMeta.badge}
            </span>
            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: "18px",
                  fontWeight: 800,
                  color: "var(--text-primary, #ffffff)",
                  lineHeight: 1.2,
                }}
              >
                {levelMeta.name}
              </div>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary, #94a3b8)",
                  marginTop: "2px",
                }}
              >
                {levelMeta.desc} • <strong style={{ color: levelMeta.color }}>{stats.total} слов</strong>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={() => setIsAdding(!isAdding)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "10px",
                backgroundColor: isAdding ? "rgba(255, 255, 255, 0.1)" : `${levelMeta.color}25`,
                color: isAdding ? "var(--text-primary)" : levelMeta.color,
                border: `1px solid ${levelMeta.color}60`,
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Plus size={14} />
              {isAdding ? "Отмена" : "Добавить слово"}
            </button>

            <button
              onClick={onClose}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "var(--text-secondary, #94a3b8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
              title="Закрыть"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* СТАТИСТИКА ОСВОЕНИЯ УРОВНЯ */}
        <div
          style={{
            padding: "10px 20px",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            borderBottom: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
            display: "flex",
            alignItems: "center",
            gap: "16px",
            flexWrap: "wrap",
            fontSize: "11.5px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#10b981" }}>
            <CheckCircle2 size={13} />
            <span>Освоено: <strong>{stats.mastered}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#38bdf8" }}>
            <Sparkles size={13} />
            <span>В повторении: <strong>{stats.learning}</strong></span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "var(--text-muted)" }}>
            <BookOpen size={13} />
            <span>Новых: <strong>{stats.newWords}</strong></span>
          </div>
          <div style={{ marginLeft: "auto", color: "var(--text-muted)" }}>
            Показано: <strong>{filtered.length}</strong> из {stats.total}
          </div>
        </div>

        {/* ИНЛАЙН-ФОРМА ДОБАВЛЕНИЯ СЛОВА В УРОВЕНЬ */}
        {isAdding && (
          <form
            onSubmit={handleCreateWord}
            style={{
              padding: "16px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.03)",
              borderBottom: "1px solid var(--border, rgba(255, 255, 255, 0.1))",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "10px",
              animation: "fadeIn 0.15s ease-out",
            }}
          >
            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                Слово / Иероглиф *
              </label>
              <Input
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="Например: 勉強"
                required
                style={{ marginTop: "4px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                Чтение / Фуригана
              </label>
              <Input
                value={newReading}
                onChange={(e) => setNewReading(e.target.value)}
                placeholder="べんきょう (benkyou)"
                style={{ marginTop: "4px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                Перевод / Значение *
              </label>
              <Input
                value={newMeaning}
                onChange={(e) => setNewMeaning(e.target.value)}
                placeholder="Учёба, заниматься"
                required
                style={{ marginTop: "4px" }}
              />
            </div>

            <div>
              <label style={{ fontSize: "11px", fontWeight: 700, color: "var(--text-secondary)" }}>
                Пример предложения
              </label>
              <Input
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="毎日日本語を勉強します。"
                style={{ marginTop: "4px" }}
              />
            </div>

            <div style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                style={{
                  height: "40px",
                  backgroundColor: "var(--surface-raised, #1a1a1e)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  padding: "0 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  flex: 1,
                }}
              >
                <option value="VOCABULARY">Лексика</option>
                <option value="KANJI">Кандзи</option>
                <option value="KANA">Кана</option>
                <option value="GRAMMAR">Грамматика</option>
              </select>

              <Button
                type="submit"
                disabled={submitting}
                style={{
                  height: "40px",
                  backgroundColor: levelMeta.color,
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "0 18px",
                  whiteSpace: "nowrap",
                }}
              >
                {submitting ? "Сохранение..." : "Сохранить"}
              </Button>
            </div>
          </form>
        )}

        {/* ПОИСК И ФИЛЬТРЫ ТИПОВ */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: "1px solid var(--border, rgba(255, 255, 255, 0.08))",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: "200px" }}>
            <Input
              icon={<Search size={14} />}
              placeholder={`Поиск по словам уровня ${levelMeta.badge}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {["ALL", "VOCABULARY", "KANJI", "KANA", "GRAMMAR"].map((t) => {
              const labels: Record<string, string> = {
                ALL: "Все",
                VOCABULARY: "Слова",
                KANJI: "Кандзи",
                KANA: "Кана",
                GRAMMAR: "Грамматика",
              };
              const active = typeFilter === t;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: "8px",
                    border: active ? `1px solid ${levelMeta.color}` : "1px solid rgba(255, 255, 255, 0.1)",
                    backgroundColor: active ? `${levelMeta.color}25` : "transparent",
                    color: active ? levelMeta.color : "var(--text-secondary)",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                  }}
                >
                  {labels[t]}
                </button>
              );
            })}
          </div>
        </div>

        {/* СПИСОК СЛОВ ВЫБРАННОГО УРОВНЯ */}
        <div
          style={{
            padding: "16px 20px",
            overflowY: "auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "12px",
            flex: 1,
            alignContent: "start",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--text-muted)",
              }}
            >
              <p style={{ fontSize: "14px", margin: 0 }}>
                {search ? "Ничего не найдено по вашему запросу." : "В этом уровне пока нет добавленных слов."}
              </p>
            </div>
          ) : (
            filtered.map((item) => {
              const isMastered = item.level >= 3;
              const isLearning = item.level > 0 && item.level < 3;

              return (
                <div
                  key={item.id}
                  style={{
                    position: "relative",
                    padding: "14px 16px",
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    transition: "transform 0.15s ease, border-color 0.15s ease",
                  }}
                >
                  {/* Верхняя строка: Слово + Аудио + SRS бейдж */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: 800,
                          color: "var(--text-primary, #ffffff)",
                          lineHeight: 1.2,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.word}
                      </div>
                      {item.reading && (
                        <div
                          style={{
                            fontSize: "12px",
                            fontWeight: 600,
                            color: levelMeta.color,
                            marginTop: "2px",
                          }}
                        >
                          {item.reading}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      {/* Кнопка произношения */}
                      <button
                        onClick={() => handlePlayAudio(item.word)}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.12)",
                          backgroundColor: playingWord === item.word ? `${levelMeta.color}35` : "rgba(255, 255, 255, 0.05)",
                          color: playingWord === item.word ? levelMeta.color : "var(--text-secondary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        title="Прослушать произношение"
                      >
                        <Volume2 size={15} />
                      </button>

                      {/* Кнопка удаления */}
                      <button
                        onClick={() => onDeleteCard(item.id)}
                        style={{
                          width: "30px",
                          height: "30px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255, 255, 255, 0.08)",
                          backgroundColor: "transparent",
                          color: "var(--text-muted)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--error, #ef4444)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                        title="Удалить слово"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Значение / Перевод */}
                  <div
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 600,
                      color: "var(--text-secondary, #cbd5e1)",
                      lineHeight: 1.35,
                    }}
                  >
                    {item.meaning}
                  </div>

                  {/* Пример предложения */}
                  {item.example && (
                    <div
                      style={{
                        padding: "6px 10px",
                        borderRadius: "8px",
                        backgroundColor: "rgba(0, 0, 0, 0.35)",
                        borderLeft: `2px solid ${levelMeta.color}70`,
                        fontSize: "12px",
                        color: "var(--text-muted, #94a3b8)",
                        fontStyle: "italic",
                      }}
                    >
                      {item.example}
                    </div>
                  )}

                  {/* Нижняя плашка: Тип + SRS статус */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "auto",
                      paddingTop: "6px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.04)",
                      fontSize: "11px",
                    }}
                  >
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: "5px",
                        backgroundColor: "rgba(255, 255, 255, 0.06)",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        fontSize: "9.5px",
                      }}
                    >
                      {item.type}
                    </span>

                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: isMastered
                          ? "#10b981"
                          : isLearning
                            ? "#38bdf8"
                            : "var(--text-muted)",
                      }}
                    >
                      {isMastered
                        ? `🏆 Освоено (${item.level})`
                        : isLearning
                          ? `⚡ Уровень ${item.level}`
                          : "🌱 Новое"}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
