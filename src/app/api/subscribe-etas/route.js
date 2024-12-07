import { NextResponse } from "next/server";
import { Eta } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

export async function POST(req) {
  try {
    console.log("subscribe-eta");
    const { etaName, etaDescription, etaAvatar } = await req.json();

    // Ensure database connection
    await connectToDb();
    // first find eta if there is return because there must be always one eta
    const eta = await Eta.findOne();
    if (eta) {
      console.log(eta);
      return NextResponse.json(
        { error: "Sorry, you already have an existing eta." },
        { status: 500 }
      );
    }
    console.log("hj");
    // Create a new Eta document
    const newEta = new Eta({
      etaName,
      etaDescription,
      etaAvatar: etaAvatar || "", // Default to empty string if no avatar is provided
    });

    // Save the Eta to the database
    await newEta.save();

    return NextResponse.json({
      message: "Eta registered successfully!",
      success: true,
      etaId: newEta._id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to register Eta. Please try again." },
      { status: 500 }
    );
  }
}
