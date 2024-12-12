import Pagination from "@/app/ui/dashboard/pagination/pagination";
import styles from "@/app/ui/dashboard/users/users.module.css";
import { User, Payment } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import Payer from "@/components/Payer";
import { auth } from "@/lib/auth";
import { Suspense } from "react";
import { PaymentReceiver } from "@/components/PaymentReceiver";
// import { SendSMS } from "@/components/SendSMS";
let payer;

const fetchPayments = async (q, page, payer) => {
  const ITEM_PER_PAGE = 10;

  try {
    await connectToDb();
    let count;
    let payments;

    if (payer) {
      // If payer is defined, count documents with 'to: payer'
      count = await Payment.countDocuments({ to: payer });
    } else {
      // If payer is not defined, get an estimated count of all documents
      count = await Payment.estimatedDocumentCount();
    }
    let pipeline = [
      {
        $addFields: {
          sortField: {
            $cond: {
              if: {
                $and: [
                  { $ne: ["$startDate", null] }, // Ensure startDate is not null
                  "$isStartDay", // Ensure isStartDay is true
                ],
              },
              then: "$startDate", // Use startDate for sorting if condition is true
              else: "$createdAt", // Use createdAt otherwise
            },
          },
        },
      },
      {
        $sort: {
          sortField: -1, // Sort by 'sortField' in descending order (newest first)
        },
      },
      {
        $skip: ITEM_PER_PAGE * (page - 1), // Pagination: skip documents based on the page number
      },
      {
        $limit: ITEM_PER_PAGE, // Limit the number of documents per page
      },
    ];

    pipeline.unshift({
      $match: {
        to: null,
      },
    });

    payments = await Payment.aggregate(pipeline);

    return { count, payments };
  } catch (err) {
    console.log(err);
    console.log("Failed to fetch payments!");
  }
};

const UsersPage = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;
  ///////
  const loggedInUser = await auth();
  let { user } = loggedInUser;
  console.log(user);
  // identify if he is either collector or manager or neither
  await connectToDb();
  const userLive = await User.findById(user.id);

  console.log(userLive);

  if (!(userLive.isSystemAdmin === true)) {
    // set payer to the id of the user
    payer = userLive.id;
  }
  /////////
  const { count, payments } = await fetchPayments(q, page, payer);
  /////////////////////////////////////////////
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

  return (
    <div className={styles.container}>
      <div className={styles.top}></div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Amount</td>
            <td>Payment Date</td>
            <td>Name of the Equber</td>
            <td>Payment Receiver</td>
            <td>Status</td>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>
                <div className={styles.user}>
                  <Link href={`${payment.imageProof || "/dollar.png"}`}>
                    <Image
                      src={payment.imageProof || "/dollar.png"} // productionADD
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImageWallet}
                    />
                  </Link>
                  <Link href={`/admin/payments/${payment.forEqub}`}>
                    {payment.amount + " Birr"}
                  </Link>
                </div>
              </td>
              <td>
                {convertToEthiopianDateMoreEnhanced(
                  payment.isStartDay === true
                    ? payment.startDate
                    : payment.createdAt
                ).dayName +
                  " " +
                  convertToEthiopianDateMoreEnhanced(
                    payment.isStartDay === true
                      ? payment.startDate
                      : payment.createdAt
                  ).day +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(
                    payment.isStartDay === true
                      ? payment.startDate
                      : payment.createdAt
                  ).month +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(
                    payment.isStartDay === true
                      ? payment.startDate
                      : payment.createdAt
                  ).year}
              </td>
              <td>
                <Payer paymentId={payment._id} />
              </td>
              <td>
                {" "}
                <Suspense fallback={<div>Loading...</div>}>
                  <PaymentReceiver payment={payment} />
                </Suspense>
              </td>
              <td>{payment.status}</td>
              <td>
                <div className={styles.buttons}>
                  <Link href={`/admin/payments/${payment.forEqub}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View More
                    </button>
                  </Link>
                  {/* send sms button with user's phone and specifing the payment amount on the user's default messaging app */}
                  {/* <SendSMS payment={payment} /> */}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default UsersPage;
