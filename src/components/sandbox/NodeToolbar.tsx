/**
 * NodeToolbar - 节点类型工具栏
 * 
 * 功能说明：
 * - 左侧固定侧边栏，按功能分类展示所有可用的层类型
 * - 支持拖拽节点类型到画布添加节点
 * - 支持点击节点类型后在画布中心添加节点
 * - 节点添加时使用指定位置，不会触发自动重新布局
 * - 分类可展开/折叠，方便查找节点类型
 */

"use client"

import { useCallback, useState } from "react"
import { getLayerIcon, getNodeTypeName } from "@/lib/utils"
import { getLayerColorTheme } from "@/lib/theme"
import { createNodeByType } from "@/lib/nodeFactory"
import { useSandboxStore } from "@/lib/sandboxStore"
import type { LayerType, Layer } from "@/lib/types"
import { ChevronDown, ChevronRight } from "lucide-react"

/**
 * 节点类型分类
 */
interface NodeCategory {
  name: string
  types: LayerType[]
}

const NODE_CATEGORIES: NodeCategory[] = [
  {
    name: "输入",
    types: ["input", "embedding"],
  },
  {
    name: "卷积",
    types: ["conv2d"],
  },
  {
    name: "池化",
    types: ["maxpool2d", "avgpool2d", "adaptiveavgpool2d"],
  },
  {
    name: "归一化",
    types: ["batchnorm", "layernorm", "lrn"],
  },
  {
    name: "激活",
    types: ["relu", "sigmoid", "tanh", "softmax"],
  },
  {
    name: "全连接",
    types: ["linear"],
  },
  {
    name: "正则化",
    types: ["dropout"],
  },
  {
    name: "计算",
    types: ["flatten", "add", "concat"],
  },
  {
    name: "注意力",
    types: ["self-attention", "cross-attention"],
  },
  {
    name: "模块",
    types: ["sequential", "parallel"],
  },
]

interface NodeToolbarProps {
  className?: string
}

/**
 * NodeToolbar - 节点类型工具栏
 * 左侧固定侧边栏，按功能分类展示所有可用层类型，支持拖拽和点击添加
 */
export function NodeToolbar({ className = "" }: NodeToolbarProps) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(NODE_CATEGORIES.map((cat) => cat.name))
  )
  const addLayer = useSandboxStore((state) => state.addLayer)
  const setNodePosition = useSandboxStore((state) => state.setNodePosition)
  const [draggedType, setDraggedType] = useState<LayerType | null>(null)

  // 切换分类展开/折叠
  const toggleCategory = useCallback((categoryName: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(categoryName)) {
        next.delete(categoryName)
      } else {
        next.add(categoryName)
      }
      return next
    })
  }, [])

  // 添加节点到画布中心位置（点击添加）
  const handleAddNode = useCallback(
    (type: LayerType) => {
      const newNode = createNodeByType(type)
      addLayer(newNode)
      const centerPosition = { x: 400, y: 300 }
      setNodePosition(newNode.id, centerPosition)
    },
    [addLayer, setNodePosition]
  )

  // 拖拽开始
  const handleDragStart = useCallback(
    (event: React.DragEvent, type: LayerType) => {
      setDraggedType(type)
      event.dataTransfer.effectAllowed = "copy"
      event.dataTransfer.setData("application/reactflow", type)
    },
    []
  )

  // 拖拽结束
  const handleDragEnd = useCallback(() => {
    setDraggedType(null)
  }, [])

  return (
    <div
      className={`h-full bg-background border-r border-border overflow-y-auto scrollbar-thin ${className}`}
    >
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">节点类型</h2>
        <div className="space-y-2">
          {NODE_CATEGORIES.map((category) => {
            const isExpanded = expandedCategories.has(category.name)
            const Icon = isExpanded ? ChevronDown : ChevronRight

            return (
              <div key={category.name} className="border border-border rounded-lg">
                {/* 分类标题 */}
                <button
                  onClick={() => toggleCategory(category.name)}
                  className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <span className="font-medium text-sm">{category.name}</span>
                  <Icon className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* 分类内容 */}
                {isExpanded && (
                  <div className="p-2 space-y-1">
                    {category.types.map((type) => {
                      const isDragging = draggedType === type
                      
                      // 创建模拟 Layer 对象用于获取图标和主题
                      const mockLayer: Layer = {
                        id: "",
                        name: "",
                        type: type,
                      } as Layer
                      const NodeIcon = getLayerIcon(mockLayer)
                      const theme = getLayerColorTheme(mockLayer)

                      return (
                        <div
                          key={type}
                          draggable
                          onDragStart={(e) => handleDragStart(e, type)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleAddNode(type)}
                          className={`
                            flex items-center justify-center gap-2 px-3 py-2 rounded-md
                            cursor-pointer transition-all
                            border
                            ${isDragging ? "opacity-50" : ""}
                          `}
                          style={{
                            backgroundColor: theme?.background || "transparent",
                            borderColor: theme?.border || "transparent",
                            color: theme?.text || "inherit",
                          }}
                          onMouseEnter={(e) => {
                            if (!isDragging) {
                              e.currentTarget.style.backgroundColor = theme?.backgroundHover || theme?.background || "rgba(0,0,0,0.05)"
                              e.currentTarget.style.borderColor = theme?.borderSelected || theme?.border || "transparent"
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isDragging) {
                              e.currentTarget.style.backgroundColor = theme?.background || "transparent"
                              e.currentTarget.style.borderColor = theme?.border || "transparent"
                            }
                          }}
                        >
                          <NodeIcon 
                            className="w-4 h-4" 
                            style={{ color: theme?.textHighlight || theme?.text || "inherit" }}
                          />
                          <span className="text-sm font-medium">{getNodeTypeName(type)}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

