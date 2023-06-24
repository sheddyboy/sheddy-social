import { getAuthSession } from "@/app/api/auth/[...nextauth]/route";
import SavedPostsWrapper from "@/components/SavedPostWrapper";

interface SavedPostsProps {}

export default async function SavedPosts({}: SavedPostsProps) {
  const session = await getAuthSession();
  if (!session) return;

  return (
    <>
      <h1 className="text-6xl mb-4 text-gray-300">Saved posts</h1>
      <SavedPostsWrapper session={session} />
    </>
  );
}
