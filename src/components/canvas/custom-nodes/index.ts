/**
 * 自定义节点导出
 * 统一导出所有自定义节点组件
 * 
 * 添加新节点时:
 * 1. 创建新的节点组件文件 (如 BatchNormNode.tsx)
 * 2. 在此文件中添加导出语句
 * 3. 在 nodeComponents 对象中添加映射关系
 * 
 * 注意: nodeComponents 的 key 应该对应 utils.ts 中 getNodeTypeMap() 返回的值
 */

export { InputNode } from "./InputNode"
export { ConvNode } from "./ConvNode"
export { PoolingNode } from "./PoolingNode"
export { FlattenNode } from "./FlattenNode"
export { DenseNode } from "./DenseNode"
export { OutputNode } from "./OutputNode"
export { DropoutNode } from "./DropoutNode"
export { BatchNormNode } from "./BatchNormNode"
export { AddNode } from "./AddNode"
export { ConcatNode } from "./ConcatNode"
export { StemNode } from "./StemNode"

// 节点组件映射 - 用于自动注册到 React Flow
// key: React Flow 节点类型名 (对应 getNodeTypeMap 的输出)
// value: 节点组件
import { InputNode } from "./InputNode"
import { ConvNode } from "./ConvNode"
import { PoolingNode } from "./PoolingNode"
import { FlattenNode } from "./FlattenNode"
import { DenseNode } from "./DenseNode"
import { OutputNode } from "./OutputNode"
import { DropoutNode } from "./DropoutNode"
import { BatchNormNode } from "./BatchNormNode"
import { AddNode } from "./AddNode"
import { ConcatNode } from "./ConcatNode"
import { StemNode } from "./StemNode"
import type { NodeTypes } from "reactflow"

/**
 * 所有自定义节点的映射
 * 新增节点时,只需在此添加映射即可
 */
export const nodeComponents: NodeTypes = {
  inputNode: InputNode,
  convNode: ConvNode,
  poolingNode: PoolingNode,
  flattenNode: FlattenNode,
  denseNode: DenseNode,
  outputNode: OutputNode,
  dropoutNode: DropoutNode,
  batchnormNode: BatchNormNode,
  addNode: AddNode,
  concatNode: ConcatNode,
  stemNode: StemNode,
}

/**
 * MiniMap 节点颜色映射
 * 新增节点时,可以在此添加对应的颜色
 */
export const nodeColorMap: Record<string, string> = {
  inputNode: "#3b82f6",      // blue-500
  convNode: "#a855f7",       // purple-500
  poolingNode: "#06b6d4",    // cyan-500
  flattenNode: "#f97316",    // orange-500
  denseNode: "#ec4899",      // pink-500
  dropoutNode: "#eab308",    // yellow-500
  batchnormNode: "#6366f1",  // indigo-500
  addNode: "#34d399",        // emerald-400
  concatNode: "#8b5cf6",     // violet-500
  stemNode: "#f59e0b",       // amber-500 (默认颜色，实际可自定义)
  outputNode: "#ef4444",     // red-500
}
