"use client"

import { useEffect } from "react"
import { useSandboxStore } from "@/lib/sandbox/sandboxStore"
import { useAppStore } from "@/lib/store"

/**
 * Sandbox专用快捷键处理
 * 复用canvas快捷键，添加画布缩放等功能
 */
export function useSandboxShortcuts() {
  const selectedNodeIds = useSandboxStore((state) => state.selectedNodeIds)
  const removeLayer = useSandboxStore((state) => state.removeLayer)
  const showConfirmDialog = useSandboxStore((state) => state.showConfirmDialog)
  const clearSelection = useSandboxStore((state) => state.clearSelection)
  const saveToStorage = useSandboxStore((state) => state.saveToStorage)
  const openImportDialog = useSandboxStore((state) => state.openImportDialog)
  const openExportDialog = useSandboxStore((state) => state.openExportDialog)
  const clearModel = useSandboxStore((state) => state.clearModel)
  const layers = useSandboxStore((state) => state.layers)
  const closeContextMenu = useSandboxStore((state) => state.closeContextMenu)
  const contextMenu = useSandboxStore((state) => state.contextMenu)
  const canvasActionsRef = useAppStore((state) => state.canvasActionsRef)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 忽略输入框中的快捷键
      const target = event.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      const key = event.key.toLowerCase()
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey

      // Delete / Backspace: 删除选中节点
      if ((key === "delete" || key === "backspace") && selectedNodeIds.length > 0) {
        event.preventDefault()
        if (selectedNodeIds.length === 1) {
          const nodeId = selectedNodeIds[0]
          showConfirmDialog(
            "确认删除",
            "确定要删除此节点吗？删除节点将同时删除相关的连接。",
            () => {
              removeLayer(nodeId)
            }
          )
        } else {
          showConfirmDialog(
            "确认删除",
            `确定要删除 ${selectedNodeIds.length} 个节点吗？删除节点将同时删除相关的连接。`,
            () => {
              selectedNodeIds.forEach((id) => removeLayer(id))
            }
          )
        }
        return
      }

      // Ctrl+S / Cmd+S: 保存到localStorage
      if (ctrlKey && key === "s") {
        event.preventDefault()
        saveToStorage()
        return
      }

      // Ctrl+N / Cmd+N: 新建空白画布
      if (ctrlKey && key === "n") {
        event.preventDefault()
        if (layers.length > 0) {
          showConfirmDialog(
            "确认新建",
            "当前画布有未保存的内容，确定要清空吗？",
            () => {
              clearModel()
            }
          )
        } else {
          clearModel()
        }
        return
      }

      // Ctrl+O / Cmd+O: 打开文件导入对话框
      if (ctrlKey && key === "o") {
        event.preventDefault()
        openImportDialog()
        return
      }

      // Ctrl+E / Cmd+E: 导出模型对话框
      if (ctrlKey && key === "e") {
        event.preventDefault()
        openExportDialog()
        return
      }

      // Esc: 取消选中/关闭对话框/关闭右键菜单
      if (key === "escape") {
        if (contextMenu.isOpen) {
          event.preventDefault()
          closeContextMenu()
        } else if (selectedNodeIds.length > 0) {
          event.preventDefault()
          clearSelection()
        }
        return
      }

      // Ctrl+A / Cmd+A: 全选所有节点
      if (ctrlKey && key === "a") {
        event.preventDefault()
        const allNodeIds = useSandboxStore.getState().layers.map((layer) => layer.id)
        useSandboxStore.getState().setSelectedNodeIds(allNodeIds)
        return
      }

      // 画布缩放快捷键（复用canvas快捷键）
      // + 或 =: 放大画布
      if (key === "=" || key === "+") {
        event.preventDefault()
        canvasActionsRef.current?.zoomIn?.()
        return
      }

      // - 或 _: 缩小画布
      if (key === "-" || key === "_") {
        event.preventDefault()
        canvasActionsRef.current?.zoomOut?.()
        return
      }

      // F: 适配视图
      if (key === "f") {
        event.preventDefault()
        canvasActionsRef.current?.fitView?.()
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    selectedNodeIds,
    removeLayer,
    showConfirmDialog,
    clearSelection,
    saveToStorage,
    openImportDialog,
    openExportDialog,
    clearModel,
    layers.length,
    contextMenu.isOpen,
    closeContextMenu,
    canvasActionsRef,
  ])
}

