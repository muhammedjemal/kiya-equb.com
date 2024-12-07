import Image from "next/image";
import styles from "./home.module.css";
import Link from "next/link";
import { CallerButton } from "@/components/CallerButton";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>Kiya Equb</h1>
        <p className={styles.desc}>
          Kiya Equb is one of the few and leading web and application based{" "}
          <i>Equb</i> service providers in Ethiopia.
        </p>
        <div className={styles.buttons}>
          <Link href="/about">
            <button className={styles.button}>Learn More</button>
          </Link>
          <CallerButton />
        </div>
        <div className={styles.brands}></div>
      </div>
      <div className={styles.imgContainer}>
        <Image
          src="https://i.postimg.cc/dQGbM0DR/kiya-equb2.png"
          alt=""
          fill
          className={styles.heroImg}
        />
      </div>
    </div>
  );
};

export default Home;
