"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Math } from "@/components/ui/math";
import { Database, Image, Shuffle, Crop, Palette, ArrowRight } from "lucide-react";

/**
 * AlexNet 数据处理流程组件
 * 展示 ImageNet 数据集的预处理和数据增强策略
 */
export function AlexNetDataPipeline() {
  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-slate-50 to-purple-50 dark:from-slate-950 dark:to-purple-950">
      <div className="container mx-auto p-8 space-y-8">
        {/* 页面标题 */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            AlexNet 数据处理流程
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            ImageNet 大规模图像分类任务的数据预处理和增强策略
          </p>
        </div>

        {/* ImageNet 数据集介绍 */}
        <Card className="p-6 border-2">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Database className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-3">ImageNet 数据集</h2>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                  <div className="text-3xl font-bold text-blue-600">1000</div>
                  <div className="text-sm text-muted-foreground">类别数量</div>
                </div>
                <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30">
                  <div className="text-3xl font-bold text-green-600">~1.3M</div>
                  <div className="text-sm text-muted-foreground">训练图像</div>
                </div>
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950/30">
                  <div className="text-3xl font-bold text-purple-600">50K</div>
                  <div className="text-sm text-muted-foreground">验证图像</div>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                ImageNet 是一个包含超过 1400 万张图像的大规模视觉数据库。
                AlexNet 在 ILSVRC-2012 挑战赛中使用了其中的 1000 个类别，
                每个类别平均约 1300 张训练图像。图像内容涵盖动物、植物、物体、场景等。
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
            {/* 步骤 1: 图像缩放 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xl font-bold text-purple-600">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">图像缩放 (Rescaling)</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      将变长的矩形图像缩放到固定大小：
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-base py-2 px-4">
                        原始尺寸（任意）
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <Badge className="text-base py-2 px-4 bg-purple-600">
                        256 × 256
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      保持宽高比，将短边缩放到 256 像素，然后从中心裁剪出 256×256 的区域。
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 步骤 2: 随机裁剪 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl font-bold text-blue-600">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Crop className="h-5 w-5" />
                    随机裁剪 (Random Crop)
                  </h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      从 256×256 图像中随机裁剪 224×224 的补丁：
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      <Badge variant="outline" className="text-base py-2 px-4">
                        256 × 256
                      </Badge>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      <Badge className="text-base py-2 px-4 bg-blue-600">
                        224 × 224
                      </Badge>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <p className="text-sm font-semibold mb-2">💡 数据增强效果</p>
                      <p className="text-sm text-muted-foreground">
                        每张 256×256 的图像可以产生 (256-224)² = 1024 个不同的 224×224 裁剪。
                        这大大增加了训练数据的多样性，有助于防止过拟合。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 步骤 3: 水平翻转 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl font-bold text-green-600">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Shuffle className="h-5 w-5" />
                    水平翻转 (Horizontal Flip)
                  </h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      以 50% 的概率对图像进行水平翻转：
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800 text-center">
                        <div className="text-lg font-semibold mb-1">原始图像</div>
                        <div className="text-4xl mb-2">🐕</div>
                        <Badge variant="secondary">50% 概率</Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-green-100 dark:bg-green-900/30 text-center">
                        <div className="text-lg font-semibold mb-1">翻转图像</div>
                        <div className="text-4xl mb-2 scale-x-[-1]">🐕</div>
                        <Badge className="bg-green-600">50% 概率</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      水平翻转进一步增加数据多样性，使模型对物体的左右方向不敏感。
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 步骤 4: PCA 颜色增强 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-xl font-bold text-orange-600">
                  4
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    PCA 颜色增强 (Color Jittering)
                  </h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      对 RGB 通道进行主成分分析（PCA），然后添加扰动：
                    </p>
                    <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 space-y-3">
                      <div className="flex justify-center">
                        <Math block>
                          {`I_{xy} = [I_R, I_G, I_B]^T + [\\mathbf{p}_1, \\mathbf{p}_2, \\mathbf{p}_3] \\cdot [\\alpha_1\\lambda_1, \\alpha_2\\lambda_2, \\alpha_3\\lambda_3]^T`}
                        </Math>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        其中 <Math>{"p_i"}</Math> 和 <Math>{"\\lambda_i"}</Math> 是 RGB 像素协方差矩阵的特征向量和特征值，
                        <Math>{"\\alpha_i"}</Math> 是从均值为 0、标准差为 0.1 的高斯分布中随机采样的值。
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                      <p className="text-sm font-semibold mb-2">💡 创新意义</p>
                      <p className="text-sm text-muted-foreground">
                        这种方法捕捉了自然图像的重要特性：物体身份对光照强度和颜色的变化是不变的。
                        论文中提到，这项技术使 Top-1 错误率降低了超过 1%。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* 步骤 5: 均值归一化 */}
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-xl font-bold text-pink-600">
                  5
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2">均值归一化</h3>
                  <div className="space-y-3">
                    <p className="text-muted-foreground">
                      从每个像素中减去训练集的平均像素值：
                    </p>
                    <div className="p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                      <p className="text-sm font-mono mb-2">
                        normalized_image = image - mean_pixel
                      </p>
                      <p className="text-sm text-muted-foreground">
                        这种归一化有助于梯度下降更快地收敛，并减少不同图像之间的像素值差异。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* 测试时的处理 */}
        <Card className="p-6 border-2 border-primary/20 bg-primary/5">
          <h2 className="text-2xl font-bold mb-4">测试时的数据处理</h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background">
              <h3 className="font-semibold mb-2">🔟 十裁剪法 (10-Crop)</h3>
              <p className="text-sm text-muted-foreground mb-3">
                AlexNet 使用了一种称为"十裁剪"的技术来提高测试准确性：
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">1.</span>
                  从 256×256 图像的四个角和中心各裁剪一个 224×224 的补丁（5 个裁剪）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">2.</span>
                  对这 5 个裁剪分别进行水平翻转（再得到 5 个裁剪）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary font-bold">3.</span>
                  对这 10 个裁剪分别进行预测，然后对预测结果取平均
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground italic">
              这种集成方法显著提高了模型的泛化能力和预测稳定性。
            </p>
          </div>
        </Card>

        {/* 总结 */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 border-2">
          <h2 className="text-2xl font-bold mb-4">🎯 数据增强的重要性</h2>
          <div className="space-y-3 text-muted-foreground">
            <p>
              AlexNet 的成功很大程度上归功于其强大的数据增强策略。
              通过随机裁剪、水平翻转和 PCA 颜色增强，模型能够学习到更加鲁棒的特征表示。
            </p>
            <p>
              论文中提到，如果没有数据增强，模型会严重过拟合。
              这些技术使得 AlexNet 能够在 120 万张训练图像上，
              训练出一个拥有 6000 万参数的大型神经网络。
            </p>
            <div className="p-4 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <p className="font-semibold text-foreground mb-2">💡 论文强调</p>
              <p className="text-sm">
                数据增强对于防止过拟合至关重要。
                论文特别指出 PCA 颜色增强使 Top-1 错误率降低了超过 1%。
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
