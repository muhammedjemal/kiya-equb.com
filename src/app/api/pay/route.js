import { Equb, Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  console.log("postttt");

  try {
    await connectToDb();

    const { forEqub, date, imageProof, amount } = await request.json();
    if (!forEqub) {
      return NextResponse.json({ error: "forEqub field is required" });
    }
    // if forEqub is not a valid ObjectId, return an error

    // Check if forEqub is a valid ObjectId before creating the payment
    // If not, return an error message
    let equb;

    try {
      equb = await Equb.findById(forEqub);
      if (!equb) {
        return NextResponse.json({
          error: "can't make payment Equb not found",
        });
      }
    } catch {
      return NextResponse.json({
        error: "sorry, invalid forEqub field",
      });
    }

    try {
      const user = await User.findById(equb.owner);
      if (!user) {
        return NextResponse.json({
          error: "can't make payment Equb owner not found",
        });
      }
    } catch {
      return NextResponse.json({
        error: "sorry, invalid owner field",
      });
    }

    const payment = new Payment({
      forEqub,
      date,
      imageProof,
      amount,
    });

    await payment.save();
    return NextResponse.json({
      message: "payment has been made successfully!",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Sorry, something went wrong while saving payment" },
      { status: 500 }
    );
  }
};
