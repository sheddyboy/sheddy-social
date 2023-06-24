"use client";
import Link from "next/link";
import Card from "./Card";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  HomeIcon,
  BookmarkIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface NavigationCardProps {}

export default function NavigationCard({}: NavigationCardProps) {
  const pathName = usePathname();
  const active =
    "text-sm md:text-md flex md:gap-1 md:gap-3 py-3 my-1 bg-socialBlue text-white md:-mx-8 px-6 md:px-8 rounded-md shadow-md shadow-gray-300 transition-all";
  const nonActive =
    "cursor-pointer text-sm md:text-md flex md:gap-3 py-2 my-2 hover:bg-blue-500 hover:bg-opacity-20 hover:scale-110 hover:shadow-md shadow-gray-300 md:-mx-4 px-6 md:px-4 rounded-md transition-all";
  return (
    <Card noPadding>
      <div className="px-4 py-2 flex md:block justify-between shadow-md shadow-gray-500 md:shadow-none">
        <h2 className="text-gray-400 mb-3 hidden md:block">Navigation</h2>
        <Link href="/" className={pathName === "/" ? active : nonActive}>
          <HomeIcon className="w-6 h-6" />

          <span className="hidden md:block">Home</span>
        </Link>
        <Link
          href="/saved"
          className={pathName === "/saved" ? active : nonActive}
        >
          <BookmarkIcon className="w-6 h-6" />
          <span className="hidden md:block"> Saved Posts</span>
        </Link>
        {/* <Link
          href="/notifications"
          className={pathName === "/notifications" ? active : nonActive}
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
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          <span className="hidden md:block"> Notifications</span>
        </Link> */}
        <div
          className={nonActive}
          onClick={() => {
            signOut();
          }}
        >
          <button
          // className="w-full -my-2"
          >
            <span className="flex md:gap-3 ">
              <ArrowLeftOnRectangleIcon className="w-6 h-6" />
              <span className="hidden md:block"> Logout</span>
            </span>
          </button>
        </div>
      </div>
    </Card>
  );
}
