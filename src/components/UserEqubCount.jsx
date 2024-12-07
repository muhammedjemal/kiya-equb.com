"use client";
import { fetchEqub } from "@/lib/data";
import { connectToDb } from "@/lib/utils";
import React, { useState, useEffect } from "react";

function UserEqubCount({ userId }) {
  const [equbCount, setEqubCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEqubCount = async () => {
      setLoading(true);
      try {
        // Example: Fetch Equb count for the user
        console.log("kj");

        await connectToDb();
        console.log("kj");
        console.log(userId);

        const count = fetchEqub(userId);

        console.log(count);
        if (count) {
          setEqubCount("active!!");
        }
      } catch (error) {
        console.error("Error fetching Equb count:", error);
        setEqubCount("notActive"); // Handle error state if needed
      } finally {
        setLoading(false);
      }
    };

    fetchEqubCount();
  }, [userId]);

  if (loading) {
    return <span>Loading...</span>;
  }

  return <span>{equbCount}</span>; // Display the Equb count once fetched
}

export default UserEqubCount;
