"use client"

import { useEffect } from "react"
import { useSandboxStore } from "@/lib/sandboxStore"

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
  const canvasActionsRef = useSandboxStore((state) => state.canvasActionsRef)
  const copyToClipboard = useSandboxStore((state) => state.copyToClipboard)
  const clipboard = useSandboxStore((state) => state.clipboard)
  const undo = useSandboxStore((state) => state.undo)
  const redo = useSandboxStore((state) => state.redo)
  const canUndo = useSandboxStore((state) => state.canUndo)
  const canRedo = useSandboxStore((state) => state.canRedo)

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

      // Ctrl+C / Cmd+C: 复制选中的节点
      if (ctrlKey && key === "c" && selectedNodeIds.length > 0) {
        event.preventDefault()
        const nodeId = selectedNodeIds[0] // 复制第一个选中的节点
        const node = layers.find((layer) => layer.id === nodeId)
        if (node) {
          copyToClipboard(node)
        }
        return
      }

      // Ctrl+V / Cmd+V: 粘贴节点（使用与右键菜单相同的逻辑）
      if (ctrlKey && key === "v" && clipboard) {
        event.preventDefault()
        
        // 使用最后一次鼠标点击的位置，如果没有则使用视图中心位置
        const lastClickPosition = useSandboxStore.getState().lastClickPosition
        let flowPosition: { x: number; y: number }
        
        if (lastClickPosition) {
          // 使用保存的最后一次点击位置
          flowPosition = lastClickPosition
        } else {
          // 如果没有保存的位置，使用视图中心位置
          const screenCenter = {
            x: typeof window !== "undefined" ? window.innerWidth / 2 : 400,
            y: typeof window !== "undefined" ? window.innerHeight / 2 : 300,
          }
          flowPosition = canvasActionsRef.current?.screenToFlowPosition?.(screenCenter) || { x: 400, y: 300 }
        }
        
        // 使用与右键菜单相同的粘贴逻辑
        const pasteNodeAtPosition = useSandboxStore.getState().pasteNodeAtPosition
        pasteNodeAtPosition(flowPosition)
        return
      }

      // Ctrl+Z / Cmd+Z: 撤销
      if (ctrlKey && key === "z" && !event.shiftKey) {
        event.preventDefault()
        if (canUndo()) {
          undo()
        }
        return
      }

      // Ctrl+Y / Cmd+Y 或 Ctrl+Shift+Z / Cmd+Shift+Z: 重做
      if ((ctrlKey && key === "y") || (ctrlKey && key === "z" && event.shiftKey)) {
        event.preventDefault()
        if (canRedo()) {
          redo()
        }
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
    layers,
    contextMenu.isOpen,
    closeContextMenu,
    canvasActionsRef,
    copyToClipboard,
    clipboard,
    undo,
    redo,
    canUndo,
    canRedo,
  ])
}

