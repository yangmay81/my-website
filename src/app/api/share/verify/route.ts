import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { postId, password } = await req.json();

  if (!postId || !password) {
    return NextResponse.json({ error: "参数不完整" }, { status: 400 });
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { medias: true },
  });

  if (!post || post.visibility !== "PASSWORD") {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  if (post.password !== password) {
    return NextResponse.json({ error: "密码错误" }, { status: 403 });
  }

  return NextResponse.json(post);
}
