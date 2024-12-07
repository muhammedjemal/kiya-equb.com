import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(req) {
  try {
    const session1 = await auth();
    if (!session1 || !session1.user) {
      return NextResponse.json(
        { success: false, error: "Authentication failed" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, session: session1 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "An error occurred during authentication" },
      { status: 500 }
    );
  }
}
