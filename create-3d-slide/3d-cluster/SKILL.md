---
name: 3d-cluster
description: >-
  Add a reusable 3D cluster frame that groups other slide parts. Use when the
  user asks for a group, region, boundary, or cluster in a 3D slide, or runs
  /3d-cluster.
disable-model-invocation: true
---

# 3D cluster

Read [../primitives.md](../primitives.md) and follow it.

A cluster is a wireframe box around other parts. `size` scales the frame only. Children keep the size you pass to them. Set the frame large enough to surround those children on every step, and grow the frame when the group becomes the subject.

## Files

Copy these from `../assets/parts/` when they are missing:

- `story.ts`
- `PartMaterial.tsx`
- `PartLabel.tsx`
- `SolidPart.tsx`
- `Cluster.tsx`

Children such as `Box` still need their own files. Follow that part's command.

Export `Cluster` from the parts index.

## Story

```tsx
<Cluster
  step={step}
  label="Region"
  size={[
    [3.2, 2, 1.2],
    [4.2, 2.4, 1.2],
  ]}
  emphasis={[0.35, 1]}
>
  <Box
    step={step}
    label="A"
    position={[-0.7, 0, 0]}
    size={[
      [0.7, 0.7, 0.7],
      [1.1, 1.1, 1.1],
    ]}
    emphasis={[0.4, 1]}
  />
  <Box
    step={step}
    label="B"
    position={[0.7, 0, 0]}
    size={[
      [0.7, 0.7, 0.7],
      [0.8, 0.8, 0.8],
    ]}
    emphasis={[0.4, 0.55]}
  />
</Cluster>
```

Place children in the cluster's local space. Do not wrap each child in its own frame.
