<div align="center">

# 🎨 NeuronCanvas

**深度学习架构交互式可视化平台**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-11-FF6B9D?style=flat)](https://reactflow.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[🇨🇳 中文文档](./README_CN.md) • [📖 English](./README.md)

[🎯 在线演示](#) • [📚 使用文档](#) • [🤝 参与贡献](#参与贡献)

---

<p align="center">
  <img src="https://img.shields.io/badge/🎓-教育导向-orange?style=for-the-badge" alt="Educational"/>
  <img src="https://img.shields.io/badge/🖼️-交互式-blue?style=for-the-badge" alt="Interactive"/>
  <img src="https://img.shields.io/badge/🚀-开源免费-green?style=for-the-badge" alt="Open Source"/>
</p>

*通过优雅的 Web 界面，可视化、理解和交互经典深度学习架构*

</div>

---

## ✨ 核心亮点

<table>
<tr>
<td width="50%">

### 🎯 **交互式架构可视化**
- 拖拽式网络探索
- 逐层参数检查
- 实时张量形状跟踪
- React Flow 动态图布局

</td>
<td width="50%">

### 📚 **完整模型库**
- **12 个经典架构**已实现
- LeNet、AlexNet、VGG、ResNet、GoogLeNet
- 基于原始研究论文
- 详细历史背景介绍

</td>
</tr>
<tr>
<td width="50%">

### 🎨 **现代技术栈**
- Next.js 14 & React 18 构建
- 完整 TypeScript 类型支持
- Tailwind CSS 精美界面
- 零 Python 依赖

</td>
<td width="50%">

### 🔧 **开发者友好**
- 清晰模块化架构
- 详尽文档说明
- 轻松扩展新模型
- 活跃社区支持

</td>
</tr>
</table>

---

## 🚀 快速开始

### 环境要求

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### 安装步骤

```bash
# 克隆仓库
git clone https://github.com/yourusername/neuroncanvas.git
cd neuroncanvas

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 **http://localhost:3000** 即可查看 NeuronCanvas！🎉

### 生产环境构建

```bash
npm run build
npm start
```

---

## 📦 可用模型

| 架构 | 年份 | 论文 | 参数量 | 状态 |
|-----|------|-----|-------|------|
| **LeNet-5** | 1998 | [链接](http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf) | 60K | ✅ |
| **AlexNet** | 2012 | [链接](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf) | 60M | ✅ |
| **VGG-11/13/16/19** | 2014 | [链接](https://arxiv.org/abs/1409.1556) | 138M | ✅ |
| **GoogLeNet (Inception v1)** | 2014 | [链接](https://arxiv.org/abs/1409.4842) | 7M | ✅ |
| **ResNet-18/34/50/101/152** | 2015 | [链接](https://arxiv.org/abs/1512.03385) | 11-60M | ✅ |
| **MobileNet** | 2017 | [链接](https://arxiv.org/abs/1704.04861) | 4M | 🚧 |
| **EfficientNet** | 2019 | [链接](https://arxiv.org/abs/1905.11946) | 5M | 🚧 |

*✅ 已完成 | 🚧 开发中*

---

## 🎯 主要功能

### 🖼️ **可视化架构浏览器**

```
┌─────────────────────────────────────────────────┐
│  基于 React Flow 的交互式画布                    │
│  • 缩放和平移控制                               │
│  • 层选择与高亮                                 │
│  • 悬停显示参数提示                             │
│  • 大型架构小地图导航                           │
└─────────────────────────────────────────────────┘
```

### 📊 **详细层信息**

- **输入/输出形状**：实时张量维度追踪
- **参数详情**：卷积核大小、步长、填充、激活函数
- **感受野**：逐层感受野计算
- **FLOPs**：计算复杂度分析

### 🎨 **可定制可视化**

- 颜色编码层类型（卷积、池化、全连接、激活等）
- 复杂结构自定义节点样式（残差块、Inception 块）
- 深色/浅色主题支持
- 导出为 PNG/SVG 格式

### 📖 **教育内容**

- 历史背景和论文引用
- 关键创新点解析
- 训练方法文档
- 交互式教程（即将推出）

---

## 🛠️ 技术栈

<div align="center">

| 分类 | 技术 |
|------|-----|
| **前端框架** | Next.js 14、React 18、TypeScript |
| **样式** | Tailwind CSS、shadcn/ui |
| **可视化** | React Flow、D3.js、Three.js |
| **状态管理** | Zustand |
| **数学渲染** | KaTeX |
| **代码质量** | ESLint、Prettier |

</div>

---

## 📁 项目结构

```
neuroncanvas/
├── app/                        # Next.js App Router
│   ├── gallery/               # 模型画廊页面
│   │   └── [model]/          # 动态模型路由
│   └── sandbox/              # 可视化设计工作区（开发中）
├── src/
│   ├── components/
│   │   ├── canvas/           # React Flow 组件
│   │   │   ├── custom-nodes/ # 自定义节点类型
│   │   │   └── custom-edges/ # 自定义边类型
│   │   ├── layout/           # 布局组件
│   │   └── ui/               # shadcn/ui 组件
│   ├── lib/
│   │   ├── types.ts          # TypeScript 类型定义
│   │   ├── utils.ts          # 工具函数
│   │   └── fieldMapping.ts   # 层参数映射
│   ├── models/               # 网络架构 JSON 文件
│   └── hooks/                # 自定义 React Hooks
└── public/                    # 静态资源
```

---

## 🤝 参与贡献

我们欢迎社区贡献！无论您是：

- 🐛 **报告 Bug**
- 💡 **建议新功能**
- 📝 **改进文档**
- 🎨 **添加新模型**
- 🔧 **修复问题**

查看我们的 [贡献指南](CONTRIBUTING.md) 开始参与！

### 开发流程

```bash
# 1. Fork 并克隆
git clone https://github.com/yourusername/neuroncanvas.git

# 2. 创建特性分支
git checkout -b feature/amazing-feature

# 3. 进行修改并测试
npm run dev

# 4. 提交清晰的变更信息
git commit -m "feat: 添加 VGG19 架构"

# 5. 推送并创建 PR
git push origin feature/amazing-feature
```

---

## 🗺️ 开发路线图

### 2024 Q1
- [x] 核心可视化引擎
- [x] 12 个经典架构
- [x] 交互式层检查器
- [ ] 移动端响应式设计

### 2024 Q2
- [ ] Three.js 3D 可视化模式
- [ ] 动画数据流
- [ ] 模型对比视图
- [ ] 代码导出（PyTorch/TensorFlow）

### 2024 Q3
- [ ] Sandbox：可视化模型构建器
- [ ] 形状推断引擎
- [ ] 自定义模型上传
- [ ] 协作功能

### 2024 Q4
- [ ] 教育教程
- [ ] 性能基准测试
- [ ] ML 框架集成
- [ ] 社区模型分享

---

## 📄 开源协议

本项目采用 **MIT 协议** - 详见 [LICENSE](LICENSE) 文件。

---

## 🙏 致谢

NeuronCanvas 的灵感来源于以下优秀项目：

- [TensorFlow Playground](https://playground.tensorflow.org/) - 交互式神经网络可视化
- [Netron](https://netron.app/) - 神经网络模型可视化工具
- [NN-SVG](https://alexlenail.me/NN-SVG/) - 论文级神经网络架构图
- [React Flow](https://reactflow.dev/) - 强大的节点式 UI 库

特别感谢深度学习研究社区和所有[贡献者](https://github.com/yourusername/neuroncanvas/graphs/contributors)！

---

## 📞 联系与支持

<div align="center">

[![GitHub Issues](https://img.shields.io/github/issues/yourusername/neuroncanvas?style=for-the-badge)](https://github.com/yourusername/neuroncanvas/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/yourusername/neuroncanvas?style=for-the-badge)](https://github.com/yourusername/neuroncanvas/discussions)
[![Twitter](https://img.shields.io/badge/Twitter-关注-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/neuroncanvas)

**觉得这个项目有帮助？给个 ⭐️ 支持一下！**

</div>

---

## 📊 引用

如果您在研究或教学中使用 NeuronCanvas，请引用：

```bibtex
@software{neuroncanvas2024,
  author       = {NeuronCanvas Contributors},
  title        = {NeuronCanvas: 深度学习架构交互式可视化平台},
  year         = {2024},
  publisher    = {GitHub},
  url          = {https://github.com/yourusername/neuroncanvas},
  version      = {1.0.0}
}
```

---

<div align="center">

用 ❤️ 打造 by NeuronCanvas 社区

**[⬆ 回到顶部](#-neuroncanvas)**

</div>
