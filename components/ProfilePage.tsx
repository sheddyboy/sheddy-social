"use client";
import Image from "next/image";
import Card from "./Card";
import FriendInfo from "./FriendInfo";
import { useState } from "react";
import { Comments, Post, User } from "@prisma/client";
import Avatar from "./Avatar";
import PostCard from "./PostCard";
import { Session } from "next-auth";
import {
  changeCoverImage,
  changeNameLocation,
  changeProfileImage,
  updateBio,
} from "@/app/actions";
import Preloader from "./Preloader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface ProfilePageProps {
  session: Session | null;
  user:
    | (User & {
        post: (Post & {
          likes: {
            id: number;
            userId: string;
          }[];
          savedPosts: {
            userId: string;
            id: number;
          }[];
          comments: (Comments & {
            user: {
              name: string | null;
              image: string | null;
            };
          })[];
        })[];
      })
    | null;
}
type tabs = "isPosts" | "isAbout" | "isFriends" | "isPhotos";

export default function ProfilePage({ user, session }: ProfilePageProps) {
  const { data, update } = useSession();
  console.log("data1", data);
  const { refresh } = useRouter();

  const [tabs, setTabs] = useState({
    isPosts: true,
    isAbout: false,
    isFriends: false,
    isPhotos: false,
  });
  const [editInputs, setEditInputs] = useState({
    name: user?.name ?? "",
    location: user?.place ?? "",
    bio: user?.bio ?? "",
  });
  const [loading, setLoading] = useState({
    coverImage: false,
    profileImage: false,
    nameLocation: false,
    bio: false,
  });
  const [editMode, setEditMode] = useState({ nameLocation: false, bio: false });
  const { isAbout, isFriends, isPhotos, isPosts } = tabs;
  const toggleTab = (tab: tabs) => {
    let key: tabs;
    const dummyTabs = { ...tabs };
    for (key in dummyTabs) {
      key === tab ? (dummyTabs[key] = true) : (dummyTabs[key] = false);
    }
    setTabs(dummyTabs);
  };
  const tabClasses =
    "flex gap-1 px-4 py-1 items-center border-b-4 border-b-white";
  const activeTabClasses =
    "flex gap-1 px-4 py-1 items-center border-socialBlue border-b-4  font-bold text-socialBlue";

  const isEditable = session?.user?.id === user?.id;

  const handleCoverImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size > 3 * 1024 * 1024)
      return alert("Image is larger than 3mb");
    setLoading((loading) => ({ ...loading, coverImage: true }));
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.set("file", file);
    await changeCoverImage(formData);
    setLoading((loading) => ({ ...loading, coverImage: false }));
  };

  const handleProfileImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0].size > 3 * 1024 * 1024)
      return alert("Image is larger than 3mb");
    setLoading((loading) => ({ ...loading, profileImage: true }));
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.set("file", file);
    const updatedUser = await changeProfileImage(formData);
    if (updatedUser) {
      const newSession = await update({ image: updatedUser.image });
      console.log("newSession", newSession);
    }
    setLoading((loading) => ({ ...loading, profileImage: false }));
  };

  const handleNameLocationChange = async () => {
    setLoading((loading) => ({ ...loading, nameLocation: true }));
    const formData = new FormData();
    formData.set("name", editInputs.name);
    formData.set("location", editInputs.location);
    const updatedUser = await changeNameLocation(formData);
    if (updatedUser) {
      const newSession = await update({ name: updatedUser.name });
      console.log("New Session", newSession);
    }
    refresh();
    setLoading((loading) => ({ ...loading, nameLocation: false }));
    setEditMode((editMode) => ({ ...editMode, nameLocation: false }));
  };
  const handleBioSave = async () => {
    setLoading((loading) => ({ ...loading, bio: true }));
    const formData = new FormData();
    formData.set("bio", editInputs.bio);
    const updatedUser = await updateBio(formData);
    refresh();
    setLoading((loading) => ({ ...loading, bio: false }));
    setEditMode((editMode) => ({ ...editMode, bio: false }));
  };
  return (
    <>
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
            {loading.coverImage && <Preloader />}
            {isEditable && (
              <label className="absolute right-3 bottom-3 bg-white py-1 px-4 rounded-md shadow-md shadow-black flex gap-1 items-center cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverImage}
                  disabled={loading.coverImage}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                  />
                </svg>
                Change Cover
              </label>
            )}
          </div>
          <div className="absolute top-24 left-4">
            <Avatar
              size="big"
              image={user?.image}
              userId={user?.id}
              isEditable={isEditable}
              preloader={loading.profileImage}
              handleProfileImage={handleProfileImage}
            />
          </div>
          <div className="p-4 pt-0 md:pt-4 pb-0">
            <div className="ml-24 md:ml-40 flex justify-between h-16">
              <div className="">
                {editMode.nameLocation ? (
                  <div className="flex flex-col relative">
                    <input
                      type="text"
                      className="border py-2 px-3 rounded-md"
                      disabled={loading.nameLocation}
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
                      disabled={loading.nameLocation}
                      onChange={(e) => {
                        setEditInputs((editInputs) => ({
                          ...editInputs,
                          location: e.target.value,
                        }));
                      }}
                      value={editInputs.location}
                    />
                    {loading.nameLocation && <Preloader />}
                  </div>
                ) : (
                  <>
                    <h1 className="text-3xl font-bold">{user?.name}</h1>
                    <div className="text-gray-500 leading-4">{user?.place}</div>
                  </>
                )}
              </div>
              <div className="">
                {isEditable && (
                  <div className="flex flex-col gap-2">
                    {!editMode.nameLocation && (
                      <button
                        onClick={() => {
                          setEditMode((editMode) => ({
                            ...editMode,
                            nameLocation: true,
                          }));
                        }}
                        className="flex gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                          />
                        </svg>
                        Edit Profile
                      </button>
                    )}
                    {editMode.nameLocation && (
                      <button
                        onClick={handleNameLocationChange}
                        className=" gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                      >
                        Save Profile
                      </button>
                    )}
                    {editMode.nameLocation && (
                      <button
                        onClick={() => {
                          setEditMode((editMode) => ({
                            ...editMode,
                            nameLocation: false,
                          }));
                        }}
                        className=" gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4 md:mt-10 flex gap-0">
              <button
                className={isPosts ? activeTabClasses : tabClasses}
                onClick={() => {
                  toggleTab("isPosts");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                  />
                </svg>
                <span className="hidden sm:block">Posts</span>
              </button>
              <button
                className={isAbout ? activeTabClasses : tabClasses}
                onClick={() => {
                  toggleTab("isAbout");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                  />
                </svg>
                <span className="hidden sm:block">About</span>
              </button>
              <button
                className={isFriends ? activeTabClasses : tabClasses}
                onClick={() => {
                  toggleTab("isFriends");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                  />
                </svg>
                <span className="hidden sm:block">Friends</span>
              </button>
              {/* <button
                className={isPhotos ? activeTabClasses : tabClasses}
                onClick={() => {
                  toggleTab("isPhotos");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
                <span className="hidden sm:block">Photos</span>
              </button> */}
            </div>
          </div>
        </div>
      </Card>
      {isPosts &&
        user?.post
          .map((post) => (
            <PostCard
              session={session}
              userImage={user.image}
              userName={user.name}
              post={post}
              key={post.id}
            />
          ))
          .reverse()}
      {isAbout && (
        <div>
          <Card>
            <div className="flex justify-between items-center mb-4 h-16 ">
              <h2 className="text-3xl">About me</h2>
              {isEditable && (
                <div className="flex flex-col gap-2">
                  {editMode.bio ? (
                    <button
                      onClick={handleBioSave}
                      className=" gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                    >
                      Save Bio
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditMode((editMode) => ({
                          ...editMode,
                          bio: !editMode.bio,
                        }));
                      }}
                      className="flex gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        />
                      </svg>
                      Edit Bio
                    </button>
                  )}

                  {editMode.bio && (
                    <button
                      onClick={() => {
                        setEditMode((editMode) => ({
                          ...editMode,
                          bio: false,
                        }));
                      }}
                      className=" gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                    >
                      Cancel
                    </button>
                  )}
                </div>
              )}
            </div>
            {editMode.bio ? (
              <textarea
                className="h-36 w-full resize-none border py-2 px-3 rounded-md"
                placeholder="About Me"
                value={editInputs.bio}
                onChange={(e) => {
                  setEditInputs((editInputs) => ({
                    ...editInputs,
                    bio: e.target.value,
                  }));
                }}
              />
            ) : (
              <p className="mb-2 text-sm">{user?.bio}</p>
            )}
          </Card>
        </div>
      )}
      {isFriends && (
        <div>
          <Card>
            <h2 className="text-3xl mb-2">Friends</h2>
            <div className="">
              <div className="border-b p-4 -mx-4 border-b-gray-100">
                <FriendInfo />
              </div>
              <div className="border-b p-4 -mx-4 border-b-gray-100">
                <FriendInfo />
              </div>
              <div className="border-b p-4 -mx-4 border-b-gray-100">
                <FriendInfo />
              </div>
              <div className="border-b p-4 -mx-4 border-b-gray-100">
                <FriendInfo />
              </div>
              <div className="border-b p-4 -mx-4 border-b-gray-100">
                <FriendInfo />
              </div>
              <div className="border-b p-4 -mx-4 border-b-gray-100">
                <FriendInfo />
              </div>
              <div className="border-b p-4 -mx-4 border-b-gray-100">
                <FriendInfo />
              </div>
            </div>
          </Card>
        </div>
      )}
      {isPhotos && (
        <div>
          <Card>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative h-48 rounded-md overflow-hidden">
                <Image
                  className="object-cover object-center"
                  alt=""
                  src="https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  fill
                />
              </div>
              <div className="relative h-48 rounded-md overflow-hidden">
                <Image
                  className="object-cover object-center"
                  alt=""
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                  fill
                />
              </div>
              <div className="relative h-48 rounded-md overflow-hidden">
                <Image
                  className="object-cover object-center"
                  alt=""
                  src="https://images.unsplash.com/photo-1533105079780-92b9be482077?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
                  fill
                />
              </div>
              <div className="relative h-48 rounded-md overflow-hidden">
                <Image
                  className="object-cover object-center"
                  alt=""
                  src="https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80"
                  fill
                />
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
