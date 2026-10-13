// Shared unit-mesh shell. Geometry stays unit-sized. Size is a scale.
import { useRef, type ReactNode } from 'react'
import * as THREE from 'three'
import { PartLabel } from './PartLabel'
import { PartMaterial } from './PartMaterial'
import { numberAt, useStoryMotion, type PartProps, type Vec3 } from './story'

type SolidPartProps = PartProps & {
  children: ReactNode
  wireframe?: boolean
  doubleSide?: boolean
  fallback?: Vec3
}

export function SolidPart({
  step,
  size,
  emphasis,
  color = '#60a5fa',
  label,
  fields,
  position,
  rotation,
  children,
  wireframe = false,
  doubleSide = false,
  fallback,
}: SolidPartProps) {
  const group = useRef<THREE.Group>(null)
  const material = useRef<THREE.MeshStandardMaterial>(null)
  useStoryMotion(group, material, step, size, emphasis, fallback)
  const shown = numberAt(emphasis, step, 1)

  return (
    <group position={position} rotation={rotation}>
      <group ref={group}>
        <mesh>
          {children}
          <PartMaterial materialRef={material} color={color} wireframe={wireframe} doubleSide={doubleSide} />
        </mesh>
      </group>
      <PartLabel text={label} fields={fields} step={step} emphasis={shown} />
    </group>
  )
}
