import { Brain, Github, Twitter, Mail } from "lucide-react";
import Link from "next/link";

/**
 * Footer 组件 - 应用的页脚
 * 
 * 设计理念：
 * - 简洁的三栏布局（关于项目、快速链接、社交媒体）
 * - 突出开源属性和社区贡献
 */
export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 第一栏：关于项目 */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">NeuronCanvas</span>
            </div>
            <p className="text-sm text-muted-foreground">
              一个开源的深度学习可视化平台，让复杂的神经网络变得直观易懂。
            </p>
            <p className="text-xs text-muted-foreground">
              © 2025 NeuronCanvas. MIT License.
            </p>
          </div>

          {/* 第二栏：快速链接 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">快速导航</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/gallery" className="hover:text-primary transition-colors">
                  模型画廊
                </Link>
              </li>
              <li>
                <Link href="/sandbox" className="hover:text-primary transition-colors">
                  沙盒工具
                </Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary transition-colors">
                  使用文档
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="hover:text-primary transition-colors">
                  如何贡献
                </Link>
              </li>
            </ul>
          </div>

          {/* 第三栏：社交媒体和联系方式 */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">联系我们</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/liuxiang09/neuroncanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/neuroncanvas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="mailto:liuxiang09192021@163.com"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              欢迎通过 GitHub Issues 提出建议或报告问题
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
