"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { connectToDb } from "@/lib/utils";
import { Equb } from "@/lib/models";
import { revalidatePath } from "next/cache";

const EqubCreationForm = ({ ownerId }) => {
  const [formData, setFormData] = useState({
    owner: ownerId,
    name: "",
    type: "",
    amount: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      isNaN(formData.amount) ||
      formData.amount <= 0 ||
      !formData.name ||
      !formData.type
    ) {
      alert("Invalid amount, name, or type. Please check your input.");
      return;
    }

    try {
      await connectToDb();
      const newEqub = new Equb(formData);
      await newEqub.save();

      revalidatePath("/admin/users");
      revalidatePath("/admin/users/[id]");
      revalidatePath("/admin/equbs");
      revalidatePath("/admin");
      router.refresh(); // Refresh the page
    } catch (error) {
      console.error("Error creating Equb:", error);
      alert("Error creating Equb. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 mt-4"
    >
      <input type="hidden" name="owner" value={formData.owner} />
      <h2 className="text-xl font-bold mb-4">Create new Equb for this user:</h2>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          New Equb Name:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter the new Equb name..."
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="type"
        >
          New Equb Type:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Enter the new Equb type..."
        />
      </div>

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="amount"
        >
          Amount:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter the new Equb amount..."
        />
      </div>

      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        type="submit"
      >
        Create
      </button>
    </form>
  );
};

export default EqubCreationForm;
