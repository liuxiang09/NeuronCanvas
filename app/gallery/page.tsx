"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, Filter, Calendar, Users, ArrowRight, Sparkles, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Model } from "@/lib/types"
import { models, getAllCategories, getAllTags } from "@/lib/modelRegistry"

// 所有可用的分类
const categories = getAllCategories()

// 所有可用的标签
const allTags = getAllTags()

export default function GalleryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("全部")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // 过滤模型
  const filteredModels = useMemo(() => {
    return models
      .filter((model) => {
        // 搜索过滤
        const matchesSearch =
          searchQuery === "" ||
          model.metadata.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.metadata.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          model.metadata.name.toLowerCase().includes(searchQuery.toLowerCase())

        // 分类过滤
        const matchesCategory =
          selectedCategory === "全部" ||
          model.metadata.category === selectedCategory

        // 标签过滤
        const matchesTags =
          selectedTags.length === 0 ||
          selectedTags.every((tag) => model.metadata.tags?.includes(tag))

        return matchesSearch && matchesCategory && matchesTags
      })
      .sort((a, b) => {
        // 自然排序：正确处理字符串中的数字（如 resnet18 < resnet34 < resnet101）
        return a.metadata.name.localeCompare(b.metadata.name, undefined, {
          numeric: true,
          sensitivity: 'base'
        })
      })
  }, [searchQuery, selectedCategory, selectedTags])

  // 切换标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    )
  }

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="border-b border-border bg-gradient-to-br from-background via-primary/5 to-purple-500/5">
        <div className="container max-w-screen-2xl px-4 py-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/50 backdrop-blur-sm px-4 py-1.5 text-sm mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">探索经典神经网络架构</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              模型画廊
            </h1>
            <p className="text-lg text-muted-foreground">
              浏览和学习深度学习历史上的里程碑式架构,每个模型都有精美的可视化和详细的参数说明
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="border-b border-border bg-background sticky top-16 z-40 shadow-sm">
        <div className="container max-w-screen-2xl px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="搜索模型名称或描述..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>

            {/* 分类过滤 */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-thin">
              {categories.map((category) => (
                <Button
                  key={category}
                  size="sm"
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* 标签过滤 */}
          {allTags.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">标签:</span>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`
                    px-3 py-1 text-xs font-medium rounded-full transition-all
                    ${
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  清除
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Models Grid */}
      <section className="container max-w-screen-2xl px-4 py-8">
        {/* 结果统计 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            找到 <span className="font-semibold text-foreground">{filteredModels.length}</span> 个模型
          </p>
          
          {(searchQuery || selectedCategory !== "全部" || selectedTags.length > 0) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("全部")
                setSelectedTags([])
              }}
            >
              重置筛选
            </Button>
          )}
        </div>

        {/* 模型卡片网格 */}
        {filteredModels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredModels.map((model) => (
              <ModelCard key={model.metadata.name} model={model} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">未找到匹配的模型</h3>
            <p className="text-sm text-muted-foreground mb-4">
              尝试调整搜索条件或筛选器
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("全部")
                setSelectedTags([])
              }}
            >
              重置筛选
            </Button>
          </div>
        )}
      </section>

      {/* 占位提示 - 未来功能 */}
      <section className="border-t border-border bg-muted/30">
        <div className="container max-w-screen-2xl px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">更多模型即将推出</h2>
            <p className="text-muted-foreground mb-6">
              我们正在努力添加更多经典和现代的神经网络架构,包括 ResNet、VGG、Transformer 等
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-3 py-1 text-sm bg-background border border-border rounded-full">
                ResNet
              </span>
              <span className="px-3 py-1 text-sm bg-background border border-border rounded-full">
                VGG
              </span>
              <span className="px-3 py-1 text-sm bg-background border border-border rounded-full">
                AlexNet
              </span>
              <span className="px-3 py-1 text-sm bg-background border border-border rounded-full">
                Inception
              </span>
              <span className="px-3 py-1 text-sm bg-background border border-border rounded-full">
                BERT
              </span>
              <span className="px-3 py-1 text-sm bg-background border border-border rounded-full">
                GPT
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

/**
 * 模型卡片组件
 */
interface ModelCardProps {
  model: Model
}

function ModelCard({ model }: ModelCardProps) {
  const { metadata } = model

  return (
    <Link
      href={`/models/${metadata.name}`}
      className="group block"
    >
      <div className="h-full rounded-xl border-2 border-border bg-background p-6 transition-all duration-300 hover:border-primary hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1">
        {/* 头部 */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
              {metadata.displayName}
            </h3>
            {metadata.category && (
              <span className="inline-block px-2 py-0.5 text-xs font-medium rounded bg-primary/10 text-primary">
                {metadata.category}
              </span>
            )}
          </div>
          <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        {/* 描述 */}
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
          {metadata.description}
        </p>

        {/* 元数据 */}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
          {metadata.year && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{metadata.year}</span>
            </div>
          )}
          {metadata.authors && metadata.authors.length > 0 && (
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{metadata.authors[0]}</span>
              {metadata.authors.length > 1 && (
                <span>等 {metadata.authors.length} 人</span>
              )}
            </div>
          )}
          {metadata.paper && metadata.citations !== undefined && (
            <div className="flex items-center gap-1">
              <Quote className="h-3 w-3" />
              <span>
                {formatCitations(metadata.citations)} 引用
              </span>
            </div>
          )}
        </div>

        {/* 标签 */}
        {metadata.tags && metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {metadata.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
              >
                {tag}
              </span>
            ))}
            {metadata.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground">
                +{metadata.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

/**
 * 格式化引用数
 */
function formatCitations(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`
  }
  return count.toString()
}
