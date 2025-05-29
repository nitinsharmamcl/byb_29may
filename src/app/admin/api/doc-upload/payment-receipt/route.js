import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const uploadDir = path.join(process.cwd(), "public", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file) => {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);
  return `/documents/${fileName}`;
};


export async function POST(req) {
  try {
    const formData = await req.formData();

    const email = formData.get("email")


    const requiredFiles = ["payment_receipt"];



    const filePaths= {};

    for (const fileKey of requiredFiles) {
      const file = formData.get(fileKey)  | null;

      console.log(file, fileKey);

      // if (fileKey == "bachelor_certificate") {
      //   continue;
      // }

      if(file == null) {
        continue;
      }


      // if (!file) {
      //   return NextResponse.json(
      //     { error: `${fileKey} is required` },
      //     { status: 400 }
      //   );
      // }

      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `${fileKey} must be a PDF` },
          { status: 400 }
        );
      }
      filePaths[fileKey] = await saveFile(file);
    }


    // await db.query(
    //   `INSERT INTO users (
    //     name, email, password,address,country_id,country_code, phone_number,id_proof, otp, otp_expires_at
    //   ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?);`,
    //   [
    //     email,
    //     filePaths.id_proof,
    //   ]
    // );

   await db.query("UPDATE users SET payment_receipt = ?, payment_status= ? WHERE email = ?;", [
     filePaths.payment_receipt,
     1,
     email,
   ]);



    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
