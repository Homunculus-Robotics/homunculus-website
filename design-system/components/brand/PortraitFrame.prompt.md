Frame for founder / person photography. Corner ticks + a name/role caption baked into a bottom gradient, used on About.

```jsx
<PortraitFrame src="assets/founder-marcus-roeper.jpg" name="Marcus Röper" role="Founder" treatment="twin" />
```

Treatments:
- `plain` — natural color, hairline border, corner ticks only.
- `twin` — a "real vs. sim" split: the right side desaturates into a wireframe-grid double, "real"/"sim" labels top corners. On About this static split is animated (the divider sweeps left/right) via the page-local `hmc-twin-clip` / `hmc-twin-line` keyframes — copy those over if you need the motion.
- `sim-viewport` — adds a thin app-chrome bar above the photo (`viewport / name.usd`, a play glyph), from the Portrait Options exploration. Reads as a simulation window rather than a photo.

Never use more than one treatment per page — pick the one that matches the section's story (bio vs. sim-to-real narrative).
