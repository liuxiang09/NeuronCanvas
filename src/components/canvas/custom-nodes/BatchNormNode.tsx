import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Layers } from "lucide-react"
import type { Layer } from "@/lib/types"
import { getColorTheme } from "@/lib/utils"

interface BatchNormNodeProps {
  data: Layer
  selected?: boolean
}

export const BatchNormNode = memo(({ data, selected }: BatchNormNodeProps) => {
  const theme = getColorTheme(data.type)
  
  // 获取归一化类型显示名称
  const getNormName = (type: string) => {
    const nameMap: Record<string, string> = {
      batchnorm: "Batch Norm",
      batchnorm2d: "Batch Norm 2D",
      batchnorm3d: "Batch Norm 3D",
      layernorm: "Layer Norm",
      instancenorm: "Instance Norm",
      groupnorm: "Group Norm",
    }
    return nameMap[type] || "Normalization"
  }
  
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
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-lg ${theme.background}`}>
            <Layers className={`w-4 h-4 ${theme.textHighlight}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{data.type}</p>
          </div>
        </div>

        {/* 归一化类型 */}
        <div className={`mt-3 p-2 rounded-lg ${theme.backgroundHover} border ${theme.border}/20`}>
          <div className="text-center">
            <div className={`text-sm font-semibold ${theme.textHighlight}`}>
              {getNormName(data.type)}
            </div>
          </div>
        </div>
      </div>

      {/* 输出 Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 ${theme.handle} !border-2 !border-white`}
      />
    </div>
  )
})

BatchNormNode.displayName = "BatchNormNode"
