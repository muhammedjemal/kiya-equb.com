// import { MdSupervisedUserCircle } from "react-icons/md";
import Link from "next/link";
import styles from "./card.module.css";

const Card = ({ item, data: data2 }) => {
  const { sumPayments, sumPaymentsYesterday, sumPaymentsBeforeYesterday } =
    data2;
  return (
    <div className={styles.container}>
      {item.title === "Total Users" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
        </svg>
      )}
      {(item.title === "Total Payments" || item.title === "Payments Today") && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M444-200h70v-50q50-9 86-39t36-89q0-42-24-77t-96-61q-60-20-83-35t-23-41q0-26 18.5-41t53.5-15q32 0 50 15.5t26 38.5l64-26q-11-35-40.5-61T516-710v-50h-70v50q-50 11-78 44t-28 74q0 47 27.5 76t86.5 50q63 23 87.5 41t24.5 47q0 33-23.5 48.5T486-314q-33 0-58.5-20.5T390-396l-66 26q14 48 43.5 77.5T444-252v52Zm36 120q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
        </svg>
      )}
      {item.title === "Total Equbs" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M200-200v-560 560Zm0 80q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v100h-80v-100H200v560h560v-100h80v100q0 33-23.5 56.5T760-120H200Zm320-160q-33 0-56.5-23.5T440-360v-240q0-33 23.5-56.5T520-680h280q33 0 56.5 23.5T880-600v240q0 33-23.5 56.5T800-280H520Zm280-80v-240H520v240h280Zm-160-60q25 0 42.5-17.5T700-480q0-25-17.5-42.5T640-540q-25 0-42.5 17.5T580-480q0 25 17.5 42.5T640-420Z" />
        </svg>
      )}
      <Link href={item.id}>
        <div className={styles.texts}>
          <span className={styles.title}>{item.title}</span>{" "}
          <span className={styles.number}>{item.number}</span>
          {item.title.startsWith("Payments ") && `${item.amount} Birr`}
          {item.title.startsWith("Payments T") && (
            <span className={styles.detail}>
              <span
                className={
                  sumPayments > sumPaymentsYesterday
                    ? styles.positive
                    : styles.negative
                }
              >
                {sumPayments > sumPaymentsYesterday
                  ? `${
                      sumPayments - sumPaymentsYesterday
                    } Birr higher than yesterday`
                  : `${
                      sumPaymentsYesterday - sumPayments
                    } Birr lower than yesterday`}
              </span>{" "}
            </span>
          )}
          {item.title.startsWith("Payments Y") && (
            <span className={styles.detail}>
              <span
                className={
                  sumPayments > sumPaymentsYesterday
                    ? styles.positive
                    : styles.negative
                }
              >
                {sumPaymentsYesterday > sumPayments
                  ? `${
                      sumPaymentsYesterday - sumPayments
                    } Birr higher than Today`
                  : `${
                      sumPayments - sumPaymentsYesterday
                    } Birr lower than Today`}
              </span>{" "}
            </span>
          )}
          {item.title.startsWith("Payments B") && (
            <span className={styles.detail}>
              <span
                className={
                  sumPayments > sumPaymentsBeforeYesterday
                    ? styles.positive
                    : styles.negative
                }
              >
                {sumPaymentsBeforeYesterday > sumPayments
                  ? `${
                      sumPaymentsBeforeYesterday - sumPayments
                    } Birr higher than Today`
                  : `${
                      sumPayments - sumPaymentsBeforeYesterday
                    } Birr lower than Today`}
              </span>{" "}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Card;
