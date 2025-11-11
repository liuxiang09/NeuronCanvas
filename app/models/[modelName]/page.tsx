"use client"

import { useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, Users, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"
import { ModelCanvas } from "@/components/canvas"
import { Sidebar } from "@/components/layout/Sidebar"
import { Button } from "@/components/ui/button"
import { calculateLayout } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { useKeyboardShortcuts } from "@/lib/hooks/useKeyboardShortcuts"
import { getModelByName } from "@/lib/modelRegistry"
import type { Model } from "@/lib/types"

export default function ModelPage() {
  const params = useParams()
  const modelName = params.modelName as string

  // 获取模型数据
  const model = getModelByName(modelName)

  // 从 Zustand store 获取状态
  const selectedNode = useAppStore((state) => state.selectedNode)
  const setSelectedNode = useAppStore((state) => state.setSelectedNode)
  const isSidebarOpen = useAppStore((state) => state.isSidebarOpen)
  const closeSidebar = useAppStore((state) => state.closeSidebar)
  const reset = useAppStore((state) => state.reset)

  // 画布操作引用（将在 ModelCanvas 中设置）
  const canvasActionsRef = useAppStore((state) => state.canvasActionsRef)

  // 启用键盘快捷键，传入画布操作
  useKeyboardShortcuts({
    onZoomIn: () => canvasActionsRef.current?.zoomIn?.(),
    onZoomOut: () => canvasActionsRef.current?.zoomOut?.(),
    onFitView: () => canvasActionsRef.current?.fitView?.(),
  })

  // 组件卸载时重置状态
  useEffect(() => {
    return () => {
      reset()
    }
  }, [reset])

  // 如果模型不存在
  if (!model) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-muted-foreground">
            模型未找到
          </h1>
          <p className="text-muted-foreground">
            模型 "{modelName}" 不存在
          </p>
          <Button asChild>
            <Link href="/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              返回画廊
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  // 使用 Dagre 计算从左到右的布局
  // 所有布局配置在 utils.ts 中统一管理,避免在此处覆盖
  const { nodes, edges } = calculateLayout(model.layers, model.edges)

  // 节点点击处理
  const handleNodeClick = (node: any) => {
    setSelectedNode(node.data)
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row">
      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col">
        {/* 模型信息头部 */}
        <div className="border-b border-border bg-background">
          <div className="container max-w-screen-2xl py-6 px-4">
            {/* 返回按钮 */}
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href="/gallery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回画廊
              </Link>
            </Button>

            {/* 模型标题 */}
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">
                  {model.metadata.displayName}
                </h1>
                <p className="text-muted-foreground max-w-3xl">
                  {model.metadata.description}
                </p>
              </div>

              {/* 查看详情按钮 (移动端) */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => useAppStore.getState().openSidebar()}
                className="lg:hidden"
              >
                查看详情
              </Button>
            </div>

            {/* 元数据标签 */}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {model.metadata.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{model.metadata.year}</span>
                </div>
              )}

              {model.metadata.authors && model.metadata.authors.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" />
                  <span>{model.metadata.authors.join(", ")}</span>
                </div>
              )}

              {model.metadata.category && (
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{model.metadata.category}</span>
                </div>
              )}

              {model.metadata.paper && (
                <a
                  href={model.metadata.paper}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>查看论文</span>
                </a>
              )}
            </div>

            {/* 标签 */}
            {model.metadata.tags && model.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {model.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 画布区域 */}
        <div className="flex-1 relative">
          <ModelCanvas
            nodes={nodes}
            edges={edges}
            onNodeClick={handleNodeClick}
            modelName={model.metadata.displayName}
          />
        </div>
      </div>

      {/* 侧边栏 */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={closeSidebar}
        selectedNode={selectedNode}
      />
    </div>
  )
}
