"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface MathProps {
  children: string;
  block?: boolean;
  className?: string;
}

/**
 * 数学公式渲染组件
 * 使用 KaTeX 渲染 LaTeX 格式的数学公式
 * 
 * @param children - LaTeX 格式的数学公式字符串
 * @param block - 是否为块级公式（居中显示），默认为 false（行内公式）
 * @param className - 额外的 CSS 类名
 */
export function Math({ children, block = false, className = "" }: MathProps) {
  const containerRef = useRef<HTMLSpanElement | HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      try {
        katex.render(children, containerRef.current, {
          throwOnError: false,
          displayMode: block,
        });
      } catch (error) {
        console.error("KaTeX rendering error:", error);
        // 如果渲染失败，显示原始 LaTeX 代码
        if (containerRef.current) {
          containerRef.current.textContent = children;
        }
      }
    }
  }, [children, block]);

  const Component = block ? "div" : "span";
  
  return (
    <Component
      ref={containerRef as any}
      className={`${block ? "my-4 overflow-x-auto" : "inline-block mx-1"} ${className}`}
    />
  );
}
