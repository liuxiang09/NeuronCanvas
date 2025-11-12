import { memo } from "react"
import { Handle, Position } from "reactflow"
import { GitBranch, Layers } from "lucide-react"
import type { Layer, ParallelLayer } from "@/lib/types"
import { getLayerColorTheme } from "@/lib/theme"
import { renderLayerFields } from "@/lib/hooks/nodeRender"
import { formatFieldValue } from "@/lib/fieldMapping"

interface ParallelNodeProps {
  data: ParallelLayer
  selected?: boolean
}

export const ParallelNode = memo(({ data, selected }: ParallelNodeProps) => {
  const theme = getLayerColorTheme(data)
  const branches = data.branches || []

  const renderStep = (step: Layer, index: number) => {
    const stepTheme = getLayerColorTheme(step)
    const outputShape =
      ("outputShape" in step && step.outputShape) ? (step as any).outputShape : undefined

    return (
      <div
        key={`${step.id || step.name || step.type}-${index}`}
        className="flex items-center gap-2 text-xs"
      >
        <div className={`w-2 h-2 rounded-full bg-gradient-to-br ${stepTheme.head}`} />
        <span className="font-medium">{step.name || step.type}</span>
        {outputShape && (
          <span className="text-muted-foreground ml-auto whitespace-pre">
            {Array.isArray(outputShape)
              ? formatFieldValue("outputShape", outputShape)
              : String(outputShape)}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      className={`
        relative group
        min-w-[320px] min-h-[200px] w-auto
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

      <div className="p-4 h-[calc(100%-8px)]">
        <div className="flex flex-col h-full space-y-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${theme.background}`}>
              <GitBranch className={`w-4 h-4 ${theme.textHighlight}`} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{data.name}</h3>
              <p className="text-xs text-muted-foreground">{data.type}</p>
            </div>
          </div>

          {branches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Layers className="w-3.5 h-3.5" />
                <span>包含分支 ({branches.length})：</span>
              </div>

              <div className="space-y-2 flex-1 overflow-auto">
                {branches.map((branch, branchIndex) => {
                  const branchName =
                    branch.name || `分支 ${branchIndex + 1}`
                  return (
                    <div
                      key={branch.id || branchName || branchIndex}
                      className="rounded-lg border border-border bg-muted/40 px-3 py-2 space-y-1.5"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                        <span>{branchName}</span>
                      </div>

                      {branch.steps && branch.steps.length > 0 && (
                        <div className="space-y-1.5 pl-2 border-l border-border">
                          {branch.steps.map((step, stepIndex) => renderStep(step, stepIndex))}
                        </div>
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

      <Handle
        type="source"
        position={Position.Right}
        className={`!w-3 !h-3 ${theme.handle} !border-2 !border-white`}
      />
      {/* 装饰性图标 */}
      <div className="absolute bottom-2 right-2 opacity-5">
        <GitBranch className={`w-12 h-12 ${theme.textHighlight}`} />
      </div>
      {/* 悬浮效果 */}
      <div className={`absolute inset-0 rounded-xl ${theme.backgroundHover} opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none`} />
    </div>
  )
})


