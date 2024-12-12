import { Agent, Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import styles from "@/app/ui/dashboard/users/users.module.css";

export const SMSButton = async ({ payment, phoneNum }) => {
  await connectToDb();

  // get the user using the payment.userId

  const { firstName, lastName } = await User.findById(payment.userId);
  console.log(firstName, lastName);

  // get the agent using the payment.agentId

  const agent = await Agent.findById(payment.agentId);
  let multiplier;
  if (agent.equbType === "monthly") {
    multiplier = 30;
  } else if (agent.equbType === "weekly") {
    multiplier = 7;
  } else if (agent.equbType === "daily") {
    multiplier = 1;
  }
  const getEarlyDate = async (payment) => {
    "use server";
    let equbId = payment.userId;
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
      const ethiopianDayNames = [
        "እሁድ",
        "ሰኞ",
        "ማክሰኞ",
        "ረቡዕ",
        "ሀሙስ",
        "አርብ",
        "ቅዳሜ",
      ];

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
      // Find the earliest payment for the given 'equbId'
      let earliestPayment;
      try {
        earliestPayment = await Payment.findOne({
          userId: equbId,
        })
          .sort({ createdAt: 1 }) // Sort by createdAt in ascending order
          .exec(); // Execute the query
      } catch (err) {
        console.error("Failed to find earliest payment for this Equb", err);
      }

      if (!earliestPayment) {
        console.log("No payments found for this Equb.");
        const theDate = new Date();
        return convertToEthiopianDateMoreEnhanced(theDate);
      }

      const earliestPaymentDate = earliestPayment.createdAt;
      const currentPaymentDate = payment.createdAt;

      // Calculate the number of payments made before the current payment
      const numberOfPaymentsLessThanCurrent = await Payment.countDocuments({
        userId: equbId,
        status: "received",
        createdAt: {
          $lt: currentPaymentDate,
        },
      });

      // Calculate the date for the current payment
      const nextDayDate = new Date(earliestPaymentDate);
      nextDayDate.setDate(
        nextDayDate.getDate() + multiplier * numberOfPaymentsLessThanCurrent
      );

      const theDate = nextDayDate;
      return convertToEthiopianDateMoreEnhanced(theDate);
    } catch (err) {
      console.error(err);
      throw new Error("Something went wrong!");
    }
  };
  const earlyDate = await getEarlyDate(payment);

  return (
    <>
      <a
        className={`${styles.button} ${styles.view}`}
        href={`sms:${phoneNum}?body=ውድ ደንበኛችን ${firstName} ${lastName} እቁቦን በቀን ${earlyDate.day}/${earlyDate.month}/${earlyDate.year} ${earlyDate.dayName} ዕለት ${payment.amount} ብር ከፍለዋል ።%0Aለማንኛውም አስተያየት ወይም ጥያቄ ወደ 0905059016 ወይም 0716892549 ይደውሉ፣ እናመሰግናለን! ኪያ እቁብ`}
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
        <span>Send SMS</span>
      </a>
    </>
  );
};
