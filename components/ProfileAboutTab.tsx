"use client";
import { useContext, useState } from "react";
import Card from "./Card";
import { AppCtx } from "@/context";
import { updateBio } from "@/app/actions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";

interface ProfileAboutTabProps {
  isEditable: boolean;
  userBio: string;
}

export default function ProfileAboutTab({
  isEditable,
  userBio,
}: ProfileAboutTabProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  const { appState, setAppState } = useContext(AppCtx);
  const [userProfileBio, setUserProfileBio] = useState(userBio);

  const handleBioSave = async () => {
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, bio: true },
    }));

    const formData = new FormData();
    if (!session?.user?.id) return console.log("userId required");
    formData.set("bio", userProfileBio);
    formData.set("loggedInUserId", session?.user?.id);
    await updateBio(formData);
    queryClient.refetchQueries({
      queryKey: ["posts", "userDetails", session.user.id],
    });
    // refresh();
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, bio: false },
    }));

    setAppState((appState) => ({
      ...appState,
      editMode: { ...appState.editMode, bio: false },
    }));
  };
  if (!appState.tabs.isAbout) return;

  return (
    <div>
      <Card>
        <div className="flex justify-between items-center mb-4 h-16 ">
          <h2 className="text-3xl">About me</h2>
          {isEditable && (
            <div className="flex flex-col gap-2">
              {appState.editMode.bio ? (
                <button
                  onClick={handleBioSave}
                  className=" gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                >
                  Save Bio
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAppState((appState) => ({
                      ...appState,
                      editMode: {
                        ...appState.editMode,
                        bio: !appState.editMode.bio,
                      },
                    }));
                  }}
                  className="flex gap-1 bg-white rounded-md shadow-sm shadow-gray-500 py-1 px-2 "
                >
                  <PencilSquareIcon className="w-6 h-6" />
                  Edit Bio
                </button>
              )}

              {appState.editMode.bio && (
                <button
                  onClick={() => {
                    setAppState((appState) => ({
                      ...appState,
                      editMode: {
                        ...appState.editMode,
                        bio: false,
                      },
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
        {appState.editMode.bio ? (
          <textarea
            className="h-36 w-full resize-none border py-2 px-3 rounded-md"
            placeholder="About Me"
            value={userProfileBio}
            onChange={(e) => {
              setUserProfileBio(e.target.value);
            }}
          />
        ) : (
          <p className="mb-2 text-sm">{userProfileBio}</p>
        )}
      </Card>
    </div>
  );
}
