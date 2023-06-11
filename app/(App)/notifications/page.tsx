import Avatar from "@/components/Avatar";
import Card from "@/components/Card";

interface NotificationsProps {}

export default function Notifications({}: NotificationsProps) {
  return (
    <>
      <h1 className="text-6xl mb-4 text-gray-300">Notifications</h1>
      <Card noPadding>
        <div className="">
          <div className="flex gap-2 items-center border-b border-b-gray-100 p-4">
            <Avatar />
            <div className="">
              <span className="font-semibold"> John Doe</span> liked your photo
            </div>
          </div>
          <div className="flex gap-2 items-center border-b border-b-gray-100 p-4">
            <Avatar />
            <div className="">
              <span className="font-semibold"> John Doe</span> liked your photo
            </div>
          </div>
          <div className="flex gap-2 items-center border-b border-b-gray-100 p-4">
            <Avatar />
            <div className="">
              <span className="font-semibold"> John Doe</span> liked your photo
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
