import { AppState } from "@/context";
import { getUserSavedPosts } from "@/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

interface useGetSavedPostsProps {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  appState: AppState;
}

export default function useGetSavedPosts({
  setAppState,
  appState,
}: useGetSavedPostsProps) {
  const { data: session } = useSession();
  const { data, fetchNextPage, isFetchingNextPage, isFetched, isFetching } =
    useInfiniteQuery({
      queryKey: ["posts", "savedPosts"],
      queryFn: async ({ pageParam = undefined }) => {
        const { userSavedPosts } = await getUserSavedPosts({
          cursor: pageParam,
          limit: 10,
          userId: session?.user?.id,
        });
        return userSavedPosts;
      },
      getNextPageParam: (lastPage, allPages) =>
        lastPage[lastPage.length - 1]?.id,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      enabled: !!session?.user?.id,
    });
  useEffect(() => {
    setAppState((prev) => ({
      ...prev,
      savedPosts: { ...prev.savedPosts, posts: data?.pages.flat() },
    }));
  }, [data?.pages, setAppState]);

  useEffect(() => {
    appState.savedPosts.isLastPostInView && fetchNextPage();
  }, [fetchNextPage, appState.savedPosts.isLastPostInView]);
  useEffect(() => {
    setAppState((prev) => ({
      ...prev,
      savedPosts: { ...prev.savedPosts, isFetchingNextPage },
    }));
  }, [setAppState, isFetchingNextPage]);
  console.log("isFetched", isFetched);
  console.log("isFetching", isFetching);
}
