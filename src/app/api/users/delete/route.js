import mongoose from "mongoose";
import { connectToDb } from "@/lib/utils";
import { Equb, Payment, User } from "@/lib/models";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id } = await req.json();
  let session;

  try {
    await connectToDb();
    session = await mongoose.startSession();
    session.startTransaction();

    const equbs = await Equb.find({ owner: id }).distinct("_id");

    const paymentResult = await Payment.deleteMany(
      { forEqub: { $in: equbs } },
      { session }
    );
    console.log(paymentResult);

    const equbResult = await Equb.deleteMany({ owner: id }, { session });
    console.log(equbResult);

    const userResult = await User.findByIdAndDelete(id, { session });
    console.log(userResult);

    await session.commitTransaction();
    console.log("Transaction committed");

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Transaction error:", err);
    if (session) {
      await session.abortTransaction();
    }
    return NextResponse.json(
      { error: "Failed to delete user and associated data" },
      { status: 500 }
    );
  } finally {
    if (session) {
      session.endSession();
    }
  }
}
