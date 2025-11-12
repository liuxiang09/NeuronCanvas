"use client"

import { useCallback, useMemo, useEffect, useRef } from "react"
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  type Node,
  type Edge,
} from "reactflow"
import "reactflow/dist/style.css"
import { Info, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore } from "@/lib/store"

// 导入节点和边的映射配置
import { nodeComponents } from "./custom-nodes"
import { edgeComponents } from "./custom-edges"
import { getLayerColorTheme } from "@/lib/theme"
import type { Layer } from "@/lib/types"

interface ModelCanvasProps {
  nodes: Node[]
  edges: Edge[]
  onNodeClick?: (node: Node) => void
  className?: string
  modelName?: string
}

/**
 * ModelCanvas - 核心画布组件
 * 使用 React Flow 渲染神经网络架构
 */
function ModelCanvasInner({
  nodes: initialNodes,
  edges: initialEdges,
  onNodeClick,
  className = "",
  modelName = "神经网络架构",
}: ModelCanvasProps) {
  // React Flow 状态管理
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const reactFlowInstance = useReactFlow()
  const { zoomIn, zoomOut, fitView, getViewport } = reactFlowInstance

  // Zustand 状态
  const setZoomLevel = useAppStore((state) => state.setZoomLevel)
  const zoomLevel = useAppStore((state) => state.zoomLevel)
  const canvasActionsRef = useAppStore((state) => state.canvasActionsRef)
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)
  const setSelectedNode = useAppStore((state) => state.setSelectedNode)

  // 快捷操作
  const handleZoomIn = useCallback(() => {
    zoomIn({ duration: 300 })
  }, [zoomIn])

  const handleZoomOut = useCallback(() => {
    zoomOut({ duration: 300 })
  }, [zoomOut])

  const handleFitView = useCallback(() => {
    fitView({ duration: 300, padding: 0.2 })
  }, [fitView])

  // 将画布操作暴露给全局 store，供快捷键使用
  useEffect(() => {
    canvasActionsRef.current = {
      zoomIn: handleZoomIn,
      zoomOut: handleZoomOut,
      fitView: handleFitView,
    }
  }, [handleZoomIn, handleZoomOut, handleFitView, canvasActionsRef])

  useEffect(() => {
    const viewport = getViewport?.()
    if (viewport?.zoom) {
      setZoomLevel(viewport.zoom)
    }
  }, [getViewport, setZoomLevel])

  // 自动注册所有节点类型 - 从 nodeComponents 导入
  const nodeTypes = useMemo(() => nodeComponents, [])

  // 自动注册所有边类型 - 从 edgeComponents 导入
  const edgeTypes = useMemo(() => edgeComponents, [])

  // 节点点击处理
  const handleNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      onNodeClick?.(node)
    },
    [onNodeClick]
  )

  // 点击空白区域处理
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  // MiniMap 节点颜色映射 - 从 nodeColorMap 导入
  const nodeColor = useCallback((node: Node) => {
    const layer = node.data as Layer | undefined
    if (layer && typeof layer === "object" && "type" in layer) {
      const theme = getLayerColorTheme(layer)
      if (theme?.miniMapColor) {
        return theme.miniMapColor
      }
    }
    return "#6b7280" // gray-500 fallback
  }, [])

  // 监听缩放变化
  const handleMoveEnd = useCallback((_event: any, viewport: any) => {
    setZoomLevel(viewport.zoom)
  }, [setZoomLevel])

  const miniMapOffsetScale = useMemo(() => {
    const scale = 0.1 * zoomLevel
    return Math.max(0.04, Math.min(0.25, scale))
  }, [zoomLevel])

  const floatingPanelRight = useMemo(() => {
    if (!isSidebarOpen) {
      return "16px"
    }

    const SIDEBAR_WIDTH = "26rem"
    const GAP_PX = 24
    return `calc(${SIDEBAR_WIDTH} + ${GAP_PX}px)`
  }, [isSidebarOpen])

  return (
    <div className={`relative w-full h-full ${className}`}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        onMoveEnd={handleMoveEnd}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{
          padding: 0.2,
          includeHiddenNodes: false,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{
          animated: true,
        }}
        proOptions={{ hideAttribution: true }}
      >
        {/* 背景网格 */}
        <Background
          gap={20}
          size={2}
          color="#ece1cbff"
          variant={BackgroundVariant.Dots}
          className="bg-[#fefbf6]"
        />

        {/* 控制面板 */}
        <Controls
          className="!bg-background !border-border !shadow-lg"
          showInteractive={false}
        />

        {/* 小地图 */}
        <MiniMap
          nodeColor={nodeColor}
          className="!bg-[#fefbf6] !border-[#d4c4a8] !shadow-lg"
          maskColor="rgba(250, 245, 238, 0.8)"
          position="bottom-left"
          style={{ width: 220, height: 160, borderRadius: 12 }}
          pannable
          zoomable
          zoomStep={0.2}
          offsetScale={miniMapOffsetScale}
        />

        {/* 提示面板 */}
        <Panel position="top-left" className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg">
          <div className="flex items-start gap-2 text-sm">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">交互提示</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• 点击节点查看详细信息</li>
                <li>• 滚轮缩放,拖拽移动画布</li>
                <li>• 使用快捷按钮快速操作</li>
              </ul>
            </div>
          </div>
        </Panel>

        {/* 快捷操作面板 */}
        <Panel 
          position="top-right" 
          className="flex flex-col gap-2"
          style={{
            right: floatingPanelRight,
            transition: 'right 0.3s ease-in-out'
          }}
        >
          <Button
            size="icon"
            variant="secondary"
            onClick={handleZoomIn}
            className="shadow-lg"
            title="放大"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleZoomOut}
            className="shadow-lg"
            title="缩小"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleFitView}
            className="shadow-lg"
            title="适配视图"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </Panel>

        {/* 模型名称面板 */}
        <Panel 
          position="bottom-right" 
          className="bg-gradient-to-br from-primary/10 to-purple-500/10 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
          style={{
            right: floatingPanelRight,
            transition: 'right 0.3s ease-in-out'
          }}
        >
          <div className="text-right">
            <p className="text-xs text-muted-foreground">当前模型</p>
            <p className="font-bold text-lg bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {modelName}
            </p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  )
}

/**
 * ModelCanvas 包装器 - 提供 ReactFlowProvider
 */
export function ModelCanvas(props: ModelCanvasProps) {
  return (
    <ReactFlowProvider>
      <ModelCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
