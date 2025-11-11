/**
 * NeuronCanvas 类型定义
 * 定义模型、层、边等核心数据结构
 */

/**
 * 层的类型枚举
 */
export type LayerType =
  // 基础层
  | "input"           // 输入层
  | "output"          // 输出层
  | "flatten"         // 展平层
  | "dense"           // 全连接层 (Linear)
  
  // 卷积层 (2D/3D)
  | "conv2d"          // 2D 卷积层
  | "conv3d"          // 3D 卷积层
  | "depthwise_conv"  // 深度可分离卷积
  | "transpose_conv2d" // 2D 转置卷积 (反卷积)
  | "transpose_conv3d" // 3D 转置卷积
  
  // 池化层 (2D/3D)
  | "maxpool2d"       // 2D 最大池化
  | "maxpool3d"       // 3D 最大池化
  | "avgpool2d"       // 2D 平均池化
  | "avgpool3d"       // 3D 平均池化
  | "global_avgpool"  // 全局平均池化
  | "global_maxpool"  // 全局最大池化
  | "adaptive_avgpool" // 自适应平均池化
  | "adaptive_maxpool" // 自适应最大池化
  
  // 归一化层
  | "batchnorm"       // 批归一化 (BatchNorm)
  | "batchnorm2d"     // 2D 批归一化
  | "batchnorm3d"     // 3D 批归一化
  | "layernorm"       // 层归一化 (LayerNorm)
  | "instancenorm"    // 实例归一化 (InstanceNorm)
  | "groupnorm"       // 组归一化 (GroupNorm)
  
  // 正则化层
  | "dropout"         // Dropout
  | "dropout2d"       // 2D Dropout (Spatial Dropout)
  | "dropout3d"       // 3D Dropout
  | "alpha_dropout"   // Alpha Dropout
  
  // 特殊模块
  | "attention"       // 注意力机制
  | "transformer"     // Transformer 块
  | "stem"            // 主干网络层(可包含多个子层)
  
  // 连接层
  | "add"             // 加法层(用于残差连接)
  | "concat"          // 拼接层
  | "multiply"        // 乘法层
  
  // 循环层
  | "lstm"            // LSTM 层
  | "gru"             // GRU 层
  | "rnn";            // 基础 RNN 层

/**
 * 激活函数类型 (用于层参数配置，不作为独立层)
 */
export type ActivationType =
  | "relu"
  | "relu6"
  | "leaky_relu"
  | "prelu"
  | "elu"
  | "selu"
  | "gelu"
  | "sigmoid"
  | "tanh"
  | "softmax"
  | "softplus"
  | "swish"
  | "mish"
  | "hardswish"
  | "hardsigmoid";

/**
 * 池化类型 (保留用于配置)
 */
export type PoolingType = "max" | "average" | "global" | "adaptive";

/**
 * 层的基础接口
 */
export interface LayerBase {
  id: string;                    // 唯一标识符
  name: string;                  // 显示名称
  type: LayerType;               // 层类型
  description?: string;          // 描述信息
}

/**
 * 输入层
 */
export interface InputLayer extends LayerBase {
  type: "input";
  shape: number[];               // 输入形状 [height, width, channels] 或 [depth, height, width, channels]
}

/**
 * 2D 卷积层
 */
export interface Conv2DLayer extends LayerBase {
  type: "conv2d";
  filters: number;               // 卷积核数量
  kernelSize: [number, number];  // 卷积核大小 [height, width]
  stride?: [number, number];     // 步长
  padding?: [number, number];    // 填充 [height, width]
  activation?: ActivationType;   // 激活函数
  outputShape: number[];         // 输出形状
}

/**
 * 3D 卷积层
 */
export interface Conv3DLayer extends LayerBase {
  type: "conv3d";
  filters: number;                      // 卷积核数量
  kernelSize: [number, number, number]; // 卷积核大小 [depth, height, width]
  stride?: [number, number, number];    // 步长
  padding?: [number, number, number];   // 填充 [depth, height, width]
  activation?: ActivationType;          // 激活函数
  outputShape: number[];                // 输出形状
}

/**
 * 2D 最大池化层
 */
export interface MaxPool2DLayer extends LayerBase {
  type: "maxpool2d";
  poolSize: [number, number];    // 池化窗口大小
  stride?: [number, number];     // 步长
  padding?: [number, number];    // 填充 [height, width]
  outputShape: number[];         // 输出形状
}

/**
 * 2D 平均池化层
 */
export interface AvgPool2DLayer extends LayerBase {
  type: "avgpool2d";
  poolSize: [number, number];    // 池化窗口大小
  stride?: [number, number];     // 步长
  padding?: [number, number];    // 填充 [height, width]
  outputShape: number[];         // 输出形状
}

/**
 * 3D 最大池化层
 */
export interface MaxPool3DLayer extends LayerBase {
  type: "maxpool3d";
  poolSize: [number, number, number];    // 池化窗口大小
  stride?: [number, number, number];     // 步长
  padding?: [number, number, number];    // 填充 [depth, height, width]
  outputShape: number[];                 // 输出形状
}

/**
 * 3D 平均池化层
 */
export interface AvgPool3DLayer extends LayerBase {
  type: "avgpool3d";
  poolSize: [number, number, number];    // 池化窗口大小
  stride?: [number, number, number];     // 步长
  padding?: [number, number, number];    // 填充 [depth, height, width]
  outputShape: number[];                 // 输出形状
}

/**
 * 展平层
 */
export interface FlattenLayer extends LayerBase {
  type: "flatten";
  outputSize: number;            // 展平后的大小
}

/**
 * 全连接层 (Dense)
 */
export interface DenseLayer extends LayerBase {
  type: "dense";
  activation?: ActivationType;   // 激活函数
  outputShape: number[];         // 输出形状
}

/**
 * Dropout 层
 */
export interface DropoutLayer extends LayerBase {
  type: "dropout" | "dropout2d" | "dropout3d" | "alpha_dropout";
  rate: number;                  // Dropout 比例 (0-1)
}

/**
 * 全局平均池化层
 */
export interface GlobalAvgPoolLayer extends LayerBase {
  type: "global_avgpool";
  outputShape: number[];         // 输出形状
}

/**
 * 全局最大池化层
 */
export interface GlobalMaxPoolLayer extends LayerBase {
  type: "global_maxpool";
  outputShape: number[];         // 输出形状
}

/**
 * 自适应平均池化层
 */
export interface AdaptiveAvgPoolLayer extends LayerBase {
  type: "adaptive_avgpool";
  outputSize: number | [number, number];  // 输出大小
  outputShape: number[];                   // 输出形状
}

/**
 * 自适应最大池化层
 */
export interface AdaptiveMaxPoolLayer extends LayerBase {
  type: "adaptive_maxpool";
  outputSize: number | [number, number];  // 输出大小
  outputShape: number[];                   // 输出形状
}

/**
 * 深度可分离卷积层
 */
export interface DepthwiseConvLayer extends LayerBase {
  type: "depthwise_conv";
  kernelSize: [number, number];  // 卷积核大小
  stride?: [number, number];     // 步长
  padding?: [number, number];    // 填充 [height, width]
  depthMultiplier?: number;      // 深度乘数
  outputShape: number[];         // 输出形状
}

/**
 * 2D 转置卷积层 (反卷积)
 */
export interface TransposeConv2DLayer extends LayerBase {
  type: "transpose_conv2d";
  filters: number;               // 卷积核数量
  kernelSize: [number, number];  // 卷积核大小
  stride?: [number, number];     // 步长
  padding?: [number, number];    // 填充 [height, width]
  outputShape: number[];         // 输出形状
}

/**
 * 3D 转置卷积层
 */
export interface TransposeConv3DLayer extends LayerBase {
  type: "transpose_conv3d";
  filters: number;                      // 卷积核数量
  kernelSize: [number, number, number]; // 卷积核大小
  stride?: [number, number, number];    // 步长
  padding?: [number, number, number];   // 填充 [depth, height, width]
  outputShape: number[];                // 输出形状
}

/**
 * LSTM 层
 */
export interface LSTMLayer extends LayerBase {
  type: "lstm";
  hiddenSize: number;            // 隐藏层大小
  numLayers?: number;            // 层数
  bidirectional?: boolean;       // 是否双向
  outputShape: number[];         // 输出形状
}

/**
 * GRU 层
 */
export interface GRULayer extends LayerBase {
  type: "gru";
  hiddenSize: number;            // 隐藏层大小
  numLayers?: number;            // 层数
  bidirectional?: boolean;       // 是否双向
  outputShape: number[];         // 输出形状
}

/**
 * 基础 RNN 层
 */
export interface RNNLayer extends LayerBase {
  type: "rnn";
  hiddenSize: number;            // 隐藏层大小
  numLayers?: number;            // 层数
  nonlinearity?: "tanh" | "relu"; // 非线性激活
  bidirectional?: boolean;       // 是否双向
  outputShape: number[];         // 输出形状
}

/**
 * 注意力机制层
 */
export interface AttentionLayer extends LayerBase {
  type: "attention";
  numHeads?: number;             // 注意力头数
  embedDim?: number;             // 嵌入维度
}

/**
 * Transformer 块
 */
export interface TransformerLayer extends LayerBase {
  type: "transformer";
  numHeads: number;              // 注意力头数
  embedDim: number;              // 嵌入维度
  ffnDim: number;                // 前馈网络维度
  numLayers?: number;            // Transformer 层数
}

/**
 * 乘法层
 */
export interface MultiplyLayer extends LayerBase {
  type: "multiply";
  inputShapes: number[][];       // 多个输入的形状
  outputShape: number[];         // 输出形状
}

/**
 * 批归一化层 (通用)
 */
export interface BatchNormLayer extends LayerBase {
  type: "batchnorm" | "batchnorm2d" | "batchnorm3d";
  momentum?: number;             // 动量
  epsilon?: number;              // 数值稳定性参数
  numFeatures?: number;          // 特征数量
}

/**
 * 层归一化层
 */
export interface LayerNormLayer extends LayerBase {
  type: "layernorm";
  normalizedShape: number[];     // 归一化的形状
  epsilon?: number;              // 数值稳定性参数
}

/**
 * 组归一化层
 */
export interface GroupNormLayer extends LayerBase {
  type: "groupnorm";
  numGroups: number;             // 组数
  numChannels: number;           // 通道数
  epsilon?: number;              // 数值稳定性参数
}

/**
 * 实例归一化层
 */
export interface InstanceNormLayer extends LayerBase {
  type: "instancenorm";
  numFeatures: number;           // 特征数量
  epsilon?: number;              // 数值稳定性参数
}

/**
 * 输出层
 */
export interface OutputLayer extends LayerBase {
  type: "output";
  activation: ActivationType;    // 激活函数
  outputShape: number[];         // 输出形状
}

/**
 * 加法层（用于实现残差连接）
 */
export interface AddLayer extends LayerBase {
  type: "add";
  inputShapes: number[][];       // 多个输入的形状
  outputShape: number[];         // 输出形状
}

/**
 * 拼接层（用于合并分支）
 */
export interface ConcatLayer extends LayerBase {
  type: "concat";
  axis: number;                  // 拼接的轴
  inputShapes: number[][];       // 输入形状列表
  outputShape: number[];         // 输出形状
}

/**
 * 主干网络层(通用的层容器,可包含任意子层序列)
 */
export interface StemLayer extends LayerBase {
  type: "stem";
  steps: Layer[];                // 主干网络的步骤序列
  inputShape: number[];          // 输入形状
  outputShape: number[];         // 输出形状
  color?: string;                // 自定义颜色主题 (如 "amber", "emerald", "blue" 等)
}

/**
 * 联合类型:所有层类型
 */
export type Layer =
  // 基础层
  | InputLayer
  | OutputLayer
  | FlattenLayer
  | DenseLayer
  
  // 卷积层
  | Conv2DLayer
  | Conv3DLayer
  | DepthwiseConvLayer
  | TransposeConv2DLayer
  | TransposeConv3DLayer
  
  // 池化层
  | MaxPool2DLayer
  | AvgPool2DLayer
  | MaxPool3DLayer
  | AvgPool3DLayer
  | GlobalAvgPoolLayer
  | GlobalMaxPoolLayer
  | AdaptiveAvgPoolLayer
  | AdaptiveMaxPoolLayer
  
  // 归一化层
  | BatchNormLayer
  | LayerNormLayer
  | GroupNormLayer
  | InstanceNormLayer
  
  // 正则化层
  | DropoutLayer
  
  // 循环层
  | LSTMLayer
  | GRULayer
  | RNNLayer
  
  // 特殊模块
  | AddLayer
  | ConcatLayer
  | MultiplyLayer
  | AttentionLayer
  | TransformerLayer
  | StemLayer;

/**
 * 边(连接)定义
 */
export interface Edge {
  id: string;                    // 唯一标识符
  source: string;                // 源节点 ID
  target: string;                // 目标节点 ID
  label?: string;                // 边的标签 (可选)
  animated?: boolean;            // 是否显示动画
  type?: "default" | "residual"; // 边的类型：default=普通连接, residual=残差连接
}

/**
 * 模型元数据
 */
export interface ModelMetadata {
  name: string;                  // 模型名称
  displayName: string;           // 显示名称
  description: string;           // 模型描述
  year?: number;                 // 提出年份
  authors?: string[];            // 作者
  paper?: string;                // 论文链接
  paperTitle?: string;           // 论文标题
  citations?: number;            // 论文引用数
  tags?: string[];               // 标签
  category?: string;             // 分类 (CNN, RNN, Transformer, etc.)
}

/**
 * 完整的模型定义
 */
export interface Model {
  metadata: ModelMetadata;       // 元数据
  layers: Layer[];               // 层列表
  edges: Edge[];                 // 边列表
}

/**
 * React Flow 节点位置
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * React Flow 节点 (带位置信息)
 */
export interface FlowNode {
  id: string;
  type: string;                  // 自定义节点类型名称
  position: Position;
  data: Layer;                   // 层数据
}

/**
 * React Flow 边 (带样式)
 */
export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  markerEnd?: {
    type: "arrow" | "arrowclosed";
    color?: string;
  };
}

/**
 * 布局配置
 */
export interface LayoutConfig {
  direction: "LR" | "TB" | "RL" | "BT";  // 布局方向
  nodeWidth?: number;                     // 节点宽度
  nodeHeight?: number;                    // 节点高度
  rankSep?: number;                       // 层级间距
  nodeSep?: number;                       // 节点间距
}
