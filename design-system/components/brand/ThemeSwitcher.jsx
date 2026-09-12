import React from 'react';

const THEMES = [
  { id: 'phosphor', grad: 'linear-gradient(135deg,var(--green-300) 0 50%,var(--violet-400) 50% 100%)' },
  { id: 'ultraviolet', grad: 'linear-gradient(135deg,var(--violet-300) 0 50%,var(--chroma-magenta) 50% 100%)' },
  { id: 'verdant', grad: 'linear-gradient(135deg,var(--green-200) 0 50%,var(--green-700) 50% 100%)' },
];

/**
 * Three-dot picker for the site's color themes (Phosphor / Ultraviolet / Verdant).
 * Stateless — the caller owns the value and applies data-hmc-theme + persistence.
 */
export function ThemeSwitcher({ value = 'phosphor', onChange, size = 15 }) {
  return (
    <div style={{ display: 'flex', gap: 5 }}>
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange && onChange(t.id)}
          aria-label={t.id[0].toUpperCase() + t.id.slice(1) + ' theme'}
          aria-pressed={value === t.id}
          style={{
            width: size, height: size, padding: 0, borderRadius: '50%', cursor: 'pointer',
            border: value === t.id ? '1px solid var(--paper)' : '1px solid var(--line-mid)',
            background: t.grad,
          }}
        />
      ))}
    </div>
  );
}
