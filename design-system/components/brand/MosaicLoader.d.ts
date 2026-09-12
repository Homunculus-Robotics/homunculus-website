import React from 'react';

export interface MosaicLoaderProps {
  /** Triangle side length in px. Default 104. */
  side?: number;
  rows?: number;
  cols?: number;
  /** Tile color — should match the surface it reveals onto. Default "var(--void)". */
  color?: string;
}

export function MosaicLoader(props: MosaicLoaderProps): JSX.Element;
