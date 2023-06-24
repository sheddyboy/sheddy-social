import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const cursor = url.searchParams.get("cursor")
    ? { id: Number(url.searchParams.get("cursor")) }
    : undefined;
  const limit = url.searchParams.get("limit")
    ? Number(url.searchParams.get("limit"))
    : undefined;
  const skip = cursor ? 1 : undefined;
  const where = url.searchParams.get("userId")
    ? { userId: url.searchParams.get("userId")! }
    : undefined;

  const posts = await prisma.post.findMany({
    cursor,
    take: limit,
    skip,
    include: {
      author: { select: { name: true, image: true } },
      comments: {
        include: { user: { select: { name: true, image: true } } },
      },
      likes: { select: { id: true } },
      savedBy: { select: { id: true } },
    },
    orderBy: { id: "desc" },
    where,
  });

  return NextResponse.json(posts);
}
