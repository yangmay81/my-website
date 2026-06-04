import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PasswordProtectedPost from "@/components/PasswordProtectedPost";
import MediaGallery from "@/components/MediaGallery";
import CommentSection from "@/components/CommentSection";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { title: true, content: true, visibility: true },
  });

  if (!post || post.visibility === "PRIVATE") {
    return { title: "文章不存在" };
  }

  const desc = post.content.replace(/<[^>]*>/g, "").slice(0, 160);
  return {
    title: post.title,
    description: desc,
    openGraph: { title: post.title, description: desc },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();

  const post = await prisma.post.findUnique({
    where: { id },
    include: { medias: true },
  });

  if (!post) notFound();

  // 可见性控制：私密文章仅管理员可见
  if (post.visibility === "PRIVATE" && !session) {
    notFound();
  }

  // 密码保护：渲染客户端密码验证组件
  if (post.visibility === "PASSWORD" && !session) {
    return (
      <div className="min-h-screen bg-bg">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-text transition-colors mb-6 inline-block"
          >
            &larr; 返回首页
          </Link>
          <PasswordProtectedPost
            postId={post.id}
            medias={post.medias}
            title={post.title}
          />
        </div>
      </div>
    );
  }

  // PUBLIC / LINK / 管理员访问 — 直接渲染
  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-sm text-text-muted hover:text-text transition-colors mb-6 inline-block"
        >
          &larr; 返回首页
        </Link>
        <article className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
          {post.medias.length > 0 && <MediaGallery medias={post.medias} />}
          <div className="p-6 md:p-8">
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div
              className="prose"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            <time className="block mt-6 text-sm text-text-muted">
              {new Date(post.createdAt).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </article>

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
