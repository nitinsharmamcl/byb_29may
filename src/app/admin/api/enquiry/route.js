import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, coursePreference, message } = body;
        db.query("INSERT INTO enquiry (name,email,phone_number,course_name,message) VALUES (?,?,?,?,?)", [name, email, phone, coursePreference, message]);
        return NextResponse.json({ message: "ENquiry submitted successfully" }, { status: 200 });
    }
    catch (err) {
        console.log(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}