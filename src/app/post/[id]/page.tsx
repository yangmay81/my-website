"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import type { Post, Media } from "@prisma/client";
import PasswordGate from "@/components/PasswordGate";
import MediaGallery from "@/components/MediaGallery";
import Link from "next/link";

export default function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<(Post & { medias: Media[] }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/posts/${id}`);
        if (res.ok) {
          setPost(await res.json());
        } else {
          setError("文章不存在");
        }
      } catch {
        setError("加载失败");
      }
      setLoading(false);
    }
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <p className="text-text-muted">加载中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <p className="text-text-muted text-lg mb-4">{error}</p>
          <Link href="/" className="text-primary hover:text-primary-dark underline">
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  if (!post) return null;

  if (post.visibility === "PASSWORD") {
    return (
      <PasswordGate
        postId={post.id}
        onVerified={(verifiedPost) => setPost(verifiedPost)}
      />
    );
  }

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
