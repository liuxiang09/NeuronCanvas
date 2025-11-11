import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Package, Layers } from "lucide-react"
import type { StemLayer, Layer } from "@/lib/types"
import { getColorTheme, getLayerColorTheme } from "@/lib/utils"
import { renderLayerFields } from "@/lib/hooks/nodeRender"

interface StemNodeProps {
  data: StemLayer
  selected?: boolean
}

export const StemNode = memo(({ data, selected }: StemNodeProps) => {
  
  // 使用统一的颜色配置系统（支持自定义颜色）
  const theme = getLayerColorTheme(data)
  const steps = data.steps || []
  
  return (
    <div
      className={`
        relative group
        w-[320px] min-h-[180px]
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
      <div className="p-4 space-y-3">
        {/* 标题 */}
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-lg ${theme.background}`}>
            <Package className={`w-4 h-4`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{data.name}</h3>
            <p className="text-xs text-muted-foreground">{data.type}</p>
          </div>
        </div>

        {/* 包含的子层列表 */}
        {steps.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>包含步骤:</span>
            </div>
            <div className={`space-y-1.5 pl-2 border-l-2 ${theme.textHighlight}`}>
              {steps.map((layer: Layer, index: number) => {
                const layerTheme = getColorTheme(layer.type)
                // 提取输出形状(如果存在)
                const outputShape = 'outputShape' in layer ? layer.outputShape : undefined
                
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs"
                  >
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${layerTheme.head}`} />
                    <span className="font-medium">{layer.type}</span>
                    {outputShape && (
                      <span className="text-muted-foreground ml-auto">
                        {outputShape.join("×")}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 输出形状 - 使用 renderLayerFields 统一渲染 */}
        {renderLayerFields(data, theme.color)}
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

StemNode.displayName = "StemNode"
