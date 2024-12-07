import styles from "./loading.module.css"; // Import the CSS module
const Loading = () => {
  // components/LoadingPage.js

  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Loading...</p>
    </div>
  );
};

export default Loading;
