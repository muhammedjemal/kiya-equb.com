import mongoose from "mongoose"; // Ensure mongoose is imported
import { LiveStream } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  console.log("Connecting to DB...");

  try {
    // Connect to the database
    await connectToDb();
    const {
      liveReasonFor,
      liveCreatorId,
      liveLink,
      name,
      avatar,
      description,
      status,
    } = await request.json();

    console.log("Connected to DB.");

    // Sample data to insert
    const sampleData = [
      {
        liveReasonFor,
        liveCreatorId: new mongoose.Types.ObjectId(liveCreatorId), // Fixed with 'new'
        liveLink,
        name,
        avatar,
        description,
        status,
      },
    ];

    try {
      // Insert the sample data into the database
      await LiveStream.insertMany(sampleData);
      console.log("Sample data inserted successfully");

      // Respond with a success message
      return NextResponse.json({
        message: "Sample data inserted successfully",
      });
    } catch (err) {
      console.error("Error inserting data:", err);
      return NextResponse.json(
        { error: "Failed to insert sample data" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Database connection error:", err);
    return NextResponse.json(
      { error: "Failed to connect to the database or insert data" },
      { status: 500 }
    );
  }
};
