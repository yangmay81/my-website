import type { Post, Media } from "@prisma/client";
import Link from "next/link";
import Image from "next/image";
import MediaGallery from "./MediaGallery";

interface Props {
  post: Post & { medias: Media[] };
}

export default function PostCard({ post }: Props) {
  const coverImage = post.medias.find(
    (m) => m.type === "IMAGE" || m.type === "image"
  );

  return (
    <article className="group bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
      {coverImage ? (
        <Link href={`/post/${post.id}`} prefetch={true} className="block aspect-[16/9] overflow-hidden">
          <Image
            src={coverImage.url}
            alt={post.title}
            width={640}
            height={360}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      ) : post.medias.length > 0 ? (
        <MediaGallery medias={post.medias} />
      ) : (
        <Link href={`/post/${post.id}`} prefetch={true} className="block aspect-[16/9] overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        </Link>
      )}
      <div className="p-5">
        <Link href={`/post/${post.id}`} prefetch={true}>
          <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h2>
        </Link>
        <div
          className="prose text-sm text-text-muted line-clamp-3"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <time className="block mt-3 text-xs text-text-muted">
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
