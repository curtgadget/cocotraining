import type { APIRoute } from 'astro';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CoCo Training</title>
<style>
:root{color-scheme:light; --plum:#5B2A4E; --teal:#3E6E76; --ink:#232323; --muted:#6b6b6b; --line:#e3dbe1;}
*{box-sizing:border-box}
body{margin:0;background:#faf8fa;color:var(--ink);font:16px/1.6 -apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;
display:flex;min-height:100vh;align-items:center;justify-content:center;padding:24px;}
main{max-width:560px;width:100%}
h1{color:var(--plum);font-size:1.6rem;margin:0 0 4px}
p.sub{color:var(--muted);margin:0 0 28px}
a.card{display:block;border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin-bottom:16px;
text-decoration:none;color:inherit;background:#fff;transition:border-color .15s,box-shadow .15s;}
a.card:hover{border-color:var(--teal);box-shadow:0 2px 8px rgba(62,110,118,.12)}
a.card h2{margin:0 0 4px;font-size:1.1rem;color:var(--teal)}
a.card span{color:var(--muted);font-size:.92rem}
</style>
</head>
<body>
<main>
<h1>CoCo Training</h1>
<p class="sub">Select a course to begin.</p>
<a class="card" href="/psych-writing">
  <h2>Psychological Report Writing</h2>
  <span>SCLARC report writing training course</span>
</a>
<a class="card" href="/onboarding">
  <h2>Doctoral Practicum Onboarding</h2>
  <span>Consulting Collective onboarding course</span>
</a>
</main>
</body>
</html>
`;

export const GET: APIRoute = () =>
  new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
