import { db } from "@/lib/db";
import { NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public", "university-imgs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}



export async function POST(req) {
  try {


    const body = await req.json();

    
    const {
      name,
      program_id,
      university_country_id,
      location,
      campus,
      fees,
      annual_fees,
      description,
      entry_type,
      uni_image
    } = body;
console.log("uni_image : ", uni_image);
    const validatedEntryType = entry_type !== undefined ? Number(entry_type) : 0;
    if (![0, 1].includes(validatedEntryType)) {
      return NextResponse.json(
        { error: "Invalid entry_type. Must be 0 (manual) or 1 (automated)" },
        { status: 400 }
      );
    }
  
    const saveFile = async (file, name) => {
          if (!file) return null;
    
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${name}-${file.name}`;
          const filePath = path.join(uploadDir, fileName);
    
          await writeFile(filePath, buffer);
          return `/university-imgs/${fileName}`; 
        };

        const resultdocument = await saveFile(
          uni_image ,
          "uni_image"
        );

        console.log("uni_image : ", resultdocument);


    await db.query(
      `INSERT INTO universities 
      (
        name, program_id, university_country_id, location, campus, fees, annual_fees, description, entry_type,  uni_image
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )`,
      [
        name,
        program_id,
        university_country_id,
        location,
        campus,
        fees,
        annual_fees,
        description,
        validatedEntryType,
        resultdocument

      ]
    );

    return NextResponse.json({
      message: "University added successfully",
      university: { name, program_id, entry_type: validatedEntryType , uni_image },
    });
  } catch (error) {
    console.error("Error adding university:", error);
    return NextResponse.json(
      { error: "Failed to add university" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const [universities] = await db.query("SELECT * FROM universities");

    return NextResponse.json({
      message: "Universities fetched successfully",
      universities,
    });
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

// PUT: Update an existing university
export async function PUT(req) {
  try {
    const body = await req.json();
    
    const {
      id,
      name,
      program_id,
      university_country_id,
      location,
      campus,
      fees,
      annual_fees,
      description,
      entry_type,
      uni_image
    } = body;
    
    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: "University ID is required" },
        { status: 400 }
      );
    }

      
    const saveFile = async (file, name) => {
          if (!file) return null;
    
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const fileName = `${Date.now()}-${name}-${file.name}`;
          const filePath = path.join(uploadDir, fileName);
    
          await writeFile(filePath, buffer);
          return `/university-imgs/${fileName}`; 
        };

        const resultdocument = await saveFile(
          uni_image ,
          "uni_image"
        );

        

        console.log("uni_image : ", resultdocument);
    
    // Validate entry_type
    const validatedEntryType = entry_type !== undefined ? Number(entry_type) : 0;
    if (![0, 1].includes(validatedEntryType)) {
      return NextResponse.json(
        { error: "Invalid entry_type. Must be 0 (manual) or 1 (automated)" },
        { status: 400 }
      );
    }
    
    // Check if university exists
    const [existingUniversity] = await db.query(
      "SELECT * FROM universities WHERE id = ?",
      [id]
    );
    
    if (!existingUniversity || (Array.isArray(existingUniversity) && existingUniversity.length === 0)) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }
    
    // Update university
    await db.query(
      `UPDATE universities 
      SET name = ?, program_id = ?, university_country_id = ?, 
          location = ?, campus = ?, fees = ?, annual_fees = ?, 
          description = ?, entry_type = ? ,uni_image = ?
      WHERE id = ?`,
      [
        name,
        program_id,
        university_country_id,
        location,
        campus,
        fees,
        annual_fees,
        description,
        validatedEntryType,
        resultdocument,
        id
      ]
    );
    
    return NextResponse.json({
      message: "University updated successfully",
      university: { id, name, program_id, entry_type: validatedEntryType ,uni_image}
    });
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Failed to upda      te university" },
      { status: 500 }
    );
  }
}
