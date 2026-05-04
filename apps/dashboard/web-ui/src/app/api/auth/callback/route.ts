import { NextRequest, NextResponse } from 'next/server';
import { encodeSession, sessionCookieOptions } from '@/lib/session';
import type { SessionUser } from '@/lib/session';

interface DiscordTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
}

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
  const code = req.nextUrl.searchParams.get('code');
  const error = req.nextUrl.searchParams.get('error');

  // User denied access
  if (error || !code) {
    return NextResponse.redirect(appUrl('/?error=access_denied'));
  }

  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const redirectUri = process.env.DISCORD_REDIRECT_URI;

  if (!clientId || !clientSecret || !redirectUri) {
    return NextResponse.redirect(appUrl('/?error=server_misconfiguration'));
  }

  // Exchange authorization code for access token
  const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!tokenRes.ok) {
    console.error('[auth/callback] token exchange failed:', await tokenRes.text());
    return NextResponse.redirect(appUrl('/?error=token_exchange_failed'));
  }

  const tokenData = (await tokenRes.json()) as DiscordTokenResponse;

  // Fetch Discord user info
  const userRes = await fetch('https://discord.com/api/users/@me', {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  if (!userRes.ok) {
    return NextResponse.redirect(appUrl('/?error=user_fetch_failed'));
  }

  const discordUser = (await userRes.json()) as SessionUser;

  const sessionValue = encodeSession({
    id: discordUser.id,
    username: discordUser.username,
    discriminator: discordUser.discriminator,
    avatar: discordUser.avatar,
    global_name: discordUser.global_name,
    accessToken: tokenData.access_token,
  });

  const res = NextResponse.redirect(appUrl('/'));
  res.cookies.set(sessionCookieOptions(sessionValue));
  return res;
}
