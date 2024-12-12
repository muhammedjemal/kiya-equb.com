import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

function validatePhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== "string") {
    throw new Error("Phone number must be a string.");
  }

  phoneNumber = phoneNumber.replace(/\s/g, "");

  if (phoneNumber.startsWith("+")) {
    phoneNumber = phoneNumber.slice(1);
  }

  if (phoneNumber.startsWith("251")) {
    phoneNumber = phoneNumber.slice(3);
  } else if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.slice(1);
  } else {
    throw new Error("Invalid phone number format.");
  }

  if (!/^\d+$/.test(phoneNumber)) {
    throw new Error("Invalid phone number format.");
  }

  phoneNumber = Number(phoneNumber).toString();

  if (
    !(phoneNumber.startsWith("9") && phoneNumber.length === 9) &&
    !(phoneNumber.startsWith("7") && phoneNumber.length === 9)
  ) {
    throw new Error("Invalid phone number format.");
  }

  return "+251" + phoneNumber;
}

export const POST = async (request) => {
  try {
    let { firstName, lastName, motherName, phoneNumber, password, refferedBy } =
      await request.json();
    console.log("Request data parsed successfully");

    try {
      validatePhoneNumber(phoneNumber);
    } catch (err) {
      console.log("Phone number validation failed", err);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }

    const validatedPhoneNumber = validatePhoneNumber(phoneNumber);
    console.log("Phone number validated");
    await connectToDb();
    console.log("Database connected successfully");

    const existingUser = await User.findOne({
      phoneNumber: validatedPhoneNumber,
    });
    if (existingUser) {
      console.log("User already exists");
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    if (refferedBy) {
      refferedBy = refferedBy.trim();
      if (!refferedBy.match(/^[0-9a-fA-F]{24}$/)) {
        return NextResponse.json(
          { error: "Invalid referral code" },
          { status: 400 }
        );
      }

      const refferedByUser = await User.findById(refferedBy);
      if (!refferedByUser) {
        return NextResponse.json(
          { error: "Sorry, refferal code user not found" },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      motherName,
      phoneNumber: validatedPhoneNumber,
      password: hashedPassword,
      refferedBy,
      isSystemAdmin: false,
      collectorOf: null,
      managerMembers: null,
    });

    await newUser.save();
    console.log("New user saved successfully");

    return NextResponse.json({ user: newUser });
  } catch (err) {
    console.log("Failed to create user", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
};
export const PATCH = async (request) => {
  try {
    let { img, id } = await request.json();
    // find the user by id and update the img
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" });
    }
    user.img = img;
    const newUser = await user.save();
    console.log("Avatar updated successfully");

    return NextResponse.json({
      success: true,
      message: "Avatar updated successfully",
    });
  } catch (err) {
    console.log("Failed to create user", err);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
};
