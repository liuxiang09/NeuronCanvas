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
import type { Layer, Edge, Model } from "@/lib/types"

const STORAGE_KEY = "neuroncanvas_sandbox_data"

/**
 * 节点位置映射（layerId -> position）
 * 用于保存用户手动调整的节点位置，避免自动布局覆盖
 */
interface NodePositions {
  [layerId: string]: { x: number; y: number }
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

  // 从localStorage加载
  loadFromStorage: () => void
  // 保存到localStorage
  saveToStorage: () => void
}

/**
 * 初始状态
 */
const initialState = {
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
}

/**
 * Zustand Store
 */
export const useSandboxStore = create<SandboxState>((set, get) => ({
  ...initialState,

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

  // 模型操作方法
  setLayers: (layers) => {
    set((state) => ({ ...state, layers, needsSave: true }))
  },
  setEdges: (edges) => {
    set((state) => ({ ...state, edges, needsSave: true }))
  },
  addLayer: (layer) => {
    set((state) => ({
      layers: [...state.layers, layer],
      needsSave: true,
    }))
  },
  updateLayer: (id, updates) => {
    set((state) => ({
      ...state,
      layers: state.layers.map((layer) =>
        layer.id === id ? ({ ...layer, ...updates } as Layer) : layer
      ),
      needsSave: true,
    }))
  },
  removeLayer: (id) => {
    set((state) => {
      // 同时删除相关的边和位置信息
      const newEdges = state.edges.filter(
        (edge) => edge.source !== id && edge.target !== id
      )
      const { [id]: removed, ...remainingPositions } = state.nodePositions
      return {
        layers: state.layers.filter((layer) => layer.id !== id),
        edges: newEdges,
        selectedNodeIds: state.selectedNodeIds.filter((nodeId) => nodeId !== id),
        nodePositions: remainingPositions,
        needsSave: true,
      }
    })
  },
  addEdge: (edge) => {
    set((state) => {
      // 检查是否已存在相同的边
      const exists = state.edges.some(
        (e) => e.source === edge.source && e.target === edge.target
      )
      if (exists) {
        return state
      }
      return {
        edges: [...state.edges, edge],
        needsSave: true,
      }
    })
  },
  removeEdge: (id) => {
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== id),
      needsSave: true,
    }))
  },
  removeEdgesByNodeId: (nodeId) => {
    set((state) => ({
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      needsSave: true,
    }))
  },
  setModel: (model) => {
    set({
      layers: model.layers,
      edges: model.edges,
      metadata: model.metadata,
      needsSave: true,
    })
  },
  clearModel: () => {
    set({
      layers: [],
      edges: [],
      metadata: null,
      selectedNodeIds: [],
      nodePositions: {},
      needsSave: true,
    })
  },

  // 自动保存
  markSaved: () => set({ lastSaved: Date.now(), needsSave: false }),
  setNeedsSave: (needs) => set({ needsSave: needs }),

  // 从localStorage加载
  loadFromStorage: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        set({
          layers: data.layers || [],
          edges: data.edges || [],
          metadata: data.metadata || null,
          needsSave: false,
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

