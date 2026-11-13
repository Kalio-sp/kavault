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
const EN_SHADES = ["#60a5fa", "#38bdf8", "#fbbf24", "#f43f5e"];
const DE_SHADES = ["#f59e0b", "#d97706", "#c2410c", "#ef4444", "#facc15"];

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
      {/* ── 1. ЯПОНСКАЯ ВЕТКА САКУРЫ (КИОТО) ── */}
      {studyLanguage === "ja" && !subtle && (
        <svg
          viewBox="0 0 320 220"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "clamp(180px, 26vw, 320px)",
            height: "auto",
            opacity: 0.45,
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

      {/* ── 2. АНГЛИЙСКИЙ УГОЛОК: BIG BEN, TOWER BRIDGE & ROYAL CREST (ЛОНДОН) ── */}
      {studyLanguage === "en" && !subtle && (
        <svg
          viewBox="0 0 340 240"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "clamp(190px, 28vw, 340px)",
            height: "auto",
            opacity: 0.42,
            pointerEvents: "none",
          }}
        >
          {/* Лондонский фонарь и викторианский завиток */}
          <path
            d="M340 18 Q270 24 230 70 Q190 115 170 180"
            fill="none"
            stroke="#3b82f6"
            strokeOpacity="0.4"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M260 40 Q230 18 190 28"
            fill="none"
            stroke="#60a5fa"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Силуэт Big Ben (Elizabeth Tower) */}
          <g transform="translate(260, 22) scale(0.85)">
            {/* Шпиль */}
            <polygon points="20,0 28,32 12,32" fill="#3b82f6" fillOpacity="0.65" />
            <line x1="20" y1="0" x2="20" y2="-12" stroke="#93c5fd" strokeWidth="2" />
            {/* Башня */}
            <rect x="10" y="32" width="20" height="150" fill="#1e3a8a" fillOpacity="0.35" stroke="#60a5fa" strokeOpacity="0.5" strokeWidth="1.2" />
            {/* Светящийся циферблат */}
            <circle cx="20" cy="56" r="8" fill="#fef08a" fillOpacity="0.75" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="20" y1="56" x2="20" y2="51" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
            <line x1="20" y1="56" x2="24" y2="56" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" />
            {/* Готические арочные окна башни */}
            <rect x="13" y="74" width="4" height="14" rx="2" fill="#60a5fa" fillOpacity="0.4" />
            <rect x="23" y="74" width="4" height="14" rx="2" fill="#60a5fa" fillOpacity="0.4" />
            <rect x="13" y="96" width="4" height="14" rx="2" fill="#60a5fa" fillOpacity="0.4" />
            <rect x="23" y="96" width="4" height="14" rx="2" fill="#60a5fa" fillOpacity="0.4" />
          </g>

          {/* Арка и ванты Tower Bridge */}
          <g transform="translate(140, 75) scale(0.75)" opacity="0.8">
            {/* Башня моста */}
            <rect x="50" y="40" width="16" height="85" fill="#1e3a8a" fillOpacity="0.25" stroke="#60a5fa" strokeOpacity="0.4" strokeWidth="1.2" />
            <polygon points="48,40 58,16 68,40" fill="#3b82f6" fillOpacity="0.45" />
            {/* Ванты моста */}
            <path d="M0 100 Q30 70 50 48" fill="none" stroke="#60a5fa" strokeOpacity="0.45" strokeWidth="1.5" />
            <path d="M66 48 Q90 70 120 100" fill="none" stroke="#60a5fa" strokeOpacity="0.45" strokeWidth="1.5" />
            <line x1="10" y1="94" x2="10" y2="105" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="25" y1="84" x2="25" y2="105" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="40" y1="68" x2="40" y2="105" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="1" />
          </g>

          {/* Лондонский уличный фонарь */}
          <g transform="translate(195, 115) scale(0.68)">
            <line x1="16" y1="20" x2="16" y2="90" stroke="#3b82f6" strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round" />
            <polygon points="9,20 23,20 20,4 12,4" fill="#fbbf24" fillOpacity="0.75" stroke="#f59e0b" strokeWidth="1.2" />
            <circle cx="16" cy="12" r="5" fill="#fef08a" fillOpacity="0.9" filter="drop-shadow(0 0 6px #f59e0b)" />
            <path d="M6 35 Q16 45 26 35" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.5" />
          </g>

          {/* Королевская корона (Royal Crown) */}
          <g transform="translate(285, 12)" opacity="0.85">
            <path d="M4 18 L10 26 L22 26 L28 18 L24 28 L8 28 Z" fill="#eab308" />
            <path d="M8 26 L4 14 L12 20 L16 10 L20 20 L28 14 L24 26 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
            <circle cx="16" cy="8" r="2.2" fill="#ef4444" />
            <circle cx="4" cy="12" r="1.8" fill="#3b82f6" />
            <circle cx="28" cy="12" r="1.8" fill="#3b82f6" />
          </g>
        </svg>
      )}

      {/* ── 3. НЕМЕЦКИЙ УГОЛОК: БРАНДЕНБУРГСКИЕ ВОРОТА, НОЙШВАНШТАЙН И ДУБОВЫЕ ЛИСТЬЯ ── */}
      {studyLanguage === "de" && !subtle && (
        <svg
          viewBox="0 0 350 250"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "clamp(200px, 29vw, 350px)",
            height: "auto",
            opacity: 0.46,
            pointerEvents: "none",
          }}
        >
          {/* Дубовая ветвь с желудями (Eichenzweig) обрамляет правый верхний угол */}
          <path
            d="M350 8 Q270 20 215 65 Q165 105 130 170"
            fill="none"
            stroke="#b45309"
            strokeOpacity="0.45"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M265 38 Q220 18 185 24"
            fill="none"
            stroke="#d97706"
            strokeOpacity="0.35"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M190 85 Q165 125 125 140"
            fill="none"
            stroke="#d97706"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Дубовые листья на ветке */}
          {[
            { cx: 300, cy: 16, r: 1.1, rot: 15 },
            { cx: 250, cy: 42, r: 1.25, rot: -25 },
            { cx: 205, cy: 22, r: 0.95, rot: 40 },
            { cx: 175, cy: 82, r: 1.1, rot: -10 },
            { cx: 140, cy: 118, r: 1.0, rot: 30 },
            { cx: 120, cy: 165, r: 0.85, rot: -45 },
          ].map((leaf, idx) => (
            <g
              key={idx}
              transform={`translate(${leaf.cx}, ${leaf.cy}) rotate(${leaf.rot}) scale(${leaf.r})`}
              className="kavault-hero-float"
            >
              {/* Лист дуба с характерными лопастями */}
              <path
                d="M0,-18 C6,-15 12,-12 8,-6 C13,-3 12,4 8,8 C11,12 8,17 3,20 C1,22 0,26 0,26 C0,26 -1,22 -3,20 C-8,17 -11,12 -8,8 C-12,4 -13,-3 -8,-6 C-12,-12 -6,-15 0,-18 Z"
                fill={idx % 2 === 0 ? "#f59e0b" : "#d97706"}
                fillOpacity="0.85"
                stroke="#b45309"
                strokeWidth="0.8"
              />
              {/* Прожилка листа */}
              <line x1="0" y1="-16" x2="0" y2="24" stroke="#78350f" strokeWidth="0.8" strokeOpacity="0.7" />
              <line x1="0" y1="-5" x2="5" y2="-9" stroke="#78350f" strokeWidth="0.6" strokeOpacity="0.6" />
              <line x1="0" y1="-5" x2="-5" y2="-9" stroke="#78350f" strokeWidth="0.6" strokeOpacity="0.6" />
              <line x1="0" y1="6" x2="5" y2="2" stroke="#78350f" strokeWidth="0.6" strokeOpacity="0.6" />
              <line x1="0" y1="6" x2="-5" y2="2" stroke="#78350f" strokeWidth="0.6" strokeOpacity="0.6" />
            </g>
          ))}

          {/* Желудь на ветви */}
          <g transform="translate(225, 48) rotate(35) scale(0.9)">
            <path d="M0,0 Q6,0 6,6 L-6,6 Q-6,0 0,0 Z" fill="#78350f" />
            <path d="M-5,6 C-5,14 0,18 0,18 C0,18 5,14 5,6 Z" fill="#b45309" />
          </g>

          {/* Силуэт замка Нойшванштайн (Schloss Neuschwanstein) */}
          <g transform="translate(190, 70) scale(0.72)" opacity="0.65">
            {/* Башни замка со шпилями */}
            <rect x="30" y="40" width="16" height="70" fill="#f59e0b" fillOpacity="0.25" stroke="#fcd34d" strokeOpacity="0.4" strokeWidth="1" />
            <polygon points="28,40 38,12 48,40" fill="#ef4444" fillOpacity="0.45" />
            <rect x="52" y="25" width="22" height="85" fill="#f59e0b" fillOpacity="0.28" stroke="#fcd34d" strokeOpacity="0.4" strokeWidth="1" />
            <polygon points="50,25 63,-5 76,25" fill="#dc2626" fillOpacity="0.55" />
            <line x1="63" y1="-5" x2="63" y2="-15" stroke="#fcd34d" strokeWidth="1.2" />
            {/* Крепостная стена и зубцы */}
            <rect x="74" y="55" width="40" height="55" fill="#f59e0b" fillOpacity="0.2" stroke="#fcd34d" strokeOpacity="0.3" strokeWidth="1" />
            <polygon points="74,55 84,35 94,55" fill="#ef4444" fillOpacity="0.35" />
          </g>

          {/* Силуэт Бранденбургских ворот с Квадригой */}
          <g transform="translate(130, 140) scale(0.78)" opacity="0.75">
            {/* Аттик ворот */}
            <rect x="10" y="22" width="110" height="9" rx="1.5" fill="#f59e0b" fillOpacity="0.5" stroke="#fbbf24" strokeWidth="1" />
            {/* Квадрига (колесница победы) */}
            <polygon points="56,22 65,7 74,22" fill="#ef4444" fillOpacity="0.65" />
            <circle cx="65" cy="5" r="3" fill="#fcd34d" />
            <line x1="50" y1="14" x2="80" y2="14" stroke="#fbbf24" strokeWidth="1.2" />
            {/* 6 классических колонн ворот */}
            {[18, 36, 54, 72, 90, 108].map((x) => (
              <rect
                key={x}
                x={x}
                y="31"
                width="6"
                height="50"
                rx="1"
                fill="#fbbf24"
                fillOpacity="0.35"
              />
            ))}
          </g>

          {/* Немецкий геральдический герб (Федеральный золотой щит) */}
          <g transform="translate(290, 14)" opacity="0.85">
            <path
              d="M0 4 H32 V18 C32 28 16 36 16 36 C16 36 0 28 0 18 Z"
              fill="rgba(245, 158, 11, 0.2)"
              stroke="#f59e0b"
              strokeWidth="1.4"
            />
            {/* Силуэт орла */}
            <path
              d="M16 8 L18 12 L24 10 L21 16 L25 18 L21 21 L23 26 L16 23 L9 26 L11 21 L7 18 L11 16 L8 10 L14 12 Z"
              fill="#ef4444"
              fillOpacity="0.85"
            />
          </g>
        </svg>
      )}

      {/* ── АНИМИРОВАННЫЕ ЧАСТИЦЫ ПОД КАЖДУЮ КУЛЬТУРУ ── */}
      {particles.map((p, idx) => {
        const isJa = studyLanguage === "ja";
        const isEn = studyLanguage === "en";
        const isDe = studyLanguage === "de";

        const animName = isJa
          ? "kavaultSakuraFall"
          : isDe
            ? "kavaultLeafFall"
            : "kavaultLondonMist";

        const color = isJa
          ? SAKURA_SHADES[p.shade % SAKURA_SHADES.length]
          : isEn
            ? EN_SHADES[p.shade % EN_SHADES.length]
            : DE_SHADES[p.shade % DE_SHADES.length];

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
            {/* ЯПОНИЯ: Лепестки сакуры */}
            {isJa && (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path
                  d="M12 3 C16 6 20 11 18 16 C16 20 13 21 12 18.2 C11 21 8 20 6 16 C4 11 8 6 12 3 Z"
                  fill={color}
                />
              </svg>
            )}

            {/* АНГЛИЯ: Лондонская дымка, мерцающие звезды и капли дождя */}
            {isEn && (
              idx % 3 === 0 ? (
                // Сияющая звезда / искры фонарей
                <svg width="14" height="14" viewBox="0 0 16 16">
                  <path
                    d="M8 0 L9.8 5.8 L16 8 L9.8 10.2 L8 16 L6.2 10.2 L0 8 L6.2 5.8 Z"
                    fill={color}
                    fillOpacity="0.82"
                  />
                </svg>
              ) : idx % 3 === 1 ? (
                // Капля лондонского дождя
                <svg width="10" height="14" viewBox="0 0 10 14">
                  <path
                    d="M5 0 C5 0 0 6 0 9.5 C0 12 2.2 14 5 14 C7.8 14 10 12 10 9.5 C10 6 5 0 5 0 Z"
                    fill={color}
                    fillOpacity="0.65"
                  />
                </svg>
              ) : (
                // Мерцающая королевская искра
                <div
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}`,
                    opacity: 0.7,
                  }}
                />
              )
            )}

            {/* ГЕРМАНИЯ: Осенние дубовые и кленовые листья + теплые искры */}
            {isDe && (
              idx % 3 === 0 ? (
                // Осенний дубовый лист (Eichenblatt)
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M12 2 C16 4 19 8 16 12 C20 14 19 19 15 20 C14 23 10 23 9 20 C5 19 4 14 8 12 C5 8 8 4 12 2 Z"
                    fill={color}
                    fillOpacity="0.88"
                  />
                  <line x1="12" y1="3" x2="12" y2="21" stroke="#78350f" strokeWidth="1" strokeOpacity="0.6" />
                </svg>
              ) : idx % 3 === 1 ? (
                // Осенний кленовый лист (Ahornblatt)
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path
                    d="M12 1 L14 7 L20 6 L17 12 L23 15 L16 17 L17 23 L12 19 L7 23 L8 17 L1 15 L7 12 L4 6 L10 7 Z"
                    fill={color}
                    fillOpacity="0.82"
                  />
                </svg>
              ) : (
                // Осенняя золотая искра / светлячок Шварцвальда
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: color,
                    boxShadow: `0 0 12px ${color}`,
                    opacity: 0.75,
                  }}
                />
              )
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
          width: compact ? "220px" : "360px",
          pointerEvents: "none",
          overflow: "hidden",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "flex-end",
        }}
      >
        <svg
          viewBox="0 0 380 200"
          style={{ width: "100%", height: "100%", opacity: compact ? 0.5 : 0.78 }}
        >
          {/* Oxford Moon / London Twilight halo */}
          <circle cx="260" cy="65" r="52" fill="#3b82f6" fillOpacity="0.18" />
          <circle cx="260" cy="65" r="32" fill="#eab308" fillOpacity="0.15" />

          {/* Колесо обозрения London Eye силуэт */}
          <circle cx="70" cy="115" r="42" fill="none" stroke="#60a5fa" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="3 3" />
          <circle cx="70" cy="115" r="4" fill="#60a5fa" fillOpacity="0.4" />
          <line x1="70" y1="115" x2="52" y2="185" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="2" />
          <line x1="70" y1="115" x2="88" y2="185" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="2" />

          {/* Tower Bridge arches and towers */}
          <g fill="none" stroke="#60a5fa" strokeOpacity="0.45" strokeWidth="2">
            <rect x="100" y="82" width="26" height="108" fill="rgba(30, 58, 138, 0.25)" stroke="#60a5fa" strokeOpacity="0.5" />
            <rect x="180" y="82" width="26" height="108" fill="rgba(30, 58, 138, 0.25)" stroke="#60a5fa" strokeOpacity="0.5" />
            <polygon points="98,82 113,54 128,82" fill="rgba(244, 63, 94, 0.28)" />
            <polygon points="178,82 193,54 208,82" fill="rgba(244, 63, 94, 0.28)" />
            {/* Верхний пешеходный переход */}
            <line x1="126" y1="98" x2="180" y2="98" stroke="#93c5fd" strokeWidth="2.5" />
            <line x1="126" y1="104" x2="180" y2="104" stroke="#93c5fd" strokeWidth="1.5" />
            {/* Ванты подвесного моста */}
            <path d="M40 160 Q70 115 100 82" />
            <path d="M206 82 Q236 115 270 160" />
            <line x1="60" y1="135" x2="60" y2="165" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="1" />
            <line x1="80" y1="110" x2="80" y2="165" stroke="#60a5fa" strokeOpacity="0.3" strokeWidth="1" />
          </g>

          {/* Река Темза (Thames river ripples) */}
          <path
            d="M30 188 Q90 182 150 188 T270 188 T380 188"
            fill="none"
            stroke="#38bdf8"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />

          {/* Big Ben Elizabeth Tower */}
          <g transform="translate(285, 18)" opacity="0.82">
            <polygon points="22,-4 34,26 10,26" fill="#f43f5e" fillOpacity="0.55" />
            <line x1="22" y1="-4" x2="22" y2="-18" stroke="#fecdd3" strokeWidth="2" />
            <rect x="8" y="26" width="28" height="156" fill="#1e3a8a" fillOpacity="0.35" stroke="#60a5fa" strokeOpacity="0.6" strokeWidth="1.4" />
            {/* Illuminated Clock face */}
            <circle cx="22" cy="54" r="10" fill="#fef08a" fillOpacity="0.85" stroke="#eab308" strokeWidth="1.8" />
            <line x1="22" y1="54" x2="22" y2="47" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
            <line x1="22" y1="54" x2="27" y2="54" stroke="#0f172a" strokeWidth="1.6" strokeLinecap="round" />
            {/* Gothic louvers */}
            <rect x="13" y="74" width="6" height="22" rx="3" fill="#60a5fa" fillOpacity="0.45" />
            <rect x="23" y="74" width="6" height="22" rx="3" fill="#60a5fa" fillOpacity="0.45" />
          </g>

          {/* Royal Crown Crest / Oxford Shield Stamp */}
          {!compact && (
            <g transform="translate(322, 14)" opacity="0.88">
              <path
                d="M0 4 H38 V22 C38 34 19 44 19 44 C19 44 0 34 0 22 Z"
                fill="rgba(37, 99, 235, 0.22)"
                stroke="#60a5fa"
                strokeWidth="1.8"
              />
              <path d="M8 14 L12 20 L26 20 L30 14 L28 22 L10 22 Z" fill="#eab308" />
              <text
                x="19"
                y="32"
                textAnchor="middle"
                fill="#bfdbfe"
                fontSize="10"
                fontWeight="800"
                letterSpacing="0.5"
              >
                ROYAL
              </text>
            </g>
          )}
        </svg>
      </div>
    );
  }

  // ── ГЕРМАНИЯ (DEUTSCHLAND): ЗАМОК НОЙШВАНШТАЙН, БРАНДЕНБУРГСКИЕ ВОРОТА И АЛЬПЫ ──
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        right: compact ? "10px" : "20px",
        bottom: 0,
        top: 0,
        width: compact ? "220px" : "360px",
        pointerEvents: "none",
        overflow: "hidden",
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "flex-end",
      }}
    >
      <svg
        viewBox="0 0 380 200"
        style={{ width: "100%", height: "100%", opacity: compact ? 0.5 : 0.8 }}
      >
        {/* Баварское закатное солнце / Золотое сияние */}
        <circle cx="260" cy="62" r="54" fill="#f59e0b" fillOpacity="0.2" />
        <circle cx="260" cy="62" r="32" fill="#ef4444" fillOpacity="0.15" />

        {/* Контур Баварских Альп (Zugspitze silhouette) */}
        <polygon points="40,195 110,95 160,140 215,80 270,145 330,85 390,195" fill="#78350f" fillOpacity="0.16" />
        <polygon points="100,108 110,95 122,108 116,105 110,112 105,106" fill="#fef3c7" fillOpacity="0.45" />
        <polygon points="204,92 215,80 226,92 220,89 215,95 209,89" fill="#fef3c7" fillOpacity="0.45" />

        {/* Романтический замок Нойшванштайн (Schloss Neuschwanstein) */}
        <g transform="translate(135, 42) scale(0.85)" opacity="0.82">
          {/* Главная башня со шпилем */}
          <rect x="42" y="30" width="22" height="120" fill="#78350f" fillOpacity="0.22" stroke="#fcd34d" strokeOpacity="0.45" strokeWidth="1.2" />
          <polygon points="40,30 53,-12 66,30" fill="#ef4444" fillOpacity="0.6" />
          <line x1="53" y1="-12" x2="53" y2="-24" stroke="#fcd34d" strokeWidth="1.5" />
          {/* Вторая башня */}
          <rect x="18" y="55" width="18" height="95" fill="#78350f" fillOpacity="0.22" stroke="#fcd34d" strokeOpacity="0.4" strokeWidth="1" />
          <polygon points="16,55 27,20 38,55" fill="#dc2626" fillOpacity="0.55" />
          {/* Арочные окна замка */}
          <rect x="48" y="50" width="5" height="16" rx="2.5" fill="#fef08a" fillOpacity="0.75" />
          <rect x="56" y="50" width="5" height="16" rx="2.5" fill="#fef08a" fillOpacity="0.75" />
          {/* Крепостная стена замка */}
          <rect x="64" y="80" width="46" height="70" fill="#78350f" fillOpacity="0.2" stroke="#fcd34d" strokeOpacity="0.35" strokeWidth="1" />
          <polygon points="64,80 76,55 88,80" fill="#b45309" fillOpacity="0.45" />
        </g>

        {/* Fernsehturm Berlin (Берлинская телебашня) */}
        <g transform="translate(305, 8)" opacity="0.72">
          <line x1="16" y1="-10" x2="16" y2="190" stroke="#f59e0b" strokeWidth="2.8" strokeOpacity="0.65" />
          <circle cx="16" cy="46" r="14" fill="#f59e0b" fillOpacity="0.4" stroke="#fcd34d" strokeWidth="1.8" />
          <line x1="8" y1="46" x2="24" y2="46" stroke="#ffffff" strokeWidth="1.4" strokeOpacity="0.8" />
        </g>

        {/* Бранденбургские ворота (Brandenburger Tor) */}
        <g transform="translate(62, 92)" opacity="0.78">
          {/* Аттик ворот */}
          <rect x="6" y="18" width="136" height="11" rx="2" fill="#f59e0b" fillOpacity="0.55" stroke="#fbbf24" strokeWidth="1" />
          {/* Квадрига */}
          <polygon points="60,18 74,0 88,18" fill="#ef4444" fillOpacity="0.65" />
          <circle cx="74" cy="-2" r="3" fill="#fcd34d" />
          {/* 6 классических колонн */}
          {[14, 36, 58, 80, 102, 124].map((x) => (
            <rect
              key={x}
              x={x}
              y="29"
              width="7"
              height="75"
              rx="1.5"
              fill="#fbbf24"
              fillOpacity="0.38"
            />
          ))}
        </g>

        {/* Немецкая геральдическая марка / Золотой орёл */}
        {!compact && (
          <g transform="translate(320, 16)" opacity="0.88">
            <rect
              x="0"
              y="0"
              width="44"
              height="36"
              rx="9"
              fill="rgba(245, 158, 11, 0.22)"
              stroke="#fbbf24"
              strokeWidth="1.6"
            />
            {/* Орел */}
            <path
              d="M22 6 L25 11 L31 9 L28 15 L32 18 L27 21 L29 27 L22 24 L15 27 L17 21 L12 18 L16 15 L13 9 L19 11 Z"
              fill="#ef4444"
              fillOpacity="0.85"
            />
            <text
              x="22"
              y="32"
              textAnchor="middle"
              fill="#fef08a"
              fontSize="7"
              fontWeight="900"
              letterSpacing="0.8"
            >
              DEUTSCH
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}