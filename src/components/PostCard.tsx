import type { Post, Media } from "@prisma/client";
import Link from "next/link";
import MediaGallery from "./MediaGallery";

interface Props {
  post: Post & { medias: Media[] };
}

export default function PostCard({ post }: Props) {
  return (
    <article className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {post.medias.length > 0 && (
        <MediaGallery medias={post.medias} />
      )}
      <div className="p-6">
        <Link href={`/post/${post.id}`} className="block">
          <h2 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>
        <div
          className="prose text-text-muted line-clamp-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <time className="block mt-3 text-sm text-text-muted">
          {new Date(post.createdAt).toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </div>
    </article>
  );
}
