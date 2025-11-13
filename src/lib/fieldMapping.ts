import {
  Image,
  Layers,
  Droplets,
  Maximize2,
  Network,
  Plus,
  Grid3x3,
  Package,
  GitMerge,
  Zap,
  GitBranch,
  Target,
  BookOpen,
} from "lucide-react";
import type { Layer } from "./types";

const FIELD_LABEL_MAP: Record<string, string> = {
  outputShape: "输出形状",
  filters: "卷积核数量",
  kernelSize: "卷积核大小",
  stride: "步长",
  padding: "填充",
  poolSize: "池化窗口",
  rate: "丢弃率",
  numFeatures: "特征数量",
  normType: "归一化类型",
  type: "类型",
  dimension: "嵌入维度",
  numHeads: "注意力头数",
  headDim: "单头维度",
  modelDim: "模型维度",
  dropout: "Dropout",
  activation: "激活函数",
};

export const FIELD_ORDER_MAP: Record<string, string[]> = {
  input: ["outputShape"],
  conv2d: ["filters", "kernelSize", "stride", "padding", "outputShape"],
  maxpool2d: ["poolSize", "stride", "padding", "outputShape"],
  avgpool2d: ["poolSize", "stride", "padding", "outputShape"],
  adaptiveavgpool2d: ["outputShape"],
  linear: ["outputShape"],
  embedding: ["dimension", "outputShape"],
  dropout: ["rate", "outputShape"],
  batchnorm: ["outputShape"],
  layernorm: ["outputShape"],
  lrn: ["outputShape"],
  relu: ["outputShape"],
  sigmoid: ["outputShape"],
  tanh: ["outputShape"],
  softmax: ["outputShape"],
  flatten: ["outputShape"],
  add: ["outputShape"],
  concat: ["outputShape"],
  sequential: ["outputShape"],
  parallel: ["outputShape"],
  "self-attention": ["numHeads", "headDim", "modelDim", "outputShape"],
  "cross-attention": ["numHeads", "headDim", "modelDim", "outputShape"],
};

export const ICON_MAP: Record<string, any> = {
  input: Image,
  conv2d: Layers,
  maxpool2d: Droplets,
  avgpool2d: Droplets,
  adaptiveavgpool2d: Droplets,
  flatten: Maximize2,
  linear: Network,
  embedding: BookOpen,
  dropout: Grid3x3,
  batchnorm: Layers,
  batchnorm2d: Layers,
  layernorm: Layers,
  lrn: Layers,
  relu: Zap,
  sigmoid: Zap,
  tanh: Zap,
  softmax: Zap,
  add: Plus,
  concat: GitMerge,
  sequential: Package,
  parallel: GitBranch,
  "self-attention": Target,
  "cross-attention": Target,
};

const HIGHLIGHT_FIELDS = ["outputShape"];

export function getFieldLabel(fieldName: string): string {
  return FIELD_LABEL_MAP[fieldName] || fieldName;
}

export function getFieldOrder(layerType: string): string[] {
  return FIELD_ORDER_MAP[layerType] || [];
}

export function getLayerIcon(type: string) {
  return ICON_MAP[type] || Layers;
}

export function getLayerParams(layer: Layer): Array<{
  label: string;
  value: string;
  isHighlight?: boolean;
}> {
  const params: Array<{ label: string; value: string; isHighlight?: boolean }> =
    [];
  const fieldOrder = getFieldOrder(layer.type);
  const anyLayer = layer as any;

  for (const fieldKey of fieldOrder) {
    let value = anyLayer[fieldKey];
    if (value === undefined || value === null) {
      if (fieldKey === "type" && "type" in anyLayer) {
        value = anyLayer.type;
      } else {
        continue;
      }
    }

    const label = getFieldLabel(fieldKey);
    const formattedValue = formatFieldValue(fieldKey, value);
    if (!formattedValue) {
      continue;
    }

    const isHighlight = HIGHLIGHT_FIELDS.includes(fieldKey);

    params.push({
      label,
      value: formattedValue,
      isHighlight,
    });
  }

  if (layer.type === "parallel") {
    const branches = (layer as any).branches || [];
    params.unshift({
      label: "分支数量",
      value: branches.length.toString(),
    });
  }

  return params;
}

export function formatFieldValue(key: string, value: any): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    const formatArray = (arr: any[]): string =>
      `[${arr
        .map((item) => (Array.isArray(item) ? formatArray(item) : String(item)))
        .join(", ")}]`;

    if (value.every((v) => Array.isArray(v))) {
      return value.map((item) => formatArray(item)).join(" | ");
    }
    if (value.every((v) => typeof v === "number" || typeof v === "string")) {
      return formatArray(value);
    }
    return formatArray(value);
  }

  if (typeof value === "boolean") {
    return value ? "是" : "否";
  }

  if (typeof value === "number") {
    if ((key === "rate" || key === "dropout") && value < 1) {
      return `${(value * 100).toFixed(0)}%`;
    }
    return value.toString();
  }

  return String(value);
}

/**
 * 节点类型的中文名称映射
 * 统一管理所有节点类型的中文显示名称
 */
export const NODE_TYPE_NAMES: Record<string, string> = {
  input: "输入层",
  embedding: "嵌入层",
  flatten: "展平层",
  linear: "全连接层",
  conv2d: "卷积层",
  maxpool2d: "最大池化",
  avgpool2d: "平均池化",
  adaptiveavgpool2d: "自适应池化",
  batchnorm: "批归一化",
  layernorm: "层归一化",
  lrn: "局部响应归一化",
  relu: "ReLU",
  sigmoid: "Sigmoid",
  tanh: "Tanh",
  softmax: "Softmax",
  dropout: "Dropout",
  add: "加法",
  concat: "拼接",
  sequential: "顺序模块",
  parallel: "并行模块",
  "self-attention": "自注意力",
  "cross-attention": "交叉注意力",
}

/**
 * 获取节点类型的中文名称
 */
export function getNodeTypeName(type: string): string {
  return NODE_TYPE_NAMES[type] || type
}
