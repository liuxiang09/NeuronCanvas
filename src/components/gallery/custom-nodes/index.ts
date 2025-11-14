/**
 * 自定义节点导出
 * 统一导出所有自定义节点组件
 * 
 * 添加新节点时:
 * 1. 创建新的节点组件文件 (如 BatchNormNode.tsx)
 * 2. 在此文件中添加导出语句
 * 3. 在 nodeComponents 对象中添加映射关系
 * 
 * 注意: nodeComponents 的 key 应该对应 layout.ts 中 getNodeTypeMap() 返回的值
 */

export { InputNode } from "./InputNode"
export { ConvNode } from "./ConvNode"
export { PoolingNode } from "./PoolingNode"
export { LinearNode } from "./LinearNode"
export { EmbeddingNode } from "./EmbeddingNode"
export { DropoutNode } from "./DropoutNode"
export { NormNode } from "./NormNode"
export { ActivationNode } from "./ActivationNode"
export { SequentialNode } from "./SequentialNode"
export { ParallelNode } from "./ParallelNode"
export { CalculateNode } from "./CalculateNode"
export { AttentionNode } from "./AttentionNode"

// 节点组件映射 - 用于自动注册到 React Flow
// key: React Flow 节点类型名 (对应 layout.getNodeTypeMap 的输出)
// value: 节点组件
import { InputNode } from "./InputNode"
import { ConvNode } from "./ConvNode"
import { PoolingNode } from "./PoolingNode"
import { LinearNode } from "./LinearNode"
import { EmbeddingNode } from "./EmbeddingNode"
import { DropoutNode } from "./DropoutNode"
import { NormNode } from "./NormNode"
import { ActivationNode } from "./ActivationNode"
import { SequentialNode } from "./SequentialNode"
import { ParallelNode } from "./ParallelNode"
import { CalculateNode } from "./CalculateNode"
import { AttentionNode } from "./AttentionNode"
import type { NodeTypes } from "reactflow"

/**
 * 所有自定义节点的映射
 * 新增节点时,只需在此添加映射即可
 */
export const nodeComponents: NodeTypes = {
  inputNode: InputNode,
  convNode: ConvNode,
  poolingNode: PoolingNode,
  linearNode: LinearNode,
  embeddingNode: EmbeddingNode,
  dropoutNode: DropoutNode,
  normNode: NormNode,
  activationNode: ActivationNode,
  sequentialNode: SequentialNode,
  parallelNode: ParallelNode,
  calculateNode: CalculateNode,
  attentionNode: AttentionNode,
}

