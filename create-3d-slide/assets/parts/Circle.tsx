// Shared slide part. Extend this file in place. Keep a single copy for the whole deck.
import { SolidPart } from './SolidPart'
import { numberAt, type PartProps } from './story'

type CircleProps = PartProps & {
  thickness?: number | readonly number[]
  arc?: number | readonly number[]
}

export function Circle({ thickness, arc, ...props }: CircleProps) {
  const thick = numberAt(thickness, props.step, 0)
  const arcNow = numberAt(arc, props.step, 1)
  const inner = thick <= 0 ? 0 : 0.5 * Math.min(thick, 0.92)
  const theta = Math.max(arcNow, 0.02) * Math.PI * 2

  return (
    <SolidPart {...props} color={props.color ?? '#38bdf8'} doubleSide>
      {inner === 0 ? (
        <circleGeometry args={[0.5, 64, 0, theta]} />
      ) : (
        <ringGeometry args={[inner, 0.5, 64, 1, 0, theta]} />
      )}
    </SolidPart>
  )
}
