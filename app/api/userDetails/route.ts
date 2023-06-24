import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json("userId required");
  }

  const userDetails = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      myPosts: {
        include: {
          author: { select: { name: true, image: true } },
          comments: {
            include: { user: { select: { name: true, image: true } } },
          },
          likes: { select: { id: true } },
          savedBy: { select: { id: true } },
        },
      },
      following: { select: { name: true, image: true, id: true } },
      followers: { select: { name: true, image: true, id: true } },
    },
  });

  return NextResponse.json(userDetails);
}
