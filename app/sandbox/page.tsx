"use client"

import Link from "next/link"
import { Construction, ArrowLeft, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SandboxPage() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="container max-w-2xl px-4 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
          <Construction className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4">沙盒模式</h1>
        <p className="text-lg text-muted-foreground mb-8">
          即将推出!在沙盒模式中,你将能够自由创建和编辑自己的神经网络架构。
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button asChild size="lg">
            <Link href="/gallery">
              <ArrowLeft className="mr-2 h-4 w-4" />
              浏览现有模型
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/">
              返回首页
            </Link>
          </Button>
        </div>

        <div className="border border-border rounded-lg p-6 bg-muted/30">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="font-semibold">计划中的功能</h3>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2 text-left max-w-md mx-auto">
            <li>• 拖拽添加各种类型的层</li>
            <li>• 自定义层的参数</li>
            <li>• 实时预览网络结构</li>
            <li>• 导出为 JSON 或代码</li>
            <li>• 分享你的架构设计</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
