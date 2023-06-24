"use client";
import { useContext, useState } from "react";
import Card from "./Card";
import { AppCtx } from "@/context";
import { useRouter } from "next/navigation";
import { updateBio } from "@/app/actions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";

interface ProfileAboutTabProps {
  isEditable: boolean;
  userBio: string;
}

export default function ProfileAboutTab({
  isEditable,
  userBio,
}: ProfileAboutTabProps) {
  const { refresh } = useRouter();

  const { appState, setAppState } = useContext(AppCtx);
  const [userProfileBio, setUserProfileBio] = useState(userBio);

  const handleBioSave = async () => {
    setAppState((appState) => ({
      ...appState,
      loading: { ...appState.loading, bio: true },
    }));

    const formData = new FormData();
    formData.set("bio", userProfileBio);
    await updateBio(formData);
    refresh();
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
