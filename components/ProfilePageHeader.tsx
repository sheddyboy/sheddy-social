"use client";
import Image from "next/image";
import Card from "./Card";
import Preloader from "./Preloader";
import {
  CameraIcon,
  PencilSquareIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";
import Avatar from "./Avatar";
import ProfileTabs from "./ProfileTabs";
import { useContext, useEffect, useState } from "react";
import { AppCtx } from "@/context";
import { useSession } from "next-auth/react";
import {
  changeCoverImage,
  changeNameLocation,
  changeProfileImage,
  followUser,
  unFollowUser,
} from "@/app/actions";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserFollows } from "@/helpers";
import UserProfileHeadingSkeleton from "./Skeletons/UserProfileHeadingSkeleton";

interface ProfilePageHeaderProps {
  userId: string;
}

export default function ProfilePageHeader({ userId }: ProfilePageHeaderProps) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const {
    data: user,
    isSuccess,
    isStale,
    refetch,
  } = useQuery({
    queryKey: ["userFollows", userId],
    queryFn: async () => {
      const { user } = await getUserFollows({ userId });
      return user;
    },
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
  // useEffect(() => {
  //   isStale && refetch();
  // }, [isStale, refetch]);

  const { appState, setAppState } = useContext(AppCtx);
  const { update } = useSession();

  const [editInputs, setEditInputs] = useState({
    name: user?.name ?? "",
    location: user?.place ?? "",
    bio: user?.bio ?? "",
  });
  useEffect(() => {
    setEditInputs({
      name: user?.name ?? "",
      location: user?.place ?? "",
      bio: user?.bio ?? "",
    });
  }, [user]);

  const isEditable = session?.user?.id === user?.id;
  const isFollowingUser = user?.followers.some(
    (follower) => follower.id === session?.user?.id
  );

  const handleCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const loggedInUserId = session?.user?.id;
    if (!loggedInUserId) return console.log("userId not found");
    if (e.target.files && e.target.files[0].size > 3 * 1024 * 1024)
      return alert("Image is larger than 3mb");
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, coverImage: true },
    }));
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.set("file", file);
    formData.set("loggedInUserId", loggedInUserId);
    await changeCoverImage(formData);
    // queryClient.invalidateQueries({ queryKey: ["userFollows",userId] });
    queryClient.refetchQueries({ queryKey: ["userFollows", userId] });
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, coverImage: false },
    }));
  };

  const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const loggedInUserId = session?.user?.id;
    if (!loggedInUserId) return console.log("loggedInUserId not found");
    if (e.target.files && e.target.files[0].size > 3 * 1024 * 1024)
      return alert("Image is larger than 3mb");
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, profileImage: true },
    }));

    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.set("file", file);
    formData.set("loggedInUserId", loggedInUserId);
    const updatedUser = await changeProfileImage(formData);
    if (updatedUser) {
      await update({ image: updatedUser.image });
    }
    // queryClient.invalidateQueries({ queryKey: ["posts"] });
    // queryClient.invalidateQueries({ queryKey: ["userFollows",userId] });
    queryClient.refetchQueries({ queryKey: ["posts"] });
    queryClient.refetchQueries({ queryKey: ["userFollows", userId] });
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, profileImage: false },
    }));
  };

  const handleNameLocationChange = async () => {
    const loggedInUserId = session?.user?.id;
    if (!loggedInUserId) return console.log("loggedInUserId not found");
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, nameLocation: true },
    }));

    const formData = new FormData();
    formData.set("loggedInUserId", loggedInUserId);
    formData.set("name", editInputs.name);
    formData.set("location", editInputs.location);
    const updatedUser = await changeNameLocation(formData);
    if (updatedUser) {
      await update({ name: updatedUser.name });
    }
    // queryClient.invalidateQueries();
    queryClient.refetchQueries({ queryKey: ["posts"] });
    queryClient.refetchQueries({ queryKey: ["userFollows", userId] });

    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, nameLocation: false },
    }));

    setAppState((appState) => ({
      ...appState,
      editMode: { ...appState.editMode, nameLocation: false },
    }));
  };

  const handleFollowUnFollow = async () => {
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, followUnFollow: true },
    }));

    const formData = new FormData();
    if (!user || !session?.user) return;
    formData.set("followingOrUnFollowingUser", session.user.id);
    formData.set("userToBeFollowedOrUnFollowed", user.id);
    if (isFollowingUser) {
      await unFollowUser(formData);
    } else {
      await followUser(formData);
    }
    queryClient.refetchQueries({ queryKey: ["userFollows", userId] });

    // refresh();

    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, followUnFollow: false },
    }));
  };
  return (
    <>
      {!isSuccess ? (
        <UserProfileHeadingSkeleton />
      ) : (
        <Card noPadding>
          <div className="relative rounded-md overflow-hidden">
            <div className="relative w-full h-36">
              <Image
                className="object-cover object-center"
                alt=""
                src={
                  user?.coverImage ??
                  "https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                }
                fill={true}
              />
              {appState.loading.coverImage && <Preloader />}
              {isEditable && (
                <label className="absolute right-3 bottom-3 bg-white py-1 px-2 rounded-md shadow-md shadow-black flex gap-1 items-center cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImage}
                    disabled={appState.loading.coverImage}
                  />
                  <CameraIcon className="w-5 h-5" />
                </label>
              )}
            </div>
            <div className="absolute top-24 left-4">
              <Avatar
                size="big"
                image={user?.image}
                userId={user?.id}
                isEditable={isEditable}
                preloader={appState.loading.profileImage}
                handleProfileImage={handleProfileImage}
              />
            </div>
            <div className="p-4 pt-0 md:pt-4 pb-0">
              <div className="ml-24 md:ml-40 flex justify-between h-16">
                <div className="">
                  {appState.editMode.nameLocation ? (
                    <div className="flex flex-col relative">
                      <input
                        type="text"
                        className="border py-2 px-3 rounded-md"
                        placeholder="Name"
                        required
                        disabled={appState.loading.nameLocation}
                        value={editInputs.name}
                        onChange={(e) => {
                          setEditInputs((editInputs) => ({
                            ...editInputs,
                            name: e.target.value,
                          }));
                        }}
                        autoFocus
                      />
                      <input
                        type="text"
                        className="border py-2 px-3 rounded-md mt-1"
                        disabled={appState.loading.nameLocation}
                        placeholder="Location"
                        onChange={(e) => {
                          setEditInputs((editInputs) => ({
                            ...editInputs,
                            location: e.target.value,
                          }));
                        }}
                        value={editInputs.location}
                      />
                      {appState.loading.nameLocation && <Preloader />}
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold">{user?.name}</h1>
                      <div className="text-gray-500 leading-4">
                        {user?.place}
                      </div>
                    </>
                  )}
                </div>
                <div className="">
                  {isEditable ? (
                    <div className="flex flex-col gap-2">
                      {!appState.editMode.nameLocation && (
                        <button
                          onClick={() => {
                            setAppState((appState) => ({
                              ...appState,
                              editMode: {
                                ...appState.editMode,
                                nameLocation: true,
                              },
                            }));
                          }}
                          className="flex gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                        >
                          <PencilSquareIcon className="w-6 h-6" />
                        </button>
                      )}
                      {appState.editMode.nameLocation && (
                        <button
                          onClick={handleNameLocationChange}
                          className=" gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                        >
                          Save Profile
                        </button>
                      )}
                      {appState.editMode.nameLocation && (
                        <button
                          onClick={() => {
                            setAppState((appState) => ({
                              ...appState,
                              editMode: {
                                ...appState.editMode,
                                nameLocation: false,
                              },
                            }));
                          }}
                          className=" gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  ) : isFollowingUser ? (
                    <button
                      onClick={handleFollowUnFollow}
                      className="flex gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                    >
                      UnFollow
                      <UserMinusIcon className="w-6 h-6" />
                    </button>
                  ) : (
                    <button
                      onClick={handleFollowUnFollow}
                      className="flex gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                    >
                      Follow
                      <UserPlusIcon className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
              <ProfileTabs />
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
