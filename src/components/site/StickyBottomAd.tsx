'use client'
import { useState } from 'react'
import { RotatingAd } from './RotatingAd'
import { X } from 'lucide-react'

export function StickyBottomAd() {
  const [closed, setClosed] = useState(false)
  if (closed) return null

  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 90,
      background: 'white', borderTop: '1px solid #e2e8f0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.10)',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: '10px 32px', display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ flex: 1 }}>
          <RotatingAd slotId="sticky" height={90} />
        </div>
        <button
          onClick={() => setClosed(true)}
          style={{
            background: 'none', border: '1.5px solid #e2e8f0',
            borderRadius: '50%', width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          <X size={12} color="#888" />
        </button>
      </div>
    </div>
  )
}
