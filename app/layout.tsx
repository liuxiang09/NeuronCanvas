import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "./_components/layout/Navbar";
import { Footer } from "./_components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuronCanvas - Sculpting Neural Networks in Your Browser",
  description: "An interactive web platform for visualizing and understanding deep learning models through animations and sandbox tools.",
  keywords: ["deep learning", "neural networks", "visualization", "AI", "machine learning", "education"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          {/* 导航栏 */}
          <Navbar />
          
          {/* 主内容区域 */}
          <main className="flex-1">
            {children}
          </main>
          
          {/* 页脚 */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
