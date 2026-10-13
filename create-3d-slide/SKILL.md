---
name: create-3d-slide
description: Create 3D-heavy interactive slides using React Three Fiber (R3F) and open-slide. Use when the user asks to build 3D slides, convert existing slides into interactive 3D presentations, or add R3F visual explainers tied to slide steps.
---

# Create 3D Interactive Slides (`create-3d-slide`)

## Overview
This skill guides the agent in transforming standard text/component slides into **interactive 3D-heavy slides** inside a React/Vite `open-slide` project. The core pattern relies on **React Three Fiber (R3F)** and **`@react-three/drei`**, where 3D models act as dynamic visual explainers whose state (camera angles, highlights, exploded views, and rotations) is strictly driven by the **slide's step or index**.

---

## When to Use This Skill
- The user wants to convert existing slides or markdown notes into interactive 3D visualizations.
- The project is verified to be a React/Vite slide setup (such as `open-slide`).
- The 3D model needs to sync directly with the text narration or bullet points as the presenter steps through the slide.

---

## Architecture & Core Rules

1. **Strict Step-Driven State:**
   - Avoid complex mouse raycasting or unpredictable interactive orbit controls for core narration unless requested. 
   - Tie 3D transformations (`rotation`, `position`, `scale`, `emissive` color intensity) directly to the current slide step integer (`step` or `activeStep` prop).

2. **Layout Selection:**
   - **Classic Split Layout:** Use when comparing distinct parts or showing side-by-side technical diagrams (e.g., text/bullet points on the left 40%, R3F Canvas viewport on the right 60%).
   - **Floating Glassmorphism Cards:** Use when the 3D model is the hero element (e.g., centered 3D cluster or pipeline) with semi-transparent step cards floating over or beside it.

3. **R3F Best Practices in Slides:**
   - Keep canvas management lightweight per slide or utilize a persistent background canvas if transitioning between similar scenes.
   - Use declarative primitives or procedural meshes (`<boxGeometry>`, `<sphereGeometry>`, `<line>`, `<meshStandardMaterial>`) combined with `@react-three/drei` helpers (`<Center>`, `<Float>`, `<Html>`).
   - Use `useFrame` with lerp (`THREE.MathUtils.lerp`) for silky-smooth camera transitions and model rotations when changing steps.

---

## Step-by-Step Generation Workflow

1. **Analyze Existing Slide Context:**
   - Review the source material, bullet points, or existing slide component.
   - Identify the core metaphor (e.g., nodes in a network, hierarchical tree, data pipeline, sharded database cluster).

2. **Determine Layout & Composition:**
   - Select either **Split View** or **Centered Model with Cards**.
   - Define the number of steps (e.g., 3 narrative beats $\rightarrow$ 3 distinct 3D camera/highlight states).

3. **Write the React Component:**
   - Import R3F core and drei components.
   - Create a sub-component for the 3D scene that accepts `step` as a prop.
   - Implement smooth interpolations (`useFrame`) for target rotations and highlights based on `step`.
   - Assemble the slide layout with typography and step indicators.

---

## Example R3F Step-Sync Pattern

```tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Center, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function ExplainerModel({ step }: { step: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Smoothly rotate or adjust based on current step
    const targetRotationY = step * (Math.PI / 2);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotationY,
      delta * 4
    );
  });

  return (
    <group ref={groupRef}>
      {/* Node 1 */}
      <mesh position={[-2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={step === 0 ? '#3b82f6' : '#1e293b'} />
      </mesh>
      {/* Node 2 */}
      <mesh position={[2, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={step === 1 ? '#10b981' : '#1e293b'} />
      </mesh>
    </group>
  );
}

export default function My3DSlide({ step }: { step: number }) {
  return (
    <div className="w-full h-full flex bg-slate-950 text-white">
      <div className="w-1/3 p-12 flex flex-col justify-center">
        <h2 className="text-3xl font-bold mb-4">Step {step + 1} Explanation</h2>
        <p className="text-slate-400">
          {step === 0 ? "Analyzing primary node clusters..." : "Switching focus to secondary failover nodes."}
        </p>
      </div>
      <div className="w-2/3 h-full">
        <Canvas 2, 50 5], [0, camera="{{" fov: position: }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <Center>
            <ExplainerModel step="{step}"/>
          </Center>
        </Canvas>
      </div>
    </div>
  );
}