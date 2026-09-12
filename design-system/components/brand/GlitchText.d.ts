import React from 'react';

export interface GlitchTextProps extends React.HTMLAttributes<HTMLElement> {
  /** Tag to render. Default "span". */
  as?: any;
  /** Font family. Default "display" (Iceland). */
  font?: 'display' | 'glitch' | 'serif';
  /** Keep the glitch running (default: only on hover). */
  always?: boolean;
  children?: React.ReactNode;
}

export function GlitchText(props: GlitchTextProps): JSX.Element;
