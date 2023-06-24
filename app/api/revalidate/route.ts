import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path") || "/";
  const tag = request.nextUrl.searchParams.get("tag");
  revalidatePath(path);
  tag && revalidateTag(tag);
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
