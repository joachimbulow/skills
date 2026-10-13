---
name: 3d-cylinder
description: >-
  Add a reusable 3D cylinder part with tunable diameter and height. Use when
  the user asks for a cylinder, database, pipe, or column in a 3D slide, or
  runs /3d-cylinder.
disable-model-invocation: true
---

# 3D cylinder

Read [../primitives.md](../primitives.md) and follow it.

A cylinder stands on Y. `size` is `[diameter, height, diameter]`. Use it for a database, a pipe, or a column. Put properties in `fields`.

## Files

Copy these from `../assets/parts/` when they are missing:

- `story.ts`
- `PartMaterial.tsx`
- `PartLabel.tsx`
- `SolidPart.tsx`
- `Cylinder.tsx`

Export `Cylinder` from the parts index.

## Story

Change height when the amount grows. Change diameter when the subject gets broader. Emphasize it on the step it is explained.

```tsx
<Cylinder
  step={step}
  label="Ledger"
  fields={[{ label: 'rows', value: 'hot', emphasis: [0.2, 1] }]}
  size={[
    [0.7, 0.6, 0.7],
    [0.8, 1.6, 0.8],
  ]}
  emphasis={[0.3, 1]}
/>
```

Do not add a new cylinder mesh in the slide.
