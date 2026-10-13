// Shared slide part. Extend this file in place. Keep a single copy for the whole deck.
import { SolidPart } from './SolidPart'
import type { PartProps } from './story'

export function Box(props: PartProps) {
  return (
    <SolidPart {...props}>
      <boxGeometry args={[1, 1, 1]} />
    </SolidPart>
  )
}
