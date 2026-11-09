import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success";
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const getColors = () => {
    if (variant === "accent")
      return { bg: "var(--accent-soft)", color: "var(--accent)" };
    if (variant === "success")
      return { bg: "rgba(53, 185, 130, 0.1)", color: "var(--success)" };
    return { bg: "var(--surface-raised)", color: "var(--text-secondary)" };
  };

  const { bg, color } = getColors();

  return (
    <span
      style={{
        backgroundColor: bg,
        color: color,
        padding: "2px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}
