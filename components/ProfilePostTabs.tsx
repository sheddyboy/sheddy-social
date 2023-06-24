"use client";

import { Comments, Post, User } from "@prisma/client";
import type { Session } from "next-auth";
import PostCard from "./PostCard";
import { useContext } from "react";
import { AppCtx } from "@/context";

interface ProfilePostTabsProps {
  session: Session | null;
  posts: (Post & {
    comments: (Comments & {
      user: {
        name: string | null;
        image: string | null;
      };
    })[];
    author: {
      name: string | null;
      image: string | null;
    };
    likes: {
      id: string;
    }[];
    savedBy: {
      id: string;
    }[];
  })[];
}

export default function ProfilePostTabs({
  session,
  posts,
}: ProfilePostTabsProps) {
  const { appState } = useContext(AppCtx);
  if (!appState.tabs.isPosts) return;
  return (
    <>
      {posts
        .map((post) => <PostCard session={session} post={post} key={post.id} />)
        .reverse()}
    </>
  );
}
