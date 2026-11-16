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

const getSplashWebpSrc = () => {
  try {
    if (typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
      return "/splash.webp";
    }
    const base = import.meta.env.BASE_URL || "./";
    return `${base.replace(/\/$/, "")}/splash.webp`;
  } catch {
    return "./splash.webp";
  }
};

const getSplashSoundSrc = () => {
  try {
    if (typeof window !== "undefined" && window.location.protocol.startsWith("http")) {
      return "/splash_sound.mp3";
    }
    const base = import.meta.env.BASE_URL || "./";
    return `${base.replace(/\/$/, "")}/splash_sound.mp3`;
  } catch {
    return "./splash_sound.mp3";
  }
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleComplete = useCallback(() => {
    if (fading) return;
    setFading(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 600);
  }, [fading, onFinish]);

  // Слушатель ручного перезапуска заставки из настроек
  useEffect(() => {
    const handleReplay = () => {
      setFading(false);
      setVisible(true);
      setVideoPlaying(false);

      setTimeout(() => {
        if (videoRef.current) {
          try {
            videoRef.current.currentTime = 0;
          } catch {}
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().catch(() => {});
            }
          });
        }
        if (audioRef.current) {
          try {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          } catch {}
        }
      }, 50);
    };

    window.addEventListener("kavault_replay_splash", handleReplay);
    return () => window.removeEventListener("kavault_replay_splash", handleReplay);
  }, []);

  useEffect(() => {
    if (!visible) return;

    const video = videoRef.current;
    const audio = audioRef.current;

    // Запуск звука
    if (audio) {
      audio.volume = 1.0;
      audio.play().catch(() => {
        // На iOS автоплей звука блокируется до первого касания экрана
      });
    }

    // Запуск видеопотока
    if (video) {
      video.defaultMuted = true;
      video.muted = true;
      video.play()
        .then(() => setVideoPlaying(true))
        .catch(() => {
          // Если видео заблокировано (например, Low Power Mode на iOS),
          // визуальный слой WebP плавно продолжает показ без сбоя
        });
    }

    // Разблокировка звука при первом касании / клике (требование iOS WebKit)
    const unlockSound = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().catch(() => {});
      }
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

    // Главный таймер заставки (длительность ролика ~5.2 сек)
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 5200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
    };
  }, [visible, handleComplete]);

  if (!visible) return null;

  const splashSrc = getSplashSrc();
  const splashWebpSrc = getSplashWebpSrc();
  const splashSoundSrc = getSplashSoundSrc();

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
      {/* 1. Гарантированный визуальный слой (WebP 30 FPS).
          Работает ВСЕГДА: на любом iPhone, с экрана Домой (PWA), 
          в Low Power Mode, при 1% батареи, без блокировок WebKit. */}
      <img
        src={splashWebpSrc}
        alt="KAVAULT Splash Animation"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          display: "block",
        }}
      />

      {/* 2. Высококачественный 1080p видеопоток для устройств, где видеоплеер разрешен */}
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
        onPlaying={() => setVideoPlaying(true)}
        onError={() => setVideoPlaying(false)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          pointerEvents: "none",
          opacity: videoPlaying ? 1 : 0,
          transition: "opacity 0.2s ease-in",
          backgroundColor: "transparent",
        }}
      />

      {/* 3. Аудиопоток саундтрека */}
      <audio
        ref={audioRef}
        src={splashSoundSrc}
        preload="auto"
        autoPlay
      />
    </div>
  );
};
