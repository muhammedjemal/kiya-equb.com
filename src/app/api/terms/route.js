import { SystemInfo } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    await connectToDb();
    const info = await SystemInfo.findOne();
    const en = info.termsEn;
    const am = info.termsAm;
    const or = info.termsOr;

    const { lang } = await request.json();
    if (lang === "en") {
      return NextResponse.json({ terms: en });
    }
    if (lang === "am") {
      return NextResponse.json({ terms: am });
    }
    if (lang === "or") {
      return NextResponse.json({ terms: or });
    }

    return NextResponse.json({ error: "invalid language keyword!" });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "field to get terms and conditions!" },
      { status: 500 }
    );
  }
};
