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
} from "lucide-react"
import type { Layer } from "./types"

const FIELD_LABEL_MAP: Record<string, string> = {
  shape: "输入形状",
  inputShape: "输入形状",
  outputShape: "输出形状",
  filters: "卷积核数量",
  kernelSize: "卷积核大小",
  stride: "步长",
  padding: "填充",
  poolSize: "池化窗口",
  activation: "激活函数",
  units: "神经元数量",
  rate: "丢弃率",
  momentum: "动量",
  epsilon: "数值稳定性",
  numFeatures: "特征数量",
  inputShapes: "输入形状列表",
  normType: "归一化类型",
  alpha: "α",
  beta: "β",
  k: "k",
  type: "类型",
}

const FIELD_ORDER_MAP: Record<string, string[]> = {
  input: ["shape"],
  conv2d: ["filters", "kernelSize", "stride", "padding", "outputShape"],
  maxpool2d: ["poolSize", "stride", "padding", "outputShape"],
  avgpool2d: ["poolSize", "stride", "padding", "outputShape"],
  adaptiveavgpool2d: ["outputShape"],
  linear: ["outputShape"],
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
  sequential: ["inputShape", "outputShape"],
  parallel: ["inputShape", "outputShape"],
}

const ICON_MAP: Record<string, any> = {
  input: Image,
  conv2d: Layers,
  maxpool2d: Droplets,
  avgpool2d: Droplets,
  adaptiveavgpool2d: Droplets,
  flatten: Maximize2,
  linear: Network,
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
}

const HIGHLIGHT_FIELDS = ["outputShape", "shape"]

export function getFieldLabel(fieldName: string): string {
  return FIELD_LABEL_MAP[fieldName] || fieldName
}

export function getFieldOrder(layerType: string): string[] {
  return FIELD_ORDER_MAP[layerType] || []
}

export function getLayerIcon(type: string) {
  return ICON_MAP[type] || Layers
}

export function getLayerParams(layer: Layer): Array<{ 
  label: string
  value: string
  isHighlight?: boolean 
}> {
  const params: Array<{ label: string; value: string; isHighlight?: boolean }> = []
  const fieldOrder = getFieldOrder(layer.type)
  const anyLayer = layer as any

  for (const fieldKey of fieldOrder) {
    let value = anyLayer[fieldKey]
    if (value === undefined || value === null) {
      if (fieldKey === "type" && "type" in anyLayer) {
        value = anyLayer.type
      } else {
      continue
      }
    }

    const label = getFieldLabel(fieldKey)
    const formattedValue = formatFieldValue(fieldKey, value)
    if (!formattedValue) {
      continue
    }

    const isHighlight = HIGHLIGHT_FIELDS.includes(fieldKey)

    params.push({
      label,
      value: formattedValue,
      isHighlight,
    })
  }

  if (layer.type === "parallel") {
    const branches = (layer as any).branches || []
    params.unshift({
      label: "分支数量",
      value: branches.length.toString(),
    })
  }

  return params
}

export function formatFieldValue(key: string, value: any): string {
  if (value === undefined || value === null) {
    return ""
  }

  if (Array.isArray(value)) {
    const formatArray = (arr: any[]): string =>
      `[${arr
        .map((item) =>
          Array.isArray(item) ? formatArray(item) : String(item)
        )
        .join(", ")}]`

    if (value.every((v) => Array.isArray(v))) {
      return value.map((item) => formatArray(item)).join(" | ")
    }
    if (value.every((v) => typeof v === "number" || typeof v === "string")) {
      return formatArray(value)
    }
    return formatArray(value)
  }

  if (typeof value === "boolean") {
    return value ? "是" : "否"
  }

  if (typeof value === "number") {
    if ((key === "rate" || key === "dropout") && value < 1) {
      return `${(value * 100).toFixed(0)}%`
    }
    return value.toString()
  }

  return String(value)
}
