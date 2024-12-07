import { Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

export const CollectorsTodaysAmount = async ({ mngrId, day }) => {
  if (!mngrId) {
    return <div>No manager ID provided</div>;
  }

  await connectToDb();
  console.log(mngrId);

  // Find collectors based on the mngrId
  const collectors = await User.find({
    underManager: mngrId, // Make sure mngrId is defined and matches the type
  });

  if (collectors.length === 0) {
    console.log(collectors);
    return <div>No collectors assigned so far</div>;
  }

  const collectorIds = collectors.map((collector) => collector.id);

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

  // Query payments for the array of collector IDs
  const todayPayments = await Payment.find({
    to: { $in: collectorIds },
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
  // Query payments for the array of collector IDs for starting ones

  // Aggregate payments for all collectors
  let totalSum = 0;
  const uniqueCollectors = new Set();

  todayPayments.forEach((payment) => {
    totalSum += payment.amount;
    uniqueCollectors.add(payment.to);
  });

  const numOfCollectors = uniqueCollectors.size;

  return (
    <div>
      {totalSum} Birr from {numOfCollectors} collectors
    </div>
  );
};
