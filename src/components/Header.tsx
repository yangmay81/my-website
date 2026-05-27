import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-primary hover:text-primary-dark transition-colors">
          我的个人网站
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/" className="text-text-muted hover:text-text transition-colors">
            首页
          </Link>
          {session ? (
            <>
              <Link href="/admin" className="text-text-muted hover:text-text transition-colors">
                管理
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="text-text-muted hover:text-red-500 transition-colors cursor-pointer">
                  退出
                </button>
              </form>
            </>
          ) : (
            <Link href="/login" className="text-text-muted hover:text-text transition-colors">
              登录
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
