import { useState, useMemo } from "react";
import { Modal } from "./ui/Modal";
import {
  Trophy,
  Lock,
  CheckCircle2,
  Sparkles,
  Search,
  Award,
} from "lucide-react";
import { useAchievements } from "../context/AchievementContext";
import { useApp } from "../context/AppContext";
import { CATEGORY_LABELS_BY_LANG } from "../data/achievements";
import type {
  AchievementCategory,
  AchievementRarity,
} from "../data/achievements";

const RARITY_STYLES: Record<AchievementRarity, { border: string; bg: string; text: string }> = {
  common: {
    border: "rgba(148, 163, 184, 0.3)",
    bg: "rgba(148, 163, 184, 0.1)",
    text: "#64748b",
  },
  rare: {
    border: "rgba(59, 130, 246, 0.4)",
    bg: "rgba(59, 130, 246, 0.1)",
    text: "#3b82f6",
  },
  epic: {
    border: "rgba(168, 85, 247, 0.4)",
    bg: "rgba(168, 85, 247, 0.1)",
    text: "#a855f7",
  },
  legendary: {
    border: "rgba(234, 179, 8, 0.5)",
    bg: "rgba(234, 179, 8, 0.12)",
    text: "#eab308",
  },
};

export function AchievementsModal() {
  const { language, t, showProgramming, studyLanguage, studyText } = useApp();
  const {
    achievements,
    earnedPoints,
    totalPoints,
    rankTitle,
    isModalOpen,
    closeModal,
  } = useAchievements();

  const categoryLabels = CATEGORY_LABELS_BY_LANG[language];

  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const visibleAchievements = useMemo(() => {
    if (showProgramming) return achievements;
    return achievements.filter((ach) => ach.category !== "dev" && ach.category !== "github");
  }, [achievements, showProgramming]);

  const categories: AchievementCategory[] = showProgramming
    ? ["all", "japanese", "dev", "github", "tracker", "graph", "system", "secret"]
    : ["all", "japanese", "tracker", "graph", "system", "secret"];

  // Фильтрация ачивок
  const filteredAchievements = useMemo(() => {
    return visibleAchievements.filter((ach) => {
      const matchesCategory =
        selectedCategory === "all" ? true : ach.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        ach.title.toLowerCase().includes(q) ||
        ach.description.toLowerCase().includes(q) ||
        (ach.isSecret && !ach.unlocked && t.achievements.secretKeyword.includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [visibleAchievements, selectedCategory, searchQuery, t.achievements.secretKeyword]);

  const visibleUnlockedCount = visibleAchievements.filter((a) => a.unlocked).length;
  const visibleTotalCount = visibleAchievements.length;
  const percent = Math.round((visibleUnlockedCount / visibleTotalCount) * 100) || 0;

  return (
    <Modal isOpen={isModalOpen} onClose={closeModal} title="" size="xl">
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {/* Заголовок с рангом и прогрессом */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "24px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "12px",
                    backgroundColor: "rgba(234, 179, 8, 0.15)",
                    border: "1px solid rgba(234, 179, 8, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#f59e0b",
                  }}
                >
                  <Trophy size={24} />
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: "22px",
                      fontWeight: 800,
                      margin: 0,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {t.achievements.modalTitle}
                  </h2>
                  <div
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "2px",
                    }}
                  >
                    <Award size={14} color="#eab308" />
                    {t.achievements.rankLabel}{" "}
                    <span style={{ color: "#eab308", fontWeight: 700 }}>
                      {rankTitle}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Очки и количество */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                  {t.achievements.pointsLabel}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "#eab308" }}>
                  {earnedPoints}{" "}
                  <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>
                    / {totalPoints}
                  </span>
                </div>
              </div>

              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: "12px",
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--border)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: 600 }}>
                  {t.achievements.progressLabel}
                </div>
                <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>
                  {visibleUnlockedCount} / {visibleTotalCount}
                </div>
              </div>
            </div>
          </div>

          {/* Шкала прогресса */}
          <div style={{ marginTop: "18px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "12px",
                color: "var(--text-secondary)",
                marginBottom: "6px",
                fontWeight: 600,
              }}
            >
              <span>{t.achievements.unlockedLabel}</span>
              <span>{percent}%</span>
            </div>
            <div
              style={{
                height: "10px",
                borderRadius: "999px",
                backgroundColor: "var(--surface-raised)",
                overflow: "hidden",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${percent}%`,
                  background: "linear-gradient(90deg, #f59e0b 0%, #3b82f6 50%, #10b981 100%)",
                  borderRadius: "999px",
                  transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Панель фильтров и поиска */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {/* Поиск */}
          <div style={{ position: "relative" }}>
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "14px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text-muted)",
              }}
            />
            <input
              type="text"
              placeholder={t.achievements.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 14px 10px 42px",
                backgroundColor: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                color: "var(--text-primary)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>

          {/* Табы категорий */}
          <div
            style={{
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              paddingBottom: "4px",
            }}
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              const count =
                cat === "all"
                  ? visibleAchievements.length
                  : visibleAchievements.filter((a) => a.category === cat).length;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "20px",
                    border: "1px solid",
                    borderColor: isActive ? "var(--accent)" : "var(--border)",
                    backgroundColor: isActive ? "var(--surface-raised)" : "var(--surface)",
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.15s ease",
                  }}
                >
                  {cat === "secret" && <Sparkles size={13} color="#eab308" />}
                  {cat === "japanese" && studyLanguage !== "ja"
                    ? studyText.name
                    : categoryLabels[cat]}
                  <span
                    style={{
                      fontSize: "11px",
                      opacity: 0.75,
                      backgroundColor: "var(--surface-raised)",
                      padding: "1px 6px",
                      borderRadius: "10px",
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Сетка достижений */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "14px",
            maxHeight: "56vh",
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {filteredAchievements.map((ach) => {
            const isUnlocked = ach.unlocked;
            const isSecret = ach.isSecret;
            const rarity = RARITY_STYLES[ach.rarity];
            const rarityLabel = t.achievements.rarityLabels[ach.rarity];

            // Секретная ачивка, которая ЕЩЁ НЕ открыта
            if (isSecret && !isUnlocked) {
              return (
                <div
                  key={ach.id}
                  style={{
                    backgroundColor: "rgba(168, 85, 247, 0.06)",
                    border: "1px dashed rgba(168, 85, 247, 0.45)",
                    borderRadius: "14px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        backgroundColor: "rgba(168, 85, 247, 0.12)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "20px",
                        border: "1px solid rgba(168, 85, 247, 0.3)",
                      }}
                    >
                      ❓
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 700,
                          color: "#a855f7",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <Sparkles size={14} /> {t.achievements.secretTitle}
                      </div>
                      <div
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          marginTop: "2px",
                        }}
                      >
                        {t.achievements.secretSubtitle}
                      </div>
                    </div>
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      fontStyle: "italic",
                      lineHeight: 1.4,
                    }}
                  >
                    «{ach.secretHint || t.achievements.secretDefaultHint}»
                  </div>

                  <div
                    style={{
                      marginTop: "auto",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "6px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        color: "#a855f7",
                        backgroundColor: "rgba(168, 85, 247, 0.15)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                      }}
                    >
                      {t.achievements.secretBadge}
                    </span>
                    <span style={{ fontSize: "12px", fontWeight: 700, color: "#eab308" }}>
                      +{ach.points} XP
                    </span>
                  </div>
                </div>
              );
            }

            // Обычная или УЖЕ ОТКРЫТАЯ секретная ачивка
            return (
              <div
                key={ach.id}
                style={{
                  backgroundColor: isUnlocked
                    ? isSecret
                      ? "rgba(234, 179, 8, 0.08)"
                      : "var(--surface)"
                    : "var(--surface-raised)",
                  border: isUnlocked
                    ? isSecret
                      ? "1px solid #eab308"
                      : "1px solid var(--border)"
                    : "1px solid var(--border)",
                  borderRadius: "14px",
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  opacity: isUnlocked ? 1 : 0.65,
                  position: "relative",
                  transition: "all 0.2s ease",
                  boxShadow: isUnlocked && isSecret
                    ? "0 4px 20px rgba(234, 179, 8, 0.15)"
                    : "none",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  {/* Иконка */}
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      backgroundColor: isUnlocked ? rarity.bg : "var(--surface)",
                      border: `1px solid ${isUnlocked ? rarity.border : "var(--border)"}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      filter: isUnlocked ? "none" : "grayscale(80%)",
                      flexShrink: 0,
                    }}
                  >
                    {ach.icon}
                  </div>

                  {/* Заголовок и статус */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 700,
                        color: isUnlocked
                          ? isSecret
                            ? "#d97706"
                            : "var(--text-primary)"
                          : "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      {ach.title}
                      {isUnlocked && (
                        <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0 }} />
                      )}
                      {!isUnlocked && (
                        <Lock size={13} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: rarity.text,
                        fontWeight: 600,
                        marginTop: "2px",
                      }}
                    >
                      {isSecret ? t.achievements.rarityLabels.secretLegendary : rarityLabel}
                    </div>
                  </div>
                </div>

                {/* Описание */}
                <div
                  style={{
                    fontSize: "12px",
                    color: isUnlocked ? "var(--text-secondary)" : "var(--text-muted)",
                    lineHeight: 1.4,
                  }}
                >
                  {ach.description}
                  {isSecret && isUnlocked && ach.secretUnlockedDesc && (
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "11px",
                        color: "#d97706",
                        fontWeight: 500,
                      }}
                    >
                      💡 {ach.secretUnlockedDesc}
                    </div>
                  )}
                </div>

                {/* Подвал карточки */}
                <div
                  style={{
                    marginTop: "auto",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingTop: "6px",
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      color: isUnlocked ? "#10b981" : "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {isUnlocked ? t.achievements.statusDone : t.achievements.statusLocked}
                  </span>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: isUnlocked ? "#eab308" : "var(--text-muted)",
                    }}
                  >
                    +{ach.points} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
