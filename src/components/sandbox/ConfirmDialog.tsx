/**
 * ConfirmDialog - 确认对话框组件
 * 
 * 功能说明：
 * - 统一的确认对话框组件，用于需要用户确认的危险操作
 * - 主要用于删除节点、清空画布等不可逆操作
 * - 显示操作标题和详细说明，帮助用户理解操作后果
 * - 提供"确定"和"取消"两个选项
 * - 通过sandboxStore统一管理对话框状态，简化使用
 * - 支持自定义确认和取消回调函数
 */

"use client"

import { Button } from "@/components/ui/button"
import { useSandboxStore } from "@/lib/sandbox/sandboxStore"
import { AlertTriangle } from "lucide-react"

/**
 * ConfirmDialog - 确认对话框组件
 * 统一的确认对话框，用于删除、清空等危险操作
 */
export function ConfirmDialog() {
  const confirmDialog = useSandboxStore((state) => state.confirmDialog)
  const closeConfirmDialog = useSandboxStore((state) => state.closeConfirmDialog)

  if (!confirmDialog.isOpen) return null

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm()
    }
    closeConfirmDialog()
  }

  const handleCancel = () => {
    if (confirmDialog.onCancel) {
      confirmDialog.onCancel()
    }
    closeConfirmDialog()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={handleCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-background border border-border rounded-lg shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 space-y-4">
            {/* Icon and Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-lg font-semibold">{confirmDialog.title}</h2>
            </div>

            {/* Message */}
            <div className="text-sm text-muted-foreground whitespace-pre-line">
              {confirmDialog.message}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={handleCancel}>
                取消
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                确认
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

