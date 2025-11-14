/**
 * 模型数据注册中心
 * 统一管理所有模型数据
 * 
 * 如何添加新模型:
 * 1. 在 src/models/ 目录下创建新的 JSON 文件 (如 mobilenet.json)
 * 2. 在下面的 import 语句中添加导入
 * 3. 将导入的数据添加到 models 数组中
 * 
 * 注意: metadata.name 字段将自动作为模型的唯一标识
 */

import type { Model } from "@/lib/types"
import leNetData from "@/models/lenet.json"
import alexNetData from "@/models/alexnet.json"
import vgg11Data from "@/models/vgg11.json"
import googleNetData from "@/models/googlenet.json"
import resNet18Data from "@/models/resnet18.json"


/**
 * 所有注册的模型
 * 添加新模型时,只需在此数组中添加即可
 */
export const registeredModels: readonly Model[] = [
  leNetData as Model,
  alexNetData as Model,
  vgg11Data as Model,
  googleNetData as Model,
  resNet18Data as Model,
] as const

/**
 * 模型名称到模型数据的映射
 * 自动根据 metadata.name 字段建立索引
 */
const modelIndex: Record<string, Model> = Object.fromEntries(
  registeredModels.map((model) => [model.metadata.name, model])
)

export function getModelByName(name: string): Model | undefined {
  return modelIndex[name]
}

export function listModels(): Model[] {
  return [...registeredModels]
}

export function listCategories(): string[] {
  const categories = new Set<string>()
  registeredModels.forEach((model) => {
    model.metadata.category?.forEach((category) => categories.add(category))
  })
  return ["全部", ...Array.from(categories).sort()]
}

export function listTags(): string[] {
  const tags = new Set<string>()
  registeredModels.forEach((model) => {
    model.metadata.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export interface ModelSearchFilters {
  query?: string
  category?: string
  tags?: string[]
}

export function searchModels(filters: ModelSearchFilters = {}): Model[] {
  const { query = "", category, tags } = filters
  const normalizedQuery = query.trim().toLowerCase()

  return registeredModels.filter((model) => {
    const searchableContent = [
      model.metadata.displayName,
      model.metadata.description,
      model.metadata.name,
      ...(model.metadata.tags ?? []),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase()

    const matchesSearch =
      normalizedQuery.length === 0 || searchableContent.includes(normalizedQuery)

    const matchesCategory =
      !category ||
      category === "全部" ||
      model.metadata.category?.includes(category)

    const matchesTags =
      !tags ||
      tags.length === 0 ||
      tags.every((tag) => model.metadata.tags?.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })
}
