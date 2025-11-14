/**
 * SandboxCanvas - 可编辑画布组件
 * 
 * 功能说明：
 * - 这是sandbox模块的核心画布组件，基于ModelCanvas扩展
 * - 支持节点的创建（拖拽、点击、右键）、删除、移动
 * - 支持边的创建和删除
 * - 支持节点位置的保存和恢复，避免自动布局覆盖用户手动调整的位置
 * - 提供自动布局功能，可以一键重新排列所有节点
 * - 支持多选节点、右键菜单等交互功能
 */

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
  type Connection,
  type NodeMouseHandler,
} from "reactflow"
import "reactflow/dist/style.css"
import { Info, ZoomIn, ZoomOut, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSandboxStore } from "@/lib/sandboxStore"
import { nodeComponents } from "@/components/gallery/custom-nodes"
import { edgeComponents } from "@/components/gallery/custom-edges"
import { getLayerColorTheme } from "@/lib/theme"
import { calculateLayout, getNodeTypeMap } from "@/lib/layout"
import { createNodeByType } from "@/lib/nodeFactory"
import type { Layer, LayerType } from "@/lib/types"

interface SandboxCanvasProps {
  className?: string
}

/**
 * SandboxCanvas - 可编辑画布组件
 * 基于ModelCanvas扩展，支持节点/边的创建、删除、移动等编辑功能
 */
function SandboxCanvasInner({ className = "" }: SandboxCanvasProps) {
  const reactFlowInstance = useReactFlow()
  const { zoomIn, zoomOut, fitView, getViewport, screenToFlowPosition, setNodes: setReactFlowNodes } =
    reactFlowInstance

  // Sandbox状态
  const layers = useSandboxStore((state) => state.layers)
  const edges = useSandboxStore((state) => state.edges)
  const nodePositions = useSandboxStore((state) => state.nodePositions)
  const selectedNodeIds = useSandboxStore((state) => state.selectedNodeIds)
  const setSelectedNodeIds = useSandboxStore((state) => state.setSelectedNodeIds)
  const addLayer = useSandboxStore((state) => state.addLayer)
  const removeLayer = useSandboxStore((state) => state.removeLayer)
  const addEdge = useSandboxStore((state) => state.addEdge)
  const removeEdge = useSandboxStore((state) => state.removeEdge)
  const setNodePosition = useSandboxStore((state) => state.setNodePosition)
  const clearNodePositions = useSandboxStore((state) => state.clearNodePositions)
  const showConfirmDialog = useSandboxStore((state) => state.showConfirmDialog)
  const openContextMenu = useSandboxStore((state) => state.openContextMenu)
  const closeContextMenu = useSandboxStore((state) => state.closeContextMenu)
  const setLastClickPosition = useSandboxStore((state) => state.setLastClickPosition)

  // 画布状态
  const setZoomLevel = useSandboxStore((state) => state.setZoomLevel)
  const zoomLevel = useSandboxStore((state) => state.zoomLevel)
  const canvasActionsRef = useSandboxStore((state) => state.canvasActionsRef)
  
  // 右侧属性面板宽度（用于计算浮动面板位置）
  const rightSidebarWidth = useSandboxStore((state) => state.rightSidebarWidth)

  // 自动布局标志（用于区分是否需要自动布局）
  const autoLayoutRef = useRef(false)

  // 将layers和edges转换为ReactFlow的nodes和edges
  // 如果节点有保存的位置，使用保存的位置；否则使用自动布局
  const { nodes: layoutNodes, edges: layoutEdges } = useMemo(() => {
    if (layers.length === 0) {
      return { nodes: [], edges: [] }
    }

    // 如果启用自动布局，使用calculateLayout
    if (autoLayoutRef.current) {
      autoLayoutRef.current = false // 重置标志
      const layout = calculateLayout(layers, edges)
      // 保存自动布局的位置
      layout.nodes.forEach((node) => {
        setNodePosition(node.id, { x: node.position.x, y: node.position.y })
      })
      return layout
    }

    // 否则，使用保存的位置或计算新位置
    const nodeTypeMap = getNodeTypeMap()
    const layout = calculateLayout(layers, edges)
    
    // 对于已有位置的节点，使用保存的位置
    const nodesWithPositions = layout.nodes.map((node) => {
      const savedPosition = nodePositions[node.id]
      if (savedPosition) {
        return {
          ...node,
          position: savedPosition,
        }
      }
      return node
    })

    return {
      nodes: nodesWithPositions,
      edges: layout.edges,
    }
  }, [layers, edges, nodePositions, setNodePosition])

  // React Flow 状态管理
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutNodes)
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState(layoutEdges)

  // 同步layers变化到nodes（但不自动重新布局）
  useEffect(() => {
    if (layers.length === 0) {
      setNodes([])
      setFlowEdges([])
      return
    }

    // 计算新节点和边的布局
    const nodeTypeMap = getNodeTypeMap()
    const layout = calculateLayout(layers, edges)
    
    // 合并已有位置和新位置
    const nodesWithPositions = layout.nodes.map((node) => {
      const savedPosition = nodePositions[node.id]
      if (savedPosition) {
        return {
          ...node,
          position: savedPosition,
        }
      }
      return node
    })

    // 只更新新增的节点，保持已有节点的位置
    setNodes((currentNodes) => {
      const currentNodeMap = new Map(currentNodes.map((n) => [n.id, n]))
      return nodesWithPositions.map((newNode) => {
        const existingNode = currentNodeMap.get(newNode.id)
        if (existingNode) {
          // 保持现有节点的位置和选中状态
          return {
            ...existingNode,
            data: newNode.data,
            type: newNode.type,
            selected: selectedNodeIds.includes(newNode.id),
          }
        }
        return {
          ...newNode,
          selected: selectedNodeIds.includes(newNode.id),
        }
      })
    })
    setFlowEdges(layout.edges)
  }, [layers, edges, nodePositions, setNodes, setFlowEdges, selectedNodeIds])

  // 同步选中状态
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        selected: selectedNodeIds.includes(node.id),
      }))
    )
  }, [selectedNodeIds, setNodes])

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

  // 自动布局处理
  const handleAutoLayout = useCallback(() => {
    autoLayoutRef.current = true
    const layout = calculateLayout(layers, edges)
    
    // 更新所有节点位置
    layout.nodes.forEach((node) => {
      setNodePosition(node.id, { x: node.position.x, y: node.position.y })
    })
    
    // 更新React Flow节点
    setNodes((currentNodes) => {
      const currentNodeMap = new Map(currentNodes.map((n) => [n.id, n]))
      return layout.nodes.map((newNode) => {
        const existingNode = currentNodeMap.get(newNode.id)
        return {
          ...newNode,
          selected: existingNode?.selected || false,
        }
      })
    })
    
    // 适配视图
    setTimeout(() => {
      fitView({ duration: 300, padding: 0.2 })
    }, 100)
  }, [layers, edges, setNodePosition, setNodes, fitView])

  // 暴露自动布局函数给外部
  useEffect(() => {
    if (canvasActionsRef.current) {
      canvasActionsRef.current.autoLayout = handleAutoLayout
    }
  }, [handleAutoLayout, canvasActionsRef])

  // 将画布操作暴露给全局 store
  useEffect(() => {
    canvasActionsRef.current = {
      zoomIn: handleZoomIn,
      zoomOut: handleZoomOut,
      fitView: handleFitView,
      autoLayout: handleAutoLayout,
      screenToFlowPosition: screenToFlowPosition,
      getViewport: getViewport,
    }
  }, [handleZoomIn, handleZoomOut, handleFitView, handleAutoLayout, screenToFlowPosition, getViewport, canvasActionsRef])

  useEffect(() => {
    const viewport = getViewport?.()
    if (viewport?.zoom) {
      setZoomLevel(viewport.zoom)
    }
  }, [getViewport, setZoomLevel])

  // 自动注册所有节点类型
  const nodeTypes = useMemo(() => nodeComponents, [])
  const edgeTypes = useMemo(() => edgeComponents, [])

  // 拖拽处理 - 允许从外部拖拽节点到画布
  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "copy"
  }, [])

  // 拖拽释放处理 - 添加节点到指定位置
  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      
      const nodeType = event.dataTransfer.getData("application/reactflow") as LayerType
      if (!nodeType) return

      // 将屏幕坐标转换为画布坐标
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      // 创建新节点
      const newNode = createNodeByType(nodeType, position)
      addLayer(newNode)
      
      // 保存节点位置
      if (newNode.id) {
        setNodePosition(newNode.id, position)
      }
    },
    [screenToFlowPosition, addLayer, setNodePosition]
  )

  // 节点点击处理
  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      const isMultiSelect = _event.ctrlKey || _event.metaKey
      if (isMultiSelect) {
        if (selectedNodeIds.includes(node.id)) {
          setSelectedNodeIds(selectedNodeIds.filter((id) => id !== node.id))
        } else {
          setSelectedNodeIds([...selectedNodeIds, node.id])
        }
      } else {
        setSelectedNodeIds([node.id])
      }
    },
    [selectedNodeIds, setSelectedNodeIds]
  )

  // 点击空白区域处理
  const handlePaneClick = useCallback(
    (event: React.MouseEvent) => {
      setSelectedNodeIds([])
      closeContextMenu()
      
      // 保存鼠标点击位置（画布坐标）
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      setLastClickPosition(flowPosition)
    },
    [setSelectedNodeIds, closeContextMenu, screenToFlowPosition, setLastClickPosition]
  )

  // 节点删除处理（带确认）
  const handleNodesDelete = useCallback(
    (deleted: Node[]) => {
      if (deleted.length === 0) return

      const nodeNames = deleted
        .map((node) => (node.data as Layer)?.name || node.id)
        .join("、")

      showConfirmDialog(
        "确认删除",
        `确定要删除以下 ${deleted.length} 个节点吗？\n${nodeNames}\n\n删除节点将同时删除相关的连接。`,
        () => {
          deleted.forEach((node) => {
            removeLayer(node.id)
          })
        }
      )
    },
    [showConfirmDialog, removeLayer]
  )

  // 边删除处理（带确认）
  const handleEdgesDelete = useCallback(
    (deleted: Edge[]) => {
      if (deleted.length === 0) return

      showConfirmDialog(
        "确认删除",
        `确定要删除 ${deleted.length} 条连接吗？`,
        () => {
          deleted.forEach((edge) => {
            removeEdge(edge.id)
          })
        }
      )
    },
    [showConfirmDialog, removeEdge]
  )

  // 边创建处理
  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return

      // 检查是否已存在相同的边
      const exists = edges.some(
        (e) => e.source === connection.source && e.target === connection.target
      )
      if (exists) return

      // 不能连接到自己
      if (connection.source === connection.target) return

      const newEdge = {
        id: `edge_${connection.source}_${connection.target}_${Date.now()}`,
        source: connection.source,
        target: connection.target,
        type: "normal",
      }
      addEdge(newEdge)
    },
    [edges, addEdge]
  )

  // 节点拖拽停止处理 - 保存新位置
  const handleNodeDragStop = useCallback(
    (_event: any, node: Node) => {
      setNodePosition(node.id, node.position)
    },
    [setNodePosition]
  )

  // 右键菜单处理
  const handlePaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault()
      // 将屏幕坐标转换为画布坐标
      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      openContextMenu(event.clientX, event.clientY, undefined, flowPosition)
    },
    [screenToFlowPosition, openContextMenu]
  )

  const handleNodeContextMenu: NodeMouseHandler = useCallback(
    (event, node) => {
      event.preventDefault()
      openContextMenu(event.clientX, event.clientY, node.id)
    },
    [openContextMenu]
  )

  // 双击节点处理
  const handleNodeDoubleClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      setSelectedNodeIds([node.id])
    },
    [setSelectedNodeIds]
  )

  // MiniMap 节点颜色映射
  const nodeColor = useCallback((node: Node) => {
    const layer = node.data as Layer | undefined
    if (layer && typeof layer === "object" && "type" in layer) {
      const theme = getLayerColorTheme(layer)
      if (theme?.miniMapColor) {
        return theme.miniMapColor
      }
    }
    return "#6b7280"
  }, [])

  // 监听缩放变化
  const handleMoveEnd = useCallback(
    (_event: any, viewport: any) => {
      setZoomLevel(viewport.zoom)
    },
    [setZoomLevel]
  )

  const miniMapOffsetScale = useMemo(() => {
    const scale = 0.1 * zoomLevel
    return Math.max(0.04, Math.min(0.25, scale))
  }, [zoomLevel])

  return (
    <div
      className={`relative w-full h-full ${className}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onNodeDoubleClick={handleNodeDoubleClick}
        onNodeContextMenu={handleNodeContextMenu}
        onPaneClick={handlePaneClick}
        onPaneContextMenu={handlePaneContextMenu}
        onMoveEnd={handleMoveEnd}
        onConnect={handleConnect}
        onNodesDelete={handleNodesDelete}
        onEdgesDelete={handleEdgesDelete}
        onNodeDragStop={handleNodeDragStop}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
        selectNodesOnDrag={false}
        deleteKeyCode={null}
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
        <Panel
          position="top-left"
          className="bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 shadow-lg"
        >
          <div className="flex items-start gap-2 text-sm">
            <Info className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">编辑提示</p>
              <ul className="text-xs text-muted-foreground space-y-0.5">
                <li>• 拖拽节点类型到画布添加</li>
                <li>• 从节点handle拖拽创建连接</li>
                <li>• 右键菜单添加节点</li>
                <li>• Ctrl+点击多选节点</li>
              </ul>
            </div>
          </div>
        </Panel>

        {/* 快捷操作面板 */}
        <Panel
          position="top-right"
          className="flex flex-col gap-2"
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
      </ReactFlow>
    </div>
  )
}

/**
 * SandboxCanvas 包装器 - 提供 ReactFlowProvider
 */
export function SandboxCanvas(props: SandboxCanvasProps) {
  return (
    <ReactFlowProvider>
      <SandboxCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
