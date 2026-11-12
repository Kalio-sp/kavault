import axios from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { Capacitor } from "@capacitor/core";

const DEFAULT_API_URL = "http://51.250.76.48:4000";
const REMOTE_API_STORAGE_KEY = "kavault_remote_api_url";
const RAW_CONFIG_URL =
  "https://raw.githubusercontent.com/Kalio-sp/kavault/main/server-config.json";
const API_CONFIG_URL =
  "https://api.github.com/repos/Kalio-sp/kavault/contents/server-config.json?ref=main";

let lastSyncAt = 0;
let inFlightSync: Promise<string | null> | null = null;

interface RetryableConfig extends InternalAxiosRequestConfig {
  _remoteRetryDone?: boolean;
}

const normalizeUrl = (raw?: string | null): string | null => {
  if (!raw || typeof raw !== "string") return null;
  const trimmed = raw.trim().replace(/\/+$/, "");
  if (!/^https?:\/\/[^/\s]+/i.test(trimmed)) return null;
  return trimmed;
};

export const shouldUseRemoteConfig = (): boolean => {
  if (import.meta.env.VITE_API_URL) return false;
  if (typeof window === "undefined") return true;
  if (localStorage.getItem("kavault_api_url")) return false;

  if (
    !Capacitor.isNativePlatform() &&
    window.location.hostname &&
    !window.location.protocol.startsWith("file")
  ) {
    return false;
  }

  return true;
};

export const getApiBaseURL = (): string => {
  // 1. Из переменной окружения Vite
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  if (typeof window !== "undefined") {
    // 2. Из localStorage (если пользователь вручную указал адрес в Настройках)
    const customUrl = normalizeUrl(localStorage.getItem("kavault_api_url"));
    if (customUrl) return customUrl;

    // 3. Если запущено локально в веб-браузере разработчика (но НЕ внутри мобильного APK/IPA)
    if (
      !Capacitor.isNativePlatform() &&
      (window.location.hostname === "localhost" ||
        window.location.hostname === "127.0.0.1")
    ) {
      return "http://localhost:4000";
    }

    // 4. Если открыто в веб-браузере по сетевому IP сервера или домену
    if (
      !Capacitor.isNativePlatform() &&
      window.location.hostname &&
      !window.location.protocol.startsWith("file")
    ) {
      return `http://${window.location.hostname}:4000`;
    }

    // 5. Динамический адрес, автоматически подгруженный с GitHub (обновляется при смене IP сервера)
    const remoteUrl = normalizeUrl(localStorage.getItem(REMOTE_API_STORAGE_KEY));
    if (remoteUrl) return remoteUrl;
  }

  // 6. Резервный адрес по умолчанию для скомпилированного KAVAULT.exe, Android APK и iOS
  return DEFAULT_API_URL;
};

async function fetchServerConfigJson(
  url: string,
  headers?: Record<string, string>,
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const resp = await fetch(url, {
      cache: "no-store",
      headers,
      signal: controller.signal,
    });
    if (!resp.ok) return null;
    const data = await resp.json();
    return normalizeUrl(data?.apiUrl);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export const syncRemoteServerConfig = async (
  force = false,
): Promise<string | null> => {
  if (!shouldUseRemoteConfig()) return null;

  const now = Date.now();
  if (!force && now - lastSyncAt < 30_000) {
    return normalizeUrl(localStorage.getItem(REMOTE_API_STORAGE_KEY));
  }

  if (inFlightSync) return inFlightSync;

  inFlightSync = (async () => {
    try {
      const rawUrlWithBust = `${RAW_CONFIG_URL}?t=${Date.now()}`;
      const nextUrl = force
        ? (await fetchServerConfigJson(API_CONFIG_URL, {
            Accept: "application/vnd.github.raw+json",
          })) || (await fetchServerConfigJson(rawUrlWithBust))
        : (await fetchServerConfigJson(rawUrlWithBust)) ||
          (await fetchServerConfigJson(API_CONFIG_URL, {
            Accept: "application/vnd.github.raw+json",
          }));

      if (!nextUrl) return null;

      lastSyncAt = Date.now();
      const prevUrl = normalizeUrl(localStorage.getItem(REMOTE_API_STORAGE_KEY));
      localStorage.setItem(REMOTE_API_STORAGE_KEY, nextUrl);
      api.defaults.baseURL = nextUrl;

      if (typeof window !== "undefined" && prevUrl !== nextUrl) {
        window.dispatchEvent(
          new CustomEvent("kavault-api-updated", { detail: nextUrl }),
        );
      }

      return nextUrl;
    } finally {
      inFlightSync = null;
    }
  })();

  return inFlightSync;
};

export const api = axios.create({
  baseURL: getApiBaseURL(),
});

// Перехватчик запросов: прикрепляем токен и актуальный baseURL
api.interceptors.request.use((config) => {
  config.baseURL = getApiBaseURL();
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Перехватчик ответов:
// 1) При сетевом обрыве (например, изменился IP сервера) обновляем адрес с GitHub и повторяем запрос
// 2) При 401 (сессия истекла или пользователь удалён) очищаем токен и редиректим на логин
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config as RetryableConfig | undefined;

    if (
      !error?.response &&
      config &&
      !config._remoteRetryDone &&
      shouldUseRemoteConfig()
    ) {
      const failedBase = normalizeUrl(config.baseURL) || getApiBaseURL();
      const freshUrl = await syncRemoteServerConfig(true);
      if (freshUrl && freshUrl !== failedBase) {
        config._remoteRetryDone = true;
        config.baseURL = freshUrl;
        return api.request(config);
      }
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("kavault_is_creator");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("kavault-auth-changed"));
        if (!window.location.hash.includes("/login")) {
          window.location.hash = "#/login";
        }
      }
    }
    return Promise.reject(error);
  },
);
