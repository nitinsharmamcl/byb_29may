import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import nodemailer from "nodemailer";

import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public", "airport-images");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
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

    console.log(formData);
    

    const email = formData.get("email");
    const photo_document = formData.get("photo_document");

    


    const [users] = (await db.query(
      "SELECT id, name, email FROM users WHERE email = ?",
      [email]
    )) ;

    if (!users.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];


    const saveFile = async (file, name) => {
          if (!file) return null;
    
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${name}-${file.name}`;
          const filePath = path.join(uploadDir, fileName);
    
          await writeFile(filePath, buffer);
          return `/airport-images/${fileName}`; 
        };

        const resultdocument = await saveFile(
          formData.get("photo_document"),
          "photo_document"
        );

        console.log("photo_document : ", resultdocument);


        const [prev] = await db.query("select * from airport_pickup where user_id = ?" , [user.id])

        console.log("prev[0] : ",prev[0]);


        if(prev[0]?.user_id === user.id){
          const [reminders] = await db.query(
            "UPDATE airport_pickup SET photo_document = ? WHERE user_id = ?;",
            [resultdocument, user.id]
          );
        }else {       
            const [reminders] = (await db.query(
              "INSERT into airport_pickup (user_id, photo_document) values(?, ?);",
              [user.id, resultdocument]
            )) ;
        }

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Airport Pickup Photo Document",
        html: `
            <p>Dear <strong>Agent</strong>,</p>
            <p>The photo document for user <strong>${user.name}</strong> has been uploaded.</p>
            <p>See the attached file.</p>
            <p>Best Regards,<br><strong>BringUrBuddy Team</strong></p>
        `,
        attachments: [
          {
            filename: path.basename(resultdocument), 
            path: path.join(process.cwd(), "public", resultdocument), 
          },
        ],
      });

    } catch (emailError) {
      console.error("Email Sending Error:", emailError);
      return NextResponse.json(
        { error: "User registered but failed to send OTP email." },
        { status: 500 }
      );
    }


    return NextResponse.json({ message: "success" });
  } catch (error) {
    console.error("Error sending reminder email:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

