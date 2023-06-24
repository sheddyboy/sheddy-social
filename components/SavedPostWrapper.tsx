"use client";
import PostCard from "./PostCard";
import type { Session } from "next-auth";
import { getUserSavedPosts } from "@/helpers";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import PostSkeletonWrapper from "./Skeletons/PostSkeletonWrapper";

interface SavedPostsWrapperProps {
  session: Session;
}

export default function SavedPostsWrapper({ session }: SavedPostsWrapperProps) {
  const { ref, inView } = useInView();
  const { data, fetchNextPage, isFetchingNextPage, isStale, refetch } =
    useInfiniteQuery({
      queryKey: ["posts", "savedPosts"],
      queryFn: async ({ pageParam = undefined }) => {
        const { userSavedPosts } = await getUserSavedPosts({
          cursor: pageParam,
          limit: 5,
          userId: session.user?.id,
        });
        return userSavedPosts;
      },
      getNextPageParam: (lastPage, allPages) =>
        lastPage[lastPage.length - 1]?.id,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    });
  useEffect(() => {
    fetchNextPage();
  }, [fetchNextPage, inView]);
  useEffect(() => {
    isStale && refetch();
  }, [isStale, refetch]);
  return (
    <>
      {data?.pages
        .flatMap((page) => page)
        ?.map((savedPost, index, arr) => {
          if (arr.length - 1 === index) {
            return (
              <div key={savedPost.id} ref={ref}>
                <PostCard
                  key={savedPost.id}
                  session={session}
                  post={savedPost}
                />
              </div>
            );
          } else {
            return (
              <PostCard key={savedPost.id} session={session} post={savedPost} />
            );
          }
        })}
      {(isFetchingNextPage || !data) && (
        <PostSkeletonWrapper numberOfPosts={5} />
      )}
    </>
  );
}
