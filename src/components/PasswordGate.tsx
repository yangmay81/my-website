"use client";

import { useState } from "react";
import type { Post, Media } from "@prisma/client";

interface Props {
  postId: string;
  onVerified: (post: Post & { medias: Media[] }) => void;
}

export default function PasswordGate({ postId, onVerified }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/share/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, password }),
    });

    if (res.ok) {
      const post = await res.json();
      onVerified(post);
    } else {
      setError("密码错误，请重试");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-sm mx-auto py-20">
      <h1 className="text-xl font-bold text-center mb-4">请输入访问密码</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md border border-red-200 text-center">
            {error}
          </div>
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-md text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="输入密码"
          autoFocus
        />
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 cursor-pointer"
        >
          {loading ? "验证中..." : "确认"}
        </button>
      </form>
    </div>
  );
}
