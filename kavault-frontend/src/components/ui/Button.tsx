import React, { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = "primary", style, ...props }, ref) => {
    const getStyles = (): React.CSSProperties => {
      const base: React.CSSProperties = {
        padding: "8px 16px",
        borderRadius: "var(--radius-md)",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.2s",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        border: "1px solid transparent",
      };

      if (variant === "secondary") {
        return {
          ...base,
          backgroundColor: "var(--surface-raised)",
          color: "var(--text-primary)",
          borderColor: "var(--border)",
        };
      }
      if (variant === "ghost") {
        return {
          ...base,
          backgroundColor: "transparent",
          color: "var(--text-secondary)",
        };
      }
      // primary
      return { ...base, backgroundColor: "var(--accent)", color: "#fff" };
    };

    return (
      <button ref={ref} style={{ ...getStyles(), ...style }} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
