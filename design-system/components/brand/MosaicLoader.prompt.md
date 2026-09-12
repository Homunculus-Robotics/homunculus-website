Triangle mosaic that covers a hero section then dissolves tile-by-tile on mount, revealing the content underneath. Absolutely positioned — drop it inside a `position: relative` hero as the last element before the real content.

```jsx
<section style={{ position: 'relative', overflow: 'hidden' }}>
  <MosaicLoader />
  {/* hero content */}
</section>
```

Runs once per mount (no replay control) — each tile gets a randomized delay so the reveal never looks mechanical. Uses the shared `hmc-tile-out` keyframe from `tokens/effects.css`. `color` should match the section background it's covering; a square-tile variant (plain CSS grid, no component needed) exists as a lower-drama fallback — see Home.dc.html's `mosaicShape` tweak.
