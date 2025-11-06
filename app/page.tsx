import Link from "next/link";
import { ArrowRight, Sparkles, Boxes, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 首页 - NeuronCanvas 的落地页
 * 
 * 设计理念：
 * - Hero Section: 用渐变文字和动画效果吸引眼球
 * - 核心功能展示：通过卡片清晰展示两大功能模块
 * - 行动号召 (CTA)：引导用户进入模型画廊或沙盒
 */
export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - 英雄区 */}
      <section className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-background dark:to-purple-950/20" />
        <div className="absolute inset-0 -z-10 grid-background opacity-30" />
        
        <div className="container py-24 md:py-32 lg:py-40">
          <div className="mx-auto max-w-4xl text-center space-y-8 animate-fade-in">
            {/* 标签 */}
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="mr-2 h-4 w-4" />
              开源 · 交互式 · 教育性
            </div>

            {/* 主标题 */}
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              <span className="gradient-text">NeuronCanvas</span>
            </h1>
            
            {/* 副标题 */}
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              在浏览器中雕刻神经网络
            </p>

            {/* 描述 */}
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed">
              一个基于 Web 的深度学习可视化平台，通过交互式图形化展示，
              让复杂的神经网络的架构与原理变得<span className="font-semibold text-foreground">直观易懂</span>。
            </p>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" asChild className="group">
                <Link href="/gallery">
                  探索模型画廊
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sandbox">
                  打开沙盒工具
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - 核心功能展示 */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-4">
              两大核心功能
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              从经典模型的深度解析到自由创作的实验沙盒
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* 模型画廊卡片 */}
              <div className="group relative overflow-hidden rounded-xl border bg-card p-8 transition-all hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Boxes className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">模型画廊</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  交互式拆解经典深度学习模型的完整结构。从网络架构、数据处理流程、
                  到训练技巧和关键创新点，通过可缩放的 2D 可视化图形，让每一层的设计细节一目了然。
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    已实现：LeNet-5、AlexNet
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    支持点击层查看详情、缩放和水平拖动
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    多章节解析：架构、数据流、训练、创新点
                  </li>
                </ul>
                <Button variant="outline" asChild className="group/btn">
                  <Link href="/gallery">
                    开始探索
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* 沙盒工具卡片 */}
              <div className="group relative overflow-hidden rounded-xl border bg-card p-8 transition-all hover:shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-semibold">沙盒工具</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  你的神经网络创意工坊（开发中）。未来将支持通过拖拽卷积层、激活函数等基础组件，
                  自由搭建和探索模型架构，实时查看张量形状变化。
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    ⚙️ 可视化的拖拽式建模界面（规划中）
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    ⚙️ 实时计算和展示张量维度（规划中）
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-purple-600" />
                    ⚙️ 导出为 PyTorch / TensorFlow 代码（规划中）
                  </li>
                </ul>
                <Button variant="outline" asChild className="group/btn">
                  <Link href="/sandbox">
                    开始创作
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <h2 className="text-3xl font-bold">
              开源，持续成长
            </h2>
            <p className="text-lg text-muted-foreground">
              NeuronCanvas 是一个完全开源的教育项目。目前已实现 LeNet-5 和 AlexNet 的完整可视化，
              更多经典模型正在开发中。欢迎在 GitHub 上关注项目进展或贡献你的想法。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a
                  href="https://github.com/liuxiang09/NeuronCanvas"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  在 GitHub 上查看项目
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gallery">
                  立即体验
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
