import { ImageResponse } from 'next/og'

export const alt = 'ApplyFlow — Candidate Command Center'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#08090a',
          padding: 80,
          fontFamily: 'sans-serif',
          color: '#ffffff',
          backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.06) 0%, transparent 70%)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 10,
              backgroundColor: '#ffffff',
              color: '#08090a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              fontWeight: 800,
              fontFamily: 'monospace',
            }}
          >
            AF
          </div>
          <span style={{ fontSize: 26, fontWeight: 700, letterSpacing: -0.5 }}>
            ApplyFlow
          </span>
          <span
            style={{
              marginLeft: 12,
              padding: '4px 12px',
              borderRadius: 9999,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontSize: 13,
              color: 'rgba(255, 255, 255, 0.6)',
              fontFamily: 'monospace',
            }}
          >
            Candidate-First Command Center
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 54,
              fontWeight: 800,
              letterSpacing: -1.5,
              lineHeight: 1.1,
              maxWidth: 960,
            }}
          >
            The calm, high-density candidate command center.
          </div>
          <div
            style={{
              fontSize: 22,
              color: 'rgba(255, 255, 255, 0.6)',
              maxWidth: 860,
              lineHeight: 1.4,
            }}
          >
            Spreadsheets decay by week three. ApplyFlow gives engineers keyboard speed, actionable urgency triage, and exact resume-to-role traceability.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 32,
            fontSize: 15,
            color: 'rgba(255, 255, 255, 0.5)',
            fontFamily: 'monospace',
          }}
        >
          <span>&bull; 100% Free & Open</span>
          <span>&bull; Zero Recruiter Surveillance</span>
          <span>&bull; 1-Click Raw Data Export</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
