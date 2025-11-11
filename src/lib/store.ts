/**
 * Zustand 全局状态管理
 * 管理应用的全局状态,包括选中的节点、侧边栏状态等
 */

import { create } from "zustand"
import type { Layer } from "./types"

/**
 * 画布操作接口
 */
export interface CanvasActions {
  zoomIn?: () => void
  zoomOut?: () => void
  fitView?: () => void
}

/**
 * 应用状态接口
 */
interface AppState {
  // 选中的节点
  selectedNode: Layer | null
  setSelectedNode: (node: Layer | null) => void

  // 侧边栏状态
  isSidebarOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
  toggleSidebar: () => void

  // 画布交互状态
  isCanvasInteractive: boolean
  setCanvasInteractive: (interactive: boolean) => void

  // 缩放级别
  zoomLevel: number
  setZoomLevel: (level: number) => void

  // 画布操作引用
  canvasActionsRef: React.MutableRefObject<CanvasActions>

  // 重置状态
  reset: () => void
}

/**
 * 初始状态
 */
const initialState = {
  selectedNode: null,
  isSidebarOpen: false,
  isCanvasInteractive: true,
  zoomLevel: 1,
  canvasActionsRef: { current: {} },
}

/**
 * Zustand Store
 */
export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  // 设置选中的节点
  setSelectedNode: (node) =>
    set({ selectedNode: node, isSidebarOpen: node !== null }),

  // 侧边栏控制
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  // 画布交互控制
  setCanvasInteractive: (interactive) => set({ isCanvasInteractive: interactive }),

  // 缩放级别控制
  setZoomLevel: (level) => set({ zoomLevel: level }),

  // 重置所有状态
  reset: () => set(initialState),
}))

/**
 * 选择器 Hooks - 优化性能
 */

// 获取选中的节点
export const useSelectedNode = () => useAppStore((state) => state.selectedNode)

// 获取侧边栏状态
export const useSidebarState = () =>
  useAppStore((state) => ({
    isOpen: state.isSidebarOpen,
    open: state.openSidebar,
    close: state.closeSidebar,
    toggle: state.toggleSidebar,
  }))

// 获取画布交互状态
export const useCanvasInteractive = () =>
  useAppStore((state) => state.isCanvasInteractive)

// 获取缩放级别
export const useZoomLevel = () => useAppStore((state) => state.zoomLevel)
