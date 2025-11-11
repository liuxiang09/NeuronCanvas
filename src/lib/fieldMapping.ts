/**
 * 字段映射表 - 将英文字段名映射为中文显示名称
 */

export const FIELD_LABEL_MAP: Record<string, string> = {
  
  // 输入输出相关
  shape: "输入形状",
  inputShape: "输入形状",
  outputShape: "输出形状",
  
  // 卷积层参数
  filters: "卷积核数量",
  kernelSize: "卷积核大小",
  stride: "步长",
  padding: "填充",
  depthMultiplier: "深度乘数",
  
  // 池化层参数
  poolSize: "池化窗口",
  poolingType: "池化类型",
  
  // 激活函数
  activation: "激活函数",
  
  // Dropout
  rate: "丢弃率",
  dropout: "Dropout",
  
  // 归一化层参数
  momentum: "动量",
  epsilon: "数值稳定性",
  numFeatures: "特征数量",
  normalizedShape: "归一化形状",
  numGroups: "组数",
  numChannels: "通道数",
  
  // 循环层参数
  hiddenSize: "隐藏层大小",
  numLayers: "层数",
  bidirectional: "双向",
  nonlinearity: "非线性激活",
  
  // Attention & Transformer
  numHeads: "注意力头数",
  embedDim: "嵌入维度",
  ffnDim: "前馈网络维度",
  
  // 其他
  axis: "拼接轴",
  mainPath: "主路径",
}

/**
 * 值映射表 - 将特定字段的英文值映射为中文
 */
export const VALUE_MAP: Record<string, Record<string, string>> = {
  outputType: {
    classification: "分类",
    regression: "回归",
  },
  poolingType: {
    max: "最大池化",
    average: "平均池化",
    avg: "平均池化",
    global: "全局池化",
    adaptive: "自适应池化",
  },
}

/**
 * 字段显示顺序配置
 * 定义每种层类型应该显示的字段及其顺序
 */
export const FIELD_ORDER_MAP: Record<string, string[]> = {
  // 输入层
  input: ["shape"],
  
  // 卷积层
  conv2d: ["filters", "kernelSize", "stride", "padding", "activation", "outputShape"],
  conv3d: ["filters", "kernelSize", "stride", "padding", "activation", "outputShape"],
  depthwise_conv: ["kernelSize", "stride", "padding", "depthMultiplier", "outputShape"],
  transpose_conv2d: ["filters", "kernelSize", "stride", "padding", "outputShape"],
  transpose_conv3d: ["filters", "kernelSize", "stride", "padding", "outputShape"],
  
  // 池化层
  maxpool2d: ["poolSize", "stride", "padding", "outputShape"],
  maxpool3d: ["poolSize", "stride", "padding", "outputShape"],
  avgpool2d: ["poolSize", "stride", "padding", "outputShape"],
  avgpool3d: ["poolSize", "stride", "padding", "outputShape"],
  global_avgpool: ["outputShape"],
  global_maxpool: ["outputShape"],
  adaptive_avgpool: ["outputSize", "outputShape"],
  adaptive_maxpool: ["outputSize", "outputShape"],
  
  // 全连接层
  dense: ["activation", "dropout", "outputShape"],
  
  // Dropout层
  dropout: ["rate", "outputShape"],
  dropout2d: ["rate", "outputShape"],
  dropout3d: ["rate", "outputShape"],
  alpha_dropout: ["rate", "outputShape"],
  
  // 归一化层
  batchnorm: ["numFeatures", "momentum", "epsilon"],
  batchnorm2d: ["numFeatures", "momentum", "epsilon"],
  batchnorm3d: ["numFeatures", "momentum", "epsilon"],
  layernorm: ["normalizedShape", "epsilon"],
  groupnorm: ["numGroups", "numChannels", "epsilon"],
  instancenorm: ["numFeatures", "epsilon"],
  
  // 展平层
  flatten: ["outputShape"],
  
  // 输出层
  output: ["activation", "outputShape"],
  
  // 连接层
  add: ["inputShapes", "outputShape"],
  concat: ["axis", "inputShapes", "outputShape"],
  multiply: ["inputShapes", "outputShape"],
  
  // 残差块
  residual: ["inputShape", "outputShape"],
  
  // 主干网络层
  stem: ["outputShape"],
  
  // 循环层
  lstm: ["hiddenSize", "numLayers", "bidirectional", "dropout", "outputShape"],
  gru: ["hiddenSize", "numLayers", "bidirectional", "dropout", "outputShape"],
  rnn: ["hiddenSize", "numLayers", "nonlinearity", "bidirectional", "dropout", "outputShape"],
  
  // Attention & Transformer
  attention: ["numHeads", "embedDim", "dropout"],
  transformer: ["numHeads", "embedDim", "ffnDim", "dropout", "numLayers"],
}

/**
 * 获取字段的中文标签
 */
export function getFieldLabel(fieldName: string): string {
  return FIELD_LABEL_MAP[fieldName] || fieldName
}

/**
 * 获取字段值的中文映射（如果存在）
 */
export function getValueLabel(fieldName: string, value: any): string | null {
  if (VALUE_MAP[fieldName] && typeof value === "string") {
    return VALUE_MAP[fieldName][value] || null
  }
  return null
}

/**
 * 获取层类型应该显示的字段列表（按顺序）
 */
export function getFieldOrder(layerType: string): string[] {
  return FIELD_ORDER_MAP[layerType] || []
}
