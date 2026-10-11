# Architecture

## Overview

Luma is a static client-only application. `index.html` defines the interface, `styles.css` presents it, and `game.js` owns all runtime behavior. There is no backend, API, telemetry, account system, or build-time asset pipeline.

```text
Pointer / keyboard input
          |
          v
   game state machine -----> Web Audio tones
          |
          v
 fixed-step simulation
          |
          v
 WebGL procedural renderer -----> canvas
          |
          +----------------------> DOM score and overlays
```

## Runtime state

The game moves through five states:

| State | Meaning |
| --- | --- |
| `intro` | Idle title scene; the creature floats in place |
| `playing` | Physics, obstacles, scoring, particles, and collision are active |
| `paused` | Simulation is frozen and the pause card is visible |
| `dying` | A short impact/fall transition runs after collision |
| `ended` | Results and retry controls are visible |

The document body receives `playing` or `ended` classes so CSS can reveal the appropriate HUD. Overlay elements use the native `hidden` attribute.

## Simulation

`requestAnimationFrame` drives presentation. Elapsed frame time is accumulated and consumed in fixed `1/120` second updates. This keeps gravity, collisions, and obstacle movement consistent across refresh rates. Frame deltas are capped to avoid a large simulation jump after a stalled frame.

The creature has vertical position and velocity. A flap replaces its velocity with a positive impulse; gravity reduces it every update. Obstacles move left, spawn at a fixed horizontal interval with constrained random gap centers, and award one point after their trailing edge passes the creature.

Collision uses a small circular creature radius against the rectangular blocked regions above and below each gap. Crossing the world ceiling or floor also ends the run.

## Rendering

The renderer uses WebGL 1 directly. Geometry for spheres, low-poly rocks, cylinders, tapered columns, and water ripples is generated once at startup and uploaded to GPU buffers. A compact vertex/fragment shader pair handles transforms, directional lighting, color, alpha, and distance fog.

The world is composed from reusable procedural meshes:

- Luma is assembled from scaled spheres and rocks.
- Obstacles are stacked cylinders with caps, seams, and inlays.
- The ocean, sun, islands, ripples, birds, trail, and impact particles are drawn without image assets.

The renderer limits device pixel ratio to 2 to protect mobile GPU fill rate. The projection resizes with the viewport while keeping the gameplay height stable.

## Audio

Web Audio oscillators generate short flap, score, impact, and toggle tones. Audio is opt-in and the `AudioContext` is created only after interaction. Sound state is session-only; it is not persisted.

## Persistence and privacy

Only the numeric personal best is stored, under the `luma-best` local-storage key. Data never leaves the browser. Clearing site data resets the best score.

## Failure behavior

If WebGL creation fails, an explanatory full-screen message replaces the game. If the WebGL context is lost during play, the game pauses and shows the same message. A restored context reloads the page so GPU resources are rebuilt cleanly. Visibility loss or window blur pauses an active run.
