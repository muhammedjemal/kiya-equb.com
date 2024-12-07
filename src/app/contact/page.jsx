"use client";
import Image from "next/image";
import styles from "./contact.module.css";
// import { useRouter } from "next/navigation";

// import dynamic from "next/dynamic";
// import HydrationTest from "@/components/hydrationTest";

// const HydrationTestNoSSR = dynamic(()=>import("@/components/hydrationTest"), {ssr: false})

// export const metadata = {
//   title: "Contact Page",
//   description: "Contact description",
// };

const ContactPage = () => {
  // const a = Math.random();
  // const router = useRouter();

  // console.log(a);
  const redirect = (formData) => {
    let { name, phone, msg } = Object.fromEntries(formData);
    console.log(name, phone, msg);
    // send sms using tel:phone and their message
    window.location.href = `sms:+251905059016?body=${name} ${phone}: ${msg}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.imgContainer}>
        <Image src="/contact.png" alt="" fill className={styles.img} />
      </div>
      <div className={styles.formContainer}>
        {/* <HydrationTestNoSSR/> */}
        {/* <div suppressHydrationWarning>{a}</div> */}
        <form action={redirect} className={styles.form}>
          <input type="text" placeholder="Name and Surname" name="name" />
          <input
            type="text"
            placeholder="Phone Number (Optional)"
            name="phone"
          />
          <textarea
            name="msg"
            id=""
            cols="30"
            rows="10"
            placeholder="Message"
          ></textarea>
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default ContactPage;
