import { decode } from "next-auth/jwt";
import { cookies } from "next/dist/client/components/headers";

export const uploadPhotosToCloudinary = (photos: File[]) => {
  const uploadPromises = photos.map(async (photo) => {
    const formData = new FormData();
    formData.set("upload_preset", "eka0ifzm");
    formData.set("file", photo);

    try {
      const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data.secure_url as string;
    } catch (error) {
      console.error("Error uploading photo:", error);
      throw error;
    }
  });

  const uploadUrls = Promise.all(uploadPromises)
    .then((urls) => {
      return urls;
    })
    .catch((err) => {
      console.error("Upload failed:", err);
      return null;
    });

  return uploadUrls;
};

export const uploadSinglePhotoToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.set("upload_preset", "eka0ifzm");
  formData.set("file", file);

  try {
    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    const url = data.secure_url as string;
    return url;
  } catch (error) {
    console.error("Error uploading photo:", error);
    throw error;
  }
};

export const getUserFromCookies = async () => {
  const token = cookies().get("next-auth.session-token")?.value!;
  const user = await decode({ token, secret: process.env.NEXTAUTH_SECRET! });
  return user;
};
