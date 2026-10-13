// Shared slide part. Extend this file in place. Keep a single copy for the whole deck.
import { SolidPart } from './SolidPart'
import type { PartProps } from './story'

export function Cylinder(props: PartProps) {
  return (
    <SolidPart {...props} color={props.color ?? '#64748b'}>
      <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
    </SolidPart>
  )
}
