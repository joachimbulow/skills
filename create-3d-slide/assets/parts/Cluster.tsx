// Shared slide part. Extend this file in place. Keep a single copy for the whole deck.
import type { ReactNode } from 'react'
import { SolidPart } from './SolidPart'
import type { PartProps } from './story'

type ClusterProps = PartProps & {
  children?: ReactNode
}

export function Cluster({ children, position, rotation, ...props }: ClusterProps) {
  return (
    <group position={position} rotation={rotation}>
      <SolidPart {...props} wireframe fallback={[2, 2, 2]} color={props.color ?? '#94a3b8'}>
        <boxGeometry args={[1, 1, 1]} />
      </SolidPart>
      {children}
    </group>
  )
}
