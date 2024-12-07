import { connectToDb } from "@/lib/utils";
import { Eta, User } from "@/lib/models"; // Assuming Eta is the model name for your eta schema
import { NextResponse } from "next/server";

export const POST = async (req) => {
  try {
    // Connect to the database
    await connectToDb();
    console.log("Connected to the database.");

    // Parse the incoming request body
    const body = await req.json();
    const { userId, paymentImageLink } = body;

    if (!userId || !paymentImageLink) {
      return NextResponse.json(
        { error: "userId and paymentImageLink are required!" },
        { status: 400 }
      );
    }

    // Fetch the first (and only) eta from the collection
    const eta = await Eta.findOne();

    if (!eta) {
      return NextResponse.json(
        { error: "Eta not found in the database." },
        { status: 404 }
      );
    }

    // Check if the user already exists in the subscribers list
    const isUserSubscribed = eta.subscribersList.some(
      (subscriber) => subscriber.userId.toString() === userId
    );

    if (isUserSubscribed) {
      return NextResponse.json(
        { error: "User is already subscribed to this eta." },
        { status: 409 }
      );
    }

    // Verify if the user exists in the User collection
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { error: "User does not exist." },
        { status: 404 }
      );
    }

    // Add the user to the subscribers list
    eta.subscribersList.push({ userId, paymentImageLink });

    // Save the updated eta document
    await eta.save();

    return NextResponse.json(
      { message: "User successfully subscribed.", eta },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error subscribing user:", err);
    return NextResponse.json(
      { error: "An error occurred during subscription." },
      { status: 500 }
    );
  }
};
