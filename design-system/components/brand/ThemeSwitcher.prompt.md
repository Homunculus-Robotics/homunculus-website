Three-dot picker for the site's Phosphor / Ultraviolet / Verdant themes. Stateless — wire `value` to `data-hmc-theme` on the page wrapper and persist the choice yourself (the site uses `localStorage.hmc-theme`).

```jsx
const [theme, setTheme] = React.useState('phosphor');
<div data-hmc-theme={theme}>
  <ThemeSwitcher value={theme} onChange={setTheme} />
</div>
```

See `tokens/themes.css` for what each theme remaps (accent, signal, void, glows). Lives in the nav on every page — always paired with the EN/DE language toggle.
