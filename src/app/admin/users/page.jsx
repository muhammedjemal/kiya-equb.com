import Pagination from "@/app/ui/dashboard/pagination/pagination";
import Search from "@/app/ui/dashboard/search/search";
import styles from "@/app/ui/dashboard/users/users.module.css";
import { Equb, Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache"; // revalidatePath
import { auth } from "@/lib/auth";
import mongoose from "mongoose";
import { convertToEthiopianDateMoreEnhanced } from "@/lib/convertToEthiopianDateMoreEnhanced";
import BhB from "./client";

const fetchUsers = async (q, page, fetchId) => {
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 10;

  try {
    await connectToDb();
    let count;
    let users;

    if (fetchId !== "no") {
      count = await User.countDocuments({
        $and: [
          { underManager: fetchId },
          {
            $or: [
              { firstName: { $regex: regex } },

              { lastName: { $regex: regex } },

              { phoneNumber: { $regex: regex } },

              { motherName: { $regex: regex } },
            ],
          },
        ],
      });

      users = await User.find({
        $and: [
          { underManager: fetchId },
          {
            $or: [
              { firstName: { $regex: regex } },
              { lastName: { $regex: regex } },
              { phoneNumber: { $regex: regex } },
              { motherName: { $regex: regex } },
            ],
          },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1));
    } else {
      count = await User.countDocuments({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { phoneNumber: { $regex: regex } },
          { motherName: { $regex: regex } },
        ],
      }); // Use countDocuments instead of count

      users = await User.find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { phoneNumber: { $regex: regex } },
          { motherName: { $regex: regex } },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1));
    }

    return { count, users }; // Ensure this is always returned
  } catch (err) {
    console.log(err);
    console.log("Failed to fetch users!");
    return { count: 0, users: [] }; // Return default values on error
  }
};

const deleteUser = async (formData) => {
  "use server";
  const { id } = Object.fromEntries(formData);

  let session;
  try {
    // Start a session
    session = await mongoose.startSession();
    session.startTransaction();

    // Get all Equbs owned by the user
    const equbs = await Equb.find({ owner: id }).distinct("_id");

    // Delete payments
    const paymentResult = await Payment.deleteMany(
      { forEqub: { $in: equbs } },
      { session }
    );
    console.log(paymentResult);

    // Delete equbs
    const equbResult = await Equb.deleteMany({ owner: id }, { session });
    console.log(equbResult);

    // Delete the user
    const userResult = await User.findByIdAndDelete(id, { session });
    console.log(userResult);

    // Commit the transaction
    await session.commitTransaction();
    console.log("Transaction committed");
  } catch (err) {
    console.error("Transaction error:", err);

    // Abort the transaction in case of error
    if (session) {
      await session.abortTransaction();
    }
    throw new Error("Failed to delete user and associated data.");
  } finally {
    // End the session
    if (session) {
      session.endSession();
    }
  }

  revalidatePath("/admin/users");
};

const UsersPage = async ({ searchParams }) => {
  let q = searchParams?.q || "";

  if (q.startsWith("0")) {
    q = q.slice(1);
  }
  // remove the first and ending spaces of q
  q = q.trim();
  const page = searchParams?.page || 1;
  const loggedInUser = await auth();
  let { user } = loggedInUser;
  console.log(user);
  // identify if he is either collector or manager or neither
  await connectToDb();
  const userLive = await User.findById(user.id);
  console.log(userLive);
  let fetchId = "no";
  if (userLive.isSystemAdmin !== true) {
    if (userLive.managerMembers !== null) {
      // he is manager,
      fetchId = userLive.id;
      console.log(userLive.id);
    } else if (userLive.collectorOf !== null) {
      // he is collector
      fetchId = userLive.underManager;
      console.log(userLive.collectorOf);
    }
  }
  console.log(userLive.id);
  console.log(userLive.collectorOf);
  console.log(fetchId);

  const { count = 0, users = [] } = await fetchUsers(q, page, fetchId);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search a user with first, last, mother name or phone number..." />
        <Link href="/admin/users/add">
          <button className={styles.addButton}>Add New</button>
        </Link>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Role</td>
            <td>Joined since</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <Link href={`/admin/users/${user.id}`}>
                  <div className={styles.user}>
                    <Image
                      src={user.img || "/noavatar.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user.firstName} {user.lastName}
                  </div>
                </Link>
              </td>
              <td>
                {user.managerMembers !== null
                  ? "Manager"
                  : user.collectorOf !== null
                  ? "Collector"
                  : user.isSystemAdmin === true && user.oprator !== true
                  ? "Admin"
                  : user.oprator === true
                  ? "Oprator"
                  : "Client"}
              </td>
              <td>
                {convertToEthiopianDateMoreEnhanced(user.createdAt).dayName +
                  " " +
                  convertToEthiopianDateMoreEnhanced(user.createdAt).day +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(user.createdAt).month +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(user.createdAt).year}
              </td>
              <td>
                <div className={styles.buttons}>
                  {" "}
                  {userLive.oprator !== true && (
                    <BhB user={user} />
                    // <form action={deleteUser}>
                    //   <input type="hidden" name="id" value={user.id} />
                    //   <button
                    //     className={`${styles.button} ${styles.delete}`}
                    //     hidden={
                    //       userLive.id === user.id ||
                    //       (userLive.managerMembers !== null &&
                    //         (user.isSystemAdmin !== null ||
                    //           user.managerMembers !== null)) ||
                    //       userLive.collectorOf !== null
                    //     }
                    //   >
                    //     ⚠ Delete
                    //   </button>
                    // </form>
                  )}
                  <Link href={`/admin/users/${user.id}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View
                    </button>
                  </Link>
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
