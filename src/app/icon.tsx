import { ImageResponse } from 'next/og'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
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
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.12)',
        }}
      >
        <svg
          width="22"
          height="22"
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
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
