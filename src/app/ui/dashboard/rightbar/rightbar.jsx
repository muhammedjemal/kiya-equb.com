import Image from "next/image";
import styles from "./rightbar.module.css";
import Link from "next/link";
// import { MdPlayCircleFilled, MdReadMore } from "react-icons/md";

const Rightbar = () => {
  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <div className={styles.bgContainer}>
          <Image
            className={styles.bg}
            src="https://i.postimg.cc/dQGbM0DR/kiya-equb2.png"
            alt=""
            fill
          />
        </div>
        <div className={styles.text}>
          <span className={styles.notification}>🔥 Available Now</span>
          <h3 className={styles.title}>
            How to use the new version of the admin dashboard?
          </h3>
          <span className={styles.subtitle}>
            Takes less than 1 minutes to learn
          </span>
          <p className={styles.desc}>
            Welcome! Kiya Equb uses this web based dashboard to administer its
            overall system please use this very carefully as it handles all the
            data and only be changed in this admin panel.
          </p>
          <Link href="/admin/help" className={styles.button}>
            <button className={styles.button}>Got It!</button>
          </Link>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.text}>
          <span className={styles.notification}>🚀 Coming Soon</span>
          <h3 className={styles.title}>
            Some new features and updates are coming for this dashboard, the
            developer team is woking hard for them!
          </h3>
          <span className={styles.subtitle}>Boost your productivity</span>
          <p className={styles.desc}>
            If you see any new features or updates demanding for your
            productivity please let us know. The dashboard is still in
            development stage (Alpha version) so write down any bugs for the
            next version update.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Rightbar;
