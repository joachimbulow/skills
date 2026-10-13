---
name: 3d-arrow
description: >-
  Add a reusable 3D arrow part whose length and thickness follow the story
  step. Use when the user asks for an arrow, flow, connector, or handoff in a
  3D slide, or runs /3d-arrow.
disable-model-invocation: true
---

# 3D arrow

Read [../primitives.md](../primitives.md) and follow it.

An arrow connects two points. `from` and `to` are `[x, y, z]`. `reach` is how far along that segment the arrow extends: `0` is hidden, `1` is the full length. `size[0]` is the shaft thickness.

## Extra props

| Prop | Type | Role |
| --- | --- | --- |
| `from` | `[x, y, z]` | Start. Defaults to `position`. |
| `to` | `[x, y, z]` | End. Defaults to one unit above the start. |
| `reach` | number from 0 to 1, or a list per step | How much of the path is drawn. |

## Files

Copy these from `../assets/parts/` when they are missing:

- `story.ts`
- `PartMaterial.tsx`
- `PartLabel.tsx`
- `Arrow.tsx`

Export `Arrow` from the parts index.

## Story

Start `reach` low on the step before the handoff, then set it to `1` on the step the flow completes. Thicken `size` on that same step when the flow is the point.

```tsx
<Arrow
  step={step}
  from={[-1.2, 0, 0]}
  to={[1.2, 0, 0]}
  reach={[0.1, 1]}
  size={[
    [0.06, 0.06, 0.06],
    [0.12, 0.12, 0.12],
  ]}
  emphasis={[0.3, 1]}
/>
```

Connect existing parts. Do not build a new shaft and head in the slide.
