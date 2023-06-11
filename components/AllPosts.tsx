import { Comments, Post } from "@prisma/client";
import PostCard from "./PostCard";
import { Session } from "next-auth";

interface AllPostsProps {
  posts: (Post & {
    likes: {
      id: number;
      userId: string;
    }[];
    savedPosts: {
      userId: string;
      id: number;
    }[];
    user: {
      name: string | null;
      image: string | null;
    };
    comments: (Comments & {
      user: {
        name: string | null;
        image: string | null;
      };
    })[];
  })[];
  session: Session | null;
}

export default function AllPosts({ posts, session }: AllPostsProps) {
  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          userImage={post.user.image}
          userName={post.user.name}
          session={session}
        />
      ))}
    </>
  );
}
