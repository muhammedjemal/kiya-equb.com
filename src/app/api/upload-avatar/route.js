import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  console.log("postttt");
  const { userId, img } = await request.json();

  try {
    await connectToDb();
    await User.findByIdAndUpdate(userId, { img });
    return NextResponse.json({
      success: true,
      message: "photo updated successfully",
    });
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { success: false, error: "failed: " + error.message },
      { status: 500 }
    );
  }
};
