// Shared label for slide parts. Import this. Do not copy it into a slide.
import { Html } from '@react-three/drei'
import { numberAt, type PartField } from './story'

const chipStyle = {
  background: 'rgba(15, 23, 42, 0.78)',
  border: '1px solid rgba(255,255,255,0.16)',
  borderRadius: 8,
  padding: '6px 8px',
  color: '#f8fafc',
  fontSize: 12,
  lineHeight: 1.35,
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
  whiteSpace: 'nowrap' as const,
}

type PartLabelProps = {
  text?: string
  fields?: PartField[]
  step?: number
  emphasis?: number
}

export function PartLabel({ text, fields, step = 0, emphasis = 1 }: PartLabelProps) {
  if (!text && !fields?.length) return null

  return (
    <Html center distanceFactor={8} style={{ pointerEvents: 'none' }}>
      <div style={{ ...chipStyle, opacity: 0.45 + emphasis * 0.55 }}>
        {text ? <div style={{ fontWeight: 650 }}>{text}</div> : null}
        {fields?.map((field, index) => {
          const fieldEmphasis = numberAt(field.emphasis, step, emphasis)
          const focused = fieldEmphasis > 0.6
          return (
            <div
              key={`${field.label}-${index}`}
              style={{ color: focused ? '#f8fafc' : '#94a3b8', fontWeight: focused ? 650 : 450 }}
            >
              {field.value ? `${field.label}  ${field.value}` : field.label}
            </div>
          )
        })}
      </div>
    </Html>
  )
}
