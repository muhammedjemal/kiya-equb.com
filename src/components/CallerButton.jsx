"use client";
import styles from "../app/home.module.css";
export const CallerButton = () => {
  return (
    <button
      className={styles.button2}
      onClick={() => {
        window.location.href = "tel:+251905059016";
      }}
    >
      Call Now
    </button>
  );
};
