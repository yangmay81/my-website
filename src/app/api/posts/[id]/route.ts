import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { v4 as uuidv4 } from "uuid";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { medias: true },
  });

  if (!post) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, content, visibility, password, medias } = body;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  const shareToken =
    visibility === "LINK"
      ? existing.shareToken || uuidv4().replace(/-/g, "").slice(0, 12)
      : null;

  // 如果有新媒体，先删除旧的再创建新的
  const post = await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      visibility: visibility || "PUBLIC",
      password: visibility === "PASSWORD" ? password : null,
      shareToken,
      medias: medias
        ? {
            deleteMany: {},
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

  return NextResponse.json(post);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  await prisma.post.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
