import { Payment } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

export const CollectorTodaysAmount = async ({ collector, day }) => {
  if (!collector || !collector.id) {
    return <div>Invalid collector information</div>;
  }

  let today;
  let startOfDay;
  let endOfDay;
  if (day === "yesterday") {
    today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    startOfDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    endOfDay = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate() + 1
    );
  } else if (day === "bYesterday") {
    today = new Date();
    const bYesterday = new Date(today);
    bYesterday.setDate(today.getDate() - 2);
    startOfDay = new Date(
      bYesterday.getFullYear(),
      bYesterday.getMonth(),
      bYesterday.getDate()
    );
    endOfDay = new Date(
      bYesterday.getFullYear(),
      bYesterday.getMonth(),
      bYesterday.getDate() + 1
    );
  } else if (day === "b3day") {
    today = new Date();
    const bYesterday = new Date(today);
    bYesterday.setDate(today.getDate() - 3);
    startOfDay = new Date(
      bYesterday.getFullYear(),
      bYesterday.getMonth(),
      bYesterday.getDate()
    );
    endOfDay = new Date(
      bYesterday.getFullYear(),
      bYesterday.getMonth(),
      bYesterday.getDate() + 1
    );
  } else if (day === "b4day") {
    today = new Date();
    const bYesterday = new Date(today);
    bYesterday.setDate(today.getDate() - 4);
    startOfDay = new Date(
      bYesterday.getFullYear(),
      bYesterday.getMonth(),
      bYesterday.getDate()
    );
    endOfDay = new Date(
      bYesterday.getFullYear(),
      bYesterday.getMonth(),
      bYesterday.getDate() + 1
    );
  } else {
    today = new Date();
    startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );
  }

  await connectToDb();

  // Query payments by date range and collector ID
  const todayPayments = await Payment.find({
    to: collector.id,
    $or: [
      {
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        $and: [
          { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
          { startDate: { $exists: false } }, // Ensure startDate does not exist
        ],
      },
      {
        startDate: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        isStartDay: true,
      },
    ],
  });

  let sum = 0;
  todayPayments.forEach((payment) => {
    sum += payment.amount;
  });

  return (
    <div>
      {sum} Birr from {todayPayments.length} Payments
    </div>
  );
};
