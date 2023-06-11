import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ProfilePage from "@/components/ProfilePage";
import prisma from "@/prisma";
import { getServerSession } from "next-auth";

interface ProfileProps {
  params: { id: string };
}

export default async function Profile({ params }: ProfileProps) {
  const session = await getServerSession(authOptions);
  console.log("first", session);

  const user = await prisma.user.findUnique({
    where: { id: params.id },
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
    },
  });

  return (
    <>
      <ProfilePage user={user} session={session} />
    </>
  );
}
