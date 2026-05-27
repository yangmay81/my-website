import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const post = await prisma.post.findFirst({
    where: { shareToken: token, visibility: "LINK" },
    include: { medias: true },
  });

  if (!post) {
    return NextResponse.json({ error: "内容不存在或链接已失效" }, { status: 404 });
  }

  return NextResponse.json(post);
}
