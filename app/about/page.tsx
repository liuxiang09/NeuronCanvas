"use client"

import Link from "next/link"
import { Sparkles, BookOpen, Github } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-background via-primary/5 to-purple-500/5">
        <div className="container max-w-screen-2xl px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">开源 · 教育 · 可视化</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              关于 NeuronCanvas
            </h1>
            <p className="text-lg text-muted-foreground">
              一个致力于让深度学习更加直观和易于理解的开源可视化平台
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container max-w-4xl px-4 py-12">
        <div className="prose prose-gray dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-4">项目愿景</h2>
          <p className="text-muted-foreground mb-6">
            NeuronCanvas 旨在通过精美的可视化和交互式体验,帮助学生、研究者和开发者更好地理解深度学习架构。
            我们相信,复杂的概念可以通过优雅的设计变得简单易懂。
          </p>

          <h2 className="text-2xl font-bold mb-4 mt-8">核心特性</h2>
          <ul className="space-y-2 text-muted-foreground mb-6">
            <li>✨ 精美的自定义节点设计,每个层都有独特的视觉表现</li>
            <li>🎯 从左到右的水平布局,符合自然阅读习惯</li>
            <li>⚡ 流畅的交互体验,支持键盘快捷键和鼠标操作</li>
            <li>📊 详细的参数展示,帮助理解每一层的作用</li>
            <li>🌓 支持亮色/暗色主题</li>
            <li>📱 完全响应式设计,支持各种设备</li>
          </ul>

          <h2 className="text-2xl font-bold mb-4 mt-8">技术栈</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <TechCard name="Next.js 14" category="框架" />
            <TechCard name="TypeScript" category="语言" />
            <TechCard name="React Flow" category="可视化" />
            <TechCard name="Dagre" category="布局引擎" />
            <TechCard name="Tailwind CSS" category="样式" />
            <TechCard name="Zustand" category="状态管理" />
          </div>

          <h2 className="text-2xl font-bold mb-4 mt-8">开源贡献</h2>
          <p className="text-muted-foreground mb-6">
            NeuronCanvas 是一个完全开源的项目,我们欢迎社区的贡献!
            无论是添加新模型、改进 UI、修复 bug 还是完善文档,都非常欢迎。
          </p>

          <div className="flex gap-4">
            <Button asChild>
              <a
                href="https://github.com/anwrog/NeuronCanvas"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub 仓库
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/gallery">
                <BookOpen className="mr-2 h-4 w-4" />
                浏览模型
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function TechCard({ name, category }: { name: string; category: string }) {
  return (
    <div className="p-4 rounded-lg border border-border bg-background">
      <p className="font-semibold text-sm mb-1">{name}</p>
      <p className="text-xs text-muted-foreground">{category}</p>
    </div>
  )
}
