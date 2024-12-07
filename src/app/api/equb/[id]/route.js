import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/utils";
import { Equb, User, Payment } from "@/lib/models"; // Import all relevant models
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDb();
    await Equb.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Equb deleted successfully",
    });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { success: false, error: "Deletion failed: " + error.message },
      { status: 500 }
    );
  }
}
