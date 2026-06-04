import Link from "next/link";

export default function ShareNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="text-center">
        <p className="text-text-muted text-lg mb-4">
          内容不存在或链接已失效
        </p>
        <Link
          href="/"
          className="text-primary hover:text-primary-dark underline"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
