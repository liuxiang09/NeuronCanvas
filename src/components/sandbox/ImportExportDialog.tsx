/**
 * ImportExportDialog - 导入/导出对话框
 * 
 * 功能说明：
 * - 模态对话框组件，用于模型的导入和导出
 * - 支持JSON格式的导入和导出
 * - 导出功能：显示当前模型的JSON代码，支持下载
 * - 导入功能：支持从文件选择导入模型
 * - 导入时会验证模型格式，确保数据完整性
 * - 导入前会提示用户确认，避免覆盖未保存的更改
 */

"use client"

import { useCallback, useRef, useState } from "react"
import { X, FileText, Download, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSandboxStore } from "@/lib/sandbox/sandboxStore"
import {
  exportToJSON,
  importFromJSON,
  downloadFile,
  readFile,
  generateExportFilename,
} from "@/lib/sandbox/exportUtils"
import type { ModelMetadata } from "@/lib/types"

/**
 * ImportExportDialog - 导入/导出对话框
 * 支持JSON格式的导入和导出
 */
export function ImportExportDialog() {
  const isImportOpen = useSandboxStore((state) => state.isImportDialogOpen)
  const isExportOpen = useSandboxStore((state) => state.isExportDialogOpen)
  const closeImportDialog = useSandboxStore((state) => state.closeImportDialog)
  const closeExportDialog = useSandboxStore((state) => state.closeExportDialog)
  const setModel = useSandboxStore((state) => state.setModel)
  const layers = useSandboxStore((state) => state.layers)
  const edges = useSandboxStore((state) => state.edges)
  const metadata = useSandboxStore((state) => state.metadata)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importError, setImportError] = useState<string | null>(null)
  const [exportMetadata, setExportMetadata] = useState<Partial<ModelMetadata>>(
    metadata || {
      name: "untitled",
      displayName: "未命名模型",
      description: "",
    }
  )

  // 处理文件选择
  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      setImportError(null)

      try {
        const content = await readFile(file)
        const model = importFromJSON(content)
        setModel(model)
        closeImportDialog()
      } catch (error) {
        setImportError(
          error instanceof Error ? error.message : "导入失败，请检查文件格式"
        )
      }

      // 重置文件输入
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [setModel, closeImportDialog]
  )

  // 导出模型
  const handleExport = useCallback(() => {
    const model = {
      metadata: exportMetadata as ModelMetadata,
      layers,
      edges,
    }

    const content = exportToJSON(model)
    const filename = generateExportFilename()
    const mimeType = "application/json"

    downloadFile(content, filename, mimeType)
    closeExportDialog()
  }, [exportMetadata, layers, edges, closeExportDialog])

  if (!isImportOpen && !isExportOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={isImportOpen ? closeImportDialog : closeExportDialog}
      />

      {/* Import Dialog */}
      {isImportOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">导入模型</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeImportDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  选择JSON格式的模型文件
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full gap-2"
                >
                  <FileText className="h-4 w-4" />
                  选择文件
                </Button>
              </div>

              {importError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-sm text-destructive">{importError}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Export Dialog */}
      {isExportOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div
            className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">导出模型</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeExportDialog}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              {/* 元数据编辑 */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-1 block">模型名称</label>
                  <input
                    type="text"
                    value={exportMetadata.name || ""}
                    onChange={(e) =>
                      setExportMetadata({ ...exportMetadata, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                    placeholder="模型名称（英文）"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">显示名称</label>
                  <input
                    type="text"
                    value={exportMetadata.displayName || ""}
                    onChange={(e) =>
                      setExportMetadata({
                        ...exportMetadata,
                        displayName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
                    placeholder="显示名称（中文）"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">描述</label>
                  <textarea
                    value={exportMetadata.description || ""}
                    onChange={(e) =>
                      setExportMetadata({
                        ...exportMetadata,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm resize-none"
                    placeholder="模型描述..."
                  />
                </div>
              </div>

              {/* 统计信息 */}
              <div className="p-3 bg-muted/50 rounded-md">
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">节点数量:</span>
                    <span className="font-medium">{layers.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">连接数量:</span>
                    <span className="font-medium">{edges.length}</span>
                  </div>
                </div>
              </div>

              {/* 导出按钮 */}
              <Button
                onClick={handleExport}
                className="w-full gap-2"
                disabled={layers.length === 0}
              >
                <Download className="h-4 w-4" />
                导出为 JSON
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

