export default function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-white py-6">
      <div className="max-w-5xl mx-auto px-4 text-center text-sm text-text-muted">
        &copy; {new Date().getFullYear()} 我的个人网站. All rights reserved.
      </div>
    </footer>
  );
}
