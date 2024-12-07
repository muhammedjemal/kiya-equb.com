import { Equb, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  console.log("postttt");

  try {
    await connectToDb();

    const { owner, payments, type, name, amount, startDate, endDate } =
      await request.json();
    if (!owner) {
      return NextResponse.json({ error: "sorry, owner field is required" });
    }

    try {
      const ownerUser = await User.findById(owner);
      if (!ownerUser) {
        return NextResponse.json(
          { error: "sorry, equb owner not found" },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "sorry, invalid owner id" },
        { status: 400 }
      );
    }

    const payment = new Equb({
      owner,
      payments,
      type,
      name,
      amount,
      startDate,
      endDate,
    });

    await payment.save();
    return NextResponse.json({
      message: "Equb has been created successfully!",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Sorry, Failed to create the equb" },
      { status: 500 }
    );
  }
};
