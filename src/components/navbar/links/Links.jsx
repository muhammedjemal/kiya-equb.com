"use client";

import { useState } from "react";
import styles from "./links.module.css";
import NavLink from "./navLink/navLink";
import Image from "next/image";
import { handleLogout } from "@/lib/action";

const linksLoggedOut = [
  {
    title: "Homepage",
    path: "/",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Contact",
    path: "/contact",
  },
];
const linksLoggedIn = [
  {
    title: "Homepage",
    path: "/",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Contact",
    path: "/contact",
  },
];

// in desktop sze "links"
const links = [
  {
    title: "Homepage",
    path: "/",
  },
  {
    title: "About",
    path: "/about",
  },
  {
    title: "Contact",
    path: "/contact",
  },
];
// const linksLoggedIn = [
//   {
//     title: "Homepage",
//     path: "/",
//   },
//   {
//     title: "About",
//     path: "/about",
//   },
//   {
//     title: "Contact",
//     path: "/contact",
//   },
//   {
//     title: "My Equb",
//     path: "/equb",
//   },
// ];

const Links = ({ session, isAdminOrManagerOrCollector }) => {
  const [open, setOpen] = useState(false);
  const linksLoggedInAdmin = [
    {
      title: "Homepage",
      path: "/",
    },
    {
      title: "About",
      path: "/about",
    },
    {
      title: "Contact",
      path: "/contact",
    },
    {
      title: "Dashboard",
      path: `/admin/users/${session?.user?.id}`,
    },
  ];

  // TEMPORARY
  // const session = true;
  // const isAdmin = true;

  return (
    <div className={styles.container}>
      <div className={styles.links}>
        {links.map((link) => (
          <NavLink item={link} key={link.title} />
        ))}
        {session?.user ? (
          <>
            {isAdminOrManagerOrCollector && (
              <NavLink
                item={{
                  title: "Dashboard",
                  path: `/admin/users/${session?.user?.id}`,
                }}
              />
            )}
            <form action={handleLogout}>
              <button className={styles.logout}>Logout</button>
            </form>
          </>
        ) : (
          <NavLink item={{ title: "Login", path: "/login" }} />
        )}
      </div>
      <Image
        className={styles.menuButton}
        src="/menu.png"
        alt=""
        width={30}
        height={30}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className={styles.mobileLinks}>
          {session?.user &&
            isAdminOrManagerOrCollector &&
            linksLoggedInAdmin.map((link) => (
              <NavLink item={link} key={link.title} />
            ))}
          {session?.user &&
            !isAdminOrManagerOrCollector &&
            linksLoggedIn.map((link) => (
              <NavLink item={link} key={link.title} />
            ))}
          {!session?.user &&
            linksLoggedOut.map((link) => (
              <NavLink item={link} key={link.title} />
            ))}
        </div>
      )}
    </div>
  );
};

export default Links;
