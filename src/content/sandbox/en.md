---
title: The Sandbox — Homunculus Robotics
description: BuilderLayer is a browser sandbox where you snap robot parts together like digital LEGO, and the physics engine says yes or no from the first drag. Not public yet — this is what it is and where it stands.
hero:
  eyebrow: Product Ⅰ — BuilderLayer
  headline: Snap parts together.
  headlineAccent: The engine says yes or no.
  lede: A browser sandbox where you assemble a robot the way you assemble LEGO — and every assembly it accepts is
  ledeEm: guaranteed to load, settle and actuate.
  status: In development — not public yet
  ctas:
    - { label: Tell us when it opens, href: '#access' }
    - { label: Invent a body instead, href: /designchallenge }
walls:
  eyebrow: 01 — Why this does not already exist
  heading: Three walls, and you climb all three before any feedback.
  aside: Browser URDF editors chip at the first. RL playgrounds chip at the second. Nothing joins all three into one loop.
  items:
    - num: Ⅰ
      title: Description formats
      body: A robot only exists to a simulator as URDF or MJCF XML — nested bodies, inertia tensors, joint frames, actuator gears. Hand-authoring it is a specialist skill, and one wrong frame yields a machine that loads cleanly and behaves like nonsense.
    - num: Ⅱ
      title: Simulator setup
      body: MuJoCo, Isaac Lab and Genesis are all excellent, and all assume a Linux workstation, a Python environment, an NVIDIA GPU and familiarity with RL tooling before the first robot moves.
    - num: Ⅲ
      title: Reward engineering
      body: Even with a valid robot in a working simulator, making it learn anything means designing a reward function — the part practitioners themselves call a dark art.
loop:
  eyebrow: 02 — The loop
  heading: Drag, snap, see it react, adjust.
  aside: The loop has to stay tight enough to be play, not work. Assembly to visible physics reaction is under a second, with no server round-trip.
  items:
    - num: Ⅰ
      tone: accent
      kicker: Assemble
      title: Parts, not XML
      body: Drag parts from a bin into a 3D workspace and snap them at defined attachment sites. The kinematic tree is a consequence of what you snapped, never something you author. Three kinds of part, and the builder cannot tell them apart — idealized modules, real embodiments (an SO-101 arm, an IRB 1200, the adapter plate between them), and 3D models taken apart into connected jointed parts.
      status: Shipped
    - num: Ⅱ
      tone: signal
      kicker: Validate
      title: The engine is the oracle
      body: Validity is never decided by a reimplementation of physics rules. A design is valid because MuJoCo loaded it and stepped it stably — in your tab, continuously, from the first drag. A refusal names the offending module and a concrete fix, at build time, instead of failing quietly hours later.
      status: Shipped
    - num: Ⅲ
      tone: accent
      kicker: Learn
      title: Train this robot
      body: >-
        Pick a goal and the validated robot trains against it. Deliberately not a live stream: Train writes the bundle out of the tab, the run happens on your own CPU overnight, and Open run replays the epochs afterwards as a montage — falls, stumbles, walks. No server, no job API, no GPU bill. Cloud training is the post-MVP path and named as such.
      status: PPO learns since August 2026
gate:
  eyebrow: 03 — The validity guarantee
  pull: '"It exported" and "it works"'
  pullAccent: stop being different claims.
  stats:
    - { value: '66/66', label: Corpus assemblies pass, tone: green }
    - { value: '<1', unit: s, label: Assembly → physics reaction, tone: plain }
    - { value: '57/59', label: Cross-engine agreement, tone: gold }
  note: >-
    The headline target is 100%, and the measurement is not there yet. Of the 59 corpus robots that reach MJCF, desktop MuJoCo 3.11.0 disagrees with the browser on two. One is harmless — a robot refused that the desktop engine would have accepted. One is not: a robot called ready that a desktop trainer refuses. Both are recorded by name and re-checked on every CI run, so the gap cannot grow quietly.
contact:
  eyebrow: 04 — Access
  heading: Not public yet. Say the word and you hear first.
  body: The builder, the gate and the trainer are in active development in a private repository. If you want early access, want to test it with your own arm, or want to work on it — one address, read by a human.
  email: hello@homunculusrobotics.com
---

Depth before breadth. The one invariant everything else sits on is that **the
trainer never receives a robot that cannot be trained** — so the physics engine
is present from the first drag rather than bolted on at export.

The obvious alternative is a web URDF editor plus, separately, an RL framework.
Several good ones exist. That pairing leaves you holding the hardest piece: the
guarantee that what you drew is something a simulator can actually train. We
invert it. Static checks still exist, but only to write **better error messages**
— never to be the source of truth.
