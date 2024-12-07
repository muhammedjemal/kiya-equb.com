import Pagination from "@/app/ui/dashboard/pagination/pagination";
import styles from "@/app/ui/dashboard/users/users.module.css";
import { Equb, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache"; // revalidatePath
import { auth } from "@/lib/auth";
import { convertToEthiopianDateMoreEnhanced } from "@/lib/convertToEthiopianDateMoreEnhanced";
import BhB from "./client";

const fetchEqubs = async (q, page) => {
  const ITEM_PER_PAGE = 10;

  try {
    await connectToDb();
    const count = await Equb.estimatedDocumentCount();

    const equbs = await Equb.find({})
      .sort({ createdAt: -1 })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1));
    return { count, equbs };
  } catch (err) {
    console.log(err);
    console.log("Failed to fetch users!");
  }
};

const deleteEqub = async (formData) => {
  "use server";
  const { id } = Object.fromEntries(formData);

  try {
    await connectToDb();
    await Equb.findByIdAndDelete(id);
  } catch (err) {
    console.log(err);
    throw new Error("Failed to delete Equb!");
  }

  revalidatePath("/admin/equbs");
  revalidatePath("/admin/users");
  revalidatePath("/admin/users/[id]");
};
const UsersPage = async ({ searchParams }) => {
  const session1 = await auth();
  const loggedInUser1 = session1.user;
  await connectToDb();
  const userLive1 = await User.findById(loggedInUser1.id);
  if (userLive1.oprator === true) {
    return (
      <>
        <div className={styles.container}>
          <h1>Oprators are not allowed to access this page</h1>
        </div>
      </>
    );
  }

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
  if (userLive.isSystemAdmin !== true) {
    return (
      <div className={styles.container}>
        <div className={styles.top}></div>
        <table className={styles.table}>
          <thead>
            <tr>
              <td>Sorry only the system admin is allowed here.</td>
            </tr>
          </thead>
        </table>
      </div>
    );
  }

  /////////

  const { count, equbs } = await fetchEqubs(q, page);

  return (
    <div className={styles.container}>
      <div className={styles.top}></div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name of Equb</td>
            <td>Amount</td>
            <td>Start Date</td>
            <td>End Date</td>
            <td> </td>
          </tr>
        </thead>
        <tbody>
          {equbs.map((equb) => (
            <tr key={equb.id}>
              <td>
                <Link href={`/admin/users/${equb.owner}`}>
                  <div className={styles.user}>
                    <Image
                      src={"/wallet.png"}
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImageWallet}
                    />
                    {equb.type} - {equb.name}
                  </div>
                </Link>
              </td>
              <td>{equb.amount}</td>
              <td>
                {convertToEthiopianDateMoreEnhanced(equb.createdAt).dayName +
                  " " +
                  convertToEthiopianDateMoreEnhanced(equb.createdAt).day +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(equb.createdAt).month +
                  "-" +
                  convertToEthiopianDateMoreEnhanced(equb.createdAt).year}
              </td>
              <td>
                {equb.endDate &&
                  convertToEthiopianDateMoreEnhanced(equb.endDate)?.dayName +
                    " "}
                {equb.endDate &&
                  convertToEthiopianDateMoreEnhanced(equb.endDate)?.day + " "}

                {equb.endDate &&
                  convertToEthiopianDateMoreEnhanced(equb.endDate)?.month + " "}

                {equb.endDate &&
                  convertToEthiopianDateMoreEnhanced(equb.endDate)?.year}
              </td>{" "}
              <td>
                <div className={styles.buttons}>
                  {" "}
                  {/* <form action={deleteEqub}>
                    <input type="hidden" name="id" value={equb.id} />
                    <button className={`${styles.button} ${styles.delete}`}>
                      ⚠ Delete
                    </button>
                  </form> */}
                  <BhB equb={equb} />
                  <Link href={`/admin/users/${equb.owner}`}>
                    <button className={`${styles.button} ${styles.view}`}>
                      View Owner
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
