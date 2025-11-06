"use client";

import { useSandboxStore } from "@/store/sandboxStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * PropertiesInspector - 右侧属性面板
 * 
 * 设计理念：
 * - 当用户点击画布上的节点时，这里会显示该节点的所有属性
 * - 用户可以修改属性值（如卷积核大小、步长等）
 * - 实时更新节点状态
 */
export function PropertiesInspector() {
  const { nodes, selectedNodeId, updateNode } = useSandboxStore();

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);

  if (!selectedNode) {
    return (
      <div className="h-full border-l bg-muted/30 p-4">
        <div className="flex h-full items-center justify-center">
          <p className="text-sm text-muted-foreground text-center">
            点击画布上的节点<br />查看和编辑属性
          </p>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (key: string, value: any) => {
    updateNode(selectedNode.id, {
      properties: {
        ...selectedNode.properties,
        [key]: value,
      },
    });
  };

  return (
    <div className="h-full border-l bg-muted/30 p-4 overflow-y-auto">
      <div className="space-y-6">
        {/* 节点基本信息 */}
        <div>
          <h3 className="font-semibold text-sm mb-3">节点信息</h3>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">类型</Label>
              <p className="mt-1 text-sm font-medium">{selectedNode.label}</p>
            </div>
            <div>
              <Label className="text-xs">ID</Label>
              <p className="mt-1 text-xs text-muted-foreground font-mono">
                {selectedNode.id}
              </p>
            </div>
          </div>
        </div>

        {/* 节点属性编辑器 */}
        <div>
          <h3 className="font-semibold text-sm mb-3">属性</h3>
          <div className="space-y-4">
            {Object.entries(selectedNode.properties).map(([key, value]) => (
              <div key={key}>
                <Label htmlFor={`prop-${key}`} className="text-xs capitalize">
                  {key}
                </Label>
                <Input
                  id={`prop-${key}`}
                  type={typeof value === "number" ? "number" : "text"}
                  value={value}
                  onChange={(e) => {
                    const newValue =
                      typeof value === "number"
                        ? parseFloat(e.target.value)
                        : e.target.value;
                    handlePropertyChange(key, newValue);
                  }}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </div>

        {/* 输出形状（如果有） */}
        {selectedNode.outputShape && (
          <div>
            <h3 className="font-semibold text-sm mb-3">输出形状</h3>
            <div className="rounded-lg border bg-card p-3">
              <code className="text-sm font-mono">
                [{selectedNode.outputShape.join(", ")}]
              </code>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="pt-4 border-t">
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={() => {
              useSandboxStore.getState().removeNode(selectedNode.id);
            }}
          >
            删除节点
          </Button>
        </div>

        {/* 说明文档（可选） */}
        <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 p-3">
          <p className="text-xs text-blue-900 dark:text-blue-300">
            <strong>提示：</strong> 修改属性后，张量形状会自动重新计算（功能开发中）
          </p>
        </div>
      </div>
    </div>
  );
}
