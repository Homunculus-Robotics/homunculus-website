---
title: Homunculus Robotics — Build the body. Teach it to move.
description: Design robot bodies in the browser, train them in simulation, and build toward the same machine in hardware.
hero:
  eyebrow: Homunculus Robotics — Open-ended robotics
  headline: Build the body.
  headlineAccent: Teach it to move.
  lede: Design a robot body in the browser. Train it in simulation. Build toward the same machine in hardware —
  ledeEm: one loop from idea to motion.
  ctas:
    - { label: Browse the Design Challenge, href: /designchallenge }
    - { label: Explore the sandbox, href: /sandbox }
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
    - { label: See the entries, href: /designchallenge }
    - { label: Submit a design, href: /designchallenge }
contact:
  eyebrow: 04 — Talk to us
  heading: Industry, research, or you just want to build the bodies.
  body: Partnerships, pilots, press, or a role on the founding team — one address, read by a human.
  email: hello@homunculusrobotics.com
---

Most robot software starts with a body that has already been chosen. That makes
the body a constraint before the work has even begun. A robot only exists to a
simulator as XML — nested bodies, inertia tensors, joint frames — and getting
one frame wrong yields a machine that loads fine and behaves like nonsense.

We are building the missing loop: assemble a body, teach it a skill, and learn
from what happens when the design meets the world. **Intelligence should be
born into the body the task demands** — not into the one that happens to look
like us.
