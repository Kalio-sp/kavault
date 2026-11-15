import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Card } from "./Card";
import { Button } from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  size = "md",
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthMap = {
    sm: "420px",
    md: "580px",
    lg: "740px",
    xl: "920px",
  };

  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "var(--overlay-bg, rgba(0, 0, 0, 0.75))",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 99999,
        padding: "16px",
        paddingTop: "max(16px, env(safe-area-inset-top, 16px))",
        paddingBottom: "max(16px, env(safe-area-inset-bottom, 16px))",
        animation: "kavaultFadeIn 0.2s ease-out",
      }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: maxWidthMap[size],
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.85), 0 0 0 1px var(--border)",
          border: "1px solid var(--border)",
          animation: "kavaultScaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
          maxHeight: "min(90vh, calc(100dvh - 32px))",
          overflowY: "auto",
          margin: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid var(--border)",
            paddingBottom: "var(--space-3)",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            {title}
          </h3>
          <Button
            variant="ghost"
            onClick={onClose}
            style={{
              padding: "6px",
              color: "var(--text-muted)",
              transition: "all 0.15s ease",
            }}
          >
            <X size={18} />
          </Button>
        </div>

        <div>{children}</div>
      </Card>
    </div>,
    document.body
  );
}
