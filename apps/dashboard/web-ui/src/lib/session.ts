import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  global_name: string | null;
  accessToken?: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const COOKIE_NAME = 'exora_session';
const SECRET = process.env.SESSION_SECRET ?? 'change-me-in-production-min-32-chars!!';

// ─── Signing ──────────────────────────────────────────────────────────────────

function sign(payload: string): string {
  return createHmac('sha256', SECRET).update(payload).digest('base64url');
}

function verifySignature(payload: string, providedSig: string): boolean {
  const expected = sign(payload);
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(providedSig));
  } catch {
    return false;
  }
}

// ─── Encode / Decode ──────────────────────────────────────────────────────────

export function encodeSession(user: SessionUser): string {
  const payload = Buffer.from(JSON.stringify(user)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function decodeSession(value: string): SessionUser | null {
  const dotIndex = value.lastIndexOf('.');
  if (dotIndex < 0) return null;
  const payload = value.slice(0, dotIndex);
  const sig = value.slice(dotIndex + 1);
  if (!verifySignature(payload, sig)) return null;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()) as SessionUser;
  } catch {
    return null;
  }
}

// ─── Cookie helpers ───────────────────────────────────────────────────────────

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  if (!raw) return null;
  return decodeSession(raw);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;

export function sessionCookieOptions(value: string) {
  return {
    name: COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  };
}
