import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { NODE_TYPE_NAMES } from "./mapping";
import { FIELD_LABEL_MAP } from "./mapping";
import { ICON_MAP } from "./mapping";
import { Layers, LucideIcon } from "lucide-react";
import { Layer } from "./types";

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFieldValue(key: string, value: any): string {
  if (value === undefined || value === null) {
    return "";
  }

  if (Array.isArray(value)) {
    const formatArray = (arr: any[]): string =>
      `[${arr
        .map((item) => (Array.isArray(item) ? formatArray(item) : String(item)))
        .join(", ")}]`;

    if (value.every((v) => Array.isArray(v))) {
      return value.map((item) => formatArray(item)).join(" | ");
    }
    if (value.every((v) => typeof v === "number" || typeof v === "string")) {
      return formatArray(value);
    }
    return formatArray(value);
  }

  if (typeof value === "boolean") {
    return value ? "是" : "否";
  }

  if (typeof value === "number") {
    if (key === "rate" && value < 1) {
      return `${(value * 100).toFixed(0)}%`;
    }
    return value.toString();
  }

  return String(value);
}

export function getNodeTypeName(type: string): string {
  return NODE_TYPE_NAMES[type] || type;
}

export function getFieldLabel(fieldName: string): string {
  return FIELD_LABEL_MAP[fieldName] || fieldName;
}

export function getFieldOrder(layer: Layer): string[] {
  const anyLayer = layer as any
  const excludeFields = new Set(['id', 'name', 'type', 'description', 'steps', 'branches', 'color'])
  const fields: string[] = []
  let outputShapeField: string | null = null
  
  // 遍历层对象的所有属性
  for (const key in anyLayer) {
    if (excludeFields.has(key)) continue
    if (anyLayer[key] === undefined || anyLayer[key] === null) continue
    
    if (key === 'outputShape') {
      outputShapeField = key
    } else {
      fields.push(key)
    }
  }
  
  // outputShape 始终在最后
  if (outputShapeField) {
    fields.push(outputShapeField)
  }
  
  return fields
}

export function getLayerIcon(layer: Layer): LucideIcon {
  return ICON_MAP[layer.type] || Layers;
}

export function getLayerParams(layer: Layer): Array<{
  label: string;
  value: string;
  isHighlight?: boolean;
}> {
  const params: Array<{ label: string; value: string; isHighlight?: boolean }> =
    [];
  const fieldOrder = getFieldOrder(layer);
  const anyLayer = layer as any;

  for (const fieldKey of fieldOrder) {
    let value = anyLayer[fieldKey];
    if (value === undefined || value === null) {
      if (fieldKey === "type" && "type" in anyLayer) {
        value = anyLayer.type;
      } else {
        continue;
      }
    }

    const label = getFieldLabel(fieldKey);
    const formattedValue = formatFieldValue(fieldKey, value);
    if (!formattedValue) {
      continue;
    }

    params.push({
      label,
      value: formattedValue,
      isHighlight: fieldKey === "outputShape",
    });
  }

  if (layer.type === "parallel") {
    const branches = (layer as any).branches || [];
    params.unshift({
      label: "分支数量",
      value: branches.length.toString(),
    });
  }

  return params;
}
