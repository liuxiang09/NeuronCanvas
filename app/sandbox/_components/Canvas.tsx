"use client";

import { useSandboxStore } from "@/store/sandboxStore";
import { MouseEvent, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Canvas - 中间的画布区域
 * 
 * 设计理念：
 * - 用户可以在这里拖放和排列组件
 * - 显示节点之间的连接线（边）
 * - 点击节点可以选中并在右侧查看/编辑属性
 * - 支持拖拽移动节点位置
 * 
 * TODO: 
 * - 实现节点的拖拽移动
 * - 实现连线的绘制和交互
 * - 添加缩放和平移功能
 * - 可以考虑集成 React Flow 或 Reaflow 等现成的图编辑库
 */
export function Canvas() {
  const { nodes, edges, selectedNodeId, selectNode, removeNode, updateNodePosition } = useSandboxStore();
  const canvasRef = useRef<HTMLDivElement>(null);
  const draggedNodeId = useRef<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  const handleNodeMouseDown = (e: MouseEvent, nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return;

    draggedNodeId.current = nodeId;
    selectNode(nodeId);

    // 计算鼠标相对于节点的偏移
    const target = e.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.stopPropagation();
  };

  const handleCanvasMouseMove = (e: MouseEvent) => {
    if (!draggedNodeId.current || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.current.x;
    const newY = e.clientY - rect.top - dragOffset.current.y;

    updateNodePosition(draggedNodeId.current, { x: newX, y: newY });
  };

  const handleCanvasMouseUp = () => {
    draggedNodeId.current = null;
  };

  const handleCanvasClick = () => {
    selectNode(null); // 点击空白区域取消选择
  };

  const handleDeleteNode = (nodeId: string, e: MouseEvent) => {
    e.stopPropagation();
    removeNode(nodeId);
  };

  return (
    <div
      ref={canvasRef}
      className="relative h-full bg-background grid-background overflow-hidden"
      onMouseMove={handleCanvasMouseMove}
      onMouseUp={handleCanvasMouseUp}
      onMouseLeave={handleCanvasMouseUp}
      onClick={handleCanvasClick}
    >
      {/* 如果画布为空，显示提示信息 */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-muted-foreground">
              画布为空
            </p>
            <p className="text-sm text-muted-foreground">
              从左侧拖拽组件到这里开始构建模型
            </p>
          </div>
        </div>
      )}

      {/* 渲染所有节点 */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className={`absolute cursor-move select-none ${
            selectedNodeId === node.id
              ? "ring-2 ring-primary"
              : "hover:ring-2 hover:ring-primary/50"
          }`}
          style={{
            left: node.position.x,
            top: node.position.y,
            transform: "translate(-50%, -50%)",
          }}
          onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
          onClick={(e) => {
            e.stopPropagation();
            selectNode(node.id);
          }}
        >
          <div className="min-w-[150px] rounded-lg border-2 bg-card p-3 shadow-md">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-sm">{node.label}</span>
              <button
                onClick={(e) => handleDeleteNode(node.id, e)}
                className="text-muted-foreground hover:text-destructive transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-muted-foreground">
              {node.outputShape && `Shape: [${node.outputShape.join(", ")}]`}
            </div>
          </div>
        </div>
      ))}

      {/* TODO: 渲染边（连接线） */}
      {/* 这里可以使用 SVG 来绘制节点之间的连接线 */}
      <svg className="absolute inset-0 pointer-events-none">
        {edges.map((edge) => {
          const sourceNode = nodes.find((n) => n.id === edge.source);
          const targetNode = nodes.find((n) => n.id === edge.target);
          if (!sourceNode || !targetNode) return null;

          return (
            <line
              key={edge.id}
              x1={sourceNode.position.x}
              y1={sourceNode.position.y}
              x2={targetNode.position.x}
              y2={targetNode.position.y}
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
        {/* 箭头标记定义 */}
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="hsl(var(--primary))" />
          </marker>
        </defs>
      </svg>

      {/* 画布工具栏（右下角） */}
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => useSandboxStore.getState().clearCanvas()}
        >
          清空画布
        </Button>
      </div>
    </div>
  );
}
