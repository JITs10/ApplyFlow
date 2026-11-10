import { ImageResponse } from 'next/og'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#121211',
          borderRadius: 40,
          border: '4px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 40 40"
          fill="none"
        >
          <path
            d="M6 31C14 31 20 26 25 21"
            stroke="#10B981"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <polygon
            points="36,9 15,20 24,21"
            fill="#10B981"
          />
          <polygon
            points="36,9 24,21 21,28"
            fill="#059669"
          />
          <line
            x1="36"
            y1="9"
            x2="24"
            y2="21"
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="0.8"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
