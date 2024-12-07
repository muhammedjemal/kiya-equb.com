"use client";
import Link from "next/link";
import styles from "./footer.module.css";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();

  console.log(pathname);

  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        {pathname === "/contact" && (
          <a href="mailto:info@kiyaequb.com?subject=Message%20from%20Website&body=Hi,%0A%0AI%20am%20interested%20in%20learning%20more%20about%20your%20services.%20Could%20you%20please%20provide%20more%20details?%0A%0AThank%20you.">
            Contact us: info@kiyaequb.com
          </a>
        )}
      </div>

      <div className={styles.text}>
        ©2024 - got a project?{" "}
        <Link href="https://t.me/Maverick_inc">
          {" "}
          <span
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              textDecorationStyle: "solid",
              textDecorationSkipInk: "none",
              textDecorationSkip: "none",
            }}
          >
            contact here.
          </span>{" "}
        </Link>
      </div>
    </div>
  );
};

export default Footer;
