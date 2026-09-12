import React from 'react';

/** Instrument-style stat readout: big Iceland value + mono label. */
export function StatReadout({ value, unit, label, tone = 'green', align = 'left', ...rest }) {
  const color = tone === 'gold' ? 'var(--gold-400)' : tone === 'plain' ? 'var(--text-hi)' : 'var(--green-300)';
  return (
    <div style={{ textAlign: align }} {...rest}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--fs-h1)', lineHeight: 0.9, color }}>{value}</span>
        {unit && <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-mid)' }}>{unit}</span>}
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--text-low)', marginTop: 6,
      }}>{label}</div>
    </div>
  );
}
