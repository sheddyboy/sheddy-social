import { Skeleton } from "../ui/Skeleton";
import Card from "../Card";

interface PostSkeletonWrapperProps {
  numberOfPosts: number;
}

export default function PostSkeletonWrapper({
  numberOfPosts,
}: PostSkeletonWrapperProps) {
  return (
    <div className="flex flex-col gap-2">
      {new Array(numberOfPosts).fill(0).map((i, index) => (
        <Post key={index} />
      ))}
    </div>
  );
}
function Post() {
  return (
    <Card>
      <div className="flex flex-col">
        <div className="flex items-center gap-3">
          <Skeleton className="h-[48px] min-w-[48px] rounded-full"></Skeleton>
          <div className="flex flex-col gap-3 grow">
            <Skeleton className="w-[50%] h-3"></Skeleton>
            <Skeleton className="w-[30%] h-2"></Skeleton>
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <Skeleton className="w-full h-24" />
          <Skeleton className="w-full h-24" />
        </div>
      </div>
    </Card>
  );
}
