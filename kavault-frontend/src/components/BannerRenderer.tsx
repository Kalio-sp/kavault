import React from "react";
import {
  BANNER_THEMES,
  type UserProfileCustomization,
} from "../utils/profileCosmetics";

interface BannerRendererProps {
  customization?: Partial<UserProfileCustomization>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const BannerRenderer: React.FC<BannerRendererProps> = ({
  customization,
  className = "",
  style = {},
  children,
}) => {
  const bannerThemeId = customization?.bannerThemeId || "tokyo_midnight";
  const customUrl = customization?.customBannerUrl;
  const customType = customization?.customBannerType;

  const isCustom = bannerThemeId === "custom" && Boolean(customUrl);

  const activeTheme =
    BANNER_THEMES.find((b) => b.id === bannerThemeId) || BANNER_THEMES[0];

  // Проверка: является ли кастомный баннер видеофайлом (MP4 / WebM / data:video)
  const isVideo =
    isCustom &&
    (customType === "video" ||
      (customUrl &&
        (customUrl.startsWith("data:video/") ||
          customUrl.endsWith(".mp4") ||
          customUrl.endsWith(".webm") ||
          customUrl.includes(".mp4?") ||
          customUrl.includes(".webm?"))));

  return (
    <div
      className={`kv-banner-container ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        backgroundColor: "#09090b",
        ...style,
      }}
    >
      {/* 1. Кастомное видео */}
      {isVideo && customUrl ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          src={customUrl}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      ) : isCustom && customUrl ? (
        /* 2. Кастомное изображение или анимированный GIF / WebP */
        <img
          src={customUrl}
          alt="Profile Banner"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        />
      ) : activeTheme.isAnimated ? (
        /* 3. Пресетный анимированный баннер */
        <div
          className={`kv-banner-animated ${activeTheme.animationClass || ""}`}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: activeTheme.background,
            backgroundSize: "300% 300%",
            zIndex: 0,
          }}
        />
      ) : (
        /* 4. Статический пресетный баннер */
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            background: activeTheme.background,
            zIndex: 0,
          }}
        />
      )}

      {/* Мягкая виньетка / сетка для кибер-атмосферы */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          opacity: 0.35,
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Дополнительный градиент затемнения к низу для контраста текста */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Контент поверх баннера */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
