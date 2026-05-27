"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteButton({ postId }: { postId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("确定删除这篇文章？此操作不可撤销。")) return;
    setLoading(true);
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:text-red-700 disabled:opacity-50 cursor-pointer"
    >
      {loading ? "删除中..." : "删除"}
    </button>
  );
}
