import React from 'react';

export interface ThemeSwitcherProps {
  /** Current theme. Default "phosphor". */
  value?: 'phosphor' | 'ultraviolet' | 'verdant';
  onChange?: (theme: 'phosphor' | 'ultraviolet' | 'verdant') => void;
  /** Dot diameter in px. Default 15. */
  size?: number;
}

export function ThemeSwitcher(props: ThemeSwitcherProps): JSX.Element;
