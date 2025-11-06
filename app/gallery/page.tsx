import Link from "next/link";
import { modelsData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Tag } from "lucide-react";

/**
 * 模型画廊页面 - 展示所有经典深度学习模型的卡片列表
 * 
 * 设计理念：
 * - 使用网格布局展示所有模型
 * - 每个模型卡片包含名称、描述、年份和标签
 * - 点击卡片可以进入该模型的详细可视化页面
 */
export default function GalleryPage() {
  return (
    <div className="container py-12">
      {/* 页面头部 */}
      <div className="mb-12 space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">模型画廊</h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          探索深度学习历史上的里程碑模型。每个模型都配有交互式动画，
          帮助你理解从数据输入到最终预测的完整流程。
        </p>
      </div>

      {/* 模型卡片网格 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modelsData.map((model) => (
          <Card 
            key={model.id} 
            className="group hover:border-primary/50 transition-all cursor-pointer"
          >
            <Link href={`/gallery/${model.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {model.name}
                  </CardTitle>
                  <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                    {model.category}
                  </span>
                </div>
                <CardDescription className="line-clamp-3">
                  {model.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                    >
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="flex items-center justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1.5 h-4 w-4" />
                  {model.year}
                </div>
                <Button variant="ghost" size="sm" className="group/btn">
                  查看详情
                  <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </Button>
              </CardFooter>
            </Link>
          </Card>
        ))}
      </div>

      {/* 页面底部提示 */}
      <div className="mt-12 rounded-lg border bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          更多经典模型正在开发中...
          <Link href="https://github.com/yourusername/neuroncanvas" className="ml-1 text-primary hover:underline">
            欢迎贡献
          </Link>
        </p>
      </div>
    </div>
  );
}
