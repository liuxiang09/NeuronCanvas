"use client";

import { useState, useRef, useEffect } from 'react';
import { lenet5Architecture } from '@/lib/models/lenet5';
import { Card } from '@/components/ui/card';
import { Layers, ChevronRight, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LeNet5VisualizerProps {
  onLayerSelect?: (layerId: string | null) => void;
  selectedLayerId?: string | null;
}

/**
 * LeNet-5 可视化组件
 * 
 * 布局：左侧 2D/3D 可视化区域 + 右侧层列表
 * 特点：模块化设计，易于扩展到真正的 3D 渲染
 */
export default function LeNet5Visualizer({ onLayerSelect, selectedLayerId }: LeNet5VisualizerProps) {
  const [currentLayerIndex, setCurrentLayerIndex] = useState(-1); // -1 表示未选中任何层
  const [hoveredLayerId, setHoveredLayerId] = useState<string | null>(null);
  
  // 初始状态配置
  const INITIAL_SCALE = 1.0;
  const INITIAL_POSITION = { x: 0, y: 0 };
  
  // 缩放和平移状态
  const [scale, setScale] = useState(INITIAL_SCALE);
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 缩放边界
  const MIN_SCALE = INITIAL_SCALE;  // 最小缩放为 100%
  const MAX_SCALE = 3;
  
  // 平移边界（相对于缩放）
  const getBounds = () => {
    if (!containerRef.current) return { minX: -500, maxX: 500, minY: -300, maxY: 300 };
    const container = containerRef.current.getBoundingClientRect();
    const maxOffset = 500 * scale;
    return {
      minX: -maxOffset,
      maxX: maxOffset,
      minY: -maxOffset,
      maxY: maxOffset
    };
  };

  // 限制位置在边界内（禁用上下拖动，y 始终为 0）
  const clampPosition = (x: number, y: number) => {
    const bounds = getBounds();
    return {
      x: Math.max(bounds.minX, Math.min(bounds.maxX, x)),
      y: 0  // 禁用上下拖动，保持垂直居中
    };
  };

  // 处理滚轮缩放
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 计算鼠标在 SVG 坐标系中的位置
      const svgX = (mouseX - rect.width / 2 - position.x) / scale;
      const svgY = (mouseY - rect.height / 2 - position.y) / scale;
      
      // 计算新的缩放比例（平滑缩放）
      const delta = -e.deltaY * 0.001;
      const newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, scale * (1 + delta)));
      
      // 如果缩放到初始比例，自动归位到初始位置
      if (newScale === MIN_SCALE) {
        setScale(INITIAL_SCALE);
        setPosition(INITIAL_POSITION);
      } else {
        // 计算新的位置，使缩放以鼠标位置为中心
        const newX = mouseX - rect.width / 2 - svgX * newScale;
        const newY = mouseY - rect.height / 2 - svgY * newScale;
        
        const clampedPos = clampPosition(newX, newY);
        
        setScale(newScale);
        setPosition(clampedPos);
      }
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [scale, position]);

  // 处理鼠标拖动
  const handleMouseDown = (e: React.MouseEvent) => {
    // 只在左键点击时开始拖动
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStart.x;
      const newY = 0;  // 禁用上下拖动
      const clampedPos = clampPosition(newX, newY);
      setPosition(clampedPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart]);

  // 处理层选择 - 点击同一层则收起
  const handleLayerClick = (layerId: string) => {
    const index = lenet5Architecture.findIndex((l: any) => l.id === layerId);
    
    // 如果点击的是当前已选中的层，则收起（取消选择）
    if (index === currentLayerIndex) {
      setCurrentLayerIndex(-1); // -1 表示没有选中任何层
      onLayerSelect?.(null);
    } else {
      // 否则选中新的层
      setCurrentLayerIndex(index);
      onLayerSelect?.(layerId);
    }
  };

  const currentLayer = currentLayerIndex >= 0 ? lenet5Architecture[currentLayerIndex] : null;

  return (
    <div className="flex h-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* 左侧：可视化区域 */}
      <div className="flex-1 flex flex-col p-6 gap-4">
        {/* 可视化画布 */}
        <Card className="flex-1 relative overflow-hidden border-2 shadow-xl">
          {/* 这里将来可以替换为真正的 3D Canvas */}
          <div 
            ref={containerRef}
            className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-900"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* 2D 简化可视化 */}
            <div className="w-full h-full flex items-center justify-center pointer-events-none">
              <svg 
                ref={svgRef}
                viewBox="0 0 1400 400" 
                className="pointer-events-auto"
                style={{ 
                  maxHeight: '100%', 
                  maxWidth: '100%',
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                  transformOrigin: 'center center'
                }}
              >
                {/* 绘制所有层 */}
                {lenet5Architecture.map((layer: any, index: number) => {
                  const x = 100 + index * 180;
                  const y = 200;
                  const isActive = index === currentLayerIndex;
                  const isPassed = false; // 不再使用"已通过"的概念，只高亮当前选中的层
                  const isHovered = layer.id === hoveredLayerId;
                  
                  // 计算当前层的尺寸
                  const calculateLayerSize = (l: any) => {
                    if (l.outputShape.length === 3) {
                      const [channels, featureH, featureW] = l.outputShape;
                      const spatialSize = Math.sqrt(featureH * featureW);
                      return {
                        width: 60 + Math.min(spatialSize * 1.5, 40),
                        height: 80 + Math.min(channels * 0.8, 50)
                      };
                    } else {
                      const neurons = l.outputShape[0];
                      return {
                        width: 35 + Math.min(neurons * 0.05, 20),
                        height: 100 + Math.min(neurons * 0.3, 50)
                      };
                    }
                  };
                  
                  // 根据层类型和维度动态计算大小
                  let shape;
                  const { width, height } = calculateLayerSize(layer);
                  
                  // 获取下一层的宽度（用于箭头对齐）
                  const nextLayer = index < lenet5Architecture.length - 1 ? lenet5Architecture[index + 1] : null;
                  const nextLayerWidth = nextLayer ? calculateLayerSize(nextLayer).width : 0;
                  
                  if (layer.type === 'Conv2D') {
                    // 卷积层 - 立方体效果
                    shape = (
                      <g key={layer.id}>
                        {/* 主矩形 */}
                        <rect
                          x={x - width/2}
                          y={y - height/2}
                          width={width}
                          height={height}
                          fill={isActive ? '#fbbf24' : isPassed ? '#60a5fa' : layer.color}
                          stroke={isHovered ? '#0f172a' : '#94a3b8'}
                          strokeWidth={isHovered ? 3 : 2}
                          opacity={isActive ? 1 : isPassed ? 0.8 : 0.6}
                          rx={4}
                          className="transition-all duration-300 cursor-pointer"
                          onMouseEnter={() => setHoveredLayerId(layer.id)}
                          onMouseLeave={() => setHoveredLayerId(null)}
                          onClick={() => handleLayerClick(layer.id)}
                        />
                        {/* 3D 效果 - 侧面 */}
                        <path
                          d={`M ${x + width/2} ${y - height/2} L ${x + width/2 + 15} ${y - height/2 - 15} L ${x + width/2 + 15} ${y + height/2 - 15} L ${x + width/2} ${y + height/2} Z`}
                          fill={isActive ? '#f59e0b' : isPassed ? '#3b82f6' : layer.color}
                          opacity={0.7}
                          className="transition-all duration-300"
                        />
                        {/* 3D 效果 - 顶面 */}
                        <path
                          d={`M ${x - width/2} ${y - height/2} L ${x + width/2} ${y - height/2} L ${x + width/2 + 15} ${y - height/2 - 15} L ${x - width/2 + 15} ${y - height/2 - 15} Z`}
                          fill={isActive ? '#fcd34d' : isPassed ? '#60a5fa' : layer.color}
                          opacity={0.8}
                          className="transition-all duration-300"
                        />
                      </g>
                    );
                  } else if (layer.type === 'AvgPool2D') {
                    // 池化层 - 圆角矩形
                    shape = (
                      <rect
                        key={layer.id}
                        x={x - width/2}
                        y={y - height/2}
                        width={width}
                        height={height}
                        fill={isActive ? '#fbbf24' : isPassed ? '#60a5fa' : layer.color}
                        stroke={isHovered ? '#fff' : '#334155'}
                        strokeWidth={isHovered ? 3 : 2}
                        opacity={isActive ? 1 : isPassed ? 0.8 : 0.6}
                        rx={8}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredLayerId(layer.id)}
                        onMouseLeave={() => setHoveredLayerId(null)}
                        onClick={() => handleLayerClick(layer.id)}
                      />
                    );
                  } else {
                    // 全连接层 - 竖长矩形
                    shape = (
                      <rect
                        key={layer.id}
                        x={x - width/2}
                        y={y - height/2}
                        width={width}
                        height={height}
                        fill={isActive ? '#fbbf24' : isPassed ? '#60a5fa' : layer.color}
                        stroke={isHovered ? '#fff' : '#334155'}
                        strokeWidth={isHovered ? 3 : 2}
                        opacity={isActive ? 1 : isPassed ? 0.8 : 0.6}
                        rx={6}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredLayerId(layer.id)}
                        onMouseLeave={() => setHoveredLayerId(null)}
                        onClick={() => handleLayerClick(layer.id)}
                      />
                    );
                  }
                  
                  return (
                    <g key={layer.id}>
                      {shape}
                      {/* 标签 */}
                      <text
                        x={x}
                        y={y + height/2 + 25}
                        textAnchor="middle"
                        fill={isActive || isHovered ? '#0f172a' : '#475569'}
                        fontSize="12"
                        fontWeight={isActive ? 'bold' : 'normal'}
                        className="transition-all duration-300"
                      >
                        {layer.name.split(' ')[0]}
                      </text>
                      {/* 形状标签 */}
                      <text
                        x={x}
                        y={y + height/2 + 40}
                        textAnchor="middle"
                        fill="#64748b"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {layer.outputShape.length === 3 
                          ? `${layer.outputShape[0]}×${layer.outputShape[1]}×${layer.outputShape[2]}`
                          : `${layer.outputShape[0]}`
                        }
                      </text>
                      
                      {/* 连接线到下一层 */}
                      {index < lenet5Architecture.length - 1 && (() => {
                        // 计算箭头起点：当前层右边缘（卷积层考虑3D偏移）
                        const startX = x + width/2 + (layer.type === 'Conv2D' ? 15 : 0);
                        // 计算箭头终点：下一层左边缘
                        const endX = x + 180 - nextLayerWidth/2;
                        
                        return (
                          <>
                            <line
                              x1={startX}
                              y1={y}
                              x2={endX}
                              y2={y}
                              stroke="#94a3b8"
                              strokeWidth={2}
                              opacity={0.6}
                              className="transition-all duration-300"
                            />
                            {/* 箭头 */}
                            <polygon
                              points={`${endX},${y} ${endX - 8},${y - 4} ${endX - 8},${y + 4}`}
                              fill="#94a3b8"
                              opacity={0.6}
                              className="transition-all duration-300"
                            />
                          </>
                        );
                      })()}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* 当前层高亮提示 */}
            {currentLayer && (
              <div className="absolute top-6 left-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg px-4 py-3 border border-slate-200 dark:border-slate-700 shadow-lg">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{currentLayer.name}</span>
                  <Badge variant="secondary" className="ml-2">
                    {currentLayer.type}
                  </Badge>
                </div>
              </div>
            )}

            {/* 重置视图按钮 */}
            {(scale !== INITIAL_SCALE || position.x !== INITIAL_POSITION.x || position.y !== INITIAL_POSITION.y) && (
              <div className="absolute bottom-6 left-6">
                <button
                  onClick={() => {
                    setScale(INITIAL_SCALE);
                    setPosition(INITIAL_POSITION);
                  }}
                  className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg px-4 py-2 border border-slate-200 dark:border-slate-700 shadow-lg text-sm font-medium text-primary hover:bg-primary/10 transition-colors"
                >
                  重置视图
                </button>
              </div>
            )}

            {/* 缩放比例指示器 */}
            <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-slate-800/95 backdrop-blur-md rounded-lg px-3 py-2 border border-slate-200 dark:border-slate-700 shadow-lg">
              <div className="text-xs font-mono text-muted-foreground">
                {Math.round(scale * 100)}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* 右侧：层列表面板 */}
      <div className="w-96 border-l bg-background/95 backdrop-blur-lg flex flex-col">
        {/* 标题 */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Layers className="h-5 w-5 text-primary" />
            网络层结构
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            点击层查看详细信息
          </p>
        </div>

        {/* 层列表 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {lenet5Architecture.map((layer: any, index: number) => {
            const isActive = index === currentLayerIndex;
            const isPassed = false; // 不再使用"已通过"的概念
            
            return (
              <Card
                key={layer.id}
                className={`p-4 cursor-pointer transition-all duration-300 hover:shadow-md ${
                  isActive 
                    ? 'border-primary bg-primary/5 shadow-lg' 
                    : isPassed 
                    ? 'border-blue-300 bg-blue-50 dark:bg-blue-950/20' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleLayerClick(layer.id)}
              >
                <div className="flex items-start gap-3">
                  {/* 序号指示器 */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : isPassed 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {index + 1}
                  </div>

                  {/* 层信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold truncate">{layer.name}</h4>
                      <ChevronRight className={`h-4 w-4 flex-shrink-0 transition-transform ${
                        isActive ? 'rotate-90' : ''
                      }`} />
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                        style={{ 
                          backgroundColor: `${layer.color}20`, 
                          color: layer.color, 
                          borderColor: `${layer.color}40`,
                          border: `1px solid ${layer.color}40`
                        }}
                      >
                        {layer.type}
                      </Badge>
                    </div>

                    {/* 形状信息 */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground">输入:</span>
                        <span className="ml-1 font-mono font-semibold">
                          [{layer.inputShape.join(', ')}]
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">输出:</span>
                        <span className="ml-1 font-mono font-semibold">
                          [{layer.outputShape.join(', ')}]
                        </span>
                      </div>
                    </div>

                    {/* 展开显示参数详情 */}
                    {isActive && Object.keys(layer.params).length > 0 && (
                      <div className="mt-3 pt-3 border-t space-y-2">
                        <div className="flex items-center gap-1 text-xs font-semibold text-primary">
                          <Info className="h-3 w-3" />
                          层参数
                        </div>
                        {Object.entries(layer.params).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-mono font-semibold">{String(value)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 展开显示描述 */}
                    {isActive && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {layer.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* 底部统计信息 */}
        <div className="p-4 border-t bg-muted/30">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-muted-foreground text-xs mb-1">总层数</div>
              <div className="font-bold text-lg">{lenet5Architecture.length}</div>
            </div>
            <div>
              <div className="text-muted-foreground text-xs mb-1">当前选择</div>
              <div className="font-bold text-lg text-primary">
                {currentLayerIndex >= 0 ? `第 ${currentLayerIndex + 1} 层` : '未选择'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}