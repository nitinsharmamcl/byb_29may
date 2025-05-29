import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {user_id} = await req.json();

    const [commissions] = (await db.query(
      "select * from commission where user_id = ?",
      [user_id]
    )) ;

    console.log("commissions user id", user_id, commissions);
    

     
    return NextResponse.json({ commission: commissions[0] }, { status: 200 });
        
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 400 });
  }


}

