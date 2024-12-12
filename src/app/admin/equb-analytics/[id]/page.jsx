// import { Equb } from "@/lib/models";

// const UsersPage = async ({ searchParams, params }) => {
//   //   const page = searchParams?.page || 1;

//   const equbId = params.id;
//   await connectToDb();

//   const equb = await Equb.findById(equbId);

//   if (!equb) {
//     return (
//       <div className={styles.container}>
//         <h1>Equb not found</h1>
//       </div>
//     );
//     }
//     // sum the equb

// };

// export default UsersPage;

// pages/payments.js

"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
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
const PaymentsPage = ({ searchParams, params }) => {
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const equbId = params.id;

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const dummyEqubIdData = { id: equbId };
        const response = await axios.post(
          "/api/payments-of-equb",
          dummyEqubIdData
        );

        // Extract relevant data
        const fetchedPayments = response.data.payments.map((payment) => ({
          id: payment.status,
          createdAt: payment.createdAt,
          amount: payment.amount,
        }));

        // Calculate total amount
        const total = fetchedPayments.reduce(
          (sum, payment) => sum + payment.amount,
          0
        );

        setPayments(fetchedPayments);
        setTotalAmount(total);
      } catch (error) {
        console.error(
          "Error fetching payments:",
          error.response.data || error.message
        );
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Payments Summary</h1>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "20px",
        }}
      >
        <thead>
          <tr>
            <th style={styles.th}>Payment Status</th>
            <th style={styles.th}>Payment Date</th>
            <th style={styles.th}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td style={styles.td}>{payment.id}</td>
              <td style={styles.td}>
                {convertToEthiopianDateMoreEnhanced(new Date(payment.createdAt))
                  .dayName +
                  " " +
                  convertToEthiopianDateMoreEnhanced(
                    new Date(payment.createdAt)
                  ).day +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(
                    new Date(payment.createdAt)
                  ).month +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(
                    new Date(payment.createdAt)
                  ).year}
              </td>
              <td style={styles.td}>{payment.amount}</td>
            </tr>
          ))}
          <tr>
            <td style={styles.td}></td>
            <td style={styles.td}>
              <strong>Total</strong>
            </td>
            <td style={styles.td}>
              <strong>{totalAmount + " Birr"}</strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
    backgroundColor: "#000",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "left",
  },
};

export default PaymentsPage;
