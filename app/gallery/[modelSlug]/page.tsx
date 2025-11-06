import { notFound } from "next/navigation";
import Link from "next/link";
import { getModelById } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, RotateCcw, Layers } from "lucide-react";

/**
 * 单个模型详情页 - 展示特定模型的可视化动画和详细信息
 * 
 * 设计理念：
 * - 主区域：大型可视化画布（目前是占位符，未来集成 D3.js/Three.js）
 * - 侧边栏：模型信息、控制面板（播放、暂停、步进等）
 * - 底部：分层详情（可以点击查看每一层的参数）
 * 
 * TODO: 在这里集成真正的可视化库来渲染模型动画
 */
export default function ModelDetailPage({ 
  params 
}: { 
  params: { modelSlug: string } 
}) {
  const model = getModelById(params.modelSlug);

  // 如果模型不存在，返回 404
  if (!model) {
    notFound();
  }

  return (
    <div className="container py-8">
      {/* 返回按钮 */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href="/gallery">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回画廊
          </Link>
        </Button>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        {/* 主可视化区域 */}
        <div className="space-y-6">
          {/* 模型标题和描述 */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{model.name}</h1>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                {model.year}
              </span>
            </div>
            <p className="text-lg text-muted-foreground">
              {model.description}
            </p>
          </div>

          {/* 可视化画布 - 占位符区域 */}
          <div className="relative rounded-xl border bg-muted/30 p-8 min-h-[600px] flex items-center justify-center grid-background">
            <div className="text-center space-y-4">
              <Layers className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <div className="space-y-2">
                <p className="text-xl font-semibold text-muted-foreground">
                  可视化动画占位区域
                </p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  这里将展示 <span className="font-semibold text-foreground">{model.name}</span> 的
                  交互式 3D 动画。您可以观看数据如何在网络中流动，
                  理解每一层的作用。
                </p>
              </div>
            </div>

            {/* TODO: 在这里集成可视化库 
                例如：
                - 使用 Three.js 渲染 3D 模型结构
                - 使用 D3.js 创建交互式数据流动画
                - 添加相机控制、缩放、旋转功能
            */}
          </div>

          {/* 播放控制栏 */}
          <div className="flex items-center justify-center gap-4 p-4 rounded-lg border bg-card">
            <Button variant="outline" size="icon">
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button size="icon">
              <Play className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Pause className="h-4 w-4" />
            </Button>
            <div className="flex-1 max-w-md">
              <input 
                type="range" 
                min="0" 
                max="100" 
                defaultValue="0"
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-muted"
              />
            </div>
          </div>
        </div>

        {/* 侧边栏：模型信息和图层列表 */}
        <div className="space-y-6">
          {/* 模型元信息 */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">模型信息</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">类别：</span>
                <span className="ml-2 font-medium">{model.category}</span>
              </div>
              <div>
                <span className="text-muted-foreground">发表年份：</span>
                <span className="ml-2 font-medium">{model.year}</span>
              </div>
              <div>
                <span className="text-muted-foreground">标签：</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 图层列表 - 占位符 */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">网络结构</h3>
            <p className="text-sm text-muted-foreground">
              点击任意图层查看详细参数和设计理念
            </p>
            
            {/* TODO: 这里应该动态生成该模型的实际图层列表 */}
            <div className="space-y-2">
              {["Input Layer", "Conv Layer 1", "ReLU", "MaxPool", "Conv Layer 2", "ReLU", "FC Layer", "Softmax"].map((layer, idx) => (
                <button
                  key={idx}
                  className="w-full text-left px-3 py-2 rounded-md border bg-muted/30 hover:bg-muted transition-colors text-sm"
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* 视角切换 */}
          <div className="rounded-lg border bg-card p-6 space-y-4">
            <h3 className="font-semibold text-lg">视角</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="w-full">
                2D 流程图
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                3D 视图
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
