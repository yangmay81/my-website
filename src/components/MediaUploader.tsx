"use client";

import type { Media } from "@prisma/client";
import { useState, useRef } from "react";

interface Props {
  onUploaded: (media: Media) => void;
  existing: Media[];
}

export default function MediaUploader({ onUploaded, existing }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          onUploaded({
            id: Math.random().toString(36).slice(2),
            postId: "",
            url: data.url,
            type: data.type as Media["type"],
            filename: data.filename,
            createdAt: new Date(),
          });
        }
      } catch {
        // ignore upload errors
      }
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeMedia(id: string) {
    // Media will be cleaned up when saved; this just removes it from UI
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-3">
        {existing.map((media) => (
          <div key={media.id} className="relative group">
            {media.type === "IMAGE" ? (
              <img
                src={media.url}
                alt={media.filename}
                className="w-24 h-24 object-cover rounded-md border border-border"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center bg-bg rounded-md border border-border text-xs text-text-muted text-center px-1">
                {media.type === "VIDEO" ? "视频" : "音频"}
              </div>
            )}
            <p className="text-xs text-text-muted truncate w-24 mt-0.5">{media.filename}</p>
          </div>
        ))}
      </div>
      <label className="inline-flex items-center gap-2 px-4 py-2 border border-dashed border-border rounded-md hover:border-primary transition-colors cursor-pointer text-sm text-text-muted">
        <span>{uploading ? "上传中..." : "+ 上传文件"}</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*,audio/*"
          multiple
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>
      <p className="text-xs text-text-muted mt-1">支持图片、视频和音频文件</p>
    </div>
  );
}
