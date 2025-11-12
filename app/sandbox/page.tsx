/**
 * Sandbox主页面
 * 
 * 功能说明：
 * - sandbox模块的主入口页面，整合所有sandbox相关组件
 * - 布局结构：顶部工具栏 + 左侧节点库 + 中间画布 + 右侧属性面板
 * - 自动加载本地存储的模型数据（localStorage）
 * - 自动保存功能：3秒无操作后自动保存到localStorage
 * - 启用sandbox相关的键盘快捷键
 * - 管理所有对话框和上下文菜单的显示状态
 * - 这是用户与sandbox编辑器交互的主要界面
 */

"use client"

import { useEffect, useCallback } from "react"
import { SandboxCanvas } from "@/components/sandbox/SandboxCanvas"
import { NodeToolbar } from "@/components/sandbox/NodeToolbar"
import { PropertyPanel } from "@/components/sandbox/PropertyPanel"
import { Toolbar } from "@/components/sandbox/Toolbar"
import { ImportExportDialog } from "@/components/sandbox/ImportExportDialog"
import { ConfirmDialog } from "@/components/sandbox/ConfirmDialog"
import { ContextMenu } from "@/components/sandbox/ContextMenu"
import { useSandboxStore } from "@/lib/sandbox/sandboxStore"
import { useSandboxShortcuts } from "@/lib/hooks/useSandboxShortcuts"

/**
 * Sandbox主页面
 * 整合所有组件，实现完整的编辑流程
 */
export default function SandboxPage() {
  // 加载本地存储的数据
  const loadFromStorage = useSandboxStore((state) => state.loadFromStorage)

  // 初始化时加载本地存储
  useEffect(() => {
    loadFromStorage()
  }, [loadFromStorage])

  // 启用快捷键
  useSandboxShortcuts()

  // 自动保存（延迟保存，3秒无操作后保存）
  const needsSave = useSandboxStore((state) => state.needsSave)
  const saveToStorage = useSandboxStore((state) => state.saveToStorage)
  const setNeedsSave = useSandboxStore((state) => state.setNeedsSave)

  useEffect(() => {
    if (!needsSave) return

    const timer = setTimeout(() => {
      saveToStorage()
    }, 3000)

    return () => clearTimeout(timer)
  }, [needsSave, saveToStorage])

  // 自动布局处理函数
  const handleAutoLayout = useCallback(() => {
    // 自动布局会在SandboxCanvas中通过calculateLayout自动处理
    // 这里只需要触发重新渲染
  }, [])

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* 顶部工具栏 */}
      <Toolbar />

      {/* 主内容区域 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧节点工具栏 */}
        <NodeToolbar />

        {/* 中间画布区域 */}
        <div className="flex-1 relative">
          <SandboxCanvas />
        </div>

        {/* 右侧属性面板 */}
        <PropertyPanel />
      </div>

      {/* 对话框组件 */}
      <ImportExportDialog />
      <ConfirmDialog />
      <ContextMenu />
    </div>
  )
}
