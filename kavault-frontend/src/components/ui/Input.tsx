import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export function Input({ icon, style, ...props }: InputProps) {
  return (
    <div style={{ position: "relative", width: "100%" }}>
      {icon && (
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
          {icon}
        </div>
      )}
      <input
        style={{
          width: "100%",
          backgroundColor: "var(--bg)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          padding: icon ? "10px 12px 10px 36px" : "10px 12px",
          color: "var(--text-primary)",
          fontSize: "14px",
          outline: "none",
          transition: "border-color 0.2s",
          ...style,
        }}
        {...props}
      />
    </div>
  );
}
