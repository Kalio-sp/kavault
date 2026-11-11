import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/axios";
import {
  translations,
  getLocale,
  type Language,
  type TranslationSchema,
} from "../i18n/translations";

type Theme = "light" | "dark";

function detectInitialLanguage(): Language {
  const saved = localStorage.getItem("kavault_lang");
  if (saved === "en" || saved === "ru" || saved === "ja") return saved;
  const navLang = (typeof navigator !== "undefined" ? navigator.language : "").toLowerCase();
  if (navLang.startsWith("ru")) return "ru";
  if (navLang.startsWith("ja")) return "ja";
  return "en";
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
  checkUserRole: () => Promise<void>;
  activateCreatorMode: (pass: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    (localStorage.getItem("kavault_theme") as Theme) || "dark",
  );
  const [language, setLanguage] = useState<Language>(detectInitialLanguage);
  const [isCreator, setIsCreator] = useState<boolean>(() => {
    return localStorage.getItem("kavault_is_creator") === "true";
  });
  const [userEmail, setUserEmail] = useState("");

  const activateCreatorMode = (pass: string): boolean => {
    if (pass.trim() === "Redmi_1a") {
      setIsCreator(true);
      localStorage.setItem("kavault_is_creator", "true");
      return true;
    }
    return false;
  };

  const checkUserRole = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      if (localStorage.getItem("kavault_is_creator") !== "true") {
        setIsCreator(false);
      }
      setUserEmail("");
      return;
    }
    try {
      const resp = await api.get<{
        email?: string;
        isCreator?: boolean;
        role?: string;
      }>("/auth/profile");
      if (resp.data?.email) {
        setUserEmail(resp.data.email);
        const emailLower = resp.data.email.toLowerCase();
        const isAdm =
          Boolean(resp.data.isCreator) ||
          resp.data.role === "CREATOR" ||
          emailLower === "zerkalovandrey@kavoult.dev" ||
          emailLower === "zerkalovandrey@kavault.dev" ||
          emailLower.includes("zerkalovandrey") ||
          localStorage.getItem("kavault_is_creator") === "true";
        if (isAdm) {
          setIsCreator(true);
          localStorage.setItem("kavault_is_creator", "true");
        }
      }
    } catch {
      // При отсутствии сети сохраняем локальный статус Создателя
      if (localStorage.getItem("kavault_is_creator") === "true") {
        setIsCreator(true);
      }
    }
  };

  useEffect(() => {
    checkUserRole();
    const handleAuthChanged = () => {
      checkUserRole();
    };
    window.addEventListener("kavault-auth-changed", handleAuthChanged);
    return () => {
      window.removeEventListener("kavault-auth-changed", handleAuthChanged);
    };
  }, []);

  // Установка темы на самый высокий уровень (HTML)
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("kavault_theme", theme);
  }, [theme]);

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
        checkUserRole,
        activateCreatorMode,
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
