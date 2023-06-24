"use server";
import prisma from "@/prisma";
import {
  uploadPhotosToCloudinary,
  uploadSinglePhotoToCloudinary,
} from "@/helpers";

export async function postContent(data: FormData) {
  let photosArray: string[] = [];
  const content = data.get("content")?.toString();
  const photos = data.getAll("photos") as File[];
  const userId = data.get("userId")?.toString();

  if (photos.length > 0) {
    const urls = await uploadPhotosToCloudinary(photos);
    if (urls) {
      photosArray = urls;
    }
  }
  if (!content || !userId) return null;

  const post = await prisma.post.create({
    data: { content, userId, photos: photosArray },
  });
  return post;
}

export async function changeCoverImage(data: FormData) {
  const file = data.get("file") as File;
  const loggedInUserId = data.get("loggedInUserId")?.toString();
  if (!file || !loggedInUserId) return;
  const url = await uploadSinglePhotoToCloudinary(file);
  const updatedUser = await prisma.user.update({
    where: { id: loggedInUserId },
    data: { coverImage: url },
  });
  return updatedUser;
}
export async function changeProfileImage(data: FormData) {
  const file = data.get("file") as File;
  const loggedInUserId = data.get("loggedInUserId")?.toString();
  if (!file || !loggedInUserId) return;
  const url = await uploadSinglePhotoToCloudinary(file);
  const updatedUser = await prisma.user.update({
    where: { id: loggedInUserId },
    data: { image: url },
  });
  return updatedUser;
}

export async function changeNameLocation(data: FormData) {
  const name = data.get("name")?.toString();
  const location = data.get("location")?.toString();
  const loggedInUserId = data.get("loggedInUserId")?.toString();

  if (!name || !location || !loggedInUserId) return;

  const updatedUser = await prisma.user.update({
    where: { id: loggedInUserId },
    data: { name: name, place: location },
  });
  return updatedUser;
}
export async function updateBio(data: FormData) {
  const bio = data.get("bio")?.toString();
  const userId = data.get("userId")?.toString();
  if (!bio || !userId) return;

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { bio },
  });
  return updatedUser;
}

export async function likePost(data: FormData) {
  const postId = data.get("postId")?.toString();
  const userId = data.get("userId")?.toString();
  if (!postId || !userId) return;
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
