---
title: Homunculus Robotics — The human form is one solution
description: Physical AI for the bodies nobody has built yet — a browser sandbox, a morphology-agnostic learner, a physical module kit, and a public Design Challenge anyone can enter.
hero:
  eyebrow: Homunculus Robotics — Physical AI
  headline: The human form is one solution.
  headlineAccent: We build the others.
  lede: The bottleneck in robotics is not motors. It's access. We build the tools that let anyone invent a robot body —
  ledeEm: and the learner that teaches it to move.
  ctas:
    - { label: Browse the Design Challenge, href: /challenge }
    - { label: See the sandbox, href: /sandbox }
products:
  eyebrow: 01 — Three halves of one product
  heading: A builder, a learner, and the metal underneath.
  aside: Each half is a repository under active development. None of them is public yet — this page is the first thing that is.
  items:
    - num: Ⅰ
      tone: accent
      kicker: Sandbox
      title: BuilderLayer
      body: A browser sandbox where you snap robot parts together like digital LEGO, and the physics engine says yes or no from the first drag. Every assembly it accepts is guaranteed to load, settle and actuate.
      status: In development
      href: /sandbox
    - num: Ⅱ
      tone: signal
      kicker: Learner
      title: Homunculus AI
      body: The learner behind the Train button — one PPO learner with zero morphology-specific code, teaching any body the builder accepts to track a commanded velocity. Per-body policies today, on an explicit path to one generalist policy distilled from every robot our users ever train.
      status: PPO learns since August 2026
    - num: Ⅲ
      tone: accent
      kicker: Hardware Kit
      title: The module kit
      body: The physical half of the LEGO promise — one keyed coupling, one actuator, and a bench that measures what the simulator is currently guessing. A robot snapped together on the table is the same graph, and behaves the same way, as the one snapped together in the browser.
      status: In development
thesis:
  eyebrow: 02 — Why Homunculus exists
  pull: Robotics is gated.
  pullAccent: We deleted the gate.
challenge:
  eyebrow: 03 — The Design Challenge
  heading: Invent a body. Defend it. Let the public vote.
  body: >-
    Upload a robot embodiment you invented — images, a video, a 3D model you can rotate in the browser — and answer three questions: what your design is, why that specific body, and how it interacts with the world and makes it better. Every entry goes live immediately and anyone can vote. No account, no password, no fee.
  ctas:
    - { label: See the entries, href: /challenge }
    - { label: Submit a design, href: /challenge }
contact:
  eyebrow: 04 — Talk to us
  heading: Industry, research, or you just want to build the bodies.
  body: Partnerships, pilots, press, or a role on the founding team — one address, read by a human.
  email: hello@homunculusrobotics.com
---

The bottleneck is not motors. It's the software overhead, the integration cost,
and the fact that every new task needs an engineer who already has a six-month
waiting list. A robot only exists to a simulator as XML — nested bodies, inertia
tensors, joint frames — and getting one frame wrong yields a machine that loads
fine and behaves like nonsense.

So the people who would most enjoy inventing robots are the ones excluded from
it. We think that is a tooling failure, not a talent shortage, and that
**intelligence should be born into whatever body the task demands** — not into
the one that happens to look like us.
