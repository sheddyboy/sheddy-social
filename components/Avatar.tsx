import Image from "next/image";
import Link from "next/link";
import Preloader from "./Preloader";
import { CameraIcon } from "@heroicons/react/24/outline";

interface AvatarProps {
  size?: "big" | "small";
  image?: string | null;
  userId?: string;
  isEditable?: boolean;
  preloader?: boolean;
  handleProfileImage?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Avatar({
  size = "small",
  image,
  preloader,
  userId,
  handleProfileImage,
  isEditable = false,
}: AvatarProps) {
  return (
    <div className="relative">
      <Link
        href={`/profile/${userId}`}
        className={`block rounded-full overflow-hidden ${
          size === "big" ? "w-24 h-24 md:w-36 md:h-36" : "w-12 h-12"
        }   relative`}
      >
        <Image
          className="object-cover object-top rounded-full"
          alt=""
          fill={true}
          src={image || "/paw-paw.jpg"}
        />
        {preloader && <Preloader />}
      </Link>
      {isEditable && (
        <label className="absolute bottom-0 right-0 shadow-md shadow-gray-500 p-2 bg-white rounded-full cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleProfileImage}
          />
          <CameraIcon className="w-6 h-6" />
        </label>
      )}
    </div>
  );
}
