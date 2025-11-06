/**
 * 模型可视化器工厂
 * 
 * 负责动态加载和管理不同模型的 3D 可视化组件
 * 确保每次只加载一个模型，避免资源冲突和性能问题
 */

import { Suspense, lazy } from 'react';

// 动态导入已实现的可视化组件
const LeNet5Visualizer = lazy(() => import('./models/LeNet').then(mod => ({ default: mod.LeNet5Visualizer })));
const AlexNetVisualizer = lazy(() => import('./models/AlexNet').then(mod => ({ default: mod.AlexNetVisualizer })));

// 未来可以添加更多模型：
// const VGGVisualizer = lazy(() => import('./models/VGGVisualizer'));
// const ResNetVisualizer = lazy(() => import('./models/ResNetVisualizer'));
// const LSTMVisualizer = lazy(() => import('./models/LSTMVisualizer'));
// const TransformerVisualizer = lazy(() => import('./models/TransformerVisualizer'));

// 加载状态组件
const VisualizerLoading = () => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-muted-foreground">正在加载 3D 可视化...</p>
    </div>
  </div>
);

// 错误边界组件
const VisualizerError = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="flex items-center justify-center h-full">
    <div className="text-center space-y-4 p-8">
      <div className="text-6xl">⚠️</div>
      <h3 className="text-xl font-bold">可视化加载失败</h3>
      <p className="text-muted-foreground max-w-md">
        {error.message || '3D 渲染组件出现错误，请稍后重试。'}
      </p>
      <button
        onClick={retry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        重新加载
      </button>
    </div>
  </div>
);

interface ModelVisualizerFactoryProps {
  modelSlug: string;
  onLayerSelect?: (layerId: string | null) => void;
  selectedLayerId?: string | null;
}

export function ModelVisualizerFactory({ 
  modelSlug, 
  onLayerSelect, 
  selectedLayerId 
}: ModelVisualizerFactoryProps) {
  
  // 根据模型 slug 选择对应的可视化组件
  const getVisualizerComponent = () => {
    switch (modelSlug) {
      case 'lenet-5':
        return LeNet5Visualizer;
      case 'alexnet':
        return AlexNetVisualizer;
      // 未来可以添加更多模型：
      // case 'vgg16':
      //   return VGGVisualizer;
      // case 'resnet':
      //   return ResNetVisualizer;
      // case 'lstm':
      //   return LSTMVisualizer;
      // case 'transformer':
      //   return TransformerVisualizer;
      default:
        return null;
    }
  };

  const VisualizerComponent = getVisualizerComponent();

  if (!VisualizerComponent) {
    return (
      <div className="h-full flex items-center justify-center bg-muted/30">
        <div className="text-center space-y-4 p-8">
          <div className="text-6xl">🚧</div>
          <h2 className="text-2xl font-bold">即将推出</h2>
          <p className="text-muted-foreground max-w-md">
            此模型的 3D 可视化正在开发中。敬请期待！
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<VisualizerLoading />}>
      <VisualizerComponent
        onLayerSelect={onLayerSelect}
        selectedLayerId={selectedLayerId}
      />
    </Suspense>
  );
}