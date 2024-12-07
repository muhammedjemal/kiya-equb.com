import { Equb, Payment } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  console.log("postttt");

  try {
    console.log("connecting..");
    await connectToDb();
    console.log("connected..");

    const { id } = await request.json();
    console.log(id);

    console.log("tryingg..");

    const userId = id;
    /////
    // Find Equbs owned by the user
    const equbs = await Equb.find({ owner: userId }).select("_id");

    // Extract array of Equb ids (as strings)
    const equbIds = equbs.map((equb) => equb._id.toString()); // Assuming _id is stored as ObjectId

    // Find payments for these Equbs
    const payments = await Payment.find({ forEqub: { $in: equbIds } });

    return NextResponse.json({ payments });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "field to get payments of the equb!" },
      { status: 500 }
    );
  }
};
