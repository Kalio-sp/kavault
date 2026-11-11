import { useState } from "react";
import {
  Languages,
  Code2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Network,
  BarChart2,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { Button } from "./ui/Button";
import {
  ONBOARDING_TEXTS,
  STUDY_TEXTS,
  STUDY_VIBE_PALETTES,
  type StudyLanguage,
} from "../data/studyVibes";

const STUDY_OPTIONS: StudyLanguage[] = ["en", "de", "ja"];

export function OnboardingWizard() {
  const { language, updateStudyPreferences } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedLang, setSelectedLang] = useState<StudyLanguage>("en");
  const [wantsProgramming, setWantsProgramming] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState(false);

  const ui = ONBOARDING_TEXTS[language];
  const activePalette = STUDY_VIBE_PALETTES[selectedLang];

  const handleSelectLanguage = (lang: StudyLanguage) => {
    setSelectedLang(lang);
    document.documentElement.setAttribute("data-vibe", lang);
  };

  const handleFinish = async () => {
    try {
      setIsSaving(true);
      await updateStudyPreferences({
        studyLanguage: selectedLang,
        showProgramming: wantsProgramming,
        onboardingCompleted: true,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg)",
        backgroundImage: activePalette.onboardingColors.bg,
        color: "var(--text-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--space-6)",
        transition: "background 0.35s ease",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "740px",
          backgroundColor: "var(--surface)",
          border: `1px solid ${activePalette.onboardingColors.border}`,
          borderRadius: "16px",
          padding: "clamp(20px, 4vw, 36px)",
          boxShadow: activePalette.onboardingColors.glow,
          animation: "kavaultScaleIn 0.25s ease-out",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-6)",
        }}
      >
        {/* Шапка мастера с индикатором шагов */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                backgroundColor: activePalette.accentHex,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}
            >
              K
            </div>
            <span style={{ fontWeight: 700, fontSize: "16px" }}>KAVAULT</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: activePalette.softTint,
                color: activePalette.accentHex,
              }}
            >
              {ui.stepBadgePrefix} {step} / 2
            </span>
          </div>
        </div>

        {/* ── ШАГ 1: ВЫБОР ИЗУЧАЕМОГО ЯЗЫКА ── */}
        {step === 1 && (
          <>
            <div>
              <h1
                style={{
                  fontSize: "clamp(22px, 3vw, 28px)",
                  fontWeight: 700,
                  margin: "0 0 8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Languages size={26} color={activePalette.accentHex} />
                {ui.step1Title}
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {ui.step1Subtitle}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "14px",
              }}
            >
              {STUDY_OPTIONS.map((langCode) => {
                const pal = STUDY_VIBE_PALETTES[langCode];
                const txt = STUDY_TEXTS[langCode][language];
                const isSelected = selectedLang === langCode;
                return (
                  <div
                    key={langCode}
                    onClick={() => handleSelectLanguage(langCode)}
                    style={{
                      padding: "18px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      border: isSelected
                        ? `2px solid ${pal.accentHex}`
                        : "1px solid var(--border)",
                      background: isSelected
                        ? pal.onboardingColors.bg
                        : "var(--surface-raised)",
                      boxShadow: isSelected ? pal.onboardingColors.glow : "none",
                      transition: "all 0.2s ease",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: "30px" }}>{pal.flag}</span>
                      {isSelected && (
                        <CheckCircle2 size={20} color={pal.accentHex} />
                      )}
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: "17px",
                          fontWeight: 700,
                          color: "var(--text-primary)",
                        }}
                      >
                        {txt.name}
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: pal.accentHex,
                          marginTop: "2px",
                        }}
                      >
                        {txt.nativeName} · {txt.shortTag}
                      </div>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: "12px",
                        color: "var(--text-muted)",
                        lineHeight: 1.45,
                      }}
                    >
                      {txt.onboardingTagline}
                    </p>
                  </div>
                );
              })}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                onClick={() => setStep(2)}
                style={{
                  gap: "8px",
                  padding: "10px 22px",
                  backgroundColor: activePalette.accentHex,
                  borderColor: activePalette.accentHex,
                  color: "#fff",
                }}
              >
                {ui.continueBtn}
              </Button>
            </div>
          </>
        )}

        {/* ── ШАГ 2: ВОПРОС ПРО ВКЛАДКИ ПРОГРАММИРОВАНИЯ ── */}
        {step === 2 && (
          <>
            <div>
              <h1
                style={{
                  fontSize: "clamp(22px, 3vw, 28px)",
                  fontWeight: 700,
                  margin: "0 0 8px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Code2 size={26} color={activePalette.accentHex} />
                {ui.step2Title}
              </h1>
              <p
                style={{
                  margin: 0,
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.5,
                }}
              >
                {ui.step2Subtitle}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: "14px",
              }}
            >
              {/* Вариант ДА */}
              <div
                onClick={() => setWantsProgramming(true)}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: wantsProgramming
                    ? `2px solid ${activePalette.accentHex}`
                    : "1px solid var(--border)",
                  backgroundColor: wantsProgramming
                    ? "var(--surface-raised)"
                    : "var(--bg)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: activePalette.softTint,
                      color: activePalette.accentHex,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Code2 size={20} />
                  </div>
                  {wantsProgramming && (
                    <CheckCircle2 size={20} color={activePalette.accentHex} />
                  )}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>
                  {ui.optionProgYesTitle}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: 1.45,
                  }}
                >
                  {ui.optionProgYesDesc}
                </p>
              </div>

              {/* Вариант НЕТ */}
              <div
                onClick={() => setWantsProgramming(false)}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  border: !wantsProgramming
                    ? `2px solid ${activePalette.accentHex}`
                    : "1px solid var(--border)",
                  backgroundColor: !wantsProgramming
                    ? "var(--surface-raised)"
                    : "var(--bg)",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "10px",
                      backgroundColor: activePalette.softTint,
                      color: activePalette.accentHex,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Sparkles size={20} />
                  </div>
                  {!wantsProgramming && (
                    <CheckCircle2 size={20} color={activePalette.accentHex} />
                  )}
                </div>
                <div style={{ fontSize: "16px", fontWeight: 700 }}>
                  {ui.optionProgNoTitle}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "var(--text-muted)",
                    lineHeight: 1.45,
                  }}
                >
                  {ui.optionProgNoDesc}
                </p>
              </div>
            </div>

            {/* Напоминание, что Трекер и Граф обязательны для всех */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "10px",
                padding: "12px 14px",
                borderRadius: "10px",
                backgroundColor: "var(--surface-raised)",
                border: "1px solid var(--border)",
                fontSize: "12px",
                color: "var(--text-secondary)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <BarChart2 size={15} color={activePalette.accentHex} />
                <Network size={15} color={activePalette.secondaryHex} />
                {ui.step2Note}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <Button variant="secondary" onClick={() => setStep(1)} style={{ gap: "6px" }}>
                <ArrowLeft size={15} /> {ui.backBtn.replace("← ", "")}
              </Button>
              <Button
                onClick={handleFinish}
                disabled={isSaving}
                style={{
                  gap: "8px",
                  padding: "10px 22px",
                  backgroundColor: activePalette.accentHex,
                  borderColor: activePalette.accentHex,
                  color: "#fff",
                }}
              >
                {isSaving ? ui.savingBtn : ui.finishBtn}
                {!isSaving && <ArrowRight size={15} />}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
