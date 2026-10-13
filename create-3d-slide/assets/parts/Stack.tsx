// Shared slide part. Extend this file in place. Keep a single copy for the whole deck.
import { Box } from './Box'
import { sizeAt, numberAt, type PartProps, type Vec3 } from './story'

type StackProps = PartProps & {
  count: number
  gap?: number
  axis?: 'x' | 'y' | 'z'
  active?: number | readonly number[]
}

export function Stack({
  step,
  size,
  color = '#60a5fa',
  label,
  fields,
  position,
  rotation,
  count,
  gap = 0.18,
  axis = 'y',
  active,
}: StackProps) {
  const layerCount = Math.max(1, Math.floor(count))
  const activeIndex = Math.min(layerCount - 1, Math.max(0, Math.round(numberAt(active, step, 0))))
  const [width, height, depth] = sizeAt(size, step, [1, 0.35, 1])
  const span = axis === 'x' ? width : axis === 'z' ? depth : height
  const pitch = span + gap

  return (
    <group position={position} rotation={rotation}>
      {Array.from({ length: layerCount }, (_, index) => {
        const offset = (index - (layerCount - 1) / 2) * pitch
        const layerPosition: Vec3 =
          axis === 'x' ? [offset, 0, 0] : axis === 'z' ? [0, 0, offset] : [0, offset, 0]
        const focused = index === activeIndex
        return (
          <Box
            key={index}
            step={step}
            position={layerPosition}
            size={size ?? [1, 0.35, 1]}
            emphasis={focused ? 1 : 0.28}
            color={color}
            label={focused ? label : undefined}
            fields={focused ? fields : undefined}
          />
        )
      })}
    </group>
  )
}
