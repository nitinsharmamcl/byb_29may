import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req) {
  try {
    const { uni_id } = await req.json();
    // console.log("university id :", uni_id);

    const [linked_uni_program] = await db.query("SELECT * FROM linked_uni_program where uni_id =?", [
      uni_id,
    ]);

    const [university] = await db.query("SELECT * FROM universities where id =?", [
      uni_id,
    ]);

    // console.log("linked_uni_program : ", linked_uni_program[0]);
const programIds = linked_uni_program.map((item) => item.program_id);

    let programs = [];
    if (programIds.length > 0) {
      // Fetch all programs with the extracted program IDs using IN clause
      const [programRows] = await db.query(
        `SELECT * FROM programs WHERE id IN (${programIds.map(() => '?').join(',')})`,
        programIds
      );
      programs = programRows;
    }
    return NextResponse.json({ programs: programs, linked_uni_program:linked_uni_program, university : university }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
