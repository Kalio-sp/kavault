import React, { useState, useEffect, useRef, useCallback } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
}

const getSplashSrc = () => {
  try {
    if (typeof window !== "undefined" && (window as any).kavaultDesktop?.splashPath) {
      return (window as any).kavaultDesktop.splashPath;
    }
    if (typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
      return "/splash.mp4";
    }
    const base = import.meta.env.BASE_URL || "./";
    return `${base.replace(/\/$/, "")}/splash.mp4`;
  } catch {
    return "./splash.mp4";
  }
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const safetyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleComplete = useCallback(() => {
    if (fading) return;
    setFading(true);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);

    setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 500);
  }, [fading, onFinish]);

  // Слушатель ручного перезапуска заставки из настроек
  useEffect(() => {
    const handleReplay = () => {
      setFading(false);
      setVisible(true);
      setHasStarted(false);

      setTimeout(() => {
        if (videoRef.current) {
          try {
            videoRef.current.currentTime = 0;
          } catch {
            // ignore if not ready
          }
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }
      }, 50);
    };

    window.addEventListener("kavault_replay_splash", handleReplay);
    return () => window.removeEventListener("kavault_replay_splash", handleReplay);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const video = videoRef.current;
    if (!video) return;

    // Безопасная инициализация звука и атрибутов для iOS WebKit
    video.defaultMuted = true;
    video.muted = true;

    const startPlayback = async () => {
      if (!videoRef.current) return;
      try {
        await videoRef.current.play();
        setHasStarted(true);
      } catch {
        // Если браузер или iOS Safari заблокировал автоплей:
        // Гарантируем muted и пробуем снова
        if (videoRef.current) {
          videoRef.current.muted = true;
          try {
            await videoRef.current.play();
            setHasStarted(true);
          } catch {
            // Если устройство в строгом режиме энергосбережения и видео не поддерживается:
            // Мягко пропускаем заставку через 1.2 сек, чтобы пользователь не ждал на черном экране
            setTimeout(() => handleComplete(), 1200);
          }
        }
      }
    };

    // Пробуем запустить сразу и по готовности метаданных
    startPlayback();
    video.addEventListener("loadedmetadata", startPlayback, { once: true });
    video.addEventListener("canplay", startPlayback, { once: true });

    // Разблокировка звука при первом касании / клике (требование iOS WebKit)
    const unlockSound = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
    };

    window.addEventListener("pointerdown", unlockSound, { passive: true });
    window.addEventListener("touchstart", unlockSound, { passive: true });

    // Страховочный таймер: если видео вообще не смогло запуститься за 2.5 сек, пускаем в приложение
    safetyTimeoutRef.current = setTimeout(() => {
      if (videoRef.current && (videoRef.current.paused || videoRef.current.currentTime === 0)) {
        handleComplete();
      }
    }, 2500);

    // Главный таймер заставки (длительность ролика ~5.3 сек)
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 5600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
      video.removeEventListener("loadedmetadata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
    };
  }, [visible, handleComplete]);

  if (!visible) return null;

  const splashSrc = getSplashSrc();

  return (
    <div
      onClick={handleComplete}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999999,
        backgroundColor: "#000000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: fading ? 0 : 1,
        transition: "opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none",
        cursor: "pointer",
        touchAction: "manipulation",
      }}
    >
      {/* Кнопка быстрого пропуска для пользователей, которые спешат */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleComplete();
        }}
        style={{
          position: "absolute",
          top: "max(16px, env(safe-area-inset-top, 16px))",
          right: "max(16px, env(safe-area-inset-right, 16px))",
          zIndex: 10,
          background: "rgba(255, 255, 255, 0.12)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "9999px",
          color: "rgba(255, 255, 255, 0.85)",
          padding: "6px 14px",
          fontSize: "12px",
          fontWeight: 500,
          letterSpacing: "0.5px",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          cursor: "pointer",
          outline: "none",
          transition: "opacity 0.2s, background 0.2s",
          opacity: hasStarted ? 0.9 : 0.6,
        }}
      >
        Пропустить →
      </button>

      {/* Оптимизированный видеопоток с гарантированной поддержкой iOS Safari */}
      <video
        ref={(el) => {
          if (el) {
            videoRef.current = el;
            el.setAttribute("playsinline", "true");
            el.setAttribute("webkit-playsinline", "true");
            el.setAttribute("muted", "true");
            el.defaultMuted = true;
            el.muted = true;
          }
        }}
        src={splashSrc}
        playsInline
        autoPlay
        muted
        preload="auto"
        onEnded={handleComplete}
        onError={() => {
          handleComplete();
        }}
        onPlaying={() => {
          setHasStarted(true);
        }}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          backgroundColor: "#000000",
          pointerEvents: "none",
          transform: "translateZ(0)",
          WebkitBackfaceVisibility: "hidden",
          backfaceVisibility: "hidden",
        }}
      />
    </div>
  );
};
