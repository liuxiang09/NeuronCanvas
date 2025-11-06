import { create } from "zustand";

/**
 * 节点类型定义 - 代表画布上的一个神经网络组件
 */
export interface Node {
  id: string;
  type: "input" | "conv2d" | "dense" | "activation" | "pooling" | "dropout" | "output";
  label: string;
  position: { x: number; y: number };
  properties: Record<string, any>; // 每个节点的自定义属性（如卷积核大小、步长等）
  outputShape?: number[]; // 该层输出的张量形状
}

/**
 * 边类型定义 - 代表节点之间的连接
 */
export interface Edge {
  id: string;
  source: string; // 源节点 ID
  target: string; // 目标节点 ID
}

/**
 * Sandbox Store 的状态和方法定义
 */
interface SandboxStore {
  // 状态
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Actions - 节点操作
  addNode: (node: Omit<Node, "id">) => void;
  removeNode: (nodeId: string) => void;
  updateNode: (nodeId: string, updates: Partial<Node>) => void;
  updateNodePosition: (nodeId: string, position: { x: number; y: number }) => void;
  
  // Actions - 边操作
  addEdge: (edge: Omit<Edge, "id">) => void;
  removeEdge: (edgeId: string) => void;

  // Actions - 选择操作
  selectNode: (nodeId: string | null) => void;

  // Actions - 重置
  clearCanvas: () => void;
}

/**
 * 沙盒状态管理 Store
 * 
 * 使用 Zustand 管理沙盒的全局状态
 * 包括画布上的所有节点、边以及选中状态
 */
export const useSandboxStore = create<SandboxStore>((set) => ({
  // 初始状态
  nodes: [],
  edges: [],
  selectedNodeId: null,

  // 添加节点
  addNode: (nodeData) =>
    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          ...nodeData,
          id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ],
    })),

  // 删除节点（同时删除相关的边）
  removeNode: (nodeId) =>
    set((state) => ({
      nodes: state.nodes.filter((node) => node.id !== nodeId),
      edges: state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
      selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
    })),

  // 更新节点
  updateNode: (nodeId, updates) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...updates } : node
      ),
    })),

  // 更新节点位置
  updateNodePosition: (nodeId, position) =>
    set((state) => ({
      nodes: state.nodes.map((node) =>
        node.id === nodeId ? { ...node, position } : node
      ),
    })),

  // 添加边
  addEdge: (edgeData) =>
    set((state) => ({
      edges: [
        ...state.edges,
        {
          ...edgeData,
          id: `edge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        },
      ],
    })),

  // 删除边
  removeEdge: (edgeId) =>
    set((state) => ({
      edges: state.edges.filter((edge) => edge.id !== edgeId),
    })),

  // 选择节点
  selectNode: (nodeId) =>
    set(() => ({
      selectedNodeId: nodeId,
    })),

  // 清空画布
  clearCanvas: () =>
    set(() => ({
      nodes: [],
      edges: [],
      selectedNodeId: null,
    })),
}));
