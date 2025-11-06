# 🧠 NeuronCanvas

**在浏览器中雕刻神经网络**

NeuronCanvas 是一个开源的深度学习可视化平台，通过交互式图形化展示，让经典神经网络的架构与原理变得直观易懂。

## ✨ 核心功能

### 🎨 模型画廊 (Model Gallery)

交互式拆解经典深度学习模型的完整结构。从网络架构、数据处理流程、到训练技巧和关键创新点，让每一层的设计细节一目了然。

- **已实现模型**：
  - ✅ **LeNet-5** (1998) - 深度学习的开山之作
  - ✅ **AlexNet** (2012) - ImageNet 竞赛冠军，深度学习复兴的标志
  
- **开发中**：VGG, ResNet, GoogLeNet, MobileNet 等

- **交互功能**：
  - 点击层查看详细参数和说明
  - 缩放和水平拖动浏览完整架构
  - 多章节解析：架构可视化、数据流、训练技巧、关键创新

### 🔧 沙盒工具 (Sandbox) - 🚧 开发中

你的神经网络创意工坊（规划中）。未来将支持通过拖拽基础组件自由搭建和探索模型架构。

- **规划功能**：
  - 可视化拖拽式建模界面
  - 实时计算和展示张量维度
  - 导出为 PyTorch / TensorFlow 代码

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

## 🎯 项目特色

- 🎨 **纯 Web 技术实现**：无需安装 Python 或深度学习框架，浏览器即可运行
- � **SVG 2D 可视化**：清晰展示网络层结构和连接关系
- 🖱️ **交互式探索**：支持缩放、拖动、点击查看详情
- 📚 **教育导向**：详细解析每个模型的设计思路和创新点
- 🌐 **完全开源**：代码开放，欢迎贡献

## 🛠️ 技术栈

- **框架**: Next.js 14+ (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI 组件**: shadcn/ui
- **状态管理**: Zustand
- **可视化**: SVG + React

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
