/**
 * PropertyPanel - 属性编辑面板
 * 
 * 功能说明：
 * - 右侧固定侧边栏，用于编辑选中节点的属性
 * - 显示节点的基本信息（名称、类型、描述）
 * - 提供LayerBase参数的编辑（outputShape）
 * - 根据节点类型动态生成参数编辑表单
 * - 支持实时更新节点参数，修改立即生效
 * - 排除基本信息中已显示的字段（name、description），避免重复
 */

"use client"

import { useCallback, useMemo, useState, useRef } from "react"
import { X, Plus, Trash2, Edit2, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getLayerIcon, getFieldLabel, getNodeTypeName, getLayerParams } from "@/lib/utils"
import { getLayerColorTheme } from "@/lib/theme"
import { useSandboxStore } from "@/lib/sandboxStore"
import { createNodeByType, getAvailableNodeTypes } from "@/lib/nodeFactory"
import type { Layer, LayerType, SequentialLayer, ParallelLayer, ParallelBranch } from "@/lib/types"

/**
 * 提取可编辑字段
 * - sequential和parallel节点不显示参数详情（由内部节点决定）
 * - 其他节点基于规则判断显示哪些字段
 */
function extractEditableFields(layer: Layer): string[] {
  // sequential和parallel节点的参数由内部节点决定，不显示参数详情
  if (layer.type === "sequential" || layer.type === "parallel") {
    return []
  }
  
  const fields: string[] = []
  const excludeFields = ['id', 'name', 'type', 'description', 'steps', 'branches', 'color']
  
  // 已知的数组字段，即使为空也要显示
  const knownArrayFields = ['outputShape', 'kernelSize', 'stride', 'padding', 'poolSize']
  
  for (const key in layer) {
    if (excludeFields.includes(key)) continue
    const value = (layer as any)[key]
    
    // null/undefined 不显示
    if (value === null || value === undefined) continue
    
    // 数组字段（包括空数组）都要显示
    if (Array.isArray(value) || knownArrayFields.includes(key)) {
      fields.push(key)
      continue
    }
    
    // 数字0不显示（但数组中的0要显示）
    if (typeof value === 'number' && value === 0) continue
    
    fields.push(key)
  }
  
  // 将outputShape放在最后
  const outputShapeIndex = fields.indexOf('outputShape')
  if (outputShapeIndex !== -1) {
    fields.splice(outputShapeIndex, 1)
    fields.push('outputShape')
  }
  
  return fields
}

interface PropertyPanelProps {
  className?: string
}

/**
 * PropertyPanel - 属性编辑面板
 * 右侧固定侧边栏，选中节点后显示详细参数编辑表单，支持实时更新
 */
export function PropertyPanel({ className = "" }: PropertyPanelProps) {
  const selectedNodeIds = useSandboxStore((state) => state.selectedNodeIds)
  const layers = useSandboxStore((state) => state.layers)
  const updateLayer = useSandboxStore((state) => state.updateLayer)
  const removeLayer = useSandboxStore((state) => state.removeLayer)
  const clearSelection = useSandboxStore((state) => state.clearSelection)
  const showConfirmDialog = useSandboxStore((state) => state.showConfirmDialog)

  // 获取选中的节点（只支持单选编辑）
  const selectedNode = useMemo(() => {
    if (selectedNodeIds.length !== 1) return null
    return layers.find((layer) => layer.id === selectedNodeIds[0]) || null
  }, [selectedNodeIds, layers])

  const theme = selectedNode ? getLayerColorTheme(selectedNode) : null
  const Icon = selectedNode ? getLayerIcon(selectedNode) : null

  // 更新节点属性（用于onBlur，失去焦点时更新）
  const handleFieldChange = useCallback(
    (field: string, value: any) => {
      if (!selectedNode) return

      // 如果值为空字符串，不更新（保持原值）
      if (value === "" || value === null || value === undefined) {
        return
      }

      // 类型转换
      let convertedValue: any = value
      if (field === "filters" || field === "dimension" || field === "numHeads" || field === "headDim" || field === "modelDim") {
        convertedValue = Number(value)
        if (isNaN(convertedValue)) return // 无效数字不更新
      } else if (field === "rate" || field === "dropout") {
        convertedValue = Number(value)
        if (isNaN(convertedValue)) return // 无效数字不更新
        if (convertedValue > 1) convertedValue = convertedValue / 100
      }

      updateLayer(selectedNode.id, { [field]: convertedValue })
    },
    [selectedNode, updateLayer]
  )

  // 临时存储输入值（用于onChange，不立即更新）
  // 对于数组字段，使用 "field_index" 作为 key
  // 对于普通字段，直接使用 field 作为 key
  const [tempValues, setTempValues] = useState<Record<string, string>>({})
  
  const handleFieldInputChange = useCallback(
    (field: string, value: string) => {
      // 更新临时值，允许空值
      setTempValues(prev => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleFieldBlur = useCallback(
    (field: string) => {
      if (!selectedNode) return
      
      const tempValue = tempValues[field]
      // 清除临时值
      setTempValues(prev => {
        const newValues = { ...prev }
        delete newValues[field]
        return newValues
      })
      
      // 如果临时值存在且不为空，使用临时值更新
      if (tempValue !== undefined && tempValue !== "") {
        handleFieldChange(field, tempValue)
      } else if (tempValue === "") {
        // 如果临时值为空字符串，对于数字字段设置为0
        const numericFields = ["filters", "dimension", "numHeads", "headDim", "modelDim", "rate", "dropout"]
        if (numericFields.includes(field)) {
          // 对于rate和dropout，0就是0
          // 对于其他数字字段，也是0
          updateLayer(selectedNode.id, { [field]: 0 })
        }
      }
    },
    [tempValues, handleFieldChange, selectedNode, updateLayer]
  )

  // 数组字段输入变化（只更新临时状态，允许空值）
  const handleArrayFieldInputChange = useCallback(
    (field: string, index: number, value: string) => {
      const key = `${field}_${index}`
      setTempValues(prev => ({ ...prev, [key]: value }))
    },
    []
  )

  // 数组字段失去焦点时验证并更新
  const handleArrayFieldBlur = useCallback(
    (field: string, index: number) => {
      if (!selectedNode) return
      const key = `${field}_${index}`
      const tempValue = tempValues[key]
      
      // 清除临时值
      setTempValues(prev => {
        const newValues = { ...prev }
        delete newValues[key]
        return newValues
      })
      
      // 如果临时值存在，验证并更新
      if (tempValue !== undefined) {
        const currentValue = (selectedNode as any)[field] as number[] | undefined
        const newArray = [...(currentValue || [])]
        
        if (tempValue === "" || tempValue === null || tempValue === undefined) {
          // 空值设为 0
          newArray[index] = 0
        } else {
          const numValue = Number(tempValue)
          // 如果是有效数字，更新；否则设为 0
          newArray[index] = isNaN(numValue) ? 0 : numValue
        }
        
        updateLayer(selectedNode.id, { [field]: newArray })
      }
    },
    [selectedNode, tempValues, updateLayer]
  )

  // 添加数组元素
  const handleAddArrayElement = useCallback(
    (field: string) => {
      if (!selectedNode) return
      const currentValue = (selectedNode as any)[field] as number[] | undefined
      const newArray = [...(currentValue || []), 0]
      updateLayer(selectedNode.id, { [field]: newArray })
    },
    [selectedNode, updateLayer]
  )

  // 删除数组元素
  const handleRemoveArrayElement = useCallback(
    (field: string, index: number) => {
      if (!selectedNode) return
      const currentValue = (selectedNode as any)[field] as number[] | undefined
      const newArray = [...(currentValue || [])]
      newArray.splice(index, 1)
      updateLayer(selectedNode.id, { [field]: newArray })
    },
    [selectedNode, updateLayer]
  )

  // Sequential节点：添加子节点
  const handleAddSequentialStep = useCallback(
    (nodeType: LayerType) => {
      if (!selectedNode || selectedNode.type !== "sequential") return
      const newStep = createNodeByType(nodeType)
      const currentSteps = (selectedNode as SequentialLayer).steps || []
      updateLayer(selectedNode.id, {
        steps: [...currentSteps, newStep],
      } as Partial<SequentialLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Sequential节点：删除子节点
  const handleRemoveSequentialStep = useCallback(
    (stepIndex: number) => {
      if (!selectedNode || selectedNode.type !== "sequential") return
      const currentSteps = (selectedNode as SequentialLayer).steps || []
      const newSteps = [...currentSteps]
      newSteps.splice(stepIndex, 1)
      updateLayer(selectedNode.id, {
        steps: newSteps,
      } as Partial<SequentialLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Parallel节点：添加分支
  const handleAddParallelBranch = useCallback(() => {
    if (!selectedNode || selectedNode.type !== "parallel") return
    const currentBranches = (selectedNode as ParallelLayer).branches || []
    const newBranch: ParallelBranch = {
      id: `branch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      name: `分支 ${currentBranches.length + 1}`,
      steps: [],
    }
    updateLayer(selectedNode.id, {
      branches: [...currentBranches, newBranch],
    } as Partial<ParallelLayer>)
  }, [selectedNode, updateLayer])

  // Parallel节点：删除分支
  const handleRemoveParallelBranch = useCallback(
    (branchIndex: number) => {
      if (!selectedNode || selectedNode.type !== "parallel") return
      const currentBranches = (selectedNode as ParallelLayer).branches || []
      const newBranches = [...currentBranches]
      newBranches.splice(branchIndex, 1)
      updateLayer(selectedNode.id, {
        branches: newBranches,
      } as Partial<ParallelLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Parallel节点：更新分支名称
  const handleUpdateBranchName = useCallback(
    (branchIndex: number, newName: string) => {
      if (!selectedNode || selectedNode.type !== "parallel") return
      const currentBranches = (selectedNode as ParallelLayer).branches || []
      const newBranches = [...currentBranches]
      newBranches[branchIndex] = {
        ...newBranches[branchIndex],
        name: newName,
      }
      updateLayer(selectedNode.id, {
        branches: newBranches,
      } as Partial<ParallelLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Parallel节点：添加分支子节点
  const handleAddBranchStep = useCallback(
    (branchIndex: number, nodeType: LayerType) => {
      if (!selectedNode || selectedNode.type !== "parallel") return
      const currentBranches = (selectedNode as ParallelLayer).branches || []
      const newBranches = [...currentBranches]
      const branch = newBranches[branchIndex]
      const newStep = createNodeByType(nodeType)
      branch.steps = [...(branch.steps || []), newStep]
      updateLayer(selectedNode.id, {
        branches: newBranches,
      } as Partial<ParallelLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Parallel节点：删除分支子节点
  const handleRemoveBranchStep = useCallback(
    (branchIndex: number, stepIndex: number) => {
      if (!selectedNode || selectedNode.type !== "parallel") return
      const currentBranches = (selectedNode as ParallelLayer).branches || []
      const newBranches = [...currentBranches]
      const branch = newBranches[branchIndex]
      const newSteps = [...(branch.steps || [])]
      newSteps.splice(stepIndex, 1)
      branch.steps = newSteps
      updateLayer(selectedNode.id, {
        branches: newBranches,
      } as Partial<ParallelLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Sequential节点：调整子节点顺序
  const handleReorderSequentialStep = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (!selectedNode || selectedNode.type !== "sequential") return
      const currentSteps = (selectedNode as SequentialLayer).steps || []
      const newSteps = [...currentSteps]
      const [removed] = newSteps.splice(fromIndex, 1)
      newSteps.splice(toIndex, 0, removed)
      updateLayer(selectedNode.id, {
        steps: newSteps,
      } as Partial<SequentialLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Parallel节点：调整分支内子节点顺序
  const handleReorderBranchStep = useCallback(
    (branchIndex: number, fromIndex: number, toIndex: number) => {
      if (!selectedNode || selectedNode.type !== "parallel") return
      const currentBranches = (selectedNode as ParallelLayer).branches || []
      const newBranches = [...currentBranches]
      const branch = newBranches[branchIndex]
      const newSteps = [...(branch.steps || [])]
      const [removed] = newSteps.splice(fromIndex, 1)
      newSteps.splice(toIndex, 0, removed)
      branch.steps = newSteps
      updateLayer(selectedNode.id, {
        branches: newBranches,
      } as Partial<ParallelLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Sequential节点：更新子节点
  const handleUpdateSequentialStep = useCallback(
    (stepIndex: number, updates: Partial<Layer>) => {
      if (!selectedNode || selectedNode.type !== "sequential") return
      const currentSteps = (selectedNode as SequentialLayer).steps || []
      const newSteps = [...currentSteps]
      newSteps[stepIndex] = { ...newSteps[stepIndex], ...updates } as Layer
      updateLayer(selectedNode.id, {
        steps: newSteps,
      } as Partial<SequentialLayer>)
    },
    [selectedNode, updateLayer]
  )

  // Parallel节点：更新分支子节点
  const handleUpdateBranchStep = useCallback(
    (branchIndex: number, stepIndex: number, updates: Partial<Layer>) => {
      if (!selectedNode || selectedNode.type !== "parallel") return
      const currentBranches = (selectedNode as ParallelLayer).branches || []
      const newBranches = [...currentBranches]
      const branch = newBranches[branchIndex]
      const newSteps = [...(branch.steps || [])]
      newSteps[stepIndex] = { ...newSteps[stepIndex], ...updates } as Layer
      branch.steps = newSteps
      updateLayer(selectedNode.id, {
        branches: newBranches,
      } as Partial<ParallelLayer>)
    },
    [selectedNode, updateLayer]
  )

  // 获取字段的编辑组件
  const renderFieldEditor = useCallback(
    (field: string) => {
      if (!selectedNode) return null

      const fieldValue = (selectedNode as any)[field]
      const fieldType = typeof fieldValue

      // 形状字段（outputShape）- 特殊处理
      if (field === "outputShape") {
        const shapeValue = fieldValue as number[] | undefined
        const shapeArray = shapeValue || []
        
        return (
          <div className="space-y-2">
            {shapeArray.map((item, index) => {
              const key = `${field}_${index}`
              const displayValue = tempValues[key] !== undefined ? tempValues[key] : (item ?? 0)
              return (
              <div key={index} className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs text-muted-foreground w-6 shrink-0 flex-shrink-0">[{index}]</span>
                <input
                  type="number"
                  value={displayValue}
                  onChange={(e) => handleArrayFieldInputChange(field, index, e.target.value)}
                  onBlur={() => handleArrayFieldBlur(field, index)}
                  step="1"
                  className="flex-1 min-w-0 px-2 py-2 border border-border rounded-md bg-background text-sm"
                  placeholder={`维度 ${index}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayElement(field, index)}
                  className="h-8 w-8 shrink-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="删除此维度"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              )
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddArrayElement(field)}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              添加维度
            </Button>
            {shapeArray.length === 0 && (
              <p className="text-xs text-muted-foreground">
                形状为空，点击"添加维度"开始编辑
              </p>
            )}
          </div>
        )
      }

      // 数组字段（包括已知的数组字段，即使为undefined也要显示）
      const knownArrayFields = ['kernelSize', 'stride', 'padding', 'poolSize']
      if (Array.isArray(fieldValue) || (knownArrayFields.includes(field) && fieldValue === undefined)) {
        const arrayValue = Array.isArray(fieldValue) ? fieldValue : []
        return (
          <div className="space-y-2">
            {arrayValue.map((item, index) => {
              const key = `${field}_${index}`
              const displayValue = tempValues[key] !== undefined ? tempValues[key] : (item ?? 0)
              return (
              <div key={index} className="flex items-center gap-1.5 min-w-0">
                <input
                  type="number"
                  value={displayValue}
                  onChange={(e) => handleArrayFieldInputChange(field, index, e.target.value)}
                  onBlur={() => handleArrayFieldBlur(field, index)}
                  step="1"
                  className="flex-1 min-w-0 px-2 py-2 border border-border rounded-md bg-background text-sm"
                  placeholder={`元素 ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveArrayElement(field, index)}
                  className="h-8 w-8 shrink-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                  title="删除此元素"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              )
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddArrayElement(field)}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              添加元素
            </Button>
            {arrayValue.length === 0 && (
              <p className="text-xs text-muted-foreground">
                数组为空，点击"添加元素"开始编辑
              </p>
            )}
          </div>
        )
      }

      // 布尔字段
      if (fieldType === "boolean") {
        return (
          <select
            value={fieldValue ? "true" : "false"}
            onChange={(e) =>
              handleFieldChange(field, e.target.value === "true")
            }
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            <option value="true">是</option>
            <option value="false">否</option>
          </select>
        )
      }

      // 数字字段
      if (fieldType === "number") {
        // 特殊处理rate和dropout（显示为百分比）
        if (field === "rate" || field === "dropout") {
          const percentValue = fieldValue * 100
          // 如果tempValues中有值，使用它；否则使用实际值
          const displayValue = tempValues[field] !== undefined ? tempValues[field] : percentValue
          return (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={displayValue}
                onChange={(e) => handleFieldInputChange(field, e.target.value)}
                onBlur={() => handleFieldBlur(field)}
                min="0"
                max="100"
                step="1"
                className="flex-1 px-3 py-2 border border-border rounded-md bg-background text-sm"
              />
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          )
        }
        // 如果tempValues中有值，使用它；否则使用实际值
        const displayValue = tempValues[field] !== undefined ? tempValues[field] : fieldValue
        return (
          <input
            type="number"
            value={displayValue}
            onChange={(e) => handleFieldInputChange(field, e.target.value)}
            onBlur={() => handleFieldBlur(field)}
            step="1"
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
          />
        )
      }

      // 字符串字段
      if (field === "name" || field === "description") {
        const isTextarea = field === "description"
        if (isTextarea) {
          return (
            <textarea
              value={fieldValue || ""}
              onChange={(e) => handleFieldChange(field, e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm resize-none"
              placeholder="输入描述..."
            />
          )
        }
        return (
          <input
            type="text"
            value={fieldValue || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
            placeholder="输入名称..."
          />
        )
      }

      // 选择字段（如激活函数类型）
      if (field === "activation") {
        return (
          <select
            value={fieldValue || ""}
            onChange={(e) => handleFieldChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
          >
            <option value="">无</option>
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
            <option value="softmax">Softmax</option>
          </select>
        )
      }

      // 默认文本输入
      return (
        <input
          type="text"
          value={fieldValue || ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-sm"
        />
      )
    },
    [
      selectedNode,
      tempValues,
      handleFieldChange,
      handleFieldInputChange,
      handleFieldBlur,
      handleArrayFieldInputChange,
      handleArrayFieldBlur,
      handleAddArrayElement,
      handleRemoveArrayElement,
    ]
  )

  // 未选中节点时的待选状态
  if (!selectedNode) {
    return (
      <div
        className={`h-full bg-background border-l border-border flex flex-col items-center justify-center p-8 ${className}`}
      >
        <div className="text-center space-y-4 max-w-xs">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted/50 flex items-center justify-center">
            <Edit2 className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">未选中节点</h3>
            <p className="text-sm text-muted-foreground">
              请在画布上选择一个节点以查看和编辑其属性
            </p>
          </div>
        </div>
      </div>
    )
  }

  // 使用新的参数提取函数，基于规则动态提取字段
  const editableFields = extractEditableFields(selectedNode)

  return (
    <div
      className={`h-full bg-background border-l border-border flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className={`p-2 rounded-lg ${theme?.background || "bg-gray-500/10"}`}>
              <Icon className={`h-4 w-4 ${theme?.textHighlight || "text-gray-500"}`} />
            </div>
          )}
          <h2 className={`font-semibold text-lg ${theme?.textHighlight || "text-foreground"}`}>
            编辑属性
          </h2>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              if (!selectedNode) return
              showConfirmDialog(
                "确认删除",
                `确定要删除节点"${selectedNode.name}"吗？删除节点将同时删除相关的连接。`,
                () => {
                  removeLayer(selectedNode.id)
                  clearSelection()
                }
              )
            }}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            title="删除节点"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={clearSelection} title="关闭">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-thin space-y-4">
        {/* 基本信息 */}
        <div>
          <h3 className="text-xl font-bold mb-1">{selectedNode.name}</h3>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
            <span>类型:</span>
            <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">{selectedNode.type}</code>
          </div>

          {/* 渐变分隔线 */}
          {theme && (
            <div className={`h-1 rounded-full bg-gradient-to-r ${theme.head} mb-4`} />
          )}

          {/* 名称和描述编辑 */}
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                名称
              </label>
              {renderFieldEditor("name")}
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">
                描述
              </label>
              {renderFieldEditor("description")}
            </div>
          </div>
        </div>

        {/* Sequential和Parallel节点的特殊配置 */}
        {(selectedNode.type === "sequential" || selectedNode.type === "parallel") && (
          <SequentialParallelEditor
            node={selectedNode}
            onAddSequentialStep={handleAddSequentialStep}
            onRemoveSequentialStep={handleRemoveSequentialStep}
            onReorderSequentialStep={handleReorderSequentialStep}
            onUpdateSequentialStep={handleUpdateSequentialStep}
            onAddParallelBranch={handleAddParallelBranch}
            onRemoveParallelBranch={handleRemoveParallelBranch}
            onUpdateBranchName={handleUpdateBranchName}
            onAddBranchStep={handleAddBranchStep}
            onRemoveBranchStep={handleRemoveBranchStep}
            onReorderBranchStep={handleReorderBranchStep}
            onUpdateBranchStep={handleUpdateBranchStep}
          />
        )}

        {/* 参数编辑 */}
        {editableFields.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-3">参数详情</h4>
            <div className="space-y-2">
              {editableFields.map((field) => {
                return (
                  <div key={field} className="py-2 px-3 rounded-lg bg-muted/50 space-y-1.5 min-w-0">
                    <div className="text-sm text-muted-foreground">{getFieldLabel(field)}</div>
                    <div className="flex items-center justify-between min-w-0">
                      <div className="flex-1 min-w-0">
                        {renderFieldEditor(field)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * 子节点编辑器组件 - 编辑子节点的所有参数
 */
interface ChildNodeEditorProps {
  layer: Layer
  onUpdate: (updates: Partial<Layer>) => void
}

function ChildNodeEditor({ layer, onUpdate }: ChildNodeEditorProps) {
  const editableFields = useMemo(() => {
    const fields: string[] = []
    const excludeFields = ['id', 'name', 'type', 'description', 'steps', 'branches', 'color']
    
    // 已知的数组字段，即使为空也要显示
    const knownArrayFields = ['outputShape', 'kernelSize', 'stride', 'padding', 'poolSize']
    
    for (const key in layer) {
      if (excludeFields.includes(key)) continue
      const value = (layer as any)[key]
      
      // null/undefined 不显示
      if (value === null || value === undefined) continue
      
      // 数组字段（包括空数组）都要显示
      if (Array.isArray(value) || knownArrayFields.includes(key)) {
        fields.push(key)
        continue
      }
      
      // 数字0不显示（但数组中的0要显示）
      if (typeof value === 'number' && value === 0) continue
      
      fields.push(key)
    }
    
    // 将outputShape放在最后
    const outputShapeIndex = fields.indexOf('outputShape')
    if (outputShapeIndex !== -1) {
      fields.splice(outputShapeIndex, 1)
      fields.push('outputShape')
    }
    
    return fields
  }, [layer])

  // 临时存储输入值（用于非数组字段）
  const [tempValues, setTempValues] = useState<Record<string, string>>({})

  const handleFieldChange = useCallback((field: string, value: any) => {
    if (value === "" || value === null || value === undefined) {
      return
    }
    let convertedValue: any = value
    if (field === "filters" || field === "dimension" || field === "numHeads" || field === "headDim" || field === "modelDim") {
      convertedValue = Number(value)
      if (isNaN(convertedValue)) return
    } else if (field === "rate" || field === "dropout") {
      convertedValue = Number(value)
      if (isNaN(convertedValue)) return
      if (convertedValue > 1) convertedValue = convertedValue / 100
    }
    onUpdate({ [field]: convertedValue })
  }, [onUpdate])

  const handleFieldInputChange = useCallback((field: string, value: string) => {
    setTempValues(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleFieldBlur = useCallback((field: string) => {
    const tempValue = tempValues[field]
    // 清除临时值
    setTempValues(prev => {
      const newValues = { ...prev }
      delete newValues[field]
      return newValues
    })
    
    // 如果临时值存在且不为空，使用临时值更新
    if (tempValue !== undefined && tempValue !== "") {
      handleFieldChange(field, tempValue)
    } else if (tempValue === "") {
      // 如果临时值为空字符串，对于数字字段设置为0
      const numericFields = ["filters", "dimension", "numHeads", "headDim", "modelDim", "rate", "dropout"]
      if (numericFields.includes(field)) {
        onUpdate({ [field]: 0 })
      }
    }
  }, [tempValues, handleFieldChange, onUpdate])

  // 数组字段输入变化（只更新临时状态，允许空值）
  const handleArrayFieldInputChange = useCallback((field: string, index: number, value: string) => {
    const key = `${field}_${index}`
    setTempValues(prev => ({ ...prev, [key]: value }))
  }, [])

  // 数组字段失去焦点时验证并更新
  const handleArrayFieldBlur = useCallback((field: string, index: number) => {
    const key = `${field}_${index}`
    const tempValue = tempValues[key]
    
    // 清除临时值
    setTempValues(prev => {
      const newValues = { ...prev }
      delete newValues[key]
      return newValues
    })
    
    // 如果临时值存在，验证并更新
    if (tempValue !== undefined) {
      const currentValue = (layer as any)[field] as number[] | undefined
      const newArray = [...(currentValue || [])]
      
      if (tempValue === "" || tempValue === null || tempValue === undefined) {
        // 空值设为 0
        newArray[index] = 0
      } else {
        const numValue = Number(tempValue)
        // 如果是有效数字，更新；否则设为 0
        newArray[index] = isNaN(numValue) ? 0 : numValue
      }
      
      onUpdate({ [field]: newArray })
    }
  }, [layer, tempValues, onUpdate])

  const handleAddArrayElement = useCallback((field: string) => {
    const currentValue = (layer as any)[field] as number[] | undefined
    const newArray = [...(currentValue || []), 0]
    onUpdate({ [field]: newArray })
  }, [layer, onUpdate])

  const handleRemoveArrayElement = useCallback((field: string, index: number) => {
    const currentValue = (layer as any)[field] as number[] | undefined
    const newArray = [...(currentValue || [])]
    newArray.splice(index, 1)
    onUpdate({ [field]: newArray })
  }, [layer, onUpdate])

  const renderFieldEditor = useCallback((field: string) => {
    const fieldValue = (layer as any)[field]
    const fieldType = typeof fieldValue

    // 形状字段（outputShape）
    if (field === "outputShape") {
      const shapeValue = fieldValue as number[] | undefined
      const shapeArray = shapeValue || []
      
      return (
        <div className="space-y-2">
          {shapeArray.map((item, index) => {
            const key = `${field}_${index}`
            const displayValue = tempValues[key] !== undefined ? tempValues[key] : (item ?? 0)
            return (
            <div key={index} className="flex items-center gap-1.5 min-w-0">
              <span className="text-xs text-muted-foreground w-5 shrink-0 flex-shrink-0">[{index}]</span>
              <input
                type="number"
                value={displayValue}
                onChange={(e) => handleArrayFieldInputChange(field, index, e.target.value)}
                onBlur={() => handleArrayFieldBlur(field, index)}
                className="flex-1 min-w-0 px-1.5 py-1 text-xs border border-border rounded bg-background"
                placeholder={`维度 ${index}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveArrayElement(field, index)}
                className="h-6 w-6 shrink-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="删除此维度"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddArrayElement(field)}
            className="w-full gap-1 h-6 text-xs"
          >
            <Plus className="h-3 w-3" />
            添加维度
          </Button>
        </div>
      )
    }

    // 数组字段
    if (Array.isArray(fieldValue)) {
      return (
        <div className="space-y-2">
          {fieldValue.map((item, index) => {
            const key = `${field}_${index}`
            const displayValue = tempValues[key] !== undefined ? tempValues[key] : (item ?? 0)
            return (
            <div key={index} className="flex items-center gap-1.5 min-w-0">
              <input
                type="number"
                value={displayValue}
                onChange={(e) => handleArrayFieldInputChange(field, index, e.target.value)}
                onBlur={() => handleArrayFieldBlur(field, index)}
                className="flex-1 min-w-0 px-1.5 py-1 text-xs border border-border rounded bg-background"
                placeholder={`元素 ${index + 1}`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveArrayElement(field, index)}
                className="h-6 w-6 shrink-0 flex-shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                title="删除此元素"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAddArrayElement(field)}
            className="w-full gap-1 h-6 text-xs"
          >
            <Plus className="h-3 w-3" />
            添加元素
          </Button>
        </div>
      )
    }

    // 布尔字段
    if (fieldType === "boolean") {
      return (
        <select
          value={fieldValue ? "true" : "false"}
          onChange={(e) => handleFieldChange(field, e.target.value === "true")}
          className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
        >
          <option value="true">是</option>
          <option value="false">否</option>
        </select>
      )
    }

    // 数字字段
    if (fieldType === "number") {
      if (field === "rate" || field === "dropout") {
        const percentValue = fieldValue * 100
        const displayValue = tempValues[field] !== undefined ? tempValues[field] : percentValue
        return (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={displayValue}
              onChange={(e) => handleFieldInputChange(field, e.target.value)}
              onBlur={() => handleFieldBlur(field)}
              min="0"
              max="100"
              step="1"
              className="flex-1 px-2 py-1 text-xs border border-border rounded bg-background"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        )
      }
      const displayValue = tempValues[field] !== undefined ? tempValues[field] : fieldValue
      return (
        <input
          type="number"
          value={displayValue}
          onChange={(e) => handleFieldInputChange(field, e.target.value)}
          onBlur={() => handleFieldBlur(field)}
          className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
        />
      )
    }

    // 字符串字段
    if (field === "name") {
      return (
        <input
          type="text"
          value={fieldValue || ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
          placeholder="节点名称"
        />
      )
    }

    // 选择字段（如激活函数类型）
    if (field === "activation") {
      return (
        <select
          value={fieldValue || ""}
          onChange={(e) => handleFieldChange(field, e.target.value)}
          className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
        >
          <option value="">无</option>
          <option value="relu">ReLU</option>
          <option value="sigmoid">Sigmoid</option>
          <option value="tanh">Tanh</option>
          <option value="softmax">Softmax</option>
        </select>
      )
    }

    // 默认文本输入
    return (
      <input
        type="text"
        value={fieldValue || ""}
        onChange={(e) => handleFieldChange(field, e.target.value)}
        className="w-full px-2 py-1 text-xs border border-border rounded bg-background"
      />
    )
  }, [layer, tempValues, handleFieldChange, handleFieldInputChange, handleFieldBlur, handleArrayFieldInputChange, handleArrayFieldBlur, handleAddArrayElement, handleRemoveArrayElement])

  return (
    <div className="p-3 border-t border-border bg-background space-y-3 max-h-96 overflow-y-auto">
      {editableFields.map((field) => {
        const fieldValue = (layer as any)[field]
        
        // 已知的数组字段（包括outputShape），即使为空数组或undefined也要显示
        const knownArrayFields = ['outputShape', 'kernelSize', 'stride', 'padding', 'poolSize']
        const isKnownArrayField = knownArrayFields.includes(field)
        
        // 对于非数组字段，如果值为null/undefined或数字0，不显示
        if (!isKnownArrayField && !Array.isArray(fieldValue)) {
          if (fieldValue === null || fieldValue === undefined) return null
          if (typeof fieldValue === 'number' && fieldValue === 0) return null
        }
        
        return (
          <div key={field}>
            <label className="text-xs text-muted-foreground mb-1 block">{getFieldLabel(field)}</label>
            {renderFieldEditor(field)}
          </div>
        )
      })}
    </div>
  )
}

/**
 * 子节点项组件 - 显示详细信息、支持拖拽和编辑
 */
interface ChildNodeItemProps {
  layer: Layer
  index: number
  onRemove: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDragLeave?: () => void
  onDrop: (e: React.DragEvent) => void
  onUpdate: (updates: Partial<Layer>) => void
  isDragging?: boolean
  isDragOver?: boolean
}

function ChildNodeItem({
  layer,
  index,
  onRemove,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onUpdate,
  isDragging = false,
  isDragOver = false,
}: ChildNodeItemProps) {
  const params = getLayerParams(layer).filter(p => p.label !== "描述") // 排除description
  const layerTheme = getLayerColorTheme(layer)
  const Icon = getLayerIcon(layer)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`bg-background rounded-md border border-border overflow-hidden transition-all ${
        isDragging ? "opacity-50" : ""
      } ${
        isDragOver ? "border-primary border-2 shadow-md" : ""
      }`}
    >
      {/* 子层头部 */}
      <div className={`bg-gradient-to-r ${layerTheme.head} px-3 py-2 flex items-center gap-2`}>
        <button
          type="button"
          className="cursor-move text-white/70 hover:text-white transition-colors"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <GripVertical className="w-4 h-4" />
        </button>
        <Icon className="w-3.5 h-3.5 text-white shrink-0" />
        <span className="text-xs font-semibold text-white flex-1 truncate">
          {index + 1}. {layer.name}
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/20 text-white font-mono shrink-0">
          {layer.type}
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(!isExpanded)
          }}
          className="h-6 w-6 shrink-0 text-white hover:bg-white/20"
          title={isExpanded ? "收起" : "展开"}
        >
          {isExpanded ? <X className="h-3 w-3" /> : <Edit2 className="h-3 w-3" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="h-6 w-6 shrink-0 text-white hover:bg-white/20 hover:text-red-200"
          title="删除"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* 子层参数 */}
      {params.length > 0 && (
        <div className="p-3 space-y-1.5 bg-muted/30">
          {params.map((param, idx) => (
            <div key={idx} className="flex justify-between text-xs">
              <span className="text-muted-foreground">{param.label}:</span>
              <span className={`font-semibold ${param.isHighlight ? layerTheme.textHighlight : 'text-foreground'}`}>
                {param.value}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 展开的编辑区域 */}
      {isExpanded && (
        <ChildNodeEditor layer={layer} onUpdate={onUpdate} />
      )}
    </div>
  )
}

/**
 * Sequential和Parallel节点编辑器组件
 */
interface SequentialParallelEditorProps {
  node: Layer
  onAddSequentialStep: (nodeType: LayerType) => void
  onRemoveSequentialStep: (index: number) => void
  onReorderSequentialStep: (fromIndex: number, toIndex: number) => void
  onUpdateSequentialStep: (stepIndex: number, updates: Partial<Layer>) => void
  onAddParallelBranch: () => void
  onRemoveParallelBranch: (index: number) => void
  onUpdateBranchName: (index: number, name: string) => void
  onAddBranchStep: (branchIndex: number, nodeType: LayerType) => void
  onRemoveBranchStep: (branchIndex: number, stepIndex: number) => void
  onReorderBranchStep: (branchIndex: number, fromIndex: number, toIndex: number) => void
  onUpdateBranchStep: (branchIndex: number, stepIndex: number, updates: Partial<Layer>) => void
}

function SequentialParallelEditor({
  node,
  onAddSequentialStep,
  onRemoveSequentialStep,
  onReorderSequentialStep,
  onUpdateSequentialStep,
  onAddParallelBranch,
  onRemoveParallelBranch,
  onUpdateBranchName,
  onAddBranchStep,
  onRemoveBranchStep,
  onReorderBranchStep,
  onUpdateBranchStep,
}: SequentialParallelEditorProps) {
  // -1表示sequential节点，>=0表示parallel节点的branchIndex
  const [showNodeTypeSelector, setShowNodeTypeSelector] = useState<number | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [draggedBranchIndex, setDraggedBranchIndex] = useState<number | null>(null)
  // 实时拖拽位置（用于视觉反馈）
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const [dragOverBranchIndex, setDragOverBranchIndex] = useState<number | null>(null)
  // 防抖定时器，避免频繁更新
  const dragOverTimerRef = useRef<NodeJS.Timeout | null>(null)
  const availableNodeTypes = useMemo(() => getAvailableNodeTypes().filter(type => type !== "sequential" && type !== "parallel"), [])

  const handleSelectNodeType = (nodeType: LayerType) => {
    if (showNodeTypeSelector === -1) {
      // Sequential节点
      onAddSequentialStep(nodeType)
    } else if (showNodeTypeSelector !== null && showNodeTypeSelector >= 0) {
      // Parallel节点的分支
      onAddBranchStep(showNodeTypeSelector, nodeType)
    }
    setShowNodeTypeSelector(null)
  }

  // Sequential节点拖拽处理
  const handleSequentialDragStart = (index: number) => (e: React.DragEvent) => {
    setDraggedIndex(index)
    setDragOverIndex(null)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleSequentialDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
      // 使用防抖，避免频繁更新
      if (dragOverTimerRef.current) {
        clearTimeout(dragOverTimerRef.current)
      }
      dragOverTimerRef.current = setTimeout(() => {
        if (draggedIndex !== null && draggedIndex !== index) {
          // 实时调整顺序
          onReorderSequentialStep(draggedIndex, index)
          setDraggedIndex(index)
        }
      }, 50) // 50ms防抖
    }
  }

  const handleSequentialDragLeave = () => {
    if (dragOverTimerRef.current) {
      clearTimeout(dragOverTimerRef.current)
      dragOverTimerRef.current = null
    }
    setDragOverIndex(null)
  }

  const handleSequentialDrop = (toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (dragOverTimerRef.current) {
      clearTimeout(dragOverTimerRef.current)
      dragOverTimerRef.current = null
    }
    // 确保最终位置正确
    if (draggedIndex !== null && draggedIndex !== toIndex) {
      onReorderSequentialStep(draggedIndex, toIndex)
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  // Parallel节点分支内拖拽处理
  const handleBranchDragStart = (branchIndex: number, stepIndex: number) => (e: React.DragEvent) => {
    setDraggedBranchIndex(branchIndex)
    setDraggedIndex(stepIndex)
    setDragOverBranchIndex(null)
    setDragOverIndex(null)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleBranchDragOver = (branchIndex: number, stepIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    if (draggedBranchIndex === branchIndex && draggedIndex !== null && draggedIndex !== stepIndex) {
      setDragOverBranchIndex(branchIndex)
      setDragOverIndex(stepIndex)
      // 使用防抖，避免频繁更新
      if (dragOverTimerRef.current) {
        clearTimeout(dragOverTimerRef.current)
      }
      dragOverTimerRef.current = setTimeout(() => {
        if (draggedBranchIndex === branchIndex && draggedIndex !== null && draggedIndex !== stepIndex) {
          // 实时调整顺序
          onReorderBranchStep(branchIndex, draggedIndex, stepIndex)
          setDraggedIndex(stepIndex)
        }
      }, 50) // 50ms防抖
    }
  }

  const handleBranchDragLeave = () => {
    if (dragOverTimerRef.current) {
      clearTimeout(dragOverTimerRef.current)
      dragOverTimerRef.current = null
    }
    setDragOverIndex(null)
  }

  const handleBranchDrop = (branchIndex: number, toIndex: number) => (e: React.DragEvent) => {
    e.preventDefault()
    if (dragOverTimerRef.current) {
      clearTimeout(dragOverTimerRef.current)
      dragOverTimerRef.current = null
    }
    // 确保最终位置正确
    if (draggedBranchIndex === branchIndex && draggedIndex !== null && draggedIndex !== toIndex) {
      onReorderBranchStep(branchIndex, draggedIndex, toIndex)
    }
    setDraggedBranchIndex(null)
    setDraggedIndex(null)
    setDragOverBranchIndex(null)
    setDragOverIndex(null)
  }

  if (node.type === "sequential") {
    const steps = (node as SequentialLayer).steps || []
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">子节点配置</h3>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          顺序模块包含的子节点列表（按顺序执行）
        </div>
        <div className="space-y-2">
          {steps.length > 0 ? (
            steps.map((step: Layer, index: number) => (
              <ChildNodeItem
                key={step.id || index}
                layer={step}
                index={index}
                onRemove={() => onRemoveSequentialStep(index)}
                onDragStart={handleSequentialDragStart(index)}
                onDragOver={handleSequentialDragOver(index)}
                onDragLeave={handleSequentialDragLeave}
                onDrop={handleSequentialDrop(index)}
                onUpdate={(updates) => onUpdateSequentialStep(index, updates)}
                isDragging={draggedIndex === index}
                isDragOver={dragOverIndex === index}
              />
            ))
          ) : (
            <div className="text-xs text-muted-foreground p-2 border border-dashed border-border rounded-md text-center">
              暂无子节点，点击"添加子节点"开始
            </div>
          )}
        </div>
        {showNodeTypeSelector !== -1 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowNodeTypeSelector(-1)}
            className="w-full gap-1 h-7 text-xs mt-2"
          >
            <Plus className="h-3 w-3" />
            添加子节点
          </Button>
        ) : (
          <div className="mt-2 p-2 border border-border rounded-md bg-muted/30">
            <div className="text-xs font-medium mb-2">选择节点类型：</div>
            <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
              {availableNodeTypes.map((type) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSelectNodeType(type)}
                  className="h-7 text-xs justify-start"
                >
                  {getNodeTypeName(type)}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNodeTypeSelector(null)}
              className="w-full mt-2 h-7 text-xs"
            >
              取消
            </Button>
          </div>
        )}
      </div>
    )
  }

  if (node.type === "parallel") {
    const branches = (node as ParallelLayer).branches || []
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">分支配置</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onAddParallelBranch}
            className="gap-1 h-7 text-xs"
          >
            <Plus className="h-3 w-3" />
            添加分支
          </Button>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          并行模块包含的分支列表（并行执行）
        </div>
        <div className="space-y-3">
          {branches.length > 0 ? (
            branches.map((branch: ParallelBranch, branchIndex: number) => (
              <div
                key={branch.id || branchIndex}
                className="p-3 border border-border rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text"
                    value={branch.name || `分支 ${branchIndex + 1}`}
                    onChange={(e) => onUpdateBranchName(branchIndex, e.target.value)}
                    className="flex-1 px-2 py-1 text-xs font-medium border border-border rounded bg-background"
                    placeholder="分支名称"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveParallelBranch(branchIndex)}
                    className="h-7 w-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10 ml-2"
                    title="删除此分支"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                {showNodeTypeSelector === branchIndex && (
                  <div className="mb-2 p-2 border border-border rounded-md bg-background">
                    <div className="text-xs font-medium mb-2">选择节点类型：</div>
                    <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto">
                      {availableNodeTypes.map((type) => (
                        <Button
                          key={type}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSelectNodeType(type)}
                          className="h-7 text-xs justify-start"
                        >
                          {getNodeTypeName(type)}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNodeTypeSelector(null)}
                      className="w-full mt-2 h-7 text-xs"
                    >
                      取消
                    </Button>
                  </div>
                )}
                <div className="space-y-2">
                  {(branch.steps || []).length > 0 ? (
                    (branch.steps || []).map((step: Layer, stepIndex: number) => (
                      <ChildNodeItem
                        key={step.id || stepIndex}
                        layer={step}
                        index={stepIndex}
                        onRemove={() => onRemoveBranchStep(branchIndex, stepIndex)}
                        onDragStart={handleBranchDragStart(branchIndex, stepIndex)}
                        onDragOver={handleBranchDragOver(branchIndex, stepIndex)}
                        onDragLeave={handleBranchDragLeave}
                        onDrop={handleBranchDrop(branchIndex, stepIndex)}
                        onUpdate={(updates) => onUpdateBranchStep(branchIndex, stepIndex, updates)}
                        isDragging={draggedBranchIndex === branchIndex && draggedIndex === stepIndex}
                        isDragOver={dragOverBranchIndex === branchIndex && dragOverIndex === stepIndex}
                      />
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      暂无子节点
                    </div>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowNodeTypeSelector(branchIndex)}
                    className="w-full gap-1 h-7 text-xs"
                  >
                    <Plus className="h-3 w-3" />
                    添加子节点
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground p-2 border border-dashed border-border rounded-md text-center">
              暂无分支，点击"添加分支"开始
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

