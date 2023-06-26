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
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json("userId required", { status: 400 });
  }

  const userSavedPosts = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      savedPosts: {
        include: {
          author: { select: { name: true, image: true } },
          comments: {
            include: { user: { select: { name: true, image: true } } },
          },
          likes: { select: { id: true } },
          savedBy: { select: { id: true } },
        },
        cursor,
        take: limit,
        skip,
        orderBy: { id: "desc" },
      },
    },
  });

  return NextResponse.json(userSavedPosts?.savedPosts);
}
