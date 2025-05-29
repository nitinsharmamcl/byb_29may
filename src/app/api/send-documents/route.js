import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import { db } from "@/lib/db";
import AdmissionLetterTemplate from "@/templates/admissionLetterTemplate";
import UgcNotificationTemplate from "@/templates/ugcLetterTemplate";
import AffiliationLetterTemplate from "@/templates/affiliationLetterTemplate";
import BonafideLetterTemplate from "@/templates/bonafideLetterTemplate";
import VisaTemplate from "@/templates/visaTemplate";
import PaymentReceiptTemplate from "@/templates/paymentReceiptTemplate";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const uploadDir = path.join(process.cwd(), "public", "documents");
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
    const { email, name, paymentConfirmation, amount } = await req.json();

    if (!email || !name || !paymentConfirmation || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [users] = await db.execute(
      `SELECT u.id, u.university_id, u.program_id, un.name AS university_name, p.name AS program_name 
       FROM users u 
       JOIN universities un ON u.university_id = un.id 
       JOIN programs p ON u.program_id = p.id 
       WHERE u.email = ? 
       LIMIT 1`,
      [email]
    );

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { id, university_name, program_name } = users[0];

    const pdfFiles = [
      {
        column: "admission_letter",
        name: `${id}_Admission_Letter.pdf`,
        content: AdmissionLetterTemplate(name, program_name, university_name),
      },
      {
        column: "bonafide_letter",
        name: `${id}_Bonafide_Letter.pdf`,
        content: BonafideLetterTemplate(name, university_name),
      },
      {
        column: "visa",
        name: `${id}_Visa.pdf`,
        content: VisaTemplate(name, "A1234567"),
      },
      {
        column: "payment_receipt",
        name: `${id}_Payment_Receipt.pdf`,
        content: PaymentReceiptTemplate(name, amount, paymentConfirmation),
      },
      {
        column: "ugc_letter",
        name: `${id}_ugc_letter.pdf`,
        content: UgcNotificationTemplate(name, university_name, "11-12-2025"),
      },
      {
        column: "affiliation_letter",
        name: `${id}_affiliation_letter.pdf`,
        content: AffiliationLetterTemplate(university_name, university_name, "11-12-2025", "Affiliation Request"),
      },
    ];

    const generatedPaths = await Promise.all(
      pdfFiles.map((file) => generatePDF(file.name, file.content))
    );

    const updateQuery = `
      UPDATE users 
      SET admission_letter = ?, bonafide_letter = ?, visa = ?, payment_receipt = ?, ugc_letter = ?, affiliation_letter = ?
      WHERE id = ?`;

    await db.query(updateQuery, [
      `/documents/${pdfFiles[0].name}`,
      `/documents/${pdfFiles[1].name}`,
      `/documents/${pdfFiles[2].name}`,
      `/documents/${pdfFiles[3].name}`,
      `/documents/${pdfFiles[4].name}`,
      `/documents/${pdfFiles[5].name}`,
      id,
    ]);

    const mailOptions = {
      from: `"BringUrBuddy" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Bring Ur Buddy - Your Documents",
      text: `Hello ${name},\n\nPlease find attached your Admission Letter, Bonafide Letter, Visa, and Payment Receipt.\n\nBest regards,\nBring Ur Buddy Team`,
      attachments: generatedPaths.map((filePath, index) => ({
        filename: pdfFiles[index].name,
        path: filePath,
      })),
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Documents generated, stored, and emailed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing documents:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function generatePDF(fileName, htmlContent) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent);

    const filePath = path.join(uploadDir, fileName);
    await page.pdf({ path: filePath, format: "A4" });

    return filePath;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("PDF Generation Failed");
  } finally {
    if (browser) await browser.close();
  }
} 