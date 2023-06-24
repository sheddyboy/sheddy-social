"use client";
import Image from "next/image";
import Avatar from "./Avatar";
import Card from "./Card";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Session } from "next-auth";
import {
  addComment,
  disLikePost,
  likePost,
  removeSavePost,
  savePost,
} from "@/app/actions";
import { formatDistanceToNow } from "date-fns";
import {
  HeartIcon,
  ChatBubbleBottomCenterTextIcon,
  PaperAirplaneIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { MyPost } from "@/types";

interface PostCardProps {
  post: MyPost;
  session: Session | null;
}

export default function PostCard({ post, session }: PostCardProps) {
  const queryClient = useQueryClient();
  const postTime = formatDistanceToNow(new Date(post.createdAt), {
    includeSeconds: true,
  });
  const [toggleComments, setToggleComments] = useState(false);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const numberOfPhotos = post.photos.length;
  const [likes, setLikes] = useState({
    isLikedByMe: !!post.likes.find(
      (postLike) => postLike.id === session?.user?.id
    ),
    likeCount: post.likes.length,
  });
  const [isSavedByMe, setIsSavedByMe] = useState(
    !!post.savedBy.find((savedPost) => savedPost.id === session?.user?.id)
  );
  useEffect(() => {
    setIsSavedByMe(
      !!post.savedBy.find((savedPost) => savedPost.id === session?.user?.id)
    );
    setLikes({
      isLikedByMe: !!post.likes.find(
        (postLike) => postLike.id === session?.user?.id
      ),
      likeCount: post.likes.length,
    });
    setComments({
      comments: post.comments,
      _comments: post.comments.length,
    });
  }, [post, session]);

  const [comments, setComments] = useState({
    comments: post.comments,
    _comments: post.comments.length,
  });

  const handleLike = async () => {
    if (!session?.user) return;
    const formData = new FormData();
    formData.set("postId", post.id.toString());
    formData.set("userId", session.user.id.toString());
    if (likes.isLikedByMe) {
      await disLikePost(formData);
      setLikes((likes) => ({
        isLikedByMe: false,
        likeCount: likes.likeCount - 1,
      }));
    } else {
      await likePost(formData);
      setLikes((likes) => ({
        isLikedByMe: true,
        likeCount: likes.likeCount + 1,
      }));
    }
    // queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.refetchQueries({ queryKey: ["posts"] });
  };

  const handleComments = async () => {
    if (!session?.user || !commentInputRef.current?.value) return;
    const formData = new FormData();
    formData.set("postId", post.id.toString());
    formData.set("userId", session.user.id.toString());
    formData.set("comment", commentInputRef.current.value);
    const comment = await addComment(formData);
    commentInputRef.current.value = "";
    if (comment) {
      setComments((prev) => ({
        comments: [
          ...prev.comments,
          {
            ...comment,
            user: { name: session.user?.name!, image: session.user?.image! },
          },
        ],
        _comments: prev._comments + 1,
      }));
    }
    // queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.refetchQueries({ queryKey: ["posts"] });
  };

  const handleSavedPost = async () => {
    if (!session?.user) return;
    const formData = new FormData();
    formData.set("postId", post.id.toString());
    formData.set("userId", session.user.id.toString());

    if (isSavedByMe) {
      await removeSavePost(formData);
      setIsSavedByMe(false);
    } else {
      await savePost(formData);
      setIsSavedByMe(true);
    }
    // queryClient.invalidateQueries({ queryKey: ["posts"] });
    queryClient.refetchQueries({ queryKey: ["posts"] });
  };
  return (
    <Card>
      <div className="flex gap-3">
        <div className="">
          <Avatar image={post.author.image} userId={post.userId} />
        </div>
        <div className="">
          <p>
            <Link
              href={`/profile/${post.userId}`}
              className="font-semibold hover:underline hover:cursor-pointer"
            >
              {post.author.name}
            </Link>{" "}
            shared a <span className="">photo</span>
          </p>
          <p className="text-gray-500 text-sm">{postTime}</p>
        </div>
        <div className="ml-auto relative">
          <button className="text-gray-400" onClick={handleSavedPost}>
            <BookmarkIcon
              className={`w-6 h-6 ${
                isSavedByMe && "fill-socialBlue stroke-socialBlue"
              } `}
            />
          </button>
        </div>
      </div>
      <div className="">
        <p className="my-3 text-sm">{post.content}</p>
        <div
          className={`grid ${
            numberOfPhotos === 1 ? "grid-cols-1" : "grid-cols-2"
          } gap-4`}
        >
          {post.photos.map((photo, index) => (
            <Image
              key={index}
              alt=""
              src={photo}
              width={1000}
              height={100}
              className="rounded-md h-full object-cover object-top"
            />
          ))}
        </div>
      </div>
      <div className="mt-3 flex gap-5">
        <button onClick={handleLike} className="flex items-center gap-2">
          <HeartIcon
            className={`w-6 h-6 ${
              likes.isLikedByMe && "fill-red-400 stroke-red-400"
            } `}
          />

          {likes.likeCount}
        </button>
        <button
          onClick={() => setToggleComments((toggleComments) => !toggleComments)}
          className="flex items-center gap-2"
        >
          <ChatBubbleBottomCenterTextIcon className="w-6 h-6" />
          {comments._comments}
        </button>
      </div>
      {toggleComments && (
        <>
          <div className="flex mt-4 gap-3">
            <div className="">
              <Avatar image={session?.user?.image} userId={session?.user?.id} />
            </div>
            <div className="border grow rounded-full relative">
              <input
                ref={commentInputRef}
                className="block p-3 px-4 h-12 w-full overflow-hidden rounded-full resize-none"
                placeholder="Leave a comment"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleComments();
                  }
                }}
              />
              <button
                className="absolute top-3 right-3 text-gray-500"
                onClick={handleComments}
              >
                <PaperAirplaneIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="max-h-40 overflow-scroll mt-5 py-2">
            {comments.comments
              .map((comment) => (
                <div key={comment.id} className="mt-2 flex gap-2 items-center">
                  <Avatar image={comment.user.image} userId={comment.userId} />
                  <div className="bg-gray-200 p-2 px-4 rounded-3xl">
                    <div className="">
                      <span className="font-semibold mr-1">
                        {comment.user.name}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm">{comment.comment}</p>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        </>
      )}
    </Card>
  );
}
