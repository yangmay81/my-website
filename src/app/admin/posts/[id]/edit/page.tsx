import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostEditor from "@/components/PostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { medias: true },
  });

  if (!post) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">编辑文章</h1>
      <div className="bg-white border border-border rounded-lg p-6">
        <PostEditor post={post} />
      </div>
    </div>
  );
}
