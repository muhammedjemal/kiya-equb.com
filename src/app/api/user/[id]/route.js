import { NextResponse } from "next/server";
import { connectToDb } from "@/lib/utils";
import { Equb, User, Payment } from "@/lib/models"; // Import all relevant models
import mongoose from "mongoose";

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    // Start a session

    // Get all Equbs owned by the user
    const equbs = await Equb.find({ owner: id }).distinct("_id");

    // Delete payments
    const paymentResult = await Payment.deleteMany({ forEqub: { $in: equbs } });
    console.log(paymentResult);

    // Delete equbs
    const equbResult = await Equb.deleteMany({ owner: id });
    console.log(equbResult);

    // Delete the user
    const userResult = await User.findByIdAndDelete(id);
    console.log(userResult);

    // Commit the transaction
    console.log("Transaction committed");
    revalidatePath("/admin/users");
    return NextResponse.json({
      success: true,
      message: "User and associated data deleted successfully",
    });
  } catch (error) {
    console.error("Transaction error:", error);
    return NextResponse.json(
      { success: false, error: "Deletion failed: " + error.message },
      { status: 500 }
    );
  } finally {
    // End the session
    console.log("finally");
  }
}

//

//   try {
//     await connectToDb();
//     console.log("Connected to MongoDB");
//     try {
//       // Delete associated Users first
//       await User.deleteMany({ agentId: id });
//       console.log("Connected to MongoDB");
//       // Delete associated Payments
//       await Payment.deleteMany({ agentId: id });
//       console.log("Connected to MongoDB");
//       // Delete the Agent
//       await User.findByIdAndDelete(id);
//       console.log("Connected to MongoDB");

//       return NextResponse.json({
//         success: true,
//         message: "Agent deleted successfully",
//       });
//     } catch (error) {
//       console.error("Transaction error:", error);
//       return NextResponse.json(
//         { success: false, error: "Deletion failed: " + error.message },
//         { status: 500 }
//       );
//     } finally {
//       console.log("finally");
//     }
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { success: false, error: "Deletion failed: " + error.message },
//       { status: 500 }
//     );
//   }
// }
