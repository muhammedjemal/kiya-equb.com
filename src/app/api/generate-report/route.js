import { connectToDb } from "@/lib/utils";
import { User, Payment, Equb } from "@/lib/models";
import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
function convertToEthiopianDateMoreEnhanced(gregorianDate) {
  // Define the Ethiopian month names
  const ethiopianMonthNames = [
    "መስከረም",
    "ጥቅምት",
    "ህዳር",
    "ታህሳስ",
    "ጥር",
    "የካቲት",
    "መጋቢት",
    "ሚያዝያ",
    "ግንቦት",
    "ሰኔ",
    "ሀምሌ",
    "ነሀሴ",
    "ጳጉሜ",
  ];

  // Define the Ethiopian day names
  const ethiopianDayNames = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሀሙስ", "አርብ", "ቅዳሜ"];

  // Extract Gregorian date components
  const year = gregorianDate.getFullYear();
  const month = gregorianDate.getMonth() + 1; // getMonth() is zero-based
  const day = gregorianDate.getDate();

  // Convert to Julian day number
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const julianDay =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045;

  // Ethiopian calendar conversion
  const ethiopianEpoch = 1723856; // Julian day number of the Ethiopian epoch
  const r = (julianDay - ethiopianEpoch) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);
  let ethYear =
    4 * Math.floor((julianDay - ethiopianEpoch) / 1461) +
    Math.floor(r / 365) -
    Math.floor(r / 1460);
  let ethMonth = Math.floor(n / 30) + 1;
  let ethDay = (n % 30) + 1;

  // Handle the 13th month (Pagumē)
  if (ethMonth === 13 && ethDay > 5) {
    if ((ethYear + 1) % 4 === 0) {
      // Leap year, Pagumē has 6 days
      if (ethDay === 6) {
        ethDay = 1;
        ethMonth = 1;
        ethYear++;
      }
    } else {
      // Non-leap year, Pagumē has 5 days
      ethDay = 1;
      ethMonth = 1;
      ethYear++;
    }
  }

  // Handle the case when n == 365 in a leap year
  if (n === 365) {
    ethDay = 6;
    ethMonth = 13;
  }

  const ethMonthName = ethiopianMonthNames[ethMonth - 1];

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const gregorianDayOfWeek = gregorianDate.getDay();
  const ethDayName = ethiopianDayNames[gregorianDayOfWeek];

  return {
    year: ethYear,
    month: ethMonthName,
    day: ethDay,
    dayName: ethDayName,
  };
}
export const POST = async (request) => {
  try {
    await connectToDb();

    const { managerId } = await request.json();
    console.log("Manager ID:", managerId); // Debug log for managerId
    console.log("Users under manager:"); // Debug log for users

    // Fetch the manager details
    const manager = await User.findById(managerId);
    console.log("Users under manager:"); // Debug log for users
    console.log("Manager:", manager); // Debug log for manager
    console.log("Manager:", manager.managerMembers); // Debug log for manager

    if (!manager || manager.managerMembers === null) {
      console.log("Users under manager:"); // Debug log for users
      return NextResponse.json(
        { error: "Manager not found or has no members." },
        { status: 404 }
      );
    }
    console.log("Users under manager:"); // Debug log for users

    // Fetch all users under the manager by matching the 'underManager' field with the manager's ID
    const usersUnderManager = await User.find({
      underManager: new mongoose.Types.ObjectId(managerId),
    });
    console.log("Users under manager:", usersUnderManager); // Debug log for users
    console.log("Users under manager:"); // Debug log for users
    // Prepare the Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Manager Report");
    console.log("Users under manager:"); // Debug log for users

    // Add column headers
    worksheet.columns = [
      { header: "User First Name", key: "firstName", width: 20 },
      { header: "User Last Name", key: "lastName", width: 20 },
      { header: "Phone Number", key: "phoneNumber", width: 20 },
      { header: "Equb No.", key: "equbNo", width: 10 },
      { header: "Equb Name", key: "equbName", width: 20 },
      { header: "Equb Type", key: "equbType", width: 15 },
      { header: "Equb Amount", key: "equbAmount", width: 15 },
      { header: "Payments Count", key: "paymentsCount", width: 15 },
      { header: "Last Payment Date", key: "lastPaymentDate", width: 20 },
    ];
    console.log("Users under manager:"); // Debug log for users

    // Iterate through users and add relevant data
    for (const user of usersUnderManager) {
      console.log(`Processing user: ${user.firstName} ${user.lastName}`); // Debug log for user processing

      const equbs = await Equb.find({ owner: user._id });
      console.log(`Equbs found for user: ${equbs.length}`); // Debug log for equbs found
      console.log("Users under manager:"); // Debug log for users

      // Process each equb for the user
      for (const equb of equbs) {
        const payments = await Payment.find({
          forEqub: equb._id,
          status: "received",
        });
        console.log(
          `Payments found for equb "${equb.name}": ${payments.length}`
        ); // Debug log for payments found

        // Get the last payment date dynamically
        const lastPayment = payments.sort(
          (a, b) => b.createdAt - a.createdAt
        )[0];
        const lastPaymentDate = lastPayment
          ? convertToEthiopianDateMoreEnhanced(new Date(lastPayment.createdAt))
              .dayName +
            " " +
            convertToEthiopianDateMoreEnhanced(new Date(lastPayment.createdAt))
              .day +
            "-" +
            convertToEthiopianDateMoreEnhanced(new Date(lastPayment.createdAt))
              .month +
            "-" +
            convertToEthiopianDateMoreEnhanced(new Date(lastPayment.createdAt))
              .year
          : "N/A";

        worksheet.addRow({
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          equbNo: equbs.indexOf(equb) + 1, // Sequential equb number for each user
          equbName: equb.name,
          equbType: equb.type, // Include equb type
          equbAmount: equb.amount, // Include equb type
          paymentsCount: payments.length, // Count of payments for this equb
          lastPaymentDate: lastPaymentDate,
        });
      }
    }
    console.log("Users under manager:"); // Debug log for users

    // Generate the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    console.log("Users under manager:"); // Debug log for users

    return new NextResponse(buffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename=manager-report.xlsx`,
      },
    });
  } catch (err) {
    console.error("Error generating report:", err);
    return NextResponse.json(
      { error: "Server error, Failed!" },
      { status: 500 }
    );
  }
};
