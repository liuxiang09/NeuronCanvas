"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

/**
 * 键盘快捷键配置
 */
const shortcuts = {
  // 侧边栏控制
  closeSidebar: "Escape",
  
  // 画布控制
  zoomIn: "=",      // + 键（不需要按 Shift）
  zoomOut: "-",
  fitView: "f",
}

/**
 * 全局键盘快捷键处理
 */
interface UseKeyboardShortcutsOptions {
  onZoomIn?: () => void
  onZoomOut?: () => void
  onFitView?: () => void
}

export function useKeyboardShortcuts(options?: UseKeyboardShortcutsOptions) {
  const closeSidebar = useAppStore((state) => state.closeSidebar)

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

      // 侧边栏快捷键
      if (key === "escape") {
        event.preventDefault()
        closeSidebar()
      }
      // 画布快捷键
      else if (key === "=" || key === "+") {
        event.preventDefault()
        options?.onZoomIn?.()
      } else if (key === "-" || key === "_") {
        event.preventDefault()
        options?.onZoomOut?.()
      } else if (key === "f") {
        event.preventDefault()
        options?.onFitView?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [closeSidebar, options])
}

/**
 * 快捷键提示组件
 */
export function KeyboardShortcuts() {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold">键盘快捷键</h4>
      <div className="space-y-1.5 text-xs">
        <ShortcutItem keys={["ESC"]} description="关闭侧边栏" />
        <ShortcutItem keys={["+"]} description="放大画布" />
        <ShortcutItem keys={["-"]} description="缩小画布" />
        <ShortcutItem keys={["F"]} description="适配视图" />
      </div>
    </div>
  )
}

function ShortcutItem({ keys, description }: { keys: string[]; description: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{description}</span>
      <div className="flex gap-1">
        {keys.map((key) => (
          <kbd
            key={key}
            className="px-2 py-0.5 text-xs font-semibold bg-muted border border-border rounded"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  )
}
