export const THEMES = ['phosphor', 'ultraviolet', 'verdant'] as const;
export type Theme = (typeof THEMES)[number];

const KEY = 'hmc-theme';
const isTheme = (v: unknown): v is Theme => THEMES.includes(v as Theme);

export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.hmcTheme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* the theme still applies for this page view, it just will not persist */
  }
}

class ThemeSwitcher extends HTMLElement {
  connectedCallback() {
    const buttons = [...this.querySelectorAll<HTMLButtonElement>('button[data-theme]')];
    const sync = (active: string) => {
      for (const b of buttons) b.setAttribute('aria-pressed', String(b.dataset.theme === active));
    };
    for (const b of buttons) {
      b.addEventListener('click', () => {
        const t = b.dataset.theme;
        if (!isTheme(t)) return;
        applyTheme(t);
        sync(t);
      });
    }
    // Base.astro's inline script already set the attribute before paint; read it
    // back rather than storage so the two can never disagree.
    sync(document.documentElement.dataset.hmcTheme ?? 'phosphor');
  }
}

customElements.define('hmc-theme-switcher', ThemeSwitcher);
