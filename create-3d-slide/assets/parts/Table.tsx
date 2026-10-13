// Shared slide part. Extend this file in place. Keep a single copy for the whole deck.
import { useRef } from 'react'
import * as THREE from 'three'
import { Box } from './Box'
import { PartLabel } from './PartLabel'
import { numberAt, useStoryMotion, type PartField, type PartProps, type Size } from './story'

type Cell = {
  row: number
  column: number
  label?: string
  fields?: PartField[]
  size?: Size
  emphasis?: number | readonly number[]
  color?: string
}

type TableProps = PartProps & {
  rows: number
  columns: number
  gap?: number
  cells?: Cell[]
}

export function Table({
  step,
  size,
  emphasis,
  color = '#334155',
  label,
  fields,
  position,
  rotation,
  rows,
  columns,
  gap = 0.35,
  cells = [],
}: TableProps) {
  const group = useRef<THREE.Group>(null)
  useStoryMotion(group, null, step, size, emphasis)
  const rowCount = Math.max(1, Math.floor(rows))
  const columnCount = Math.max(1, Math.floor(columns))
  const pitch = 1 + gap
  const byKey = new Map(cells.map((cell) => [`${cell.row}:${cell.column}`, cell]))

  return (
    <group position={position} rotation={rotation}>
      <group ref={group}>
        {Array.from({ length: rowCount }, (_, row) =>
          Array.from({ length: columnCount }, (_, column) => {
            const cell = byKey.get(`${row}:${column}`)
            const x = (column - (columnCount - 1) / 2) * pitch
            const y = ((rowCount - 1) / 2 - row) * pitch
            return (
              <Box
                key={`${row}-${column}`}
                step={step}
                position={[x, y, 0]}
                size={cell?.size ?? [0.92, 0.72, 0.28]}
                emphasis={cell?.emphasis ?? emphasis ?? 0.4}
                color={cell?.color ?? color}
                label={cell?.label}
                fields={cell?.fields}
              />
            )
          }),
        )}
      </group>
      <PartLabel text={label} fields={fields} step={step} emphasis={numberAt(emphasis, step, 1)} />
    </group>
  )
}
