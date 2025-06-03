import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req) {
  try {

    const [allprograms] = await db.query("SELECT * FROM programs");


    const programIds = allprograms.map((item) => item.id);


    let universities = [];
    if (programIds.length > 0) {
      // Fetch all programs with the extracted program IDs using IN clause
      const [programRows] = await db.query(
        `SELECT * FROM universities WHERE program_id IN (${programIds.map(() => '?').join(',')})`,
        programIds
      );
      universities = programRows;
    }
    return NextResponse.json({ universities: universities, programs : allprograms }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
