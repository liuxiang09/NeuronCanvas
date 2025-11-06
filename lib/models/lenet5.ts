/**
 * LeNet-5 模型架构定义
 * 
 * 这是 Yann LeCun 在 1998 年提出的经典卷积神经网络
 * 原论文: "Gradient-Based Learning Applied to Document Recognition"
 * 
 * 网络结构:
 * Input (32×32×1) → C1 (28×28×6) → S2 (14×14×6) → 
 * C3 (10×10×16) → S4 (5×5×16) → C5 (1×1×120) → 
 * F6 (84) → Output (10)
 */

export interface LayerParams {
  channels?: number;      // 输出通道数（对于卷积层）
  kernelSize?: number;    // 卷积核大小
  stride?: number;        // 步长
  poolSize?: number;      // 池化窗口大小
  outFeatures?: number;   // 输出特征数（对于全连接层）
}

export interface LayerDefinition {
  id: string;
  type: 'Input' | 'Conv2D' | 'AvgPool2D' | 'Linear';
  name: string;
  params: LayerParams;
  inputShape: number[];
  outputShape: number[];
  description: string;
  color: string; // 用于在可视化中区分不同层类型
}

/**
 * LeNet-5 完整架构
 * 
 * 注意:
 * - 原始 LeNet-5 使用 32×32 的输入（MNIST 图像填充到 32×32）
 * - 激活函数在原论文中是 tanh，但这里我们概念化为单独的层
 * - S2 和 S4 在原论文中是平均池化，但现代实现常用最大池化
 */
export const lenet5Architecture: LayerDefinition[] = [
  {
    id: 'input',
    type: 'Input',
    name: 'Input Layer',
    params: {},
    inputShape: [1, 32, 32],
    outputShape: [1, 32, 32],
    description: '输入层：接收 32×32 的灰度图像（单通道）',
    color: '#3b82f6', // 蓝色
  },
  {
    id: 'c1',
    type: 'Conv2D',
    name: 'C1 - Convolution',
    params: {
      channels: 6,
      kernelSize: 5,
      stride: 1,
    },
    inputShape: [1, 32, 32],
    outputShape: [6, 28, 28],
    description: '第一个卷积层：使用 6 个 5×5 的卷积核，步长为 1。输出 6 个通道的特征图。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 's2',
    type: 'AvgPool2D',
    name: 'S2 - Subsampling',
    params: {
      poolSize: 2,
      stride: 2,
    },
    inputShape: [6, 28, 28],
    outputShape: [6, 14, 14],
    description: '第一个池化层：2×2 平均池化，降低分辨率，增强特征的空间不变性。',
    color: '#06b6d4', // 青色
  },
  {
    id: 'c3',
    type: 'Conv2D',
    name: 'C3 - Convolution',
    params: {
      channels: 16,
      kernelSize: 5,
      stride: 1,
    },
    inputShape: [6, 14, 14],
    outputShape: [16, 10, 10],
    description: '第二个卷积层：使用 16 个 5×5 的卷积核。输出 16 个通道，提取更高层次的特征。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 's4',
    type: 'AvgPool2D',
    name: 'S4 - Subsampling',
    params: {
      poolSize: 2,
      stride: 2,
    },
    inputShape: [16, 10, 10],
    outputShape: [16, 5, 5],
    description: '第二个池化层：进一步降低空间维度，保留关键特征。',
    color: '#06b6d4', // 青色
  },
  {
    id: 'c5',
    type: 'Conv2D',
    name: 'C5 - Convolution',
    params: {
      channels: 120,
      kernelSize: 5,
      stride: 1,
    },
    inputShape: [16, 5, 5],
    outputShape: [120, 1, 1],
    description: '第三个卷积层：输出 120 个通道，空间维度降至 1×1，类似于全连接层的效果。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 'f6',
    type: 'Linear',
    name: 'F6 - Fully Connected',
    params: {
      outFeatures: 84,
    },
    inputShape: [120],
    outputShape: [84],
    description: '第一个全连接层：将 120 维特征映射到 84 维。',
    color: '#10b981', // 绿色
  },
  {
    id: 'output',
    type: 'Linear',
    name: 'Output Layer',
    params: {
      outFeatures: 10,
    },
    inputShape: [84],
    outputShape: [10],
    description: '输出层：10 个神经元对应 10 个数字类别（0-9）。使用 Softmax 激活函数得到概率分布。',
    color: '#f59e0b', // 琥珀色
  },
];

/**
 * 计算层之间的连接关系
 * 返回一个数组，每个元素包含源层和目标层的 ID
 */
export function getLayerConnections(): Array<{ from: string; to: string }> {
  const connections: Array<{ from: string; to: string }> = [];
  
  for (let i = 0; i < lenet5Architecture.length - 1; i++) {
    connections.push({
      from: lenet5Architecture[i].id,
      to: lenet5Architecture[i + 1].id,
    });
  }
  
  return connections;
}

/**
 * 根据 ID 获取层定义
 */
export function getLayerById(id: string): LayerDefinition | undefined {
  return lenet5Architecture.find((layer) => layer.id === id);
}

/**
 * 计算模型的总参数量
 */
export function calculateTotalParams(): number {
  let total = 0;
  
  for (const layer of lenet5Architecture) {
    if (layer.type === 'Conv2D') {
      // 卷积层参数 = (kernelSize × kernelSize × inputChannels + 1) × outputChannels
      const inputChannels = layer.inputShape[0];
      const outputChannels = layer.params.channels!;
      const kernelSize = layer.params.kernelSize!;
      total += (kernelSize * kernelSize * inputChannels + 1) * outputChannels;
    } else if (layer.type === 'Linear') {
      // 全连接层参数 = (inputFeatures + 1) × outFeatures
      const inputFeatures = layer.inputShape[0];
      const outFeatures = layer.params.outFeatures!;
      total += (inputFeatures + 1) * outFeatures;
    }
  }
  
  return total;
}
