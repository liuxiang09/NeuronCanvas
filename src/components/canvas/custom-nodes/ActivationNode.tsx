import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Zap } from "lucide-react"
import type { ActivationLayer } from "@/lib/types"
import { getLayerColorTheme } from "@/lib/theme"
import { renderLayerFields } from "@/lib/hooks/nodeRender"

interface ActivationNodeProps {
  data: ActivationLayer
  selected?: boolean
}

export const ActivationNode = memo(({ data, selected }: ActivationNodeProps) => {
  const theme = getLayerColorTheme(data)

  return (
    <div
      className={`
        relative group
        w-[220px] min-h-[100px]
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
            <Zap className={`w-4 h-4 ${theme.textHighlight}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{data.name}</h3>
            <p className="text-xs text-muted-foreground">
              {data.type}
            </p>
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
        <Zap className={`w-12 h-12 ${theme.textHighlight}`} />
      </div>

      <div
        className={`absolute inset-0 rounded-xl ${theme.backgroundHover} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`}
      />
    </div>
  )
})


