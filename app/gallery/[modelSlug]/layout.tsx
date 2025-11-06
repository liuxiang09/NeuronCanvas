import type { ReactNode } from "react";

/**
 * 模型详情页专用布局
 * 
 * 这个布局不包含 Footer，为可视化提供全屏显示空间
 * Next.js 会使用这个布局而不是根布局中的 Footer
 */
export default function ModelDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
