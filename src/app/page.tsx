import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import Link from "next/link";

export default async function HomePage() {
  const posts = await prisma.post.findMany({
    where: { visibility: "PUBLIC" },
    include: { medias: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Header />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">欢迎来到我的个人网站</h1>
          <p className="text-text-muted">这里记录了我的日常生活和所思所想</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-text-muted text-lg mb-4">还没有公开的内容</p>
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark underline"
            >
              登录后开始发布内容
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
