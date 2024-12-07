import { SystemInfo } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connectToDb();

    const info = await SystemInfo.findOne();
    const dev = info.developer;

    return NextResponse.json(dev);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "field to get dev info!" },
      { status: 500 }
    );
  }
};
