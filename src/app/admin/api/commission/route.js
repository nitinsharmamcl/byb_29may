import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {user_id, commission} = await req.json();

    console.log(user_id, commission);
    


    const [commissions] = (await db.query(
      "insert into commission (user_id, amount) values (?, ?, ?)",
      [user_id, commission]
    ));

     
    return NextResponse.json({ commission: commissions[0] }, { status: 200 });
        
    
  }catch(err){
return NextResponse.json({ error : "Internal Error " }, { status: 400 });
  }


}

