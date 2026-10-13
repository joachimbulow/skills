---
name: 3d-box
description: >-
  Add a reusable 3D box part with tunable size, emphasis, label, and fields.
  Use when the user asks for a box, block, node, card, service, or document
  in a 3D slide, or runs /3d-box.
disable-model-invocation: true
---

# 3D box

Read [../primitives.md](../primitives.md) and follow it.

A box is a unit cube. `size` scales it. Use it for a node, service, document, or any block. `fields` are the properties drawn on its face.

## Files

Copy these from `../assets/parts/` into the project's parts folder when they are missing:

- `story.ts`
- `PartMaterial.tsx`
- `PartLabel.tsx`
- `SolidPart.tsx`
- `Box.tsx`

Export `Box` from the parts index. If `Box` already exists, add any missing prop to that file.

## Story

Give each box its own `size` and `emphasis` list, one entry per step. On the step where a box matters, make it larger and set emphasis to `1`.

```tsx
<Box
  step={step}
  label="Orders"
  position={[-1.4, 0, 0]}
  color="#60a5fa"
  size={[
    [1.6, 1.3, 0.5],
    [0.9, 0.8, 0.4],
  ]}
  emphasis={[1, 0.3]}
  fields={[
    { label: 'writes', emphasis: [1, 0.2] },
    { label: 'reads', emphasis: [0.2, 1] },
  ]}
/>
```

Compose boxes with the other parts. Do not build this shape as a new mesh inside the slide.
