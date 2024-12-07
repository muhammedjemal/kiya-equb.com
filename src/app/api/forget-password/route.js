import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  console.log("postttt");
  function validatePhoneNumber(phoneNumber) {
    // Check if phoneNumber is a string
    if (typeof phoneNumber !== "string") {
      throw new Error("Phone number must be a string.");
    }

    // Remove all whitespace from the phone number
    phoneNumber = phoneNumber.replace(/\s/g, "");

    // Check if phoneNumber starts with '+'
    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.slice(1); // Remove the '+' sign
    }

    // Check if phoneNumber starts with '251'
    if (phoneNumber.startsWith("251")) {
      phoneNumber = phoneNumber.slice(3); // Remove the country code '251'
    } else if (phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.slice(1); // Remove leading '0' if present
    } else {
      throw new Error("Invalid phone number format.");
    }

    // Ensure the remaining phoneNumber consists of only numeric digits
    if (!/^\d+$/.test(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }

    // Remove leading zeros by converting to number and back to string
    phoneNumber = Number(phoneNumber).toString();

    // Ensure the formatted phone number starts with '+2519' or '+2517' and has a length of 10 digits
    if (
      !(phoneNumber.startsWith("9") && phoneNumber.length === 9) &&
      !(phoneNumber.startsWith("7") && phoneNumber.length === 9)
    ) {
      throw new Error("Invalid phone number format.");
    }

    return "+251" + phoneNumber;
  }
  try {
    await connectToDb();

    const { phoneNumber, motherName, firstName, lastName } =
      await request.json();

    try {
      validatePhoneNumber(phoneNumber);
    } catch (err) {
      console.log(err);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    const validatedPhoneNumber = validatePhoneNumber(phoneNumber);

    const user = await User.findOne({ phoneNumber: validatedPhoneNumber });
    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }

    const isMotherNameCorrect =
      user.motherName.toLowerCase() === motherName.toLowerCase();
    const isFirstNameCorrect =
      user.firstName.toLowerCase() === firstName.toLowerCase();
    const isLastNameCorrect =
      user.lastName.toLowerCase() === lastName.toLowerCase();

    if (isMotherNameCorrect && isFirstNameCorrect && isLastNameCorrect) {
      return NextResponse.json({ user: user });
    }
    return NextResponse.json({
      error: "Wrong mothername, first name or last name",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
};
