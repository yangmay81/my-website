import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET() {
  const session = await auth();
  const posts = await prisma.post.findMany({
    where: session
      ? undefined // 登录用户可以看到所有文章
      : { visibility: "PUBLIC" },
    include: { medias: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, visibility, password, medias } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "标题和内容不能为空" }, { status: 400 });
  }

  const shareToken =
    visibility === "LINK" ? uuidv4().replace(/-/g, "").slice(0, 12) : null;

  const post = await prisma.post.create({
    data: {
      title,
      content,
      visibility: visibility || "PUBLIC",
      password: visibility === "PASSWORD" ? password : null,
      shareToken,
      medias: medias?.length
        ? {
            create: medias.map((m: { url: string; type: string; filename: string }) => ({
              url: m.url,
              type: m.type,
              filename: m.filename,
            })),
          }
        : undefined,
    },
    include: { medias: true },
  });

  return NextResponse.json(post, { status: 201 });
}
