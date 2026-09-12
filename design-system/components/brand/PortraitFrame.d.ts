import React from 'react';

export interface PortraitFrameProps {
  src: string;
  alt?: string;
  name?: string;
  role?: string;
  /** Visual treatment. Default "plain". */
  treatment?: 'plain' | 'twin' | 'sim-viewport';
  /** Signal-colored corner ticks. Default true. */
  corners?: boolean;
  style?: React.CSSProperties;
}

export function PortraitFrame(props: PortraitFrameProps): JSX.Element;
