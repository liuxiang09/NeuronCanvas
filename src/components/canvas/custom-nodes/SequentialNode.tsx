import { memo } from "react"
import { Handle, Position } from "reactflow"
import { Layers } from "lucide-react"
import type { SequentialLayer, Layer } from "@/lib/types"
import { getLayerColorTheme } from "@/lib/theme"
import { renderLayerFields } from "@/lib/hooks/nodeRender"
import { ICON_MAP, formatFieldValue } from "@/lib/fieldMapping"

interface SequentialNodeProps {
  data: SequentialLayer
  selected?: boolean
}

export const SequentialNode = memo(({ data, selected }: SequentialNodeProps) => {
  const theme = getLayerColorTheme(data)
  const steps = data.steps || []
  const Icon = ICON_MAP[data.type]

  return (
    <div
      className={`
        relative group
        min-w-[320px] min-h-[180px] w-auto
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
      <div className="p-4 h-[calc(100%-8px)]">
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${theme.background}`}>
              <Icon className={`w-4 h-4 ${theme.textHighlight}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{data.name}</h3>
              <p className="text-xs text-muted-foreground">{data.type}</p>
            </div>
          </div>

          {steps.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Layers className="w-3.5 h-3.5" />
                <span>包含步骤 ({steps.length}):</span>
              </div>
              <div className="space-y-1.5 pl-2 border-l border-border text-muted-foreground flex-1 overflow-auto">
                {steps.map((step: Layer, index: number) => {
                  const layerTheme = getLayerColorTheme(step)
                  const outputShape = 'outputShape' in step ? step.outputShape : undefined
                  
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${layerTheme.head}`} />
                      <span className="font-medium">{step.type}</span>
                      {outputShape && (
                        <span className="text-muted-foreground ml-auto whitespace-pre">
                          {Array.isArray(outputShape)
                            ? formatFieldValue("outputShape", outputShape)
                            : String(outputShape)}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="flex-1" />
          {renderLayerFields(data, theme)}
        </div>
      </div>

      {/* 输出 Handle */}
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

