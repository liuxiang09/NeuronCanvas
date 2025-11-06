/**
 * AlexNet 模型架构定义
 * 
 * 由 Alex Krizhevsky, Ilya Sutskever 和 Geoffrey Hinton 在 2012 年提出
 * 原论文: "ImageNet Classification with Deep Convolutional Neural Networks"
 * 
 * 网络结构:
 * Input (224×224×3) → Conv1 (55×55×96) → MaxPool1 (27×27×96) → 
 * Conv2 (27×27×256) → MaxPool2 (13×13×256) → Conv3 (13×13×384) → 
 * Conv4 (13×13×384) → Conv5 (13×13×256) → MaxPool3 (6×6×256) →
 * FC1 (4096) → FC2 (4096) → FC3 (1000)
 */

export interface LayerParams {
  channels?: number;      // 输出通道数（对于卷积层）
  kernelSize?: number;    // 卷积核大小
  stride?: number;        // 步长
  padding?: number;       // 填充
  poolSize?: number;      // 池化窗口大小
  outFeatures?: number;   // 输出特征数（对于全连接层）
  dropout?: number;       // Dropout 概率
}

export interface LayerDefinition {
  id: string;
  type: 'Input' | 'Conv2D' | 'MaxPool2D' | 'Linear' | 'Dropout' | 'ReLU';
  name: string;
  params: LayerParams;
  inputShape: number[];
  outputShape: number[];
  description: string;
  color: string;
}

/**
 * AlexNet 完整架构
 * 
 * 创新点:
 * - 首次在 CNN 中使用 ReLU 激活函数
 * - 使用 Dropout 防止过拟合
 * - 使用数据增强技术
 * - GPU 并行训练（原始版本在两个 GPU 上并行）
 * - 局部响应归一化（LRN）
 */
export const alexnetArchitecture: LayerDefinition[] = [
  {
    id: 'input',
    type: 'Input',
    name: 'Input Layer',
    params: {},
    inputShape: [3, 224, 224],
    outputShape: [3, 224, 224],
    description: '输入层：接收 224×224 的 RGB 彩色图像（3 通道）',
    color: '#3b82f6', // 蓝色
  },
  {
    id: 'conv1',
    type: 'Conv2D',
    name: 'Conv1',
    params: {
      channels: 96,
      kernelSize: 11,
      stride: 4,
      padding: 0,
    },
    inputShape: [3, 224, 224],
    outputShape: [96, 55, 55],
    description: '第一个卷积层：96 个 11×11 的卷积核，步长为 4。提取低层次特征如边缘和颜色。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 'relu1',
    type: 'ReLU',
    name: 'ReLU1',
    params: {},
    inputShape: [96, 55, 55],
    outputShape: [96, 55, 55],
    description: 'ReLU 激活函数：引入非线性，比 tanh 和 sigmoid 训练更快。',
    color: '#f97316', // 橙色
  },
  {
    id: 'pool1',
    type: 'MaxPool2D',
    name: 'MaxPool1',
    params: {
      poolSize: 3,
      stride: 2,
    },
    inputShape: [96, 55, 55],
    outputShape: [96, 27, 27],
    description: '第一个最大池化层：3×3 窗口，步长 2。降低空间维度，增强特征不变性。',
    color: '#06b6d4', // 青色
  },
  {
    id: 'conv2',
    type: 'Conv2D',
    name: 'Conv2',
    params: {
      channels: 256,
      kernelSize: 5,
      stride: 1,
      padding: 2,
    },
    inputShape: [96, 27, 27],
    outputShape: [256, 27, 27],
    description: '第二个卷积层：256 个 5×5 的卷积核。提取更复杂的特征组合。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 'relu2',
    type: 'ReLU',
    name: 'ReLU2',
    params: {},
    inputShape: [256, 27, 27],
    outputShape: [256, 27, 27],
    description: 'ReLU 激活函数：保持特征的非线性表达能力。',
    color: '#f97316', // 橙色
  },
  {
    id: 'pool2',
    type: 'MaxPool2D',
    name: 'MaxPool2',
    params: {
      poolSize: 3,
      stride: 2,
    },
    inputShape: [256, 27, 27],
    outputShape: [256, 13, 13],
    description: '第二个最大池化层：进一步降低空间维度。',
    color: '#06b6d4', // 青色
  },
  {
    id: 'conv3',
    type: 'Conv2D',
    name: 'Conv3',
    params: {
      channels: 384,
      kernelSize: 3,
      stride: 1,
      padding: 1,
    },
    inputShape: [256, 13, 13],
    outputShape: [384, 13, 13],
    description: '第三个卷积层：384 个 3×3 的卷积核。开始提取高层次的语义特征。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 'relu3',
    type: 'ReLU',
    name: 'ReLU3',
    params: {},
    inputShape: [384, 13, 13],
    outputShape: [384, 13, 13],
    description: 'ReLU 激活函数。',
    color: '#f97316', // 橙色
  },
  {
    id: 'conv4',
    type: 'Conv2D',
    name: 'Conv4',
    params: {
      channels: 384,
      kernelSize: 3,
      stride: 1,
      padding: 1,
    },
    inputShape: [384, 13, 13],
    outputShape: [384, 13, 13],
    description: '第四个卷积层：384 个 3×3 的卷积核。继续深化特征表示。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 'relu4',
    type: 'ReLU',
    name: 'ReLU4',
    params: {},
    inputShape: [384, 13, 13],
    outputShape: [384, 13, 13],
    description: 'ReLU 激活函数。',
    color: '#f97316', // 橙色
  },
  {
    id: 'conv5',
    type: 'Conv2D',
    name: 'Conv5',
    params: {
      channels: 256,
      kernelSize: 3,
      stride: 1,
      padding: 1,
    },
    inputShape: [384, 13, 13],
    outputShape: [256, 13, 13],
    description: '第五个卷积层：256 个 3×3 的卷积核。提取最终的卷积特征。',
    color: '#8b5cf6', // 紫色
  },
  {
    id: 'relu5',
    type: 'ReLU',
    name: 'ReLU5',
    params: {},
    inputShape: [256, 13, 13],
    outputShape: [256, 13, 13],
    description: 'ReLU 激活函数。',
    color: '#f97316', // 橙色
  },
  {
    id: 'pool3',
    type: 'MaxPool2D',
    name: 'MaxPool3',
    params: {
      poolSize: 3,
      stride: 2,
    },
    inputShape: [256, 13, 13],
    outputShape: [256, 6, 6],
    description: '第三个最大池化层：得到 6×6 的特征图，准备送入全连接层。',
    color: '#06b6d4', // 青色
  },
  {
    id: 'fc1',
    type: 'Linear',
    name: 'FC1',
    params: {
      outFeatures: 4096,
    },
    inputShape: [9216], // 256 * 6 * 6 = 9216
    outputShape: [4096],
    description: '第一个全连接层：将特征映射到 4096 维空间。',
    color: '#10b981', // 绿色
  },
  {
    id: 'relu6',
    type: 'ReLU',
    name: 'ReLU6',
    params: {},
    inputShape: [4096],
    outputShape: [4096],
    description: 'ReLU 激活函数。',
    color: '#f97316', // 橙色
  },
  {
    id: 'dropout1',
    type: 'Dropout',
    name: 'Dropout1',
    params: {
      dropout: 0.5,
    },
    inputShape: [4096],
    outputShape: [4096],
    description: 'Dropout 层：以 0.5 的概率随机丢弃神经元，防止过拟合。这是 AlexNet 的关键创新。',
    color: '#ef4444', // 红色
  },
  {
    id: 'fc2',
    type: 'Linear',
    name: 'FC2',
    params: {
      outFeatures: 4096,
    },
    inputShape: [4096],
    outputShape: [4096],
    description: '第二个全连接层：保持 4096 维特征表示。',
    color: '#10b981', // 绿色
  },
  {
    id: 'relu7',
    type: 'ReLU',
    name: 'ReLU7',
    params: {},
    inputShape: [4096],
    outputShape: [4096],
    description: 'ReLU 激活函数。',
    color: '#f97316', // 橙色
  },
  {
    id: 'dropout2',
    type: 'Dropout',
    name: 'Dropout2',
    params: {
      dropout: 0.5,
    },
    inputShape: [4096],
    outputShape: [4096],
    description: '第二个 Dropout 层：继续防止过拟合。',
    color: '#ef4444', // 红色
  },
  {
    id: 'fc3',
    type: 'Linear',
    name: 'Output Layer',
    params: {
      outFeatures: 1000,
    },
    inputShape: [4096],
    outputShape: [1000],
    description: '输出层：1000 个神经元对应 ImageNet 的 1000 个类别。使用 Softmax 得到概率分布。',
    color: '#f59e0b', // 琥珀色
  },
];

/**
 * 计算层之间的连接关系
 */
export function getLayerConnections(): Array<{ from: string; to: string }> {
  const connections: Array<{ from: string; to: string }> = [];
  
  for (let i = 0; i < alexnetArchitecture.length - 1; i++) {
    connections.push({
      from: alexnetArchitecture[i].id,
      to: alexnetArchitecture[i + 1].id,
    });
  }
  
  return connections;
}

/**
 * 根据 ID 获取层定义
 */
export function getLayerById(id: string): LayerDefinition | undefined {
  return alexnetArchitecture.find((layer) => layer.id === id);
}

/**
 * 计算模型的总参数量
 */
export function calculateTotalParams(): number {
  let total = 0;
  
  for (const layer of alexnetArchitecture) {
    if (layer.type === 'Conv2D') {
      const inputChannels = layer.inputShape[0];
      const outputChannels = layer.params.channels!;
      const kernelSize = layer.params.kernelSize!;
      total += (kernelSize * kernelSize * inputChannels + 1) * outputChannels;
    } else if (layer.type === 'Linear') {
      const inputFeatures = layer.inputShape[0];
      const outFeatures = layer.params.outFeatures!;
      total += (inputFeatures + 1) * outFeatures;
    }
  }
  
  return total;
}
