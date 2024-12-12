import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/utils";
import { Payment } from "@/lib/models";

export async function GET(req, { params }) {
  let { id: x } = params;

  try {
    await connectToDb();
    x = parseInt(x, 10); // Ensure `x` is an integer
    console.log("Parameter x:", x);

    const equbs = await Payment.aggregate([
      {
        $group: {
          _id: "$forEqub",
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: x,
        },
      },
    ]);

    if (equbs.length === 0) {
      console.log("No equbs found");
      return NextResponse.json({ success: false, message: "No equbs found" });
    } else {
      console.log("Equbs Found:", equbs);
      return NextResponse.json({ success: true, equbs });
    }
  } catch (error) {
    console.error("error:", error);
    return NextResponse.json(
      { success: false, error: "failed: " + error.message },
      { status: 500 }
    );
  }
}
