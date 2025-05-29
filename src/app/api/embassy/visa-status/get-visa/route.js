import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const {user_id} = await req.json();

    if (!user_id) {
      return NextResponse.json({ 
        message: "User ID is required", 
        success: false 
      }, { status: 400 });
    }

    const [documents] = await db.query(
      "SELECT * FROM visa WHERE user_id = ?",
      [user_id]
    );

    const documentArray = Array.isArray(documents) ? documents : [];

    console.log("Visa Status Documents: ", documentArray);
    
    
    return NextResponse.json({
      message: documentArray.length > 0 ? "Documents found" : "No documents found",
      success: true,
      documents: documentArray.length > 0 ? documentArray : null
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ 
      message: "Internal Server Error", 
      error: err.message,
      success: false 
    }, { status: 500 });
  }
} 