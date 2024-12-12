import styles from "@/app/ui/dashboard/users/users.module.css";
import { connectToDb } from "@/lib/utils";
import { Eta } from "@/lib/models";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
const crypto = require("crypto");

function generateUnique4DigitId(phoneNumber) {
  const digits = phoneNumber.slice(4); // Remove +251

  // Use SHA-256 for hashing
  const hash = crypto.createHash("sha256").update(digits).digest("hex");

  // Convert the hash to a 4-digit number
  const numericId = parseInt(hash.slice(0, 4), 16) % 10000;
  return numericId.toString().padStart(4, "0"); // Ensure it's 4 digits long
}

async function unsubscribeUser(formData) {
  "use server";
  try {
    // Connect to the database
    await connectToDb();
    console.log("db connected.");

    // Parse the incoming request body
    const { userId } = Object.fromEntries(formData);
    console.log(userId);

    if (!userId) {
      throw new Error("Invalid request!");
    }

    // Fetch the first (and only) eta from the collection
    const eta = await Eta.findOne();

    if (!eta) {
      throw new Error("Eta not found in the database.");
    }

    // Find and remove the user from the subscribers list
    const subscriberIndex = eta.subscribersList.findIndex(
      (subscriber) => subscriber.userId.toString() === userId
    );

    if (subscriberIndex === -1) {
      throw new Error("User not found in the subscribers list.");
    }

    eta.subscribersList.splice(subscriberIndex, 1);

    // Save the updated eta document
    await eta.save();

    console.log("User unsubscribed successfully.");
    revalidatePath("/admin/eta-payments");
  } catch (err) {
    console.error("Error unsubscribing user:", err);
    throw err;
  }
}
const UsersPage = async () => {
  // Define the Ethiopian date conversion function
  function convertToEthiopianDateMoreEnhanced(gregorianDate) {
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

    const ethiopianDayNames = ["እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሀሙስ", "አርብ", "ቅዳሜ"];

    const year = gregorianDate.getFullYear();
    const month = gregorianDate.getMonth() + 1;
    const day = gregorianDate.getDate();

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

    const ethiopianEpoch = 1723856;
    const r = (julianDay - ethiopianEpoch) % 1461;
    const n = (r % 365) + 365 * Math.floor(r / 1460);
    let ethYear =
      4 * Math.floor((julianDay - ethiopianEpoch) / 1461) +
      Math.floor(r / 365) -
      Math.floor(r / 1460);
    let ethMonth = Math.floor(n / 30) + 1;
    let ethDay = (n % 30) + 1;

    if (ethMonth === 13 && ethDay > 5) {
      if ((ethYear + 1) % 4 === 0) {
        if (ethDay === 6) {
          ethDay = 1;
          ethMonth = 1;
          ethYear++;
        }
      } else {
        ethDay = 1;
        ethMonth = 1;
        ethYear++;
      }
    }

    if (n === 365) {
      ethDay = 6;
      ethMonth = 13;
    }

    const ethMonthName = ethiopianMonthNames[ethMonth - 1];
    const gregorianDayOfWeek = gregorianDate.getDay();
    const ethDayName = ethiopianDayNames[gregorianDayOfWeek];

    return {
      year: ethYear,
      month: ethMonthName,
      day: ethDay,
      dayName: ethDayName,
    };
  }

  await connectToDb();

  const eta = await Eta.findOne()
    .populate({
      path: "subscribersList.userId",
      select: "firstName lastName phoneNumber", // Customize the fields you want to populate
    })
    .exec();

  if (!eta) {
    return (
      <div className={styles.container}>
        <h1>No Eta found</h1>
      </div>
    );
  }
  const handleEtaDelete = async () => {
    "use server";
    try {
      // Find the eta document in the database
      const eta = await Eta.findOne();
      // delete it
      if (eta) {
        await eta.deleteOne();
        console.log("Eta deleted successfully.");
        revalidatePath("/admin/eta-payments");
      }
    } catch (err) {
      console.error("Error deleting Eta:", err);
    }
  };
  //     // Delete the eta document
  //     console.log("Eta deleted successfully.");
  //   } catch (err) {
  //     console.error("Error deleting Eta:", err);
  //   }
  // };

  return (
    <div className={styles.container}>
      {/* Display eta details */}
      <div>
        <h1>Eta Name: {eta.etaName}</h1>
        <h1>Eta Description: {eta.etaDescription}</h1>
        <h1>Eta Amount: {eta.etaAmount} Birr</h1>
      </div>

      {/* Display subscriber list */}
      <div>
        <form action={handleEtaDelete} className=" ">
          <button className="text-danger p-2 rounded-md  hover:bg-pink-900 ">
            Delete Eta
          </button>
        </form>
        <h2>Subscribers:</h2>
        {eta.subscribersList.length === 0 ? (
          <h1>No subscribers yet.</h1>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <td>Amount</td>
                <td>Name of the Equber</td>
                <td>Phone number</td>
                <td>Eta #Number</td>
              </tr>
            </thead>
            <tbody>
              {eta.subscribersList.map((subscriber, index) => (
                <tr key={index}>
                  <td>
                    <Link href={subscriber.paymentImageLink || "/dollar.png"}>
                      <div className={styles.user}>
                        <Image
                          src={subscriber.paymentImageLink || "/dollar.png"}
                          alt="Payment Proof"
                          width={40}
                          height={40}
                          className={styles.userImageWallet}
                        />
                      </div>
                    </Link>
                  </td>

                  <td>
                    {subscriber.userId
                      ? `${subscriber.userId.firstName} ${subscriber.userId.lastName}`
                      : "Unknown User"}
                  </td>
                  <td>{subscriber.userId.phoneNumber}</td>
                  <td>
                    {generateUnique4DigitId(subscriber.userId.phoneNumber)}
                  </td>
                  <td>
                    {" "}
                    <form action={unsubscribeUser}>
                      <input
                        type="hidden"
                        name="userId"
                        value={subscriber.userId._id}
                      />
                      <button className={`${styles.button} ${styles.delete}`}>
                        ⚠ Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
