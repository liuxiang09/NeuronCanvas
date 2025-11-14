/**
 * sandboxStore - Sandbox专用状态管理
 * 
 * 功能说明：
 * - 使用Zustand实现sandbox编辑器的全局状态管理
 * - 管理模型数据：layers（层）、edges（边）、metadata（元数据）
 * - 管理节点位置：nodePositions（保存用户手动调整的节点位置，避免自动布局覆盖）
 * - 管理选中状态：selectedNodeIds（支持多选节点）
 * - 管理UI状态：对话框（导入/导出、确认对话框）、右键菜单
 * - 提供模型操作方法：添加/删除/更新节点和边、清空模型、设置模型
 * - 提供自动保存功能：needsSave标志和saveToStorage/loadFromStorage方法
 * - 使用localStorage持久化数据，页面刷新后自动恢复
 * - 所有状态变更都会自动标记needsSave，触发自动保存
 */

import { create } from "zustand"
import type { Layer, Edge, Model, SequentialLayer, ParallelLayer } from "@/lib/types"
import { generateNodeId } from "@/lib/nodeFactory"

const STORAGE_KEY = "neuroncanvas_sandbox_data"

/**
 * 节点位置映射（layerId -> position）
 * 用于保存用户手动调整的节点位置，避免自动布局覆盖
 */
interface NodePositions {
  [layerId: string]: { x: number; y: number }
}

/**
 * 历史记录状态快照
 */
interface HistorySnapshot {
  layers: Layer[]
  edges: Edge[]
  nodePositions: NodePositions
}

/**
 * Sandbox状态接口
 */
interface SandboxState {
  // 当前编辑的模型数据
  layers: Layer[]
  edges: Edge[]
  metadata: Model["metadata"] | null

  // 节点位置映射（用于保存手动调整的位置）
  nodePositions: NodePositions
  setNodePosition: (layerId: string, position: { x: number; y: number }) => void
  clearNodePositions: () => void

  // 选中节点ID列表（支持多选）
  selectedNodeIds: string[]
  setSelectedNodeIds: (ids: string[]) => void
  addSelectedNodeId: (id: string) => void
  removeSelectedNodeId: (id: string) => void
  clearSelection: () => void

  // 导入/导出对话框状态
  isImportDialogOpen: boolean
  isExportDialogOpen: boolean
  openImportDialog: () => void
  closeImportDialog: () => void
  openExportDialog: () => void
  closeExportDialog: () => void

  // 确认对话框状态
  confirmDialog: {
    isOpen: boolean
    title: string
    message: string
    onConfirm: (() => void) | null
    onCancel: (() => void) | null
  }
  showConfirmDialog: (
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) => void
  closeConfirmDialog: () => void

  // 右键菜单状态
  contextMenu: {
    isOpen: boolean
    x: number
    y: number
    nodeId: string | null
    flowPosition?: { x: number; y: number } // 画布坐标位置
  }
  openContextMenu: (x: number, y: number, nodeId?: string, flowPosition?: { x: number; y: number }) => void
  closeContextMenu: () => void

  // 模型操作方法
  setLayers: (layers: Layer[]) => void
  setEdges: (edges: Edge[]) => void
  addLayer: (layer: Layer) => void
  updateLayer: (id: string, updates: Partial<Layer>) => void
  removeLayer: (id: string) => void
  addEdge: (edge: Edge) => void
  removeEdge: (id: string) => void
  removeEdgesByNodeId: (nodeId: string) => void
  setModel: (model: Model) => void
  clearModel: () => void

  // 自动保存
  lastSaved: number | null
  markSaved: () => void
  needsSave: boolean
  setNeedsSave: (needs: boolean) => void

  // 侧边栏宽度（像素值）
  leftSidebarWidth: number
  rightSidebarWidth: number
  setLeftSidebarWidth: (width: number) => void
  setRightSidebarWidth: (width: number) => void

  // 画布操作相关
  zoomLevel: number
  setZoomLevel: (level: number) => void
  canvasActionsRef: React.MutableRefObject<{
    zoomIn?: () => void
    zoomOut?: () => void
    fitView?: () => void
    autoLayout?: () => void
    screenToFlowPosition?: (position: { x: number; y: number }) => { x: number; y: number }
    getViewport?: () => { x: number; y: number; zoom: number } | null
  }>

  // 剪贴板
  clipboard: Layer | null
  copyToClipboard: (layer: Layer) => void
  clearClipboard: () => void
  pasteNodeAtPosition: (flowPosition: { x: number; y: number }) => void

  // 最后一次鼠标点击位置（画布坐标）
  lastClickPosition: { x: number; y: number } | null
  setLastClickPosition: (position: { x: number; y: number } | null) => void

  // 历史记录（撤销/重做）
  history: HistorySnapshot[]
  historyIndex: number
  maxHistorySize: number
  undo: () => void
  redo: () => void
  pushToHistory: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // 从localStorage加载
  loadFromStorage: () => void
  // 保存到localStorage
  saveToStorage: () => void
}

/**
 * 计算初始侧边栏宽度（基于屏幕宽度百分比）
 */
const getInitialSidebarWidths = () => {
  if (typeof window === "undefined") {
    return { left: 256, right: 420 } // 默认值（SSR）
  }
  const screenWidth = window.innerWidth
  return {
    left: Math.max(200, Math.min(screenWidth * 0.15, screenWidth * 0.4)), // 15%，最小200px，最大40%
    right: Math.max(300, Math.min(screenWidth * 0.2, screenWidth * 0.5)), // 20%，最小300px，最大50%
  }
}

/**
 * 初始状态
 */
const getInitialState = () => {
  const widths = getInitialSidebarWidths()
  return {
    layers: [],
    edges: [],
    metadata: null,
    nodePositions: {},
    selectedNodeIds: [],
    isImportDialogOpen: false,
    isExportDialogOpen: false,
    confirmDialog: {
      isOpen: false,
      title: "",
      message: "",
      onConfirm: null,
      onCancel: null,
    },
    contextMenu: {
      isOpen: false,
      x: 0,
      y: 0,
      nodeId: null,
      flowPosition: undefined,
    },
    lastSaved: null,
    needsSave: false,
    leftSidebarWidth: widths.left,
    rightSidebarWidth: widths.right,
    zoomLevel: 1,
    canvasActionsRef: { current: {} },
    clipboard: null,
    lastClickPosition: null,
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,
  }
}

/**
 * Zustand Store
 */
export const useSandboxStore = create<SandboxState>((set, get) => ({
  ...getInitialState(),

  // 选中节点管理
  setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),
  addSelectedNodeId: (id) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.includes(id)
        ? state.selectedNodeIds
        : [...state.selectedNodeIds, id],
    })),
  removeSelectedNodeId: (id) =>
    set((state) => ({
      selectedNodeIds: state.selectedNodeIds.filter((nodeId) => nodeId !== id),
    })),
  clearSelection: () => set({ selectedNodeIds: [] }),

  // 导入/导出对话框
  openImportDialog: () => set({ isImportDialogOpen: true }),
  closeImportDialog: () => set({ isImportDialogOpen: false }),
  openExportDialog: () => set({ isExportDialogOpen: true }),
  closeExportDialog: () => set({ isExportDialogOpen: false }),

  // 确认对话框
  showConfirmDialog: (title, message, onConfirm, onCancel) =>
    set({
      confirmDialog: {
        isOpen: true,
        title,
        message,
        onConfirm,
        onCancel: onCancel || null,
      },
    }),
  closeConfirmDialog: () =>
    set({
      confirmDialog: {
        isOpen: false,
        title: "",
        message: "",
        onConfirm: null,
        onCancel: null,
      },
    }),

  // 右键菜单
  openContextMenu: (x, y, nodeId, flowPosition) =>
    set({
      contextMenu: {
        isOpen: true,
        x,
        y,
        nodeId: nodeId || null,
        flowPosition: flowPosition || undefined,
      },
    }),
  closeContextMenu: () =>
    set({
      contextMenu: {
        isOpen: false,
        x: 0,
        y: 0,
        nodeId: null,
        flowPosition: undefined,
      },
    }),

  // 节点位置管理
  setNodePosition: (layerId, position) => {
    set((state) => ({
      nodePositions: {
        ...state.nodePositions,
        [layerId]: position,
      },
    }))
  },
  clearNodePositions: () => {
    set({ nodePositions: {} })
  },

  // 模型操作方法（在操作后保存历史）
  setLayers: (layers) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      const newState = { ...currentState, layers, needsSave: true }
      // 在状态更新后保存历史
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  setEdges: (edges) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      const newState = { ...currentState, edges, needsSave: true }
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  addLayer: (layer) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      const newState = {
        ...currentState,
        layers: [...currentState.layers, layer],
        needsSave: true,
      }
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  updateLayer: (id, updates) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      const newState = {
        ...currentState,
        layers: currentState.layers.map((layer) =>
          layer.id === id ? ({ ...layer, ...updates } as Layer) : layer
        ),
        needsSave: true,
      }
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  removeLayer: (id) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      // 同时删除相关的边和位置信息
      const newEdges = currentState.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      )
      const { [id]: removed, ...remainingPositions } = currentState.nodePositions
      const newState = {
        ...currentState,
        layers: currentState.layers.filter((layer) => layer.id !== id),
        edges: newEdges,
        selectedNodeIds: currentState.selectedNodeIds.filter((nodeId) => nodeId !== id),
        nodePositions: remainingPositions,
        needsSave: true,
      }
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  addEdge: (edge) => {
    const state = get()
    // 检查是否已存在相同的边
    const exists = state.edges.some(
      (e) => e.source === edge.source && e.target === edge.target
    )
    if (exists) {
      return
    }
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      const newState = {
        ...currentState,
        edges: [...currentState.edges, edge],
        needsSave: true,
      }
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  removeEdge: (id) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      const newState = {
        ...currentState,
        edges: currentState.edges.filter((edge) => edge.id !== id),
        needsSave: true,
      }
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  removeEdgesByNodeId: (nodeId) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set((currentState) => {
      const newState = {
        ...currentState,
        edges: currentState.edges.filter(
          (edge) => edge.source !== nodeId && edge.target !== nodeId
        ),
        needsSave: true,
      }
      setTimeout(() => get().pushToHistory(), 0)
      return newState
    })
  },
  setModel: (model) => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set({
      layers: model.layers,
      edges: model.edges,
      metadata: model.metadata,
      needsSave: true,
    })
    setTimeout(() => get().pushToHistory(), 0)
  },
  clearModel: () => {
    const state = get()
    // 如果历史记录为空，先保存初始状态
    if (state.history.length === 0) {
      state.pushToHistory()
    }
    set({
      layers: [],
      edges: [],
      metadata: null,
      selectedNodeIds: [],
      nodePositions: {},
      needsSave: true,
    })
    setTimeout(() => get().pushToHistory(), 0)
  },

  // 自动保存
  markSaved: () => set({ lastSaved: Date.now(), needsSave: false }),
  setNeedsSave: (needs) => set({ needsSave: needs }),

  // 侧边栏宽度管理
  setLeftSidebarWidth: (width) => {
    const minWidth = 200
    const maxWidth = typeof window !== "undefined" ? window.innerWidth * 0.4 : 800
    set({ leftSidebarWidth: Math.max(minWidth, Math.min(width, maxWidth)) })
  },
  setRightSidebarWidth: (width) => {
    const minWidth = 300
    const maxWidth = typeof window !== "undefined" ? window.innerWidth * 0.5 : 1000
    set({ rightSidebarWidth: Math.max(minWidth, Math.min(width, maxWidth)) })
  },

  // 画布操作管理
  setZoomLevel: (level) => set({ zoomLevel: level }),

  // 剪贴板管理
  copyToClipboard: (layer) => {
    // 深拷贝节点，包括所有嵌套属性
    const deepCopyLayer = (original: Layer): Layer => {
      const copied = JSON.parse(JSON.stringify(original))
      // 生成新的ID
      copied.id = generateNodeId(copied.type)
      // 在名称后添加"副本"后缀
      copied.name = `${copied.name} 副本`
      
      // 如果是 sequential 节点，需要递归复制 steps
      if (copied.type === "sequential" && (copied as SequentialLayer).steps) {
        const sequentialLayer = copied as SequentialLayer
        sequentialLayer.steps = sequentialLayer.steps.map((step) => deepCopyLayer(step))
      }
      
      // 如果是 parallel 节点，需要递归复制 branches 中的 steps
      if (copied.type === "parallel" && (copied as ParallelLayer).branches) {
        const parallelLayer = copied as ParallelLayer
        parallelLayer.branches = parallelLayer.branches.map((branch) => ({
          ...branch,
          id: branch.id ? `branch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` : undefined,
          steps: branch.steps.map((step) => deepCopyLayer(step)),
        }))
      }
      
      return copied
    }
    
    const copiedLayer = deepCopyLayer(layer)
    set({ clipboard: copiedLayer })
  },
  clearClipboard: () => set({ clipboard: null }),
  pasteNodeAtPosition: (flowPosition) => {
    const state = get()
    if (!state.clipboard) return
    
    // 深拷贝剪贴板中的节点（因为可能多次粘贴）
    const pasteNode = JSON.parse(JSON.stringify(state.clipboard)) as Layer
    
    // 递归更新所有节点的ID（包括嵌套的 sequential 和 parallel 节点）
    const updateNodeIds = (node: Layer): Layer => {
      node.id = generateNodeId(node.type)
      
      // 如果是 sequential 节点，递归更新 steps 中的节点ID
      if (node.type === "sequential" && (node as SequentialLayer).steps) {
        const sequentialNode = node as SequentialLayer
        sequentialNode.steps = sequentialNode.steps.map((step) => updateNodeIds(step))
      }
      
      // 如果是 parallel 节点，递归更新 branches 中的节点ID
      if (node.type === "parallel" && (node as ParallelLayer).branches) {
        const parallelNode = node as ParallelLayer
        parallelNode.branches = parallelNode.branches.map((branch) => ({
          ...branch,
          id: branch.id ? `branch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}` : undefined,
          steps: branch.steps.map((step) => updateNodeIds(step)),
        }))
      }
      
      return node
    }
    
    const finalNode = updateNodeIds(pasteNode)
    state.addLayer(finalNode)
    
    // 使用传入的画布坐标位置
    state.setNodePosition(finalNode.id, flowPosition)
  },

  // 最后一次鼠标点击位置管理
  setLastClickPosition: (position) => set({ lastClickPosition: position }),

  // 历史记录管理
  pushToHistory: () => {
    const state = get()
    const snapshot: HistorySnapshot = {
      layers: JSON.parse(JSON.stringify(state.layers)),
      edges: JSON.parse(JSON.stringify(state.edges)),
      nodePositions: JSON.parse(JSON.stringify(state.nodePositions)),
    }
    
    set((currentState) => {
      // 如果历史记录为空，先保存初始状态
      if (currentState.history.length === 0) {
        return {
          history: [snapshot],
          historyIndex: 0,
        }
      }
      
      const newHistory = [...currentState.history]
      // 如果当前不在历史末尾，删除后面的历史（执行新操作时清除重做历史）
      if (currentState.historyIndex < newHistory.length - 1) {
        newHistory.splice(currentState.historyIndex + 1)
      }
      // 添加新快照（操作后的状态）
      newHistory.push(snapshot)
      // 限制历史记录数量
      if (newHistory.length > currentState.maxHistorySize) {
        newHistory.shift()
        return {
          history: newHistory,
          historyIndex: newHistory.length - 1,
        }
      }
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      }
    })
  },
  undo: () => {
    const state = get()
    if (state.historyIndex <= 0) return
    
    const prevIndex = state.historyIndex - 1
    const snapshot = state.history[prevIndex]
    
    set({
      layers: JSON.parse(JSON.stringify(snapshot.layers)),
      edges: JSON.parse(JSON.stringify(snapshot.edges)),
      nodePositions: JSON.parse(JSON.stringify(snapshot.nodePositions)),
      historyIndex: prevIndex,
      needsSave: true,
    })
  },
  redo: () => {
    const state = get()
    if (state.historyIndex >= state.history.length - 1) return
    
    const nextIndex = state.historyIndex + 1
    const snapshot = state.history[nextIndex]
    
    set({
      layers: JSON.parse(JSON.stringify(snapshot.layers)),
      edges: JSON.parse(JSON.stringify(snapshot.edges)),
      nodePositions: JSON.parse(JSON.stringify(snapshot.nodePositions)),
      historyIndex: nextIndex,
      needsSave: true,
    })
  },
  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },
  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  // 从localStorage加载
  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        const initialWidths = getInitialSidebarWidths()
        const loadedLayers = data.layers || []
        const loadedEdges = data.edges || []
        const loadedNodePositions = data.nodePositions || {}
        
        set({
          layers: loadedLayers,
          edges: loadedEdges,
          metadata: data.metadata || null,
          nodePositions: loadedNodePositions,
          leftSidebarWidth: data.leftSidebarWidth || initialWidths.left,
          rightSidebarWidth: data.rightSidebarWidth || initialWidths.right,
          needsSave: false,
        })
        
        // 初始化历史记录（保存加载后的状态作为初始状态）
        const initialState: HistorySnapshot = {
          layers: JSON.parse(JSON.stringify(loadedLayers)),
          edges: JSON.parse(JSON.stringify(loadedEdges)),
          nodePositions: JSON.parse(JSON.stringify(loadedNodePositions)),
        }
        set({
          history: [initialState],
          historyIndex: 0,
        })
      } else {
        // 如果没有存储的数据，使用初始宽度
        const initialWidths = getInitialSidebarWidths()
        set({
          leftSidebarWidth: initialWidths.left,
          rightSidebarWidth: initialWidths.right,
        })
      }
    } catch (error) {
      console.error("Failed to load from localStorage:", error)
    }
  },

  // 保存到localStorage
  saveToStorage: () => {
    try {
      const state = get()
      const data = {
        layers: state.layers,
        edges: state.edges,
        metadata: state.metadata,
        leftSidebarWidth: state.leftSidebarWidth,
        rightSidebarWidth: state.rightSidebarWidth,
        savedAt: Date.now(),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      state.markSaved()
    } catch (error) {
      console.error("Failed to save to localStorage:", error)
    }
  },
}))

/**
 * 选择器 Hooks - 优化性能
 */
export const useSandboxLayers = () =>
  useSandboxStore((state) => state.layers)
export const useSandboxEdges = () =>
  useSandboxStore((state) => state.edges)
export const useSandboxSelectedNodes = () =>
  useSandboxStore((state) => state.selectedNodeIds)

