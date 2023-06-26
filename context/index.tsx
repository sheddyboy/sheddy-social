"use client";
import useGetSavedPosts from "@/hooks/useGetSavedPosts";
import { MyPost } from "@/types";
import { createContext, useState } from "react";

export type AppState = {
  tabs: {
    isPosts: boolean;
    isAbout: boolean;
    isFollowing: boolean;
    isFollowers: boolean;
    isPhotos: boolean;
  };
  loading: {
    coverImage: boolean;
    profileImage: boolean;
    nameLocation: boolean;
    bio: boolean;
    followUnFollow: boolean;
  };
  editMode: {
    nameLocation: boolean;
    bio: boolean;
  };
  user: {
    name: string;
    id: string;
    image: string | null | undefined;
  };
  allPosts: MyPost[] | undefined;
  savedPosts: {
    posts: MyPost[] | undefined;
    isLastPostInView: boolean;
    isFetchingNextPage: boolean;
  };
};

export const AppCtx = createContext<{
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
}>({
  appState: {
    loading: {
      coverImage: false,
      profileImage: false,
      nameLocation: false,
      bio: false,
      followUnFollow: false,
    },
    tabs: {
      isPosts: true,
      isAbout: false,
      isFollowing: false,
      isFollowers: false,
      isPhotos: false,
    },
    editMode: { nameLocation: false, bio: false },
    user: { image: "", name: "", id: "" },
    allPosts: undefined,
    savedPosts: {
      posts: undefined,
      isLastPostInView: false,
      isFetchingNextPage: false,
    },
  },
  setAppState: () => {},
});

const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [appState, setAppState] = useState<AppState>({
    tabs: {
      isPosts: true,
      isAbout: false,
      isFollowing: false,
      isFollowers: false,
      isPhotos: false,
    },
    loading: {
      coverImage: false,
      profileImage: false,
      nameLocation: false,
      bio: false,
      followUnFollow: false,
    },
    editMode: { nameLocation: false, bio: false },
    user: {
      name: "",
      image: "",
      id: "",
    },
    allPosts: undefined,
    savedPosts: {
      posts: undefined,
      isLastPostInView: false,
      isFetchingNextPage: false,
    },
  });
  useGetSavedPosts({ appState, setAppState });

  return (
    <AppCtx.Provider value={{ appState, setAppState }}>
      {children}
    </AppCtx.Provider>
  );
};

export default AppContextProvider;
