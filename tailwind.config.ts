import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: [
    // 层颜色配置 - 确保所有动态生成的类名都被包含
    // 渐变起始色
    'from-blue-500', 'from-red-500', 'from-orange-500', 'from-pink-500',
    'from-purple-500', 'from-cyan-500', 'from-indigo-500', 'from-yellow-500',
    'from-violet-500', 'from-rose-500', 'from-fuchsia-500', 'from-amber-500',
    'from-emerald-500', 'from-sky-500', 'from-cyan-300', 'from-emerald-300',
    'from-gray-500', 'from-lime-500',
    // 渐变结束色
    'to-blue-500', 'to-blue-600', 'to-red-500', 'to-red-600', 
    'to-orange-500', 'to-orange-600', 'to-pink-500', 'to-pink-600',
    'to-purple-500', 'to-purple-600', 'to-cyan-500', 'to-cyan-600',
    'to-indigo-500', 'to-indigo-600', 'to-yellow-500', 'to-yellow-600',
    'to-violet-500', 'to-violet-600', 'to-rose-500', 'to-rose-600',
    'to-fuchsia-500', 'to-fuchsia-600', 'to-amber-500', 'to-amber-600',
    'to-emerald-500', 'to-emerald-600', 'to-sky-500', 'to-sky-600',
    'to-teal-600', 'to-gray-500', 'to-gray-600', 'to-lime-600',
    // 文本颜色
    'text-blue-500', 'text-blue-600', 'text-red-500', 'text-red-600',
    'text-orange-500', 'text-orange-600', 'text-pink-500', 'text-pink-600',
    'text-purple-500', 'text-purple-600', 'text-cyan-500', 'text-cyan-600',
    'text-indigo-500', 'text-indigo-600', 'text-yellow-500', 'text-yellow-600',
    'text-violet-500', 'text-violet-600', 'text-rose-500', 'text-rose-600',
    'text-fuchsia-500', 'text-fuchsia-600', 'text-amber-500', 'text-amber-600',
    'text-emerald-500', 'text-emerald-600', 'text-sky-500', 'text-sky-600',
    'text-cyan-300', 'text-emerald-300', 'text-gray-500', 'text-gray-600',
    'text-lime-500', 'text-lime-600',
    // 边框颜色
    'border-blue-500', 'border-red-500', 'border-orange-500', 'border-pink-500',
    'border-purple-500', 'border-cyan-500', 'border-indigo-500', 'border-yellow-500',
    'border-violet-500', 'border-rose-500', 'border-fuchsia-500', 'border-amber-500',
    'border-emerald-500', 'border-sky-500', 'border-cyan-300', 'border-emerald-300',
    'border-gray-500', 'border-lime-500',
    // 背景颜色（带透明度）
    'bg-blue-500/10', 'bg-blue-500/5', 'bg-red-500/10', 'bg-red-500/5',
    'bg-orange-500/10', 'bg-orange-500/5', 'bg-pink-500/10', 'bg-pink-500/5',
    'bg-purple-500/10', 'bg-purple-500/5', 'bg-cyan-500/10', 'bg-cyan-500/5',
    'bg-indigo-500/10', 'bg-indigo-500/5', 'bg-yellow-500/10', 'bg-yellow-500/5',
    'bg-violet-500/10', 'bg-violet-500/5', 'bg-rose-500/10', 'bg-rose-500/5',
    'bg-fuchsia-500/10', 'bg-fuchsia-500/5', 'bg-amber-500/10', 'bg-amber-500/5',
    'bg-emerald-500/10', 'bg-emerald-500/5', 'bg-sky-500/10', 'bg-sky-500/5',
    'bg-cyan-300/10', 'bg-cyan-300/5', 'bg-emerald-300/10', 'bg-emerald-300/5',
    'bg-gray-500/10', 'bg-gray-500/5', 'bg-lime-500/10', 'bg-lime-500/5',
    // Handle 连接点
    '!bg-blue-500', '!bg-red-500', '!bg-orange-500', '!bg-pink-500',
    '!bg-purple-500', '!bg-cyan-500', '!bg-indigo-500', '!bg-yellow-500',
    '!bg-violet-500', '!bg-rose-500', '!bg-fuchsia-500', '!bg-amber-500',
    '!bg-emerald-500', '!bg-sky-500', '!bg-cyan-300', '!bg-emerald-300',
    '!bg-gray-500', '!bg-lime-500',
    // 阴影颜色
    'shadow-blue-500/20', 'shadow-red-500/20', 'shadow-orange-500/20', 'shadow-pink-500/20',
    'shadow-purple-500/20', 'shadow-cyan-500/20', 'shadow-indigo-500/20', 'shadow-yellow-500/20',
    'shadow-violet-500/20', 'shadow-rose-500/20', 'shadow-fuchsia-500/20', 'shadow-amber-500/20',
    'shadow-emerald-500/20', 'shadow-sky-500/20', 'shadow-cyan-300/20', 'shadow-emerald-300/20',
    'shadow-gray-500/20', 'shadow-lime-500/20',
    // Hover 边框颜色
    'hover:border-blue-500', 'hover:border-blue-600', 'hover:border-red-500', 'hover:border-red-600',
    'hover:border-orange-500', 'hover:border-orange-600', 'hover:border-pink-500', 'hover:border-pink-600',
    'hover:border-purple-500', 'hover:border-purple-600', 'hover:border-cyan-500', 'hover:border-cyan-600',
    'hover:border-indigo-500', 'hover:border-indigo-600', 'hover:border-yellow-500', 'hover:border-yellow-600',
    'hover:border-violet-500', 'hover:border-violet-600', 'hover:border-rose-500', 'hover:border-rose-600',
    'hover:border-fuchsia-500', 'hover:border-fuchsia-600', 'hover:border-amber-500', 'hover:border-amber-600',
    'hover:border-emerald-500', 'hover:border-emerald-600', 'hover:border-sky-500', 'hover:border-sky-600',
    'hover:border-teal-600', 'hover:border-gray-500', 'hover:border-gray-600', 'hover:border-lime-500', 'hover:border-lime-600',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
