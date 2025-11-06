"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Image, ArrowRight } from "lucide-react";

/**
 * LeNet-5 数据处理流程组件
 * 展示 MNIST 数据集的预处理步骤
 */
export function LeNet5DataPipeline() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto p-8 space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LeNet-5 数据处理流程
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            MNIST 手写数字识别数据集的预处理
          </p>
        </div>

        {/* MNIST 数据集介绍 */}
        <Card className="p-6 border-2">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">MNIST 数据集</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-3xl font-bold text-blue-600">10</div>
                  <div className="text-sm text-muted-foreground">类别数量</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <div className="text-3xl font-bold text-green-600">60K</div>
                  <div className="text-sm text-muted-foreground">训练图像</div>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                  <div className="text-3xl font-bold text-purple-600">10K</div>
                  <div className="text-sm text-muted-foreground">测试图像</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                MNIST 是机器学习领域最经典的数据集之一，包含 70,000 张手写数字图像（0-9）。
                每张图像为 28×28 像素的灰度图。LeNet-5 正是在这个数据集上展示了卷积神经网络的强大能力。
              </p>
            </div>
          </div>
        </Card>

        {/* 数据预处理流程 */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Image className="h-6 w-6 text-primary" />
            数据预处理流程
          </h2>
          
          <div className="grid gap-4">
            {/* 步骤 1: 图像填充 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl font-bold text-blue-600">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">图像填充</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      将 28×28 的 MNIST 图像填充到 32×32：
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-base py-2 px-4">
                        28 × 28
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <Badge className="text-base py-2 px-4 bg-blue-600">
                        32 × 32
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      在图像周围填充 2 像素的边界（通常填充 0），使图像尺寸符合 LeNet-5 的输入要求。
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 步骤 2: 归一化 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl font-bold text-green-600">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">像素归一化</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      对像素值进行归一化处理，使其适合神经网络训练。
                    </p>
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <p className="text-sm text-muted-foreground">
                        原始论文对预处理的具体细节描述较少，主要关注网络架构本身。
                        重要的是将图像数据转换为适合网络处理的格式。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 总结 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
          <h2 className="text-2xl font-bold mb-4">🎯 数据处理总结</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              LeNet-5 的数据预处理相对简单：将 MNIST 的 28×28 图像填充到 32×32，
              然后进行基本的归一化处理。这种简洁的处理方式充分展示了卷积神经网络的强大能力。
            </p>
            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <p className="font-semibold text-foreground mb-2">💡 论文重点</p>
              <p className="text-sm">
                LeNet-5 论文的核心贡献在于网络架构设计，而非数据预处理技术。
                即使使用简单的预处理，网络也能学习到有效的特征表示。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
