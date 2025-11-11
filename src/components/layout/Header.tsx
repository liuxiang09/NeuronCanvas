"use client"
/*
应用的头部组件，包含 Logo、导航链接和外部资源链接。
*/
import Link from "next/link"
import { Brain, Github, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 mr-6 transition-opacity hover:opacity-80">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg blur-sm opacity-60"></div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-lg">
              <Brain className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NeuronCanvas
            </span>
            <span className="text-xs text-muted-foreground -mt-1">
              可视化深度学习
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6 text-sm font-medium flex-1">
          <Link 
            href="/gallery" 
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            模型画廊
          </Link>
          <Link 
            href="/sandbox" 
            className="transition-colors hover:text-foreground/80 text-muted-foreground"
          >
            沙盒模式
          </Link>
          <Link 
            href="/about" 
            className="transition-colors hover:text-foreground/80 text-muted-foreground"
          >
            关于
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <a 
              href="https://github.com/anwrog/NeuronCanvas" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </Button>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/docs" aria-label="Documentation">
              <BookOpen className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
