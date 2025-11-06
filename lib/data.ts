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
    description: "开创性的卷积神经网络，用于手写数字识别。由 Yann LeCun 于 1998 年提出，奠定了现代 CNN 的基础。",
    year: 1998,
    category: "Classic",
    tags: ["CNN", "MNIST", "先驱"],
  },
  {
    id: "alexnet",
    name: "AlexNet",
    description: "2012 年 ImageNet 竞赛冠军，将深度学习带入计算机视觉的主流。引入了 ReLU、Dropout 等关键技术。",
    year: 2012,
    category: "CNN",
    tags: ["ImageNet", "突破", "GPU"],
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
    id: "lstm",
    name: "LSTM",
    description: "长短期记忆网络，通过门控机制解决了 RNN 的长期依赖问题，在序列建模中广泛应用。",
    year: 1997,
    category: "RNN",
    tags: ["序列", "记忆", "NLP"],
  },
  {
    id: "transformer",
    name: "Transformer",
    description: "完全基于注意力机制的模型，抛弃了循环结构，开启了 NLP 的新纪元（BERT、GPT 的基础）。",
    year: 2017,
    category: "Transformer",
    tags: ["注意力", "并行", "革命性"],
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
