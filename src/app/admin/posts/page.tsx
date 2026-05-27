import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    include: { medias: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors text-sm"
        >
          + 新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white border border-border rounded-lg p-12 text-center">
          <p className="text-text-muted mb-4">还没有任何文章</p>
          <Link
            href="/admin/posts/new"
            className="text-primary hover:text-primary-dark underline"
          >
            创建第一篇文章
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">标题</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">可见性</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">媒体</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">日期</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-text-muted">操作</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <VisibilityBadge visibility={post.visibility} />
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {post.medias.length} 个
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                  </td>
                  <td className="px-4 py-3 text-sm space-x-2">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="text-primary hover:text-primary-dark"
                    >
                      编辑
                    </Link>
                    <DeleteButton postId={post.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function VisibilityBadge({ visibility }: { visibility: string }) {
  const styles: Record<string, string> = {
    PUBLIC: "bg-green-100 text-green-700",
    PRIVATE: "bg-red-100 text-red-700",
    LINK: "bg-blue-100 text-blue-700",
    PASSWORD: "bg-yellow-100 text-yellow-700",
  };
  const labels: Record<string, string> = {
    PUBLIC: "公开",
    PRIVATE: "私密",
    LINK: "链接分享",
    PASSWORD: "密码保护",
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[visibility] || ""}`}>
      {labels[visibility] || visibility}
    </span>
  );
}

