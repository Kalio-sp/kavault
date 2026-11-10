import { Trophy, X, Sparkles } from "lucide-react";
import { useAchievements } from "../context/AchievementContext";
import { useApp } from "../context/AppContext";

export function AchievementToast() {
  const { t } = useApp();
  const { newlyUnlocked, dismissToast, openModal } = useAchievements();

  if (!newlyUnlocked) return null;

  const isSecret = newlyUnlocked.id === "secret_mr_a";

  return (
    <div
      style={{
        position: "fixed",
        top: "24px",
        right: "24px",
        zIndex: 9999,
        maxWidth: "420px",
        width: "calc(100vw - 48px)",
        animation: "slideInTop 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        onClick={() => {
          dismissToast();
          openModal();
        }}
        style={{
          cursor: "pointer",
          backgroundColor: "var(--tooltip-bg)",
          backdropFilter: "blur(16px)",
          border: isSecret ? "1px solid #eab308" : "1px solid rgba(234, 179, 8, 0.4)",
          borderRadius: "16px",
          padding: "16px 20px",
          boxShadow: isSecret
            ? "0 12px 36px rgba(234, 179, 8, 0.25), 0 0 20px rgba(168, 85, 247, 0.3)"
            : "0 10px 30px rgba(0, 0, 0, 0.25), 0 0 15px rgba(234, 179, 8, 0.15)",
          display: "flex",
          alignItems: "center",
          gap: "16px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Фоновое свечение */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: isSecret
              ? "radial-gradient(circle, rgba(234, 179, 8, 0.12) 0%, transparent 60%)"
              : "radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Значок ачивки */}
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "14px",
            background: isSecret
              ? "linear-gradient(135deg, #eab308 0%, #a855f7 100%)"
              : "linear-gradient(135deg, #f59e0b 0%, #3b82f6 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "26px",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {newlyUnlocked.icon}
        </div>

        {/* Текст */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: isSecret ? "#fbbf24" : "#f59e0b",
              marginBottom: "3px",
            }}
          >
            {isSecret ? <Sparkles size={13} /> : <Trophy size={13} />}
            {isSecret ? t.achievements.toastSecretHeader : t.achievements.toastNormalHeader}
          </div>
          <div
            style={{
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {newlyUnlocked.title}
          </div>
          <div
            style={{
              fontSize: "12px",
              color: "var(--text-secondary)",
              marginTop: "2px",
              lineHeight: 1.3,
            }}
          >
            {newlyUnlocked.description}
          </div>
          <div
            style={{
              display: "inline-block",
              marginTop: "6px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#eab308",
              backgroundColor: "rgba(234, 179, 8, 0.12)",
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            +{newlyUnlocked.points} {t.achievements.toastPointsSuffix}
          </div>
        </div>

        {/* Кнопка закрытия */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            dismissToast();
          }}
          style={{
            background: "none",
            border: "none",
            color: "var(--text-muted)",
            cursor: "pointer",
            padding: "4px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "6px",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
