import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";
import nodemailer from "nodemailer";

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

const uploadDir = path.join(process.cwd(), "public", "agents", "documents");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file) => {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);
  return `/agents/documents/${fileName}`;
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const address = formData.get("address");
    const phone_number = formData.get("phone_number");
    const country_code = Number(formData.get("country_code"));
    const country_id = Number(formData.get("country_id"));
    const requiredFiles = ["id_proof"];
    const filePaths = {};
    for (const fileKey of requiredFiles) {
      const file = formData.get(fileKey);
      if (file == null) {
        continue;
      }
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `${fileKey} must be a PDF` },
          { status: 400 }
        );
      }
      filePaths[fileKey] = await saveFile(file);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await db.query(
      `INSERT INTO agents (
        name, email, password,address,country_id,country_code, phone_number,id_proof, otp, otp_expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?);`,
      [
        name,
        email,
        hashedPassword,
        address,
        country_id,
        country_code,
        phone_number,
        filePaths.id_proof,
        otp,
        otpExpiry,
      ]
    );
    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 