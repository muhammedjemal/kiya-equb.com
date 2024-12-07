"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import bcryptjs from "bcryptjs";
import { connectToDb } from "@/lib/utils";
import { User } from "@/lib/models";
import { revalidatePath } from "next/cache";

const UserProfileForm = ({ user, loggedInUser, managers }) => {
  const [formData, setFormData] = useState({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    motherName: user.motherName,
    phoneNumber: user.phoneNumber,
    password: "",
    managerId: user.underManager || "",
  });

  const [loading, setLoading] = useState(false); // Optional: state to manage loading status
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    const {
      id,
      firstName,
      lastName,
      motherName,
      phoneNumber,
      password,
      managerId,
    } = formData;

    const updateFields = { firstName, lastName, motherName, managerId };

    if (password) {
      try {
        const hashedPassword = await bcryptjs.hash(password, 10);
        updateFields.password = hashedPassword;
      } catch (error) {
        console.error("Error hashing password:", error);
        alert("Error hashing password. Please try again.");
        setLoading(false);
        return;
      }
    }

    // Phone number validation (moved to server-side for better security)
    try {
      await connectToDb();
      await User.findByIdAndUpdate(id, updateFields);

      revalidatePath("/admin/users");
      revalidatePath(`/admin/users/${id}`);
      router.refresh(); // Refresh the page to reflect changes

      setLoading(false); // Stop loading after submission
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user. Please try again.");
      setLoading(false); // Stop loading if there's an error
    }
  };

  const validatePhoneNumber = (phoneNumber) => {
    if (typeof phoneNumber !== "string") {
      throw new Error("Phone number must be a string.");
    }
    phoneNumber = phoneNumber.replace(/\s/g, "");
    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.slice(1);
    }
    if (phoneNumber.startsWith("251")) {
      phoneNumber = phoneNumber.slice(3);
    } else if (phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.slice(1);
    } else {
      throw new Error("Invalid phone number format.");
    }
    if (!/^\d+$/.test(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }
    phoneNumber = Number(phoneNumber).toString();
    if (
      !(phoneNumber.startsWith("9") && phoneNumber.length === 9) &&
      !(phoneNumber.startsWith("7") && phoneNumber.length === 9)
    ) {
      throw new Error("Invalid phone number format.");
    }
    return "+251" + phoneNumber;
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
    >
      <input type="hidden" name="id" value={formData.id} />
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="firstName"
        >
          First Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="lastName"
        >
          Last Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="motherName"
        >
          Mother Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="motherName"
          value={formData.motherName}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="phoneNumber"
        >
          Phone Number:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="tel"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
        />
      </div>
      {loggedInUser.oprator !== true && loggedInUser.collectorOf === null && (
        <>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter new password..."
            />
          </div>
        </>
      )}

      {loggedInUser.isSystemAdmin && loggedInUser.oprator !== true && (
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="managerId"
          >
            Placement: ⭐
          </label>
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="managerId"
            value={formData.managerId}
            onChange={handleChange}
          >
            <option value="">Select Manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </select>
        </div>
      )}

      {loggedInUser.managerMembers !== null
        ? loggedInUser.id === user.underManager && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          )
        : loggedInUser.oprator !== true &&
          loggedInUser.collectorOf === null && (
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          )}
    </form>
  );
};

export default UserProfileForm;
