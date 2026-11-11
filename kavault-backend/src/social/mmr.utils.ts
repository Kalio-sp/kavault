export interface TaskRankTier {
  key: 'novice' | 'learner' | 'scholar' | 'master' | 'grandmaster' | 'legend';
  title: string;
  emoji: string;
  color: string;
  minMmr: number;
  nextMinMmr: number | null;
  progressPercent: number;
}

export const TASK_RANK_TIERS: Array<{
  key: TaskRankTier['key'];
  title: string;
  emoji: string;
  color: string;
  minMmr: number;
}> = [
  { key: 'novice', title: 'Novice', emoji: '🌱', color: '#94a3b8', minMmr: 0 },
  { key: 'learner', title: 'Learner', emoji: '📘', color: '#3b82f6', minMmr: 150 },
  { key: 'scholar', title: 'Scholar', emoji: '⚡', color: '#10b981', minMmr: 400 },
  { key: 'master', title: 'Master', emoji: '💎', color: '#8b5cf6', minMmr: 800 },
  { key: 'grandmaster', title: 'Grandmaster', emoji: '🔥', color: '#f97316', minMmr: 1500 },
  { key: 'legend', title: 'Task Legend', emoji: '👑', color: '#f59e0b', minMmr: 3000 },
];

export function getTaskRankTier(rawMmr: number): TaskRankTier {
  const mmr = Math.max(0, Math.floor(rawMmr || 0));
  let idx = 0;
  for (let i = TASK_RANK_TIERS.length - 1; i >= 0; i -= 1) {
    if (mmr >= TASK_RANK_TIERS[i].minMmr) {
      idx = i;
      break;
    }
  }
  const current = TASK_RANK_TIERS[idx];
  const next = TASK_RANK_TIERS[idx + 1] || null;
  const span = next ? next.minMmr - current.minMmr : 1;
  const progressPercent = next
    ? Math.min(100, Math.max(0, Math.round(((mmr - current.minMmr) / span) * 100)))
    : 100;

  return {
    key: current.key,
    title: current.title,
    emoji: current.emoji,
    color: current.color,
    minMmr: current.minMmr,
    nextMinMmr: next ? next.minMmr : null,
    progressPercent,
  };
}

export function sanitizeNickname(raw: string): string {
  return (raw || '')
    .trim()
    .replace(/[^a-zA-Z0-9а-яА-ЯёЁ\u3040-\u30ff\u4e00-\u9faf._-]/g, '')
    .slice(0, 24);
}
