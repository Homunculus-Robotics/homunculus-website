// Equilateral mosaic: rows of 60° triangles alternating point-up / point-down,
// side s, row height s·√3/2. Each row is offset half a side so the tiling
// interlocks. Delays mirror about the vertical centre line, so the dissolve
// opens outward from the middle.
const UP = 'polygon(50% -2%,102% 102%,-2% 102%)';
const DOWN = 'polygon(-2% -2%,102% -2%,50% 102%)';

// Sized to overshoot a wide viewport; cols is in half-steps.
const SIDE = 104;
const ROWS = 10;
const COLS = 46;
const COLOR = 'var(--void)';
const ROW_H = SIDE * Math.sqrt(3) / 2;

export function buildMosaic(host: HTMLElement): void {
  const rd = () => (Math.random() * 0.85 + 0.05).toFixed(2) + 's';
  const delays: Record<string, string> = {};
  const frag = document.createDocumentFragment();

  for (let row = 0; row < ROWS; row++) {
    for (let i = 0; i < COLS; i++) {
      const mirrored = i < COLS / 2 ? i : COLS - 1 - i;
      const key = `${row}:${mirrored}`;
      delays[key] ??= rd();
      const tile = document.createElement('span');
      tile.style.cssText =
        `position:absolute;left:50%;top:0;` +
        `margin-left:${((i - COLS / 2) * SIDE / 2).toFixed(1)}px;` +
        `transform:translateY(${(row * ROW_H).toFixed(1)}px);` +
        `width:${SIDE}px;height:${ROW_H.toFixed(1)}px;background:${COLOR};` +
        `clip-path:${(i + row) % 2 === 0 ? UP : DOWN};` +
        `animation:hmc-tile-out .5s var(--ease-out) forwards;animation-delay:${delays[key]}`;
      frag.appendChild(tile);
    }
  }
  host.appendChild(frag);
  // The tiles are absolutely positioned and only ever fade out; once the last
  // one is done they are inert DOM. Drop them.
  setTimeout(() => host.replaceChildren(), 1600);
}

class MosaicLoader extends HTMLElement {
  connectedCallback() {
    // Reduced motion means no dissolve at all — the page is already underneath,
    // so doing nothing is the correct end state, not a degraded one.
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    buildMosaic(this);
  }
}

customElements.define('hmc-mosaic-loader', MosaicLoader);
