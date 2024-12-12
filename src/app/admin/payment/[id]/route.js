import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/utils";
import { Equb, User, Payment } from "@/lib/models"; // Import all relevant models
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    await connectToDb();
    await Payment.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { success: false, error: "Deletion failed: " + error.message },
      { status: 500 }
    );
  }
}
export async function GET(req, { params }) {
  const { id } = params;

  try {
    await connectToDb();
    await Payment.findByIdAndUpdate(id, { status: "received" });
    return NextResponse.json({
      success: true,
      message: "Payment updated successfully",
    });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { success: false, error: "failed: " + error.message },
      { status: 500 }
    );
  }
}
