"use client"; // This marks the file as a client component

import { useState } from "react";

const ManagerReport = () => {
  const [managerId, setManagerId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleDownloadReport = async () => {
    if (!managerId) {
      alert("Please provide a manager ID.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        // "http://localhost:51691/api/generate-report",
        "https://kback.onrender.com/api/generate-report",
        {
          // const response = await fetch("/api/generate-report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ managerId }),
        }
      );
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to generate report.");
      }

      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "manager-report.xlsx";
      link.click();
    } catch (error) {
      console.error("Error generating report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Manager Report</h1>
      <div>
        <label>
          Manager ID:
          <input
            className="text-black px-4 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            placeholder="Enter Manager ID"
          />
        </label>
      </div>
      <div>
        <button
          onClick={handleDownloadReport}
          disabled={isLoading}
          className="px-6 py-2 text-white rounded bg-blue-500 hover:bg-blue-600"
        >
          {isLoading ? "Generating..." : "Download Report"}
        </button>
      </div>
    </div>
  );
};

export default ManagerReport;
