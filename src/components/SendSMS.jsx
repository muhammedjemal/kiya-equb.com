import { Equb, Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import styles from "@/app/ui/dashboard/users/users.module.css";

const getPhoneNumber = async function (equbId) {
  "use server";
  await connectToDb();
  // find the user which has the equb id inside its array of activeEqubs of the user

  const theEqub = await Equb.findById(equbId);
  const userId = theEqub.owner;
  const user = await User.findById(userId);
  const phoneN = user.phoneNumber;
  console.log(phoneN);
  return phoneN;
};
const getEarlyDate = async (equb) => {
  "use server";
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
  try {
    await connectToDb();
    // find latest paid Equb using the createdAt property of Equbs and prepare a date variable which adds 1 month from that earlier paid Equb date
    //......//
    // Find the latest payment for the given Equb ID, sorted by createdAt in descending order
    let latestPayment;
    try {
      latestPayment = await Payment.findOne({
        forEqub: equb.id,
        status: "received",
      })
        .sort({ createdAt: 1 })
        .exec();
    } catch (err) {
      console.log("Failed to find latest payment for this Equb", err);
    }
    // date coversion ...
    // Function to convert Gregorian date to Ethiopian date

    // date coversion.
    if (!latestPayment) {
      console.log("No payments found for this Equb.");
      // return current date (now)
      const theDate = new Date();
      const etDate = convertToEthiopianDateMoreEnhanced(theDate);
      return etDate;
    }

    // there is !
    const earliestPaymentDate = latestPayment.createdAt;
    const numberOfPayments = await Payment.countDocuments({ forEqub: equb.id });
    // Get the createdAt date of the latest payment
    // if 1 day
    // Prepare a date which is greater by 1 day
    const nextDayDate = new Date(earliestPaymentDate);
    nextDayDate.setDate(nextDayDate.getDate() + numberOfPayments);

    // Return the next day's date
    const theDate = nextDayDate;
    const etDate = convertToEthiopianDateMoreEnhanced(theDate);
    return etDate;
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete Equb!");
  }
};
export const SendSMS = async ({ payment }) => {
  const equbId = payment.forEqub;
  await connectToDb();
  let equb;
  try {
    equb = await Equb.findById(equbId);
  } catch (err) {
    console.log(err);
  }

  const earlyDate = await getEarlyDate(equb);
  const phoneNum = await getPhoneNumber(equbId);

  return (
    <a
      className={`${styles.button} ${styles.view}`}
      href={`sms:${phoneNum}?body=ውድ ደንበኛችን እቁቦን በቀን ${earlyDate.day}/${earlyDate.month}/${earlyDate.year} ${earlyDate.dayName} ዕለት ${payment.amount} ብር ከፍለዋል ።%0Aለማንኛውም አስተያየት ወይም ጥያቄ ወደ 0905059016 ወይም 0716892549 ይደውሉ፣ እናመሰግናለን! ኪያ እቁብ`}
      style={{ verticalAlign: "middle" }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
        fill="white"
        style={{ verticalAlign: "middle" }}
      >
        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
      </svg>
      <span>SMS</span>
    </a>
  );
};
