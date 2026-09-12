import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. Default "green". */
  tone?: 'green' | 'gold' | 'neutral' | 'error';
  /** Show a pulsing status dot. */
  live?: boolean;
  children?: React.ReactNode;
}

export function Badge(props: BadgeProps): JSX.Element;
