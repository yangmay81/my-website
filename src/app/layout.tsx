import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "我的个人网站",
  description: "分享我的日常生活",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
