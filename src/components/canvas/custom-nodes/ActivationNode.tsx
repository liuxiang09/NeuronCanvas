import { memo } from "react"
import { Handle, Position } from "reactflow"
import type { Layer } from "@/lib/types"
import { getLayerColorTheme } from "@/lib/theme"
import { renderLayerFields } from "@/lib/hooks/nodeRender"
import { ICON_MAP } from "@/lib/fieldMapping"

interface ActivationNodeProps {
  data: Layer
  selected?: boolean
}

export const ActivationNode = memo(({ data, selected }: ActivationNodeProps) => {
  const theme = getLayerColorTheme(data)
  const Icon = ICON_MAP[data.type]

  return (
    <div
      className={`
        relative group
        min-w-[240px] min-h-[120px]
        rounded-xl border-2 
        bg-background
        shadow-lg
        transition-all duration-300
        ${selected ? theme.borderSelected : theme.borderUnselected}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className={`!w-3 !h-3 ${theme.handle} !border-2 !border-white`}
      />

      <div className={`h-2 rounded-t-lg bg-gradient-to-r ${theme.head}`} />

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${theme.background}`}>
            <Icon className={`w-4 h-4 ${theme.textHighlight}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{data.type}</p>
          </div>
        </div>

        {renderLayerFields(data, theme)}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 ${theme.handle} !border-2 !border-white`}
      />

      <div className="absolute bottom-2 right-2 opacity-5">
        <Icon className={`w-12 h-12 ${theme.textHighlight}`} />
      </div>

      <div
        className={`absolute inset-0 rounded-xl ${theme.backgroundHover} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />
    </div>
  )
})


