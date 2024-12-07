"use client";

import { useEffect } from "react";
import Head from "next/head";

export default function DownloadPage() {
  useEffect(() => {
    const fileURL = "/kiyaequb.apk";

    const initiateDownload = () => {
      const link = document.createElement("a");
      link.href = fileURL;
      link.rel = "noopener noreferrer";
      link.click();
    };

    initiateDownload();
  }, []);

  return (
    <div style={styles.container}>
      <Head>
        <title>Download Kiya Equb App - Your Digital Savings Solution</title>
        <meta
          name="description"
          content="Download the Kiya Equb app for seamless digital savings management. Access your financial future today!"
        />
        <meta property="og:title" content="Download Kiya Equb App" />
        <meta
          property="og:description"
          content="Download the Kiya Equb app for seamless digital savings management. Access your financial future today!"
        />
        <meta
          property="og:image"
          content="https://i.postimg.cc/dQGbM0DR/kiya-equb2.png"
        />{" "}
        <meta property="og:url" content="https://kiyaequb.com/download" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Kiya Equb",
              description:
                "A digital savings app for managing your finances effectively.",
              applicationCategory: "FinanceApplication",
              operatingSystem: "Android",
              downloadUrl: "https://kiyaequb.com/kiyaequb.apk",
              image: "https://i.postimg.cc/dQGbM0DR/kiya-equb2.png",
            }),
          }}
        />
      </Head>

      <div style={styles.card}>
        {/* <img
          src="https://i.postimg.cc/dQGbM0DR/kiya-equb2.png"
          alt="Kiya Equb Logo"
          style={styles.logo}
        /> */}
        <h1 style={styles.title}>Download the Kiya Equb App</h1>
        <p style={styles.subtitle}>
          Experience seamless and secure digital savings with Kiya Equb.
        </p>

        <p style={styles.note}>
          Your download should start automatically. If not,{" "}
          <a href="/kiyaequb.apk" style={styles.link}>
            click here
          </a>
          .
        </p>
      </div>
    </div>
  );
}

// Inline styles with light sky color scheme
const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#E3F2FD", // Light sky blue background
    // backgroundColor: "#0d0c22", // dark bg
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
