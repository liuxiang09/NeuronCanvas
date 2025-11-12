"use client"

import { X, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts"
import type { Layer, SequentialLayer, ParallelLayer } from "@/lib/types"
import { getLayerColorTheme } from "@/lib/theme"
import { getLayerIcon, getLayerParams } from "@/lib/fieldMapping"
import { formatFieldValue } from "@/lib/fieldMapping"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedNode?: Layer | null
}

export function Sidebar({ isOpen, onClose, selectedNode }: SidebarProps) {
  const Icon = selectedNode ? getLayerIcon(selectedNode.type) : Info
  const params = selectedNode ? getLayerParams(selectedNode) : []
  const theme = selectedNode ? getLayerColorTheme(selectedNode) : null
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 right-0 h-[calc(100vh-4rem)] bg-background border-l border-border
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:fixed lg:top-16
        `}
        style={{ width: "26rem", minWidth: "20rem", maxWidth: "40rem" }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${theme?.background || 'bg-gray-500/10'}`}>
                <Icon className={`h-4 w-4 ${theme?.textHighlight || 'text-gray-500'}`} />
              </div>
              <h2 className={`font-semibold text-lg ${theme?.textHighlight || 'text-foreground'}`}>
                {selectedNode ? '层详情' : '等待选择'}
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-thin">
            {!selectedNode ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Info className="h-12 w-12 mb-3 opacity-50" />
                <p className="text-sm">
                  点击画布上的节点
                  <br />
                  查看详细信息
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 层名称和类型 */}
                <div>
                  <h3 className="text-xl font-bold mb-1">{selectedNode.name}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <span>类型:</span>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{selectedNode.type}</code>
                  </div>
                </div>

                {/* 渐变分隔线 */}
                <div className={`h-1 rounded-full bg-gradient-to-r ${theme?.head}`} />

                {/* 描述 */}
                {selectedNode.description && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">描述</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedNode.description}
                    </p>
                  </div>
                )}

                {/* 参数详情 */}
                {params.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">参数详情</h4>
                    <div className="space-y-2">
                      {params.map((param, index) => (
                        <ParamRow 
                          key={index}
                          label={param.label} 
                          value={param.value} 
                          isHighlight={param.isHighlight}
                          layer={selectedNode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sequential 层的详细结构 */}
                {selectedNode.type === "sequential" && (selectedNode as SequentialLayer).steps && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">线性结构</h4>
                    <SequentialLayerStructure 
                      layer={selectedNode as SequentialLayer}
                    />
                  </div>
                )}
                {selectedNode.type === "parallel" && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">并行分支</h4>
                    <ParallelLayerStructure layer={selectedNode as ParallelLayer} />
                  </div>
                )}
              </div>
            )}

            {/* 键盘快捷键 */}
            <div className="pt-4 border-t border-border mt-4">
              <KeyboardShortcuts />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}

// ============================================================================
// Sidebar 内部组件
// ============================================================================

/**
 * 参数行组件（与 Node 样式保持一致）
 */
function ParamRow({ 
  label, 
  value, 
  isHighlight = false,
  layer,
}: { 
  label: string
  value: string
  isHighlight?: boolean
  layer: Layer
}) {
  const highlightColor = isHighlight ? getLayerColorTheme(layer).textHighlight : "text-foreground"

  const shapeParts = value.split("|").map((part) => part.trim()).filter(Boolean)
  const isShapeValue = label.includes("形状") && (value.includes("×") || value.includes("|"))
  const parts = value.split("|").map((part) => part.trim()).filter(Boolean)
  
  return (
    <div className="py-2 px-3 rounded-lg bg-muted/50 space-y-1.5">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div
        className={`text-base font-semibold ${
          isHighlight ? highlightColor : "text-foreground"
        } ${isShapeValue ? "font-mono" : ""} text-right leading-relaxed space-y-1`}
      >
        {isShapeValue
          ? shapeParts.map((part, index) => <div key={index}>{part}</div>)
          : value}
      </div>
    </div>
  )
}

/**
 * Sequential 层结构展示组件
 */
function SequentialLayerStructure({ 
  layer
}: { 
  layer: SequentialLayer
}) {
  const steps = layer.steps || []
  const theme = getLayerColorTheme(layer)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className={`bg-gradient-to-r ${theme.head} px-3 py-2 border-b ${theme.border}`}>
        <span className={`text-sm font-semibold text-white`}>
          {steps.length} 个步骤
        </span>
      </div>
      <div className="p-3 space-y-3 bg-muted/30">
        {steps.map((subLayer: Layer, index: number) => (
          <SequentialLayerItem 
            key={index}
            layer={subLayer} 
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * 并行节点结构展示
 */
function ParallelLayerStructure({
  layer,
}: {
  layer: ParallelLayer
}) {
  const branches = layer.branches || []
  const theme = getLayerColorTheme(layer)

  if (branches.length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        未提供并行分支信息
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {branches.map((branch, branchIndex) => {
        const branchTheme = branch.color
          ? getLayerColorTheme({
              ...layer,
              type: "parallel",
              color: branch.color,
            } as any)
          : theme

        const branchOutput =
          branch.outputShape ??
          (Array.isArray(layer.outputShape) ? layer.outputShape[branchIndex] : undefined)

        return (
          <div
            key={branch.id || branchIndex}
            className="border border-border rounded-lg overflow-hidden"
          >
            <div className={`px-3 py-2 bg-gradient-to-r ${branchTheme.head}`}>
              <div className="flex items-center justify-between text-white text-sm font-semibold">
                <span>
                  {branch.name || `分支 ${branchIndex + 1}`}
                </span>
                {branchOutput && (
                  <span className="text-xs opacity-80">
                    {formatFieldValue("outputShape", branchOutput)}
                  </span>
                )}
              </div>
            </div>

            {branch.steps && branch.steps.length > 0 ? (
              <div className="p-3 space-y-3 bg-muted/30">
                {branch.steps.map((step: Layer, idx: number) => (
                  <SequentialLayerItem
                    key={step.id || `${branchIndex}-${idx}`}
                    layer={step}
                    index={idx}
                  />
                ))}
              </div>
            ) : (
              <div className="p-3 text-xs text-muted-foreground bg-muted/30">
                此分支未定义具体步骤
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

/**
 * Sequential 子层项目组件
 */
function SequentialLayerItem({ 
  layer, 
  index
}: { 
  layer: Layer
  index: number
}) {
  const params = getLayerParams(layer)
  const layerTheme = getLayerColorTheme(layer)
  const Icon = getLayerIcon(layer.type)

  return (
    <div className="bg-background rounded-md border border-border overflow-hidden">
      {/* 子层头部 */}
      <div className={`bg-gradient-to-r ${layerTheme.head} px-3 py-2 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <Icon className="w-3.5 h-3.5 text-white" />
          <span className="text-xs font-semibold text-white">
            {index + 1}. {layer.name}
          </span>
        </div>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono">
          {layer.type}
        </span>
      </div>
      
      {/* 子层参数 */}
      {params.length > 0 && (
        <div className="p-3 space-y-1.5 bg-muted/30">
          {params.map((param, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{param.label}:</span>
              <span className={`font-semibold ${param.isHighlight ? layerTheme.textHighlight : 'text-foreground'}`}>
                {param.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

