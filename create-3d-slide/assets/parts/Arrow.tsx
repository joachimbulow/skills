// Shared slide part. Extend this file in place. Keep a single copy for the whole deck.
import { useLayoutEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PartLabel } from './PartLabel'
import { PartMaterial } from './PartMaterial'
import { applyEmphasis, easeAlpha, numberAt, sizeAt, type PartProps, type Vec3 } from './story'

type ArrowProps = PartProps & {
  from?: Vec3
  to?: Vec3
  reach?: number | readonly number[]
}

const Y_AXIS = new THREE.Vector3(0, 1, 0)

export function Arrow({
  step,
  size,
  emphasis,
  color = '#e2e8f0',
  label,
  fields,
  position = [0, 0, 0],
  from,
  to,
  reach,
}: ArrowProps) {
  const group = useRef<THREE.Group>(null)
  const shaft = useRef<THREE.Mesh>(null)
  const head = useRef<THREE.Mesh>(null)
  const shaftMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const headMaterial = useRef<THREE.MeshStandardMaterial>(null)
  const labelAnchor = useRef<THREE.Group>(null)
  const start = useRef(new THREE.Vector3())
  const end = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3(0, 1, 0))
  const currentReach = useRef(numberAt(reach, step, 1))
  const currentEmphasis = useRef(numberAt(emphasis, step, 1))
  const currentThickness = useRef(sizeAt(size, step, [0.08, 0.08, 0.08])[0])

  const place = (alpha: number) => {
    const targetReach = numberAt(reach, step, 1)
    const targetEmphasis = numberAt(emphasis, step, 1)
    const targetThickness = sizeAt(size, step, [0.08, 0.08, 0.08])[0]
    currentReach.current = THREE.MathUtils.lerp(currentReach.current, targetReach, alpha)
    currentEmphasis.current = THREE.MathUtils.lerp(currentEmphasis.current, targetEmphasis, alpha)
    currentThickness.current = THREE.MathUtils.lerp(currentThickness.current, targetThickness, alpha)

    const origin = from ?? position
    const target = to ?? [origin[0], origin[1] + 1, origin[2]]
    start.current.set(origin[0], origin[1], origin[2])
    end.current.set(target[0], target[1], target[2])
    direction.current.subVectors(end.current, start.current)
    const distance = direction.current.length()
    if (distance > 0) direction.current.multiplyScalar(1 / distance)
    else direction.current.set(0, 1, 0)

    const thickness = Math.max(currentThickness.current, 0.01)
    const length = distance * Math.max(currentReach.current, 0)
    const headLength = Math.min(thickness * 3, length * 0.35)
    const shaftLength = Math.max(length - headLength, 0)

    if (group.current) {
      group.current.visible = currentReach.current > 0.02 && length > 0.001
      group.current.position.copy(start.current)
      group.current.quaternion.setFromUnitVectors(Y_AXIS, direction.current)
    }
    if (shaft.current) {
      shaft.current.scale.set(thickness, shaftLength, thickness)
      shaft.current.position.set(0, shaftLength / 2, 0)
    }
    if (head.current) {
      head.current.scale.set(thickness * 2.2, headLength, thickness * 2.2)
      head.current.position.set(0, shaftLength + headLength / 2, 0)
    }
    if (labelAnchor.current) {
      labelAnchor.current.position.set(0, length / 2, 0)
    }
    applyEmphasis(shaftMaterial.current, currentEmphasis.current)
    applyEmphasis(headMaterial.current, currentEmphasis.current)
  }

  const placeRef = useRef(place)
  placeRef.current = place

  useLayoutEffect(() => {
    placeRef.current(1)
  }, [])

  useFrame((_, delta) => {
    placeRef.current(easeAlpha(delta))
  })

  return (
    <group ref={group}>
      <mesh ref={shaft}>
        <boxGeometry args={[1, 1, 1]} />
        <PartMaterial materialRef={shaftMaterial} color={color} />
      </mesh>
      <mesh ref={head}>
        <coneGeometry args={[0.5, 1, 16]} />
        <PartMaterial materialRef={headMaterial} color={color} />
      </mesh>
      <group ref={labelAnchor}>
        <PartLabel text={label} fields={fields} step={step} emphasis={numberAt(emphasis, step, 1)} />
      </group>
    </group>
  )
}
