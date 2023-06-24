"use client";

import { AppCtx } from "@/context";
import {
  DocumentTextIcon,
  InformationCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useContext } from "react";

interface ProfileTabsProps {}

type tabs = "isPosts" | "isAbout" | "isFollowing" | "isFollowers" | "isPhotos";

const tabClasses =
  "flex gap-1 px-4 py-1 items-center border-b-4 border-b-white";
const activeTabClasses =
  "flex gap-1 px-4 py-1 items-center border-socialBlue border-b-4  font-bold text-socialBlue";

export default function ProfileTabs({}: ProfileTabsProps) {
  const { appState, setAppState } = useContext(AppCtx);
  const { isAbout, isFollowing, isFollowers, isPosts } = appState.tabs;

  const toggleTab = (tab: tabs) => {
    let key: tabs;
    const dummyTabs = { ...appState.tabs };
    for (key in dummyTabs) {
      key === tab ? (dummyTabs[key] = true) : (dummyTabs[key] = false);
    }
    setAppState((appState) => ({ ...appState, tabs: dummyTabs }));
  };
  return (
    <div className="mt-4 md:mt-10 flex gap-0">
      <button
        className={isPosts ? activeTabClasses : tabClasses}
        onClick={() => {
          toggleTab("isPosts");
        }}
      >
        <DocumentTextIcon className="w-6 h-6" />

        <span className="hidden sm:block">Posts</span>
      </button>
      <button
        className={isAbout ? activeTabClasses : tabClasses}
        onClick={() => {
          toggleTab("isAbout");
        }}
      >
        <InformationCircleIcon className="w-6 h-6" />

        <span className="hidden sm:block">About</span>
      </button>
      <button
        className={isFollowing ? activeTabClasses : tabClasses}
        onClick={() => {
          toggleTab("isFollowing");
        }}
      >
        <UserGroupIcon className="w-6 h-6" />

        <span className="hidden sm:block">Following</span>
      </button>
      <button
        className={isFollowers ? activeTabClasses : tabClasses}
        onClick={() => {
          toggleTab("isFollowers");
        }}
      >
        <UserGroupIcon className="w-6 h-6" />

        <span className="hidden sm:block">Followers</span>
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
  );
}
