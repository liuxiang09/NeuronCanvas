<p align="center">
  <img src="./public/assets/logo.png" width="120" alt="NeuronCanvas logo" />
</p>

<h1 align="center">NeuronCanvas</h1>
<p align="center">Interactive deep learning architecture visualisation platform</p>

## Overview

NeuronCanvas renders classical neural networks as an interactive graph so that students, researchers, and practitioners can explore complex architectures without digging through raw code. The project focuses on clarity, performance, and extensibility for modern web workflows.


## Quick Start

```bash
# prerequisites
node --version   # >= 18
npm --version    # >= 9

# clone and enter
git clone https://github.com/anwrog/NeuronCanvas.git
cd NeuronCanvas

# install dependencies
npm install

# run the app
npm run dev
```

- Development server runs at `http://localhost:3000`.
- Build for production with `npm run build` followed by `npm start`.
- Optional: first-time linting (`npm run lint`) lets Next.js scaffold an ESLint preset.


## Feature Highlights

- Interactive canvas built on React Flow with animated node graph layouts.
- Context-rich layer inspector covering tensor shapes, parameters, and receptive fields.
- Keyboard navigation, snapshot exporting, and dark/light theme support.
- Data-driven model definitions stored as JSON for repeatable deployments.


## Tech Stack

- Framework: Next.js 14, React 18, TypeScript
- Visualisation: React Flow, Three.js, Dagre
- Styling: Tailwind CSS, shadcn/ui
- State & Utilities: Zustand, GSAP, KaTeX, clsx
- Tooling: ESLint, Prettier, PostCSS, Turbopack-ready configuration


## Project Structure

```
NeuronCanvas/
├── app/                 # Next.js app router entrypoints and pages
│   ├── gallery/         # Gallery landing views
│   ├── models/[model]/  # Dynamic model visualisation routes
│   ├── sandbox/         # Experimental builder (WIP)
│   └── layout.tsx       # Root layout and global styles
├── public/              # Static assets including logo and favicons
├── src/
│   ├── components/
│   │   ├── canvas/      # Canvas primitives, custom nodes, custom edges
│   │   ├── layout/      # Header, navigational chrome
│   │   └── ui/          # Shared UI abstractions
│   ├── lib/             # Store, utilities, layout helpers
│   └── models/          # JSON descriptions of supported architectures
├── scripts/             # Maintenance scripts for data normalisation
└── tailwind.config.ts   # Design tokens and theme configuration
```


## Development Scripts

- `npm run dev` — start the development server with hot reload.
- `npm run build` — generate a production build.
- `npm run start` — serve the production build.
- `npm run lint` — run ESLint (first run will ask to scaffold a config).


## Backlog

- [ ] Finalise sandbox authoring workflow for custom graphs.
- [ ] Add responsive dashboard layout for mobile devices.
- [ ] Extend library with transformer-based exemplars.
- [ ] Export model views to vector graphics.
- [ ] Publish interactive documentation site.
- [x] Stabilise dependency matrix for React 18 projects.


## Contributing

Pull requests are welcome. Please open an issue describing the change, follow semantic commit messages, and include screenshots or screen recordings for UI updates. See `CONTRIBUTING.md` for the full workflow.


## License

NeuronCanvas is released under the [MIT License](./LICENSE).


## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=liuxiang09/NeuronCanvas&type=date&legend=bottom-right)](https://www.star-history.com/#liuxiang09/NeuronCanvas&type=date&legend=bottom-right)
