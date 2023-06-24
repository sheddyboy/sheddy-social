import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/prisma";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const name = formData.get("name")?.toString()!;
  const email = formData.get("email")?.toString()!;
  const password = formData.get("password")?.toString()!;

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  let imageUrl = "";
  if (formData.get("file")) {
    formData.set("upload_preset", "eka0ifzm");
    const res = await fetch(process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    imageUrl = data.secure_url;
  }

  try {
    // const newUser = await prisma.user.create({
    //   data: {
    //     name,
    //     email,
    //     password: hashedPassword,
    //     image: imageUrl,
    //   },
    // });
    const newUser = await prisma.account.create({
      data: {
        provider: "credentials",
        providerAccountId: randomUUID(),
        type: "credentials",
        user: {
          create: { name, email, password: hashedPassword, image: imageUrl },
        },
      },
    });
    return NextResponse.json(newUser);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
