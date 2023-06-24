import prisma from "@/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  if (!userId) return NextResponse.json("UserId is required");
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      following: { select: { id: true } },
      followers: { select: { id: true } },
    },
  });

  return NextResponse.json(user);
}
