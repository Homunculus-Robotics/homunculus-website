import React from 'react';

/**
 * Surface card with optional blueprint grid and corner ticks.
 * The default container for Humunculus content blocks.
 */
export function Card({ grid = false, glow = false, corners = true, padding = 'var(--sp-6)', children, style, ...rest }) {
  return (
    <div
      style={{
        position: 'relative',
        background: grid ? 'var(--blueprint-grid), var(--surface-1)' : 'var(--surface-1)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding,
        boxShadow: glow ? 'var(--glow-green)' : 'var(--shadow-1)',
        ...style,
      }}
      {...rest}
    >
      {corners && ['tl', 'tr', 'bl', 'br'].map((c) => (
        <span key={c} style={cornerStyle(c)} />
      ))}
      {children}
    </div>
  );
}

function cornerStyle(c) {
  const s = {
    position: 'absolute', width: 8, height: 8,
    borderColor: 'var(--line-green)', borderStyle: 'solid', borderWidth: 0,
  };
  const off = 8;
  if (c[0] === 't') { s.top = off; s.borderTopWidth = 1; } else { s.bottom = off; s.borderBottomWidth = 1; }
  if (c[1] === 'l') { s.left = off; s.borderLeftWidth = 1; } else { s.right = off; s.borderRightWidth = 1; }
  return s;
}
