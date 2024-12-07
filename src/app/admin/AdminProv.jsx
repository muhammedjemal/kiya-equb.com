import Navbar from "../ui/dashboard/navbar/navbar";
import Sidebar from "../ui/dashboard/sidebar/sidebar";
import styles from "../ui/dashboard/dashboard.module.css";
import Footer from "../ui/dashboard/footer/footer";
import React, { Suspense } from "react";
import { auth } from "@/lib/auth";
export const SessionContext = createContext(null);

const Layout = async ({ children }) => {
  const session = await auth();
  console.log(session);

  return (
    <SessionContext.Provider value={session}>
      <div className={styles.container}>
        <div className={styles.menu}>
          <Sidebar />
        </div>
        <div className={styles.content}>
          <Navbar />
          <Suspense fallback={<div>Loading...</div>}>
            {React.cloneElement(children, { session })}
          </Suspense>
          <Footer />
        </div>
      </div>
    </SessionContext.Provider>
  );
};

export default Layout;
