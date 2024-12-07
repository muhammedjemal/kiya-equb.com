import { auth } from "@/lib/auth";
import { Equb, Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import BhB from "./client";

const EqubDetails = async ({ equb }) => {
  const handleDelete = async (formData) => {
    "use server";
    const { id } = Object.fromEntries(formData);
    // Implement delete functionality here
    console.log("Delete Equb");
    await connectToDb();
    console.log("Delete Equb");
    await Payment.deleteMany({ forEqub: id }); // Adjust the field name based on your schema

    await Equb.findByIdAndDelete(id);
    console.log("Delete Equb");
    revalidatePath("/admin/equbs");
    revalidatePath("/admin/users/");
    revalidatePath("/admin/users/[id]");
    revalidatePath("/admin/payments/[id]");
  };
  function convertToEthiopianDateMoreEnhanced(gregorianDate) {
    try {
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
    } catch {
      return null;
    }
  }
  const loggedInUser = await auth();
  let { user } = loggedInUser;
  console.log(user);
  // identify if he is either collector or manager or neither
  await connectToDb();
  const userLive = await User.findById(user.id);

  return (
    <div style={styles.equbDetails}>
      <div style={styles.field}>
        <strong>Equb type:</strong> {equb?.type}
      </div>
      <div style={styles.field}>
        <strong>Equb name:</strong> {equb?.name}
      </div>
      <div style={styles.field}>
        <strong>Equb amount:</strong> {equb?.amount}
      </div>
      <div style={styles.field}>
        <strong>Equb Start Date : </strong>
        {convertToEthiopianDateMoreEnhanced(equb.createdAt).dayName +
          " " +
          convertToEthiopianDateMoreEnhanced(equb.createdAt).day +
          "-" +
          convertToEthiopianDateMoreEnhanced(equb.createdAt).month +
          "-" +
          convertToEthiopianDateMoreEnhanced(equb.createdAt).year}
      </div>
      <div style={styles.field}>
        {equb.endDate && <strong>Equb End date : </strong>}
        {equb.endDate &&
          convertToEthiopianDateMoreEnhanced(equb.endDate)?.dayName + " "}
        {equb.endDate &&
          convertToEthiopianDateMoreEnhanced(equb.endDate)?.day + " "}
        {equb.endDate &&
          convertToEthiopianDateMoreEnhanced(equb.endDate)?.month + " "}
        {equb.endDate && convertToEthiopianDateMoreEnhanced(equb.endDate)?.year}{" "}
      </div>
      <div style={styles.field}>
        <strong>Payments : </strong>
        <Link style={styles.fieldButton} href={`/admin/payments/${equb?._id}`}>
          Show Payments
        </Link>
      </div>
      {((userLive.collectorOf === null && userLive.oprator !== true) ||
        (userLive.isSystemAdmin === true && userLive.oprator !== true)) && (
        // <form action={handleDelete}>
        //   <input type="hidden" value={equb?._id} name="id" />
        //   <button style={styles.deleteButton}>⚠ Delete Equb</button>
        // </form>

        <BhB equb={equb} />
      )}
    </div>
  );
};

const styles = {
  equbDetails: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#0d0c22",
    marginTop: "20px",
    color: "white",
  },
  field: {
    marginBottom: "15px",
  },
  fieldButton: {
    marginBottom: "15px",
    backgroundColor: "green",
  },
  toggleButton: {
    backgroundColor: "#253352",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "3px",
    cursor: "pointer",
    marginLeft: "10px",
  },
  paymentsList: {
    listStyleType: "none",
    padding: "0",
    marginTop: "10px",
  },
  paymentItem: {
    padding: "5px 0",
    borderBottom: "1px solid #ddd",
  },
  deleteButton: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  paymentButton: {
    backgroundColor: "blue",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default EqubDetails;
