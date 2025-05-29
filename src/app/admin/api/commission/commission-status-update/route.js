import { db } from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {user_id} = await req.json();

    console.log(user_id);
    


    const [commissions] = (await db.query(
      "update set status = ? where user_id = ?",
      [1, user_id]
    )) ;


    return NextResponse.json({ success : true }, { status: 200 });
        
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 400 });
  }


}

