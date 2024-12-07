import Image from "next/image";
import styles from "./transactions.module.css";

const Transactions = async ({ payments }) => {
  console.log(payments);
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Latest Transactions</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>Date</td>
            <td>Amount</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div className={styles.user}>
                <Image
                  src={payments[0].imageProof || "/dollar.png"} // productionADD
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
              </div>
            </td>
            <td></td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                <Image
                  src={payments[1].imageProof || "/dollar.png"} // productionADD
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
              </div>
            </td>
            <td></td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                <Image
                  src={payments[2].imageProof || "/dollar.png"} // productionADD
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
              </div>
            </td>
            <td></td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
          <tr>
            <td>
              <div className={styles.user}>
                <Image
                  src={payments[3].imageProof || "/dollar.png"} // productionADD
                  alt=""
                  width={40}
                  height={40}
                  className={styles.userImage}
                />
              </div>
            </td>
            <td></td>
            <td>14.02.2024</td>
            <td>$3.200</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Transactions;
