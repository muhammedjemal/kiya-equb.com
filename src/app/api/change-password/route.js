import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

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

    const { phoneNumber, newPassword, confirmNewPassword } =
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

    if (newPassword !== confirmNewPassword) {
      return NextResponse.json({ error: "Passwords do not match" });
    }

    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    return NextResponse.json({
      success: "The password successfully changed!",
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Failed to change password." },
      { status: 500 }
    );
  }
};
