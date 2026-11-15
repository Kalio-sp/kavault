import React, { useState, useEffect, useRef } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
}

const getSplashSrc = () => {
  try {
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
  // Обязательная заставка при каждом старте и обновлении страницы
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleComplete = () => {
    if (fading) return;
    setFading(true);

    setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 600);
  };

  useEffect(() => {
    const handleReplay = () => {
      setFading(false);
      setVisible(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
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

    video.currentTime = 0;
    video.defaultMuted = true;
    video.muted = true;

    const startPlayback = () => {
      if (!videoRef.current) return;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Автовоспроизведение на iOS ожидается до первого жеста
        });
      }
    };

    startPlayback();
    video.addEventListener("loadedmetadata", startPlayback, { once: true });
    video.addEventListener("canplay", startPlayback, { once: true });

    // Фоновая разблокировка звука при первом же касании / клике
    const unlockSoundAndPlay = () => {
      if (videoRef.current) {
        if (videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        }
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
    };

    window.addEventListener("pointerdown", unlockSoundAndPlay, { passive: true });
    window.addEventListener("touchstart", unlockSoundAndPlay, { passive: true });
    window.addEventListener("keydown", unlockSoundAndPlay, { passive: true });

    // Резервный таймер завершения заставки (~5.5 сек)
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 5500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("pointerdown", unlockSoundAndPlay);
      window.removeEventListener("touchstart", unlockSoundAndPlay);
      window.removeEventListener("keydown", unlockSoundAndPlay);
      video.removeEventListener("loadedmetadata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
    };
  }, [visible]);

  if (!visible) return null;

  const splashSrc = getSplashSrc();

  return (
    <div
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
        transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        userSelect: "none",
        cursor: "default",
      }}
    >
      {/* 4K видеопоток оригинального качества со звуком */}
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
      >
        <source src={splashSrc} type="video/mp4" />
        <source src="./splash.mp4" type="video/mp4" />
        <source src="/splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
