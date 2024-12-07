import { Equb, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  console.log("postttt");

  try {
    await connectToDb();

    const { id } = await request.json();
    console.log(id);

    console.log("tryingg..");

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }
    console.log(user);
    console.log(user.activeEqubs);

    const activeEqubs = await Equb.find({ owner: id });
    console.log(activeEqubs);

    // if (!isPasswordCorrect) {
    //   return NextResponse.json({ error: "Wrong credentials" });
    // }
    return NextResponse.json({ activeEqubs });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Server error, Failed to fetch the user activeEqubs!" },
      { status: 500 }
    );
  }
};
