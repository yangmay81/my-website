import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 bg-white border-r border-border p-4 flex flex-col">
        <Link href="/admin" className="text-lg font-bold text-primary mb-6 block">
          管理后台
        </Link>
        <nav className="flex flex-col gap-1 text-sm flex-1">
          <Link
            href="/admin"
            className="px-3 py-2 rounded-md hover:bg-bg transition-colors"
          >
            仪表盘
          </Link>
          <Link
            href="/admin/posts"
            className="px-3 py-2 rounded-md hover:bg-bg transition-colors"
          >
            文章管理
          </Link>
          <Link
            href="/admin/posts/new"
            className="px-3 py-2 rounded-md bg-primary text-white hover:bg-primary-dark transition-colors"
          >
            + 新建文章
          </Link>
        </nav>
        <div className="border-t border-border pt-4 mt-4">
          <Link
            href="/"
            className="block px-3 py-2 text-text-muted hover:text-text transition-colors text-sm"
          >
            返回前台
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full text-left px-3 py-2 text-text-muted hover:text-red-500 transition-colors text-sm cursor-pointer"
            >
              退出登录
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 p-8 bg-bg overflow-auto">{children}</main>
    </div>
  );
}
