/**
 * ContextMenu - 右键上下文菜单
 * 
 * 功能说明：
 * - 在画布空白处右键显示节点类型列表，可以添加节点
 * - 在节点上右键显示节点操作菜单（删除等）
 * - 右键添加节点时，节点会添加到鼠标位置
 * - 支持点击外部区域关闭菜单
 */

"use client"

import { useCallback, useEffect, useRef } from "react"
import { Plus } from "lucide-react"
import { useSandboxStore } from "@/lib/sandbox/sandboxStore"
import { createNodeByType, getAvailableNodeTypes } from "@/lib/sandbox/nodeFactory"
import { getNodeTypeName } from "@/lib/fieldMapping"
import type { LayerType } from "@/lib/types"

/**
 * ContextMenu - 右键上下文菜单
 * 在画布空白处或节点上右键显示上下文菜单
 */
export function ContextMenu() {
  const contextMenu = useSandboxStore((state) => state.contextMenu)
  const closeContextMenu = useSandboxStore((state) => state.closeContextMenu)
  const addLayer = useSandboxStore((state) => state.addLayer)
  const removeLayer = useSandboxStore((state) => state.removeLayer)
  const showConfirmDialog = useSandboxStore((state) => state.showConfirmDialog)
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    if (!contextMenu.isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeContextMenu()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [contextMenu.isOpen, closeContextMenu])

  // 添加节点（使用右键菜单的位置）
  const handleAddNode = useCallback(
    (type: LayerType) => {
      const newNode = createNodeByType(type)
      addLayer(newNode)
      
      // 使用右键菜单保存的画布坐标位置
      if (contextMenu.flowPosition) {
        const setNodePosition = useSandboxStore.getState().setNodePosition
        setNodePosition(newNode.id, contextMenu.flowPosition)
      }
      
      closeContextMenu()
    },
    [addLayer, closeContextMenu, contextMenu.flowPosition]
  )

  // 删除节点
  const handleDeleteNode = useCallback(() => {
    if (!contextMenu.nodeId) return

    showConfirmDialog(
      "确认删除",
      "确定要删除此节点吗？删除节点将同时删除相关的连接。",
      () => {
        removeLayer(contextMenu.nodeId!)
        closeContextMenu()
      }
    )
  }, [contextMenu.nodeId, showConfirmDialog, removeLayer, closeContextMenu])

  if (!contextMenu.isOpen) return null

  const nodeTypes = getAvailableNodeTypes()

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-background border border-border rounded-lg shadow-lg py-2 min-w-[200px]"
      style={{
        left: `${contextMenu.x}px`,
        top: `${contextMenu.y}px`,
      }}
    >
      {contextMenu.nodeId ? (
        // 节点右键菜单
        <div>
          <button
            onClick={handleDeleteNode}
            className="w-full px-4 py-2 text-left text-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            删除节点
          </button>
        </div>
      ) : (
        // 画布右键菜单 - 添加节点
        <div>
          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground uppercase">
            添加节点
          </div>
          <div className="max-h-64 overflow-y-auto">
            {nodeTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleAddNode(type)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-muted transition-colors flex items-center gap-2"
              >
                <Plus className="h-3 w-3" />
                {getNodeTypeName(type)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

