import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  const [totalPosts, publicPosts, privatePosts, linkPosts, passwordPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { visibility: "PUBLIC" } }),
      prisma.post.count({ where: { visibility: "PRIVATE" } }),
      prisma.post.count({ where: { visibility: "LINK" } }),
      prisma.post.count({ where: { visibility: "PASSWORD" } }),
    ]);

  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { medias: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard label="全部文章" value={totalPosts} />
        <StatCard label="公开" value={publicPosts} color="green" />
        <StatCard label="私密" value={privatePosts} color="red" />
        <StatCard label="链接分享" value={linkPosts} color="blue" />
        <StatCard label="密码保护" value={passwordPosts} color="yellow" />
      </div>

      <div className="bg-white border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">最近文章</h2>
          <Link
            href="/admin/posts"
            className="text-sm text-primary hover:text-primary-dark"
          >
            查看全部
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <p className="text-text-muted text-sm">还没有文章</p>
        ) : (
          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between py-2 border-b border-border last:border-0"
              >
                <div>
                  <p className="font-medium">{post.title}</p>
                  <p className="text-xs text-text-muted">
                    {new Date(post.createdAt).toLocaleDateString("zh-CN")} ·{" "}
                    {visibilityLabel(post.visibility)} ·{" "}
                    {post.medias.length} 个媒体文件
                  </p>
                </div>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  编辑
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = "gray",
}: {
  label: string;
  value: number;
  color?: string;
}) {
  const colors: Record<string, string> = {
    green: "bg-green-50 border-green-200 text-green-700",
    red: "bg-red-50 border-red-200 text-red-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    gray: "bg-gray-50 border-gray-200 text-gray-700",
  };

  return (
    <div className={`rounded-lg border p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm">{label}</p>
    </div>
  );
}

function visibilityLabel(v: string) {
  const map: Record<string, string> = {
    PUBLIC: "公开",
    PRIVATE: "私密",
    LINK: "链接分享",
    PASSWORD: "密码保护",
  };
  return map[v] || v;
}
