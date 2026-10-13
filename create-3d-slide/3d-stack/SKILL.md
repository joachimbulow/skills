---
name: 3d-stack
description: >-
  Add a reusable 3D stack of layers with tunable layer size and an active
  layer per step. Use when the user asks for a stack, layers, a queue, or a
  history in a 3D slide, or runs /3d-stack.
disable-model-invocation: true
---

# 3D stack

Read [../primitives.md](../primitives.md) and follow it.

A stack is a column of boxes. `count` is the number of layers. `size` is the size of each layer. `active` is the index of the layer in focus. The active layer gets emphasis `1` and shows the label and fields.

## Extra props

| Prop | Type | Role |
| --- | --- | --- |
| `count` | number | Layer count. |
| `gap` | number | Extra space between layers. Default `0.18`. |
| `axis` | `x`, `y`, or `z` | Stack direction. Default `y`. |
| `active` | number, or a list per step | Index of the focused layer. |

## Files

Copy these from `../assets/parts/` when they are missing:

- `story.ts`
- `PartMaterial.tsx`
- `PartLabel.tsx`
- `SolidPart.tsx`
- `Box.tsx`
- `Stack.tsx`

Export `Stack` from the parts index.

## Story

Move `active` with the step so attention climbs or descends the stack. Change `size` when the narration is about the amount in a layer, such as a queue getting taller.

```tsx
<Stack
  step={step}
  label="Queue"
  count={4}
  active={[0, 2, 3]}
  size={[
    [1.2, 0.28, 0.8],
    [1.2, 0.28, 0.8],
    [1.2, 0.55, 0.8],
  ]}
/>
```

Do not stack one-off boxes in the slide.
