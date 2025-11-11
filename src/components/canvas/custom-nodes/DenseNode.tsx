import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Network } from "lucide-react"
import type { DenseLayer } from "@/lib/types"
import { getColorTheme } from "@/lib/utils"
import { renderLayerFields } from "@/lib/hooks/nodeRender"

interface DenseNodeProps {
  data: DenseLayer
  selected?: boolean
}

export const DenseNode = memo(({ data, selected }: DenseNodeProps) => {
  const theme = getColorTheme(data.type)
  
  return (
    <div
      className={`
        relative group
        w-[240px] min-h-[120px]
        rounded-xl border-2 
        bg-background
        shadow-lg
        transition-all duration-300
        ${selected ? theme.borderSelected : theme.borderUnselected}
      `}
    >
      {/* 输入 Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className={`!w-3 !h-3 ${theme.handle} !border-2 !border-white`}
      />

      {/* 头部渐变条 */}
      <div className={`h-2 rounded-t-lg bg-gradient-to-r ${theme.head}`} />

      {/* 内容区域 */}
      <div className="p-4">
        {/* 标题区 */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`p-1.5 rounded-lg ${theme.background}`}>
            <Network className={`w-4 h-4 ${theme.textHighlight}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{data.type}</p>
          </div>
        </div>

        {/* 参数信息 */}
        {renderLayerFields(data, "pink")}
      </div>

      {/* 输出 Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 ${theme.handle} !border-2 !border-white`}
      />

      {/* Hover 发光效果 */}
      <div className={`absolute inset-0 rounded-xl ${theme.backgroundHover} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
    </div>
  )
})

DenseNode.displayName = "DenseNode"
