import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "尼尼克创意智能体工作台",
  description: "智能生成内容创意生产工作流与智能体运行观测工程底座",
  icons: {
    icon: "/icon.svg"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
