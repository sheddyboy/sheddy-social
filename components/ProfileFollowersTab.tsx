"use client";
import { AppCtx } from "@/context";
import { useContext } from "react";
import Card from "./Card";
import FriendInfo from "./FriendInfo";

interface ProfileFollowersTabProps {
  followers: {
    name: string | null;
    image: string | null;
    id: string;
  }[];
}

export default function ProfileFollowersTab({
  followers,
}: ProfileFollowersTabProps) {
  const { appState } = useContext(AppCtx);
  if (!appState.tabs.isFollowers) return;
  return (
    <Card>
      <h2 className="text-3xl mb-2 ">Followers</h2>
      <div className="flex flex-col gap-2">
        {followers.map((follower) => (
          <FriendInfo
            key={follower.id}
            image={follower.image}
            name={follower.name}
            userId={follower.id}
          />
        ))}
      </div>
    </Card>
  );
}
