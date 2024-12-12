import { NextResponse } from "next/server";
import { Payment } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

export async function GET(req) {
  console.log("GET");
  try {
    await connectToDb();
    // sum all payments of their amount
    const sum = await Payment.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          total: 1,
        },
      },
    ]);
    console.log(sum[0]);

    return NextResponse.json(sum[0], {
      headers: {
        "Cache-Control": "no-store", // Ensures no caching
      },
    });
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
