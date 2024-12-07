import styles from "@/app/ui/dashboard/users/users.module.css";
import { auth } from "@/lib/auth";
import { SystemInfo, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { revalidatePath } from "next/cache";

const UsersPage = async () => {
  await connectToDb();
  const info = await SystemInfo.findOne();
  const en = info.termsEn;
  const am = info.termsAm;
  const or = info.termsOr;
  const updateEn = async (formData) => {
    "use server";
    const { en } = Object.fromEntries(formData);
    // change the termsEn
    await SystemInfo.updateOne({}, { $set: { termsEn: en } });
    revalidatePath("/admin/terms");
  };
  const updateAm = async (formData) => {
    "use server";
    const { am } = Object.fromEntries(formData);
    // change the termsEn
    await SystemInfo.updateOne({}, { $set: { termsAm: am } });
    revalidatePath("/admin/terms");
  };
  const updateOr = async (formData) => {
    "use server";
    const { or } = Object.fromEntries(formData);
    // change the termsEn
    await SystemInfo.updateOne({}, { $set: { termsOr: or } });
    revalidatePath("/admin/terms");
  };
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

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>field</td>
            <td>value</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.user}>English</div>
            </td>
            <td>
              {" "}
              <form action={updateEn}>
                <textarea
                  type="text"
                  name="en"
                  id="en"
                  placeholder={en}
                  rows={10}
                  cols={40}
                />
                <button>Update</button>
              </form>
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>አማርኛ</div>
            </td>

            <td>
              <form action={updateAm}>
                <textarea
                  type="text"
                  name="am"
                  id="am"
                  placeholder={am}
                  rows={10}
                  cols={40}
                />
                <button>Update</button>
              </form>
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>Oromiffa</div>
            </td>
            <td>
              {" "}
              <form action={updateOr}>
                <textarea
                  type="text"
                  name="or"
                  id="or"
                  placeholder={or}
                  rows={10}
                  cols={40}
                />
                <button>Update</button>
              </form>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
