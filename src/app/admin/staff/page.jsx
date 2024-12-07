import styles from "@/app/ui/dashboard/users/users.module.css";
import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Link from "next/link";

const UsersPage = async () => {
  await connectToDb();
  // find all staffs like manager and admin and collectors and display/list them below
  // managers are identified if they have managerMembers = non null
  // admins are identified if they have isSystemadmin = true
  // collectors are identified if they have collectorOf = non null
  // oprators are identified if they have oprator = true

  const staffs = await User.find({
    $or: [
      { managerMembers: { $exists: true, $ne: null } },
      { isSystemAdmin: true },
      { oprator: true },
      { collectorOf: { $exists: true, $ne: null } },
    ],
  });
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Role</td>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff, i) => (
            <tr key={i}>
              <td>
                <div className={styles.user}>
                  <Link href={`/admin/users/${staff.id}`}>
                    {staff.firstName + " " + staff.lastName}
                  </Link>
                </div>
              </td>
              <td>
                {staff.managerMembers !== null && "Manager"}
                {staff.isSystemAdmin === true &&
                  staff.oprator !== true &&
                  "System Admin"}
                {staff.collectorOf !== null && "Collector"}
                {staff.oprator === true && "Oprator"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
