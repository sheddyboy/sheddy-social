"use client";
import PostCard from "./PostCard";
import type { Session } from "next-auth";
import { getUserSavedPosts } from "@/helpers";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import PostSkeletonWrapper from "./Skeletons/PostSkeletonWrapper";
import { AppCtx } from "@/context";

interface SavedPostsWrapperProps {
  session: Session;
}

export default function SavedPostsWrapper({ session }: SavedPostsWrapperProps) {
  const { appState, setAppState } = useContext(AppCtx);
  const { ref, inView } = useInView();
  // const { data, fetchNextPage, isFetchingNextPage, isStale, refetch } =
  //   useInfiniteQuery({
  //     queryKey: ["posts", "savedPosts"],
  //     queryFn: async ({ pageParam = undefined }) => {
  //       const { userSavedPosts } = await getUserSavedPosts({
  //         cursor: pageParam,
  //         limit: 10,
  //         userId: session.user?.id,
  //       });
  //       return userSavedPosts;
  //     },
  //     getNextPageParam: (lastPage, allPages) =>
  //       lastPage[lastPage.length - 1]?.id,
  //     refetchOnMount: false,
  //     refetchOnWindowFocus: false,
  //     staleTime: Infinity,
  //   });
  useEffect(() => {
    // fetchNextPage();
    setAppState((prev) => ({
      ...prev,
      savedPosts: { ...prev.savedPosts, isLastPostInView: inView },
    }));
  }, [inView, setAppState]);
  // useEffect(() => {
  //   isStale && refetch();
  // }, [isStale, refetch]);
  // useEffect(() => {
  //   !appState.savedPosts &&
  //     setAppState((prev) => ({
  //       ...prev,
  //       savedPosts: { ...prev.savedPosts, posts: data?.pages.flat() },
  //     }));
  // }, [appState.savedPosts, data, setAppState]);
  return (
    <>
      {appState.savedPosts.posts &&
        appState.savedPosts.posts.map((savedPost, index, arr) => {
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
      {(appState.savedPosts.isFetchingNextPage ||
        !appState.savedPosts.posts) && (
        <PostSkeletonWrapper numberOfPosts={5} />
      )}
    </>
  );
}
