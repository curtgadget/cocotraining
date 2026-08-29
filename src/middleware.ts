import { defineMiddleware } from 'astro:middleware';
import { timingSafeEqual } from 'node:crypto';

const USER = process.env.BASIC_AUTH_USER ?? import.meta.env.BASIC_AUTH_USER;
const PASS = process.env.BASIC_AUTH_PASSWORD ?? import.meta.env.BASIC_AUTH_PASSWORD;

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export const onRequest = defineMiddleware((context, next) => {
  if (!USER || !PASS) {
    return new Response(
      'Server misconfigured: BASIC_AUTH_USER and BASIC_AUTH_PASSWORD must be set.',
      { status: 500 },
    );
  }

  const header = context.request.headers.get('authorization') ?? '';
  if (header.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf-8');
    const separator = decoded.indexOf(':');
    if (separator > -1) {
      const user = decoded.slice(0, separator);
      const pass = decoded.slice(separator + 1);
      if (safeEqual(user, USER) && safeEqual(pass, PASS)) {
        return next();
      }
    }
  }

  return new Response('Authentication required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="SCLARC Course", charset="UTF-8"' },
  });
});
