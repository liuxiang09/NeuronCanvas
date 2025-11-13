/**
 * nodeFactory - 节点工厂函数
 * 
 * 功能说明：
 * - 提供创建各种类型神经网络层节点的工厂函数
 * - 自动为每个节点生成唯一ID（基于时间戳和随机字符串）
 * - 为每种节点类型设置合理的默认参数
 * - 支持所有LayerType类型：输入层、卷积层、全连接层、激活函数、归一化层等
 * - 提供统一的节点创建接口createNodeByType，简化节点创建流程
 * - 返回的节点可以直接添加到sandbox画布中
 */

import type { Layer, LayerType } from "@/lib/types"

/**
 * 生成唯一节点ID
 */
export function generateNodeId(type: LayerType): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 9)
  return `layer_${type}_${timestamp}_${random}`
}

/**
 * 根据节点类型生成默认名称
 */
function getDefaultName(type: LayerType, index?: number): string {
  const nameMap: Record<string, string> = {
    input: "输入层",
    embedding: "嵌入层",
    flatten: "展平层",
    linear: "全连接层",
    conv2d: "卷积层",
    maxpool2d: "最大池化层",
    avgpool2d: "平均池化层",
    adaptiveavgpool2d: "自适应平均池化层",
    batchnorm: "批归一化层",
    layernorm: "层归一化层",
    lrn: "局部响应归一化层",
    relu: "ReLU激活",
    sigmoid: "Sigmoid激活",
    tanh: "Tanh激活",
    softmax: "Softmax激活",
    dropout: "Dropout层",
    add: "加法层",
    concat: "拼接层",
    sequential: "顺序模块",
    parallel: "并行模块",
    "self-attention": "自注意力层",
    "cross-attention": "交叉注意力层",
  }
  const baseName = nameMap[type] || type
  return index !== undefined ? `${baseName} ${index + 1}` : baseName
}

/**
 * 创建输入层
 */
export function createInputLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("input"),
    name: getDefaultName("input"),
    type: "input",
    description: "",
    outputShape: [0, 0, 0, 0], // 输入层输出形状
  }
}

/**
 * 创建卷积层
 */
export function createConv2DLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("conv2d"),
    name: getDefaultName("conv2d"),
    type: "conv2d",
    description: "",
    filters: 0,
    kernelSize: [0, 0],
    stride: [0, 0],
    padding: [0, 0],
    outputShape: [0, 0, 0, 0],
  }
}

/**
 * 创建最大池化层
 */
export function createMaxPool2DLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("maxpool2d"),
    name: getDefaultName("maxpool2d"),
    type: "maxpool2d",
    description: "",
    poolSize: [0, 0],
    stride: [0, 0],
    padding: [0, 0],
    outputShape: [0, 0, 0, 0], // 根据poolSize和stride计算
  }
}

/**
 * 创建平均池化层
 */
export function createAvgPool2DLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("avgpool2d"),
    name: getDefaultName("avgpool2d"),
    type: "avgpool2d",
    description: "",
    poolSize: [0, 0],
    stride: [0, 0],
    padding: [0, 0],
    outputShape: [0, 0, 0, 0],
  }
}

/**
 * 创建自适应平均池化层
 */
export function createAdaptiveAvgPool2DLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("adaptiveavgpool2d"),
    name: getDefaultName("adaptiveavgpool2d"),
    type: "adaptiveavgpool2d",
    description: "",
    outputShape: [0, 0, 0, 0], // 自适应池化通常输出1x1
  }
}

/**
 * 创建展平层
 */
export function createFlattenLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("flatten"),
    name: getDefaultName("flatten"),
    type: "flatten",
    description: "",
    outputShape: [0, 0], // 展平后的形状
  }
}

/**
 * 创建线性层（全连接层）
 */
export function createLinearLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("linear"),
    name: getDefaultName("linear"),
    type: "linear",
    description: "",
    outputShape: [0, 0], // 默认输出
  }
}

/**
 * 创建嵌入层
 */
export function createEmbeddingLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("embedding"),
    name: getDefaultName("embedding"),
    type: "embedding",
    description: "",
    dimension: 0,
    outputShape: [0, 0, 0], // 批次大小64，序列长度100，嵌入维度128
  }
}

/**
 * 创建Dropout层
 */
export function createDropoutLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("dropout"),
    name: getDefaultName("dropout"),
    type: "dropout",
    description: "",
    rate: 0,
    outputShape: [0, 0], // Dropout不改变形状
  }
}

/**
 * 创建批归一化层
 */
export function createBatchNormLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("batchnorm"),
    name: getDefaultName("batchnorm"),
    type: "batchnorm",
    description: "",
    outputShape: [0, 0, 0, 0], // 批归一化不改变形状
  }
}

/**
 * 创建层归一化层
 */
export function createLayerNormLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("layernorm"),
    name: getDefaultName("layernorm"),
    type: "layernorm",
    description: "",
    outputShape: [0, 0], // 层归一化不改变形状
  }
}

/**
 * 创建局部响应归一化层
 */
export function createLRNLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("lrn"),
    name: getDefaultName("lrn"),
    type: "lrn",
    description: "",
    outputShape: [0, 0, 0, 0], // LRN不改变形状
  }
}

/**
 * 创建ReLU激活层
 */
export function createReLULayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("relu"),
    name: getDefaultName("relu"),
    type: "relu",
    description: "",
    outputShape: [0, 0, 0, 0], // 激活函数不改变形状
  }
}

/**
 * 创建Sigmoid激活层
 */
export function createSigmoidLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("sigmoid"),
    name: getDefaultName("sigmoid"),
    type: "sigmoid",
    description: "",
    outputShape: [0, 0], // 激活函数不改变形状
  }
}

/**
 * 创建Tanh激活层
 */
export function createTanhLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("tanh"),
    name: getDefaultName("tanh"),
    type: "tanh",
    description: "",
    outputShape: [0, 0, 0, 0], // 激活函数不改变形状
  }
}

/**
 * 创建Softmax激活层
 */
export function createSoftmaxLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("softmax"),
    name: getDefaultName("softmax"),
    type: "softmax",
    description: "",
    outputShape: [0, 0], // 激活函数不改变形状
  }
}

/**
 * 创建加法层
 */
export function createAddLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("add"),
    name: getDefaultName("add"),
    type: "add",
    description: "",
    outputShape: [0, 0, 0, 0], // 加法不改变形状（要求输入形状相同）
  }
}

/**
 * 创建拼接层
 */
export function createConcatLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("concat"),
    name: getDefaultName("concat"),
    type: "concat",
    description: "",
    outputShape: [0, 0, 0, 0], // 拼接后通道数翻倍
  }
}

/**
 * 创建顺序模块
 */
export function createSequentialLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("sequential"),
    name: getDefaultName("sequential"),
    type: "sequential",
    description: "",
    steps: [],
    outputShape: [0, 0, 0], // 默认输出（会根据子节点计算）
  }
}

/**
 * 创建并行模块
 */
export function createParallelLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("parallel"),
    name: getDefaultName("parallel"),
    type: "parallel",
    description: "",
    branches: [],
    outputShape: [0, 0, 0], // 默认输出（会根据子节点计算）
  }
}

/**
 * 创建自注意力层
 */
export function createSelfAttentionLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("self-attention"),
    name: getDefaultName("self-attention"),
    type: "self-attention",
    description: "",
    numHeads: 0,
    headDim: 0,
    modelDim: 0,
    outputShape: [0, 0, 0], // 自注意力输出形状与输入相同
  } as Layer
}

/**
 * 创建交叉注意力层
 */
export function createCrossAttentionLayer(
  position?: { x: number; y: number }
): Layer {
  return {
    id: generateNodeId("cross-attention"),
    name: getDefaultName("cross-attention"),
    type: "cross-attention",
    description: "",
    numHeads: 0,
    headDim: 0,
    modelDim: 0,
    outputShape: [0, 0, 0], // 交叉注意力输出形状与输入相同
  }
}

/**
 * 节点类型到创建函数的映射
 */
const nodeFactoryMap: Record<
  LayerType,
  (position?: { x: number; y: number }) => Layer
> = {
  input: createInputLayer,
  embedding: createEmbeddingLayer,
  flatten: createFlattenLayer,
  linear: createLinearLayer,
  conv2d: createConv2DLayer,
  maxpool2d: createMaxPool2DLayer,
  avgpool2d: createAvgPool2DLayer,
  adaptiveavgpool2d: createAdaptiveAvgPool2DLayer,
  batchnorm: createBatchNormLayer,
  layernorm: createLayerNormLayer,
  lrn: createLRNLayer,
  relu: createReLULayer,
  sigmoid: createSigmoidLayer,
  tanh: createTanhLayer,
  softmax: createSoftmaxLayer,
  dropout: createDropoutLayer,
  add: createAddLayer,
  concat: createConcatLayer,
  sequential: createSequentialLayer,
  parallel: createParallelLayer,
  "self-attention": createSelfAttentionLayer,
  "cross-attention": createCrossAttentionLayer,
}

/**
 * 根据类型创建节点
 */
export function createNodeByType(
  type: LayerType,
  position?: { x: number; y: number }
): Layer {
  const factory = nodeFactoryMap[type]
  if (!factory) {
    throw new Error(`Unknown node type: ${type}`)
  }
  return factory(position)
}

/**
 * 获取所有可用的节点类型
 */
export function getAvailableNodeTypes(): LayerType[] {
  return Object.keys(nodeFactoryMap) as LayerType[]
}

