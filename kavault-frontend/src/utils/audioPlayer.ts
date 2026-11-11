import { api } from "../api/axios";

const audioBlobCache = new Map<string, Blob>();
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
let sharedAudio: HTMLAudioElement | null = null;
let sharedAudioUnlocked = false;
let currentObjectUrl: string | null = null;
let playGeneration = 0;
let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
let speechKickTimer: ReturnType<typeof setTimeout> | null = null;

function revokeActiveUrl() {
  if (currentObjectUrl) {
    try {
      URL.revokeObjectURL(currentObjectUrl);
    } catch {
      // ignore
    }
    currentObjectUrl = null;
  }
}

function clearTimers() {
  if (fallbackTimer) {
    clearTimeout(fallbackTimer);
    fallbackTimer = null;
  }
  if (speechKickTimer) {
    clearTimeout(speechKickTimer);
    speechKickTimer = null;
  }
}

export function stopSpeaking() {
  playGeneration += 1;
  clearTimers();

  if (sharedAudio) {
    try {
      sharedAudio.onended = null;
      sharedAudio.onerror = null;
      sharedAudio.pause();
      sharedAudio.removeAttribute("src");
    } catch {
      // ignore
    }
  }
  revokeActiveUrl();

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // ignore
    }
  }
}

function speakWithBrowserFallback(
  text: string,
  lang: string,
  rate: number,
  gen: number,
  done: () => void,
) {
  if (
    gen !== playGeneration ||
    typeof window === "undefined" ||
    !("speechSynthesis" in window)
  ) {
    done();
    return;
  }

  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }

  // Delay slightly after cancel() to avoid Chrome/Electron cancelling the new utterance
  speechKickTimer = setTimeout(() => {
    if (gen !== playGeneration) {
      done();
      return;
    }
    try {
      const synth = window.speechSynthesis;
      synth.resume?.();

      const voices = synth.getVoices ? synth.getVoices() : [];
      const prefix = lang.split("-")[0].toLowerCase();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === lang.toLowerCase()) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(prefix));

      // Do not play if the OS has voices loaded and zero voice exists for a non-latin language
      if (voices.length > 0 && prefix === "ja" && !matchedVoice) {
        done();
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = lang;
      if (matchedVoice) utter.voice = matchedVoice;
      utter.rate = Math.max(0.55, Math.min(1.5, rate));

      let finished = false;
      const finishOnce = () => {
        if (finished) return;
        finished = true;
        clearTimers();
        done();
      };

      utter.onend = finishOnce;
      utter.onerror = finishOnce;

      // Safety watchdog in case Chromium drops onend
      const estMs = Math.max(2800, Math.min(25000, text.length * 140));
      fallbackTimer = setTimeout(finishOnce, estMs);

      synth.speak(utter);
    } catch {
      done();
    }
  }, 60);
}

export interface SpeakOptions {
  rate?: number;
  onEnd?: () => void;
  onError?: () => void;
}

export async function speakText(
  text: string,
  lang: string,
  options: SpeakOptions = {},
): Promise<void> {
  const cleanText = (text || "").trim();
  if (!cleanText) {
    options.onEnd?.();
    return;
  }

  stopSpeaking();
  const gen = playGeneration;
  const rate = Math.max(0.55, Math.min(1.5, options.rate ?? 0.95));

  // Synchronously prepare/unlock single HTMLAudioElement inside user click stack (vital for iOS Safari)
  if (!sharedAudio && typeof Audio !== "undefined") {
    sharedAudio = new Audio();
  }

  let finished = false;
  const finishOnce = (hadError = false) => {
    if (finished) return;
    finished = true;
    clearTimers();
    if (hadError) options.onError?.();
    options.onEnd?.();
  };

  try {
    const cacheKey = `${lang.toLowerCase()}::${cleanText}`;
    let blob = audioBlobCache.get(cacheKey);

    // Unlock HTMLAudioElement synchronously inside user gesture so iOS Safari allows async playback after API fetch
    if (!blob && sharedAudio && !sharedAudioUnlocked) {
      sharedAudioUnlocked = true;
      try {
        sharedAudio.src = SILENT_WAV_DATA_URI;
        const unlockPromise = sharedAudio.play();
        if (unlockPromise && typeof unlockPromise.catch === "function") {
          unlockPromise.catch(() => {
            sharedAudioUnlocked = false;
          });
        }
      } catch {
        sharedAudioUnlocked = false;
      }
    }

    if (!blob) {
      const resp = await api.get("/japanese/tts", {
        params: { text: cleanText, lang },
        responseType: "blob",
        timeout: 9000,
      });
      if (gen !== playGeneration) return;
      blob = resp.data as Blob;
      if (!blob || blob.size < 120) {
        throw new Error("Empty audio payload");
      }
      if (audioBlobCache.size >= 150) {
        const oldestKey = audioBlobCache.keys().next().value;
        if (oldestKey) audioBlobCache.delete(oldestKey);
      }
      audioBlobCache.set(cacheKey, blob);
    }

    if (gen !== playGeneration || !sharedAudio) return;

    revokeActiveUrl();
    const objUrl = URL.createObjectURL(blob);
    currentObjectUrl = objUrl;

    sharedAudio.src = objUrl;
    sharedAudio.playbackRate = rate;
    sharedAudio.onended = () => {
      if (gen !== playGeneration) return;
      finishOnce(false);
    };
    sharedAudio.onerror = () => {
      if (gen !== playGeneration) return;
      speakWithBrowserFallback(cleanText, lang, rate, gen, () => finishOnce(true));
    };

    const playPromise = sharedAudio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      await playPromise;
    }
  } catch {
    if (gen !== playGeneration) return;
    speakWithBrowserFallback(cleanText, lang, rate, gen, () => finishOnce(false));
  }
}
