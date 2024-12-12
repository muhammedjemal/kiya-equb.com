import { Agent, Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import styles from "@/app/ui/dashboard/users/users.module.css";

export const SMSButton = async ({ transaction, phoneNumber }) => {
  console.log(transaction);
  return (
    <>
      <a
        className={`${styles.button} ${styles.view}`}
        href={`sms:${phoneNumber}?body=ውድ ደንበኛችን፡ %0A በሚከተለው ምክንያት አካውንትዎ ላይ ${
          transaction.amount
        } ብር ${
          transaction.incomeOrPayment === "in"
            ? "ወጭ"
            : transaction.incomeOrPayment === "out"
            ? "ገቢ"
            : "ወጭ/ገቢ"
        } አድርገናል፡ %0A ${
          transaction.reasonOfTransaction
        } ፡፡ %0A ለማንኛውም አስተያየት ወይም ጥያቄ ወደ 0905059016 ወይም 0716892549 ይደውሉ፣ እናመሰግናለን! ኪያ እቁብ`}
        style={{ verticalAlign: "middle" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="white"
          style={{ verticalAlign: "middle" }}
        >
          <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280L160-640v400h640v-400L480-440Zm0-80 320-200H160l320 200ZM160-640v-80 480-400Z" />
        </svg>
        <span>Send SMS</span>
      </a>
    </>
  );
};
