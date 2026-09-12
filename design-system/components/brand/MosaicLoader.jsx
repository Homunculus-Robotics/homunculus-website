import React from 'react';

const UP = 'polygon(50% -2%,102% 102%,-2% 102%)';
const DOWN = 'polygon(-2% -2%,102% -2%,50% 102%)';

function buildTriangles(side, rows, cols) {
  const rowH = side * Math.sqrt(3) / 2;
  const rd = () => (Math.random() * 0.85 + 0.05).toFixed(2) + 's';
  const delays = {};
  const out = [];
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < cols; i++) {
      const m = i < cols / 2 ? i : cols - 1 - i;
      const k = row + ':' + m;
      if (!delays[k]) delays[k] = rd();
      out.push({
        x: ((i - cols / 2) * side / 2).toFixed(1) + 'px',
        y: (row * rowH).toFixed(1) + 'px',
        w: side + 'px',
        h: rowH.toFixed(1) + 'px',
        clip: (i + row) % 2 === 0 ? UP : DOWN,
        d: delays[k],
      });
    }
  }
  return out;
}

/**
 * Equilateral-triangle mosaic that dissolves once on mount to reveal the
 * page underneath. The intro loader shared by Home, About and Design Challenge.
 */
export function MosaicLoader({ side = 104, rows = 10, cols = 46, color = 'var(--void)' }) {
  const triangles = React.useMemo(() => buildTriangles(side, rows, cols), [side, rows, cols]);
  return (
    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none', overflow: 'hidden' }}>
      {triangles.map((t, i) => (
        <span
          key={i}
          style={{
            position: 'absolute', left: '50%', top: 0, marginLeft: t.x, transform: 'translateY(' + t.y + ')',
            width: t.w, height: t.h, background: color, clipPath: t.clip,
            animation: 'hmc-tile-out .5s var(--ease-out) forwards', animationDelay: t.d,
          }}
        />
      ))}
    </div>
  );
}
