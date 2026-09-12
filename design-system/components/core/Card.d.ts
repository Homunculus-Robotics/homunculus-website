import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Overlay the blueprint grid texture. */
  grid?: boolean;
  /** Phosphor glow instead of drop shadow. */
  glow?: boolean;
  /** Show technical corner ticks. Default true. */
  corners?: boolean;
  /** Inner padding (CSS length). Default --sp-6. */
  padding?: string;
  children?: React.ReactNode;
}

export function Card(props: CardProps): JSX.Element;
