import Image from "next/image";
import styles from "./about.module.css";
import Link from "next/link";

export const metadata = {
  title: "About Page",
  description: "About description",
};

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h2 className={styles.subtitle}>About Kiya Equb</h2>
        <h1 className={styles.title}>
          We are experianced in the traditional <i>Equb</i> in a modern way.
        </h1>
        <p className={styles.desc}>
          We are trusted by many of our clients with plenty of experiance on it.
          Our bureaucracy has been in the field for years in Ethiopia making our
          clients financially free to save.
        </p>
        <div className={styles.boxes}>
          <div className={styles.box}>
            <h1>Years</h1>
            <p>of experience</p>
          </div>
          <div className={styles.box}>
            <h1>Happy </h1>
            <p> Clients</p>
          </div>
          <div className={styles.box}>
            <h1>Much</h1>
            <p>Trusted</p>
          </div>
        </div>
        <span style={stylessd.title}>
          {" "}
          <Link rel="stylesheet" href="/download">
            Download our app now
          </Link>
        </span>
      </div>
      <div className={styles.imgContainer}>
        <Image src="/about.png" alt="About Image" fill className={styles.img} />
      </div>
    </div>
  );
};
const stylessd = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#E3F2FD", // Light sky blue background
    padding: "20px",
  },
  card: {
    textAlign: "center",
    backgroundColor: "#FFFFFF", // White for the card to keep it fresh and clean
    padding: "40px",
    borderRadius: "12px",
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    width: "100%",
  },
  logo: {
    width: "100px",
    height: "100px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    marginBottom: "10px",
    color: "#1565C0", // Strong blue for the title
  },
  subtitle: {
    fontSize: "16px",
    color: "#5D99C6", // Muted blue accent for subtitle
    marginBottom: "30px",
  },
  note: {
    fontSize: "14px",
    color: "#1565C0",
    marginTop: "20px",
  },
  link: {
    color: "#1E88E5", // Bright blue for the link to match the light sky theme
    textDecoration: "underline",
  },
};

export default AboutPage;
