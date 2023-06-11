"use client";
import Card from "./Card";
import Avatar from "./Avatar";
import { useRef, useState } from "react";
import { postContent } from "@/app/actions";
import { Session } from "next-auth";
import Dropzone, { NewFile } from "./Dropzone";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

interface PostFormCardProps {
  session: Session | null;
}

export default function PostFormCard({ session }: PostFormCardProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<NewFile[] | null>(null);
  const [emoji, setEmoji] = useState(false);
  // console.log(session);

  const handleSubmit = async (data: FormData) => {
    if (files) {
      data.delete("photos");
      files.forEach((file) => {
        data.append("photos", file);
      });
    }
    console.log(data.getAll("photos"));
    console.log("loading...");
    await postContent(data);
    console.log("done");

    formRef.current?.reset();
    setFiles(null);
  };

  return (
    <Card>
      <form action={handleSubmit} ref={formRef}>
        <div className="flex gap-2">
          <Avatar image={session?.user?.image} userId={session?.user?.id} />
          <input
            ref={inputRef}
            type="text"
            required
            name="content"
            className="grow p-3 resize-none h-14"
            placeholder={`How are you feeling today ${
              session?.user?.name ?? ""
            }`}
          ></input>
        </div>
        <Dropzone dropZoneRef={dropZoneRef} setFiles={setFiles} files={files} />
        <div className="flex gap-5 items-center mt-2 relative">
          {emoji && (
            <div className="absolute z-[1] top-11 left-0">
              <Picker
                theme="light"
                data={data}
                onEmojiSelect={(e: any) => {
                  if (!inputRef.current) return;
                  inputRef.current.value = inputRef.current.value + e.native;
                }}
              />
            </div>
          )}
          <div className="">
            <button
              className="flex gap-1 cursor-pointer"
              type="button"
              onClick={() => {
                dropZoneRef.current?.click();
              }}
            >
              {/* <input
                type="file"
                className="hidden"
                multiple
                onChange={addPhotos}
              /> */}
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
              <span className="hidden md:block">Photos</span>
            </button>
            {/* <label className="flex gap-1 cursor-pointer">
              <input
                type="file"
                className="hidden"
                multiple
                onChange={addPhotos}
              />
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
              <span className="hidden md:block">Photos</span>
            </label> */}
          </div>
          {/* <div className="">
            <button className="flex gap-1" type="button">
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
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
              <span className="hidden md:block">People</span>
            </button>
          </div>
          <div className="">
            <button className="flex gap-1" type="button">
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
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                />
              </svg>
              <span className="hidden md:block">Check In</span>
            </button>
          </div> */}
          <div className="">
            <button
              className="flex gap-1"
              type="button"
              onClick={() => {
                setEmoji((emoji) => !emoji);
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
                  d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
              <span className="hidden md:block">Mood</span>
            </button>
          </div>
          <div className="ml-auto">
            <button className="bg-socialBlue text-white px-6 py-1 rounded-md">
              Share
            </button>
          </div>
        </div>
      </form>
    </Card>
  );
}
