"use client"

import { X, Layers, Info, Image, Droplets, Maximize2, Network, Target, Plus, Grid3x3, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { KeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts"
import type { Layer, StemLayer } from "@/lib/types"
import { getColorTheme, getLayerColorTheme } from "@/lib/utils"
import { getFieldLabel, getFieldOrder, getValueLabel } from "@/lib/fieldMapping"
import { formatFieldValue } from "@/lib/hooks/nodeRender"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  selectedNode?: Layer | null
}

// 获取层类型图标
function getLayerIcon(type: string) {
  const iconMap: Record<string, any> = {
    input: Image,
    conv2d: Layers,
    conv3d: Layers,
    maxpool2d: Droplets,
    avgpool2d: Droplets,
    maxpool3d: Droplets,
    avgpool3d: Droplets,
    global_avgpool: Droplets,
    global_maxpool: Droplets,
    adaptive_avgpool: Droplets,
    adaptive_maxpool: Droplets,
    flatten: Maximize2,
    dense: Network,
    dropout: Grid3x3,
    batchnorm: Layers,
    batchnorm2d: Layers,
    batchnorm3d: Layers,
    layernorm: Layers,
    groupnorm: Layers,
    instancenorm: Layers,
    stem: Package,
    add: Plus,
    concat: Plus,
    multiply: Plus,
    output: Target,
  }
  return iconMap[type]
}

// 提取层的参数信息（使用与 Node 相同的逻辑）
function extractLayerParams(layer: Layer): Array<{ label: string; value: string; isHighlight?: boolean }> {
  const params: Array<{ label: string; value: string; isHighlight?: boolean }> = []
  const fieldOrder = getFieldOrder(layer.type)
  const anyLayer = layer as any
  
  // 高亮字段列表（只有输出形状和输入形状使用当前层配色）
  const HIGHLIGHT_FIELDS = ["outputShape", "shape"]

  for (const fieldKey of fieldOrder) {
    const value = anyLayer[fieldKey]
    
    // 跳过 undefined/null 值
    if (value === undefined || value === null) {
      continue
    }

    const label = getFieldLabel(fieldKey)
    const formattedValue = formatFieldValue(fieldKey, value)

    // 如果格式化后的值为空，跳过
    if (!formattedValue) {
      continue
    }

    // 检查是否需要高亮显示
    const isHighlight = HIGHLIGHT_FIELDS.includes(fieldKey)

    params.push({ 
      label, 
      value: formattedValue, 
      isHighlight 
    })
  }

  return params
}


export function Sidebar({ isOpen, onClose, selectedNode }: SidebarProps) {
  const Icon = selectedNode ? getLayerIcon(selectedNode.type) : Info
  const params = selectedNode ? extractLayerParams(selectedNode) : []
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
          fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 bg-background border-l border-border
          transform transition-transform duration-300 ease-in-out z-50
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          lg:fixed lg:top-16
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-lg ${theme?.background}/10`}>
                <Icon className={`h-4 w-4`} />
              </div>
              <h2 className={`font-semibold text-lg ${theme?.textHighlight}`}>
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
                  <p className="text-sm text-muted-foreground">
                    type: <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{selectedNode.type}</code>
                  </p>
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
                          layerType={selectedNode.type}
                          layer={selectedNode}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Stem 层的详细结构 */}
                {selectedNode.type === "stem" && (selectedNode as StemLayer).steps && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3">包含的子层</h4>
                    <StemLayerStructure 
                      layer={selectedNode as StemLayer}
                    />
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

// 参数行组件（与 Node 样式保持一致）
function ParamRow({ 
  label, 
  value, 
  isHighlight = false,
  layerType,
  layer
}: { 
  label: string
  value: string
  isHighlight?: boolean
  layerType: string
  layer: Layer
}) {
  // 使用 getLayerColorTheme 正确处理 stem 层的自定义颜色
  const highlightColor = isHighlight ? getLayerColorTheme(layer).textHighlight : 'text-foreground'
  
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-muted/50">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-semibold ${highlightColor}`}>
        {value}
      </span> 
    </div>
  )
}

// Stem 层结构展示组件
function StemLayerStructure({ 
  layer
}: { 
  layer: StemLayer
}) {
  const steps = layer.steps || []
  // 使用统一的颜色配置（支持自定义颜色）
  const theme = getLayerColorTheme(layer)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className={`bg-gradient-to-r ${theme.head} px-3 py-2 border-b ${theme.border}`}>
        <span className={`text-sm font-semibold ${theme.textHighlight}`}>
          {steps.length} 个步骤
        </span>
      </div>
      <div className="p-3 space-y-3 bg-muted/30">
        {steps.map((subLayer: Layer, index: number) => (
          <StemLayerItem 
            key={index}
            layer={subLayer} 
            index={index}
          />
        ))}
      </div>
    </div>
  )
}

// Stem 子层项目组件
function StemLayerItem({ 
  layer, 
  index
}: { 
  layer: Layer
  index: number
}) {
  const params = extractLayerParams(layer)
  const layerTheme = getColorTheme(layer.type)
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
              <span className={`font-semibold ${param.isHighlight ? getColorTheme(layer.type).textHighlight : 'text-foreground'}`}>
                {param.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

