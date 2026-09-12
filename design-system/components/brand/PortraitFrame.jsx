import React from 'react';

/**
 * Portrait frame for founder / person photography. `treatment` selects
 * the signature look explored across About and Portrait Options.
 */
export function PortraitFrame({ src, alt = '', name, role, treatment = 'plain', corners = true, style }) {
  return (
    <figure style={{ margin: 0, position: 'relative', ...style }}>
      <div style={{ position: 'relative', border: '1px solid var(--line-accent)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--surface-1)' }}>
        {treatment === 'sim-viewport' && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, padding: '8px 12px', borderBottom: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-low)' }}>
            <span>{'viewport / ' + (name || 'subject').toLowerCase().replace(/\s+/g, '-') + '.usd'}</span>
            <span style={{ color: 'var(--signal)' }}>&#9654; 1.0&times;</span>
          </div>
        )}
        <img src={src} alt={alt} style={{ display: 'block', width: '100%', aspectRatio: '4/5', objectFit: 'cover', filter: treatment === 'plain' ? 'saturate(.8) contrast(1.04)' : 'saturate(.78) contrast(1.06)' }} />
        {treatment === 'twin' && (
          <React.Fragment>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', clipPath: 'polygon(52% 0,100% 0,100% 100%,52% 100%)' }}>
              <img src={src} alt="" style={{ display: 'block', width: '100%', aspectRatio: '4/5', objectFit: 'cover', filter: 'grayscale(1) contrast(1.6) brightness(.8)' }} />
              <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(color-mix(in oklab,var(--signal) 26%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in oklab,var(--signal) 26%,transparent) 1px,transparent 1px)', backgroundSize: '18px 18px', mixBlendMode: 'screen' }} />
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', top: 0, bottom: 0, left: '52%', width: 1, background: 'var(--signal)', boxShadow: '0 0 12px color-mix(in oklab,var(--signal) 60%,transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', left: 14, top: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--text-low)' }}>real</div>
            <div style={{ position: 'absolute', right: 14, top: 14, fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '.16em', textTransform: 'uppercase', color: 'var(--signal)' }}>sim</div>
          </React.Fragment>
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 58%,color-mix(in oklab,var(--void) 86%,transparent) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: 14, bottom: 14, right: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 8 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-hi)' }}>{name}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--accent)' }}>{role}</span>
        </div>
      </div>
      {corners && (
        <React.Fragment>
          <span style={{ position: 'absolute', top: -1, left: -1, width: 14, height: 14, borderTop: '1px solid var(--signal)', borderLeft: '1px solid var(--signal)' }} />
          <span style={{ position: 'absolute', bottom: -1, right: -1, width: 14, height: 14, borderBottom: '1px solid var(--signal)', borderRight: '1px solid var(--signal)' }} />
        </React.Fragment>
      )}
    </figure>
  );
}
