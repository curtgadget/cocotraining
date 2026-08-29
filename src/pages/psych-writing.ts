import type { APIRoute } from 'astro';
import html from '../content/SCLARC_Report_Writing_Course.html?raw';

export const GET: APIRoute = () =>
  new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
