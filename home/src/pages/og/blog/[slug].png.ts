import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'fs';
import { join } from 'path';

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
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 3);
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props;
  const { title, tags, description } = post.data;

  const fontRegular = readFileSync(join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff'));
  const fontSemiBold = readFileSync(join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-600-normal.woff'));
  const fontBold = readFileSync(join(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-800-normal.woff'));

  const titleLines = wrapText(title, 38);
  const displayedTags = tags.slice(0, 4);

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0',
          background: '#09090b',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Top accent line
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '1200px',
                height: '3px',
                background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)',
              },
            },
          },
          // Glow top-right
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '-120px',
                right: '-120px',
                width: '500px',
                height: '500px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%)',
              },
            },
          },
          // Glow bottom-left
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                bottom: '-100px',
                left: '-80px',
                width: '400px',
                height: '400px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)',
              },
            },
          },
          // Left accent bar
          {
            type: 'div',
            props: {
              style: {
                position: 'absolute',
                top: '100px',
                left: '0',
                width: '4px',
                height: '220px',
                background: 'linear-gradient(180deg, #6366f1, transparent)',
                borderRadius: '0 2px 2px 0',
              },
            },
          },
          // Main content
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                flex: 1,
                padding: '60px 72px 40px 72px',
                gap: '0px',
              },
              children: [
                // Brand row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '36px',
                    },
                    children: [
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'Inter',
                            fontWeight: 700,
                            fontSize: '24px',
                            color: '#6366f1',
                            letterSpacing: '2px',
                          },
                          children: 'draftNG',
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            width: '1px',
                            height: '20px',
                            background: '#3f3f46',
                          },
                        },
                      },
                      {
                        type: 'div',
                        props: {
                          style: {
                            fontFamily: 'Inter',
                            fontWeight: 400,
                            fontSize: '20px',
                            color: '#52525b',
                          },
                          children: 'Angular Development Blog',
                        },
                      },
                    ],
                  },
                },
                // Title lines
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      marginBottom: '40px',
                    },
                    children: titleLines.map((line, i) => ({
                      type: 'div',
                      props: {
                        style: {
                          fontFamily: 'Inter',
                          fontWeight: 800,
                          fontSize: '58px',
                          lineHeight: '1.15',
                          color: i === 0 ? '#fafaf9' : i === 1 ? '#e4e4e7' : '#a1a1aa',
                          letterSpacing: '-0.02em',
                        },
                        children: line,
                      },
                    })),
                  },
                },
                // Tags row
                {
                  type: 'div',
                  props: {
                    style: {
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '12px',
                      flexWrap: 'wrap',
                    },
                    children: displayedTags.map((tag: string) => ({
                      type: 'div',
                      props: {
                        style: {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '8px 20px',
                          borderRadius: '8px',
                          background: '#18181b',
                          border: '1px solid #3f3f46',
                          fontFamily: 'Inter',
                          fontWeight: 600,
                          fontSize: '20px',
                          color: '#a1a1aa',
                        },
                        children: tag,
                      },
                    })),
                  },
                },
              ],
            },
          },
          // Bottom bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 72px',
                borderTop: '1px solid #1f1f23',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Inter',
                      fontWeight: 500,
                      fontSize: '20px',
                      color: '#3f3f46',
                    },
                    children: 'draftng.xyz',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      fontFamily: 'Inter',
                      fontWeight: 400,
                      fontSize: '20px',
                      color: '#3f3f46',
                    },
                    children: 'Read the full article →',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
        { name: 'Inter', data: fontSemiBold, weight: 600, style: 'normal' },
        { name: 'Inter', data: fontBold, weight: 800, style: 'normal' },
      ],
    }
  );

  const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } });
  const png = resvg.render().asPng();

  return new Response(png.buffer as ArrayBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
