/**
 * exportUtils - 导出工具函数
 * 
 * 功能说明：
 * - 提供模型数据的导入和导出功能
 * - 支持JSON格式
 * - 提供文件下载功能，可以将模型保存到本地
 * - 提供文件读取功能，可以从本地文件导入模型
 * - 自动生成导出文件名（基于模型名称和时间戳）
 * - 包含基本的错误处理和格式验证
 */

import type { Model } from "@/lib/types"

/**
 * 导出为JSON格式
 */
export function exportToJSON(model: Model): string {
  return JSON.stringify(model, null, 2)
}

/**
 * 从JSON字符串导入模型
 */
export function importFromJSON(jsonString: string): Model {
  try {
    const data = JSON.parse(jsonString)
    // 验证数据结构
    if (!data.layers || !Array.isArray(data.layers)) {
      throw new Error("Invalid model format: missing layers array")
    }
    if (!data.edges || !Array.isArray(data.edges)) {
      throw new Error("Invalid model format: missing edges array")
    }
    return data as Model
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse JSON: ${error.message}`)
    }
    throw new Error("Failed to parse JSON")
  }
}

/**
 * 下载文件
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 读取文件内容
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error("Failed to read file"))
      }
    }
    reader.onerror = () => {
      reject(new Error("Failed to read file"))
    }
    reader.readAsText(file)
  })
}

/**
 * 生成导出文件名
 */
export function generateExportFilename(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
  return `model_${timestamp}.json`
}

