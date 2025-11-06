"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingDown, Clock, Target } from "lucide-react";

/**
 * LeNet-5 训练过程组件
 * 展示训练配置和优化策略
 */
export function LeNet5Training() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto p-8 space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LeNet-5 训练过程
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            简洁高效的训练配置与优化策略
          </p>
        </div>

        {/* 优化算法 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">优化算法</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-xl font-bold text-blue-600 mb-2">随机梯度下降（SGD）</div>
                  <p className="text-sm text-muted-foreground">
                    LeNet-5 使用随机梯度下降算法，通过反向传播更新网络权重。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 学习率策略 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">激活函数</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <h3 className="font-semibold mb-2">双曲正切函数（Tanh）</h3>
                  <p className="text-sm text-muted-foreground">
                    LeNet-5 使用 tanh 作为激活函数，输出范围在 [-1, 1] 之间。
                    这是当时常用的非线性激活函数。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 训练结果 */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2">
          <h2 className="text-2xl font-bold mb-4">🏆 论文报告的结果</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-background text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">0.95%</div>
              <div className="text-sm text-muted-foreground">测试错误率</div>
              <div className="text-xs text-muted-foreground mt-1">（准确率 ~99.05%）</div>
            </div>
            <div className="p-4 rounded-lg bg-background text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">~60K</div>
              <div className="text-sm text-muted-foreground">参数量</div>
            </div>
          </div>

          <div className="space-y-3 text-muted-foreground">
            <p>
              LeNet-5 在 MNIST 数据集上取得了 0.95% 的测试错误率，
              展现了卷积神经网络在手写数字识别任务上的强大能力。
            </p>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <p className="font-semibold text-foreground mb-2">💡 历史意义</p>
              <p className="text-sm">
                LeNet-5 证明了神经网络可以端到端地自动学习特征，无需人工设计特征提取器。
                这为后续更深、更复杂的网络架构奠定了基础。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
