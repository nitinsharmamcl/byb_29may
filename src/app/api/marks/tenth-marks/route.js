import { NextResponse, NextRequest } from 'next/server';
import { db } from "@/lib/db";

export async function POST(request) {
  try {
    const data = await request.json();
    const { id, subjects,  percentage } = data;

    console.log("data", data);
    
    if (!id || !subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json(
        { message: "Invalid data format. ID and subjects array are required." },
        { status: 400 }
      );
    }

    // Begin a transaction
    await db.query('START TRANSACTION');
    
    try {
      
      for (const item of subjects) {
        if (!item.subject || !item.marks || !item.grade) {
          continue;
        }
        
        await db.query(
          `INSERT INTO tenth_marks (id, subject, marks, grade, percentage) 
           VALUES (?, ?, ?, ?, ?)`,
          [id, item.subject, item.marks, item.grade, percentage]
        );
      }
      
      // Commit the transaction
      await db.query('COMMIT');
      
      return NextResponse.json({
        message: "10th marks data saved successfully",
        success: true
      }, { status: 200 });
      
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      throw error;
    }
    
  } catch (error) {
    console.error("Error saving 10th marks:", error);
    
    return NextResponse.json({
      message: "Failed to save 10th marks data",
      error: error.message,
      success: false
    }, { status: 500 });
  }
}
