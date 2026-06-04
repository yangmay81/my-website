"use client";

import { useState } from "react";
import type { Post, Media } from "@prisma/client";
import PasswordGate from "@/components/PasswordGate";
import MediaGallery from "@/components/MediaGallery";

interface Props {
  postId: string;
  title: string;
  medias: Media[];
}

export default function PasswordProtectedPost({
  postId,
  title,
  medias,
}: Props) {
  const [verifiedPost, setVerifiedPost] = useState<
    (Post & { medias: Media[] }) | null
  >(null);

  if (verifiedPost) {
    return (
      <article className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
        {verifiedPost.medias.length > 0 && (
          <MediaGallery medias={verifiedPost.medias} />
        )}
        <div className="p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-4">{verifiedPost.title}</h1>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: verifiedPost.content }}
          />
          <time className="block mt-6 text-sm text-text-muted">
            {new Date(verifiedPost.createdAt).toLocaleDateString("zh-CN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </article>
    );
  }

  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden shadow-sm">
      {medias.length > 0 && <MediaGallery medias={medias} />}
      <div className="p-6 md:p-8">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <PasswordGate postId={postId} onVerified={setVerifiedPost} />
      </div>
    </div>
  );
}
