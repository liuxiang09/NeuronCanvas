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
import vgg13Data from "@/models/vgg13.json"
import vgg16Data from "@/models/vgg16.json"
import vgg19Data from "@/models/vgg19.json"
import googleNetData from "@/models/googlenet.json"
import resNet18Data from "@/models/resnet18.json"
import resNet34Data from "@/models/resnet34.json"
import resNet50Data from "@/models/resnet50.json"
import resNet101Data from "@/models/resnet101.json"
import resNet152Data from "@/models/resnet152.json"

/**
 * 所有注册的模型
 * 添加新模型时,只需在此数组中添加即可
 */
export const models: Model[] = [
  leNetData as Model,
  alexNetData as Model,
  vgg11Data as Model,
  vgg13Data as Model,
  vgg16Data as Model,
  vgg19Data as Model,
  googleNetData as Model,
  resNet18Data as Model,
  resNet34Data as Model,
  resNet50Data as Model,
  resNet101Data as Model,
  resNet152Data as Model,
]

/**
 * 模型名称到模型数据的映射
 * 自动根据 metadata.name 字段建立索引,无需手动维护
 */
export const modelRegistry: Record<string, Model> = Object.fromEntries(
  models.map((model) => [model.metadata.name, model])
)

/**
 * 根据名称获取模型
 */
export function getModelByName(name: string): Model | undefined {
  return modelRegistry[name]
}

/**
 * 获取所有模型分类
 */
export function getAllCategories(): string[] {
  const categories = new Set<string>()
  models.forEach((model) => {
    if (model.metadata.category) {
      categories.add(model.metadata.category)
    }
  })
  return ["全部", ...Array.from(categories).sort()]
}

/**
 * 获取所有标签
 */
export function getAllTags(): string[] {
  const tags = new Set<string>()
  models.forEach((model) => {
    model.metadata.tags?.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

/**
 * 搜索模型
 */
export function searchModels(
  query: string,
  category?: string,
  tags?: string[]
): Model[] {
  return models.filter((model) => {
    // 搜索过滤
    const matchesSearch =
      query === "" ||
      model.metadata.displayName.toLowerCase().includes(query.toLowerCase()) ||
      model.metadata.description.toLowerCase().includes(query.toLowerCase()) ||
      model.metadata.name.toLowerCase().includes(query.toLowerCase())

    // 分类过滤
    const matchesCategory =
      !category ||
      category === "全部" ||
      model.metadata.category === category

    // 标签过滤
    const matchesTags =
      !tags ||
      tags.length === 0 ||
      tags.every((tag) => model.metadata.tags?.includes(tag))

    return matchesSearch && matchesCategory && matchesTags
  })
}
