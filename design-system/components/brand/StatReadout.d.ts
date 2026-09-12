import React from 'react';

export interface StatReadoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The number/value (string or number). */
  value: React.ReactNode;
  /** Optional unit suffix (e.g. "ms", "×", "DOF"). */
  unit?: string;
  /** Mono uppercase caption under the value. */
  label: string;
  /** Value color. Default "green". */
  tone?: 'green' | 'gold' | 'plain';
  align?: 'left' | 'center';
}

/**
 * @startingPoint section="Data" subtitle="Instrument-style metric readout" viewport="700x160"
 */
export function StatReadout(props: StatReadoutProps): JSX.Element;
