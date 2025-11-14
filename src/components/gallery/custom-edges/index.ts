/**
 * 自定义边导出
 * 
 * 添加新边类型时:
 * 1. 创建新的边组件文件 (如 CustomEdge.tsx)
 * 2. 在此文件中添加导出语句
 * 3. 在 edgeComponents 对象中添加映射关系
 */

export { default as NormalEdge } from "./NormalEdge"

// 边组件映射 - 用于自动注册到 React Flow
import NormalEdge from "./NormalEdge"
import type { EdgeTypes } from "reactflow"

/**
 * 所有自定义边的映射
 * 新增边时,只需在此添加映射即可
 * 
 * key: 边类型名 (对应 JSON 中 edge.type 的值)
 * value: 边组件
 */
export const edgeComponents: EdgeTypes = {
  normal: NormalEdge,
}
