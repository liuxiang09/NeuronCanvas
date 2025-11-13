/**
 * Resizer - 可拖动分隔条组件
 * 
 * 功能说明：
 * - 用于调整侧边栏宽度的可拖动分隔条
 * - 支持鼠标拖动调节宽度
 * - 提供视觉反馈（hover 状态、拖动时的样式）
 * - 支持最小/最大宽度限制
 */

"use client"

import { useCallback, useEffect, useRef, useState } from "react"

interface ResizerProps {
  onResize: (deltaX: number) => void
  direction?: "left" | "right" // 拖动方向：left 表示调整左侧宽度，right 表示调整右侧宽度
  className?: string
}

/**
 * Resizer - 可拖动分隔条组件
 */
export function Resizer({ onResize, direction = "left", className = "" }: ResizerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const startXRef = useRef<number>(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
      startXRef.current = e.clientX
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    },
    []
  )

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = direction === "left" 
        ? e.clientX - startXRef.current 
        : startXRef.current - e.clientX // 右侧拖动时方向相反
      onResize(deltaX)
      startXRef.current = e.clientX
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isDragging, onResize, direction])

  return (
    <div
      className={`
        w-1 h-full bg-border cursor-col-resize transition-colors
        hover:bg-primary/50
        ${isDragging ? "bg-primary" : ""}
        ${className}
      `}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      style={{
        userSelect: "none",
      }}
      role="separator"
      aria-label="调整侧边栏宽度"
    />
  )
}

