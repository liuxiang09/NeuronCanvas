/**
 * NeuronCanvas 类型定义。
 *
 * 该文件仅保留节点和布局计算真正需要的字段。若需要扩展字段，请同步更新
 * `fieldMapping.ts` 以及相关节点渲染逻辑。
 */

/** 激活函数类型 */
export type ActivationType = "relu" | "sigmoid" | "tanh" | "softmax";

/** 归一化层类型 */
export type NormType = "batchnorm" | "layernorm" | "lrn";

/** 注意力类型 */
export type AttentionType = "self-attention" | "cross-attention";

/**
 * 节点类型枚举
 *
 * - 与 `fieldMapping.ts`、`layout.ts` 中的映射保持一致
 * - 新增节点类型时，请同时补充对应的自定义节点组件
 */
export type LayerType =
  | "input"
  | "embedding"
  | "flatten"
  | "linear"
  | "conv2d"
  | "maxpool2d"
  | "avgpool2d"
  | "adaptiveavgpool2d"
  | AttentionType
  | NormType
  | ActivationType
  | "dropout"
  | "add"
  | "concat"
  | "sequential"
  | "parallel";

/**
 * 所有层共同的基础字段
 *
 * - `inputShape`/`outputShape` 可为单形状或嵌套（如并行分支）
 * - 具体层的专有字段在各自接口中定义
 */
export interface LayerBase {
  id: string;
  name: string;
  type: LayerType;
  description?: string;
  inputShape?: number[] | number[][];
  outputShape?: number[] | number[][];
}

/** 输入层 */
export interface InputLayer extends LayerBase {
  type: "input";
}

/** 2D 卷积层 */
export interface Conv2DLayer extends LayerBase {
  type: "conv2d";
  filters: number;
  kernelSize: number[];
  stride?: number[];
  padding?: number[];
  activation?: ActivationType;
}

/** 最大池化层 */
export interface MaxPool2DLayer extends LayerBase {
  type: "maxpool2d";
  poolSize: number[];
  stride?: number[];
  padding?: number[];
}

/** 平均池化层 */
export interface AvgPool2DLayer extends LayerBase {
  type: "avgpool2d";
  poolSize: number[];
  stride?: number[];
  padding?: number[];
}

/** 自适应平均池化层（全局平均池化等） */
export interface AdaptiveAvgPool2DLayer extends LayerBase {
  type: "adaptiveavgpool2d";
}

/** 展平层 */
export interface FlattenLayer extends LayerBase {
  type: "flatten";
}

/** 线性层（全连接层） */
export interface LinearLayer extends LayerBase {
  type: "linear";
}

/** 嵌入层 */
export interface EmbeddingLayer extends LayerBase {
  type: "embedding";
  dimension: number;
}

/** Dropout 层 */
export interface DropoutLayer extends LayerBase {
  type: "dropout";
  rate: number;
}

/**
 * 归一化层
 *
 * 字段覆盖常见的归一化超参数，使用时按需填写即可。
 */
export interface NormLayer extends LayerBase {
  type: NormType;
}

/** 激活层 */
export interface ActivationLayer extends LayerBase {
  type: ActivationType;
}

export interface AttentionLayer extends LayerBase {
  type: AttentionType;
  numHeads: number;
  headDim: number;
  modelDim: number;
  usesMask?: boolean;
}

/** 加法层（用于残差连接） */
export interface AddLayer extends LayerBase {
  type: "add";
}

/** 拼接层 */
export interface ConcatLayer extends LayerBase {
  type: "concat";
}

/** 顺序模块（线性组合子层） */
export interface SequentialLayer extends LayerBase {
  type: "sequential";
  steps: Layer[];
  color?: string;
}

/** 并行模块的分支定义 */
export interface ParallelBranch {
  id?: string;
  name?: string;
  steps: Layer[];
  outputShape?: number[];
  color?: string;
}

/** 并行模块（类似 Inception、残差块） */
export interface ParallelLayer extends LayerBase {
  type: "parallel";
  branches: ParallelBranch[];
  color?: string;
}

/** 所有节点类型的联合类型 */
export type Layer =
  | InputLayer
  | EmbeddingLayer
  | FlattenLayer
  | LinearLayer
  | Conv2DLayer
  | MaxPool2DLayer
  | AvgPool2DLayer
  | AdaptiveAvgPool2DLayer
  | NormLayer
  | DropoutLayer
  | AttentionLayer
  | AddLayer
  | ConcatLayer
  | ActivationLayer
  | SequentialLayer
  | ParallelLayer;

/** 边（连接）定义 */
export interface Edge {
  id: string;
  source: string;
  target: string;
  label?: string;
  animated?: boolean;
  type?: string;
  sourceHandle?: string;
  targetHandle?: string;
}

/** 模型元数据 */
export interface ModelMetadata {
  name: string;
  displayName: string;
  description: string;
  year?: number;
  authors?: string[];
  paper?: string;
  paperTitle?: string;
  citations?: number;
  tags?: string[];
  category?: string[];
  verified?: boolean;
}

/** 完整的模型定义 */
export interface Model {
  metadata: ModelMetadata;
  layers: Layer[];
  edges: Edge[];
}

/** Dagre 布局配置 */
export interface LayoutConfig {
  direction: "LR" | "TB" | "RL" | "BT";
  nodeWidth?: number;
  nodeHeight?: number;
  rankSep?: number;
  nodeSep?: number;
}
