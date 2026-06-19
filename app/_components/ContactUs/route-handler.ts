import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const DEFAULT_RATE_LIMIT = { maxRequests: 3, windowMs: 15 * 60 * 1000 };

// Simple in-memory rate limiter (resets on deploy, not shared across instances)
const store = new Map<string, { count: number; resetAt: number }>();

function checkRate(key: string, config: typeof DEFAULT_RATE_LIMIT) {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return true;
  }
  if (entry.count >= config.maxRequests) return false;
  entry.count++;
  return true;
}

const BOTTLED_API = 'https://bottled.email/api/v1/send';

async function sendViaBottled(params: {
  from: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
  apiKey: string;
}) {
  const res = await fetch(BOTTLED_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${params.apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      replyTo: params.replyTo,
      subject: params.subject,
      text: params.text,
    }),
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Email API error ${res.status}: ${errorText}`);
  }
}

export interface ContactRouteConfig {
  /**
   * Custom send function. If omitted, uses Bottled Email via env vars:
   * - BOTTLED_EMAIL_API_KEY (required)
   * - CONTACT_FROM_EMAIL (required -- sender and recipient address)
   */
  sendEmail?: (params: {
    from: string;
    to: string;
    replyTo: string;
    subject: string;
    text: string;
  }) => Promise<void>;
  /** Rate limit config (default: 3 per 15 min) */
  rateLimit?: { maxRequests: number; windowMs: number };
}

/**
 * Creates a POST handler for the contact form API route.
 *
 * Minimal setup (uses env vars BOTTLED_EMAIL_API_KEY + CONTACT_FROM_EMAIL):
 * ```ts
 * import { createContactHandler } from '@/app/_components/ContactUs';
 * export const POST = createContactHandler();
 * ```
 *
 * Custom email provider:
 * ```ts
 * export const POST = createContactHandler({
 *   sendEmail: async ({ from, to, replyTo, subject, text }) => {
 *     await yourEmailService.send({ from, to, replyTo, subject, text });
 *   },
 * });
 * ```
 */
export function createContactHandler(config: ContactRouteConfig = {}) {
  const rateLimit = config.rateLimit ?? DEFAULT_RATE_LIMIT;

  return async function POST(req: Request) {
    const hdrs = await headers();
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (!checkRate(`contact:${ip}`, rateLimit)) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 });
    }

    let body: { name?: string; email?: string; message?: string; _hp?: string; _t?: number };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Honeypot: bots fill hidden fields humans can't see
    if (body._hp) {
      return NextResponse.json({ success: true });
    }

    // Timing: reject submissions faster than 2s (bot speed)
    if (body._t && Date.now() - body._t < 2000) {
      return NextResponse.json({ success: true });
    }

    const name = body.name?.trim();
    const email = body.email?.trim();
    const message = body.message?.trim();

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email, and message are required' }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message too long' }, { status: 400 });
    }

    const subject = `Contact form: ${name}`;
    const text = `From: ${name} <${email}>\n\n${message}`;

    try {
      if (config.sendEmail) {
        await config.sendEmail({ from: '', to: '', replyTo: email, subject, text });
      } else {
        const apiKey = process.env.BOTTLED_EMAIL_API_KEY;
        const fromEmail = process.env.CONTACT_FROM_EMAIL;
        if (!apiKey || !fromEmail) {
          console.log('[contact-form] No email config, logging only:', { name, email });
          return NextResponse.json({ success: true });
        }
        await sendViaBottled({
          from: fromEmail,
          to: fromEmail,
          replyTo: email,
          subject,
          text,
          apiKey,
        });
      }
    } catch (err) {
      console.error('[contact-form] Send failed:', err);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  };
}
