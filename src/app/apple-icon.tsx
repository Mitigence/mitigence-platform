import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#09090b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 36,
        }}
      >
        <div
          style={{
            fontSize: 108,
            fontWeight: 800,
            color: '#dc2626',
            fontFamily: 'system-ui, sans-serif',
            lineHeight: 1,
          }}
        >
          M
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  )
}
