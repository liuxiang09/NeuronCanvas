import { getFieldLabel, getFieldOrder, getValueLabel } from "../fieldMapping"
import { formatShape} from "../utils"

/**
 * 需要使用高亮色显示的字段列表
 */
const HIGHLIGHT_FIELDS = ["outputShape", "shape"]
const BORDER_FIELDS = ["outputShape", "shape"]
/**
 * 格式化字段值以便显示
 */
export function formatFieldValue(key: string, value: any): string {
  if (value === undefined || value === null) {
    return ""
  }

  // 首先检查是否有预定义的值映射
  const mappedValue = getValueLabel(key, value)
  if (mappedValue) {
    return mappedValue
  }

  // 处理数组
  if (Array.isArray(value)) {
    // 检查是否是形状数组（数字数组）
    if (value.every((v) => typeof v === "number")) {
      // 如果是2D/3D大小
      if (value.length === 2 || value.length === 3) {
        return value.join("×")
      }
      // 如果是输出形状
      return formatShape(value)
    }
    // 其他数组
    return value.join(", ")
  }

  // 处理布尔值
  if (typeof value === "boolean") {
    return value ? "是" : "否"
  }

  // 处理数字
  if (typeof value === "number") {
    // 如果是dropout或rate相关的小数，转换为百分比
    if ((key === "rate" || key === "dropout") && value < 1) {
      return `${(value * 100).toFixed(0)}%`
    }
    // 直接返回数字,不进行格式化
    return value.toString()
  }

  // 处理字符串
  if (typeof value === "string") {
    // 激活函数保持原样(不转大写)
    if (key === "activation") {
      return value
    }
    // padding等保持原样或首字母大写
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return String(value)
}

/**
 * 渲染字段列表
 */
export function renderLayerFields(
  data: any,
  highlightColor: string = "purple"
) {
  const fieldOrder = getFieldOrder(data.type)

  return (
    <div className="space-y-1.5">
      {fieldOrder.map((fieldKey) => {
        const value = data[fieldKey]
        
        // 跳过undefined/null值和description字段
        if (value === undefined || value === null || fieldKey === "description") {
          return null
        }

        const label = getFieldLabel(fieldKey)
        const formattedValue = formatFieldValue(fieldKey, value)

        // 如果格式化后的值为空，跳过
        if (!formattedValue) {
          return null
        }

        // 检查是否需要高亮显示
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
              className={
                isHighlight
                  ? `font-semibold text-${highlightColor}-600`
                  : "font-medium text-foreground"
              }
            >
              {formattedValue}
            </span>
          </div>
        )
      })}
    </div>
  )
}
