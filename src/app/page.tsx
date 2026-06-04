import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const revalidate = 3600; // ISR: 每小时重新验证

export const metadata: Metadata = {
  title: "我的个人网站",
  description: "分享我的日常生活和所思所想",
  openGraph: {
    title: "我的个人网站",
    description: "分享我的日常生活和所思所想",
    type: "website",
  },
};

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { visibility: "PUBLIC" },
    include: { medias: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="flex-1 w-full">
        {/* Hero Section */}
        <section className="relative h-[420px] flex items-center justify-center overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80&fit=crop"
            alt="Hero background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
          <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
              欢迎来到我的个人网站
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed">
              这里记录了我的日常生活和所思所想
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link
                href="#posts"
                className="inline-flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-colors shadow-lg"
              >
                浏览文章
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        {/* Intro Bar */}
        <section className="bg-white border-b border-border">
          <div className="max-w-5xl mx-auto px-4 py-6 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-indigo-500 flex-shrink-0 relative">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                  alt="Avatar"
                  width={48}
                  height={48}
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-medium text-text">Yang</p>
                <p className="text-sm text-text-muted">分享生活 · 记录思考</p>
              </div>
            </div>
            <div className="flex gap-6 ml-auto text-sm text-text-muted">
              <div className="text-center">
                <p className="font-semibold text-text text-lg">{posts.length}</p>
                <p>篇文章</p>
              </div>
            </div>
          </div>
        </section>

        {/* Posts Section */}
        <section id="posts" className="max-w-5xl mx-auto px-4 py-12 w-full">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold">最新文章</h2>
            <div className="h-px flex-1 bg-border" />
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="relative w-48 h-48 mx-auto mb-6 opacity-60">
                <Image
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80&fit=crop"
                  alt="Empty state"
                  fill
                  className="object-cover rounded-full"
                />
              </div>
              <p className="text-text-muted text-lg mb-4">还没有公开的内容</p>
              <Link
                href="/login"
                className="text-primary hover:text-primary-dark underline"
              >
                登录后开始发布内容
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
