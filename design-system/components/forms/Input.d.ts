import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Mono uppercase field label above the input. */
  label?: string;
  /** Helper text below the field. */
  hint?: string;
  /** Render input text in mono. Default true. */
  mono?: boolean;
}

export function Input(props: InputProps): JSX.Element;
