---
name: 3d-table
description: >-
  Add a reusable 3D table part whose grid and cells have tunable size and
  emphasis. Use when the user asks for a table, grid, schema, or matrix in a
  3D slide, or runs /3d-table.
disable-model-invocation: true
---

# 3D table

Read [../primitives.md](../primitives.md) and follow it.

A table is a grid of boxes. `rows` and `columns` set the grid. `size` scales the whole grid. A cell's own `size` scales that cell.

## Extra props

| Prop | Type | Role |
| --- | --- | --- |
| `rows` | number | Row count. |
| `columns` | number | Column count. |
| `gap` | number | Space between cell centers, added to the unit pitch. Default `0.35`. |
| `cells` | `{ row, column, label?, fields?, size?, emphasis?, color? }[]` | Overrides for individual cells. |

## Files

Copy these from `../assets/parts/` when they are missing:

- `story.ts`
- `PartMaterial.tsx`
- `PartLabel.tsx`
- `SolidPart.tsx`
- `Box.tsx`
- `Table.tsx`

Export `Table` from the parts index.

## Story

Keep the grid stable. Change one cell's size and emphasis on the step that cell explains. Leave `gap` wide enough for the largest cell.

```tsx
<Table
  step={step}
  label="Schema"
  rows={2}
  columns={3}
  size={[
    [1, 1, 1],
    [1.15, 1.15, 1],
  ]}
  cells={[
    {
      row: 0,
      column: 1,
      label: 'id',
      size: [
        [0.92, 0.72, 0.28],
        [1.35, 1.05, 0.28],
      ],
      emphasis: [0.35, 1],
    },
  ]}
/>
```

Do not draw a new grid of meshes in the slide. Add cells to this table.
