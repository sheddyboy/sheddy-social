import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import ProfilePageContent from "@/components/ProfilePageContent";
import ProfilePageHeader from "@/components/ProfilePageHeader";
import prisma from "@/prisma";
import { notFound } from "next/navigation";

interface ProfileProps {
  params: { id: string };
}

export default async function Profile({ params }: ProfileProps) {
  // const session = await getAuthSession();
  const user = await prisma.user.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  // if (!session) return;
  if (!user) return notFound();

  return (
    <>
      <ProfilePageHeader userId={params.id} />
      <ProfilePageContent userId={params.id} />
    </>
  );
}
