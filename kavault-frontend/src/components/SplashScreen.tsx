import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, FastForward } from "lucide-react";

interface SplashScreenProps {
  onFinish?: () => void;
  forceShow?: boolean;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onFinish,
  forceShow = false,
}) => {
  const [visible, setVisible] = useState(() => {
    if (forceShow) return true;
    try {
      const enabled = localStorage.getItem("kavault_splash_enabled");
      if (enabled === "false") return false;
      const seen = sessionStorage.getItem("kavault_splash_seen");
      return !seen;
    } catch {
      return true;
    }
  });

  const [fading, setFading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [progress, setProgress] = useState(0);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [soundChoice, setSoundChoice] = useState(() => {
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
    try {
      sessionStorage.setItem("kavault_splash_seen", "true");
    } catch {}

    setTimeout(() => {
      setVisible(false);
      onFinish?.();
    }, 600);
  };

  useEffect(() => {
    const handleReplay = (e?: any) => {
      const choice = e?.detail || localStorage.getItem("kavault_splash_sound") || "splash_cyber_master";
      setSoundChoice(choice);
      setFading(false);
      setVisible(true);
      setProgress(0);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.currentTime = 0;
          if (choice !== "splash_cyber_master") {
            videoRef.current.muted = true;
          }
          videoRef.current.play().catch(() => {});
        }
        if (audioRef.current && choice !== "splash_cyber_master") {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
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

    if (isCustomAudio) {
      // Пользователь выбрал альтернативный трек — видео глушим, звук через <audio>
      video.muted = true;
      video.play().catch(() => {});
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.muted = false;
        audioRef.current
          .play()
          .then(() => {
            setIsMuted(false);
            setAudioBlocked(false);
          })
          .catch(() => {
            if (audioRef.current) audioRef.current.muted = true;
            setIsMuted(true);
            setAudioBlocked(true);
          });
      }
    } else {
      // Основной звук встроен прямо в видеофайл
      video.muted = false;
      const playPromise = video.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsMuted(false);
            setAudioBlocked(false);
          })
          .catch(() => {
            video.muted = true;
            setIsMuted(true);
            setAudioBlocked(true);
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

  const toggleSound = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const video = videoRef.current;
    const audio = audioRef.current;

    if (isCustomAudio && audio) {
      if (audio.muted || isMuted) {
        audio.muted = false;
        setIsMuted(false);
        setAudioBlocked(false);
        if (audio.paused) audio.play().catch(() => {});
      } else {
        audio.muted = true;
        setIsMuted(true);
      }
      return;
    }

    if (video) {
      if (video.muted) {
        video.muted = false;
        setIsMuted(false);
        setAudioBlocked(false);
        if (video.paused) {
          video.play().catch(() => {});
        }
      } else {
        video.muted = true;
        setIsMuted(true);
      }
    }
  };

  const handleScreenClick = () => {
    if (audioBlocked) {
      toggleSound();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const p = Math.min(100, Math.round((video.currentTime / video.duration) * 100));
    setProgress(p);
  };

  if (!visible) return null;

  return (
    <div
      onClick={handleScreenClick}
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
        cursor: audioBlocked ? "pointer" : "default",
        userSelect: "none",
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

      {/* Видео заставки (оригинальный 4K поток без сжатия) */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        preload="auto"
        onEnded={handleComplete}
        onTimeUpdate={handleTimeUpdate}
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

      {/* Верхняя панель: Звук и Пропустить */}
      <div
        style={{
          position: "absolute",
          top: "env(safe-area-inset-top, 20px)",
          left: 0,
          right: 0,
          padding: "20px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
          pointerEvents: "auto",
        }}
      >
        {/* Кнопка звука */}
        <button
          type="button"
          onClick={toggleSound}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 14px",
            borderRadius: "20px",
            backgroundColor: audioBlocked
              ? "rgba(168, 85, 247, 0.25)"
              : "rgba(255, 255, 255, 0.08)",
            border: audioBlocked
              ? "1px solid rgba(168, 85, 247, 0.6)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            color: audioBlocked ? "#c084fc" : "#e2e8f0",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transition: "all 0.2s ease",
            boxShadow: audioBlocked ? "0 0 15px rgba(168, 85, 247, 0.4)" : "none",
          }}
          title={isMuted ? "Включить звук" : "Выключить звук"}
        >
          {isMuted ? (
            <>
              <VolumeX size={15} />
              <span>{audioBlocked ? "Включить звук 🔊" : "Звук выкл"}</span>
            </>
          ) : (
            <>
              <Volume2 size={15} color="#38bdf8" />
              <span>Звук вкл</span>
            </>
          )}
        </button>

        {/* Кнопка Пропустить */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleComplete();
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 16px",
            borderRadius: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#94a3b8",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#ffffff";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#94a3b8";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          }}
        >
          <span>Пропустить</span>
          <FastForward size={13} />
        </button>
      </div>

      {/* Нижняя полоска прогресса */}
      <div
        style={{
          position: "absolute",
          bottom: "env(safe-area-inset-bottom, 16px)",
          left: "24px",
          right: "24px",
          height: "2px",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderRadius: "2px",
          overflow: "hidden",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #38bdf8, #a855f7, #f97316)",
            transition: "width 0.1s linear",
            boxShadow: "0 0 10px rgba(168, 85, 247, 0.7)",
          }}
        />
      </div>
    </div>
  );
};
