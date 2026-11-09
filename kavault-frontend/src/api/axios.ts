import axios from "axios";

export const getApiBaseURL = (): string => {
  // 1. Из переменной окружения Vite
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // 2. Из localStorage (если пользователь сохранил адрес в Настройках)
  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem("kavault_api_url");
    if (customUrl) return customUrl;

    // 3. Если запущено локально в браузере разработчика (localhost / 127.0.0.1)
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:4000";
    }

    // 4. Если открыто в веб-браузере по сетевому IP сервера или домену
    if (
      window.location.hostname &&
      !window.location.protocol.startsWith("file")
    ) {
      return `http://${window.location.hostname}:4000`;
    }
  }

  // 5. По умолчанию для скомпилированного KAVAULT.exe и iOS (где protocol file:// или capacitor://):
  // подключаемся к серверу в Yandex Cloud!
  return "http://111.88.154.23:4000";
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

// Перехватчик ответов: если сессия истекла (401), очищаем токен и редиректим на логин
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("access_token");
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/login"
      ) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
