import PostEditor from "@/components/PostEditor";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">新建文章</h1>
      <div className="bg-white border border-border rounded-lg p-6">
        <PostEditor />
      </div>
    </div>
  );
}
