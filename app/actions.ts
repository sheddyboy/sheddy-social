"use server";
import prisma from "@/prisma";
import { cookies } from "next/dist/client/components/headers";
import { decode } from "next-auth/jwt";
// import { revalidatePath } from "next/cache";
import {
  getUserFromCookies,
  uploadPhotosToCloudinary,
  uploadSinglePhotoToCloudinary,
} from "@/helpers";

export async function postContent(data: FormData) {
  let photosArray: string[] = [];
  const content = data.get("content")?.toString();
  const photos = data.getAll("photos") as File[];

  if (photos.length > 0) {
    const urls = await uploadPhotosToCloudinary(photos);
    if (urls) {
      photosArray = urls;
    }
  }

  const token = cookies().get("next-auth.session-token")?.value!;
  const user = await decode({ token, secret: process.env.NEXTAUTH_SECRET! });
  if (!user || !content) return null;

  const post = await prisma.post.create({
    data: { content, userId: user.uid, photos: photosArray },
  });
  // revalidatePath("/");
  return post;
}

export async function changeCoverImage(data: FormData) {
  const file = data.get("file") as File;
  if (!file) return;
  const url = await uploadSinglePhotoToCloudinary(file);
  const user = await getUserFromCookies();
  if (!user) return;
  const updatedUser = await prisma.user.update({
    where: { id: user.uid },
    data: { coverImage: url },
  });
  // revalidatePath(`/profile/${user.uid}`);
  return updatedUser;
}
export async function changeProfileImage(data: FormData) {
  const file = data.get("file") as File;
  if (!file) return;
  const url = await uploadSinglePhotoToCloudinary(file);
  const user = await getUserFromCookies();
  if (!user) return;
  const updatedUser = await prisma.user.update({
    where: { id: user.uid },
    data: { image: url },
  });
  // revalidatePath(`/profile/${user.uid}`);
  return updatedUser;
}

export async function changeNameLocation(data: FormData) {
  const name = data.get("name")?.toString();
  const location = data.get("location")?.toString();
  const user = await getUserFromCookies();
  if (!name || !location || !user) return;

  const updatedUser = await prisma.user.update({
    where: { id: user.uid },
    data: { name: name, place: location },
  });
  return updatedUser;
}
export async function updateBio(data: FormData) {
  const bio = data.get("bio")?.toString();
  const user = await getUserFromCookies();
  if (!bio || !user) return;

  const updatedUser = await prisma.user.update({
    where: { id: user.uid },
    data: { bio },
  });
  return updatedUser;
}

export async function likePost(data: FormData) {
  const postId = data.get("postId")?.toString();
  const userId = data.get("userId")?.toString();
  if (!postId || !userId) return;
  // const likes = await prisma.likes.create({
  //   data: { postId: Number(postId), userId },
  // });
  // return likes;
  const updatedPost = await prisma.post.update({
    where: { id: Number(postId) },
    data: { likes: { connect: { id: userId } } },
  });

  return updatedPost;
}
export async function disLikePost(data: FormData) {
  const postId = data.get("postId")?.toString();
  const userId = data.get("userId")?.toString();
  if (!postId || !userId) return;

  const updatedPost = await prisma.post.update({
    where: { id: Number(postId) },
    data: { likes: { disconnect: { id: userId } } },
  });

  return updatedPost;
}

export async function addComment(data: FormData) {
  const postId = data.get("postId")?.toString();
  const userId = data.get("userId")?.toString();
  const userComment = data.get("comment")?.toString();
  if (!postId || !userId || !userComment) return;
  const comment = await prisma.comments.create({
    data: { comment: userComment, postId: Number(postId), userId: userId },
  });

  return comment;
}
export async function savePost(data: FormData) {
  const postId = data.get("postId")?.toString();
  const userId = data.get("userId")?.toString();
  if (!postId || !userId) return;
  const updatedPost = await prisma.post.update({
    where: { id: Number(postId) },
    data: { savedBy: { connect: { id: userId } } },
  });

  return updatedPost;
}
export async function removeSavePost(data: FormData) {
  const postId = data.get("postId")?.toString();
  const userId = data.get("userId")?.toString();
  if (!postId || !userId) return;

  const updatedPost = await prisma.post.update({
    where: { id: Number(postId) },
    data: { savedBy: { disconnect: { id: userId } } },
  });

  return updatedPost;
}

export async function followUser(data: FormData) {
  const followingUser = data.get("followingOrUnFollowingUser")?.toString();
  const userToBeFollowed = data.get("userToBeFollowedOrUnFollowed")?.toString();
  if (!followingUser || !userToBeFollowed) return;
  // const follow = await prisma.follows.create({
  //   data: { followerId: followingUser, followingId: userToBeFollowed },
  // });

  // return follow;
  const updatedUser = await prisma.user.update({
    where: { id: userToBeFollowed },
    data: { followers: { connect: { id: followingUser } } },
  });

  return updatedUser;
}
export async function unFollowUser(data: FormData) {
  const followingUser = data.get("followingOrUnFollowingUser")?.toString();
  const userToBeFollowed = data.get("userToBeFollowedOrUnFollowed")?.toString();
  if (!followingUser || !userToBeFollowed) return;
  const updatedUser = await prisma.user.update({
    where: { id: userToBeFollowed },
    data: { followers: { disconnect: { id: followingUser } } },
  });

  return updatedUser;
}
