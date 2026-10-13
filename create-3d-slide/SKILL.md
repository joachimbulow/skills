---
name: create-3d-slide
description: >-
  Create 3D-heavy interactive slides using React Three Fiber (R3F) and
  open-slide. Use when the user asks to build 3D slides, convert existing
  slides into interactive 3D presentations, add R3F visual explainers tied to
  slide steps, or compose reusable parts such as boxes, tables, circles,
  arrows, stacks, clusters, and cylinders with tunable size and emphasis.
---

# Create 3D Interactive Slides (`create-3d-slide`)

## Overview
This skill guides the agent in transforming standard text/component slides into **interactive 3D-heavy slides** inside a React/Vite `open-slide` project. The core pattern relies on **React Three Fiber (R3F)** and **`@react-three/drei`**, where 3D models act as dynamic visual explainers whose state (camera angles, highlights, exploded views, and rotations) is strictly driven by the **slide's step or index**.

Reuse scene, layout, mesh, and material components across the deck. One shared scene that changes with the step stays cohesive and light to render.

Build diagrams from shared parts. Each part takes a `size` and an `emphasis` that can change per step, so the story can grow one piece and quiet another. The user can run a part command directly: `/3d-box`, `/3d-table`, `/3d-circle`, `/3d-arrow`, `/3d-stack`, `/3d-cluster`, `/3d-cylinder`, or `/3d-part`.

---

## When to Use This Skill
- The user wants to convert existing slides or markdown notes into interactive 3D visualizations.
- The project is verified to be a React/Vite slide setup (such as `open-slide`).
- The 3D model needs to sync directly with the text narration or bullet points as the presenter steps through the slide.
- The user asks for a reusable diagram part, or runs one of the part commands above.

---

## Architecture & Core Rules

1. **Strict Step-Driven State:**
   - Avoid complex mouse raycasting or unpredictable interactive orbit controls for core narration unless requested. 
   - Tie 3D transformations (`rotation`, `position`, `scale`, `emissive` color intensity) directly to the current slide step integer (`step` or `activeStep` prop).

2. **Layout Selection:**
   - **Classic Split Layout:** Use when comparing distinct parts or showing side-by-side technical diagrams (e.g., text/bullet points on the left 40%, R3F Canvas viewport on the right 60%).
   - **Floating Glassmorphism Cards:** Use when the 3D model is the hero element (e.g., centered 3D cluster or pipeline) with semi-transparent step cards floating over or beside it.

3. **R3F Best Practices in Slides:**
   - Keep one persistent canvas and one scene for a shared metaphor. Mount another canvas only when the scene is actually different.
   - Compose the scene from the shared parts. Add new geometry only inside a part, at unit size.
   - Use `useFrame` with lerp (`THREE.MathUtils.lerp`) for silky-smooth camera transitions and model rotations when changing steps.

4. **Reuse components:**
   - Before adding a scene, layout, mesh, or material, search the deck for one that already fits.
   - Extend that component with props (`step`, `size`, `emphasis`, camera target) instead of copying it for each slide.
   - Share geometries, materials, lights, and layout shells so the deck stays visually cohesive and cheap to render.
   - Keep one scene graph through a sequence. Drive camera, highlight, and pose from the step.
   - Add a new component only when the metaphor or layout is actually different.

5. **Tell the story with size:**
   - Every part takes `size` and `emphasis`. Read [primitives.md](primitives.md) before adding a shape.
   - `size` is a number, `[width, height, depth]`, or a list of `[width, height, depth]` with one entry per step.
   - `emphasis` runs from 0 to 1, or is a list with one entry per step. It changes brightness and opacity.
   - Neighboring parts get different size lists, so the part in focus is larger on its step.

---

## Part commands

Read [primitives.md](primitives.md) before adding geometry. Then read only the command for each part you use.

| Command | Part | Use it for |
| --- | --- | --- |
| `/3d-box` | [Box](3d-box/SKILL.md) | Nodes, blocks, services, documents. `fields` lists properties on the face. |
| `/3d-table` | [Table](3d-table/SKILL.md) | Grids, schemas, matrices. |
| `/3d-circle` | [Circle](3d-circle/SKILL.md) | Discs, rings, cycles, orbits. |
| `/3d-arrow` | [Arrow](3d-arrow/SKILL.md) | Flow, cause, handoff. `reach` draws the path as the step advances. |
| `/3d-stack` | [Stack](3d-stack/SKILL.md) | Layers, queues, history. |
| `/3d-cluster` | [Cluster](3d-cluster/SKILL.md) | A frame around other parts. |
| `/3d-cylinder` | [Cylinder](3d-cylinder/SKILL.md) | Databases, pipes, columns. |
| `/3d-part` | [New part](3d-part/SKILL.md) | A shape the list above cannot compose. |

Copy a part from `assets/parts/` only when the project does not already have it. Later slides import that file.

---

## Step-by-Step Generation Workflow

1. **Analyze Existing Slide Context:**
   - Review the source material, bullet points, or existing slide component.
   - Identify the core metaphor (e.g., nodes in a network, hierarchical tree, data pipeline, sharded database cluster).

2. **Determine Layout & Composition:**
   - Select either **Split View** or **Centered Model with Cards**.
   - Map the metaphor onto parts: node to box, grid to table, flow to arrow, layer to stack, group to cluster, cycle to circle, database or pipe to cylinder.
   - Define the number of steps (e.g., 3 narrative beats $\rightarrow$ 3 distinct sizes and emphasis values).

3. **Reuse, then write:**
   - Inventory existing slide layouts, scene components, and the parts folder.
   - Follow the part command for each shape. Copy a missing part once, then import it.
   - Pass the same `step` into every part, with a `size` list that matches the narration.
   - Create a new part only when nothing in the catalog can carry this metaphor. Follow `/3d-part`.
   - Assemble the slide with the existing layout shell, typography, and step indicators.

---

## Example

Same two boxes on every step. Their size lists swap which one is large. Import `Box` from the project's parts folder.

```tsx
import { Canvas } from '@react-three/fiber'
import { Center } from '@react-three/drei'
import { Box } from './parts/Box'

export default function My3DSlide({ step }: { step: number }) {
  return (
    <div className="w-full h-full flex bg-slate-950 text-white">
      <div className="w-1/3 p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Step {step + 1} Explanation</h2>
        <p className="text-slate-400">
          {step === 0 ? 'Primary node takes the load.' : 'Failover node takes the load.'}
        </p>
      </div>
      <div className="w-2/3 h-full">
        <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Center>
            <Box
              step={step}
              label="Primary"
              position={[-1.5, 0, 0]}
              color="#60a5fa"
              size={[
                [1.5, 1.5, 1.5],
                [0.7, 0.7, 0.7],
              ]}
              emphasis={[1, 0.25]}
              fields={[{ label: 'role', value: 'leader', emphasis: [1, 0.2] }]}
            />
            <Box
              step={step}
              label="Failover"
              position={[1.5, 0, 0]}
              color="#34d399"
              size={[
                [0.7, 0.7, 0.7],
                [1.5, 1.5, 1.5],
              ]}
              emphasis={[0.25, 1]}
            />
          </Center>
        </Canvas>
      </div>
    </div>
  )
}
```

Keep this canvas and these boxes for later slides that share the metaphor. Change `step`, `size`, and `emphasis`.