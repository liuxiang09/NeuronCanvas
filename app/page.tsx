import Link from "next/link"
import { ArrowRight, Sparkles, Layout, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="container max-w-screen-2xl px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">开源 · 现代 · 优雅</span>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            <span className="block">让深度学习</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              可见且优雅
            </span>
          </h1>

          {/* Description */}
          <p className="mb-10 text-lg text-muted-foreground sm:text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            NeuronCanvas 是一个视觉驱动的深度学习教育平台,
            以精美的交互式画布呈现经典神经网络架构
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" asChild className="text-base px-8 h-12 shadow-lg shadow-primary/20">
              <Link href="/gallery">
                探索模型画廊
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 h-12">
              <Link href="/models/lenet">
                查看 LeNet-5
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border bg-muted/30">
        <div className="container max-w-screen-2xl px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-8 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-blue-500/10">
                <Layout className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                精美的可视化
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                每个神经网络层都被设计为精致的自定义节点,配合流畅的动画和清晰的排版
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-8 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-purple-500/10">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                交互式学习
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                点击、缩放、探索。通过直观的交互深入了解每一层的参数和功能
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group relative overflow-hidden rounded-xl border border-border bg-background p-8 transition-all hover:shadow-lg hover:shadow-primary/5">
              <div className="mb-4 inline-flex p-3 rounded-lg bg-pink-500/10">
                <Sparkles className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="mb-3 text-xl font-semibold">
                经典架构收录
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                从 LeNet 到 Transformer,涵盖深度学习发展史上的里程碑式架构
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border">
        <div className="container max-w-screen-2xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
              准备好开始探索了吗?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              从经典的 LeNet-5 开始你的视觉化学习之旅
            </p>
            <Button size="lg" asChild className="text-base px-8 h-12">
              <Link href="/models/lenet">
                查看 LeNet-5
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
