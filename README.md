<div align="center">

# 🎨 NeuronCanvas

**Interactive Deep Learning Architecture Visualization Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-11-FF6B9D?style=flat)](https://reactflow.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

[📖 English](./README.md) • [🇨🇳 中文文档](./README_CN.md)

[🎯 Live Demo](#) • [📚 Documentation](#) • [🤝 Contributing](#contributing)

---

<p align="center">
  <img src="https://img.shields.io/badge/🎓-Educational-orange?style=for-the-badge" alt="Educational"/>
  <img src="https://img.shields.io/badge/🖼️-Interactive-blue?style=for-the-badge" alt="Interactive"/>
  <img src="https://img.shields.io/badge/🚀-Open_Source-green?style=for-the-badge" alt="Open Source"/>
</p>

*Visualize, understand, and interact with classical deep learning architectures through an elegant web interface.*

</div>

---

## ✨ Highlights

<table>
<tr>
<td width="50%">

### 🎯 **Interactive Architecture Visualization**
- Drag-and-drop network exploration
- Layer-by-layer parameter inspection
- Real-time tensor shape tracking
- Dynamic graph layout with React Flow

</td>
<td width="50%">

### 📚 **Comprehensive Model Library**
- **12 Classic Architectures** implemented
- LeNet, AlexNet, VGG, ResNet, GoogLeNet
- Based on original research papers
- Detailed historical context

</td>
</tr>
<tr>
<td width="50%">

### 🎨 **Modern Tech Stack**
- Built with Next.js 14 & React 18
- Fully typed with TypeScript
- Beautiful UI with Tailwind CSS
- Zero Python dependencies

</td>
<td width="50%">

### 🔧 **Developer Friendly**
- Clean, modular architecture
- Extensive documentation
- Easy to extend with new models
- Active community support

</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

```bash
Node.js >= 18.0.0
npm >= 9.0.0
```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neuroncanvas.git
cd neuroncanvas

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit **http://localhost:3000** to see NeuronCanvas in action! 🎉

### Build for Production

```bash
npm run build
npm start
```

---

## 📦 Available Models

| Architecture | Year | Paper | Params | Status |
|-------------|------|-------|--------|--------|
| **LeNet-5** | 1998 | [Link](http://yann.lecun.com/exdb/publis/pdf/lecun-01a.pdf) | 60K | ✅ |
| **AlexNet** | 2012 | [Link](https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf) | 60M | ✅ |
| **VGG-11/13/16/19** | 2014 | [Link](https://arxiv.org/abs/1409.1556) | 138M | ✅ |
| **GoogLeNet (Inception v1)** | 2014 | [Link](https://arxiv.org/abs/1409.4842) | 7M | ✅ |
| **ResNet-18/34/50/101/152** | 2015 | [Link](https://arxiv.org/abs/1512.03385) | 11-60M | ✅ |
| **MobileNet** | 2017 | [Link](https://arxiv.org/abs/1704.04861) | 4M | 🚧 |
| **EfficientNet** | 2019 | [Link](https://arxiv.org/abs/1905.11946) | 5M | 🚧 |

*✅ Implemented | 🚧 In Progress*

---

## 🎯 Key Features

### 🖼️ **Visual Architecture Explorer**

```
┌─────────────────────────────────────────────────┐
│  Interactive Canvas with React Flow            │
│  • Zoom & Pan controls                         │
│  • Layer selection & highlighting              │
│  • Parameter tooltips on hover                 │
│  • Minimap for large architectures             │
└─────────────────────────────────────────────────┘
```

### 📊 **Detailed Layer Information**

- **Input/Output Shapes**: Real-time tensor dimension tracking
- **Parameters**: Kernel size, stride, padding, activation functions
- **Receptive Field**: Layer-wise receptive field calculation
- **FLOPs**: Computational complexity analysis

### 🎨 **Customizable Visualization**

- Color-coded layer types (Conv, Pool, FC, Activation, etc.)
- Custom node styling for complex structures (Residual, Inception blocks)
- Dark/Light theme support
- Export to PNG/SVG

### 📖 **Educational Content**

- Historical context and paper citations
- Key innovations explained
- Training methodology documentation
- Interactive tutorials (coming soon)

---

## 🛠️ Tech Stack

<div align="center">

| Category | Technologies |
|----------|-------------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Visualization** | React Flow, D3.js, Three.js |
| **State Management** | Zustand |
| **Math Rendering** | KaTeX |
| **Code Quality** | ESLint, Prettier |

</div>

---

## 📁 Project Structure

```
neuroncanvas/
├── app/                        # Next.js App Router
│   ├── gallery/               # Model gallery pages
│   │   └── [model]/          # Dynamic model routes
│   └── sandbox/              # Visual design workspace (WIP)
├── src/
│   ├── components/
│   │   ├── canvas/           # React Flow components
│   │   │   ├── custom-nodes/ # Custom node types
│   │   │   └── custom-edges/ # Custom edge types
│   │   ├── layout/           # Layout components
│   │   └── ui/               # shadcn/ui components
│   ├── lib/
│   │   ├── types.ts          # TypeScript definitions
│   │   ├── utils.ts          # Utility functions
│   │   └── fieldMapping.ts   # Layer parameter mappings
│   ├── models/               # Network architecture JSON files
│   └── hooks/                # Custom React hooks
└── public/                    # Static assets
```

---

## 🤝 Contributing

We welcome contributions from the community! Whether you're:

- 🐛 **Reporting bugs**
- 💡 **Suggesting features**
- 📝 **Improving documentation**
- 🎨 **Adding new models**
- 🔧 **Fixing issues**

Check out our [Contributing Guide](CONTRIBUTING.md) to get started!

### Development Workflow

```bash
# 1. Fork & Clone
git clone https://github.com/yourusername/neuroncanvas.git

# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes & test
npm run dev

# 4. Commit with clear messages
git commit -m "feat: add VGG19 architecture"

# 5. Push & create PR
git push origin feature/amazing-feature
```

---

## 🗺️ Roadmap

### Q1 2024
- [x] Core visualization engine
- [x] 12 classical architectures
- [x] Interactive layer inspector
- [ ] Mobile responsive design

### Q2 2024
- [ ] 3D visualization mode with Three.js
- [ ] Animated data flow
- [ ] Model comparison view
- [ ] Code export (PyTorch/TensorFlow)

### Q3 2024
- [ ] Sandbox: Visual model builder
- [ ] Shape inference engine
- [ ] Custom model upload
- [ ] Collaborative features

### Q4 2024
- [ ] Educational tutorials
- [ ] Performance benchmarks
- [ ] Integration with ML frameworks
- [ ] Community model sharing

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

NeuronCanvas is inspired by and builds upon the work of many excellent projects:

- [TensorFlow Playground](https://playground.tensorflow.org/) - Interactive neural network visualization
- [Netron](https://netron.app/) - Neural network model visualizer
- [NN-SVG](https://alexlenail.me/NN-SVG/) - Publication-ready NN architecture diagrams
- [React Flow](https://reactflow.dev/) - Powerful node-based UI library

Special thanks to the deep learning research community and all our [contributors](https://github.com/yourusername/neuroncanvas/graphs/contributors)!

---

## 📞 Contact & Support

<div align="center">

[![GitHub Issues](https://img.shields.io/github/issues/yourusername/neuroncanvas?style=for-the-badge)](https://github.com/yourusername/neuroncanvas/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/yourusername/neuroncanvas?style=for-the-badge)](https://github.com/yourusername/neuroncanvas/discussions)
[![Twitter](https://img.shields.io/badge/Twitter-Follow-1DA1F2?style=for-the-badge&logo=twitter)](https://twitter.com/neuroncanvas)

**Found this project helpful? Give it a ⭐️ to show your support!**

</div>

---

## 📊 Citation

If you use NeuronCanvas in your research or education, please cite:

```bibtex
@software{neuroncanvas2024,
  author       = {NeuronCanvas Contributors},
  title        = {NeuronCanvas: Interactive Deep Learning Architecture Visualization},
  year         = {2024},
  publisher    = {GitHub},
  url          = {https://github.com/yourusername/neuroncanvas},
  version      = {1.0.0}
}
```

---

<div align="center">

Made with ❤️ by the NeuronCanvas Community

**[⬆ Back to Top](#-neuroncanvas)**

</div>
