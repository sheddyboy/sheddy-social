import Avatar from "./Avatar";

interface FriendInfoProps {
  name: string | null;
  image: string | null;
  userId: string;
}

export default function FriendInfo({ image, name, userId }: FriendInfoProps) {
  return (
    <div className="flex gap-2 items-center">
      <Avatar image={image} userId={userId} />
      <div className="">
        <h1 className="font-bold text-xl">{name}</h1>
      </div>
    </div>
  );
}
