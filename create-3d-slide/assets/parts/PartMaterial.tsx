// Shared surface for slide parts. Import this. Do not copy it into a slide.
import type { RefObject } from 'react'
import * as THREE from 'three'

type PartMaterialProps = {
  materialRef: RefObject<THREE.MeshStandardMaterial | null>
  color: string
  wireframe?: boolean
  doubleSide?: boolean
}

export function PartMaterial({ materialRef, color, wireframe = false, doubleSide = false }: PartMaterialProps) {
  return (
    <meshStandardMaterial
      ref={materialRef}
      color={color}
      emissive={color}
      emissiveIntensity={0}
      roughness={0.42}
      metalness={0.04}
      transparent
      wireframe={wireframe}
      side={doubleSide ? THREE.DoubleSide : THREE.FrontSide}
    />
  )
}
