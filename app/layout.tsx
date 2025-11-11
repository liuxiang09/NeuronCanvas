import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/Header"

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "NeuronCanvas - 可视化深度学习架构",
  description: "一个开源的深度学习教育平台,以视觉化方式阐释经典神经网络架构",
  keywords: ["深度学习", "神经网络", "可视化", "教育", "React", "Next.js"],
  authors: [{ name: "NeuronCanvas Team" }],
  openGraph: {
    title: "NeuronCanvas - 可视化深度学习架构",
    description: "一个开源的深度学习教育平台",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="relative flex min-h-screen flex-col bg-background">
          <Header />
          {children}
        </div>
      </body>
    </html>
  )
}
