import { NextResponse } from "next/server";
import { Agent } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

export async function GET(req) {
  try {
    await connectToDb();
    const agents = await Agent.find();
    console.log(agents);
    console.log("Agents fetched successfully:");
    return NextResponse.json(agents);
  } catch (error) {
    console.error(error);

    // Handle errors
    return NextResponse.json(
      {
        error: "Something went wrong.",
        success: false,
      },
      { status: 500 }
    );
  }
}
