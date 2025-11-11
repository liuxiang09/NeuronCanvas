import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import dagre from "dagre"
import type { Node, Edge } from "reactflow"
import type { Layer, Edge as ModelEdge, LayoutConfig } from "./types"

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 使用 Dagre 计算从左到右的布局（基础版本）
 * @param layers 层数组
 * @param edges 边数组
 * @param config 布局配置
 * @returns 带位置信息的节点和边
 */
export function calculateLayout(
  layers: Layer[],
  edges: ModelEdge[],
  config?: Partial<LayoutConfig>
): { nodes: Node[]; edges: Edge[] } {
  // 默认配置
  const layoutConfig: LayoutConfig = {
    direction: "LR",
    nodeWidth: 240,
    nodeHeight: 120,
    rankSep: 100,
    nodeSep: 150,
    ...config,
  }

  // 创建有向图
  const graph = new dagre.graphlib.Graph()

  // 配置图的布局参数
  graph.setGraph({
    rankdir: layoutConfig.direction,
    nodesep: layoutConfig.nodeSep,
    ranksep: layoutConfig.rankSep,
    marginx: 50,
    marginy: 50,
  })

  // 设置默认的边属性
  graph.setDefaultEdgeLabel(() => ({}))

  // 添加节点到图中
  layers.forEach((layer) => {
    let nodeWidth = layoutConfig.nodeWidth
    let nodeHeight = layoutConfig.nodeHeight
    
    if (layer.type === "add") {
      nodeWidth = 100
      nodeHeight = 100
    } else if (layer.type === "stem") {
      nodeWidth = 320
      nodeHeight = 200
    }
    
    graph.setNode(layer.id, {
      width: nodeWidth,
      height: nodeHeight,
      label: layer.name,
    })
  })

  // 添加边到图中
  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target)
  })

  // 执行布局计算
  dagre.layout(graph)

  // 获取节点的类型映射
  const nodeTypeMap = getNodeTypeMap()

  // 转换为 React Flow 节点
  const flowNodes: Node[] = layers.map((layer) => {
    const node = graph.node(layer.id)
    
    let nodeWidth = layoutConfig.nodeWidth!
    let nodeHeight = layoutConfig.nodeHeight!
    
    if (layer.type === "add") {
      nodeWidth = 100
      nodeHeight = 100
    } else if (layer.type === "stem") {
      nodeWidth = 320
      nodeHeight = 200
    }
    
    return {
      id: layer.id,
      type: nodeTypeMap[layer.type],
      position: {
        x: node.x - nodeWidth / 2,
        y: node.y - nodeHeight / 2,
      },
      data: layer,
    }
  })

  // 转换为 React Flow 边
  const flowEdges: Edge[] = edges.map((edge) => {
    const edgeType = edge.type || "normal"
    const sourceNode = layers.find(l => l.id === edge.source)
    const targetNode = layers.find(l => l.id === edge.target)
    
    return {
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: true,
      type: edgeType,
      data: {
        sourceType: sourceNode?.type,
        targetType: targetNode?.type,
      },
    }
  })

  return { nodes: flowNodes, edges: flowEdges }
}

/**
 * 获取层类型到自定义节点类型的映射
 * 这将用于 React Flow 的节点类型注册
 */
export function getNodeTypeMap(): Record<string, string> {
  return {
    // 基础层
    input: "inputNode",
    output: "outputNode",
    flatten: "flattenNode",
    dense: "denseNode",
    
    // 卷积层
    conv2d: "convNode",         // 2D 卷积
    conv3d: "convNode",         // 3D 卷积 (暂时复用 convNode)
    depthwise_conv: "convNode", // 深度可分离卷积
    transpose_conv2d: "convNode", // 转置卷积
    transpose_conv3d: "convNode", // 3D 转置卷积
    
    // 池化层 
    maxpool2d: "poolingNode",         // 2D 最大池化
    maxpool3d: "poolingNode",         // 3D 最大池化
    avgpool2d: "poolingNode",         // 2D 平均池化
    avgpool3d: "poolingNode",         // 3D 平均池化
    global_avgpool: "poolingNode",    // 全局平均池化
    global_maxpool: "poolingNode",    // 全局最大池化
    adaptive_avgpool: "poolingNode",  // 自适应平均池化
    adaptive_maxpool: "poolingNode",  // 自适应最大池化
    
    // 归一化层
    batchnorm: "batchnormNode",       // 批归一化
    batchnorm2d: "batchnormNode",     // 2D 批归一化
    batchnorm3d: "batchnormNode",     // 3D 批归一化
    layernorm: "batchnormNode",       // 层归一化 (暂时复用)
    instancenorm: "batchnormNode",    // 实例归一化
    groupnorm: "batchnormNode",       // 组归一化
    
    // 正则化层
    dropout: "dropoutNode",           // Dropout
    dropout2d: "dropoutNode",         // 2D Dropout
    dropout3d: "dropoutNode",         // 3D Dropout
    alpha_dropout: "dropoutNode",     // Alpha Dropout
    
    // 特殊模块
    attention: "stemNode",        // 注意力机制 (暂时复用 stemNode)
    transformer: "stemNode",      // Transformer 块 (暂时复用 stemNode)
    stem: "stemNode",             // 主干网络层
    
    // 连接层
    add: "addNode",                   // 加法层
    concat: "concatNode",             // 拼接层
    multiply: "addNode",              // 乘法层 (暂时复用)
    
    // 循环层 (暂时复用 denseNode)
    lstm: "denseNode",                // LSTM
    gru: "denseNode",                 // GRU
    rnn: "denseNode",                 // RNN
  }
}

/**
 * 格式化形状数组为字符串
 * @param shape 形状数组
 * @returns 格式化后的字符串,如 "28×28×6"
 */
export function formatShape(shape: number[]): string {
  return shape.join("×")
}

// ============================================================================
// 颜色配置系统 - 统一管理所有层类型和主题颜色
// ============================================================================

/**
 * 层颜色配置接口 - 所有颜色从这里派生
 */
interface LayerColorConfig {
  color: string      // 主色调名称 (如 "blue", "purple", "emerald")
  colorEnd?: string  // 渐变结束颜色 
  shade: number        // 主色深度
  shadeEnd?: number  // 渐变结束深度
}

/**
 * 层颜色主题接口 - 从基础配置派生的完整主题
 */
export interface LayerColorTheme {
  color: string              // 主色调名称 (如 "blue", "purple", "emerald")
  head: string           // 渐变色 (from-* to-*)
  text: string              // 文本色 (text-*)
  textHighlight: string     // 高亮文本色
  border: string            // 边框色 (border-*)
  background: string        // 纯背景色 (bg-*)
  backgroundHover: string   // 悬停背景
  handle: string           // 连接点颜色
  borderSelected: string   // 选中状态边框样式
  borderUnselected: string // 未选中状态边框样式
}

/**
 * 层颜色主题配置 - 单一数据源
 * 所有层的颜色定义都在这里，其他函数从这里派生
 */
const LAYER_COLOR_CONFIGS: Record<string, LayerColorConfig> = {
  // 基础层
  input: { color: "blue", shade: 500},
  output: { color: "red", shade: 500 },
  flatten: { color: "orange", shade: 500 },
  dense: { color: "pink", shade: 500 },
  
  // 卷积层
  conv2d: { color: "purple", shade: 500 },
  conv3d: { color: "purple", shade: 500 },
  depthwise_conv: { color: "purple", shade: 500 },
  transpose_conv2d: { color: "purple", shade: 500 },
  transpose_conv3d: { color: "purple", shade: 500 },
  
  // 池化层
  maxpool2d: { color: "cyan", shade: 500 },
  avgpool2d: { color: "cyan", shade: 500 },
  maxpool3d: { color: "cyan", shade: 500 },
  avgpool3d: { color: "cyan", shade: 500 },
  global_avgpool: { color: "cyan", shade: 300 },
  global_maxpool: { color: "cyan", shade: 500 },
  adaptive_avgpool: { color: "cyan", shade: 500 },
  adaptive_maxpool: { color: "cyan", shade: 500 },
  
  // 归一化层
  batchnorm: { color: "indigo", shade: 500 },
  batchnorm2d: { color: "indigo", shade: 500 },
  batchnorm3d: { color: "indigo", shade: 500 },
  layernorm: { color: "indigo", shade: 500 },
  instancenorm: { color: "indigo", shade: 500 },
  groupnorm: { color: "indigo", shade: 500 },
  // 正则化层
  dropout: { color: "yellow", shade: 500 },
  dropout2d: { color: "yellow", shade: 500 },
  dropout3d: { color: "yellow", shade: 500 },
  
  // 特殊模块
  inception: { color: "violet", shade: 500 },
  attention: { color: "rose", shade: 500 },
  transformer: { color: "fuchsia", shade: 500 },
  stem: { color: "amber", shade: 500 },
  
  // 连接层
  add: { color: "emerald", shade: 500 },
  concat: { color: "violet", shade: 500 },
  multiply: { color: "emerald", shade: 300 },
  
  // 循环层
  lstm: { color: "sky", shade: 500 },
  gru: { color: "sky", shade: 500 },
  rnn: { color: "sky", shade: 500 },
}


/**
 * 从颜色配置生成完整的主题对象
 */
function generateColorTheme(config: LayerColorConfig): LayerColorTheme {
  // Tailwind 色阶: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900
  // 不存在 550 这样的中间值，所以 shadeEnd 必须是有效的色阶
  const { color, colorEnd, shade, shadeEnd } = config
  const endShade = shadeEnd || (shade < 500 ? 500 : 600) // 如果未指定，自动选择下一个有效色阶
  
  return {
    color: color,
    head: `from-${color}-${shade} to-${colorEnd || color}-${endShade}`,
    text: `text-${color}-600`,
    textHighlight: `text-${color}-${shade}`,  // 高亮文本：使用主色调
    border: `border-${color}-${shade}`,
    background: `bg-${color}-${shade}/10`,                     // 背景色：10% 不透明度，适合图标容器
    backgroundHover: `bg-${color}-${shade}/5`,                 // 悬停背景：5% 不透明度
    handle: `!bg-${color}-${shade}`,                           // Handle 连接点：完全不透明
    borderSelected: `border-${color}-${shade} shadow-xl shadow-${color}-${shade}/20 scale-105`,
    borderUnselected: `border-border hover:border-${colorEnd || color}-${endShade} hover:shadow-xl`,
  }
}

/**
 * 获取层的颜色主题配置（基于层类型）
 * @param type 层类型（如 "conv2d", "pooling"）
 * @returns 完整的主题配置对象
 */
export function getColorTheme(type: string): LayerColorTheme {
  const config = LAYER_COLOR_CONFIGS[type]
  if (config) {
    return generateColorTheme(config)
  }
  
  // 默认灰色主题
  return generateColorTheme({ color: "gray", shade: 500 })
}

/**
 * 获取层的颜色主题配置（基于 Layer 对象）
 * 支持 StemLayer 的自定义颜色配置
 * @param layer Layer 对象
 * @returns 完整的主题配置对象
 */
export function getLayerColorTheme(layer: Layer): LayerColorTheme {
  // 特殊处理 stem 层的自定义颜色
  if (layer.type === "stem" && "color" in layer && layer.color) {
    const customColor = layer.color as string
    
    // 为自定义颜色动态生成配置
    const customConfig: LayerColorConfig = {
      color: customColor,
      shade: 500,
      shadeEnd: 600,
    }
    
    // emerald 特殊处理：渐变到 teal（绿到青）
    if (customColor === "emerald") {
      customConfig.colorEnd = "teal"
    }
    
    return generateColorTheme(customConfig)
  }
  
  // 其他层使用标准的类型配置
  return getColorTheme(layer.type)
}
