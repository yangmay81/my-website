import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MediaGallery from "@/components/MediaGallery";
import Link from "next/link";

interface Props {
  params: Promise<{ token: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const post = await prisma.post.findFirst({
    where: { shareToken: token, visibility: "LINK" },
    select: { title: true, content: true },
  });

  if (!post) return { title: "内容不存在" };

  const desc = post.content.replace(/<[^>]*>/g, "").slice(0, 160);
  return {
    title: post.title,
    description: desc,
    openGraph: { title: post.title, description: desc },
  };
}

export default async function SharePage({ params }: Props) {
  const { token } = await params;

  const post = await prisma.post.findFirst({
    where: { shareToken: token, visibility: "LINK" },
    include: { medias: true },
  });

  if (!post) notFound();

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
      </div>
    </div>
  );
}
