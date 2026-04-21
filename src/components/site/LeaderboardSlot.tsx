import { RotatingAd } from './RotatingAd'

export function LeaderboardSlot() {
  return (
    <div style={{
      background: '#f5f7fa',
      borderBottom: '1px solid #e2e8f0',
      padding: '8px 0',
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 32px',
      }}>
        <RotatingAd slotId="leaderboard" height={258} />
      </div>
    </div>
  )
}
