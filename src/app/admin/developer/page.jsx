import styles from "@/app/ui/dashboard/users/users.module.css";

const UsersPage = async () => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Contact</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.user}>Jemal Muhammed</div>
            </td>
            <td>+251 92 744 4070</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>Yisehak Solomon</div>
            </td>
            <td>+251 92 534 8152</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
