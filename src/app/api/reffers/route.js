import { User } from "@/lib/models";
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
    const users = await User.find({ refferedBy: userId });

    return NextResponse.json({ users });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "field to get reffered users of the user!" },
      { status: 500 }
    );
  }
};
