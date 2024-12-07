import styles from "@/app/ui/dashboard/users/users.module.css";

const UsersPage = async () => {
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
              <div className={styles.user}>Heading Message</div>
            </td>
            <td>No Heading Message Set</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>Blocking Message</div>
            </td>
            <td>No Blocking Message Set</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
