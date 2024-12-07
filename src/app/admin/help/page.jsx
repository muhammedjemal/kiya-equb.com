import styles from "@/app/ui/dashboard/users/users.module.css";
import Link from "next/link";

const UsersPage = async () => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Path</td>
            <td>Description</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin"}>/admin</Link>
              </div>
            </td>
            <td>
              The admin panel{"'"}s main home page. Shows calculated analytics
              and ststistics like total number of registered users, payments
              made, number of equbs, etc
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                <Link href={"/admin/users"}>/admin/users</Link>
              </div>
            </td>
            <td>
              Shows all users with interactive pagination and you can also
              search users by their first name or last name or phone number or
              even their mother name. You can see 10 users at once and you can
              use the {"'"}next{"'"} and {"'"}prev{"'"} buttons to shift to the
              desired list of users. The information is designed to be highly
              easy to understand with Ethiopian Calander, sorted to be the
              newest registered users at the top and vice versa, so the newly
              registered users will be at the very top without using the
              pagination buttons. There are two buttons {"'"}delete{"'"} and{" "}
              {"'"}view{"'"} the delete button will delete the user and the view
              button will open the user{"'"}s details page. Another separate
              button {"'"}Add New{"'"} is available that redirects to the new
              user creation page. <br />
              <i>
                <b>
                  Warning: The delete button will delete the user WITHOUT ANY
                  CONFIRMATION so this feature including all other parts of this
                  admin dashboard should be used with greate causious and
                  complete knowledge of your inputs/actions there is no
                  guarantee or dedicated backup solution for user actions!
                </b>
              </i>
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/payments"}>/admin/payments</Link>
              </div>
            </td>
            <td>
              similar to /admin/users but shows all Payments. The {"'View'"}
              redirects to the Equb which has that payment inside it.
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/equbs"}>/admin/equbs</Link>
              </div>
            </td>
            <td>
              similar to /admin/users but shows all Equbs. The {"'View'"}{" "}
              redirects to the User which has that Equb inside it.
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/terms"}>/admin/terms</Link>
              </div>
            </td>
            <td>
              Shows the terms and service regulations of the company. which will
              be used to display for the applcation version of the system
              users/clients.
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/broadcast"}>/admin/broadcast</Link>
              </div>
            </td>
            <td>
              Shows the short message to be dynamically displayed for clients in
              applcation version of the system users.
            </td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/staff"}>/admin/staff</Link>
              </div>
            </td>
            <td>Shows the staff information if there are any.</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/developer"}>/admin/developer</Link>
              </div>
            </td>
            <td>Shows the developer team{"'"}s contact information.</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/help"}>/admin/help</Link>
              </div>
            </td>
            <td>This help page.</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                {" "}
                <Link href={"/admin/users/add"}>/admin/users/add</Link>
              </div>
            </td>
            <td>Openes the new user creation page.</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
