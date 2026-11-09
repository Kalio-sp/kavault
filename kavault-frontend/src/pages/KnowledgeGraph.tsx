import { useEffect, useRef, useState } from "react";
import { api } from "../api/axios";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import {
  Network,
  Plus,
  Minus,
  Maximize2,
  ExternalLink,
} from "lucide-react";
import { useApp } from "../context/AppContext";

/* ───────────── Типы и константы ───────────── */

const VAULT = 0;
const TOPIC = 1;
const RES = 2;

const TAU = Math.PI * 2;
const GOLDEN = 2.399963;
const SPACING = 6;
const RES_R = 3.8;

const ALPHA_START = 0.35;
const ALPHA_MIN = 0.001;
const ALPHA_DECAY = 0.994;
const DAMPING = 0.86;
const MAX_V = 8;
const REPULSION = 8;
const REPULSION_RANGE = 90;
const SPRING = 0.08;

interface RawItem {
  topic: string;
  label: string;
  url?: string;
  type?: string;
}

interface Graph {
  n: number;
  topicsCount: number;
  kind: Uint8Array;
  radius: Float32Array;
  parent: Int32Array;
  len: Float32Array;
  invM: Float32Array;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  childStart: Int32Array;
  childEnd: Int32Array;
  labels: string[];
  urls: (string | undefined)[];
  topicNames: string[];
}

interface TooltipInfo {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  category?: string;
  badgeColor?: string;
  url?: string;
}

/* ───────────── Адаптер данных ───────────── */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getTopic = (r: Record<string, any>): string => {
  const raw =
    r.category ??
    r.topic ??
    r.type ??
    (Array.isArray(r.tags) && r.tags.length > 0 ? r.tags[0] : undefined);
  if (typeof raw === "string" && raw.trim()) {
    const clean = raw.trim();
    if (clean === "ARTICLE") return "Articles";
    if (clean === "VIDEO") return "Videos";
    if (clean === "REPOSITORY") return "Repositories";
    if (clean === "DOCUMENTATION") return "Docs";
    return clean;
  }
  return "General";
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getLabel = (r: Record<string, any>): string =>
  String(r.title ?? r.name ?? r.url ?? "Untitled");

/* ───────────── Построитель графа ───────────── */

function buildGraph(items: RawItem[], japanese: number): Graph {
  const groups = new Map<string, RawItem[]>();
  for (const it of items) {
    const g = groups.get(it.topic);
    if (g) g.push(it);
    else groups.set(it.topic, [it]);
  }

  interface TopicDef {
    name: string;
    items: RawItem[];
    extra: number;
  }

  const defs: TopicDef[] = [...groups].map(([name, list]) => ({
    name,
    items: list,
    extra: 0,
  }));

  if (japanese > 0) {
    const ex = defs.find((d) => d.name === "Japanese");
    if (ex) ex.extra = japanese;
    else defs.push({ name: "Japanese", items: [], extra: japanese });
  }

  // Если вообще пусто — создаем пару начальных подсказочных узлов
  if (defs.length === 0) {
    defs.push({ name: "Resources", items: [], extra: 0 });
    defs.push({ name: "Japanese", items: [], extra: 0 });
  }

  defs.sort((a, b) => b.items.length + b.extra - (a.items.length + a.extra));

  const T = defs.length;
  const totalItems = defs.reduce((acc, d) => acc + d.items.length, 0);
  const N = 1 + T + totalItems;

  const g: Graph = {
    n: N,
    topicsCount: T,
    kind: new Uint8Array(N),
    radius: new Float32Array(N),
    parent: new Int32Array(N).fill(-1),
    len: new Float32Array(N),
    invM: new Float32Array(N).fill(1),
    x: new Float32Array(N),
    y: new Float32Array(N),
    vx: new Float32Array(N),
    vy: new Float32Array(N),
    childStart: new Int32Array(T + 1),
    childEnd: new Int32Array(T + 1),
    labels: new Array<string>(N),
    urls: new Array<string | undefined>(N),
    topicNames: new Array<string>(N),
  };

  g.kind[0] = VAULT;
  g.radius[0] = 26;
  g.labels[0] = "KAVAULT";
  g.topicNames[0] = "Core Knowledge Vault";
  g.invM[0] = 1 / (1 + 0.8 * N);

  const topicR = defs.map(
    (d) => 12 + Math.min(Math.log2(d.items.length + d.extra + 1) * 2.2, 18),
  );

  const widths = defs.map(
    (d, t) => 2 * (topicR[t] + 20 + SPACING * Math.sqrt(d.items.length)) + 50,
  );
  const W = widths.reduce((a, b) => a + b, 0) || 1;
  const R = Math.max(160, (W / TAU) * 1.15);

  let cum = 0;
  let next = 1 + T;

  defs.forEach((d, t) => {
    const ti = 1 + t;
    const a = ((cum + widths[t] / 2) / W) * TAU - Math.PI / 2;
    cum += widths[t];
    const tx = Math.cos(a) * R;
    const ty = Math.sin(a) * R;
    const count = d.items.length + d.extra;

    g.kind[ti] = TOPIC;
    g.radius[ti] = topicR[t];
    g.x[ti] = tx;
    g.y[ti] = ty;
    g.parent[ti] = 0;
    g.len[ti] = R;
    g.invM[ti] = 1 / (1 + 0.5 * d.items.length);
    g.labels[ti] = `${d.name} (${count})`;
    g.topicNames[ti] = d.name;

    g.childStart[ti] = next;
    for (let k = 0; k < d.items.length; k++) {
      const i = next++;
      const rr = topicR[t] + 12 + SPACING * Math.sqrt(k + 0.5);
      const ang = k * GOLDEN;
      g.kind[i] = RES;
      g.radius[i] = RES_R;
      g.x[i] = tx + Math.cos(ang) * rr;
      g.y[i] = ty + Math.sin(ang) * rr;
      g.parent[i] = ti;
      g.len[i] = rr;
      g.labels[i] = d.items[k].label;
      g.urls[i] = d.items[k].url;
      g.topicNames[i] = d.name;
    }
    g.childEnd[ti] = next;
  });

  return g;
}

/* ───────────── Компонент Графа Знаний ───────────── */

export function KnowledgeGraph() {
  const { t } = useApp();
  const [graph, setGraph] = useState<Graph | null>(null);
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);

  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Камера с плавным сглаживанием (Target vs Current)
  const cameraRef = useRef({
    zoom: 1,
    targetZoom: 1,
    panX: 0,
    targetPanX: 0,
    panY: 0,
    targetPanY: 0,
    fit: () => {},
    zoomBy: (_factor: number) => {},
  });

  /* Загрузка данных */
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [resResp, japResp] = await Promise.all([
          api.get("/resources").catch(() => ({ data: [] })),
          api.get("/japanese").catch(() => ({ data: [] })),
        ]);
        if (cancelled) return;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const items: RawItem[] = (resResp.data ?? []).map((r: any) => ({
          topic: getTopic(r),
          label: getLabel(r),
          url: typeof r.url === "string" ? r.url : undefined,
          type: r.type,
        }));

        setGraph(buildGraph(items, (japResp.data ?? []).length));
      } catch (error) {
        console.error("Ошибка загрузки графа", error);
        if (!cancelled) setGraph(buildGraph([], 0));
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  /* Симуляция и рендеринг */
  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!graph || !wrap || !canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const {
      n: N,
      topicsCount: T,
      kind,
      radius,
      parent,
      len,
      invM,
      x,
      y,
      vx,
      vy,
      childStart,
      childEnd,
      labels,
      urls,
      topicNames,
    } = graph;

    /* Палитра тем */
    const accent = "#3b82f6";
    const accentSoft = "rgba(59, 130, 246, 0.25)";
    const textPrimary = "#f4f4f5";
    const textSecondary = "#a1a1aa";

    // Тематические цвета
    const topicColors: { main: string; glow: string; soft: string; hue: number }[] = [];
    for (let i = 0; i <= T; i++) {
      const hue = Math.round((i * 137.5 + 200) % 360);
      topicColors.push({
        main: `hsl(${hue}, 85%, 65%)`,
        glow: `hsl(${hue}, 90%, 55%)`,
        soft: `hsla(${hue}, 80%, 60%, 0.18)`,
        hue,
      });
    }

    let w = 0;
    let h = 0;
    let dpr = 1;

    // Плавная камера (Lerp)
    let zoom = 1;
    let targetZoom = 1;
    let panX = 0;
    let targetPanX = 0;
    let panY = 0;
    let targetPanY = 0;

    let alpha = ALPHA_START;
    let hover = -1;
    let dragging = -1;
    let panning = false;
    let moved = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let grabOffsetX = 0;
    let grabOffsetY = 0;
    let raf = 0;
    let disposed = false;
    let startTime = 0;

    // Индивидуальная прозрачность для плавного фокуса связей
    const nodeOpacity = new Float32Array(N).fill(1);

    /* Центрирование графа (Fit to view) */
    const fit = (smooth = true) => {
      if (w < 10 || h < 10) return;
      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;

      for (let i = 0; i < N; i++) {
        if (x[i] < minX) minX = x[i];
        if (x[i] > maxX) maxX = x[i];
        if (y[i] < minY) minY = y[i];
        if (y[i] > maxY) maxY = y[i];
      }

      const bw = Math.max(maxX - minX + 160, 200);
      const bh = Math.max(maxY - minY + 160, 200);

      const calculatedZoom = Math.min(1.4, Math.max(0.15, Math.min(w / bw, h / bh) * 0.9));
      const calculatedPanX = -((minX + maxX) / 2) * calculatedZoom;
      const calculatedPanY = -((minY + maxY) / 2) * calculatedZoom;

      if (smooth) {
        targetZoom = calculatedZoom;
        targetPanX = calculatedPanX;
        targetPanY = calculatedPanY;
      } else {
        zoom = targetZoom = calculatedZoom;
        panX = targetPanX = calculatedPanX;
        panY = targetPanY = calculatedPanY;
      }
    };

    cameraRef.current.fit = () => fit(true);
    cameraRef.current.zoomBy = (factor: number) => {
      targetZoom = Math.min(4.5, Math.max(0.1, targetZoom * factor));
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      if (startTime === 0 && w > 10) {
        fit(false);
      }
    };

    const toWorld = (sx: number, sy: number) => ({
      x: (sx - w / 2 - panX) / zoom,
      y: (sy - h / 2 - panY) / zoom,
    });

    const toScreen = (wx: number, wy: number) => ({
      x: wx * zoom + w / 2 + panX,
      y: wy * zoom + h / 2 + panY,
    });

    /* Hit-testing */
    const hitTest = (mx: number, my: number): number => {
      const p = toWorld(mx, my);
      const tolerance = 6 / zoom;

      // 1. Vault
      const dx0 = p.x - x[0];
      const dy0 = p.y - y[0];
      if (dx0 * dx0 + dy0 * dy0 <= (radius[0] + tolerance) ** 2) return 0;

      // 2. Topics
      for (let i = 1; i <= T; i++) {
        const dx = p.x - x[i];
        const dy = p.y - y[i];
        if (dx * dx + dy * dy <= (radius[i] + tolerance) ** 2) return i;
      }

      // 3. Resources
      const rHit = Math.max(RES_R, 4 / zoom) + tolerance;
      let best = -1;
      let bestDistSq = rHit * rHit;

      for (let i = T + 1; i < N; i++) {
        const dx = p.x - x[i];
        const dy = p.y - y[i];
        const dSq = dx * dx + dy * dy;
        if (dSq < bestDistSq) {
          bestDistSq = dSq;
          best = i;
        }
      }

      return best;
    };

    /* Физика с ограничением импульса и демпфированием */
    const tickPhysics = () => {
      if (alpha < ALPHA_MIN) return;

      const k = REPULSION * alpha;
      const ks = SPRING * alpha;

      // Взаимное отталкивание (мягкое сглаживание)
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          let dx = x[j] - x[i];
          let dy = y[j] - y[i];
          let d2 = dx * dx + dy * dy;

          if (d2 > REPULSION_RANGE * REPULSION_RANGE || d2 < 0.1) continue;

          const dist = Math.sqrt(d2);
          const force = (k * 20) / (d2 + 100);
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          vx[i] -= fx * invM[i];
          vy[i] -= fy * invM[i];
          vx[j] += fx * invM[j];
          vy[j] += fy * invM[j];
        }
      }

      // Пружины связей (Topic -> Vault, Resource -> Topic)
      for (let i = 1; i < N; i++) {
        const p = parent[i];
        const dx = x[p] - x[i];
        const dy = y[p] - y[i];
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const targetLen = len[i];
        const s = ((d - targetLen) / d) * ks;

        const fx = dx * s;
        const fy = dy * s;

        vx[i] += fx * invM[i];
        vy[i] += fy * invM[i];
        vx[p] -= fx * invM[p];
        vy[p] -= fy * invM[p];
      }

      // Интеграция скоростей
      for (let i = 0; i < N; i++) {
        if (i === dragging) {
          vx[i] = 0;
          vy[i] = 0;
          continue;
        }

        vx[i] *= DAMPING;
        vy[i] *= DAMPING;

        // Force clamping
        const speed = Math.hypot(vx[i], vy[i]);
        if (speed > MAX_V) {
          vx[i] = (vx[i] / speed) * MAX_V;
          vy[i] = (vy[i] / speed) * MAX_V;
        }

        x[i] += vx[i];
        y[i] += vy[i];
      }

      alpha *= ALPHA_DECAY;
    };

    /* Фоновая сетка для пространственной глубины */
    const drawGrid = (ctx: CanvasRenderingContext2D) => {
      const gridSize = 40;
      const startWorldX = Math.floor((-w / 2 - panX) / zoom / gridSize) * gridSize;
      const endWorldX = Math.ceil((w / 2 - panX) / zoom / gridSize) * gridSize;
      const startWorldY = Math.floor((-h / 2 - panY) / zoom / gridSize) * gridSize;
      const endWorldY = Math.ceil((h / 2 - panY) / zoom / gridSize) * gridSize;

      ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
      const dotRadius = Math.max(0.7, 1.2 / zoom);

      for (let gx = startWorldX; gx <= endWorldX; gx += gridSize) {
        for (let gy = startWorldY; gy <= endWorldY; gy += gridSize) {
          ctx.beginPath();
          ctx.arc(gx, gy, dotRadius, 0, TAU);
          ctx.fill();
        }
      }
    };

    /* Отрисовка кадра */
    const render = (time: number) => {
      if (startTime === 0) startTime = time;
      const elapsed = time - startTime;

      // Плавная интерполяция камеры (Lerp: 60-144fps)
      const lerpSpeed = 0.14;
      zoom += (targetZoom - zoom) * lerpSpeed;
      panX += (targetPanX - panX) * lerpSpeed;
      panY += (targetPanY - panY) * lerpSpeed;

      cameraRef.current.zoom = zoom;
      cameraRef.current.panX = panX;
      cameraRef.current.panY = panY;

      // Плавное обновление прозрачности узлов при наведении
      const hasHover = hover >= 0;
      for (let i = 0; i < N; i++) {
        let targetOp = 1.0;
        if (hasHover) {
          if (hover === 0) {
            targetOp = 1.0; // При наведении на ядро видно всё
          } else if (kind[hover] === TOPIC) {
            targetOp =
              i === hover || i === 0 || (i >= childStart[hover] && i < childEnd[hover])
                ? 1.0
                : 0.15;
          } else {
            // Ресурс
            targetOp = i === hover || i === parent[hover] || i === 0 ? 1.0 : 0.12;
          }
        }
        nodeOpacity[i] += (targetOp - nodeOpacity[i]) * 0.15;
      }

      // Очистка
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Матрица трансформации холста
      ctx.setTransform(
        dpr * zoom,
        0,
        0,
        dpr * zoom,
        dpr * (w / 2 + panX),
        dpr * (h / 2 + panY),
      );

      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      // 1. Отрисовка сетки
      drawGrid(ctx);

      // 2. Дыхание графа (ambient subtle motion)
      const breath = Math.sin(elapsed * 0.0018) * 0.5;

      // 3. Линии связей: Vault -> Topics
      ctx.lineWidth = 1.2 / zoom;
      for (let ti = 1; ti <= T; ti++) {
        const op = Math.min(nodeOpacity[0], nodeOpacity[ti]);
        const tc = topicColors[ti];

        ctx.strokeStyle = `hsla(${tc.hue}, 40%, 40%, ${0.35 * op})`;
        ctx.beginPath();

        // Изящная плавная дуга
        const x0 = x[0];
        const y0 = y[0];
        const x1 = x[ti];
        const y1 = y[ti];

        const mx = (x0 + x1) / 2;
        const my = (y0 + y1) / 2;
        const dx = x1 - x0;
        const dy = y1 - y0;
        const dist = Math.hypot(dx, dy) || 1;
        const curveOffset = dist * 0.12;
        const cpx = mx - (dy / dist) * curveOffset;
        const cpy = my + (dx / dist) * curveOffset;

        ctx.moveTo(x0, y0);
        ctx.quadraticCurveTo(cpx, cpy, x1, y1);
        ctx.stroke();

        // Светящаяся бегущая частица энергии (Pulse particle)
        const particleProgress = (elapsed * 0.00035 + ti * 0.23) % 1;
        const t2 = particleProgress;
        const omt = 1 - t2;
        const px = omt * omt * x0 + 2 * omt * t2 * cpx + t2 * t2 * x1;
        const py = omt * omt * y0 + 2 * omt * t2 * cpy + t2 * t2 * y1;

        ctx.fillStyle = tc.main;
        ctx.beginPath();
        ctx.arc(px, py, (2.2 + breath) / zoom, 0, TAU);
        ctx.shadowColor = tc.glow;
        ctx.shadowBlur = 8 / zoom;
        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      // 4. Линии связей: Topic -> Resources
      if (zoom > 0.4) {
        ctx.lineWidth = 0.7 / zoom;
        for (let ti = 1; ti <= T; ti++) {
          const tc = topicColors[ti];
          const tx = x[ti];
          const ty = y[ti];

          for (let i = childStart[ti]; i < childEnd[ti]; i++) {
            const op = Math.min(nodeOpacity[ti], nodeOpacity[i]);
            if (op < 0.05) continue;

            ctx.strokeStyle = `hsla(${tc.hue}, 60%, 55%, ${0.28 * op})`;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(x[i], y[i]);
            ctx.stroke();
          }
        }
      }

      // 5. Узлы ресурсов
      for (let ti = 1; ti <= T; ti++) {
        const tc = topicColors[ti];
        for (let i = childStart[ti]; i < childEnd[ti]; i++) {
          const op = nodeOpacity[i];
          if (op < 0.04) continue;

          const rx = x[i];
          const ry = y[i];
          const isSelected = hover === i;
          const r = (isSelected ? RES_R * 1.5 : RES_R) / (zoom < 0.5 ? 0.7 : 1);

          ctx.fillStyle = tc.main;
          ctx.beginPath();
          ctx.arc(rx, ry, r, 0, TAU);
          ctx.fill();

          if (isSelected) {
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 1.8 / zoom;
            ctx.shadowColor = tc.glow;
            ctx.shadowBlur = 10 / zoom;
            ctx.stroke();
            ctx.shadowColor = "transparent";
            ctx.shadowBlur = 0;
          }
        }
      }

      // 6. Узлы топиков (крупные круги с радиальным свечением)
      for (let i = 1; i <= T; i++) {
        const op = nodeOpacity[i];
        if (op < 0.04) continue;

        const tc = topicColors[i];
        const rad = radius[i];
        const isHovered = hover === i;

        // Радиальный градиент
        const grad = ctx.createRadialGradient(x[i], y[i], 0, x[i], y[i], rad);
        grad.addColorStop(0, tc.soft);
        grad.addColorStop(0.7, `hsla(${tc.hue}, 80%, 40%, 0.25)`);
        grad.addColorStop(1, "rgba(24, 24, 27, 0.85)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x[i], y[i], rad, 0, TAU);
        ctx.fill();

        // Ободок
        ctx.strokeStyle = isHovered ? "#ffffff" : tc.main;
        ctx.lineWidth = (isHovered ? 2.5 : 1.6) / zoom;
        if (isHovered) {
          ctx.shadowColor = tc.glow;
          ctx.shadowBlur = 14 / zoom;
        }
        ctx.stroke();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;

        // Лейбл категории
        ctx.font = `600 ${Math.max(12, 13 / zoom)}px Inter, sans-serif`;
        ctx.fillStyle = textPrimary;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(topicNames[i], x[i], y[i]);

        // Число под кругом
        const count = childEnd[i] - childStart[i];
        ctx.font = `500 ${Math.max(10, 11 / zoom)}px Inter, sans-serif`;
        ctx.fillStyle = textSecondary;
        ctx.fillText(`${count} items`, x[i], y[i] + rad + 14 / zoom);
      }

      // 7. Центральный узел (KAVAULT Vault Core)
      const vaultRadius = radius[0] + breath;
      const isVaultHovered = hover === 0;

      // Мягкий внешний ореол (Glow Ring)
      const glowGrad = ctx.createRadialGradient(
        x[0],
        y[0],
        vaultRadius * 0.8,
        x[0],
        y[0],
        vaultRadius * 2,
      );
      glowGrad.addColorStop(0, accentSoft);
      glowGrad.addColorStop(1, "transparent");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(x[0], y[0], vaultRadius * 2, 0, TAU);
      ctx.fill();

      // Ядро
      const vaultGrad = ctx.createRadialGradient(
        x[0] - 4,
        y[0] - 4,
        0,
        x[0],
        y[0],
        vaultRadius,
      );
      vaultGrad.addColorStop(0, "#60a5fa");
      vaultGrad.addColorStop(0.6, accent);
      vaultGrad.addColorStop(1, "#1d4ed8");

      ctx.fillStyle = vaultGrad;
      ctx.beginPath();
      ctx.arc(x[0], y[0], vaultRadius, 0, TAU);
      ctx.shadowColor = accent;
      ctx.shadowBlur = (isVaultHovered ? 24 : 16) / zoom;
      ctx.fill();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Текст ядра
      ctx.font = `700 ${Math.max(11, 12 / zoom)}px Inter, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("KAVAULT", x[0], y[0]);
    };

    /* Главный анимационный цикл 60-144 FPS */
    const frame = (time: number) => {
      if (disposed) return;
      tickPhysics();
      render(time);
      raf = requestAnimationFrame(frame);
    };

    resize();
    const observer = new ResizeObserver(() => resize());
    observer.observe(wrap);

    raf = requestAnimationFrame(frame);

    /* События мыши / тача */
    const getPos = (e: PointerEvent | MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      const p = getPos(e);
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
      moved = false;

      const hit = hitTest(p.x, p.y);
      if (hit >= 0) {
        dragging = hit;
        const wp = toWorld(p.x, p.y);
        grabOffsetX = x[hit] - wp.x;
        grabOffsetY = y[hit] - wp.y;
        canvas.style.cursor = "grabbing";
      } else {
        panning = true;
        canvas.style.cursor = "grabbing";
      }

      canvas.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const p = getPos(e);

      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 4) {
        moved = true;
      }

      if (dragging >= 0) {
        const wp = toWorld(p.x, p.y);
        const newX = wp.x + grabOffsetX;
        const newY = wp.y + grabOffsetY;
        const dx = newX - x[dragging];
        const dy = newY - y[dragging];

        x[dragging] = newX;
        y[dragging] = newY;

        // Если тянем топик — тянем за собой дочерние ресурсы
        if (kind[dragging] === TOPIC) {
          for (let j = childStart[dragging]; j < childEnd[dragging]; j++) {
            x[j] += dx;
            y[j] += dy;
          }
        }
        alpha = Math.max(alpha, 0.08); // Оживляем симуляцию
      } else if (panning) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        targetPanX += dx;
        targetPanY += dy;
      } else {
        // Hover detection & Tooltip
        const hit = hitTest(p.x, p.y);
        if (hit !== hover) {
          hover = hit;
          canvas.style.cursor = hit >= 0 ? "pointer" : "grab";

          if (hit >= 0) {
            const sc = toScreen(x[hit], y[hit]);
            if (hit === 0) {
              setTooltip({
                x: sc.x,
                y: sc.y - radius[0] * zoom - 14,
                title: "KAVAULT Core",
                subtitle: "Центральное хранилище знаний",
                category: "Vault",
                badgeColor: accent,
              });
            } else if (kind[hit] === TOPIC) {
              const count = childEnd[hit] - childStart[hit];
              setTooltip({
                x: sc.x,
                y: sc.y - radius[hit] * zoom - 14,
                title: topicNames[hit],
                subtitle: `${count} связанных материалов`,
                category: "Topic",
                badgeColor: topicColors[hit].main,
              });
            } else {
              setTooltip({
                x: sc.x,
                y: sc.y - RES_R * zoom - 14,
                title: labels[hit],
                subtitle: urls[hit] ? "Нажмите, чтобы открыть ссылку" : undefined,
                category: topicNames[hit],
                badgeColor: topicColors[parent[hit]].main,
                url: urls[hit],
              });
            }
          } else {
            setTooltip(null);
          }
        } else if (hit >= 0) {
          // Обновляем позицию тултипа при перемещении
          const sc = toScreen(x[hit], y[hit]);
          setTooltip((prev) =>
            prev ? { ...prev, x: sc.x, y: sc.y - (radius[hit] || RES_R) * zoom - 14 } : null,
          );
        }
      }

      lastX = e.clientX;
      lastY = e.clientY;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!moved && dragging >= 0) {
        // Клик без перетаскивания
        if (kind[dragging] === RES && urls[dragging]) {
          window.open(urls[dragging], "_blank", "noopener,noreferrer");
        } else if (kind[dragging] === TOPIC || kind[dragging] === VAULT) {
          // Фокусировка на кликнутом узле
          targetPanX = -x[dragging] * targetZoom;
          targetPanY = -y[dragging] * targetZoom;
        }
      }

      dragging = -1;
      panning = false;
      canvas.style.cursor = hover >= 0 ? "pointer" : "grab";
      if (canvas.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const p = getPos(e);
      const worldBefore = toWorld(p.x, p.y);

      // Плавный фактор зума
      const factor = Math.exp(-e.deltaY * 0.0018);
      const newZoom = Math.min(4.5, Math.max(0.12, targetZoom * factor));

      // Центрируем зум вокруг курсора
      targetPanX = p.x - w / 2 - worldBefore.x * newZoom;
      targetPanY = p.y - h / 2 - worldBefore.y * newZoom;
      targetZoom = newZoom;
    };

    const onDoubleClick = () => {
      fit(true);
    };

    const onLeave = () => {
      if (dragging < 0) {
        hover = -1;
        setTooltip(null);
      }
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("dblclick", onDoubleClick);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("dblclick", onDoubleClick);
    };
  }, [graph]);

  const controlBtnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: "var(--radius-md)",
    color: "var(--text-secondary)",
    cursor: "pointer",
    transition: "all 0.15s ease",
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-8)",
      }}
    >
      {/* Заголовок страницы */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "28px",
              fontWeight: 600,
              margin: "0 0 var(--space-2) 0",
              color: "var(--text-primary)",
            }}
          >
            {t.graph.title}
          </h2>
          <p style={{ color: "var(--text-muted)", margin: 0 }}>
            {t.graph.subtitle}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Badge variant="accent">
            <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Network size={14} /> {(graph?.n ?? 0).toLocaleString()}{" "}
              {t.graph.nodes}
            </span>
          </Badge>
        </div>
      </div>

      {/* Основной холст графа */}
      <Card
        style={{
          padding: 0,
          height: "calc(100vh - 220px)",
          minHeight: "520px",
          position: "relative",
          overflow: "hidden",
          border: "1px solid var(--border)",
          backgroundColor: "#0d0f14",
        }}
      >
        <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
          <canvas
            ref={canvasRef}
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              touchAction: "none",
            }}
          />
        </div>

        {/* Кнопки управления камерой */}
        <div
          style={{
            position: "absolute",
            top: "var(--space-4)",
            right: "var(--space-4)",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => cameraRef.current.zoomBy(1.25)}
            style={controlBtnStyle}
            title="Приблизить (+)"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-raised)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => cameraRef.current.zoomBy(0.8)}
            style={controlBtnStyle}
            title="Отдалить (−)"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-raised)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Minus size={16} />
          </button>
          <button
            onClick={() => cameraRef.current.fit()}
            style={controlBtnStyle}
            title="Центрировать весь граф"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface-raised)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--surface)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Интерактивный тултип при наведении */}
        {tooltip && (
          <div
            style={{
              position: "absolute",
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              backgroundColor: "rgba(24, 24, 27, 0.95)",
              backdropFilter: "blur(8px)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              padding: "8px 12px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
              pointerEvents: "none",
              zIndex: 20,
              maxWidth: "280px",
              display: "flex",
              flexDirection: "column",
              gap: "4px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {tooltip.title}
              </span>
              {tooltip.category && (
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: tooltip.badgeColor
                      ? `${tooltip.badgeColor}22`
                      : "var(--surface-raised)",
                    color: tooltip.badgeColor || "var(--text-secondary)",
                  }}
                >
                  {tooltip.category}
                </span>
              )}
            </div>

            {tooltip.subtitle && (
              <span
                style={{
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                {tooltip.url && <ExternalLink size={11} />}
                {tooltip.subtitle}
              </span>
            )}
          </div>
        )}

        {/* Легенда снизу */}
        <div
          style={{
            position: "absolute",
            bottom: "var(--space-4)",
            left: "var(--space-4)",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-4)",
            backgroundColor: "rgba(24, 24, 27, 0.85)",
            backdropFilter: "blur(6px)",
            padding: "8px 14px",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "var(--accent)",
                boxShadow: "0 0 8px var(--accent)",
              }}
            />
            {t.graph.vault}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                border: "2px solid #a855f7",
              }}
            />
            {t.graph.topics}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "12px",
              color: "var(--text-secondary)",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: "#38bdf8",
              }}
            />
            {t.graph.resources}
          </div>
        </div>
      </Card>
    </div>
  );
}
