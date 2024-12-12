// pages/admin/users-by-date/[number].js
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

const UsersByNumber = ({ params }) => {
  console.log(params.id);

  const number = params.id;
  const [equbs, setEqubs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!number) return;

    const fetchEqubs = async () => {
      try {
        const response = await axios.get(`/api/payments-by-date/${number}`);
        console.log(response.data);
        setEqubs(response.data.equbs || []);
        console.log(response.data.equbs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching equbs:", error);
        setLoading(false);
      }
    };

    fetchEqubs();
  }, [number]);

  if (loading) {
    return <p className="text-center mt-20">Loading...</p>;
  }

  if (equbs.length === 0) {
    return (
      <p className="text-center mt-20 text-red-500">
        No equbs found for {number} payments.
      </p>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Equbs with {number} Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {equbs.map((equb, i) => (
          <div
            key={equb._id}
            className="p-4 border rounded shadow-sm bg-black hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-white">{equb.name}</h2>
            <p>Equb #{i + 1}</p>
            <Link
              href={`/admin/payments/${equb._id}`}
              className="mt-2 inline-block px-4 py-2 text-black bg-blue-500 rounded hover:bg-blue-600"
            >
              View Equb Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersByNumber;
