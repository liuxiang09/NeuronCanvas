"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Math } from "@/components/ui/math";
import { Lightbulb, Zap, Layers, Shield, Sparkles, TrendingUp } from "lucide-react";

/**
 * AlexNet 核心创新组件
 * 展示 AlexNet 的关键技术贡献
 */
export function AlexNetInnovations() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-950 dark:to-purple-950">
      <div className="container mx-auto p-8 space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AlexNet 核心创新
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            深度学习复兴的关键技术突破
          </p>
        </div>

        {/* 历史意义 */}
        <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-2 border-amber-200 dark:border-amber-800">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Sparkles className="h-8 w-8 text-amber-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">🏆 深度学习的转折点</h2>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  2012 年，AlexNet 在 ImageNet 大规模视觉识别挑战赛（ILSVRC）中一举夺冠，
                  Top-5 错误率达到 15.3%，大幅超越第二名的传统方法（26.2%），
                  证明了深度卷积神经网络在大规模图像识别任务上的巨大潜力。
                </p>
                <p>
                  这一成就标志着深度学习时代的开启，引发了 AI 领域的革命性变革。
                  AlexNet 的成功激励了后续一系列更深、更强大的网络架构（VGG、GoogLeNet、ResNet 等）的诞生。
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 1: ReLU 激活函数 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
              <Zap className="h-8 w-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">ReLU 激活函数</h2>
                <Badge className="bg-orange-600">核心创新</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  AlexNet 首次在大规模 CNN 中使用 ReLU（Rectified Linear Unit）激活函数，
                  取代传统的 tanh 和 sigmoid 函数。
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                    <h3 className="font-semibold mb-2">传统激活函数（tanh/sigmoid）</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• 饱和函数，梯度容易消失</div>
                      <div>• 计算涉及指数运算，速度慢</div>
                      <div>• 输出范围有限</div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h3 className="font-semibold mb-2">ReLU: f(x) = max(0, x)</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div>• 非饱和，缓解梯度消失</div>
                      <div>• 计算简单，训练速度快 6 倍</div>
                      <div>• 生物学上更合理</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <h3 className="font-semibold mb-2">📊 实验结果</h3>
                  <p className="text-sm text-muted-foreground">
                    论文中展示，使用 ReLU 的网络在 CIFAR-10 数据集上达到 25% 训练错误率的速度，
                    比使用 tanh 的网络快 <span className="font-bold text-orange-600">6 倍</span>。
                    这使得训练大型深度网络成为可能。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-sm font-semibold mb-2">💡 影响</p>
                  <p className="text-sm text-muted-foreground">
                    ReLU 的成功使其成为现代深度学习的标准激活函数，
                    并催生了 Leaky ReLU、PReLU、ELU 等变体。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 2: Dropout */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">Dropout 正则化</h2>
                <Badge className="bg-red-600">防止过拟合</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Dropout 是一种强大的正则化技术，通过在训练时随机"丢弃"神经元来防止过拟合。
                  AlexNet 在前两个全连接层使用了 dropout（概率 0.5）。
                </p>

                <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                  <h3 className="font-semibold mb-3">🎲 工作原理</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="font-semibold text-sm">训练阶段</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>1. 每个神经元以 p=0.5 的概率被"关闭"</li>
                        <li>2. 前向传播时，被关闭的神经元输出为 0</li>
                        <li>3. 反向传播时，这些神经元不更新权重</li>
                        <li>4. 每个 mini-batch 重新采样</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <div className="font-semibold text-sm">测试阶段</div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>1. 使用所有神经元</li>
                        <li>2. 将输出乘以 0.5</li>
                        <li>3. 近似集成多个子网络的效果</li>
                        <li>4. 实现更稳定的预测</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
                  <h3 className="font-semibold mb-2">🎯 为什么有效？</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>
                      <span className="font-semibold text-foreground">1. 减少神经元之间的共适应：</span> 
                      强制网络学习更鲁棒的特征，而不依赖特定神经元的组合
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">2. 隐式集成：</span> 
                      每次训练迭代随机采样一个子网络，理论上可以产生 <Math>{"2^{n}"}</Math> 种不同配置（n 是神经元数量）。
                      测试时使用所有神经元并缩放输出，近似于对这些子网络的集成预测
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">3. 防止过拟合：</span> 
                      在 AlexNet 中，dropout 使得模型在测试集上的表现显著提升
                    </li>
                  </ul>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-sm font-semibold mb-2">💡 论文原话</p>
                  <p className="text-sm text-muted-foreground italic">
                    "Without dropout, our network exhibits substantial overfitting. 
                    Dropout roughly doubles the number of iterations required to converge."
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    虽然 dropout 使收敛速度减慢约一倍，但它对防止过拟合至关重要。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 3: 数据增强 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <Layers className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">强大的数据增强</h2>
                <Badge className="bg-green-600">扩展数据</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  AlexNet 采用了创新的数据增强策略，显著增加了训练数据的多样性。
                </p>

                <div className="grid gap-4">
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h3 className="font-semibold mb-2">1. 图像平移和水平翻转</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      从 256×256 图像中随机提取 224×224 的补丁，并随机水平翻转。
                    </p>
                    <div className="text-sm text-green-700 dark:text-green-400 font-semibold">
                      → 数据量增加 2048 倍（无需存储）
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <h3 className="font-semibold mb-2">2. PCA 颜色增强</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      对 RGB 像素值进行主成分分析，沿主成分方向添加随机扰动。
                    </p>
                    <div className="text-sm text-purple-700 dark:text-purple-400 font-semibold">
                      → Top-1 错误率降低超过 1%
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-sm font-semibold mb-2">💡 重要性</p>
                  <p className="text-sm text-muted-foreground">
                    这些数据增强技术使得 AlexNet 能够在有限的数据上训练 6000 万参数的大型网络，
                    而不会严重过拟合。这些方法至今仍是计算机视觉领域的标准做法。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 4: GPU 加速 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">GPU 并行训练</h2>
                <Badge className="bg-blue-600">工程创新</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  AlexNet 是首批充分利用 GPU 进行训练的深度网络之一，
                  使用两个 NVIDIA GTX 580 GPU（每个 3GB 显存）进行并行计算。
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <h3 className="font-semibold mb-2">模型并行</h3>
                    <p className="text-sm text-muted-foreground">
                      将网络层分配到两个 GPU 上，每个 GPU 负责一半的卷积核。
                      在特定层进行 GPU 间通信，平衡计算和通信开销。
                    </p>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                    <h3 className="font-semibold mb-2">训练加速</h3>
                    <p className="text-sm text-muted-foreground">
                      使用高度优化的 2D 卷积实现，GPU 训练速度比 CPU 快 
                      <span className="font-bold text-green-600">10-20 倍</span>。
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <p className="text-sm font-semibold mb-2">🚀 影响</p>
                  <p className="text-sm text-muted-foreground">
                    AlexNet 证明了 GPU 对于训练大型深度网络的重要性，
                    推动了深度学习框架对 GPU 加速的支持，使训练更深更大的网络成为可能。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 5: 重叠池化 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Layers className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">重叠池化</h2>
                <Badge className="bg-purple-600">架构细节</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  AlexNet 使用 3×3 的池化窗口和步长 2，使池化窗口之间有重叠。
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                    <h3 className="font-semibold mb-2">传统池化（LeNet）</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>池化窗口: 2×2</div>
                      <div>步长: 2</div>
                      <div>→ 无重叠</div>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                    <h3 className="font-semibold mb-2">AlexNet 池化</h3>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>池化窗口: 3×3</div>
                      <div>步长: 2</div>
                      <div className="text-purple-600 font-semibold">→ 有重叠</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-sm font-semibold mb-2">📊 效果</p>
                  <p className="text-sm text-muted-foreground">
                    论文报告，使用重叠池化使 Top-1 和 Top-5 错误率分别降低了 0.4% 和 0.3%，
                    并且观察到使用重叠池化的模型更难过拟合。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 创新 6: 局部响应归一化 */}
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-950/20">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30">
              <Lightbulb className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-2xl font-bold">局部响应归一化 (LRN)</h2>
                <Badge variant="outline">历史技术</Badge>
              </div>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  受生物神经元"侧抑制"现象启发，AlexNet 在某些 ReLU 层后使用了局部响应归一化。
                </p>

                <div className="p-4 rounded-lg bg-background">
                  <h3 className="font-semibold mb-3">归一化公式</h3>
                  <div className="flex justify-center mb-3">
                    <Math block>
                      {`b_{x,y}^i = \\frac{a_{x,y}^i}{\\left(k + \\alpha \\sum_{j} (a_{x,y}^j)^2\\right)^\\beta}`}
                    </Math>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    归一化在相邻的特征图之间进行，抑制较大的激活值。
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <p className="text-sm font-semibold mb-2">📊 效果</p>
                  <p className="text-sm text-muted-foreground">
                    论文报告，LRN 使 Top-1 和 Top-5 错误率分别降低了 1.4% 和 1.2%。
                    这种归一化受到生物神经元"侧抑制"现象的启发。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 总结 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2">
          <h2 className="text-2xl font-bold mb-4">🌟 AlexNet 的贡献</h2>
          
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-background">
                <h3 className="font-semibold mb-2">AlexNet 的核心技术贡献</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>✅ 在大规模 CNN 中首次成功使用 ReLU 激活函数</li>
                  <li>✅ Dropout 正则化技术</li>
                  <li>✅ 数据增强（随机裁剪、水平翻转、PCA 颜色增强）</li>
                  <li>✅ GPU 并行训练</li>
                  <li>✅ 重叠池化（3×3 窗口，步长 2）</li>
                  <li>✅ 局部响应归一化（LRN）</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <p className="text-sm font-semibold mb-2">🏆 历史意义</p>
              <p className="text-sm text-muted-foreground">
                AlexNet 在 ILSVRC-2012 竞赛中的胜利证明了深度学习的巨大潜力，
                点燃了深度学习研究的热潮。它的成功促使研究者们开始探索更深、更强大的网络架构，
                最终导致了 VGG、GoogLeNet、ResNet 等一系列里程碑式的工作。
                可以说，AlexNet 是现代深度学习时代的开端。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
