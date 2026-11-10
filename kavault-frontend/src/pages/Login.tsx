import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";

type AuthMode = "login" | "register";

export function Login() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && !nickname.trim()) {
      setError("Пожалуйста, введите ваше имя или никнейм");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);

    try {
      if (mode === "register") {
        await api.post("/auth/register", { email, password });
        if (nickname.trim()) {
          localStorage.setItem("kavault_username", nickname.trim());
        }
        // После успешной регистрации — сразу логиним
        const response = await api.post("/auth/login", { email, password });
        localStorage.setItem("access_token", response.data.access_token);
      } else {
        const response = await api.post("/auth/login", { email, password });
        localStorage.setItem("access_token", response.data.access_token);
      }

      navigate("/dashboard");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      if (Array.isArray(msg)) {
        setError(msg.join(", "));
      } else {
        setError(msg || "Ошибка подключения к серверу");
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
            Храни знания.
            <br />
            Учись каждый день.
          </h1>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "15px",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            Платформа для организации знаний, трекинга обучения
            <br />и интервального повторения.
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
            {[
              "Интервальное повторение (SRS)",
              "Трекер активности и стриков",
              "Граф знаний",
            ].map((feature) => (
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
            {mode === "login" ? "Вход в аккаунт" : "Создать аккаунт"}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              margin: "0 0 var(--space-6) 0",
              fontSize: "14px",
            }}
          >
            {mode === "login"
              ? "Введите свои данные для входа"
              : "Заполните данные для регистрации"}
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
                Email
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
                  Никнейм / Имя
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
                    placeholder="Введите ваше имя или никнейм"
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
                Пароль
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
                  Подтвердите пароль
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
                ? "Загрузка..."
                : mode === "login"
                  ? "Войти"
                  : "Создать аккаунт"}
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
            {mode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
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
              {mode === "login" ? "Зарегистрироваться" : "Войти"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
