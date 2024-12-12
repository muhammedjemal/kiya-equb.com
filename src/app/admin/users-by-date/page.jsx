// pages/admin/users-by-date/index.js
"use client";
import { useState } from "react";
import Link from "next/link";

const UsersByDate = () => {
  const [days, setDays] = useState("");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-2xl font-bold mb-4 text-white">
        Pick Number of Days
      </h1>
      <p className="mb-6 text-white">
        How many days' paid users do you want to see?
      </p>
      <input
        type="number"
        placeholder="Enter number of days"
        value={days}
        onChange={(e) => setDays(e.target.value)}
        className="text-black px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Link
        href={`/admin/users-by-date/${days}`}
        className={`px-6 py-2 text-white rounded bg-blue-500 hover:bg-blue-600 ${
          !days && "opacity-50 pointer-events-none"
        }`}
      >
        Check
      </Link>
    </div>
  );
};

export default UsersByDate;
