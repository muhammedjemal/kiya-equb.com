import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/utils";
import { Agent, Payment } from "@/lib/models";
import mongoose from "mongoose";
import { User } from "@/lib/models";
import { revalidatePath } from "next/cache";
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

export async function PATCH(req, { params }) {
  const { id } = params;
  const hashedPassword = await bcryptjs.hash("123", 10);
  const session = await mongoose.startSession();
  session.startTransaction(); // Start the transaction

  try {
    await connectToDb();

    const agent = await Agent.findById(id).session(session);

    if (!agent) {
      throw new Error("Agent not found");
    }

    if (!agent.dagna || !agent.tsehafi || !agent.sebsabi) {
      throw new Error("Agent is missing dagna, tsehafi, or sebsabi details");
    }

    let dagnaPhoneNumber, tsehafiPhoneNumber, sebsabiPhoneNumber;

    try {
      dagnaPhoneNumber = validatePhoneNumber(agent.dagna.phoneNumber);
      tsehafiPhoneNumber = validatePhoneNumber(agent.tsehafi.phoneNumber);
      sebsabiPhoneNumber = validatePhoneNumber(agent.sebsabi.phoneNumber);
    } catch (error) {
      throw new Error("Phone number validation failed: " + error.message);
    }

    try {
      await Agent.findByIdAndUpdate(id, { agentStatus: "active" }).session(
        session
      );
      const dagna = new User({
        firstName: agent.dagna.firstName,
        lastName: agent.dagna.fatherName,
        motherName: agent.dagna.motherName,
        phoneNumber: dagnaPhoneNumber,
        img: agent.dagna.avatar,
        idFront: agent.dagna.id_front,
        idBack: agent.dagna.id_back,
        password: hashedPassword,
        role: "dagna",
        agentId: id,
        isSystemAdmin: true,
      });

      const tsehafi = new User({
        firstName: agent.tsehafi.firstName,
        lastName: agent.tsehafi.fatherName,
        motherName: agent.tsehafi.motherName,
        phoneNumber: tsehafiPhoneNumber,
        img: agent.tsehafi.avatar,
        idFront: agent.tsehafi.id_front,
        idBack: agent.tsehafi.id_back,
        password: hashedPassword,
        role: "tsehafi",
        agentId: id,
        isSystemAdmin: true,
      });

      const sebsabi = new User({
        firstName: agent.sebsabi.firstName,
        lastName: agent.sebsabi.fatherName,
        motherName: agent.sebsabi.motherName,
        phoneNumber: sebsabiPhoneNumber,
        img: agent.sebsabi.avatar,
        idFront: agent.sebsabi.id_front,
        idBack: agent.sebsabi.id_back,
        password: hashedPassword,
        role: "sebsabi",
        agentId: id,
        isSystemAdmin: true,
      });

      await dagna.save({ session });
      await tsehafi.save({ session });
      console.log(tsehafi);
      console.log(sebsabi);
      await sebsabi.save({ session });
      await session.commitTransaction();

      revalidatePath("/admin/agents");

      return NextResponse.json({ success: true });
    } catch (error) {
      console.error("Error during transaction:", error);
      await session.abortTransaction(); // Abort the transaction if any error occurs

      return NextResponse.json(
        { success: false, error: "Transaction failed: " + error.message },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Update failed: " + error.message },
      { status: 500 }
    );
  } finally {
    session.endSession(); // End the session to clean up
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await connectToDb();
    // similarly, just like above in the patch section, when deleting use transaction and delete those 3 users created when approved if it was approved already.

    await User.deleteMany({ agentId: id });
    await Agent.findByIdAndDelete(id);
    // also delete all payments with that agentId
    await Payment.deleteMany({ agentId: id });

    // await Agent.findByIdAndDelete(id);
    revalidatePath("/admin/agents");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Deletion failed." },
      { status: 500 }
    );
  }
}
