// File: /app/api/equbs/unpaid/route.js
import { connectToDb } from "@/lib/utils";
import { Payment, Equb } from "@/lib/models";
import { NextResponse } from "next/server";

export const POST = async (req) => {
  console.log("POST /api/equbs-missing-payments");
  try {
    // Parse the request body to get the date
    const body = await req.json();
    console.log("Incoming request body:", body);

    const { date } = body;

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const targetDate = new Date(date);
    console.log("Parsed date:", targetDate);

    // Connect to the database
    await connectToDb();

    // Fetch all equbs
    const equbs = await Equb.find();

    const results = await Promise.all(
      equbs.map(async (equb) => {
        const earliestPayment = await Payment.findOne({
          forEqub: equb._id,
          status: "received",
        })
          .sort({ createdAt: 1 })
          .exec();

        if (!earliestPayment) {
          return {
            equbId: equb._id,
            equbName: equb.name,
            lastPaymentDate: null,
            isPaid: false,
          };
        }

        // Calculate last payment date dynamically
        const numberOfPayments = await Payment.countDocuments({
          forEqub: equb._id,
          status: "received",
        });
        const lastPaymentDate = new Date(earliestPayment.createdAt);
        lastPaymentDate.setDate(
          lastPaymentDate.getDate() + numberOfPayments - 1
        );

        // Determine if the target date is paid
        const isPaid =
          targetDate <= new Date() && targetDate <= lastPaymentDate;

        return {
          equbId: equb._id,

          equbName: equb.name,
          lastPaymentDate,
          isPaid,
        };
      })
    );

    return NextResponse.json(results);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
};
