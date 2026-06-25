import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    if ((current + ' ' + word).trim().length <= maxChars) {
      current = (current + ' ' + word).trim();
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props;
  const title = post.data.title;
  const tags = post.data.tags.slice(0, 4);

  const titleLines = wrapText(title, 36);

  const titleY1 = 260;
  const lineHeight = 72;

  const titleSVG = titleLines
    .map((line, i) => {
      const opacity = i === 0 ? '1' : i === 1 ? '0.95' : '0.9';
      return `<text x="72" y="${titleY1 + i * lineHeight}" font-family="system-ui, -apple-system, sans-serif" font-weight="800" font-size="56" fill="white" opacity="${opacity}">${line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>`;
    })
    .join('\n    ');

  const tagsY = titleY1 + titleLines.length * lineHeight + 44;
  const tagsSVG = tags
    .map((tag: string, i: number) => {
      const x = 72 + i * 168;
      return `
    <rect x="${x}" y="${tagsY}" width="156" height="40" rx="8" fill="#27272a" opacity="0.9"/>
    <text x="${x + 78}" y="${tagsY + 26}" font-family="system-ui, -apple-system, sans-serif" font-weight="600" font-size="20" fill="#a1a1aa" text-anchor="middle">${tag.replace(/&/g, '&amp;')}</text>`;
    })
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#09090b"/>
      <stop offset="100%" style="stop-color:#111113"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0.08"/>
    </linearGradient>
    <filter id="blur-glow">
      <feGaussianBlur stdDeviation="60" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Glow orb top-right -->
  <ellipse cx="1050" cy="80" rx="340" ry="280" fill="url(#glow)" filter="url(#blur-glow)" opacity="0.6"/>

  <!-- Glow orb bottom-left -->
  <ellipse cx="150" cy="560" rx="280" ry="200" fill="#6366f1" opacity="0.04" filter="url(#blur-glow)"/>

  <!-- Top border line -->
  <rect x="0" y="0" width="1200" height="2" fill="#6366f1" opacity="0.6"/>

  <!-- Grid dots pattern (decorative) -->
  <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
    <circle cx="1" cy="1" r="1" fill="#27272a" opacity="0.6"/>
  </pattern>
  <rect x="700" y="0" width="500" height="630" fill="url(#dots)" opacity="0.4"/>

  <!-- Left accent bar -->
  <rect x="0" y="100" width="4" height="200" rx="2" fill="#6366f1" opacity="0.7"/>

  <!-- draftNG logo / brand -->
  <text x="72" y="120" font-family="system-ui, -apple-system, sans-serif" font-weight="700" font-size="26" fill="#6366f1" letter-spacing="2">draftNG</text>
  <text x="72" y="148" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="20" fill="#52525b">Angular Development Blog</text>

  <!-- Divider -->
  <rect x="72" y="174" width="80" height="2" rx="1" fill="#3f3f46"/>

  <!-- Title -->
  ${titleSVG}

  <!-- Tags -->
  ${tagsSVG}

  <!-- Bottom branding -->
  <text x="72" y="590" font-family="system-ui, -apple-system, sans-serif" font-weight="500" font-size="22" fill="#3f3f46">draftng.xyz</text>
  <text x="1128" y="590" font-family="system-ui, -apple-system, sans-serif" font-weight="400" font-size="22" fill="#3f3f46" text-anchor="end">Read the full article →</text>

  <!-- Bottom line -->
  <rect x="0" y="618" width="1200" height="1" fill="#27272a" opacity="0.8"/>
</svg>`;

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
