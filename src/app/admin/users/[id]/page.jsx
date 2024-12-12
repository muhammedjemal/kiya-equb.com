import { Copier } from "@/app/ui/Copier";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import EqubDetails from "@/app/ui/equb";
import { CollectorsAndManagerTodaysAmount } from "@/components/CollectorsAndManagerTodaysAmount";
import { CollectorsTodaysAmount } from "@/components/CollectorsTodaysAmount";
import { CollectorTodaysAmount } from "@/components/CollectorTodaysAmount";
import { Copier2 } from "@/components/Copier2";
import { ManagerCollectors } from "@/components/ManagerCollectors";
import { auth } from "@/lib/auth";
import { Equb, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation"; // Add this import

const SingleUserPage = async ({ params, searchParams }) => {
  const status = searchParams?.status || "";
  const message = searchParams?.message || "";

  const updateUser = async (formData) => {
    "use server";
    let {
      id,
      firstName,
      lastName,
      motherName,
      phoneNumber,
      password,
      managerId,
    } = Object.fromEntries(formData);
    function validatePhoneNumber(phoneNumber) {
      // Check if phoneNumber is a string
      if (typeof phoneNumber !== "string") {
        throw new Error("Phone number must be a string.");
      }

      // Remove all whitespace from the phone number
      phoneNumber = phoneNumber.replace(/\s/g, "");

      // Check if phoneNumber starts with '+'
      if (phoneNumber.startsWith("+")) {
        phoneNumber = phoneNumber.slice(1); // Remove the '+' sign
      }

      // Check if phoneNumber starts with '251'
      if (phoneNumber.startsWith("251")) {
        phoneNumber = phoneNumber.slice(3); // Remove the country code '251'
      } else if (phoneNumber.startsWith("0")) {
        phoneNumber = phoneNumber.slice(1); // Remove leading '0' if present
      } else {
        throw new Error("Invalid phone number format.");
      }

      // Ensure the remaining phoneNumber consists of only numeric digits
      if (!/^\d+$/.test(phoneNumber)) {
        throw new Error("Invalid phone number format.");
      }

      // Remove leading zeros by converting to number and back to string
      phoneNumber = Number(phoneNumber).toString();

      // Ensure the formatted phone number starts with '+2519' or '+2517' and has a length of 10 digits
      if (
        !(phoneNumber.startsWith("9") && phoneNumber.length === 9) &&
        !(phoneNumber.startsWith("7") && phoneNumber.length === 9)
      ) {
        throw new Error("Invalid phone number format.");
      }

      return "+251" + phoneNumber;
    }
    console.log("test");
    try {
      console.log(phoneNumber);
      let okPhoneNumber;
      if (phoneNumber) {
        console.log(phoneNumber);

        try {
          validatePhoneNumber(phoneNumber);
          okPhoneNumber = true;
        } catch (err) {
          console.log(err);
          return { error: err.message };
        }
      }

      console.log("test");
      let validatedPhoneNumber =
        okPhoneNumber === true ? validatePhoneNumber(phoneNumber) : "";
      console.log("test");

      if (!managerId) {
        managerId = "";
      }
      console.log("test");

      const hashedPassword = await bcryptjs.hash(password, 10);
      await connectToDb();
      console.log("test");

      const updateFields = {
        firstName,
        lastName,
        motherName,
        phoneNumber: validatedPhoneNumber,
        password: hashedPassword,
        underManager: managerId,
      };
      console.log("test");

      Object.keys(updateFields).forEach(
        (key) =>
          (updateFields[key] === "" || undefined) && delete updateFields[key]
      );
      console.log("test");

      await User.findByIdAndUpdate(id, updateFields);

      console.log("test");
      revalidatePath("/admin/users");
      revalidatePath("/admin/users/[id]");
      return { success: true };
    } catch (err) {
      return { error: "Something went wrong, Please try again" };
    }
  };
  const createEqub = async (formData) => {
    "use server";
    const { owner, name, type, amount } = Object.fromEntries(formData);
    // if non number amount or empty name or type return
    if (isNaN(amount) || amount <= 0 || !name || !type) {
      console.log("Invalid amount or name or type");
      return { error: "Invalid amount or name or type" };
    }
    try {
      const newEqub = new Equb({
        owner,
        name,
        type,
        amount,
      });

      await connectToDb();
      await newEqub.save();
    } catch {
      console.log("error saving the payment");
      return (
        <div className={styles.container}>
          <h1>error saving the payment</h1>
        </div>
      );
    }

    console.log("saved to db");
    revalidatePath("/admin/users");
    revalidatePath("/admin/users/[id]");
    revalidatePath("/admin/equbs");
    revalidatePath("/admin");
  };
  const changePassword = async (formData) => {
    "use server";
    const { id, password } = Object.fromEntries(formData);
    // don't do anything if password is empty
    if (!password) {
      return;
    }
    try {
      const hashedPassword = await bcryptjs.hash(password, 10);
      await connectToDb();
      console.log("test");

      const updateFields = {
        password: hashedPassword,
      };
      console.log("test");

      Object.keys(updateFields).forEach(
        (key) =>
          (updateFields[key] === "" || undefined) && delete updateFields[key]
      );
      console.log("test");

      await User.findByIdAndUpdate(id, updateFields);

      console.log("test");
      revalidatePath("/admin/users");
      console.log("test");

      revalidatePath("/admin/users/[id]");
      console.log("test");

      return redirect(
        `/admin/users/${id}?status=success&message=Password updated successfully!`
      );
    } catch (err) {
      // return redirect(
      //   `/admin/users/${id}?status=error&message=Failed to update password.`
      // );
      console.log(err);
    }
  };
  await connectToDb();

  const managers = await User.find({
    managerMembers: { $exists: true, $ne: null },
  });

  console.log(managers.length);

  let loggedInUser2 = await auth();
  if (!loggedInUser2) {
    return <h1>Please Login first!</h1>;
  }
  console.log(loggedInUser2.user);
  const id = loggedInUser2.user.id;
  const loggedInUser = await User.findById(id);
  console.log(loggedInUser.role);
  console.log(id);
  console.log(params.id);
  let paramsUser;
  try {
    paramsUser = await User.findById(params.id);
  } catch {
    console.log("invalid user id");
    return (
      <div className={styles.container}>
        <h1>invalid user id</h1>
      </div>
    );
  }
  const equbs = await Equb.find({ owner: paramsUser.id });
  const managersAll = await User.find({
    managerMembers: { $exists: true, $ne: null },
  });
  const refferals = await User.find({ refferedBy: paramsUser.id });
  console.log(refferals);
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
  const todaysDate = new Date();
  const yesterdaysDate = new Date(todaysDate);
  yesterdaysDate.setDate(todaysDate.getDate() - 1);
  const bYesterdaysDate = new Date(todaysDate);
  bYesterdaysDate.setDate(todaysDate.getDate() - 2);
  const b3YesterdaysDate = new Date(todaysDate);
  b3YesterdaysDate.setDate(todaysDate.getDate() - 3);
  const b4YesterdaysDate = new Date(todaysDate);
  b4YesterdaysDate.setDate(todaysDate.getDate() - 4);
  return (
    <>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <form action={updateUser} className={styles.form}>
            <input type="hidden" name="id" value={paramsUser.id} />
            {/* make Copier element from right-most side from the line using css inline style code */}
            {loggedInUser.id === paramsUser.id ? (
              <>
                <div className={"flex m-auto row-col"}>
                  <div className={"flex m-auto flex-col"}>
                    <a href={paramsUser?.img || "/noavatar.png"}>
                      <Image
                        className={styles.userImage}
                        src={paramsUser?.img || "/noavatar.png"}
                        alt=""
                        width="100"
                        height="100"
                      />
                    </a>

                    <h1>My Account</h1>
                  </div>
                  <div
                    className={"flex m-right flex-col items-end justify-start"}
                  >
                    <div className={"flex m-76 flex-row"}>
                      <Link href={`/admin/users/change-photo/${paramsUser.id}`}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#e8eaed"
                        >
                          <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <Copier2 phone={paramsUser.phoneNumber} />
            )}
            {(loggedInUser.id === paramsUser.id ||
              (loggedInUser.isSystemAdmin === true &&
                loggedInUser.oprator !== true)) &&
              !loggedInUser.agentId && (
                <Link href={`/admin/manager-analytics`}>
                  <button className={styles.button}>Manager Analytics</button>
                </Link>
              )}
            <Copier code={paramsUser.id} style={{}} />
            <label style={{ display: "inline-block", width: "100px" }}>
              Referral Code:
            </label>
            {/*refferal code copying to the clipboard button element: */}
            <input
              type="text"
              placeholder={paramsUser.id}
              style={{ display: "inline" }}
              readOnly
            />
            <label>First Name:</label>
            <input
              type="text"
              name="firstName"
              placeholder={paramsUser.firstName}
            />
            <label>Last Name:</label>
            <input
              type="text"
              name="lastName"
              placeholder={paramsUser.lastName}
            />
            <label>Mother Name:</label>
            <input
              type="text"
              name="motherName"
              placeholder={paramsUser.motherName}
            />
            <label>Phone Number:</label>
            <input
              type="text"
              name="phoneNumber"
              placeholder={paramsUser.phoneNumber}
            />{" "}
            {loggedInUser.oprator !== true &&
              loggedInUser.collectorOf === null && <label>Password:</label>}
            {loggedInUser.oprator !== true &&
              loggedInUser.collectorOf === null && (
                <input
                  type="text"
                  name="password"
                  placeholder={"enter new password..."}
                />
              )}
            {loggedInUser.managerMembers !== null
              ? loggedInUser.id === paramsUser.underManager &&
                "This user is placed to you."
              : paramsUser.underManager &&
                paramsUser.underManager !== "" &&
                paramsUser.isSystemAdmin === false &&
                loggedInUser.oprator !== true &&
                loggedInUser.collectorOf === null && (
                  <Link href={`/admin/users/${paramsUser.underManager}`}>
                    <b> View Current Placement Manager</b>{" "}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="34px"
                      fill="green"
                    >
                      <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                    </svg>
                  </Link>
                )}
            {/* if current user is not admin the following two will be hidden: */}
            {/* 
          // for client choosing under which manager 
          // for collector choosing under which manager 
          // for admin this option will be hidden
          */}
            {/* if there are managers otherwise say no managers please add at least one manager to make placement for this user */}
            {/* if the user is a collector hide the Update button for him */}
            {loggedInUser.isSystemAdmin &&
              !loggedInUser.agentId &&
              loggedInUser.oprator !== true && (
                <>
                  <label>Placement: ⭐</label>
                  <select name="managerId" id="managerId">
                    {/* if manager.managerMembers array includes the user's id as one of the list */}
                    <option value="">Select Manager</option>
                    {managersAll.map((manager) => (
                      <>
                        <option value={manager.id}>
                          {manager.firstName} {manager.lastName}
                        </option>
                      </>
                    ))}
                  </select>
                </>
              )}
            {loggedInUser.managerMembers !== null
              ? loggedInUser.id === paramsUser.underManager && (
                  <button>Update</button>
                )
              : loggedInUser.oprator !== true &&
                loggedInUser.collectorOf === null && <button>Update</button>}
          </form>
          {paramsUser.managerMembers === null &&
            paramsUser.collectorOf === null &&
            paramsUser.isSystemAdmin === false &&
            loggedInUser.oprator !== true &&
            !loggedInUser.agentId &&
            loggedInUser.collectorOf === null && (
              <form action={createEqub} className={styles.form}>
                <input type="hidden" name="owner" value={paramsUser.id} />
                <h2>Create new Equb for this user:</h2>

                <label>New Equb Name:</label>
                <input
                  type="text"
                  name="name"
                  placeholder={"enter the new Equb name..."}
                />
                <label>New Equb Type:</label>
                <input
                  type="text"
                  name="type"
                  placeholder={"enter the new Equb type..."}
                />
                <label>Amount:</label>
                <input
                  type="text"
                  name="amount"
                  placeholder={"enter the new Equb amount..."}
                />
                <button>Create</button>
              </form>
            )}
          {loggedInUser.id === paramsUser.id && (
            <form action={changePassword} className={styles.form}>
              <label>Change Password:</label>
              <input type="hidden" name="id" value={paramsUser.id} />
              <input
                type="text"
                name="password"
                placeholder={"enter your new password..."}
              />
              <button>Change My Password</button>
            </form>
          )}
          {status && (
            <div
              className={`alert ${status === "success" ? "success" : "error"}`}
            >
              {message}
            </div>
          )}
          <div>
            {loggedInUser.oprator !== true &&
              !loggedInUser.agentId &&
              loggedInUser.collectorOf === null && (
                <h2 style={{ color: "green" }}>
                  Referrals ({refferals.length}):
                </h2>
              )}
            {loggedInUser.oprator !== true &&
              !loggedInUser.agentId &&
              loggedInUser.collectorOf === null && (
                <ol>
                  {refferals.map((refferal, i) => (
                    <li key={i}>
                      <Link href={`/admin/users/${refferal.id}`}>
                        <h3>
                          {refferal.firstName} {refferal.lastName}{" "}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            height="24px"
                            viewBox="0 -960 960 960"
                            width="24px"
                            fill="green"
                          >
                            <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                          </svg>
                        </h3>
                      </Link>
                    </li>
                  ))}
                </ol>
              )}
          </div>

          <div>
            {/* sample  */}
            {paramsUser.managerMembers === null &&
              paramsUser.collectorOf === null &&
              paramsUser.isSystemAdmin === false && (
                <h1>Equbs ({equbs.length})</h1>
              ) &&
              equbs.map((equb, i) => <EqubDetails equb={equb} key={i} />)}
          </div>

          {!loggedInUser.agentId && (
            <>
              <div>
                {/* sample */}
                {paramsUser.managerMembers !== null &&
                  loggedInUser.oprator !== true && (
                    <>
                      <br />
                      <h2 style={{ color: "green" }}>
                        Today{"'"}s (
                        {convertToEthiopianDateMoreEnhanced(todaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(todaysDate).day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(todaysDate).month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(todaysDate).year}
                        ) analytics:
                      </h2>

                      <Link href={`/admin/users/payments/${paramsUser.id}`}>
                        <h2>
                          Manager{"'"}s amount received today=
                          <b>
                            <CollectorTodaysAmount collector={paramsUser} />
                          </b>
                        </h2>
                        <span>
                          <i>click to see the payments received</i>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="green"
                        >
                          <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                        </svg>
                      </Link>
                      <h2>
                        Manager{"'"}s collecors received today =
                        <b>
                          <CollectorsTodaysAmount mngrId={paramsUser.id} />
                        </b>
                      </h2>
                      <h2>
                        Total Manager{"'"}s and collectors of the Manager
                        received today =
                        <b>
                          <u>
                            <CollectorsAndManagerTodaysAmount
                              mngrId={paramsUser.id}
                            />
                          </u>
                        </b>
                      </h2>

                      <ManagerCollectors user={paramsUser} />
                    </>
                  )}

                {paramsUser.collectorOf !== null &&
                  loggedInUser.oprator !== true &&
                  (loggedInUser.collectorOf !== null
                    ? loggedInUser.id === paramsUser.id
                    : true) && (
                    <>
                      <br />
                      <h2>
                        Today (
                        {convertToEthiopianDateMoreEnhanced(todaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(todaysDate).day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(todaysDate).month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(todaysDate).year}
                        ):
                      </h2>

                      <h2>Collector{"'"}s money collection status is:</h2>
                      <Link href={`/admin/users/payments/${paramsUser.id}`}>
                        <CollectorTodaysAmount collector={paramsUser} />

                        <span>
                          <i>click to see the payments received </i>
                        </span>
                      </Link>
                    </>
                  )}
                {((paramsUser.isSystemAdmin === true &&
                  loggedInUser.oprator !== true) ||
                  (paramsUser.isSystemAdmin === true &&
                    loggedInUser.oprator === true &&
                    loggedInUser.id === paramsUser.id)) && (
                  <>
                    <br />
                    <h2>
                      Today (
                      {convertToEthiopianDateMoreEnhanced(todaysDate).dayName +
                        " " +
                        convertToEthiopianDateMoreEnhanced(todaysDate).day +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(todaysDate).month +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(todaysDate).year}
                      ):
                    </h2>
                    <h2>
                      {`${paramsUser.oprator === true ? "Oprator" : "Admin"}`}
                      {"'"}s money collection status is:
                    </h2>
                    <Link href={`/admin/users/payments/${paramsUser.id}`}>
                      <CollectorTodaysAmount collector={paramsUser} />

                      <span>
                        <i>click to see the payments received </i>
                      </span>
                    </Link>
                  </>
                )}
              </div>
              {/* {yesterday status} */}
              <div>
                {/* sample */}
                {paramsUser.managerMembers !== null &&
                  loggedInUser.oprator !== true && (
                    <>
                      <br />
                      <h2 style={{ color: "green" }}>
                        Yesterday{"'"}s (
                        {convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                            .year}
                        ) analytics:
                      </h2>

                      <Link
                        href={`/admin/users/yesterdaypayments/${paramsUser.id}`}
                      >
                        <h2>
                          Manager{"'"}s amount received yesterday=
                          <b>
                            <CollectorTodaysAmount
                              collector={paramsUser}
                              day="yesterday"
                            />
                          </b>
                        </h2>
                        <span>
                          <i>click to see the payments received</i>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="green"
                        >
                          <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                        </svg>
                      </Link>
                      <h2>
                        Manager{"'"}s collecors received yesterday =
                        <b>
                          <CollectorsTodaysAmount
                            mngrId={paramsUser.id}
                            day="yesterday"
                          />
                        </b>
                      </h2>
                      <h2>
                        Total Manager{"'"}s and collectors of the Manager
                        received yesterday =
                        <b>
                          <u>
                            <CollectorsAndManagerTodaysAmount
                              mngrId={paramsUser.id}
                              day="yesterday"
                            />
                          </u>
                        </b>
                      </h2>

                      <ManagerCollectors user={paramsUser} day="yesterday" />
                    </>
                  )}

                {paramsUser.collectorOf !== null &&
                  loggedInUser.oprator !== true &&
                  (loggedInUser.collectorOf !== null
                    ? loggedInUser.id === paramsUser.id
                    : true) && (
                    <>
                      <br />
                      <h2>
                        Yesterday (
                        {convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                            .year}
                        ):
                      </h2>

                      <h2>Collector{"'"}s money collection status is:</h2>
                      <Link
                        href={`/admin/users/yesterdaypayments/${paramsUser.id}`}
                      >
                        <CollectorTodaysAmount
                          collector={paramsUser}
                          day="yesterday"
                        />

                        <span>
                          <i>click to see the payments received </i>
                        </span>
                      </Link>
                    </>
                  )}
                {((paramsUser.isSystemAdmin === true &&
                  loggedInUser.oprator !== true) ||
                  (paramsUser.isSystemAdmin === true &&
                    loggedInUser.oprator === true &&
                    loggedInUser.id === paramsUser.id)) && (
                  <>
                    <br />
                    <h2>
                      Yesterday (
                      {convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                        .dayName +
                        " " +
                        convertToEthiopianDateMoreEnhanced(yesterdaysDate).day +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(yesterdaysDate)
                          .month +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(yesterdaysDate).year}
                      ):
                    </h2>

                    <h2>
                      {`${paramsUser.oprator === true ? "Oprator" : "Admin"}`}
                      {"'"}s money collection status is:
                    </h2>
                    <Link
                      href={`/admin/users/yesterdaypayments/${paramsUser.id}`}
                    >
                      <CollectorTodaysAmount
                        collector={paramsUser}
                        day="yesterday"
                      />

                      <span>
                        <i>click to see the payments received </i>
                      </span>
                    </Link>
                  </>
                )}
              </div>
              {/* {before yesterday status} ///////////////////////////////////////////////////////////*/}
              <div>
                {/* sample */}
                {paramsUser.managerMembers !== null &&
                  loggedInUser.oprator !== true && (
                    <>
                      <br />
                      <h2 style={{ color: "green" }}>
                        Before Yesterday{"'"}s (
                        {convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                            .year}
                        ) analytics:
                      </h2>

                      <Link
                        href={`/admin/users/beforeyesterdaypayments/${paramsUser.id}`}
                      >
                        <h2>
                          Manager{"'"}s amount received before yesterday=
                          <b>
                            <CollectorTodaysAmount
                              collector={paramsUser}
                              day="bYesterday"
                            />
                          </b>
                        </h2>
                        <span>
                          <i>click to see the payments received</i>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="green"
                        >
                          <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                        </svg>
                      </Link>
                      <h2>
                        Manager{"'"}s collecors received before yesterday =
                        <b>
                          <CollectorsTodaysAmount
                            mngrId={paramsUser.id}
                            day="bYesterday"
                          />
                        </b>
                      </h2>
                      <h2>
                        Total Manager{"'"}s and collectors of the Manager
                        received before yesterday =
                        <b>
                          <u>
                            <CollectorsAndManagerTodaysAmount
                              mngrId={paramsUser.id}
                              day="bYesterday"
                            />
                          </u>
                        </b>
                      </h2>

                      <ManagerCollectors user={paramsUser} day="bYesterday" />
                    </>
                  )}

                {paramsUser.collectorOf !== null &&
                  loggedInUser.oprator !== true &&
                  (loggedInUser.collectorOf !== null
                    ? loggedInUser.id === paramsUser.id
                    : true) && (
                    <>
                      <br />
                      <h2>
                        Before Yesterday (
                        {convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                            .year}
                        ):
                      </h2>

                      <h2>Collector{"'"}s money collection status is:</h2>
                      <Link
                        href={`/admin/users/beforeyesterdaypayments/${paramsUser.id}`}
                      >
                        <CollectorTodaysAmount
                          collector={paramsUser}
                          day="bYesterday"
                        />

                        <span>
                          <i>click to see the payments received </i>
                        </span>
                      </Link>
                    </>
                  )}
                {((paramsUser.isSystemAdmin === true &&
                  loggedInUser.oprator !== true) ||
                  (paramsUser.isSystemAdmin === true &&
                    loggedInUser.oprator === true &&
                    loggedInUser.id === paramsUser.id)) && (
                  <>
                    <br />
                    <h2>
                      2 Days ago (
                      {convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                        .dayName +
                        " " +
                        convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                          .day +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                          .month +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(bYesterdaysDate)
                          .year}
                      ):
                    </h2>

                    <h2>
                      {`${paramsUser.oprator === true ? "Oprator" : "Admin"}`}
                      {"'"}s money collection status is:
                    </h2>
                    <Link
                      href={`/admin/users/beforeyesterdaypayments/${paramsUser.id}`}
                    >
                      <CollectorTodaysAmount
                        collector={paramsUser}
                        day="bYesterday"
                      />

                      <span>
                        <i>click to see the payments received </i>
                      </span>
                    </Link>
                  </>
                )}
              </div>
              {/* {before 3 days status} ///////////////////////////////////////////////////////////*/}
              <div>
                {/* sample */}
                {paramsUser.managerMembers !== null &&
                  loggedInUser.oprator !== true && (
                    <>
                      <br />
                      <h2 style={{ color: "green" }}>
                        Before 3 days{"'"} (
                        {convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                            .year}
                        ) analytics:
                      </h2>

                      <Link
                        href={`/admin/users/before3daypayments/${paramsUser.id}`}
                      >
                        <h2>
                          Manager{"'"}s amount received before 3 days=
                          <b>
                            <CollectorTodaysAmount
                              collector={paramsUser}
                              day="b3day"
                            />
                          </b>
                        </h2>
                        <span>
                          <i>click to see the payments received</i>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="green"
                        >
                          <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                        </svg>
                      </Link>
                      <h2>
                        Manager{"'"}s collecors received before 3 days=
                        <b>
                          <CollectorsTodaysAmount
                            mngrId={paramsUser.id}
                            day="b3day"
                          />
                        </b>
                      </h2>
                      <h2>
                        Total Manager{"'"}s and collectors of the Manager
                        received before 3 days =
                        <b>
                          <u>
                            <CollectorsAndManagerTodaysAmount
                              mngrId={paramsUser.id}
                              day="b3day"
                            />
                          </u>
                        </b>
                      </h2>

                      <ManagerCollectors user={paramsUser} day="b3day" />
                    </>
                  )}

                {paramsUser.collectorOf !== null &&
                  loggedInUser.oprator !== true &&
                  (loggedInUser.collectorOf !== null
                    ? loggedInUser.id === paramsUser.id
                    : true) && (
                    <>
                      <br />
                      <h2>
                        3 Days ago (
                        {convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                            .year}
                        ):
                      </h2>

                      <h2>Collector{"'"}s money collection status is:</h2>
                      <Link
                        href={`/admin/users/before3daypayments/${paramsUser.id}`}
                      >
                        <CollectorTodaysAmount
                          collector={paramsUser}
                          day="b3day"
                        />

                        <span>
                          <i>click to see the payments received </i>
                        </span>
                      </Link>
                    </>
                  )}
                {((paramsUser.isSystemAdmin === true &&
                  loggedInUser.oprator !== true) ||
                  (paramsUser.isSystemAdmin === true &&
                    loggedInUser.oprator === true &&
                    loggedInUser.id === paramsUser.id)) && (
                  <>
                    <br />
                    <h2>
                      Before 3 days (
                      {convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                        .dayName +
                        " " +
                        convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                          .day +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                          .month +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(b3YesterdaysDate)
                          .year}
                      ):
                    </h2>

                    <h2>
                      {`${paramsUser.oprator === true ? "Oprator" : "Admin"}`}
                      {"'"}s money collection status is:
                    </h2>
                    <Link
                      href={`/admin/users/before3daypayments/${paramsUser.id}`}
                    >
                      <CollectorTodaysAmount
                        collector={paramsUser}
                        day="b3day"
                      />

                      <span>
                        <i>click to see the payments received </i>
                      </span>
                    </Link>
                  </>
                )}
              </div>
              {/* {before 4 days status} ///////////////////////////////////////////////////////////*/}
              <div>
                {/* sample */}
                {paramsUser.managerMembers !== null &&
                  loggedInUser.oprator !== true && (
                    <>
                      <br />
                      <h2 style={{ color: "green" }}>
                        Before 4 days{"'"} (
                        {convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                            .year}
                        ) analytics:
                      </h2>

                      <Link
                        href={`/admin/users/before3daypayments/${paramsUser.id}`}
                      >
                        <h2>
                          Manager{"'"}s amount received before 4 days=
                          <b>
                            <CollectorTodaysAmount
                              collector={paramsUser}
                              day="b4day"
                            />
                          </b>
                        </h2>
                        <span>
                          <i>click to see the payments received</i>
                        </span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="green"
                        >
                          <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                        </svg>
                      </Link>
                      <h2>
                        Manager{"'"}s collecors received before 4 days=
                        <b>
                          <CollectorsTodaysAmount
                            mngrId={paramsUser.id}
                            day="b4day"
                          />
                        </b>
                      </h2>
                      <h2>
                        Total Manager{"'"}s and collectors of the Manager
                        received before 4 days =
                        <b>
                          <u>
                            <CollectorsAndManagerTodaysAmount
                              mngrId={paramsUser.id}
                              day="b4day"
                            />
                          </u>
                        </b>
                      </h2>

                      <ManagerCollectors user={paramsUser} day="b4day" />
                    </>
                  )}

                {paramsUser.collectorOf !== null &&
                  loggedInUser.oprator !== true &&
                  (loggedInUser.collectorOf !== null
                    ? loggedInUser.id === paramsUser.id
                    : true) && (
                    <>
                      <br />
                      <h2>
                        4 Days ago (
                        {convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                          .dayName +
                          " " +
                          convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                            .day +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                            .month +
                          "-" +
                          convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                            .year}
                        ):
                      </h2>

                      <h2>Collector{"'"}s money collection status is:</h2>
                      <Link
                        href={`/admin/users/before4daypayments/${paramsUser.id}`}
                      >
                        <CollectorTodaysAmount
                          collector={paramsUser}
                          day="b4day"
                        />

                        <span>
                          <i>click to see the payments received </i>
                        </span>
                      </Link>
                    </>
                  )}
                {((paramsUser.isSystemAdmin === true &&
                  loggedInUser.oprator !== true) ||
                  (paramsUser.isSystemAdmin === true &&
                    loggedInUser.oprator === true &&
                    loggedInUser.id === paramsUser.id)) && (
                  <>
                    <br />
                    <h2>
                      Before 4 days (
                      {convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                        .dayName +
                        " " +
                        convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                          .day +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                          .month +
                        "-" +
                        convertToEthiopianDateMoreEnhanced(b4YesterdaysDate)
                          .year}
                      ):
                    </h2>

                    <h2>
                      {`${paramsUser.oprator === true ? "Oprator" : "Admin"}`}
                      {"'"}s money collection status is:
                    </h2>
                    <Link
                      href={`/admin/users/before4daypayments/${paramsUser.id}`}
                    >
                      <CollectorTodaysAmount
                        collector={paramsUser}
                        day="b4day"
                      />

                      <span>
                        <i>click to see the payments received </i>
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SingleUserPage;
