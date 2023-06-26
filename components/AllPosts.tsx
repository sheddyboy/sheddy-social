"use client";
import { getPosts } from "@/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "./PostCard";
import { useInView } from "react-intersection-observer";
import { useContext, useEffect } from "react";
import PostSkeletonWrapper from "./Skeletons/PostSkeletonWrapper";
import { useSession } from "next-auth/react";
import { AppCtx } from "@/context";

interface AllPostsProps {}

export default function AllPosts({}: AllPostsProps) {
  const { appState, setAppState } = useContext(AppCtx);
  const { data: session } = useSession();
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isStale,
    isSuccess,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = undefined }) => {
      const { posts } = await getPosts({
        cursor: pageParam,
        limit: 10,
      });
      return posts;
    },
    getNextPageParam: (lastPage, allPages) => lastPage[lastPage.length - 1]?.id,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  useEffect(() => {
    inView && fetchNextPage();
  }, [fetchNextPage, inView]);
  // useEffect(() => {
  //   isStale && refetch();
  // }, [isStale, refetch]);
  useEffect(() => {
    setAppState((prev) => ({ ...prev, allPosts: data?.pages.flat() }));
  }, [data, setAppState]);

  return (
    <>
      {isSuccess && session ? (
        <div className="relative">
          {appState.allPosts?.map((post, index, arr) => {
            if (arr.length - 1 === index) {
              return (
                <div key={post.id} ref={ref}>
                  <PostCard key={post.id} post={post} session={session} />
                </div>
              );
            } else {
              return <PostCard key={post.id} post={post} session={session} />;
            }
          })}
          {isFetchingNextPage && <PostSkeletonWrapper numberOfPosts={5} />}
        </div>
      ) : (
        <PostSkeletonWrapper numberOfPosts={5} />
      )}
    </>
  );
}
