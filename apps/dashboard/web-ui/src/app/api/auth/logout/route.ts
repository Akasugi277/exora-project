import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME } from '@/lib/session';

function appUrl(path: string): URL {
  const fallback = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  const redirect = process.env.DISCORD_REDIRECT_URI;
  if (redirect) {
    try {
      return new URL(path, new URL(redirect).origin);
    } catch {
      // Fall through to fallback.
    }
  }
  return new URL(path, fallback);
}

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(appUrl('/'));
  res.cookies.delete(SESSION_COOKIE_NAME);
  return res;
}
