---
name: 3d-circle
description: >-
  Add a reusable 3D circle part with tunable diameter, ring thickness, and
  arc. Use when the user asks for a circle, disc, ring, orbit, or cycle in a
  3D slide, or runs /3d-circle.
disable-model-invocation: true
---

# 3D circle

Read [../primitives.md](../primitives.md) and follow it.

A circle is a unit disc (diameter 1) in the XY plane. `size` scales it. Use it for a node, a group boundary, a cycle, or an orbit.

## Extra props

| Prop | Type | Role |
| --- | --- | --- |
| `thickness` | number from 0 to 1, or a list per step | `0` is a filled disc. Toward `1` it becomes a thin ring. |
| `arc` | number from 0 to 1, or a list per step | Portion of the turn. `1` is a full circle. |

## Files

Copy these from `../assets/parts/` when they are missing:

- `story.ts`
- `PartMaterial.tsx`
- `PartLabel.tsx`
- `SolidPart.tsx`
- `Circle.tsx`

Export `Circle` from the parts index.

## Story

Grow the diameter on the step the circle matters. Open the arc, or thin it into a ring, when the narration moves from a solid group to a cycle.

```tsx
<Circle
  step={step}
  label="Region"
  size={[
    [1.2, 1.2, 1],
    [2.4, 2.4, 1],
  ]}
  thickness={[0, 0.75]}
  arc={[1, 0.7]}
  emphasis={[0.4, 1]}
/>
```

`thickness` and `arc` change on the step. `size` eases. Do not add a new circle mesh in the slide.
