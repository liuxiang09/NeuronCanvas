"use client";

import type { Layer } from "@/lib/types";

interface LayerColorConfig {
  color: string;
  shade: number;
  colorEnd?: string;
  shadeEnd?: number;
}

export interface LayerColorTheme {
  color: string;
  head: string;
  text: string;
  textHighlight: string;
  border: string;
  background: string;
  backgroundHover: string;
  handle: string;
  borderSelected: string;
  borderUnselected: string;
  miniMapColor: string;
}

const LAYER_COLOR_CONFIGS: Record<string, LayerColorConfig> = {
  input: { color: "blue", shade: 500 },
  embedding: { color: "rose", shade: 500 },
  flatten: { color: "orange", shade: 500 },
  linear: { color: "pink", shade: 500 },
  conv2d: { color: "purple", shade: 500 },
  maxpool2d: { color: "cyan", shade: 500 },
  avgpool2d: { color: "cyan", shade: 500 },
  adaptiveavgpool2d: { color: "cyan", shade: 500 },
  batchnorm: { color: "indigo", shade: 500 },
  layernorm: { color: "indigo", shade: 500 },
  lrn: { color: "indigo", shade: 500 },
  relu: { color: "lime", shade: 500 },
  sigmoid: { color: "lime", shade: 500 },
  tanh: { color: "lime", shade: 500 },
  softmax: { color: "lime", shade: 500 },
  dropout: { color: "yellow", shade: 500 },
  add: { color: "emerald", shade: 500 },
  concat: { color: "violet", shade: 500 },
  sequential: { color: "amber", shade: 500 },
  parallel: { color: "sky", shade: 500 },
  "self-attention": { color: "violet", shade: 500 },
  "cross-attention": { color: "violet", shade: 500 },
};

/*小地图颜色映射*/
const MINIMAP_COLOR_HEX: Record<string, Record<number, string>> = {
  blue: {
    500: "#3b82f6",
    600: "#2563eb",
  },
  purple: {
    500: "#a855f7",
    600: "#9333ea",
  },
  cyan: {
    500: "#06b6d4",
    600: "#0891b2",
  },
  orange: {
    500: "#f97316",
    600: "#ea580c",
  },
  pink: {
    500: "#ec4899",
    600: "#db2777",
  },
  yellow: {
    500: "#eab308",
    600: "#ca8a04",
  },
  indigo: {
    500: "#6366f1",
    600: "#4f46e5",
  },
  lime: {
    500: "#84cc16",
    600: "#65a30d",
  },
  amber: {
    500: "#f59e0b",
    600: "#d97706",
  },
  sky: {
    500: "#0ea5e9",
    600: "#0284c7",
  },
  emerald: {
    500: "#10b981",
    600: "#059669",
  },
  violet: {
    500: "#8b5cf6",
    600: "#7c3aed",
  },
  teal: {
    500: "#14b8a6",
    600: "#0f766e",
  },
  gray: {
    500: "#6b7280",
    600: "#4b5563",
  },
  rose: {
    500: "#ec4899",
    600: "#db2777",
  },
  fuchsia: {
    500: "#d946ef",
    600: "#c026d3",
  },
};

function generateColorTheme(config: LayerColorConfig): LayerColorTheme {
  const { color, colorEnd, shade, shadeEnd } = config;
  const endShade = shadeEnd || (shade < 500 ? 500 : 600);
  const miniMapColor = MINIMAP_COLOR_HEX[color]?.[shade] ?? "#6b7280";

  return {
    color,
    head: `from-${color}-${shade} to-${colorEnd || color}-${endShade}`,
    text: `text-${color}-600`,
    textHighlight: `text-${color}-${shade}`,
    border: `border-${color}-${shade}`,
    background: `bg-${color}-${shade}/10`,
    backgroundHover: `bg-${color}-${shade}/5`,
    handle: `!bg-${color}-${shade}`,
    borderSelected: `border-${color}-${shade} shadow-xl shadow-${color}-${shade}/20 scale-105`,
    borderUnselected: `border-border hover:border-${
      colorEnd || color
    }-${endShade} hover:shadow-xl`,
    miniMapColor,
  };
}

export function getLayerColorTheme(layer: Layer): LayerColorTheme {
  if (!layer || !layer.type) {
    return generateColorTheme({ color: "gray", shade: 500 });
  }

  if (
    (layer.type === "sequential" || layer.type === "parallel") &&
    "color" in layer &&
    (layer as any).color
  ) {
    const customColor = layer.color as string;
    const customConfig: LayerColorConfig = {
      color: customColor,
      colorEnd: customColor,
      shade: 500,
      shadeEnd: 600,
    };

    return generateColorTheme(customConfig);
  }

  return generateColorTheme(LAYER_COLOR_CONFIGS[layer.type] || { color: "gray", shade: 500 });
}
