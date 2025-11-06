# 🧠 NeuronCanvas

**在浏览器中雕刻神经网络**

NeuronCanvas 是一个开源的深度学习可视化平台，通过交互式动画和沙盒工具，让复杂的神经网络变得直观易懂。

## ✨ 核心功能

### 🎨 模型画廊 (Model Gallery)

一步步、可视化地拆解经典 AI 模型。观看从数据预处理、网络架构到训练策略的完整动画流程。

- **经典模型**：LeNet-5, AlexNet, VGG, ResNet, LSTM, Transformer 等
- **交互探索**：暂停、步进、视角切换
- **深度解析**：每一层的参数和设计理念都有清晰标注

### 🔧 沙盒工具 (Sandbox)

你的神经网络创意工坊。通过拖拽基础组件自由搭建和探索模型架构。

- **可视化建模**：拖拽式界面，直观构建网络
- **实时反馈**：自动计算和展示张量维度
- **代码导出**：生成 PyTorch / TensorFlow 代码（开发中）

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/neuroncanvas.git
cd neuroncanvas

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🛠️ 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **状态管理**: Zustand
- **可视化**: D3.js / Three.js (规划中)

## 📁 项目结构

```
/NeuronCanvas
├── /app                    # Next.js App Router
│   ├── /_components        # 布局组件
│   ├── /gallery            # 模型画廊模块
│   ├── /sandbox            # 沙盒工具模块
│   └── page.tsx            # 首页
├── /components             # 全局 UI 组件
├── /lib                    # 工具函数和数据
├── /store                  # Zustand 状态管理
└── /public                 # 静态资源
```

## 🤝 贡献指南

我们欢迎所有形式的贡献！

1. Fork 这个仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 待办事项

- [ ] 集成 Three.js 实现 3D 模型可视化
- [ ] 实现真实的模型动画（数据流动）
- [ ] 添加更多经典模型（Inception, MobileNet 等）
- [ ] 沙盒中的自动形状推导
- [ ] 导出为训练代码功能
- [ ] 多语言支持

## 📄 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

## 💡 灵感来源

这个项目的灵感来自于让深度学习更加可视化和易于理解的愿景。特别感谢以下项目：

- [TensorFlow Playground](https://playground.tensorflow.org/)
- [Netron](https://netron.app/)
- [NN-SVG](https://alexlenail.me/NN-SVG/)

---

**用可视化点亮 AI 学习之路 ✨**
