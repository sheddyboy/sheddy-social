import Avatar from "./Avatar";

interface FriendInfoProps {}

export default function FriendInfo({}: FriendInfoProps) {
  return (
    <div className="flex gap-2">
      <Avatar />
      <div className="">
        <h1 className="font-bold text-xl">Jane Doe</h1>
        <div className="text-sm leading-3">5 Mutual friends</div>
      </div>
    </div>
  );
}
