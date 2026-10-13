// Shared story motion for slide parts. Import this. Do not copy it into a slide.
import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type Vec3 = [number, number, number]
export type Size = number | Vec3 | readonly Vec3[]

export type PartField = {
  label: string
  value?: string
  emphasis?: number | readonly number[]
}

export type PartProps = {
  step: number
  size?: Size
  emphasis?: number | readonly number[]
  color?: string
  label?: string
  fields?: PartField[]
  position?: Vec3
  rotation?: Vec3
}

export const STORY_EASE = 4

export function easeAlpha(delta: number): number {
  return 1 - Math.exp(-STORY_EASE * delta)
}

export function numberAt(
  value: number | readonly number[] | undefined,
  step: number,
  fallback: number,
): number {
  if (typeof value === 'number') return value
  if (!value || value.length === 0) return fallback
  const index = Math.min(Math.max(step, 0), value.length - 1)
  return value[index] ?? fallback
}

export function sizeAt(size: Size | undefined, step: number, fallback: Vec3 = [1, 1, 1]): Vec3 {
  if (size === undefined) return fallback
  if (typeof size === 'number') return [size, size, size]
  const first = size[0]
  if (Array.isArray(first)) {
    const steps = size as readonly Vec3[]
    if (steps.length === 0) return fallback
    return steps[Math.min(Math.max(step, 0), steps.length - 1)]
  }
  return [Number(size[0]), Number(size[1]), Number(size[2])]
}

export function applyEmphasis(material: THREE.MeshStandardMaterial | null, emphasis: number) {
  if (!material) return
  material.emissiveIntensity = emphasis * 0.85
  material.opacity = 0.38 + emphasis * 0.62
}

export function useStoryMotion(
  group: RefObject<THREE.Object3D | null>,
  material: RefObject<THREE.MeshStandardMaterial | null> | null,
  step: number,
  size: Size | undefined,
  emphasis: number | readonly number[] | undefined,
  fallback: Vec3 = [1, 1, 1],
) {
  const currentScale = useRef<THREE.Vector3 | null>(null)
  const targetScale = useRef(new THREE.Vector3())
  const currentEmphasis = useRef<number | null>(null)

  if (currentScale.current === null) {
    const [x, y, z] = sizeAt(size, step, fallback)
    currentScale.current = new THREE.Vector3(x, y, z)
  }
  if (currentEmphasis.current === null) {
    currentEmphasis.current = numberAt(emphasis, step, 1)
  }

  useLayoutEffect(() => {
    if (group.current && currentScale.current) {
      group.current.scale.copy(currentScale.current)
    }
    applyEmphasis(material?.current ?? null, currentEmphasis.current ?? 1)
  }, [group, material])

  useFrame((_, delta) => {
    const [x, y, z] = sizeAt(size, step, fallback)
    const nextEmphasis = numberAt(emphasis, step, 1)
    const alpha = easeAlpha(delta)
    targetScale.current.set(x, y, z)
    currentScale.current?.lerp(targetScale.current, alpha)
    currentEmphasis.current = THREE.MathUtils.lerp(currentEmphasis.current ?? 1, nextEmphasis, alpha)
    if (group.current && currentScale.current) {
      group.current.scale.copy(currentScale.current)
    }
    applyEmphasis(material?.current ?? null, currentEmphasis.current)
  })
}
