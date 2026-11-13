export const CREATOR_EMAIL = process.env.CREATOR_EMAIL || 'zerkalovandrey@kavoult.dev';

export function normalizeEmail(email?: string | null): string {
  return (email || '').trim().toLowerCase();
}

export function isCreatorEmail(email?: string | null): boolean {
  return normalizeEmail(email) === normalizeEmail(process.env.CREATOR_EMAIL || CREATOR_EMAIL);
}
