// Утилиты и пресеты кастомизации личного кабинета и профиля KaVault

export interface AvatarPreset {
  id: string;
  name: string;
  emoji: string;
  description: string;
  tag: string;
  gradient: string;
  iconBg: string;
}

export interface AvatarFrame {
  id: string;
  name: string;
  description: string;
  tag: string;
  border: string;
  boxShadow: string;
  accentColor: string;
  animationClass?: string;
}

export interface BannerTheme {
  id: string;
  name: string;
  tag: string;
  background: string;
  accentColor: string;
}

export interface UserProfileCustomization {
  avatarType: "preset" | "custom" | "monogram";
  avatarPresetId: string;
  customAvatarUrl?: string; // base64 или URL
  monogramColor?: string;
  avatarFrameId: string;
  bannerThemeId: string;
  customBannerUrl?: string; // base64 или URL
  title: string;
  statusText: string;
  statusEmoji: string;
  bio: string;
  showcaseAchievementIds: string[];
}

export const AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: "cyber_ronin",
    name: "Code Ronin",
    emoji: "⚡",
    description: "Кибер-самурай с неоновой катаной",
    tag: "Cyberpunk",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #1d4ed8 100%)",
    iconBg: "rgba(6, 182, 212, 0.2)",
  },
  {
    id: "kitsune_spirit",
    name: "Kitsune Guardian",
    emoji: "🦊",
    description: "Дух лисы и хранитель древних свитков",
    tag: "Japanese",
    gradient: "linear-gradient(135deg, #f97316 0%, #ef4444 50%, #b91c1c 100%)",
    iconBg: "rgba(249, 115, 22, 0.2)",
  },
  {
    id: "sakura_blade",
    name: "Sakura Duelist",
    emoji: "🌸",
    description: "Мастер клинка под лепестками сакуры",
    tag: "Anime",
    gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 50%, #be185d 100%)",
    iconBg: "rgba(236, 72, 153, 0.2)",
  },
  {
    id: "cyber_wolf",
    name: "Cyber Wolf",
    emoji: "🐺",
    description: "Одинокий волк в ночном мегаполисе",
    tag: "Cyberpunk",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 50%, #1e1b4b 100%)",
    iconBg: "rgba(99, 102, 241, 0.2)",
  },
  {
    id: "astro_void",
    name: "Cosmic Explorer",
    emoji: "🌌",
    description: "Исследователь дальних галактик и туманностей",
    tag: "Sci-Fi",
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 50%, #311042 100%)",
    iconBg: "rgba(139, 92, 246, 0.2)",
  },
  {
    id: "retro_8bit",
    name: "Pixel Arcade",
    emoji: "👾",
    description: "Непобедимый герой аркадных автоматов",
    tag: "Retro",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)",
    iconBg: "rgba(16, 185, 129, 0.2)",
  },
  {
    id: "void_sorcerer",
    name: "Void Mage",
    emoji: "🔮",
    description: "Властелин астральной энергии и тайн",
    tag: "Fantasy",
    gradient: "linear-gradient(135deg, #a855f7 0%, #7e22ce 50%, #581c87 100%)",
    iconBg: "rgba(168, 85, 247, 0.2)",
  },
  {
    id: "mecha_prime",
    name: "Mecha Unit 01",
    emoji: "🤖",
    description: "Боевой пилотируемый экзоскелет",
    tag: "Mecha",
    gradient: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #115e59 100%)",
    iconBg: "rgba(20, 184, 166, 0.2)",
  },
  {
    id: "matcha_zen",
    name: "Matcha Master",
    emoji: "🍵",
    description: "Дзен, зелёный чай и безмятежный фокус",
    tag: "Peaceful",
    gradient: "linear-gradient(135deg, #84cc16 0%, #65a30d 50%, #3f6212 100%)",
    iconBg: "rgba(132, 204, 22, 0.2)",
  },
  {
    id: "neon_dragon",
    name: "Ryū Dragon",
    emoji: "🐉",
    description: "Священный дракон японских мифов",
    tag: "Legend",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
    iconBg: "rgba(245, 158, 11, 0.2)",
  },
  {
    id: "golden_sovereign",
    name: "Crown Sovereign",
    emoji: "👑",
    description: "Королевское величие и высший ранг",
    tag: "VIP",
    gradient: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #b45309 100%)",
    iconBg: "rgba(251, 191, 36, 0.2)",
  },
  {
    id: "focus_shinobi",
    name: "Shadow Shinobi",
    emoji: "🥷",
    description: "Бесшумный ниндзя в потоке концентрации",
    tag: "Ninja",
    gradient: "linear-gradient(135deg, #64748b 0%, #334155 50%, #0f172a 100%)",
    iconBg: "rgba(100, 116, 139, 0.2)",
  },
  {
    id: "prism_mind",
    name: "Prism Mind",
    emoji: "💎",
    description: "Кристальная ясность архитектурной мысли",
    tag: "Elite",
    gradient: "linear-gradient(135deg, #38bdf8 0%, #818cf8 50%, #c084fc 100%)",
    iconBg: "rgba(56, 189, 248, 0.2)",
  },
  {
    id: "panda_sensei",
    name: "Panda Sensei",
    emoji: "🐼",
    description: "Мудрый наставник и ценитель бамбука",
    tag: "Chill",
    gradient: "linear-gradient(135deg, #475569 0%, #1e293b 50%, #020617 100%)",
    iconBg: "rgba(71, 85, 105, 0.2)",
  },
  {
    id: "night_owl",
    name: "Night Owl Coder",
    emoji: "🦉",
    description: "Самый продуктивный кодер после полуночи",
    tag: "Dev",
    gradient: "linear-gradient(135deg, #4f46e5 0%, #3730a3 50%, #1e1b4b 100%)",
    iconBg: "rgba(79, 70, 229, 0.2)",
  },
  {
    id: "kanji_sage",
    name: "Kanji Sage",
    emoji: "📜",
    description: "Хранитель 2000+ японских кандзи",
    tag: "Scholar",
    gradient: "linear-gradient(135deg, #d97706 0%, #b45309 50%, #78350f 100%)",
    iconBg: "rgba(217, 119, 6, 0.2)",
  },
];

export const AVATAR_FRAMES: AvatarFrame[] = [
  {
    id: "frame_none",
    name: "Минимал",
    description: "Чистая форма без рамки",
    tag: "Classic",
    border: "2px solid rgba(255, 255, 255, 0.12)",
    boxShadow: "none",
    accentColor: "rgba(255, 255, 255, 0.2)",
  },
  {
    id: "frame_neon_cyan",
    name: "Неоновый импульс",
    description: "Бирюзовое неоновое кольцо с мягким свечением",
    tag: "Popular",
    border: "3px solid #06b6d4",
    boxShadow: "0 0 16px rgba(6, 182, 212, 0.75), inset 0 0 8px rgba(6, 182, 212, 0.3)",
    accentColor: "#06b6d4",
  },
  {
    id: "frame_solar_fire",
    name: "Солнечное пламя",
    description: "Огненно-янтарная аура высокой энергии",
    tag: "Hot",
    border: "3px solid #f97316",
    boxShadow: "0 0 18px rgba(249, 115, 22, 0.8), inset 0 0 8px rgba(249, 115, 22, 0.35)",
    accentColor: "#f97316",
  },
  {
    id: "frame_sakura_bloom",
    name: "Лепестки сакуры",
    description: "Нежное розовое сияние весеннего Киото",
    tag: "Aesthetic",
    border: "3px solid #f43f5e",
    boxShadow: "0 0 16px rgba(244, 63, 94, 0.7), inset 0 0 8px rgba(244, 63, 94, 0.3)",
    accentColor: "#f43f5e",
  },
  {
    id: "frame_gold_legend",
    name: "Корона Легенды",
    description: "Чистое 24k золото для мастеров системы",
    tag: "VIP",
    border: "3px solid #f59e0b",
    boxShadow: "0 0 22px rgba(245, 158, 11, 0.85), inset 0 0 10px rgba(245, 158, 11, 0.4)",
    accentColor: "#f59e0b",
  },
  {
    id: "frame_cyber_matrix",
    name: "Кибер-матрица",
    description: "Электрический ультрамарин и фиолетовый глитч",
    tag: "Cyber",
    border: "3px solid #a855f7",
    boxShadow: "0 0 20px rgba(168, 85, 247, 0.8), inset 0 0 10px rgba(168, 85, 247, 0.35)",
    accentColor: "#a855f7",
  },
  {
    id: "frame_emerald_guard",
    name: "Изумрудный страж",
    description: "Кибер-изумруд высокой концентрации",
    tag: "Rare",
    border: "3px solid #10b981",
    boxShadow: "0 0 16px rgba(16, 185, 129, 0.75), inset 0 0 8px rgba(16, 185, 129, 0.3)",
    accentColor: "#10b981",
  },
  {
    id: "frame_void_abyss",
    name: "Астральная бездна",
    description: "Таинственное космическое фиолетовое свечение",
    tag: "Mythic",
    border: "3px solid #6366f1",
    boxShadow: "0 0 22px rgba(99, 102, 241, 0.85), inset 0 0 10px rgba(99, 102, 241, 0.4)",
    accentColor: "#6366f1",
  },
];

export const BANNER_THEMES: BannerTheme[] = [
  {
    id: "tokyo_midnight",
    name: "Neo-Tokyo Night",
    tag: "Cyberpunk",
    background: "linear-gradient(135deg, #09090b 0%, #1e1b4b 45%, #3b0764 100%)",
    accentColor: "#818cf8",
  },
  {
    id: "sakura_sunset",
    name: "Sakura Sunrise",
    tag: "Japanese",
    background: "linear-gradient(135deg, #4c0519 0%, #831843 45%, #e11d48 100%)",
    accentColor: "#fb7185",
  },
  {
    id: "cyber_overdrive",
    name: "Cyber Overdrive",
    tag: "Neon",
    background: "linear-gradient(135deg, #022c22 0%, #0f172a 40%, #0891b2 100%)",
    accentColor: "#06b6d4",
  },
  {
    id: "synthwave_80s",
    name: "Synthwave Sunset",
    tag: "Retro",
    background: "linear-gradient(135deg, #2e1065 0%, #701a75 50%, #f97316 100%)",
    accentColor: "#f43f5e",
  },
  {
    id: "matrix_grid",
    name: "Matrix Terminal",
    tag: "Hacker",
    background: "linear-gradient(135deg, #022c22 0%, #064e3b 50%, #059669 100%)",
    accentColor: "#10b981",
  },
  {
    id: "deep_cosmos",
    name: "Deep Cosmos",
    tag: "Space",
    background: "linear-gradient(135deg, #030712 0%, #172554 50%, #3b82f6 100%)",
    accentColor: "#60a5fa",
  },
  {
    id: "royal_amber",
    name: "Royal Amber",
    tag: "Gold",
    background: "linear-gradient(135deg, #451a03 0%, #78350f 50%, #d97706 100%)",
    accentColor: "#fbbf24",
  },
  {
    id: "obsidian_carbon",
    name: "Obsidian Stealth",
    tag: "Dark",
    background: "linear-gradient(135deg, #18181b 0%, #27272a 60%, #3f3f46 100%)",
    accentColor: "#a1a1aa",
  },
];

export const PROFILE_TITLES: string[] = [
  "Архитектор знаний 🏛️",
  "Кибер-самурай ⚔️",
  "Хранитель KaVault 🛡️",
  "Кодовый алхимик 🧪",
  "Полиглот-исследователь 📜",
  "Мастер интервальных повторений 🧠",
  "Повелитель кандзи 🌸",
  "Full-Stack Архитектор 💻",
  "Повелитель фокуса ⚡",
  "KaVault Veteran 👑",
];

export const STATUS_PRESETS: Array<{ emoji: string; text: string }> = [
  { emoji: "⚡", text: "В режиме глубокого фокуса" },
  { emoji: "☕", text: "Пью кофе и изучаю кандзи" },
  { emoji: "🚀", text: "Фармлю MMR в Task-System" },
  { emoji: "💻", text: "Рефакторю архитектуру проекта" },
  { emoji: "🎯", text: "Закрываю ежедневные цели" },
  { emoji: "🌙", text: "Ночной кодинг под лоу-фай" },
  { emoji: "🏆", text: "Иду на вершину лидерборда" },
  { emoji: "🍵", text: "Дзен и чистый разум" },
];

export const MONOGRAM_COLORS = [
  "#3b82f6",
  "#8b5cf6",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#06b6d4",
  "#ef4444",
  "#6366f1",
];

const STORAGE_PREFIX = "kavault_profile_custom_";

export function getProfileUserKey(): string {
  try {
    const username = localStorage.getItem("kavault_username") || "";
    const token = localStorage.getItem("access_token") || "";
    if (token) {
      const part = token.split(".")[1];
      if (part) {
        const payload = JSON.parse(atob(part));
        return payload.sub || payload.email || username || "guest";
      }
    }
    return username || "guest";
  } catch {
    return "guest";
  }
}

export function getDefaultCustomization(): UserProfileCustomization {
  return {
    avatarType: "preset",
    avatarPresetId: "cyber_ronin",
    avatarFrameId: "frame_neon_cyan",
    bannerThemeId: "tokyo_midnight",
    title: "Архитектор знаний 🏛️",
    statusText: "В режиме глубокого фокуса",
    statusEmoji: "⚡",
    bio: "Исследую новые технологии, изучаю языки и развиваю персональную базу знаний в KaVault.",
    showcaseAchievementIds: [],
    monogramColor: "#3b82f6",
  };
}

export function loadProfileCustomization(userKey?: string): UserProfileCustomization {
  const key = userKey || getProfileUserKey();
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...getDefaultCustomization(),
        ...parsed,
      };
    }
  } catch (e) {
    console.error("Failed to load profile customization", e);
  }
  return getDefaultCustomization();
}

export function saveProfileCustomization(
  custom: UserProfileCustomization,
  userKey?: string,
): void {
  const key = userKey || getProfileUserKey();
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(custom));
    // Оповещаем всё приложение об изменении профиля
    window.dispatchEvent(
      new CustomEvent("kavault_profile_updated", { detail: custom }),
    );
  } catch (e) {
    console.error("Failed to save profile customization", e);
  }
}
