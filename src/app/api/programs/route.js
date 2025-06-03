import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [programs] = await db.query("SELECT * FROM programs");
    return NextResponse.json({ programs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching programs:", error);
    return NextResponse.json(
      { error: "Internal Server Error fetching programs" },
      { status: 500 }
    );
  }
}