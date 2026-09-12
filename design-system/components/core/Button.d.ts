import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. Default "primary". */
  variant?: 'primary' | 'signal' | 'outline' | 'ghost';
  /** Size preset. Default "md". */
  size?: 'sm' | 'md' | 'lg';
  /** Render the label in uppercase mono ("instrument readout" style). */
  mono?: boolean;
  /** Phosphor glow on primary/signal. Default true. */
  glow?: boolean;
  disabled?: boolean;
  /** Element/tag to render as (e.g. "a"). Default "button". */
  as?: any;
  children?: React.ReactNode;
}

/**
 * @startingPoint section="Actions" subtitle="Primary / signal / outline / ghost buttons" viewport="700x160"
 */
export function Button(props: ButtonProps): JSX.Element;
