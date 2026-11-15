import React, { useState, useEffect, useRef } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Обязательная заставка при каждом входе и обновлении
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
    video.volume = 1.0;
    video.muted = false;

    // Запуск со звуком без необходимости каких-либо тапов или кликов
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Если строгая политика браузера потребовала muted на видеотеге —
        // запускаем видео без пауз и подключаем звук через параллельный аудиопоток
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
        try {
          const snd = new Audio("/splash_sound.mp3");
          snd.volume = 1.0;
          snd.play().catch(() => {});
        } catch {}
      });
    }

    // Резервный таймер завершения заставки (~6.0 сек)
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 6000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
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
      {/* 4K видеопоток оригинального качества с включенным звуком */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
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
