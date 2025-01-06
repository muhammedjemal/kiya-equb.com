import styles from "@/app/ui/dashboard/users/users.module.css";
import stylesDate from "./stylesDate.module.css";
import { Equb, User, Payment } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache"; // revalidatePath
import { Owner } from "@/components/Owner";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { PaymentReceiver } from "@/components/PaymentReceiver";
import Payer from "@/components/Payer";
import { SMSButton } from "@/components/SMSButton2";
import { PaymentDate } from "@/components/PaymentDate";
import BhB from "./client";
import BhB2 from "./client2";
import Pagination from "@/app/ui/dashboard/pagination/pagination";
var equb;
const fetchPayments = async (page, equbId) => {
  const ITEM_PER_PAGE = 10;
  await connectToDb();
  try {
    let count;
    let payments;
    count = await Payment.countDocuments({ userId: equbId });
    // count = await Payment.estimatedDocumentCount();

    payments = await Payment.aggregate([
      {
        $match: { userId: equbId },
      },

      {
        $sort: {
          createdAt: -1, // Sort by 'sortField' in descending order (newest first)
        },
      },
      {
        $skip: ITEM_PER_PAGE * (page - 1), // Pagination: skip documents based on the page number
      },
      {
        $limit: ITEM_PER_PAGE, // Limit the number of documents per page
      },
    ]);
    // } else {
    //   payments = await Payment.find({ $or: [{ to: payer }] })
    //     .sort({ createdAt: -1 })
    //     .limit(ITEM_PER_PAGE)
    //     .skip(ITEM_PER_PAGE * (page - 1));
    // }
    return { count, payments };
  } catch (err) {
    console.log(err);
    console.log("Failed to fetch payments!");
  }
};

// const getEarlyDate = async (equb) => {
//   "use server";
//   function convertToEthiopianDateMoreEnhanced(gregorianDate) {
//     // Define the Ethiopian month names
//     const ethiopianMonthNames = [
//       "መስከረም",
//       "ጥቅምት",
//       "ህዳር",
//       "ታህሳስ",
//       "ጥር",
//       "የካቲት",
//       "መጋቢት",
//       "ሚያዝያ",
//       "ግንቦት",
//       "ሰኔ",
//       "ሀምሌ",
//       "ነሀሴ",
//       "ጳጉሜ",
//     ];

//     // Define the Ethiopian day names
//     const ethiopianDayNames = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሀሙስ", "አርብ", "ቅዳሜ"];

//     // Extract Gregorian date components
//     const year = gregorianDate.getFullYear();
//     const month = gregorianDate.getMonth() + 1; // getMonth() is zero-based
//     const day = gregorianDate.getDate();

//     // Convert to Julian day number
//     const a = Math.floor((14 - month) / 12);
//     const y = year + 4800 - a;
//     const m = month + 12 * a - 3;
//     const julianDay =
//       day +
//       Math.floor((153 * m + 2) / 5) +
//       365 * y +
//       Math.floor(y / 4) -
//       Math.floor(y / 100) +
//       Math.floor(y / 400) -
//       32045;

//     // Ethiopian calendar conversion
//     const ethiopianEpoch = 1723856; // Julian day number of the Ethiopian epoch
//     const r = (julianDay - ethiopianEpoch) % 1461;
//     const n = (r % 365) + 365 * Math.floor(r / 1460);
//     let ethYear =
//       4 * Math.floor((julianDay - ethiopianEpoch) / 1461) +
//       Math.floor(r / 365) -
//       Math.floor(r / 1460);
//     let ethMonth = Math.floor(n / 30) + 1;
//     let ethDay = (n % 30) + 1;

//     // Handle the 13th month (Pagumē)
//     if (ethMonth === 13 && ethDay > 5) {
//       if ((ethYear + 1) % 4 === 0) {
//         // Leap year, Pagumē has 6 days
//         if (ethDay === 6) {
//           ethDay = 1;
//           ethMonth = 1;
//           ethYear++;
//         }
//       } else {
//         // Non-leap year, Pagumē has 5 days
//         ethDay = 1;
//         ethMonth = 1;
//         ethYear++;
//       }
//     }

//     // Handle the case when n == 365 in a leap year
//     if (n === 365) {
//       ethDay = 6;
//       ethMonth = 13;
//     }

//     const ethMonthName = ethiopianMonthNames[ethMonth - 1];

//     // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
//     const gregorianDayOfWeek = gregorianDate.getDay();
//     const ethDayName = ethiopianDayNames[gregorianDayOfWeek];

//     return {
//       year: ethYear,
//       month: ethMonthName,
//       day: ethDay,
//       dayName: ethDayName,
//     };
//   }
//   try {
//     await connectToDb();
//     // find latest paid Equb using the createdAt property of Equbs and prepare a date variable which adds 1 month from that earlier paid Equb date
//     //......//
//     // Find the latest payment for the given Equb ID, sorted by createdAt in descending order
//     const latestPayment = await Payment.findOne({
//       forEqub: equb.id,
//       status: "received",
//     })
//       .sort({ createdAt: -1 })
//       .exec();
//     // date coversion ...
//     // Function to convert Gregorian date to Ethiopian date

//     // date coversion.
//     if (!latestPayment) {
//       console.log("No payments found for this Equb.");
//       // return current date (now)
//       const theDate = new Date();
//       const etDate = convertToEthiopianDateMoreEnhanced(theDate);
//       return etDate;
//     }

//     // Get the createdAt date of the latest payment
//     const latestPaymentDate = latestPayment.createdAt;

//     // if 1 day
//     // Prepare a date which is greater by 1 day
//     const nextDayDate = new Date(latestPaymentDate);
//     nextDayDate.setDate(nextDayDate.getDate() + 1);

//     // Return the next day's date
//     const theDate = nextDayDate;
//     const etDate = convertToEthiopianDateMoreEnhanced(theDate);
//     return etDate;
//   } catch (err) {
//     console.log(err);
//     throw new Error("newwerr!");
//   }
// };

const deletePayment = async (formData) => {
  "use server";
  const { id } = Object.fromEntries(formData);

  try {
    await connectToDb();
    await Payment.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete Equb!");
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/equbs");
  revalidatePath("/admin/users/[id]");
  revalidatePath("/admin/users");
};
const approvePayment = async (formData) => {
  "use server";
  const { id } = Object.fromEntries(formData);

  try {
    await connectToDb();
    // approve the payment by updating its status which is pending to "approved"
    await Payment.findByIdAndUpdate(id, { status: "received" });
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete Equb!");
  }

  revalidatePath("/admin/payments");
  revalidatePath("/admin/equbs");
  revalidatePath("/admin/users/[id]");
  revalidatePath("/admin/users");
};
const createPayment = async (formData) => {
  "use server";

  const { amount, equbId, receiverId, date } = Object.fromEntries(formData);
  await connectToDb();
  console.log(date);
  function validateDate(dateString) {
    // Regular expression to check the date format 'YYYY-MM-DD'
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    // Check if the date string matches the pattern
    if (!datePattern.test(dateString)) {
      throw new Error("Date is not in the correct format. Use YYYY-MM-DD.");
    }

    // Split the date string into components
    const [year, month, day] = dateString.split("-").map(Number);

    // Check if the year, month, and day are valid numbers
    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      throw new Error("Year, month, or day is not a valid number.");
    }

    // Check if year, month, and day are within valid ranges
    if (year < 1000 || year > 9999) {
      throw new Error("Year must be between 1000 and 9999.");
    }
    if (month < 1 || month > 12) {
      throw new Error("Month must be between 1 and 12.");
    }
    if (day < 1 || day > 31) {
      throw new Error("Day must be between 1 and 31.");
    }

    // Create a Date object from the components
    const date = new Date(year, month - 1, day);

    // Check if the date object is valid
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      throw new Error("Date is invalid. Check for correct month and day.");
    }

    // If all checks pass, the date is valid
    return true;
  }

  if (!amount) {
    return;
  }
  if (amount === "0") {
    return;
  }

  if (date) {
    let okDate = false;
    try {
      validateDate(date);
      okDate = true;
    } catch {
      console.log("date is invalid");
    }
    if (!okDate) {
      return;
    }
  }
  const earliestPayment = await Payment.findOne({
    forEqub: equbId,
  })
    .sort({ createdAt: 1 }) // Sort in ascending order to get the earliest payment
    .exec();

  if (earliestPayment) {
    const earliestPaymentDate = new Date(earliestPayment.createdAt);
    const currentDate = new Date();

    console.log("Earliest Payment Date:", earliestPaymentDate);
    console.log("Current Date:", currentDate);

    // Check if the current date is not newer than the earliest payment date
    if (currentDate <= earliestPaymentDate) {
      console.log("Current date is not newer than the earliest payment date.");
      return; // Do nothing and exit
    }
  }

  console.log("Executed");
  // if this current person created a payment that is not approved and creeating another should be returned
  if (
    await Payment.findOne({
      to: receiverId,
      forEqub: equbId,
      status: "pending",
    })
  ) {
    console.log("pending  Payment already exists from this  receiver");
    return;
  }

  try {
    const theDate = new Date();
    let payment;
    if (date) {
      payment = new Payment({
        amount: amount,
        forEqub: equbId,
        to: receiverId,
        createdAt: date,
        isStartDay: true,
        startDate: theDate,
        date: theDate,
        imageProof: "",
        from: "",
        status: "pending",
        seen: false,
      });
      await payment.save();
    }
    if (!date) {
      payment = new Payment({
        amount: amount,
        forEqub: equbId,
        to: receiverId,
        date: theDate,
        imageProof: "",
        from: "",
        status: "pending",
        seen: false,
        isStartDay: false,
      });
      await payment.save();
    }
  } catch {
    console.log("error saving the payment");
    return (
      <div className={styles.container}>
        <h1>error saving the payment</h1>
      </div>
    );
  }
  revalidatePath("/admin/payments");
  revalidatePath("/admin/payments/[id]");
};
// const getPhoneNumber = async function (equbId) {
//   "use server";
//   await connectToDb();
//   // find the user which has the equb id inside its array of activeEqubs of the user

//   const theEqub = await User.find({ agentId: equbId });
//   const userId = theEqub.owner;
//   const user = await User.findById(userId);
//   const phoneN = user.phoneNumber;
//   console.log(phoneN);
//   return { phoneNum: phoneN, userUnderMgr: user.underManager };
// };
const UsersPage = async ({ searchParams, params }) => {
  const page = searchParams?.page || 1;

  const equbId = params.id;
  await connectToDb();

  equb = await User.findById(equbId);
  console.log(equb);
  if (!equb) {
    return (
      <div className={styles.container}>
        <h1>User not found!</h1>
      </div>
    );
  }

  // const payments = await Payment.find({ forEqub: equbId })
  //   .sort({
  //     createdAt: -1,
  //   })
  //   .limit(10);
  const { count, payments } = await fetchPayments(page, equbId);

  console.log(payments);

  // const { phoneNum, userUnderMgr } = await getPhoneNumber(equbId);
  console.log(equb);

  console.log(equb.phoneNumber);
  // equb = equb.toObject(); // Convert to plain object
  console.log(typeof equb); // Should log 'object'
  // console.log(equb instanceof mongoose.Document); // Should log 'true' for Mongoose documents

  // console.log(equb[phoneNum]);

  console.log(equb.phoneNumber);
  // const equb = await Equb.findById(id); // Assuming `Equb` is your Mongoose model

  const phoneNum = equb.phoneNumber;

  const userUnderMgr = equb.underManager;
  console.log(userUnderMgr);
  console.log(phoneNum);
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
    const month = gregorianDate.getMonth() + 1;
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
  const session = await auth();
  const userAuth = session.user;
  const paramsUserId = userAuth.id; //  not params but loggedIn *
  await connectToDb();
  const userLive = await User.findById(paramsUserId);

  return (
    <div className={styles.container}>
      {/* <Suspense fallback={<div>Loading...</div>}> */}
      {/* <Owner equbId={equbId} /> */}
      {/* </Suspense> */}
      <div className={styles.top}>
        {/* <Search placeholder="Search for a user..." /> */}
        {/* <form action={createPayment}>
          <input type="hidden" name="equbId" id="equbId" value={equbId} />
          <input
            type="hidden"
            name="receiverId"
            id="receiverId"
            value={paramsUserId}
          />
          <input
            type="text"
            placeholder="Enter amount"
            name="amount"
            id="amount"
            className={styles.inputs}
          />
          {""}
          {payments.length === 0 && (
            <div className={stylesDate.containerDate}>
              <div className={stylesDate.formDate}>
                <div className={stylesDate.fieldDate}>
                  <label htmlFor="date" className={stylesDate.labelDate}>
                    Select start Date{" "}
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className={stylesDate.inputDate}
                  />
                </div>
              </div>
            </div>
          )}

          {""}
          <button className={` ${styles.green}`}>Confirm</button>
        </form> */}
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Amount</td>
            <td>Payment Date</td>
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
                      src={payment.imageProof || "/dollar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImageWallet}
                    />
                  </Link>
                  {payment.amount + " Birr"}
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
                <Suspense fallback={<div>Loading...</div>}>
                  <PaymentReceiver payment={payment} />
                </Suspense>
              </td>
              <td>{payment.status}</td>
              <td>
                <div className={styles.buttons}>
                  {((payment.status === "pending" &&
                    payment.to === userLive.id) ||
                    (userLive.isSystemAdmin === true &&
                      userLive.oprator !== true) ||
                    (userLive.managerMembers !== null &&
                      userUnderMgr === userLive.id)) && (
                    <BhB payment={payment} />
                    // <form action={deletePayment}>
                    //   <input type="hidden" name="id" value={payment.id} />
                    //   <button className={`${styles.button} ${styles.delete}`}>
                    //     ⚠ Delete
                    //   </button>
                    // </form>
                  )}
                  {((payment.status === "pending" &&
                    payment.to === userLive.id) ||
                    (userLive.isSystemAdmin === true &&
                      userLive.oprator !== true &&
                      payment.status === "pending")) && (
                    <form action={approvePayment}>
                      <input type="hidden" name="id" value={payment._id} />
                      <button className={`${styles.button} ${styles.view}`}>
                        Approve
                      </button>
                    </form>
                    // <BhB2 payment={payment} />
                  )}
                  {/* send sms button with user's phone and specifing the payment amount on the user's default messaging app */}
                  {((payment.status === "pending" &&
                    payment.to === userLive.id) ||
                    userLive.isSystemAdmin === true) && (
                    <SMSButton phoneNum={equb.phoneNumber} payment={payment} />
                  )}
                  {<PaymentDate phoneNum={phoneNum} payment={payment} />}
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
