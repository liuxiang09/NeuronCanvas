"use client"

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { sectionMetadata, type ModelSection, type ModelData } from "@/lib/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// 动态导入模型可视化工厂
const ModelVisualizerFactory = dynamic(
  () => import("./ModelVisualizerFactory").then(mod => ({ default: mod.ModelVisualizerFactory })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">正在加载 3D 可视化...</p>
        </div>
      </div>
    )
  }
);

// 动态导入章节组件 - LeNet
const LeNet5DataPipeline = dynamic(
  () => import("./models/LeNet").then(mod => ({ default: mod.LeNet5DataPipeline })),
  { ssr: false }
);

const LeNet5Training = dynamic(
  () => import("./models/LeNet").then(mod => ({ default: mod.LeNet5Training })),
  { ssr: false }
);

const LeNet5Innovations = dynamic(
  () => import("./models/LeNet").then(mod => ({ default: mod.LeNet5Innovations })),
  { ssr: false }
);

// 动态导入章节组件 - AlexNet
const AlexNetDataPipeline = dynamic(
  () => import("./models/AlexNet").then(mod => ({ default: mod.AlexNetDataPipeline })),
  { ssr: false }
);

const AlexNetTraining = dynamic(
  () => import("./models/AlexNet").then(mod => ({ default: mod.AlexNetTraining })),
  { ssr: false }
);

const AlexNetInnovations = dynamic(
  () => import("./models/AlexNet").then(mod => ({ default: mod.AlexNetInnovations })),
  { ssr: false }
);

interface ModelContentProps {
  modelSlug: string;
  model: ModelData;
  availableSections: ModelSection[];
  hasVisualization: boolean;
}

export function ModelContent({ 
  modelSlug, 
  model, 
  availableSections, 
  hasVisualization 
}: ModelContentProps) {
  const defaultSection = availableSections[0];
  
  // 根据sections数量动态设置grid列数
  const getGridCols = (count: number) => {
    switch (count) {
      case 1: return "grid-cols-1";
      case 2: return "grid-cols-2";
      case 3: return "grid-cols-3";
      case 4: return "grid-cols-4";
      case 5: return "grid-cols-5";
      default: return "grid-cols-4";
    }
  };

  return (
    <Tabs defaultValue={defaultSection} className="flex-1 flex flex-col overflow-hidden">
      {/* Tab 选项卡 */}
      <div className="border-b bg-background">
        <div className="container py-3">
          <TabsList className={`w-full grid ${getGridCols(availableSections.length)} h-auto gap-1`}>
            {availableSections.map((section) => {
              const meta = sectionMetadata[section];
              return (
                <TabsTrigger key={section} value={section} className="flex-1 py-3 px-4 text-sm font-medium">
                  {meta.icon && <span className="mr-2">{meta.icon}</span>}
                  {meta.label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      </div>

      {/* Tab 内容区域 */}
      <div className="flex-1 relative overflow-hidden">
        {/* 架构可视化 */}
        <TabsContent value="architecture" className="h-full m-0">
          {hasVisualization ? (
            <ModelVisualizerFactory modelSlug={modelSlug} />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/30">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">🚧</div>
                <h2 className="text-2xl font-bold">即将推出</h2>
                <p className="text-muted-foreground max-w-md">
                  <span className="font-semibold text-foreground">{model.name}</span> 的
                  3D 可视化正在开发中。敬请期待！
                </p>
                <p className="text-sm text-muted-foreground">
                  目前您可以查看 <Link href="/gallery/lenet-5" className="text-primary hover:underline">LeNet-5</Link> 的完整可视化。
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 数据处理流程 */}
        <TabsContent value="data-pipeline" className="h-full m-0">
          {modelSlug === 'lenet-5' ? (
            <LeNet5DataPipeline />
          ) : modelSlug === 'alexnet' ? (
            <AlexNetDataPipeline />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/30">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">📊</div>
                <h2 className="text-2xl font-bold">数据处理流程</h2>
                <p className="text-muted-foreground max-w-md">
                  展示 {model.name} 的输入数据预处理、数据增强等流程
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 训练过程 */}
        <TabsContent value="training" className="h-full m-0">
          {modelSlug === 'lenet-5' ? (
            <LeNet5Training />
          ) : modelSlug === 'alexnet' ? (
            <AlexNetTraining />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/30">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">🎯</div>
                <h2 className="text-2xl font-bold">训练过程</h2>
                <p className="text-muted-foreground max-w-md">
                  展示训练技巧、超参数配置、损失曲线、学习率策略等
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 核心创新 */}
        <TabsContent value="innovations" className="h-full m-0">
          {modelSlug === 'lenet-5' ? (
            <LeNet5Innovations />
          ) : modelSlug === 'alexnet' ? (
            <AlexNetInnovations />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/30">
              <div className="text-center space-y-4 p-8">
                <div className="text-6xl">💡</div>
                <h2 className="text-2xl font-bold">核心创新</h2>
                <p className="text-muted-foreground max-w-md">
                  深入讲解 {model.name} 的关键技术贡献和创新点
                </p>
              </div>
            </div>
          )}
        </TabsContent>

        {/* 实验结果 */}
        <TabsContent value="results" className="h-full m-0">
          <div className="h-full flex items-center justify-center bg-muted/30">
            <div className="text-center space-y-4 p-8">
              <div className="text-6xl">📈</div>
              <h2 className="text-2xl font-bold">实验结果</h2>
              <p className="text-muted-foreground max-w-md">
                展示在不同数据集上的性能表现和对比分析
              </p>
            </div>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  );
}
