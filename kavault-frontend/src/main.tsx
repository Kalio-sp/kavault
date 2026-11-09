import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Восстановление акцентного цвета до первого рендера
const savedAccent = localStorage.getItem("kavault_accent");
if (savedAccent) {
  document.documentElement.style.setProperty("--accent", savedAccent);
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
