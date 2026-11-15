import React, { useState, useEffect, useRef } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Обязательная заставка — показывается всегда при каждом входе и обновлении страницы
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [soundChoice] = useState(() => {
    try {
      return localStorage.getItem("kavault_splash_sound") || "splash_cyber_master";
    } catch {
      return "splash_cyber_master";
    }
  });

  const isCustomAudio = soundChoice !== "splash_cyber_master";

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
          if (isCustomAudio) {
            videoRef.current.muted = true;
          } else {
            videoRef.current.muted = false;
          }
          videoRef.current.play().catch(() => {});
        }
        if (audioRef.current && isCustomAudio) {
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;
          audioRef.current.play().catch(() => {});
        }
      }, 50);
    };

    window.addEventListener("kavault_replay_splash", handleReplay);
    return () => window.removeEventListener("kavault_replay_splash", handleReplay);
  }, [isCustomAudio]);

  useEffect(() => {
    if (!visible) return;

    const video = videoRef.current;
    if (!video) return;

    if (isCustomAudio) {
      video.muted = true;
      video.play().catch(() => {});
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current.play().catch(() => {
          // Если браузер ограничил автоплей звука без жеста — включаем muted
          if (audioRef.current) audioRef.current.muted = true;
        });
      }
    } else {
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Если строгая политика браузера блокирует звук до первого взаимодействия —
          // играем без зависания, а при первом тапе/клике разблокируем звук
          video.muted = true;
          video.play().catch(() => {});
        });
      }
    }

    // Резервный таймер завершения на случай сбоя видеопотока (~5.6 сек)
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 5600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [visible, isCustomAudio, soundChoice]);

  // Разблокировка звука при любом тапе/клике по экрану, если браузер потребовал жест
  const handleUserInteract = () => {
    if (isCustomAudio) {
      if (audioRef.current && audioRef.current.muted) {
        audioRef.current.muted = false;
        if (audioRef.current.paused) audioRef.current.play().catch(() => {});
      }
    } else {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
      }
    }
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleUserInteract}
      onTouchStart={handleUserInteract}
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
      {/* Альтернативный аудио-элемент при выборе дополнительного трека */}
      {isCustomAudio && (
        <audio
          ref={audioRef}
          src={`/sounds/${soundChoice}.mp3`}
          preload="auto"
        />
      )}

      {/* Оригинальный 4K видеопоток без потери качества */}
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
