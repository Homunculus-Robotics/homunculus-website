import React from 'react';

/**
 * RGB-split glitch headline. Honors the brand's high glitch appetite,
 * but the animation only fires on hover by default (respectful of readers).
 */
export function GlitchText({ as = 'span', font = 'display', always = false, children, style, ...rest }) {
  const [on, setOn] = React.useState(false);
  const active = always || on;
  const fam = {
    display: 'var(--font-display)',
    glitch: 'var(--font-glitch)',
    serif: 'var(--font-serif)',
  }[font];
  const Comp = as;
  const text = typeof children === 'string' ? children : '';
  return (
    <Comp
      onMouseEnter={() => setOn(true)}
      onMouseLeave={() => setOn(false)}
      style={{
        position: 'relative',
        display: 'inline-block',
        fontFamily: fam,
        color: 'var(--text-hi)',
        textShadow: active ? '2px 0 var(--gold-400), -2px 0 var(--status-info)' : 'none',
        animation: active ? 'hmc-glitch 1.6s steps(2) infinite' : 'none',
        transition: 'text-shadow var(--dur) var(--ease-out)',
        ...style,
      }}
      data-text={text}
      {...rest}
    >
      {children}
    </Comp>
  );
}
