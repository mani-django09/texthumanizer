import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Text Humanizer – Convert AI Text to Human Writing';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
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
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              width: 84,
              height: 84,
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              fontSize: 52,
            }}
          >
            🪶
          </div>
          <div
            style={{
              fontSize: 40,
              fontWeight: 800,
              color: 'white',
              letterSpacing: -1,
            }}
          >
            Text Humanizer
          </div>
        </div>

        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: 'white',
            lineHeight: 1.1,
            letterSpacing: -2,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          Convert AI Text to{' '}
          <span
            style={{
              backgroundImage: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              backgroundClip: 'text',
              color: 'transparent',
              marginLeft: 16,
            }}
          >
            Human Writing
          </span>
        </div>

        <div
          style={{
            fontSize: 30,
            color: '#cbd5e1',
            marginTop: 30,
            fontWeight: 400,
          }}
        >
          Free · No account required · 5 rewrite styles · Instant results
        </div>
      </div>
    ),
    { ...size }
  );
}
