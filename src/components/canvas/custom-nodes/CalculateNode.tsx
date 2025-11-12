import { memo, type ComponentType } from "react"
import { Handle, Position } from "reactflow"
import { Plus, GitMerge, Maximize2 } from "lucide-react"
import type { Layer } from "@/lib/types"
import { getLayerColorTheme } from "@/lib/theme"
import { renderLayerFields } from "@/lib/hooks/nodeRender"

const TYPE_ICON_MAP: Record<string, ComponentType<{ className?: string }>> = {
  add: Plus,
  concat: GitMerge,
  flatten: Maximize2,
}

interface CalculateNodeProps {
  data: Layer
  selected?: boolean
}

export const CalculateNode = memo(({ data, selected }: CalculateNodeProps) => {
  const theme = getLayerColorTheme(data)
  const Icon = TYPE_ICON_MAP[data.type]
  const label = data.type ?? "null"

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
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-1.5 rounded-lg ${theme.background}`}>
            <Icon className={`w-4 h-4 ${theme.textHighlight}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        </div>

        {renderLayerFields(data, theme)}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 ${theme.handle} !border-2 !border-white`}
      />
      {/* 装饰性图标 */}
      <div className="absolute bottom-2 right-2 opacity-5">
        <Icon className={`w-12 h-12 ${theme.textHighlight}`} />
      </div>
      {/* 悬浮效果 */}
      <div className={`absolute inset-0 rounded-xl ${theme.backgroundHover} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
    </div>
  )
})

