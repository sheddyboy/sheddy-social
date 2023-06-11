import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PostCard from "@/components/PostCard";
import prisma from "@/prisma";
import { getServerSession } from "next-auth/next";

interface SavedPostsProps {}

export default async function SavedPosts({}: SavedPostsProps) {
  const session = await getServerSession(authOptions);
  const savedPosts = await prisma.savedPosts.findMany({
    where: { userId: session?.user?.id },
    include: {
      post: {
        include: {
          likes: { select: { userId: true, id: true } },
          savedPosts: { select: { userId: true, id: true } },
          comments: {
            include: { user: { select: { name: true, image: true } } },
          },
        },
      },
      user: { select: { name: true, image: true } },
    },
  });
  return (
    <>
      <h1 className="text-6xl mb-4 text-gray-300">Saved posts</h1>
      {savedPosts
        .map((savedPost) => (
          <PostCard
            key={savedPost.id}
            session={session}
            post={savedPost.post}
            userImage={savedPost.user.image}
            userName={savedPost.user.name}
          />
        ))
        .reverse()}
    </>
  );
}
