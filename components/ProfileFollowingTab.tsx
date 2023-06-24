"use client";
import { AppCtx } from "@/context";
import { useContext } from "react";
import Card from "./Card";
import Avatar from "./Avatar";
import FriendInfo from "./FriendInfo";

interface ProfileFollowingTabProps {
  followings: {
    name: string | null;
    image: string | null;
    id: string;
  }[];
}

export default function ProfileFollowingTab({
  followings,
}: ProfileFollowingTabProps) {
  const { appState } = useContext(AppCtx);
  if (!appState.tabs.isFollowing) return;
  return (
    <Card>
      <h2 className="text-3xl mb-2 ">Following</h2>
      <div className="flex flex-col gap-2">
        {followings.map((following) => (
          <FriendInfo
            key={following.id}
            image={following.image}
            name={following.name}
            userId={following.id}
          />
        ))}
      </div>
    </Card>
  );
}
