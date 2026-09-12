import React from 'react';

/** Small status/label chip. Mono, uppercase, hairline border. */
export function Badge({ tone = 'green', live = false, children, ...rest }) {
  const tones = {
    green: { color: 'var(--green-200)', border: 'var(--line-green)', dot: 'var(--green-300)' },
    gold: { color: 'var(--gold-300)', border: 'var(--line-gold)', dot: 'var(--gold-400)' },
    neutral: { color: 'var(--text-mid)', border: 'var(--line-mid)', dot: 'var(--text-low)' },
    error: { color: '#ffb0a8', border: 'color-mix(in oklab, var(--status-error) 45%, transparent)', dot: 'var(--status-error)' },
  };
  const t = tones[tone];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        padding: '4px 10px',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        color: t.color,
        border: `1px solid ${t.border}`,
        borderRadius: 'var(--radius-pill)',
        background: 'color-mix(in oklab, var(--surface-2) 60%, transparent)',
      }}
      {...rest}
    >
      {live && (
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: t.dot,
            boxShadow: `0 0 8px ${t.dot}`,
            animation: 'hmc-flicker 2.4s var(--ease-out) infinite',
          }}
        />
      )}
      {children}
    </span>
  );
}
