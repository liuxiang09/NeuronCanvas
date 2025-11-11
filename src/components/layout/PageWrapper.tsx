"use client"
/*
页面包装组件，用于包裹页面内容，提供统一的样式和布局。
*/
import { ReactNode } from "react"

interface PageWrapperProps {
  children: ReactNode
  className?: string
}

export function PageWrapper({ children, className = "" }: PageWrapperProps) {
  return (
    <main className={`flex-1 ${className}`}>
      {children}
    </main>
  )
}
