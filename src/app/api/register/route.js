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

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const saveFile = async (file) => {
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}-${file.name.replace(/\s+/g, "_")}`;
  const filePath = path.join(uploadDir, fileName);

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  await writeFile(filePath, buffer);
  return `/uploads/${fileName}`;
};

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: Number(process.env.EMAIL_PORT), 
  secure: process.env.EMAIL_PORT === "465",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const phone_number = formData.get("phone_number");
    const country_id = Number(formData.get("country_id"));
    const university_country = formData.get("university_country");
    const tenth_marks_id = formData.get("tenth_marks_id");
    const twelfth_marks_id = formData.get("twelfth_marks_id");
    const bachelor_marks_id = formData.get("bachelor_marks_id");
    const program_id = Number(formData.get("program_id"));
    const university_id = Number(formData.get("university_id"));
    const course_type_id = Number(formData.get("course_type_id"));
    const course_trade_id = Number(formData.get("course_trade_id"));
    const agent_id = Number(formData.get("agent_id"));

    const requiredFiles = [
      "tenth_certificate",
      "twelfth_certificate",
      "bachelor_certificate",
      "id_proof",
      "profile_img"
    ];

    const filePaths = {};

    for (const fileKey of requiredFiles) {
      const file = formData.get(fileKey);
      if (file == null) {
        continue;
      }
      if (fileKey === "profile_img") {
        const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];
        if (!validImageTypes.includes(file.type)) {
          return NextResponse.json(
            { error: `${fileKey} must be an image file (JPEG, PNG, or GIF)` },
            { status: 400 }
          );
        }
      } else if (!file.name.toLowerCase().endsWith(".pdf")) {
        return NextResponse.json(
          { error: `${fileKey} must be a PDF` },
          { status: 400 }
        );
      }
      filePaths[fileKey] = await saveFile(file);
    }

    let paths = [];
    for (let i = 0; ; i++) {
      const file = formData.get(`other_certificate[${i}]`);
      if (!file) break;
      const filePath = await saveFile(file);
      paths.push(filePath);
    }
    const otherPaths = paths.length > 0 ? paths.join(" ") : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await db.query(
      `INSERT INTO users (
        name, email, password, phone_number,agent_id, country_id,university_country,
        course_type_id, course_trade_id, program_id, university_id,
        id_proof, otp, otp_expires_at,profile_img,
        tenth_certificate, twelfth_certificate,bachelor_certificate, other_certificate, tenth_marks_id, twelfth_marks_id, bachelor_marks_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?, ?);`,
      [
        name,
        email,
        hashedPassword,
        phone_number,agent_id,
        country_id,
        university_country,
        course_type_id,
        course_trade_id,
        program_id,
        university_id,
        filePaths.id_proof,
        otp,
        otpExpiry,
        filePaths.profile_img,
        filePaths.tenth_certificate,
        filePaths.twelfth_certificate,
        filePaths.bachelor_certificate,
        otherPaths,
        tenth_marks_id,
        twelfth_marks_id,
        bachelor_marks_id
      ]
    );

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your OTP for Registration",
        html: `
          <p>Dear <strong>${name}</strong>,</p>
          <p>Your OTP for registration is: <strong>${otp}</strong></p>
          <p>This OTP is valid for 10 minutes.</p>
          <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
        `,
      });
    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      return NextResponse.json(
        { error: "User registered but failed to send OTP email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "success" }, { status: 201 });
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
} 