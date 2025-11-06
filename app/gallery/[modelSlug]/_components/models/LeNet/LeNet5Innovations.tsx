"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Layers, Sparkles, TrendingUp } from "lucide-react";

/**
 * LeNet-5 核心创新组件
 * 展示 LeNet-5 的关键技术贡献
 */
export function LeNet5Innovations() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <div className="container mx-auto p-8 space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LeNet-5 核心创新
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            卷积神经网络的开创性工作
          </p>
        </div>

        {/* 历史意义 */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Sparkles className="h-8 w-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">🏆 深度学习的先驱</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  1998 年，Yann LeCun 等人在 AT&T 实验室提出了 LeNet-5，
                  成功应用于手写支票识别系统，处理了美国约 10-20% 的支票。
                  这是卷积神经网络首次在真实世界应用中取得重大成功。
                </p>
                <p>
                  LeNet-5 证明了神经网络可以端到端地学习特征，无需人工设计特征提取器，
                  为后续的 AlexNet、VGG、ResNet 等模型奠定了理论和实践基础。
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 1: 卷积层 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Layers className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">卷积层</h2>
                <Badge className="bg-blue-600">核心创新</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  LeNet-5 系统性地使用卷积操作提取图像特征，这是卷积神经网络的核心。
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <h3 className="font-semibold mb-2">局部感受野</h3>
                    <p className="text-sm text-muted-foreground">
                      每个神经元只连接输入的一小块区域，而不是全部像素，更符合视觉处理的生物机制
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h3 className="font-semibold mb-2">权重共享</h3>
                    <p className="text-sm text-muted-foreground">
                      同一卷积核在整个图像上共享权重，大幅减少参数量
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <h3 className="font-semibold mb-2">平移不变性</h3>
                    <p className="text-sm text-muted-foreground">
                      对图像位置变化具有鲁棒性，同样的特征可以在不同位置被检测到
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-sm font-semibold mb-2">💡 影响</p>
                  <p className="text-sm text-muted-foreground">
                    卷积层奠定了现代 CNN 的基础架构，至今仍是计算机视觉的核心组件。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 2: 池化层 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">子采样/池化层</h2>
                <Badge className="bg-green-600">降维技术</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  LeNet-5 使用平均池化降低特征图尺寸，这是现代池化层的前身。
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h3 className="font-semibold mb-2">计算效率</h3>
                    <p className="text-sm text-muted-foreground">
                      降低特征图尺寸，减少后续层的计算量和参数数量
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <h3 className="font-semibold mb-2">特征抽象</h3>
                    <p className="text-sm text-muted-foreground">
                      增加感受野范围，提供更高层次的特征表示
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 3: 层次化特征学习 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Lightbulb className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">层次化特征学习</h2>
                <Badge className="bg-purple-600">深度学习精髓</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  LeNet-5 展示了深度网络如何自动学习从简单到复杂的特征层次。
                </p>

                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">层 1-2</Badge>
                      <p className="text-sm text-muted-foreground flex-1">
                        <span className="font-semibold text-foreground">底层特征：</span>
                        边缘、线条、简单形状等基础视觉元素
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">层 3-4</Badge>
                      <p className="text-sm text-muted-foreground flex-1">
                        <span className="font-semibold text-foreground">中层特征：</span>
                        局部形状、笔画组合、纹理模式
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Badge variant="outline">层 5-7</Badge>
                      <p className="text-sm text-muted-foreground flex-1">
                        <span className="font-semibold text-foreground">高层特征：</span>
                        完整数字的抽象表示和分类决策
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <p className="text-sm font-semibold mb-2">💡 深远影响</p>
                  <p className="text-sm text-muted-foreground">
                    这种层次化的特征学习成为深度学习的核心范式，
                    解释了为什么"深度"对于复杂任务如此重要。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 4: 端到端学习 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Sparkles className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">端到端学习</h2>
                <Badge className="bg-orange-600">范式转变</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  LeNet-5 实现了从原始像素到分类结果的完整端到端学习，无需人工特征工程。
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <h3 className="font-semibold mb-2">传统方法</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 手工设计特征提取器</li>
                      <li>• 分离的特征提取和分类</li>
                      <li>• 需要领域专家知识</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h3 className="font-semibold mb-2">LeNet-5 方法</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• 自动学习最优特征</li>
                      <li>• 联合优化全部组件</li>
                      <li>• 数据驱动，减少人工干预</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 总结 */}
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border-2">
          <h2 className="text-2xl font-bold mb-4">🌟 LeNet-5 的贡献</h2>
          
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-semibold mb-2">技术遗产</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ 卷积操作成为 CV 的标准组件</li>
                <li>✅ 池化层广泛应用于降维</li>
                <li>✅ 层次化特征学习成为深度学习核心</li>
                <li>✅ 端到端学习范式影响整个AI领域</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <p className="text-sm font-semibold mb-2">🏆 历史地位</p>
              <p className="text-sm text-muted-foreground">
                LeNet-5 不仅是一个成功的网络架构，更重要的是它证明了深度学习的可行性，
                开启了计算机视觉的新纪元。从 LeNet-5 到 AlexNet、ResNet，
                每一次突破都建立在这个经典工作的基础之上。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
