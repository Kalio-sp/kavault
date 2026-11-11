export const CREATOR_EMAIL = 'zerkalovandrey@kavoult.dev';

export function normalizeEmail(email?: string | null): string {
  return (email || '').trim().toLowerCase();
}

export function isCreatorEmail(email?: string | null): boolean {
  return normalizeEmail(email) === CREATOR_EMAIL;
}
