import PostFormCard from "@/components/PostFormCard";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import prisma from "@/prisma";
import AllPosts from "@/components/AllPosts";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const posts = await prisma.post.findMany({
    include: {
      user: { select: { image: true, name: true } },
      likes: { select: { userId: true, id: true } },
      savedPosts: { select: { userId: true, id: true } },
      comments: { include: { user: { select: { name: true, image: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });
  // console.log("posts", posts);
  return (
    <>
      <PostFormCard session={session} />
      <AllPosts posts={posts} session={session} />
    </>
  );
}
