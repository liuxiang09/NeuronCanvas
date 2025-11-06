"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Math } from "@/components/ui/math";
import { Zap, TrendingDown, Layers, Clock, Cpu, Database } from "lucide-react";

/**
 * AlexNet 训练过程组件
 * 展示训练技巧、超参数配置和优化策略
 */
export function AlexNetTraining() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-950 dark:to-purple-950">
      <div className="container mx-auto p-8 space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AlexNet 训练过程
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            深度神经网络训练的突破性技术和实践经验
          </p>
        </div>

        {/* 训练配置概览 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">批次大小</div>
                <div className="text-2xl font-bold">128</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                <Clock className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">训练轮数</div>
                <div className="text-2xl font-bold">90</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Cpu className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">硬件</div>
                <div className="text-xl font-bold">2× GTX 580</div>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <div className="text-sm text-muted-foreground">训练时间</div>
                <div className="text-xl font-bold">5-6 天</div>
              </div>
            </div>
          </Card>
        </div>

        {/* 优化器配置 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">优化算法 - 带动量的 SGD</h2>
              
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-sm text-muted-foreground mb-1">初始学习率</div>
                  <div className="text-2xl font-bold text-blue-600">0.01</div>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                  <div className="text-sm text-muted-foreground mb-1">动量系数</div>
                  <div className="text-2xl font-bold text-purple-600">0.9</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <div className="text-sm text-muted-foreground mb-1">权重衰减</div>
                  <div className="text-2xl font-bold text-green-600">0.0005</div>
                </div>
                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/30">
                  <div className="text-sm text-muted-foreground mb-1">批次大小</div>
                  <div className="text-2xl font-bold text-orange-600">128</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                <h3 className="font-semibold mb-3">📐 更新规则</h3>
                <div className="space-y-2">
                  <Math block>
                    {`v_{i+1} = 0.9 \\cdot v_i - 0.0005 \\cdot \\varepsilon \\cdot w_i - \\varepsilon \\cdot \\left\\langle \\frac{\\partial L}{\\partial w} \\Big| w_i \\right\\rangle_{D_i}`}
                  </Math>
                  <Math block>
                    {`w_{i+1} = w_i + v_{i+1}`}
                  </Math>
                </div>
                <p className="text-sm text-muted-foreground mt-3">
                  其中 <Math>{"i"}</Math> 是迭代索引，<Math>{"v"}</Math> 是动量变量，<Math>{"\\varepsilon"}</Math> 是学习率，
                  <Math>{"\\left\\langle \\frac{\\partial L}{\\partial w} \\Big| w_i \\right\\rangle_{D_i}"}</Math> 是在批次 <Math>{"D_i"}</Math> 上的梯度平均值。
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* 学习率调度 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingDown className="h-8 w-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">学习率调度策略</h2>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <h3 className="font-semibold mb-2">📉 手动阶梯式衰减</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    当验证集错误率停止改善时，将学习率除以 10。
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-600">初始</Badge>
                      <span className="text-sm">学习率 = 0.01</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">第 1 次衰减</Badge>
                      <span className="text-sm">学习率 = 0.001</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">第 2 次衰减</Badge>
                      <span className="text-sm">学习率 = 0.0001</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <p className="text-sm font-semibold mb-2">💡 训练经验</p>
                  <p className="text-sm text-muted-foreground">
                    论文中提到，学习率在整个训练过程中被手动降低了 3 次。
                    这种策略虽然简单，但在训练深度网络时非常有效。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 权重初始化 */}
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Layers className="h-8 w-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">权重初始化策略</h2>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                    <h3 className="font-semibold mb-2">卷积层和全连接层</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      从均值为 0、标准差为 0.01 的高斯分布初始化权重
                    </p>
                    <div className="text-sm font-mono bg-background p-2 rounded">
                      <Math>{"W \\sim N(0, 0.01^2)"}</Math>
                    </div>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <h3 className="font-semibold mb-2">偏置项 (Bias)</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      第 2、4、5 个卷积层和全连接层的偏置初始化为 1
                    </p>
                    <div className="text-sm font-mono bg-background p-2 rounded">
                      <Math>{"b = 1"}</Math>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <p className="text-sm font-semibold mb-2">🎯 初始化的作用</p>
                  <p className="text-sm text-muted-foreground">
                    将部分层的偏置初始化为 1（而不是 0）可以在训练早期为 ReLU 提供正输入，
                    加速学习过程。其他层的偏置初始化为 0。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 正则化技术 */}
        <Card className="p-6 border-2 border-primary/20">
          <h2 className="text-2xl font-bold mb-4">正则化技术</h2>
          
          <div className="space-y-4">
            {/* Dropout */}
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🎲</span>
                Dropout (p = 0.5)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                在前两个全连接层使用 Dropout，以 0.5 的概率随机"丢弃"神经元的输出。
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-background">
                  <div className="font-semibold text-sm mb-1">训练时</div>
                  <p className="text-xs text-muted-foreground">
                    每个神经元以 50% 的概率被暂时移除，强制网络学习更鲁棒的特征
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-background">
                  <div className="font-semibold text-sm mb-1">测试时</div>
                  <p className="text-xs text-muted-foreground">
                    使用所有神经元，但将输出乘以 0.5，以匹配训练时的期望输出
                  </p>
                </div>
              </div>
              <div className="mt-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                <p className="text-sm font-semibold mb-1">💡 论文原文</p>
                <p className="text-sm text-muted-foreground italic">
                  "Without dropout, our network exhibits substantial overfitting. 
                  Dropout roughly doubles the number of iterations required to converge."
                </p>
              </div>
            </div>

            {/* L2 正则化 */}
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">⚖️</span>
                L2 正则化 (权重衰减)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                权重衰减系数设置为 0.0005，虽然很小，但对模型学习很重要。
              </p>
              <div className="p-3 rounded-lg bg-background">
                <p className="text-sm font-mono mb-2">
                  <Math>{"Loss = CrossEntropy + 0.0005 × Σ(w²)"}</Math>
                </p>
                <p className="text-sm text-muted-foreground">
                  这不仅是一个正则化器，还能减少模型的训练误差。
                </p>
              </div>
            </div>

            {/* 数据增强 */}
            <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/20">
              <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <span className="text-2xl">🔄</span>
                数据增强
              </h3>
              <p className="text-sm text-muted-foreground">
                随机裁剪、水平翻转和 PCA 颜色增强大大增加了训练数据的多样性，
                是防止过拟合的关键技术。详见"数据处理流程"页面。
              </p>
            </div>
          </div>
        </Card>

        {/* 局部响应归一化 (LRN) */}
        <Card className="p-6 bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-200 dark:border-yellow-800">
          <h2 className="text-2xl font-bold mb-4">局部响应归一化 (LRN)</h2>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              AlexNet 在 ReLU 激活之后使用了局部响应归一化（Local Response Normalization）。
              虽然现代网络通常不再使用 LRN，但它在 AlexNet 中起到了一定作用。
            </p>

            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-semibold mb-2">📐 归一化公式</h3>
                <div className="text-base mb-3">
                <Math block>{"b_{x,y}^{i} = \\frac{a_{x,y}^{i}}{\\left(k + \\alpha \\sum_{j} (a_{x,y}^{j})^{2}\\right)^{\\beta}}"}</Math>
                </div>
              <p className="text-sm text-muted-foreground">
                其中 <Math>{"k = 2, \\alpha = 10^{-4}, \\beta = 0.75, n = 5"}</Math>（邻近通道数）
              </p>
            </div>

              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20">
              <p className="text-sm font-semibold mb-2">📊 效果</p>
              <p className="text-sm text-muted-foreground">
                LRN 受到生物神经元"侧抑制"现象的启发。
                论文报告 LRN 使 Top-1 和 Top-5 错误率分别降低了 1.4% 和 1.2%。
              </p>
            </div>
          </div>
        </Card>

        {/* 双 GPU 训练 */}
        <Card className="p-6 border-2">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Cpu className="h-8 w-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-4">双 GPU 并行训练</h2>
              
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  AlexNet 是首批利用多 GPU 并行训练的深度网络之一。
                  网络被分成两部分，分别放在两个 NVIDIA GTX 580 GPU 上（每个 3GB 显存）。
                </p>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                    <h3 className="font-semibold mb-2">GPU 1</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Conv1: 48 个卷积核</li>
                      <li>• Conv2: 128 个卷积核</li>
                      <li>• Conv3: 192 个卷积核（连接两个 GPU）</li>
                      <li>• Conv4: 192 个卷积核</li>
                      <li>• Conv5: 128 个卷积核</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                    <h3 className="font-semibold mb-2">GPU 2</h3>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Conv1: 48 个卷积核</li>
                      <li>• Conv2: 128 个卷积核</li>
                      <li>• Conv3: 192 个卷积核（连接两个 GPU）</li>
                      <li>• Conv4: 192 个卷积核</li>
                      <li>• Conv5: 128 个卷积核</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
                  <p className="text-sm font-semibold mb-2">💡 通信策略</p>
                  <p className="text-sm text-muted-foreground">
                    GPU 之间只在特定层进行通信。
                    例如，第 3 层的卷积核会从两个 GPU 的第 2 层输出中获取输入，
                    而第 4 层的卷积核只从同一 GPU 的第 3 层输出中获取输入。
                    这种设计平衡了计算效率和通信开销。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* 训练结果 */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 border-2">
          <h2 className="text-2xl font-bold mb-4">🏆 训练结果</h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-lg bg-background text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">15.3%</div>
              <div className="text-sm text-muted-foreground">Top-5 错误率（测试集）</div>
              <div className="text-xs text-muted-foreground mt-1">ILSVRC-2012</div>
            </div>
            <div className="p-4 rounded-lg bg-background text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">5-6 天</div>
              <div className="text-sm text-muted-foreground">训练时间</div>
              <div className="text-xs text-muted-foreground mt-1">双 GTX 580 GPU</div>
            </div>
          </div>

          <div className="space-y-3 text-muted-foreground">
            <p>
              在 ILSVRC-2012 竞赛中，AlexNet 取得了 Top-5 测试错误率 15.3% 的成绩，
              远超第二名的 26.2%（传统方法），实现了巨大的突破。
            </p>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <p className="font-semibold text-foreground mb-2">💡 成功要素</p>
              <ul className="text-sm space-y-1">
                <li>• 更深的网络架构（8 层）</li>
                <li>• ReLU 激活函数加速训练</li>
                <li>• Dropout 防止过拟合</li>
                <li>• 强大的数据增强</li>
                <li>• GPU 并行训练</li>
                <li>• 大规模数据集（ImageNet）</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
