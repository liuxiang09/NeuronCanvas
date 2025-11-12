import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind CSS 类名
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 格式化形状数组为字符串
 * @param shape 形状数组
 * @returns 格式化后的字符串,如 "[batch, 3, 224, 224]"
 */
export function formatShape(shape: Array<number | string>): string {
  const formatItem = (item: number | string) => String(item)
  return `[${shape.map(formatItem).join(", ")}]`
}
