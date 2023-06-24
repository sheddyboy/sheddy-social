import { MyPost, MyUserDetails, MyUserFollows } from "@/types";
import { User } from "@prisma/client";
import { decode } from "next-auth/jwt";
import { cookies } from "next/dist/client/components/headers";
import axios from "axios";

export const uploadPhotosToCloudinary = (photos: File[]) => {
  const uploadPromises = photos.map(async (photo) => {
    const formData = new FormData();
    formData.set("upload_preset", "eka0ifzm");
    formData.set("file", photo);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url as string;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  });

  const uploadUrls = Promise.all(uploadPromises)
    .then((urls) => {
      return urls;
    })
    .catch((err) => {
      console.error("Upload failed:", err);
      return null;
    });

  return uploadUrls;
};

export const uploadSinglePhotoToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.set("upload_preset", "eka0ifzm");
  formData.set("file", file);

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    const url = data.secure_url as string;
    return url;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const getUserFromCookies = async () => {
  const token = cookies().get("next-auth.session-token")?.value!;
  const user = await decode({ token, secret: process.env.NEXTAUTH_SECRET! });
  return user;
};

export const getAllPosts = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/allPosts`);
  const posts = (await res.json()) as MyPost[];
  return { posts };
};
export const getUsersDetails = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/usersDetails`
  );
  const users = (await res.json()) as User[];
  return { users };
};

export const getPosts = async (params?: {
  cursor?: number;
  limit?: number;
  userId?: string;
}) => {
  const { data: posts } = await axios<MyPost[]>(
    `/api/posts?${params?.cursor && "cursor=" + params.cursor}&${
      params?.limit && "limit=" + params.limit
    }&${params?.userId && "userId=" + params.userId}`
  );
  return { posts };
};
export const getUserPosts = async (params?: {
  cursor?: number;
  limit?: number;
  userId?: string;
}) => {
  const { data: userPosts } = await axios<MyPost[]>(
    `/api/userPosts?${params?.cursor && "cursor=" + params.cursor}&${
      params?.limit && "limit=" + params.limit
    }&${params?.userId && "userId=" + params.userId}`
  );
  return { userPosts };
};
export const getUserSavedPosts = async (params?: {
  cursor?: number;
  limit?: number;
  userId?: string;
}) => {
  const { data: userSavedPosts } = await axios<MyPost[]>(
    `/api/userSavedPosts?${params?.cursor && "cursor=" + params.cursor}&${
      params?.limit && "limit=" + params.limit
    }&${params?.userId && "userId=" + params.userId}`
  );
  return { userSavedPosts };
};

export const getUserFollows = async ({ userId }: { userId: string }) => {
  const { data: user } = await axios<MyUserFollows>(
    `/api/userFollows?userId=${userId}`
  );
  return { user };
};
export const getUserDetails = async ({ userId }: { userId: string }) => {
  const { data: user } = await axios<MyUserDetails>(
    `/api/userDetails?userId=${userId}`
  );
  return { user };
};
