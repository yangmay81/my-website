"use client";

import type { Post, Media } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import MediaUploader from "./MediaUploader";
import ShareLink from "./ShareLink";

interface Props {
  post?: (Post & { medias: Media[] }) | null;
}

export default function PostEditor({ post }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [visibility, setVisibility] = useState(post?.visibility || "PUBLIC");
  const [password, setPassword] = useState(post?.password || "");
  const [medias, setMedias] = useState<Media[]>(post?.medias || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("标题和内容不能为空");
      return;
    }
    if (visibility === "PASSWORD" && !password.trim()) {
      setError("密码保护模式需要设置密码");
      return;
    }

    setSaving(true);
    const url = post ? `/api/posts/${post.id}` : "/api/posts";
    const method = post ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        content,
        visibility,
        password,
        medias: medias.map((m) => ({
          url: m.url,
          type: m.type,
          filename: m.filename,
        })),
      }),
    });

    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      setError("保存失败，请重试");
    }
    setSaving(false);
  }

  function handleMediaUploaded(media: Media) {
    setMedias((prev) => [...prev, media]);
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200">
          {error}
        </div>
      )}

      {/* 标题 */}
      <div>
        <label className="block text-sm font-medium mb-1">标题</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="输入文章标题"
        />
      </div>

      {/* 内容编辑器 */}
      <div>
        <label className="block text-sm font-medium mb-1">内容 (支持 HTML)</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={16}
          className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
          placeholder="<p>写点什么...</p>"
        />
      </div>

      {/* 媒体上传 */}
      <div>
        <label className="block text-sm font-medium mb-1">媒体文件</label>
        <MediaUploader onUploaded={handleMediaUploaded} existing={medias} />
      </div>

      {/* 权限设置 */}
      <div>
        <label className="block text-sm font-medium mb-2">可见性设置</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { value: "PUBLIC", label: "公开", desc: "所有人可见" },
            { value: "PRIVATE", label: "私密", desc: "仅自己可见" },
            { value: "LINK", label: "链接分享", desc: "持有链接的人可见" },
            { value: "PASSWORD", label: "密码保护", desc: "输入密码可见" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setVisibility(opt.value)}
              className={`p-3 rounded-md border text-left transition-colors cursor-pointer ${
                visibility === opt.value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:border-gray-400"
              }`}
            >
              <p className="font-medium text-sm">{opt.label}</p>
              <p className="text-xs text-text-muted">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 密码输入 (仅 PASSWORD 模式) */}
      {visibility === "PASSWORD" && (
        <div>
          <label className="block text-sm font-medium mb-1">访问密码</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="设置访问密码"
          />
        </div>
      )}

      {/* 分享链接 (仅 LINK 模式，已保存后显示) */}
      {visibility === "LINK" && post?.shareToken && (
        <ShareLink token={post.shareToken} />
      )}

      {/* 操作按钮 */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
        >
          {saving ? "保存中..." : post ? "更新文章" : "发布文章"}
        </button>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 border border-border rounded-md hover:bg-bg transition-colors cursor-pointer"
        >
          取消
        </button>
      </div>
    </div>
  );
}
