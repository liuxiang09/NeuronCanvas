"use client";

import { Layers, Activity, Box, Droplet, Grid3x3, Zap } from "lucide-react";
import { useSandboxStore } from "@/store/sandboxStore";

/**
 * 可用的神经网络组件列表
 */
const components = [
  {
    type: "input" as const,
    label: "输入层",
    icon: Grid3x3,
    description: "数据输入",
    defaultProperties: { shape: [224, 224, 3] },
  },
  {
    type: "conv2d" as const,
    label: "卷积层",
    icon: Layers,
    description: "2D 卷积",
    defaultProperties: { filters: 32, kernelSize: 3, stride: 1 },
  },
  {
    type: "activation" as const,
    label: "激活函数",
    icon: Zap,
    description: "ReLU, Sigmoid...",
    defaultProperties: { function: "relu" },
  },
  {
    type: "pooling" as const,
    label: "池化层",
    icon: Box,
    description: "MaxPool, AvgPool",
    defaultProperties: { poolSize: 2, stride: 2 },
  },
  {
    type: "dense" as const,
    label: "全连接层",
    icon: Activity,
    description: "Dense / FC",
    defaultProperties: { units: 128 },
  },
  {
    type: "dropout" as const,
    label: "Dropout",
    icon: Droplet,
    description: "正则化",
    defaultProperties: { rate: 0.5 },
  },
];

/**
 * ComponentPalette - 左侧组件面板
 * 
 * 设计理念：
 * - 展示所有可用的神经网络组件
 * - 用户可以点击或拖拽组件到画布上
 * - 每个组件卡片包含图标、名称和简短描述
 */
export function ComponentPalette() {
  const addNode = useSandboxStore((state) => state.addNode);

  const handleAddComponent = (component: typeof components[0]) => {
    // 在画布中心添加新节点
    addNode({
      type: component.type,
      label: component.label,
      position: { x: 400, y: 300 }, // 默认位置
      properties: component.defaultProperties,
    });
  };

  return (
    <div className="h-full border-r bg-muted/30 p-4 overflow-y-auto">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-sm mb-2">组件库</h3>
          <p className="text-xs text-muted-foreground">
            点击或拖拽组件到画布上
          </p>
        </div>

        <div className="space-y-2">
          {components.map((component) => {
            const Icon = component.icon;
            return (
              <button
                key={component.type}
                onClick={() => handleAddComponent(component)}
                className="w-full flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent transition-colors text-left group"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("componentType", component.type);
                }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm">{component.label}</div>
                  <div className="text-xs text-muted-foreground">
                    {component.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* 提示信息 */}
        <div className="mt-6 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <p className="text-xs text-blue-900 dark:text-blue-300">
            💡 提示：点击组件添加到画布，或拖拽到指定位置
          </p>
        </div>
      </div>
    </div>
  );
}
