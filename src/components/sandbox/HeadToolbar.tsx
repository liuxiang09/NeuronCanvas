/**
 * HeadToolbar - 操作工具栏
 * 
 * 功能说明：
 * - 提供sandbox编辑器的顶部工具栏
 * - 包含文件操作（导入、导出、保存）
 * - 包含编辑操作（自动布局、清空画布）
 * - 显示当前画布的状态信息（节点数量、连接数量）
 */

"use client"

import { useCallback } from "react"
import {
  Trash2,
  Layout,
  Download,
  Upload,
  Save,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSandboxStore } from "@/lib/sandboxStore"

interface HeadToolbarProps {
  className?: string
}

/**
 * HeadToolbar - 操作工具栏
 * 顶部工具栏，包含清空画布、自动布局、导入/导出等操作
 */
export function HeadToolbar({ className = "" }: HeadToolbarProps) {
  const layers = useSandboxStore((state) => state.layers)
  const edges = useSandboxStore((state) => state.edges)
  const clearModel = useSandboxStore((state) => state.clearModel)
  const showConfirmDialog = useSandboxStore((state) => state.showConfirmDialog)
  const openImportDialog = useSandboxStore((state) => state.openImportDialog)
  const openExportDialog = useSandboxStore((state) => state.openExportDialog)
  const saveToStorage = useSandboxStore((state) => state.saveToStorage)
  const needsSave = useSandboxStore((state) => state.needsSave)
  const canvasActionsRef = useSandboxStore((state) => state.canvasActionsRef)

  // 清空画布
  const handleClear = useCallback(() => {
    if (layers.length === 0) return

    showConfirmDialog(
      "确认清空",
      "确定要清空画布吗？此操作无法撤销。",
      () => {
        clearModel()
      }
    )
  }, [layers.length, showConfirmDialog, clearModel])

  // 自动布局
  const handleAutoLayout = useCallback(() => {
    if (layers.length === 0) return
    canvasActionsRef.current?.autoLayout?.()
  }, [layers.length, canvasActionsRef])

  // 保存到localStorage
  const handleSave = useCallback(() => {
    saveToStorage()
  }, [saveToStorage])

  return (
    <div
      className={`h-14 bg-background border-b border-border flex items-center gap-2 px-4 ${className}`}
    >
      {/* 文件操作 */}
      <div className="flex items-center gap-2 border-r border-border pr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={openImportDialog}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          导入
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={openExportDialog}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          导出
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSave}
          className="gap-2"
          disabled={!needsSave}
        >
          <Save className="h-4 w-4" />
          保存
          {needsSave && (
            <span className="ml-1 h-2 w-2 rounded-full bg-primary" />
          )}
        </Button>
      </div>

      {/* 编辑操作 */}
      <div className="flex items-center gap-2 border-r border-border pr-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAutoLayout}
          className="gap-2"
          disabled={layers.length === 0}
        >
          <Layout className="h-4 w-4" />
          自动布局
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClear}
          className="gap-2 text-destructive hover:text-destructive"
          disabled={layers.length === 0}
        >
          <Trash2 className="h-4 w-4" />
          清空
        </Button>
      </div>

      {/* 状态信息 */}
      <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
        <span>节点: {layers.length}</span>
        <span>连接: {edges.length}</span>
      </div>
    </div>
  )
}

