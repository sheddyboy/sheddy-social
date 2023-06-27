"use client";
import Link from "next/link";
import Card from "./Card";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/useToast";

interface RegisterFormProps {}

export default function RegisterForm({}: RegisterFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const { toast } = useToast();
  const [registerFormData, setRegisterFormData] = useState(new FormData());

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { type, name, files, value } = e.target;
    type === "file" && files
      ? registerFormData.set(name, files[0], value)
      : registerFormData.set(name, value);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/register`, {
        method: "POST",
        body: registerFormData,
      });
      if (res.status === 201) {
        setLoggingIn(true);
        signIn("credentials", {
          redirect: false,
          email: registerFormData.get("email")?.toString(),
          password: registerFormData.get("password")?.toString(),
        }).then(() => {
          router.push("/");
        });
      } else if (res.status === 400) {
        toast({
          title: "Error",
          description: "Email is already in use",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }

    setLoading(false);
  };
  return (
    <div className="max-w-xs mx-auto grow -mt-24 relative">
      <h1 className="text-6xl mb-4 text-gray-300 text-center">Register</h1>
      <Card>
        <form onSubmit={handleSubmit} className="">
          <label className="text-gray-300 text-sm">Name</label>
          <input
            type="text"
            name="name"
            className="w-full border-b border-b-gray-200 outline-none mb-3"
            onChange={handleInputChange}
            required
          />
          <label className="text-gray-300 text-sm">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border-b border-b-gray-200 outline-none mb-3"
            onChange={handleInputChange}
            required
          />
          <label className="text-gray-300 text-sm">Password</label>
          <input
            type="password"
            name="password"
            className="w-full border-b border-b-gray-200 outline-none mb-3"
            onChange={handleInputChange}
            required
          />
          <label className="text-gray-300 text-sm">Upload Image</label>
          <input
            type="file"
            name="file"
            accept="image/*"
            className="w-full mb-3"
            onChange={handleInputChange}
          />
          <button className="block mx-auto mt-4 rounded-md bg-socialBlue text-white py-2 px-8">
            {!loggingIn
              ? loading
                ? "Registering..."
                : "Register"
              : "Logging In..."}
          </button>
        </form>
      </Card>
      <p className="text-right text-gray-500">
        Already have an account?{" "}
        <Link className="text-socialBlue" href="/login">
          LogIn
        </Link>
      </p>
      <p className="block py-5 text-center">Or</p>
      <div className="flex gap-2">
        <button
          onClick={() => {
            signIn("google", {
              callbackUrl: searchParams.get("callbackUrl") || "/",
            });
          }}
          className="shadow-md shadow-gray-300 rounded-full items-center justify-center mx-auto p-4 border-b border-b-gray-100 bg-white hover:bg-socialBlue hover:text-white hover:border-b-socialBlue hover:scale-110 transition-all"
        >
          <svg
            className="h-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
          </svg>
        </button>
        <button
          onClick={() => {
            signIn("github", {
              callbackUrl: searchParams.get("callbackUrl") || "/",
            });
          }}
          className="shadow-md shadow-gray-300 rounded-full items-center justify-center mx-auto p-4 border-b border-b-gray-100 bg-white hover:bg-socialBlue hover:text-white hover:border-b-socialBlue hover:scale-110 transition-all"
        >
          <svg
            className="h-8 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
          >
            <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
