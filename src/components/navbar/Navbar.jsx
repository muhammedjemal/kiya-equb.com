import Link from "next/link";
import Image from "next/image";
import Links from "./links/Links";
import styles from "./navbar.module.css";
import { auth } from "@/lib/auth";
import { connectToDb } from "@/lib/utils";
import { User } from "@/lib/models";

const Navbar = async () => {
  const session = await auth();
  // find user
  const user = session?.user;
  // if (!user) return "";
  console.log(user);
  const userId = user?.id;

  console.log(userId);
  userId && (await connectToDb());
  console.log(userId);
  let userLive;
  try {
    userLive = userId && (await User.findById(userId));
    console.log("success");
  } catch {
    console.log("an error");
  }
  console.log(userLive?.isSystemAdmin);
  console.log(userLive?.managerMembers);
  console.log(userLive?.collectorOf);
  // check if he is either system admin or non null managerMembers property or non null collectorOf property
  const isAdminOrManagerOrCollector =
    userLive?.isSystemAdmin === true ||
    userLive?.managerMembers !== null ||
    userLive?.collectorOf !== null;

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.logo}>
        {/* style the following logo using inline css */}
        <Image
          src="https://i.postimg.cc/dQGbM0DR/kiya-equb2.png"
          alt="logo place"
          width={110}
          height={110}
          style={{
            objectFit: "cover",
            borderRadius: "80%",
            border: "2px solid black",
            padding: "2px",
            backgroundColor: "white",
          }}
        />
      </Link>{" "}
      <div>
        <Links
          session={session}
          isAdminOrManagerOrCollector={isAdminOrManagerOrCollector}
        />
      </div>
    </div>
  );
};

export default Navbar;
