import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { db } from "@/lib/db";

export async function POST(req) {
  try {


    const {email} = await req.json();


    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }


    const [rows] = await db.query(
      "SELECT admission_letter,offer_letter, bonafide_letter, visa, payment_receipt, ugc_letter, affiliation_letter FROM users WHERE email = ?",
      [email]
    );


    console.log("Documents : ",rows);


    if (!rows.length) {
      return NextResponse.json(
        { error: "Documents not found!" },
        { status: 404 }
      );
    }


    const documentPaths = {
      admission_letter: rows[0].admission_letter,
      offer_letter: rows[0].offer_letter,
      bonafide_letter: rows[0].bonafide_letter,
      visa: rows[0].visa,
      payment_receipt: rows[0].payment_receipt,
      ugc_letter: rows[0].ugc_letter,
      affiliation_letter: rows[0].affiliation_letter,
    };

    console.log("Document Paths : ",documentPaths);
    

    // Ensure each document exists before sending response
    const documents = Object.entries(documentPaths)
      .filter(([_, filePath]) => filePath) // Ensure filePath is not null/undefined
      .map(([key, filePath]) => {
        const fullPath = path.join(process.cwd(), "public", filePath);
        if (fs.existsSync(fullPath)) {
          return { name: key, url: `${filePath}` };
        }
        return null;
      })
      .filter(Boolean); 


    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}
