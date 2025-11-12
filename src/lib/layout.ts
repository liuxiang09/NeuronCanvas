"use client"

import dagre from "dagre"
import type { Node, Edge } from "reactflow"
import type { Layer, Edge as ModelEdge, LayoutConfig } from "@/lib/types"

/**
 * 基于 Dagre 的画布布局计算
 */
export function calculateLayout(
  layers: Layer[],
  edges: ModelEdge[],
  config?: Partial<LayoutConfig>
): { nodes: Node[]; edges: Edge[] } {
  const layoutConfig: LayoutConfig = {
    direction: "LR",
    nodeWidth: 240,
    nodeHeight: 120,
    rankSep: 100,
    nodeSep: 150,
    ...config,
  }

  const graph = new dagre.graphlib.Graph()

  graph.setGraph({
    rankdir: layoutConfig.direction,
    nodesep: layoutConfig.nodeSep,
    ranksep: layoutConfig.rankSep,
    marginx: 120,
    marginy: 120,
  })

  graph.setDefaultEdgeLabel(() => ({}))

  const nodeSizeCache: Record<string, { width: number; height: number }> = {}

  layers.forEach((layer) => {
    const { width, height } = getNodeSize(layer, layoutConfig)
    nodeSizeCache[layer.id] = { width, height }

    graph.setNode(layer.id, {
      width,
      height,
      label: layer.name,
    })
  })

  edges.forEach((edge) => {
    graph.setEdge(edge.source, edge.target)
  })

  dagre.layout(graph)

  const nodeTypeMap = getNodeTypeMap()

  const flowNodes: Node[] = layers.map((layer) => {
    const node = graph.node(layer.id)

    const { width: nodeWidth, height: nodeHeight } = nodeSizeCache[layer.id]

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

  const flowEdges: Edge[] = edges.map((edge) => {
    const edgeType = edge.type || "normal"
    const sourceNode = layers.find((l) => l.id === edge.source)
    const targetNode = layers.find((l) => l.id === edge.target)

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
 * 层类型到自定义节点类型的映射
 */
export function getNodeTypeMap(): Record<string, string> {
  return {
    input: "inputNode",
    linear: "linearNode",
    conv2d: "convNode",
    maxpool2d: "poolingNode",
    avgpool2d: "poolingNode",
    adaptiveavgpool2d: "poolingNode",
    relu: "activationNode",
    sigmoid: "activationNode",
    tanh: "activationNode",
    softmax: "activationNode",
    batchnorm: "normNode",
    layernorm: "normNode",
    lrn: "normNode",
    dropout: "dropoutNode",
    add: "calculateNode",
    concat: "calculateNode",
    flatten: "calculateNode",
    sequential: "sequentialNode",
    parallel: "parallelNode",
  }
}

/*启发式算法，动态获取节点大小*/
function getNodeSize(layer: Layer, layoutConfig: LayoutConfig): { width: number; height: number } {
  let width = layoutConfig.nodeWidth ?? 240
  let height = layoutConfig.nodeHeight ?? 120

  switch (layer.type) {
    case "sequential": {
      const steps = Array.isArray((layer as any).steps) ? (layer as any).steps.length : 0
      width = Math.max(320, width)
      height = Math.max(200, 160 + steps * 30)
      break
    }
    case "parallel": {
      const branches = Array.isArray((layer as any).branches) ? (layer as any).branches : []
      const branchCount = branches.length
      const totalSteps = branches.reduce(
        (acc: number, branch: any) => acc + (Array.isArray(branch.steps) ? branch.steps.length : 0),
        0
      )
      width = Math.max(320, width + branchCount * 50)
      height = Math.max(240, 180 + branchCount * 60 + totalSteps * 18)
      break
    }
    case "add":
    case "concat":
    case "flatten": {
      width = Math.max(240, width)
      height = Math.max(140, height)
      break
    }
    default:
      break
  }

  return { width, height }
}

