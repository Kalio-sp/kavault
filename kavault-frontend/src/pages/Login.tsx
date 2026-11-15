import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/axios";
import { useApp, syncNicknameEverywhere } from "../context/AppContext";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  User,
  Trophy,
  X,
  Zap,
  CheckCircle2,
  Circle,
  Globe,
} from "lucide-react";

type AuthMode = "login" | "register";

interface SavedAccount {
  email: string;
  nickname: string;
  token: string;
  savedAt: number;
}

export function Login() {
  const { t, language } = useApp();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [studyLanguage, setStudyLanguage] = useState<"ja" | "en" | "de">("ja");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 840 : false,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 840);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Загрузка сохраненных аккаунтов на этом устройстве
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kavault_saved_accounts");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSavedAccounts(parsed);
        }
      }
    } catch {}
  }, []);

  const handleQuickLogin = async (acc: SavedAccount) => {
    setError("");
    setIsLoading(true);
    try {
      localStorage.setItem("access_token", acc.token);
      localStorage.setItem("kavault_username", acc.nickname);

      // Проверяем валидность токена через рабочий эндпоинт /auth/profile
      try {
        const res = await api.get("/auth/profile");
        const freshNick = res.data?.nickname || acc.nickname;
        syncNicknameEverywhere(freshNick, acc.email);
        window.dispatchEvent(new Event("kavault-auth-changed"));
        navigate("/dashboard");
        return;
      } catch (err: any) {
        // Только если сервер явно вернул 401 Unauthorized — токен действительно истек
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          setEmail(acc.email);
          setError("Срок действия сессии истёк. Пожалуйста, введите пароль для входа.");
          return;
        }
        // При временных заминках сети всё равно переходим в профиль по сохраненному токену
        syncNicknameEverywhere(acc.nickname, acc.email);
        window.dispatchEvent(new Event("kavault-auth-changed"));
        navigate("/dashboard");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSavedAccount = (emailToRemove: string) => {
    const updated = savedAccounts.filter(
      (a) => a.email.toLowerCase() !== emailToRemove.toLowerCase(),
    );
    setSavedAccounts(updated);
    localStorage.setItem("kavault_saved_accounts", JSON.stringify(updated));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register") {
      if (!nickname.trim()) {
        setError(t.auth.errors.noNickname);
        return;
      }

      if (password !== confirmPassword) {
        setError(t.auth.errors.mismatch);
        return;
      }

      // Проверка 5 обязательных требований к надежности пароля
      const passRules = [
        { label: "не менее 8 символов", passed: password.length >= 8 },
        { label: "хотя бы одну заглавную букву (A-Z)", passed: /[A-Z]/.test(password) },
        { label: "хотя бы одну строчную букву (a-z)", passed: /[a-z]/.test(password) },
        { label: "хотя бы одну цифру (0-9)", passed: /[0-9]/.test(password) },
        { label: "хотя бы один специальный символ (!@#$%^&*)", passed: /[!@#$%^&*]/.test(password) },
      ];
      const failed = passRules.filter((r) => !r.passed);
      if (failed.length > 0) {
        setError(`Пароль должен содержать: ${failed.map((f) => f.label).join(", ")}`);
        return;
      }
    } else {
      if (!password) {
        setError("Введите пароль для входа");
        return;
      }
    }

    setIsLoading(true);

    try {
      let finalToken = "";
      let finalNick = "";

      if (mode === "register") {
        const nick = nickname.trim();
        await api.post("/auth/register", {
          email,
          password,
          studyLanguage,
          ...(nick ? { nickname: nick } : {}),
        });
        if (nick) {
          localStorage.setItem("kavault_username", nick);
          finalNick = nick;
        }
        localStorage.setItem("kavault_study_language", studyLanguage);
        localStorage.setItem(`kavault_study_lang_${email}`, studyLanguage);
        // После успешной регистрации — сразу логиним
        const response = await api.post("/auth/login", { email, password });
        finalToken = response.data.access_token;
        localStorage.setItem("access_token", finalToken);
        const loggedNick = response.data?.user?.nickname || response.data?.nickname;
        if (loggedNick) {
          finalNick = loggedNick;
          syncNicknameEverywhere(loggedNick, email);
        }
        window.dispatchEvent(new Event("kavault-auth-changed"));
      } else {
        const response = await api.post("/auth/login", { email, password });
        finalToken = response.data.access_token;
        localStorage.setItem("access_token", finalToken);
        const loggedNick = response.data?.user?.nickname || response.data?.nickname;
        if (loggedNick) {
          finalNick = loggedNick;
          syncNicknameEverywhere(loggedNick, email);
        }
        window.dispatchEvent(new Event("kavault-auth-changed"));
      }

      // Сохранение аккаунта на устройстве при включенном чекбоксе
      if (rememberDevice && finalToken) {
        const newSaved: SavedAccount = {
          email,
          nickname: finalNick || email.split("@")[0],
          token: finalToken,
          savedAt: Date.now(),
        };
        const existing = savedAccounts.filter(
          (a) => a.email.toLowerCase() !== email.toLowerCase(),
        );
        const updated = [newSaved, ...existing];
        localStorage.setItem("kavault_saved_accounts", JSON.stringify(updated));
      }

      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.join(", "));
      } else {
        setError(msg || t.auth.errors.serverError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setError("");
    setConfirmPassword("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        backgroundColor: "var(--bg)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Левая панель — брендинг (скрыта на мобильных) */}
      {!isMobile && (
        <div
          style={{
            flex: 1,
            display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "var(--space-12)",
          borderRight: "1px solid var(--border)",
          backgroundColor: "var(--surface)",
        }}
      >
        <div style={{ maxWidth: "400px", textAlign: "center" }}>
          {/* Логотип */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "var(--space-8)",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                backgroundColor: "var(--text-primary)",
                color: "var(--bg)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                fontSize: "20px",
                fontWeight: 700,
              }}
            >
              K
            </div>
            <span
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "0.5px",
              }}
            >
              KAVAULT
            </span>
          </div>

          <h1
            style={{
              fontSize: "32px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 var(--space-4) 0",
              lineHeight: 1.2,
            }}
          >
            {t.auth.brandLine1}
            <br />
            {t.auth.brandLine2}
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {t.auth.brandSubtitle}
          </p>

          {/* Фичи */}
          <div
            style={{
              marginTop: "var(--space-8)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
              textAlign: "left",
            }}
          >
            {t.auth.features.map((feature) => (
              <div
                key={feature}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "var(--accent)",
                    flexShrink: 0,
                  }}
                />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
      )}

      {/* Правая панель — форма */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: isMobile ? "var(--space-8) var(--space-4)" : "var(--space-12)",
          width: "100%",
        }}
      >
        <div style={{ width: "100%", maxWidth: "380px" }}>
          {/* Мобильный логотип */}
          {isMobile && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "var(--space-6)",
              }}
            >
              <div
                style={{
                  width: "34px",
                  height: "34px",
                  backgroundColor: "var(--text-primary)",
                  color: "var(--bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  fontSize: "18px",
                  fontWeight: 800,
                }}
              >
                K
              </div>
              <span
                style={{
                  fontSize: "22px",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  letterSpacing: "0.5px",
                }}
              >
                KAVAULT
              </span>
            </div>
          )}
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 var(--space-2) 0",
            }}
          >
            {mode === "login" ? t.auth.loginTitle : t.auth.registerTitle}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              margin: "0 0 var(--space-6) 0",
              fontSize: "14px",
            }}
          >
            {mode === "login"
              ? t.auth.loginSubtitle
              : t.auth.registerSubtitle}
          </p>

          {/* Ошибка */}
          {error && (
            <div
              style={{
                padding: "var(--space-3) var(--space-4)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "var(--radius-md)",
                color: "var(--error)",
                fontSize: "13px",
                marginBottom: "var(--space-5)",
              }}
            >
              {error}
            </div>
          )}

          {/* Сохранённые аккаунты на устройстве — Быстрый вход в 1 клик */}
          {mode === "login" && savedAccounts.length > 0 && (
            <div
              style={{
                marginBottom: "20px",
                padding: "14px",
                borderRadius: "14px",
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                border: "1px solid rgba(59, 130, 246, 0.25)",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <Zap size={14} color="#3b82f6" />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      color: "var(--accent, #3b82f6)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Вход в 1 клик
                  </span>
                </div>
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  сохранены на устройстве
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {savedAccounts.map((acc) => (
                  <div
                    key={acc.email}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "12px",
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--border)",
                      gap: "10px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => handleQuickLogin(acc)}
                      disabled={isLoading}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "none",
                        border: "none",
                        color: "inherit",
                        cursor: isLoading ? "wait" : "pointer",
                        padding: 0,
                        flex: 1,
                        minWidth: 0,
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(59, 130, 246, 0.15)",
                          color: "#60a5fa",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "14px",
                          flexShrink: 0,
                          border: "1.5px solid rgba(59, 130, 246, 0.4)",
                        }}
                      >
                        {acc.nickname.slice(0, 1).toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <div
                          style={{
                            fontSize: "13.5px",
                            fontWeight: 700,
                            color: "var(--text-primary)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {acc.nickname}
                        </div>
                        <div
                          style={{
                            fontSize: "11px",
                            color: "var(--text-muted)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {acc.email}
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: "11px",
                          fontWeight: 700,
                          color: "#60a5fa",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          backgroundColor: "rgba(59, 130, 246, 0.12)",
                          border: "1px solid rgba(59, 130, 246, 0.25)",
                          flexShrink: 0,
                        }}
                      >
                        Войти →
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveSavedAccount(acc.email)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        padding: "5px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      title="Удалить с этого устройства"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  textAlign: "center",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                }}
              >
                Или введите пароль ниже ↓
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {/* Email */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {t.auth.emailLabel}
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    display: "flex",
                  }}
                >
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "11px 12px 11px 38px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border)")
                  }
                />
              </div>
            </div>

            {/* Никнейм при регистрации */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {t.auth.nicknameLabel}
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                      display: "flex",
                    }}
                  >
                    <User size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder={t.auth.nicknamePlaceholder}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "11px 12px 11px 38px",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
              </div>
            )}

            {/* Выбор основного языка при регистрации */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: "8px",
                  }}
                >
                  <Globe size={14} color="var(--accent)" />
                  <span>Основной язык для изучения</span>
                </label>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "8px",
                  }}
                >
                  {[
                    { id: "ja" as const, flag: "🇯🇵", label: "Японский", sub: "JLPT N5–N1" },
                    { id: "en" as const, flag: "🇬🇧", label: "Английский", sub: "CEFR A1–B2" },
                    { id: "de" as const, flag: "🇩🇪", label: "Немецкий", sub: "CEFR A1–B2" },
                  ].map((lang) => {
                    const isSel = studyLanguage === lang.id;
                    return (
                      <button
                        key={lang.id}
                        type="button"
                        onClick={() => setStudyLanguage(lang.id)}
                        style={{
                          padding: "10px 6px",
                          borderRadius: "12px",
                          border: `1.5px solid ${isSel ? "var(--accent, #3b82f6)" : "var(--border)"}`,
                          backgroundColor: isSel
                            ? "rgba(59, 130, 246, 0.12)"
                            : "var(--surface)",
                          color: isSel ? "var(--text-primary)" : "var(--text-secondary)",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "3px",
                          boxShadow: isSel
                            ? "0 0 16px -4px rgba(59, 130, 246, 0.35)"
                            : "none",
                          transition: "all 0.15s ease",
                        }}
                      >
                        <span style={{ fontSize: "22px", lineHeight: 1 }}>{lang.flag}</span>
                        <span style={{ fontSize: "12.5px", fontWeight: isSel ? 700 : 600 }}>
                          {lang.label}
                        </span>
                        <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>
                          {lang.sub}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Пароль */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  marginBottom: "var(--space-2)",
                }}
              >
                {t.auth.passwordLabel}
              </label>
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                    display: "flex",
                  }}
                >
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    backgroundColor: "var(--bg)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "11px 40px 11px 38px",
                    color: "var(--text-primary)",
                    fontSize: "14px",
                    outline: "none",
                    transition: "border-color 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--accent)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    display: "flex",
                    padding: 0,
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Интерактивный чеклист требований к паролю при регистрации */}
              {mode === "register" && (
                <div
                  style={{
                    marginTop: "8px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    backgroundColor: "var(--surface)",
                    border: "1px solid var(--border)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "5px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "var(--text-secondary)",
                      marginBottom: "2px",
                    }}
                  >
                    Пароль должен содержать:
                  </div>
                  {[
                    { id: "len", label: "не менее 8 символов", passed: password.length >= 8 },
                    { id: "upper", label: "хотя бы одну заглавную букву (A-Z)", passed: /[A-Z]/.test(password) },
                    { id: "lower", label: "хотя бы одну строчную букву (a-z)", passed: /[a-z]/.test(password) },
                    { id: "num", label: "хотя бы одну цифру (0-9)", passed: /[0-9]/.test(password) },
                    { id: "special", label: "хотя бы один специальный символ (!@#$%^&*)", passed: /[!@#$%^&*]/.test(password) },
                  ].map((rule) => (
                    <div
                      key={rule.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "11px",
                        color: rule.passed ? "#10b981" : "var(--text-muted)",
                        fontWeight: rule.passed ? 600 : 400,
                        transition: "color 0.15s ease",
                      }}
                    >
                      {rule.passed ? (
                        <CheckCircle2 size={13} color="#10b981" style={{ flexShrink: 0 }} />
                      ) : (
                        <Circle size={13} color="var(--border)" style={{ flexShrink: 0 }} />
                      )}
                      <span>• {rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Подтверждение пароля (только при регистрации) */}
            {mode === "register" && (
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    marginBottom: "var(--space-2)",
                  }}
                >
                  {t.auth.confirmPasswordLabel}
                </label>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-muted)",
                      display: "flex",
                    }}
                  >
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      backgroundColor: "var(--bg)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "11px 12px 11px 38px",
                      color: "var(--text-primary)",
                      fontSize: "14px",
                      outline: "none",
                      transition: "border-color 0.2s",
                      boxSizing: "border-box",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderColor = "var(--accent)")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderColor = "var(--border)")
                    }
                  />
                </div>
              </div>
            )}

            {/* Чекбокс: Запомнить этот аккаунт на устройстве */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                cursor: "pointer",
                userSelect: "none",
                fontSize: "13px",
                color: "var(--text-secondary)",
                padding: "2px 0",
              }}
            >
              <input
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                style={{
                  width: "16px",
                  height: "16px",
                  accentColor: "var(--accent, #3b82f6)",
                  cursor: "pointer",
                }}
              />
              <span>Запомнить этот аккаунт на этом устройстве</span>
            </label>

            {/* Кнопка submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: isLoading
                  ? "var(--surface-raised)"
                  : "var(--accent)",
                color: isLoading ? "var(--text-muted)" : "#fff",
                border: "none",
                borderRadius: "var(--radius-md)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s",
                marginTop: "var(--space-2)",
              }}
            >
              {isLoading
                ? t.auth.loadingBtn
                : mode === "login"
                  ? t.auth.loginBtn
                  : t.auth.registerBtn}
              {!isLoading && <ArrowRight size={16} />}
            </button>
          </form>

          {/* Переключение Login / Register */}
          <div
            style={{
              textAlign: "center",
              marginTop: "var(--space-6)",
              fontSize: "13px",
              color: "var(--text-muted)",
            }}
          >
            {mode === "login" ? t.auth.noAccountPrompt : t.auth.hasAccountPrompt}{" "}
            <button
              onClick={switchMode}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                padding: 0,
                textDecoration: "none",
              }}
            >
              {mode === "login" ? t.auth.switchToRegister : t.auth.switchToLogin}
            </button>
          </div>

          <div
            style={{
              marginTop: "var(--space-5)",
              paddingTop: "var(--space-4)",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Link
              to="/leaderboard"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "var(--radius-md)",
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-secondary)",
                fontSize: "12.5px",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <Trophy size={14} style={{ color: "#f59e0b" }} />
              <span>
                {language === "ru"
                  ? "Открытый рейтинг Task-System"
                  : language === "ja"
                    ? "公開ランキング Task-System"
                    : "Public Task-System Leaderboard"}
              </span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
