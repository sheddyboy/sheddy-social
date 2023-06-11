import { BounceLoader } from "react-spinners";

export default function Preloader({}) {
  return (
    <div className="absolute w-full h-full bg-white bg-opacity-80 flex items-center justify-center">
      <BounceLoader speedMultiplier={2} color="#348dfa" />
    </div>
  );
}
