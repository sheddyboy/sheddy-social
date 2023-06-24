import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const posts = await prisma.post.findMany({
    include: {
      author: { select: { name: true, image: true } },
      comments: {
        include: { user: { select: { name: true, image: true } } },
      },
      likes: { select: { id: true } },
      savedBy: { select: { id: true } },
    },
    orderBy: { id: "desc" },
  });
  return NextResponse.json(posts);
}
