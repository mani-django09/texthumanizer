import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

const SIZE = { width: 1200, height: 630 };

/**
 * Shared, parameterized OG image generator for every secondary page.
 * The homepage keeps its own dedicated app/opengraph-image.tsx; every other
 * page points its openGraph.images at /opengraph?title=…&badge=… so social
 * previews (WhatsApp, Twitter, Slack, Facebook) never fall back to a blank card.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get('title') || 'Text Humanizer').slice(0, 90);
  const badge = (searchParams.get('badge') || 'Free · No Account Required').slice(0, 60);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 55%, #1e293b 100%)',
          fontFamily: 'sans-serif',
          padding: '0 80px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              fontSize: 38,
            }}
          >
            🪶
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'white', letterSpacing: -1 }}>
            Text Humanizer
          </div>
        </div>

        <div
          style={{
            fontSize: 60,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.15,
            letterSpacing: -2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 26,
            color: '#a5b4fc',
            marginTop: 34,
            fontWeight: 600,
          }}
        >
          <div style={{ width: 10, height: 10, borderRadius: 99, background: '#818cf8' }} />
          {badge}
        </div>
      </div>
    ),
    SIZE
  );
}
