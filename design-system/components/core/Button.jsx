import React from 'react';

/**
 * Humunculus primary action. Sharp geometry, phosphor glow on the
 * primary variant, uppercase mono label option for the "instrument" feel.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  mono = false,
  glow = true,
  disabled = false,
  as = 'button',
  children,
  ...rest
}) {
  const pad = {
    sm: '8px 14px',
    md: '12px 22px',
    lg: '16px 30px',
  }[size];
  const fs = { sm: 13, md: 15, lg: 17 }[size];

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: pad,
    fontSize: fs,
    fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
    fontWeight: 500,
    letterSpacing: mono ? '0.14em' : '0.01em',
    textTransform: mono ? 'uppercase' : 'none',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'all var(--dur) var(--ease-out)',
    lineHeight: 1,
    textDecoration: 'none',
  };

  const variants = {
    primary: {
      background: 'var(--green-300)',
      color: 'var(--text-on-accent)',
      boxShadow: glow ? 'var(--glow-green)' : 'none',
    },
    signal: {
      background: 'var(--gold-400)',
      color: '#2a1c00',
      boxShadow: glow ? 'var(--glow-gold)' : 'none',
    },
    outline: {
      background: 'transparent',
      color: 'var(--green-200)',
      borderColor: 'var(--line-green)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-mid)',
    },
  };

  const Comp = as;
  return (
    <Comp
      style={{ ...base, ...variants[variant] }}
      disabled={as === 'button' ? disabled : undefined}
      {...rest}
    >
      {children}
    </Comp>
  );
}
