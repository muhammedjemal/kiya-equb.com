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

    // Find payments for these Equbs
    const payments = await Payment.find({ forEqub: id });

    return NextResponse.json({ payments });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "field to get payments of the equb!" },
      { status: 500 }
    );
  }
};
