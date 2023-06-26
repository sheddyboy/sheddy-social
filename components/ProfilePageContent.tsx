"use client";
import ProfileAboutTab from "./ProfileAboutTab";
import ProfilePostTabs from "./ProfilePostTabs";
import type { Session } from "next-auth";
import ProfileFollowersTab from "./ProfileFollowersTab";
import ProfileFollowingTab from "./ProfileFollowingTab";
import { useQuery } from "@tanstack/react-query";
import { getUserDetails } from "@/helpers";
import PostSkeletonWrapper from "./Skeletons/PostSkeletonWrapper";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePageContent({ userId }: { userId: string }) {
  const { data: session } = useSession();

  const {
    data: user,
    isSuccess,
    isStale,
    refetch,
  } = useQuery({
    queryKey: ["posts", "userDetails", userId],
    queryFn: async () => {
      const { user } = await getUserDetails({ userId });
      return user;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  // useEffect(() => {
  //   isStale && refetch();
  // }, [isStale, refetch]);

  const isEditable = session?.user?.id === user?.id;

  return (
    <>
      {!isSuccess ? (
        <PostSkeletonWrapper numberOfPosts={10} />
      ) : (
        <>
          <ProfilePostTabs session={session} posts={user.myPosts} />
          <ProfileAboutTab isEditable={isEditable} userBio={user.bio ?? ""} />
          <ProfileFollowersTab followers={user.followers} />
          <ProfileFollowingTab followings={user.following} />
        </>
      )}
    </>
  );
}
