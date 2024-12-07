"use client";
import { useState } from "react";

// let copied = false;
export const Copier = ({ code }) => {
  let [copied, setCopied] = useState(false);
  return (
    <div className="copier">
      <button
        type="button"
        onClick={() => {
          navigator.clipboard.writeText(code);
          setCopied(true);
        }}
        // make it small formal button as most copy button apps to the clipboard using css not using tailwind here!
        style={{
          fontSize: "12px",
          padding: "5px",
          borderRadius: "5px",
          backgroundColor: "blue",
          color: "white",
          cursor: "pointer",
          marginRight: "10px",
          marginLeft: "10px",
          marginTop: "10px",
          marginBottom: "10px",
          fontWeight: "bold",
          width: "150px",
          verticalAlign: "middle",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="white"
          style={{ verticalAlign: "middle" }}
        >
          <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
        </svg>
        {copied && "copied!"}
        {!copied && "copy refferal code"}
      </button>
    </div>
  );
};
