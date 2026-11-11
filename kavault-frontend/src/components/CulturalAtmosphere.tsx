import React from "react";
import type { StudyLanguage } from "../data/studyVibes";

interface ParticleSeed {
  left: string;
  delay: string;
  duration: string;
  swayX: string;
  scale: number;
  opacity: number;
  shade: number;
}

const PARTICLE_SEEDS: ParticleSeed[] = [
  { left: "4%", delay: "-2s", duration: "13s", swayX: "42px", scale: 0.9, opacity: 0.72, shade: 0 },
  { left: "11%", delay: "-7s", duration: "16s", swayX: "-35px", scale: 0.7, opacity: 0.55, shade: 1 },
  { left: "18%", delay: "-1s", duration: "12s", swayX: "55px", scale: 1.05, opacity: 0.78, shade: 2 },
  { left: "26%", delay: "-9s", duration: "15s", swayX: "28px", scale: 0.8, opacity: 0.6, shade: 0 },
  { left: "34%", delay: "-4s", duration: "11s", swayX: "-44px", scale: 0.95, opacity: 0.7, shade: 1 },
  { left: "42%", delay: "-11s", duration: "17s", swayX: "38px", scale: 0.65, opacity: 0.5, shade: 2 },
  { left: "51%", delay: "-3s", duration: "13.5s", swayX: "-30px", scale: 1.0, opacity: 0.75, shade: 0 },
  { left: "59%", delay: "-8s", duration: "14.5s", swayX: "50px", scale: 0.75, opacity: 0.62, shade: 1 },
  { left: "67%", delay: "-5s", duration: "12.5s", swayX: "-38px", scale: 0.88, opacity: 0.68, shade: 2 },
  { left: "74%", delay: "-12s", duration: "16s", swayX: "46px", scale: 0.72, opacity: 0.58, shade: 0 },
  { left: "82%", delay: "-2.5s", duration: "11.5s", swayX: "-48px", scale: 1.08, opacity: 0.8, shade: 1 },
  { left: "89%", delay: "-6.5s", duration: "14s", swayX: "32px", scale: 0.82, opacity: 0.65, shade: 2 },
  { left: "95%", delay: "-10s", duration: "15.5s", swayX: "-28px", scale: 0.76, opacity: 0.6, shade: 0 },
  { left: "22%", delay: "-13.5s", duration: "14s", swayX: "60px", scale: 0.68, opacity: 0.52, shade: 1 },
  { left: "47%", delay: "-6s", duration: "12s", swayX: "-52px", scale: 0.86, opacity: 0.68, shade: 2 },
  { left: "78%", delay: "-4.5s", duration: "13s", swayX: "36px", scale: 0.92, opacity: 0.7, shade: 0 },
];

const SAKURA_SHADES = ["#f472b6", "#f9a8d4", "#fbcfe8"];
const EN_SHADES = ["#60a5fa", "#fb7185", "#eab308"];
const DE_SHADES = ["#f59e0b", "#ef4444", "#3b82f6"];

export function CulturalAmbientOverlay({
  studyLanguage,
  enabled = true,
  subtle = false,
}: {
  studyLanguage: StudyLanguage;
  enabled?: boolean;
  subtle?: boolean;
}) {
  if (!enabled) return null;

  const count = subtle ? 9 : PARTICLE_SEEDS.length;
  const particles = PARTICLE_SEEDS.slice(0, count);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 1,
      }}
    >
      {/* Японская ветка сакуры в правом верхнем углу */}
      {studyLanguage === "ja" && !subtle && (
        <svg
          viewBox="0 0 320 220"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "clamp(180px, 26vw, 320px)",
            height: "auto",
            opacity: 0.42,
            pointerEvents: "none",
          }}
        >
          <path
            d="M320 12 Q245 36 190 78 Q135 115 74 128"
            fill="none"
            stroke="#9d4edd"
            strokeOpacity="0.45"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M235 46 Q210 18 175 14"
            fill="none"
            stroke="#9d4edd"
            strokeOpacity="0.35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M168 92 Q154 134 118 158"
            fill="none"
            stroke="#9d4edd"
            strokeOpacity="0.35"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {[
            { cx: 268, cy: 26, r: 1 },
            { cx: 214, cy: 62, r: 1.15 },
            { cx: 175, cy: 16, r: 0.85 },
            { cx: 142, cy: 108, r: 1.05 },
            { cx: 88, cy: 126, r: 0.9 },
            { cx: 122, cy: 156, r: 0.85 },
            { cx: 255, cy: 64, r: 0.8 },
          ].map((b, idx) => (
            <g
              key={idx}
              transform={`translate(${b.cx}, ${b.cy}) scale(${b.r})`}
              className="kavault-hero-float"
            >
              {[0, 72, 144, 216, 288].map((deg) => (
                <path
                  key={deg}
                  d="M0,-2 C4,-11 9,-11 6,-1 C3,3 -3,3 -6,-1 C-9,-11 -4,-11 0,-2 Z"
                  fill={idx % 2 === 0 ? "#f472b6" : "#f9a8d4"}
                  fillOpacity="0.88"
                  transform={`rotate(${deg})`}
                />
              ))}
              <circle cx="0" cy="0" r="2.6" fill="#fde047" />
            </g>
          ))}
        </svg>
      )}

      {/* Анимированные частицы под конкретную культуру */}
      {particles.map((p, idx) => {
        const isJa = studyLanguage === "ja";
        const animName = isJa ? "kavaultSakuraFall" : "kavaultMoteFloat";
        const color = isJa
          ? SAKURA_SHADES[p.shade]
          : studyLanguage === "en"
            ? EN_SHADES[p.shade]
            : DE_SHADES[p.shade];

        return (
          <div
            key={idx}
            className="kavault-ambient-particle"
            style={
              {
                position: "absolute",
                top: 0,
                left: p.left,
                animation: `${animName} ${p.duration} linear ${p.delay} infinite`,
                willChange: "transform, opacity",
                "--sway-x": p.swayX,
                "--petal-scale": p.scale,
                "--petal-opacity": subtle ? p.opacity * 0.65 : p.opacity,
              } as React.CSSProperties
            }
          >
            {isJa ? (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M12 3 C16 6 20 11 18 16 C16 20 13 21 12 18.2 C11 21 8 20 6 16 C4 11 8 6 12 3 Z"
                  fill={color}
                />
              </svg>
            ) : studyLanguage === "en" ? (
              idx % 2 === 0 ? (
                <svg width="12" height="12" viewBox="0 0 16 16">
                  <path
                    d="M8 1 L9.8 6.2 L15 8 L9.8 9.8 L8 15 L6.2 9.8 L1 8 L6.2 6.2 Z"
                    fill={color}
                    fillOpacity="0.72"
                  />
                </svg>
              ) : (
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}`,
                    opacity: 0.65,
                  }}
                />
              )
            ) : (
              <svg width="13" height="13" viewBox="0 0 16 16">
                {p.shade === 0 ? (
                  <circle cx="8" cy="8" r="4.5" fill="none" stroke={color} strokeWidth="2" />
                ) : p.shade === 1 ? (
                  <polygon points="8,2 14,13 2,13" fill={color} fillOpacity="0.7" />
                ) : (
                  <rect x="3" y="3" width="9" height="9" rx="1.5" fill={color} fillOpacity="0.7" />
                )}
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function CulturalHeroScene({
  studyLanguage,
  compact = false,
}: {
  studyLanguage: StudyLanguage;
  compact?: boolean;
}) {
  if (studyLanguage === "ja") {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: compact ? "10px" : "20px",
          bottom: 0,
          top: 0,
          width: compact ? "210px" : "340px",
          pointerEvents: "none",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <svg
          viewBox="0 0 360 190"
          style={{ width: "100%", height: "100%", opacity: compact ? 0.5 : 0.72 }}
        >
          {/* Rising Moon / Sun Disc */}
          <circle cx="240" cy="64" r="44" fill="#f472b6" fillOpacity="0.16" />
          <circle cx="240" cy="64" r="28" fill="#fb7185" fillOpacity="0.18" />

          {/* Mount Fuji silhouette */}
          <path
            d="M125 190 L225 84 L255 84 L355 190 Z"
            fill="#c084fc"
            fillOpacity="0.18"
          />
          <path
            d="M206 104 L225 84 L255 84 L274 104 L258 98 L244 107 L232 97 L218 106 Z"
            fill="#fce7f3"
            fillOpacity="0.32"
          />

          {/* Torii Gate */}
          <g transform="translate(88, 92)" opacity="0.72">
            <path d="M0 10 Q42 -2 84 10 L81 17 Q42 8 3 17 Z" fill="#f43f5e" />
            <rect x="8" y="23" width="68" height="5" rx="2" fill="#f43f5e" />
            <rect x="17" y="15" width="7" height="72" fill="#e11d48" />
            <rect x="60" y="15" width="7" height="72" fill="#e11d48" />
            <rect x="39" y="12" width="6" height="12" fill="#fb7185" />
          </g>

          {/* Hanko Stamp Seal */}
          {!compact && (
            <g transform="translate(302, 22)" opacity="0.75">
              <rect
                x="0"
                y="0"
                width="36"
                height="36"
                rx="7"
                fill="rgba(225, 29, 72, 0.14)"
                stroke="#fb7185"
                strokeWidth="1.6"
              />
              <text
                x="18"
                y="24"
                textAnchor="middle"
                fill="#fda4af"
                fontSize="16"
                fontWeight="700"
              >
                言霊
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  }

  if (studyLanguage === "en") {
    return (
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          right: compact ? "10px" : "20px",
          bottom: 0,
          top: 0,
          width: compact ? "210px" : "340px",
          pointerEvents: "none",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <svg
          viewBox="0 0 360 190"
          style={{ width: "100%", height: "100%", opacity: compact ? 0.5 : 0.72 }}
        >
          {/* Oxford Moon / Horizon halo */}
          <circle cx="245" cy="70" r="48" fill="#3b82f6" fillOpacity="0.16" />
          <circle cx="245" cy="70" r="30" fill="#eab308" fillOpacity="0.12" />

          {/* Tower Bridge arches */}
          <g fill="none" stroke="#60a5fa" strokeOpacity="0.34" strokeWidth="2.5">
            <rect x="92" y="88" width="22" height="96" fill="rgba(59, 130, 246, 0.12)" />
            <rect x="200" y="88" width="22" height="96" fill="rgba(59, 130, 246, 0.12)" />
            <polygon points="90,88 103,64 116,88" fill="rgba(244, 63, 94, 0.16)" />
            <polygon points="198,88 211,64 224,88" fill="rgba(244, 63, 94, 0.16)" />
            <line x1="114" y1="108" x2="200" y2="108" />
            <path d="M52 152 Q103 128 157 152 Q211 128 262 152" />
          </g>

          {/* Big Ben Tower */}
          <g transform="translate(274, 24)" opacity="0.72">
            <polygon points="22,0 32,28 12,28" fill="#fb7185" fillOpacity="0.45" />
            <rect x="10" y="28" width="24" height="138" fill="#3b82f6" fillOpacity="0.22" stroke="#60a5fa" strokeOpacity="0.45" />
            <circle cx="22" cy="54" r="9" fill="#fef08a" fillOpacity="0.35" stroke="#eab308" strokeWidth="1.5" />
            <line x1="22" y1="54" x2="22" y2="49" stroke="#fff" strokeWidth="1.3" />
            <line x1="22" y1="54" x2="26" y2="54" stroke="#fff" strokeWidth="1.3" />
          </g>

          {/* Oxford Shield Stamp */}
          {!compact && (
            <g transform="translate(306, 22)" opacity="0.8">
              <path
                d="M0 4 H36 V20 C36 31 18 40 18 40 C18 40 0 31 0 20 Z"
                fill="rgba(37, 99, 235, 0.16)"
                stroke="#60a5fa"
                strokeWidth="1.5"
              />
              <text
                x="18"
                y="24"
                textAnchor="middle"
                fill="#bfdbfe"
                fontSize="12"
                fontWeight="800"
              >
                OX
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right: compact ? "10px" : "20px",
        bottom: 0,
        top: 0,
        width: compact ? "210px" : "340px",
        pointerEvents: "none",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      <svg
        viewBox="0 0 360 190"
        style={{ width: "100%", height: "100%", opacity: compact ? 0.5 : 0.72 }}
      >
        {/* Bauhaus Geometric Aura */}
        <circle cx="242" cy="70" r="46" fill="#f59e0b" fillOpacity="0.16" />
        <polygon points="150,150 220,56 290,150" fill="#ef4444" fillOpacity="0.1" />

        {/* Fernsehturm Berlin */}
        <g transform="translate(278, 12)" opacity="0.65">
          <line x1="16" y1="0" x2="16" y2="178" stroke="#fbbf24" strokeWidth="2.5" strokeOpacity="0.55" />
          <circle cx="16" cy="52" r="13" fill="#f59e0b" fillOpacity="0.32" stroke="#fcd34d" strokeWidth="1.5" />
        </g>

        {/* Brandenburger Tor */}
        <g transform="translate(76, 86)" opacity="0.72">
          <rect x="6" y="18" width="140" height="10" rx="2" fill="#f59e0b" fillOpacity="0.5" />
          <polygon points="56,18 76,2 96,18" fill="#ef4444" fillOpacity="0.48" />
          {[14, 38, 62, 86, 110, 134].map((x) => (
            <rect
              key={x}
              x={x}
              y="28"
              width="7"
              height="74"
              rx="1.5"
              fill="#fbbf24"
              fillOpacity="0.35"
            />
          ))}
        </g>

        {/* Bauhaus Triad Stamp */}
        {!compact && (
          <g transform="translate(298, 22)" opacity="0.82">
            <rect
              x="0"
              y="0"
              width="42"
              height="34"
              rx="8"
              fill="rgba(245, 158, 11, 0.14)"
              stroke="#fbbf24"
              strokeWidth="1.5"
            />
            <circle cx="11" cy="17" r="4.5" fill="#ef4444" />
            <polygon points="21,12 26,22 16,22" fill="#fbbf24" />
            <rect x="28" y="13" width="8" height="8" fill="#3b82f6" />
          </g>
        )}
      </svg>
    </div>
  );
}
