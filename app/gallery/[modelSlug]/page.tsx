import { notFound } from "next/navigation";
import Link from "next/link";
import { getModelById, type ModelSection } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ModelContent } from "./_components/ModelContent";

/**
 * 单个模型详情页 - 展示特定模型的可视化动画和详细信息
 * 
 * 设计理念：
 * - 主区域：交互式 3D 可视化（使用 Three.js + React Three Fiber）
 * - 信息面板：点击层后显示详细参数
 * - 控制面板：播放/暂停/重置动画
 * 
 * 当前实现：LeNet-5 的完整 3D 可视化
 */
export default async function ModelDetailPage({ 
  params 
}: { 
  params: Promise<{ modelSlug: string }> 
}) {
  const { modelSlug } = await params;
  const model = getModelById(modelSlug);

  // 如果模型不存在，返回 404
  if (!model) {
    notFound();
  }

  // 获取模型支持的章节，如果没有配置则只显示架构
  const availableSections: ModelSection[] = model.sections || ["architecture"];
  const defaultSection = availableSections[0];
  
  // 检查是否有可用的 3D 可视化
  const hasVisualization = modelSlug === 'lenet-5' || modelSlug === 'alexnet';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* 顶部导航栏 */}
      <div className="border-b bg-background">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/gallery">
                <ArrowLeft className="mr-2 h-4 w-4" />
                返回画廊
              </Link>
            </Button>
            <div className="h-6 w-px bg-border" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{model.name}</h1>
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary cursor-pointer hover:bg-primary/20 transition-colors">
                  {model.year}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{model.category}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 主内容区域 */}
      <ModelContent 
        modelSlug={modelSlug}
        model={model}
        availableSections={availableSections}
        hasVisualization={hasVisualization}
      />
    </div>
  );
}
