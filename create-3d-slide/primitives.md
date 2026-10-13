# Shared 3D parts

Diagrams are compositions of shared parts. A part is one component for the whole deck. Slides pass `step` and a size curve. They do not declare their own meshes for these shapes.

## Story props

Every part accepts these props.

| Prop | Type | Role |
| --- | --- | --- |
| `step` | number | Current slide step. Pass the same value into every part. |
| `size` | number, `[width, height, depth]`, or a list of `[width, height, depth]` | Scale of the part. A list has one entry per step. |
| `emphasis` | number from 0 to 1, or a list of those | Brightness and opacity. `1` is the focus. |
| `color` | CSS color | Base color. Emissive uses the same color. |
| `label` | string | Short name, drawn on the part. |
| `fields` | `{ label, value?, emphasis? }[]` | A few properties drawn under the label. |
| `position` | `[x, y, z]` | Local position. |
| `rotation` | `[x, y, z]` | Radians. |

`size` and `emphasis` carry the story. On the step where a part matters, make it larger and set emphasis to `1`. Give the neighboring parts a smaller size and a lower emphasis on that same step.

```tsx
<Box
  step={step}
  label="Primary"
  position={[-1.5, 0, 0]}
  size={[[1.6, 1.6, 1.6], [0.7, 0.7, 0.7]]}
  emphasis={[1, 0.25]}
/>
<Box
  step={step}
  label="Failover"
  position={[1.5, 0, 0]}
  size={[[0.7, 0.7, 0.7], [1.6, 1.6, 1.6]]}
  emphasis={[0.25, 1]}
/>
```

A single number for `size` scales all three axes on every step. `[width, height, depth]` is one size for every step. A list of those vectors is the per-step story. Per-step values stay on the last entry when `step` runs past the end of the list.

## How size is applied

Geometry stays at unit size. `useStoryMotion` lerps the group scale toward the size for the current step. Opacity and emissive intensity lerp from `emphasis`. Leave those three values off the React props so a re-render does not snap them.

| Part | What `size` means |
| --- | --- |
| Box | Scale of the unit cube. `fields` are the properties on its face. |
| Circle | Scale of a disc with diameter 1. `thickness` `0` is filled, toward `1` is a thin ring. `arc` `1` is a full turn. |
| Cylinder | `[diameter, height, diameter]`. |
| Arrow | `size[0]` is shaft thickness. Length is the distance from `from` to `to`, multiplied by `reach` (`0` hidden, `1` complete). |
| Table | Scale of the whole grid. A cell `size` scales that cell around its own center. |
| Stack | Size of each layer. `active` is the layer index in focus. |
| Cluster | Size of the frame only. Children keep their own size. |

Y is up. The default camera looks from `+Z`. Build circles, tables, and labels in the XY plane.

## Install parts

Search the project for an existing parts folder. If there is none, create one next to the slides, usually `src/slides/parts/`.

Copy a file from this skill's `assets/parts/` only when the project does not already have that component. Keep one copy. Later slides import it. If a prop is missing, add it to that file.

Dependency order:

1. `story.ts`
2. `PartMaterial.tsx`
3. `PartLabel.tsx`
4. `SolidPart.tsx`
5. The shape file: `Box.tsx`, `Circle.tsx`, `Cylinder.tsx`, `Arrow.tsx`, `Table.tsx`, `Stack.tsx`, `Cluster.tsx`

`Table` and `Stack` import `Box`. `Cluster` imports `SolidPart`. Export each copied component from the folder's `index.ts`.

Match the project's language and import style when the project is not TypeScript. Keep these prop names.

The canvas needs one ambient light and one point or directional light. Parts share that lighting. Do not add a canvas, a shadow map, or a second copy of a part per slide.

## Compose

Map the narration onto parts before writing a mesh:

| Idea | Part |
| --- | --- |
| Node, service, document, block | Box |
| Grid, schema, matrix | Table |
| Disc, ring, cycle, boundary | Circle |
| Flow, handoff, cause | Arrow |
| Layers, queue, history | Stack |
| Group, region, boundary around other parts | Cluster |
| Database, pipe, column | Cylinder |

Put the parts in one scene graph. Drive them with the same `step`. Wrap a group in `Cluster` when they belong to one region. Connect them with `Arrow`.

`Center` from drei may wrap the whole diagram. Do not wrap each part.

## Add a part the catalog does not have

Compose the shape from the parts above when that reads clearly. When it does not, add one component in the parts folder that:

- accepts `PartProps`
- uses unit geometry and `useStoryMotion`
- uses `PartMaterial` and `PartLabel`
- exports from the parts index

Follow `/3d-part` when you are adding that component.
