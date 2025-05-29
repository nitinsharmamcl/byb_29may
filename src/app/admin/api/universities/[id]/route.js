import { db } from "@/lib/db";
import { NextResponse } from "next/server";

import path from "path";
import fs from "fs";
import { writeFile } from "fs/promises";

const uploadDir = path.join(process.cwd(), "public", "university-imgs");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}


// GET: Get a single university by ID
export async function GET(
  req,
  { params }
) {
  try {
    const { id } = params;

    // Get university by ID
    const [university] = await db.query(
      "SELECT * FROM universities WHERE id = ?",
      [id]
    );

    if (!university || (Array.isArray(university) && university.length === 0)) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "University fetched successfully",
      university: university[0],
    });
  } catch (error) {
    console.error("Error fetching university:", error);
    return NextResponse.json(
      { error: "Failed to fetch university" },
      { status: 500 }
    );
  }
}

// PUT: Update a university by ID
export async function PUT(
  req,
  { params }
) {
  try {
    const { id } = await params;

        const formData = await req.formData();
         const name = formData.get("name");
         const program_id = formData.get("program_id");
         const university_country_id = formData.get("university_country_id");
         const location = formData.get("location");
         const campus = formData.get("campus");
         const fees = formData.get("fees");
         const annual_fees = formData.get("annual_fees");
         const entry_type = formData.get("entry_type");
         const description = formData.get("description");

    

    
        const saveFile = async (file, name) => {
              if (!file) return null;
        
              const bytes = await file.arrayBuffer();
              const buffer = Buffer.from(bytes);
              const fileName = `${Date.now()}-${name}-${file.name}`;
              const filePath = path.join(uploadDir, fileName);
        
              await writeFile(filePath, buffer);
              return `/university-imgs/${fileName}`; 
            };
    
            
                const requiredFiles = [
                  "uni_image",
                ];
            
            
            
                const filePaths= {};
            
                for (const fileKey of requiredFiles) {
                  const file = formData.get(fileKey)
            
                  console.log(file, fileKey);
            
                  // if (fileKey == "bachelor_certificate") {
                  //   continue;
                  // }
            
                  if(file == null) {
                    continue;
                  }
            
            
                  // if (!file) {
                  //   return NextResponse.json(
                  //     { error: `${fileKey} is required` },
                  //     { status: 400 }
                  //   );
                  // }
            
                  filePaths[fileKey] = await saveFile(file, "uni_image");
                }
            
            

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
        filePaths.uni_image,
        id
      ]
    );

    return NextResponse.json({
      message: "University updated successfully",
      university: { id, name, entry_type: validatedEntryType }
    });
  } catch (error) {
    console.error("Error updating university:", error);
    return NextResponse.json(
      { error: "Failed to update university" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a university by ID
export async function DELETE(
  req,
  { params }
) {
  try {
    const { id } = params;

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

    // Delete university
    await db.query("DELETE FROM universities WHERE id = ?", [id]);

    return NextResponse.json({
      message: "University deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting university:", error);
    return NextResponse.json(
      { error: "Failed to delete university" },
      { status: 500 }
    );
  }
} 