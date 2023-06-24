import { Comments, Post, User } from "@prisma/client";

export type MyPost = Post & {
  savedBy: {
    id: string;
  }[];
  likes: {
    id: string;
  }[];
  comments: (Comments & {
    user: {
      name: string | null;
      image: string | null;
    };
  })[];
  author: {
    name: string | null;
    image: string | null;
  };
};

// export type MyUserFollows = User & {
//   followers: {
//     id: string;
//   }[];
//   following: {
//     id: string;
//   }[];
// };
export type MyUserFollows = User & {
  followers: {
    id: string;
  }[];
  following: {
    id: string;
  }[];
};
export type MyUserDetails = User & {
  myPosts: (Post & {
    likes: {
      id: string;
    }[];
    comments: (Comments & {
      user: {
        image: string | null;
        name: string | null;
      };
    })[];
    author: {
      image: string | null;
      name: string | null;
    };
    savedBy: {
      id: string;
    }[];
  })[];
  followers: {
    name: string | null;
    image: string | null;
    id: string;
  }[];
  following: {
    name: string | null;
    image: string | null;
    id: string;
  }[];
};
