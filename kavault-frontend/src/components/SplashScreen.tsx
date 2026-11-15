import React, { useState, useEffect, useRef } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Обязательная заставка при каждом старте и обновлении
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

    // Гарантированный запуск видеопотока
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Если строгая политика браузера запрещает unmuted autoplay на первом кадре —
        // продолжаем воспроизведение видео в muted режиме, чтобы анимация НЕ останавливалась
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }

    // Слушатели валидных жестов пользователя для мгновенного снятия mute
    const unlockSound = () => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current.volume = 1.0;
      }
    };

    window.addEventListener("pointerdown", unlockSound, { passive: true });
    window.addEventListener("touchstart", unlockSound, { passive: true });
    window.addEventListener("keydown", unlockSound, { passive: true });

    // Резервный таймер завершения на случай аппаратного сбоя видеодекодера (6.2 сек)
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 6200);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener("pointerdown", unlockSound);
      window.removeEventListener("touchstart", unlockSound);
      window.removeEventListener("keydown", unlockSound);
    };
  }, [visible]);

  if (!visible) return null;

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
      {/* 4K видеопоток оригинального качества */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        muted
        preload="auto"
        onEnded={handleComplete}
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
        <source src="/splash.mp4" type="video/mp4" />
      </video>
    </div>
  );
};
