import React from 'react';

/** Text field with mono label + phosphor focus. */
export function Input({ label, hint, mono = true, style, id, ...rest }) {
  const inputId = id || `hmc-${Math.random().toString(36).slice(2, 8)}`;
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <label htmlFor={inputId} style={{
          fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.16em',
          textTransform: 'uppercase', color: focus ? 'var(--green-300)' : 'var(--text-low)',
          transition: 'color var(--dur) var(--ease-out)',
        }}>{label}</label>
      )}
      <input
        id={inputId}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        style={{
          width: '100%',
          padding: '12px 14px',
          background: 'var(--surface-0)',
          color: 'var(--text-hi)',
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
          fontSize: 15,
          border: `1px solid ${focus ? 'var(--green-300)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          outline: 'none',
          boxShadow: focus ? 'var(--glow-green)' : 'none',
          transition: 'all var(--dur) var(--ease-out)',
          ...style,
        }}
        {...rest}
      />
      {hint && <span style={{ fontSize: 12, color: 'var(--text-low)', fontFamily: 'var(--font-body)' }}>{hint}</span>}
    </div>
  );
}
