export type LearningStatus = "TO_LEARN" | "LEARNING" | "COMPLETED";

export function extractHostname(rawUrl: string): string {
  try {
    const normalized = rawUrl.startsWith("http") ? rawUrl : `https://${rawUrl}`;
    return new URL(normalized).hostname.replace(/^www\./, "");
  } catch {
    return rawUrl;
  }
}

export function normalizeUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

export function parseTagInput(raw: string): string[] {
  return raw
    .split(/[,\s]+/)
    .map((tag) => tag.replace(/^#/, "").trim().toLowerCase())
    .filter((tag, idx, arr) => tag.length > 0 && arr.indexOf(tag) === idx)
    .slice(0, 6);
}

export function formatNotePreview(note?: string): string {
  if (!note) return "";
  return note
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/[`*_>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function getNextLearningStatus(current: string): LearningStatus {
  const cycleMap: Record<string, LearningStatus> = {
    TO_LEARN: "LEARNING",
    LEARNING: "COMPLETED",
    COMPLETED: "TO_LEARN",
  };
  return cycleMap[current] || "TO_LEARN";
}
