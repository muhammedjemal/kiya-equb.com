// import { cards } from "../lib/data";
import { User, Payment, Equb } from "@/lib/models";
import Card from "../ui/dashboard/card/card";
import Chart from "../ui/dashboard/chart/chart";
import styles from "../ui/dashboard/dashboard.module.css";
import Rightbar from "../ui/dashboard/rightbar/rightbar";
import { connectToDb } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
const formatCount = (count) => {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1)}M`; // Format millions
  } else if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1)}K`; // Format thousands
  }
  return count.toString(); // Return the original number for less than 1,000
};
const Dashboard = async () => {
  const session1 = await auth();
  const loggedInUser1 = session1.user;
  await connectToDb();
  console.log("d");
  let payer;

  const userLive1 = await User.findById(loggedInUser1.id);
  if (userLive1.firstName === "oprator1") {
    console.log(userLive1.oprator);
  }
  if (!(userLive1.isSystemAdmin === true && userLive1.oprator !== true)) {
    // set payer to the id of the user
    payer = loggedInUser1.id;
  }

  const users = await User.estimatedDocumentCount();
  let payments;
  if (payer) {
    // If payer is defined, count documents with 'to: payer'
    payments = await Payment.countDocuments({ to: payer });
  } else {
    // If payer is not defined, get an estimated count of all documents
    payments = await Payment.estimatedDocumentCount();
  }
  const equbs = await Equb.estimatedDocumentCount();
  const paymentsDisplay = formatCount(payments);
  console.log(users, "userrrrrrrrr");
  console.log(payments, "payyyyyy");
  console.log(equbs, "eqqqqqqqq");
  // find all payments made in the current day (eg. today) based on their createdAt
  const today = new Date();
  const startOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const endOfDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + 1
  );
  const startOfDay2 = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1
  );
  const endOfDay2 = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const startOfDay3 = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 2
  );
  const endOfDay3 = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1
  );

  // const yesterdayPaymentsOther = await Payment.countDocuments({
  //   $or: [
  //     {
  //       createdAt: {
  //         $gte: startOfDay2,
  //         $lt: endOfDay2,
  //       },
  //       $and: [
  //         { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
  //         { startDate: { $exists: false } }, // Ensure startDate does not exist
  //       ],
  //     },
  //     {
  //       startDate: {
  //         $gte: startOfDay2,
  //         $lt: endOfDay2,
  //       },
  //       isStartDay: true,
  //     },
  //   ],
  // });
  // const beforeYesterdayPaymentsOther = await Payment.countDocuments({
  //   $or: [
  //     {
  //       createdAt: {
  //         $gte: startOfDay3,
  //         $lt: endOfDay3,
  //       },
  //       $and: [
  //         { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
  //         { startDate: { $exists: false } }, // Ensure startDate does not exist
  //       ],
  //     },
  //     {
  //       startDate: {
  //         $gte: startOfDay3,
  //         $lt: endOfDay3,
  //       },
  //       isStartDay: true,
  //     },
  //   ],
  // });
  const todayPaymentsQuery = {
    $and: [
      {
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
      },
    ],
  };

  if (payer) {
    todayPaymentsQuery.$and.push({
      $or: [{ to: payer }],
    });
  }
  const todayPayments = await Payment.countDocuments(todayPaymentsQuery);

  // const todayPayments = await Payment.countDocuments({
  //   $and: [
  //     {
  //       // First set of conditions (for today and startDate)
  //       $or: [
  //         {
  //           createdAt: {
  //             $gte: startOfDay,
  //             $lt: endOfDay,
  //           },
  //           $and: [
  //             { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
  //             { startDate: { $exists: false } }, // Ensure startDate does not exist
  //           ],
  //         },
  //         {
  //           startDate: {
  //             $gte: startOfDay,
  //             $lt: endOfDay,
  //           },
  //           isStartDay: true,
  //         },
  //       ],
  //     },
  //     {
  //       // Second condition (for 'to: payer')
  //       $or: [{ to: payer }],
  //     },
  //   ],
  // });

  const beforeYesterdayPaymentsQuery = {
    $and: [
      {
        $or: [
          {
            createdAt: {
              $gte: startOfDay3,
              $lt: endOfDay3,
            },
            $and: [
              { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
              { startDate: { $exists: false } }, // Ensure startDate does not exist
            ],
          },
          {
            startDate: {
              $gte: startOfDay3,
              $lt: endOfDay3,
            },
            isStartDay: true,
          },
        ],
      },
    ],
  };
  if (payer) {
    beforeYesterdayPaymentsQuery.$and.push({
      $or: [{ to: payer }],
    });
  }
  const beforeYesterdayPayments = await Payment.countDocuments(
    beforeYesterdayPaymentsQuery
  );

  const yesterdayPaymentsQuery = {
    $and: [
      {
        $or: [
          {
            createdAt: {
              $gte: startOfDay2,
              $lt: endOfDay2,
            },
            $and: [
              { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
              { startDate: { $exists: false } }, // Ensure startDate does not exist
            ],
          },
          {
            startDate: {
              $gte: startOfDay2,
              $lt: endOfDay2,
            },
            isStartDay: true,
          },
        ],
      },
    ],
  };
  if (payer) {
    yesterdayPaymentsQuery.$and.push({
      $or: [{ to: payer }],
    });
  }
  const yesterdayPayments = await Payment.countDocuments(
    yesterdayPaymentsQuery
  );

  const todayPaymentsAmountQuery = {
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
  };
  if (payer) {
    todayPaymentsAmountQuery.$and = todayPaymentsAmountQuery.$and || []; // Ensure $and is defined if it's not already
    todayPaymentsAmountQuery.$and.push({ to: payer });
  }

  const todayPaymentsAmount = await Payment.find(todayPaymentsAmountQuery);
  const beforeYesterdayPaymentsOtherQuery = {
    $or: [
      {
        createdAt: {
          $gte: startOfDay3,
          $lt: endOfDay3,
        },
        $and: [
          { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
          { startDate: { $exists: false } }, // Ensure startDate does not exist
        ],
      },
      {
        startDate: {
          $gte: startOfDay3,
          $lt: endOfDay3,
        },
        isStartDay: true,
      },
    ],
  };
  if (payer) {
    beforeYesterdayPaymentsOtherQuery.$and =
      beforeYesterdayPaymentsOtherQuery.$and || []; // Ensure $and is defined if it's not already
    beforeYesterdayPaymentsOtherQuery.$and.push({ to: payer });
  }

  const beforeYesterdayPaymentsOther = await Payment.find(
    beforeYesterdayPaymentsOtherQuery
  );
  const yesterdayPaymentsOtherQuery = {
    $or: [
      {
        createdAt: {
          $gte: startOfDay2,
          $lt: endOfDay2,
        },
        $and: [
          { isStartDay: { $ne: true } }, // Ensure isStartDay is not true
          { startDate: { $exists: false } }, // Ensure startDate does not exist
        ],
      },
      {
        startDate: {
          $gte: startOfDay2,
          $lt: endOfDay2,
        },
        isStartDay: true,
      },
    ],
  };
  if (payer) {
    yesterdayPaymentsOtherQuery.$and = yesterdayPaymentsOtherQuery.$and || []; // Ensure $and is defined if it's not already
    yesterdayPaymentsOtherQuery.$and.push({ to: payer });
  }

  const yesterdayPaymentsOther = await Payment.find(
    yesterdayPaymentsOtherQuery
  );
  let sumPayments = 0;
  todayPaymentsAmount.forEach((payment) => {
    sumPayments += payment.amount;
  });
  let sumPaymentsYesterday = 0;
  yesterdayPaymentsOther.forEach((payment) => {
    sumPaymentsYesterday += payment.amount;
  });
  let sumPaymentsBeforeYesterday = 0;
  beforeYesterdayPaymentsOther.forEach((payment) => {
    sumPaymentsBeforeYesterday += payment.amount;
  });
  console.log(sumPayments);

  revalidatePath("/admin");
  const cards1 = [
    {
      id: "/admin/users",
      title: "Total Users",
      number: users,
      change: 0,
    },
    {
      id: "/admin/equbs",
      title: "Total Equbs",
      number: equbs,
      change: 0,
    },
  ];
  const cards2 = [
    {
      id: "/admin/payments",
      title: "Total Payments",
      number: paymentsDisplay,
      change: 0,
    },
    {
      id: "/admin/payments",
      title: "Payments Today",
      number: todayPayments,
      change: 0,
      pay: true,
      amount: sumPayments,
    },
  ];
  const cards3 = [
    {
      id: "/admin",
      title: "Payments Yesterday",
      number: yesterdayPayments,
      change: 0,
      pay: true,
      amount: sumPaymentsYesterday,
    },
    {
      id: "/admin",
      title: "Payments Before Yesterday",
      number: beforeYesterdayPayments,
      change: 0,
      pay: true,
      amount: sumPaymentsBeforeYesterday,
    },
  ];

  return (
    <div className={styles.wrapper}>
      <div className={styles.main}>
        <div className={styles.cards}>
          {userLive1.isSystemAdmin === true &&
            userLive1.oprator !== true &&
            cards1.map((item) => (
              <Card
                item={item}
                key={item.id}
                data={{
                  todayPayments,
                  sumPayments,
                  yesterdayPayments,
                  sumPaymentsYesterday,
                  beforeYesterdayPayments,
                  sumPaymentsBeforeYesterday,
                }}
              />
            ))}
        </div>{" "}
        <div className={styles.cards}>
          {cards2.map((item) => (
            <Card
              item={item}
              key={item.id}
              data={{
                todayPayments,
                sumPayments,
                yesterdayPayments,
                sumPaymentsYesterday,
                beforeYesterdayPayments,
                sumPaymentsBeforeYesterday,
              }}
            />
          ))}
        </div>
        <div className={styles.cards}>
          {cards3.map((item) => (
            <Card
              item={item}
              key={item.id}
              data={{
                todayPayments,
                sumPayments,
                yesterdayPayments,
                sumPaymentsYesterday,
                beforeYesterdayPayments,
                sumPaymentsBeforeYesterday,
              }}
            />
          ))}
        </div>
        <Chart
          data={{
            todayPayments,
            sumPayments,
            yesterdayPayments,
            sumPaymentsYesterday,
            beforeYesterdayPayments,
            sumPaymentsBeforeYesterday,
          }}
        />
      </div>
      <div className={styles.side}>
        <Rightbar />
      </div>
    </div>
  );
};

export default Dashboard;
