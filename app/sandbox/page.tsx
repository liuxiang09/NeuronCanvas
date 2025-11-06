"use client";

import { ComponentPalette } from "./_components/ComponentPalette";
import { Canvas } from "./_components/Canvas";
import { PropertiesInspector } from "./_components/PropertiesInspector";

/**
 * 沙盒页面 - NeuronCanvas 的交互式模型构建工具
 * 
 * 设计理念：
 * - 经典的三栏布局
 * - 左侧：组件面板（可拖拽的基础神经网络层）
 * - 中间：画布（拖放和连接组件）
 * - 右侧：属性检查器（查看和编辑选中组件的参数）
 * 
 * 技术实现：
 * - 使用 Zustand 管理全局状态
 * - 支持拖拽交互
 * - 实时计算张量形状（待实现）
 * - 导出代码功能（待实现）
 */
export default function SandboxPage() {
  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      {/* 页面标题栏 */}
      <div className="border-b bg-background">
        <div className="container flex h-14 items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold">沙盒工具</h1>
            <p className="text-xs text-muted-foreground">
              拖拽组件构建你的神经网络
            </p>
          </div>
          
          {/* TODO: 添加工具栏按钮（保存、导出代码等） */}
          <div className="flex items-center gap-2">
            {/* <Button variant="outline" size="sm">保存</Button> */}
            {/* <Button variant="outline" size="sm">导出代码</Button> */}
          </div>
        </div>
      </div>

      {/* 三栏布局 */}
      <div className="flex-1 grid grid-cols-[250px_1fr_300px] overflow-hidden">
        {/* 左侧：组件面板 */}
        <ComponentPalette />

        {/* 中间：画布 */}
        <Canvas />

        {/* 右侧：属性检查器 */}
        <PropertiesInspector />
      </div>
    </div>
  );
}
