import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  variant?: "default" | "elevated" | "interactive";
}

export function Card({
  children,
  style,
  className = "",
  variant = "default",
  ...props
}: CardProps) {
  const variantClass = variant !== "default" ? `kv-card-${variant}` : "";
  return (
    <div
      className={`kv-card ${variantClass} ${className}`.trim()}
      style={{
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
