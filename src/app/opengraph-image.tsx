import { ImageResponse } from 'next/og'
import { SITE_DOMAIN } from '@/lib/site-config'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: '#09090b',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 4, background: '#dc2626', borderRadius: 2 }} />
          <span style={{ color: '#71717a', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Cybersecurity Delivery & Engineering Platform
          </span>
        </div>

        {/* Center */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            Mitigence
          </div>
          <div
            style={{
              fontSize: 24,
              color: '#a1a1aa',
              maxWidth: 680,
              lineHeight: 1.5,
            }}
          >
            Helping organizations understand, engineer, and operate resilient security programs through expert-led engagements.
          </div>
        </div>

        {/* Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            {['Assess', 'Engineer', 'Validate', 'Operate', 'Evolve'].map((p) => (
              <div
                key={p}
                style={{
                  background: '#18181b',
                  border: '1px solid #27272a',
                  borderRadius: 6,
                  padding: '6px 14px',
                  color: '#dc2626',
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {p}
              </div>
            ))}
          </div>
          <div style={{ color: '#3f3f46', fontSize: 14 }}>{SITE_DOMAIN}</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
