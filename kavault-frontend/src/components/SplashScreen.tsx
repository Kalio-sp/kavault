import React, { useState, useEffect, useRef } from "react";

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  // Обязательная заставка — воспроизводится при каждом запуске и обновлении
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

  // Функция гарантированного включения звука
  const ensureSound = () => {
    try {
      if (isCustomAudio) {
        if (audioRef.current) {
          audioRef.current.muted = false;
          audioRef.current.volume = 1.0;
          if (audioRef.current.paused) {
            audioRef.current.play().catch(() => {});
          }
        }
      } else {
        if (videoRef.current) {
          videoRef.current.muted = false;
          videoRef.current.volume = 1.0;
        }
      }
    } catch {}
  };

  useEffect(() => {
    const handleReplay = () => {
      setFading(false);
      setVisible(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          videoRef.current.muted = isCustomAudio;
          videoRef.current.volume = 1.0;
          videoRef.current.play().catch(() => {});
        }
        if (audioRef.current && isCustomAudio) {
          audioRef.current.currentTime = 0;
          audioRef.current.muted = false;
          audioRef.current.volume = 1.0;
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

    // Пытаемся воспроизвести сразу с включенным звуком
    if (isCustomAudio) {
      video.muted = true;
      video.play().catch(() => {});
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current.volume = 1.0;
        audioRef.current.play().catch(() => {
          if (audioRef.current) audioRef.current.muted = true;
        });
      }
    } else {
      video.muted = false;
      video.volume = 1.0;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Успешно запустилось со звуком
          })
          .catch(() => {
            // Если браузер заблокировал unmuted autoplay на холодном старте —
            // запускаем видео и сразу вешаем слушатели на любое движение мыши/тач/клавишу
            video.muted = true;
            video.play().catch(() => {});
          });
      }
    }

    // Слушатели на ЛЮБОЕ движение мыши, курсора, тач, скролл, нажатие клавиши или фокус
    const events = [
      "pointerdown",
      "mousedown",
      "touchstart",
      "touchend",
      "keydown",
      "wheel",
      "scroll",
      "pointermove",
      "mousemove",
      "focus",
    ];

    const unlockHandler = () => {
      ensureSound();
    };

    events.forEach((ev) => {
      window.addEventListener(ev, unlockHandler, { passive: true, capture: true });
    });

    // Периодическая попытка включить звук (для браузеров, где разрешение появилось после первого кадра)
    const unmuteInterval = setInterval(() => {
      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {
          if (videoRef.current) videoRef.current.muted = true;
        });
      } else {
        clearInterval(unmuteInterval);
      }
    }, 400);

    // Таймер завершения заставки (~5.5 сек)
    timerRef.current = setTimeout(() => {
      handleComplete();
    }, 5600);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearInterval(unmuteInterval);
      events.forEach((ev) => {
        window.removeEventListener(ev, unlockHandler, { capture: true } as any);
      });
    };
  }, [visible, isCustomAudio, soundChoice]);

  if (!visible) return null;

  return (
    <div
      onClick={ensureSound}
      onTouchStart={ensureSound}
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
