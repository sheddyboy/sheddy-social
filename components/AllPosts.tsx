"use client";
import { getPosts } from "@/helpers";
import { useInfiniteQuery } from "@tanstack/react-query";
import PostCard from "./PostCard";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import PostSkeletonWrapper from "./Skeletons/PostSkeletonWrapper";
import { useSession } from "next-auth/react";

interface AllPostsProps {}

export default function AllPosts({}: AllPostsProps) {
  const { data: session } = useSession();
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
    isStale,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = undefined }) => {
      const { posts } = await getPosts({
        cursor: pageParam,
        limit: 5,
      });
      return posts;
    },
    getNextPageParam: (lastPage, allPages) => lastPage[lastPage.length - 1]?.id,
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
      {isSuccess && session ? (
        <>
          {data.pages
            .flatMap((page) => page)
            ?.map((post, index, arr) => {
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
        </>
      ) : (
        <PostSkeletonWrapper numberOfPosts={5} />
      )}
    </>
  );
}
