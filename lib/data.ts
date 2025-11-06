/**
 * 模型章节类型
 */
export type ModelSection = 
  | "architecture"    // 架构可视化
  | "data-pipeline"   // 数据处理流程
  | "training"        // 训练技巧和过程
  | "innovations"     // 关键创新点
  | "results";        // 实验结果

/**
 * 章节元数据
 */
export interface SectionMetadata {
  id: ModelSection;
  label: string;
  icon?: string;
  description?: string;
}

/**
 * 模型数据类型定义
 */
export interface ModelData {
  id: string;
  name: string;
  description: string;
  year: number;
  category: "CNN" | "RNN" | "Transformer" | "Classic";
  thumbnail?: string;
  tags: string[];
  // 该模型支持的可视化章节
  sections?: ModelSection[];
}

/**
 * 经典深度学习模型的模拟数据
 * 
 * 这些数据将用于模型画廊页面的展示
 * TODO: 未来可以从 JSON 文件或 API 加载
 */
export const modelsData: ModelData[] = [
  {
    id: "lenet-5",
    name: "LeNet-5",
    description: "深度学习的开山之作，用于手写数字识别。由 Yann LeCun 于 1998 年提出，奠定了现代 CNN 的基础架构。",
    year: 1998,
    category: "CNN",
    tags: ["CNN", "MNIST", "先驱"],
    sections: ["architecture", "data-pipeline", "training", "innovations"],
  },
  {
    id: "alexnet",
    name: "AlexNet",
    description: "2012 年 ImageNet 竞赛冠军，将深度学习带入计算机视觉的主流。引入了 ReLU、Dropout、数据增强等关键技术。",
    year: 2012,
    category: "CNN",
    tags: ["ImageNet", "突破", "GPU"],
    sections: ["architecture", "data-pipeline", "training", "innovations"],
  },
  {
    id: "vgg16",
    name: "VGG-16",
    description: "使用极小的 3×3 卷积核堆叠出深层网络，证明了网络深度对性能的重要性。",
    year: 2014,
    category: "CNN",
    tags: ["深度", "简洁"],
  },
  {
    id: "resnet",
    name: "ResNet",
    description: "通过残差连接解决了深层网络的梯度消失问题，使得训练超过 100 层的网络成为可能。",
    year: 2015,
    category: "CNN",
    tags: ["残差", "深度", "革命性"],
  },
  {
    id: "googlenet",
    name: "GoogLeNet (Inception)",
    description: "通过 Inception 模块实现多尺度特征提取，在保持计算效率的同时提升了模型性能。",
    year: 2014,
    category: "CNN",
    tags: ["多尺度", "高效"],
  },
  {
    id: "mobilenet",
    name: "MobileNet",
    description: "专为移动和嵌入式设备设计的轻量级网络，使用深度可分离卷积大幅降低计算量。",
    year: 2017,
    category: "CNN",
    tags: ["轻量", "移动端"],
  },
];

/**
 * 根据 ID 获取单个模型数据
 */
export function getModelById(id: string): ModelData | undefined {
  return modelsData.find((model) => model.id === id);
}

/**
 * 根据类别筛选模型
 */
export function getModelsByCategory(category: ModelData["category"]): ModelData[] {
  return modelsData.filter((model) => model.category === category);
}

/**
 * 所有可用的章节配置
 */
export const sectionMetadata: Record<ModelSection, SectionMetadata> = {
  "architecture": {
    id: "architecture",
    label: "模型架构",
    icon: "🏗️",
    description: "3D 交互式架构可视化"
  },
  "data-pipeline": {
    id: "data-pipeline",
    label: "数据处理",
    icon: "📊",
    description: "数据预处理与增强流程"
  },
  "training": {
    id: "training",
    label: "训练过程",
    icon: "🎯",
    description: "训练技巧、超参数与优化策略"
  },
  "innovations": {
    id: "innovations",
    label: "核心创新",
    icon: "💡",
    description: "模型的关键技术贡献"
  },
  "results": {
    id: "results",
    label: "实验结果",
    icon: "📈",
    description: "性能指标与对比分析"
  }
};
