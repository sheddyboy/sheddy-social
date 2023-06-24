import Card from "../Card";
import { Skeleton } from "../ui/Skeleton";

interface UserProfileHeadingSkeletonProps {}

export default function UserProfileHeadingSkeleton({}: UserProfileHeadingSkeletonProps) {
  return (
    <Card noPadding>
      <div className="relative rounded-md overflow-hidden">
        <Skeleton className="relative w-full h-36" />
        <div className="absolute top-24 left-4">
          <Skeleton className="relative block rounded-full w-24 h-24 md:w-36 md:h-36 " />
        </div>
        <div className="p-4 pt-0 md:pt-4 pb-0">
          <div className="ml-24 md:ml-40 flex justify-between h-16">
            <div className="w-full">
              <Skeleton className="w-[40%] h-9 mb-2" />
              <Skeleton className="w-[30%] h-4" />
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-10"></div>
      </div>
    </Card>
  );
}
