"use client";
import Card from "./Card";
import Avatar from "./Avatar";
import { useEffect, useRef, useState } from "react";
import { postContent } from "@/app/actions";
import emojiData from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import Dropzone, { NewFile } from "./Dropzone";
import { FaceSmileIcon, PhotoIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";
import { Skeleton } from "./ui/Skeleton";
import { useQueryClient } from "@tanstack/react-query";
import Preloader from "./Preloader";
import { cn } from "@/lib/utils";

interface PostFormCardProps {}

export default function PostFormCard({}: PostFormCardProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [emoji, setEmoji] = useState(false);

  const elementRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        elementRef.current &&
        !elementRef.current.contains(event.target as Node) &&
        !menuButtonRef.current?.contains(event.target as Node)
      ) {
        setEmoji(false);
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<NewFile[] | null>(null);

  const handleSubmit = async (data: FormData) => {
    const userId = session?.user?.id;
    if (!userId) return console.log("userId not found");
    data.set("userId", userId);
    setLoading(true);
    if (files) {
      data.delete("photos");
      files.forEach((file) => {
        data.append("photos", file);
      });
    }
    await postContent(data);
    queryClient.invalidateQueries({ queryKey: ["posts"] });

    formRef.current?.reset();
    setFiles(null);
    setLoading(false);
  };

  return (
    <>
      <Card>
        <form action={handleSubmit} ref={formRef}>
          <div className="flex gap-2 relative">
            {loading && <Preloader />}
            {session ? (
              <Avatar image={session.user?.image} userId={session.user?.id} />
            ) : (
              <Skeleton className="w-12 h-12 rounded-full" />
            )}
            {session ? (
              <input
                ref={inputRef}
                type="text"
                required
                name="content"
                className="grow p-3 resize-none h-14"
                disabled={loading}
                placeholder={`How are you feeling today ${session.user?.name}`}
              />
            ) : (
              <div className="grow h-14 flex items-center">
                <Skeleton className="h-2 w-[50%]" />
              </div>
            )}
          </div>
          <Dropzone
            dropZoneRef={dropZoneRef}
            setFiles={setFiles}
            files={files}
          />
          <div className="flex gap-5 items-center mt-2 relative">
            {emoji && (
              <div className="absolute z-[1] top-11 left-0" ref={elementRef}>
                <Picker
                  theme="light"
                  data={emojiData}
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
                <PhotoIcon className="w-6 h-6" />

                <span className="hidden md:block">Photos</span>
              </button>
            </div>
            <div className="">
              <button
                ref={menuButtonRef}
                className="flex gap-1"
                type="button"
                onClick={() => {
                  setEmoji((prev) => !prev);
                }}
              >
                <FaceSmileIcon className="w-6 h-6" />

                <span className="hidden md:block">Mood</span>
              </button>
            </div>
            <div className="ml-auto">
              <button
                disabled={loading}
                // className={"bg-socialBlue text-white px-6 py-1 rounded-md "}
                className={cn(
                  "bg-socialBlue text-white px-6 py-1 rounded-md",
                  loading && "opacity-50"
                )}
              >
                Share
              </button>
            </div>
          </div>
        </form>
      </Card>
    </>
  );
}
