---
name: 3d-part
description: >-
  Add a new reusable 3D part that uses the shared size and emphasis props.
  Use when the user needs a diagram shape that is not a box, table, circle,
  arrow, stack, cluster, or cylinder, or runs /3d-part.
disable-model-invocation: true
---

# New 3D part

Read [../primitives.md](../primitives.md) and follow it.

Use an existing part when it can carry the shape. A wide box, a ring, a stack of cylinders, or a cluster of boxes is still those parts.

Add a new component only when composition cannot express the shape.

## Build it

1. Copy `story.ts`, `PartMaterial.tsx`, `PartLabel.tsx`, and `SolidPart.tsx` from `../assets/parts/` when the project does not already have them.
2. Add one component in the parts folder. Accept `PartProps`.
3. Keep geometry at unit size and let `useStoryMotion` apply `size` and `emphasis`.
4. Draw the label with `PartLabel`.
5. Export it from the parts index.
6. Use it from the slide with a per-step `size` list.

Infer the size curve from the narration. Ask which part grows on which step only when the source does not make the focus clear.

Leave this skill's catalog as it is. Add the component to the slide project.
