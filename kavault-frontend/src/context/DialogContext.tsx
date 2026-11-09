import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  TriangleAlert,
  CheckCircle2,
  Info,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export type DialogVariant = "danger" | "warning" | "info" | "success";

export interface DialogOptions {
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: DialogVariant;
  icon?: React.ReactNode;
}

interface DialogState extends DialogOptions {
  isOpen: boolean;
  type: "confirm" | "alert";
  resolve: (value: boolean) => void;
}

interface DialogContextType {
  confirm: (options: DialogOptions) => Promise<boolean>;
  alert: (options: Omit<DialogOptions, "cancelText">) => Promise<void>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

// Глобальные ссылки для вызова модалок без обязательного использования хука
let globalConfirmHandler: ((options: DialogOptions) => Promise<boolean>) | null =
  null;
let globalAlertHandler:
  | ((options: Omit<DialogOptions, "cancelText">) => Promise<void>)
  | null = null;

export const confirmModal = (options: DialogOptions): Promise<boolean> => {
  if (globalConfirmHandler) {
    return globalConfirmHandler(options);
  }
  // Запасной вариант при сбое монтирования
  const text = typeof options.message === "string" ? options.message : "";
  return Promise.resolve(window.confirm(`${options.title}\n\n${text}`));
};

export const alertModal = (
  options: Omit<DialogOptions, "cancelText">,
): Promise<void> => {
  if (globalAlertHandler) {
    return globalAlertHandler(options);
  }
  const text = typeof options.message === "string" ? options.message : "";
  window.alert(`${options.title}\n\n${text}`);
  return Promise.resolve();
};

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: "confirm",
    title: "",
    message: "",
    variant: "info",
    resolve: () => {},
  });

  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  const confirm = useCallback((options: DialogOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({
        ...options,
        isOpen: true,
        type: "confirm",
        variant: options.variant || "info",
        confirmText: options.confirmText || "Подтвердить",
        cancelText: options.cancelText || "Отмена",
        resolve,
      });
    });
  }, []);

  const alert = useCallback(
    (options: Omit<DialogOptions, "cancelText">): Promise<void> => {
      return new Promise((resolve) => {
        setDialogState({
          ...options,
          isOpen: true,
          type: "alert",
          variant: options.variant || "info",
          confirmText: options.confirmText || "Понятно",
          resolve: () => resolve(),
        });
      });
    },
    [],
  );

  useEffect(() => {
    globalConfirmHandler = confirm;
    globalAlertHandler = alert;
    return () => {
      globalConfirmHandler = null;
      globalAlertHandler = null;
    };
  }, [confirm, alert]);

  const handleClose = (result: boolean) => {
    setDialogState((prev) => {
      prev.resolve(result);
      return { ...prev, isOpen: false };
    });
  };

  // Фокус и горячие клавиши
  useEffect(() => {
    if (!dialogState.isOpen) return;

    // Автофокус на кнопку подтверждения для быстрого нажатия Enter
    const timer = setTimeout(() => {
      confirmButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose(false);
      } else if (e.key === "Enter" && !e.shiftKey) {
        // Если фокус не на кнопке отмены, Enter подтверждает
        if (document.activeElement?.getAttribute("data-action") !== "cancel") {
          e.preventDefault();
          handleClose(true);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [dialogState.isOpen]);

  // Выбор иконки и цвета в зависимости от типа
  const getIconAndColors = () => {
    switch (dialogState.variant) {
      case "danger":
        return {
          icon: dialogState.icon || <Trash2 size={24} />,
          iconBg: "rgba(239, 68, 68, 0.12)",
          iconBorder: "rgba(239, 68, 68, 0.3)",
          iconColor: "#ef4444",
          buttonBg: "#ef4444",
          buttonHover: "#dc2626",
          buttonColor: "#ffffff",
          shadowGlow: "0 0 24px rgba(239, 68, 68, 0.2)",
        };
      case "warning":
        return {
          icon: dialogState.icon || <TriangleAlert size={24} />,
          iconBg: "rgba(245, 158, 11, 0.12)",
          iconBorder: "rgba(245, 158, 11, 0.3)",
          iconColor: "#f59e0b",
          buttonBg: "#f59e0b",
          buttonHover: "#d97706",
          buttonColor: "#000000",
          shadowGlow: "0 0 24px rgba(245, 158, 11, 0.2)",
        };
      case "success":
        return {
          icon: dialogState.icon || <CheckCircle2 size={24} />,
          iconBg: "rgba(16, 185, 129, 0.12)",
          iconBorder: "rgba(16, 185, 129, 0.3)",
          iconColor: "#10b981",
          buttonBg: "#10b981",
          buttonHover: "#059669",
          buttonColor: "#ffffff",
          shadowGlow: "0 0 24px rgba(16, 185, 129, 0.2)",
        };
      default:
        return {
          icon: dialogState.icon || <Info size={24} />,
          iconBg: "var(--accent-soft)",
          iconBorder: "rgba(59, 130, 246, 0.3)",
          iconColor: "var(--accent)",
          buttonBg: "var(--accent)",
          buttonHover: "var(--accent)",
          buttonColor: "#ffffff",
          shadowGlow: "0 0 24px rgba(59, 130, 246, 0.2)",
        };
    }
  };

  const styleConfig = getIconAndColors();

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}

      {/* Красивое кастомное всплывающее Alert / Confirm окно */}
      {dialogState.isOpen && (
        <div
          onClick={() => handleClose(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(9, 9, 11, 0.8)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "var(--space-4)",
            animation: "kavaultFadeIn 0.2s ease-out",
          }}
        >
          <Card
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "460px",
              padding: "var(--space-6)",
              borderRadius: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
              backgroundColor: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: `0 25px 60px -15px rgba(0, 0, 0, 0.8), ${styleConfig.shadowGlow}`,
              animation: "kavaultScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              position: "relative",
            }}
          >
            {/* Кнопка закрытия в углу */}
            <button
              onClick={() => handleClose(false)}
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                background: "transparent",
                border: "none",
                color: "var(--text-muted)",
                cursor: "pointer",
                padding: "6px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-primary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              <X size={18} />
            </button>

            {/* Шапка: светящаяся иконка и заголовок */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-4)",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "14px",
                  backgroundColor: styleConfig.iconBg,
                  border: `1px solid ${styleConfig.iconBorder}`,
                  color: styleConfig.iconColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {styleConfig.icon}
              </div>

              <div style={{ flex: 1, paddingTop: "2px" }}>
                <h3
                  style={{
                    margin: "0 0 6px 0",
                    fontSize: "19px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                    lineHeight: 1.3,
                  }}
                >
                  {dialogState.title}
                </h3>
                <div
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    wordBreak: "break-word",
                  }}
                >
                  {dialogState.message}
                </div>
              </div>
            </div>

            {/* Подвал с кнопками */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--space-3)",
                marginTop: "var(--space-2)",
              }}
            >
              {dialogState.type === "confirm" && (
                <Button
                  data-action="cancel"
                  variant="secondary"
                  onClick={() => handleClose(false)}
                  style={{
                    padding: "10px 18px",
                    fontSize: "14px",
                    borderRadius: "10px",
                    minWidth: "90px",
                  }}
                >
                  {dialogState.cancelText}
                </Button>
              )}

              <Button
                ref={confirmButtonRef}
                data-action="confirm"
                onClick={() => handleClose(true)}
                style={{
                  padding: "10px 20px",
                  fontSize: "14px",
                  borderRadius: "10px",
                  backgroundColor: styleConfig.buttonBg,
                  color: styleConfig.buttonColor,
                  fontWeight: 600,
                  border: "none",
                  boxShadow: `0 4px 14px ${styleConfig.iconBorder}`,
                  minWidth: dialogState.type === "alert" ? "120px" : "100px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    styleConfig.buttonHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = styleConfig.buttonBg;
                }}
              >
                {dialogState.confirmText}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </DialogContext.Provider>
  );
}

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
