import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { api } from "../api/axios";
import {
  translations,
  getLocale,
  type Language,
  type TranslationSchema,
} from "../i18n/translations";
import {
  STUDY_TEXTS,
  STUDY_VIBE_PALETTES,
  type StudyLanguage,
  type StudyLocaleText,
  type StudyVibePalette,
} from "../data/studyVibes";

type Theme = "light" | "dark";

function detectInitialLanguage(): Language {
  const saved = localStorage.getItem("kavault_lang");
  if (saved === "en" || saved === "ru" || saved === "ja") return saved;
  const navLang = (
    typeof navigator !== "undefined" ? navigator.language : ""
  ).toLowerCase();
  if (navLang.startsWith("ru")) return "ru";
  if (navLang.startsWith("ja")) return "ja";
  return "en";
}

function getUserCacheId(): string {
  try {
    const token = localStorage.getItem("access_token");
    if (!token) return "guest";
    const part = token.split(".")[1];
    if (!part) return "guest";
    const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return payload.sub || payload.email || "guest";
  } catch {
    return "guest";
  }
}

export interface StudyPreferencesUpdate {
  studyLanguage?: StudyLanguage;
  showProgramming?: boolean;
  onboardingCompleted?: boolean;
}

interface AppContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  language: Language;
  setLanguage: (l: Language) => void;
  locale: string;
  t: TranslationSchema;
  isCreator: boolean;
  userEmail: string;
  nickname: string;
  mmr: number;
  setLocalNickname: (nick: string) => void;
  setLocalMmr: (mmr: number) => void;
  studyLanguage: StudyLanguage;
  showProgramming: boolean;
  onboardingCompleted: boolean;
  profileLoaded: boolean;
  studyText: StudyLocaleText;
  studyPalette: StudyVibePalette;
  checkUserRole: () => Promise<void>;
  updateStudyPreferences: (prefs: StudyPreferencesUpdate) => Promise<void>;
}

const CREATOR_EMAIL = "zerkalovandrey@kavoult.dev";

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("kavault_theme") as Theme) || "dark",
  );
  const [language, setLanguage] = useState<Language>(detectInitialLanguage);
  const [isCreator, setIsCreator] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState("");
  const [nickname, setNickname] = useState<string>(
    () => localStorage.getItem("kavault_username") || "",
  );
  const [mmr, setMmr] = useState<number>(0);

  const [studyLanguage, setStudyLanguage] = useState<StudyLanguage>(() => {
    const uKey = getUserCacheId();
    const saved = localStorage.getItem(`kavault_study_lang_${uKey}`);
    if (saved === "ja" || saved === "en" || saved === "de") return saved;
    return "ja";
  });
  const [showProgramming, setShowProgramming] = useState<boolean>(() => {
    const uKey = getUserCacheId();
    const saved = localStorage.getItem(`kavault_show_prog_${uKey}`);
    return saved === null ? true : saved === "true";
  });
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean>(() => {
    const uKey = getUserCacheId();
    const saved = localStorage.getItem(`kavault_onboarded_${uKey}`);
    return saved === null ? true : saved === "true";
  });
  const [profileLoaded, setProfileLoaded] = useState<boolean>(false);

  const applyPrefsLocally = useCallback(
    (uKey: string, prefs: Required<StudyPreferencesUpdate>) => {
      setStudyLanguage(prefs.studyLanguage);
      setShowProgramming(prefs.showProgramming);
      setOnboardingCompleted(prefs.onboardingCompleted);
      localStorage.setItem(`kavault_study_lang_${uKey}`, prefs.studyLanguage);
      localStorage.setItem(
        `kavault_show_prog_${uKey}`,
        String(prefs.showProgramming),
      );
      localStorage.setItem(
        `kavault_onboarded_${uKey}`,
        String(prefs.onboardingCompleted),
      );
    },
    [],
  );

  const setLocalNickname = useCallback((nick: string) => {
    setNickname(nick);
    if (nick.trim()) {
      localStorage.setItem("kavault_username", nick.trim());
    }
  }, []);

  const setLocalMmr = useCallback((nextMmr: number) => {
    setMmr(nextMmr);
  }, []);

  const checkUserRole = useCallback(async () => {
    localStorage.removeItem("kavault_is_creator");
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsCreator(false);
      setUserEmail("");
      setNickname("");
      setMmr(0);
      setStudyLanguage("ja");
      setShowProgramming(true);
      setOnboardingCompleted(true);
      setProfileLoaded(true);
      return;
    }

    const uKey = getUserCacheId();
    try {
      const resp = await api.get<{
        email?: string;
        nickname?: string;
        mmr?: number;
        isCreator?: boolean;
        role?: string;
        studyLanguage?: string;
        showProgramming?: boolean;
        onboardingCompleted?: boolean;
      }>("/auth/profile");

      if (resp.data?.email) {
        setUserEmail(resp.data.email);
        const emailLower = resp.data.email.trim().toLowerCase();
        const isAdm = emailLower === CREATOR_EMAIL && Boolean(resp.data.isCreator);
        setIsCreator(isAdm);
      } else {
        setIsCreator(false);
      }

      if (typeof resp.data?.nickname === "string" && resp.data.nickname.trim()) {
        setNickname(resp.data.nickname.trim());
        localStorage.setItem("kavault_username", resp.data.nickname.trim());
      }
      if (typeof resp.data?.mmr === "number") {
        setMmr(resp.data.mmr);
      }

      const sl = resp.data?.studyLanguage;
      const validStudyLang: StudyLanguage =
        sl === "en" || sl === "de" || sl === "ja" ? sl : "ja";
      const sp =
        typeof resp.data?.showProgramming === "boolean"
          ? resp.data.showProgramming
          : true;
      const oc =
        typeof resp.data?.onboardingCompleted === "boolean"
          ? resp.data.onboardingCompleted
          : true;

      applyPrefsLocally(uKey, {
        studyLanguage: validStudyLang,
        showProgramming: sp,
        onboardingCompleted: oc,
      });
    } catch {
      setIsCreator(false);
    } finally {
      setProfileLoaded(true);
    }
  }, [applyPrefsLocally]);

  const updateStudyPreferences = useCallback(
    async (prefs: StudyPreferencesUpdate) => {
      const uKey = getUserCacheId();
      const next: Required<StudyPreferencesUpdate> = {
        studyLanguage: prefs.studyLanguage ?? studyLanguage,
        showProgramming: prefs.showProgramming ?? showProgramming,
        onboardingCompleted: prefs.onboardingCompleted ?? onboardingCompleted,
      };
      applyPrefsLocally(uKey, next);

      if (localStorage.getItem("access_token")) {
        try {
          await api.patch("/auth/preferences", next);
        } catch (err) {
          console.error("Failed to save user study preferences", err);
        }
      }
    },
    [
      applyPrefsLocally,
      onboardingCompleted,
      showProgramming,
      studyLanguage,
    ],
  );

  useEffect(() => {
    checkUserRole();
    const handleAuthChanged = () => {
      setProfileLoaded(false);
      checkUserRole();
    };
    window.addEventListener("kavault-auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("kavault-auth-changed", handleAuthChanged);
    };
  }, [checkUserRole]);

  // Установка темы на самый высокий уровень (HTML)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kavault_theme", theme);
  }, [theme]);

  // Установка визуального вайба изучаемого языка на уровень HTML
  useEffect(() => {
    document.documentElement.setAttribute("data-vibe", studyLanguage);
  }, [studyLanguage]);

  // Сохранение языка и атрибута lang документа
  useEffect(() => {
    document.documentElement.setAttribute("lang", language);
    localStorage.setItem("kavault_lang", language);
  }, [language]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        locale: getLocale(language),
        t: translations[language],
        isCreator,
        userEmail,
        nickname,
        mmr,
        setLocalNickname,
        setLocalMmr,
        studyLanguage,
        showProgramming,
        onboardingCompleted,
        profileLoaded,
        studyText: STUDY_TEXTS[studyLanguage][language],
        studyPalette: STUDY_VIBE_PALETTES[studyLanguage],
        checkUserRole,
        updateStudyPreferences,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
