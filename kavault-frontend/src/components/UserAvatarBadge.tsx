import React from "react";
import {
  AVATAR_PRESETS,
  AVATAR_FRAMES,
  type UserProfileCustomization,
} from "../utils/profileCosmetics";

interface UserAvatarBadgeProps {
  customization?: Partial<UserProfileCustomization>;
  size?: number; // диаметр в пикселях (по умолч. 48)
  username?: string;
  showOnlineDot?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const UserAvatarBadge: React.FC<UserAvatarBadgeProps> = ({
  customization,
  size = 48,
  username = "User",
  showOnlineDot = false,
  className = "",
  style = {},
  onClick,
}) => {
  const avatarType = customization?.avatarType || "preset";
  const presetId = customization?.avatarPresetId || "cyber_ronin";
  const frameId = customization?.avatarFrameId || "frame_neon_cyan";
  const customUrl = customization?.customAvatarUrl;
  const monogramColor = customization?.monogramColor || "#3b82f6";

  const preset =
    AVATAR_PRESETS.find((p) => p.id === presetId) || AVATAR_PRESETS[0];
  const frame =
    AVATAR_FRAMES.find((f) => f.id === frameId) || AVATAR_FRAMES[0];

  const fontSize = Math.max(12, Math.round(size * 0.46));
  const dotSize = Math.max(7, Math.round(size * 0.22));

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
        flexShrink: 0,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        ...style,
      }}
    >
      {/* Контейнер аватара с рамкой */}
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          boxSizing: "border-box",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: frame.border,
          boxShadow: frame.boxShadow,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          background:
            avatarType === "custom" && customUrl
              ? "#0f172a"
              : avatarType === "monogram"
              ? monogramColor
              : preset.gradient,
        }}
      >
        {avatarType === "custom" && customUrl ? (
          <img
            src={customUrl}
            alt={username}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : avatarType === "monogram" ? (
          <span
            style={{
              color: "#ffffff",
              fontWeight: 800,
              fontSize: `${fontSize}px`,
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
            }}
          >
            {username.trim() ? username.trim().charAt(0).toUpperCase() : "U"}
          </span>
        ) : (
          <span
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
            }}
            role="img"
            aria-label={preset.name}
          >
            {preset.emoji}
          </span>
        )}
      </div>

      {/* Зеленый онлайн индикатор */}
      {showOnlineDot && (
        <span
          style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            backgroundColor: "#10b981",
            border: "2px solid var(--surface, #111)",
            boxShadow: "0 0 6px #10b981",
          }}
          title="В сети"
        />
      )}
    </div>
  );
};
