import { NextResponse } from "next/server";
import { Agent } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const formatErrorMessage = (error) => {
  // Split the error message by the first colon
  const parts = error.split(":");

  // Ensure the message has at least two parts
  if (parts.length > 1) {
    const baseMessage = parts[0].trim(); // Extract the main error description
    let fieldName = parts[1].trim().split(" ")[0]; // Extract the field or prefixed field name

    // Check if the fieldName contains a prefix (like tsehafi, dagna, sebsabi)
    if (fieldName.includes(".")) {
      const [prefix, field] = fieldName.split("."); // Split into prefix and field name
      const formattedField = field
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/_/g, " ")
        .toLowerCase();
      return `${baseMessage}: ${prefix} ${formattedField}`;
    }

    // Otherwise, handle regular camelCase fields
    const formattedFieldName = fieldName
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .toLowerCase();
    return `${baseMessage}: ${formattedFieldName}`;
  }

  // Return the original message if the format doesn't match
  return error;
};
export async function POST(req) {
  try {
    // Parse JSON from the request body
    const body = await req.json();

    const {
      dagna,
      sebsabi,
      tsehafi,
      description,
      equbName,
      banks,
      equbType,
      equbAmount,
    } = body;

    // Ensure database connection
    await connectToDb();

    // Create a new user document
    const user = new Agent({
      dagna: {
        ...dagna,
        avatar: dagna.avatar || "",
        id_front: dagna.id_front || "",
        id_back: dagna.id_back || "",
      },
      sebsabi: {
        ...sebsabi,
        avatar: sebsabi.avatar || "",
        id_front: sebsabi.id_front || "",
        id_back: sebsabi.id_back || "",
      },
      tsehafi: {
        ...tsehafi,
        avatar: tsehafi.avatar || "",
        id_front: tsehafi.id_front || "",
        id_back: tsehafi.id_back || "",
      },
      description,
      equbName,
      banks,
      equbType,
      equbAmount,
    });

    // Save the user to the database
    await user.save();
    revalidatePath("/admin/agents");

    // Respond with success
    return NextResponse.json({
      message: "Registration successful!",
      success: true,
      userId: user._id,
    });
  } catch (error) {
    console.error(error);
    // startWith("Agent validation failed:")
    if (error?.message?.startsWith("Agent validation failed:")) {
      let formattedMessage;

      // Safely handle potential errors in formatErrorMessage
      try {
        formattedMessage = formatErrorMessage(error.message);
      } catch (formatError) {
        console.error("Error in formatErrorMessage:", formatError);
        formattedMessage = "Agent validation failed: Invalid format";
      }
      // Handle errors
      return NextResponse.json(
        {
          // tell what is missing (not the entire error.message)
          error: formattedMessage,

          success: false,
        },
        { status: 500 }
      );
    }
    if (error?.message?.startsWith("E11000 duplicate key error collection")) {
      console.log(error.message);
      return NextResponse.json(
        {
          // tell what is missing (not the entire error.message)
          error: "Sorry, already Registered.",

          success: false,
        },
        { status: 500 }
      );
    } else {
      // Handle other errors
      return NextResponse.json(
        {
          error: "Something went wrong, please check your inputs.",
          success: false,
        },
        { status: 500 }
      );
    }
  }
}
