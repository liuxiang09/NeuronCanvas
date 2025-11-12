import { getFieldLabel, getFieldOrder, formatFieldValue } from "../fieldMapping"
import type { Layer } from "../types"
import type { LayerColorTheme } from "../theme"

/**
 * 需要高亮显示的字段（使用层的主题色）
 */
const HIGHLIGHT_FIELDS = ["outputShape", "shape"]

/**
 * 需要顶部边框的字段（用于视觉分隔）
 */
const BORDER_FIELDS = ["outputShape", "shape"]

/**
 * 渲染层的参数字段（用于节点卡片显示）
 * @param layer 层对象
 * @param theme 层的颜色主题
 * @returns JSX 元素
 */
export function renderLayerFields(layer: Layer, theme: LayerColorTheme) {
  // 获取该层类型应该显示的字段顺序
  const fieldOrder = getFieldOrder(layer.type)

  return (
    <div className="space-y-1.5">
      {fieldOrder.map((fieldKey) => {
        // 从 layer 对象中获取字段值
        const value = (layer as any)[fieldKey]
        
        // 跳过空值和描述字段
        if (value === undefined || value === null || fieldKey === "description") {
          return null
        }

        // 获取字段的显示标签和格式化值
        const label = getFieldLabel(fieldKey)
        let formattedValue = formatFieldValue(fieldKey, value)

        if (fieldKey === "outputShape" || fieldKey === "inputShape") {
          formattedValue = `\t${formattedValue}`
        }

        // 跳过格式化后为空的值
        if (!formattedValue) {
          return null
        }

        // 判断是否需要特殊样式
        const isHighlight = HIGHLIGHT_FIELDS.includes(fieldKey)
        const needsBorder = BORDER_FIELDS.includes(fieldKey)

        return (
          <div
            key={fieldKey}
            className={`flex justify-between text-xs ${
              needsBorder ? "pt-1 border-t border-border" : ""
            }`}
          >
            <span className="text-muted-foreground">{label}:</span>
            <span
              className={`whitespace-pre ${
                isHighlight
                  ? `font-semibold ${theme.textHighlight}`
                  : "font-medium text-foreground"
              }`}
            >
              {formattedValue}
            </span>
          </div>
        )
      })}
    </div>
  )
}
