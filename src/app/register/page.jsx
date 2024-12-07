"use client";

import React, { useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import { CldUploadWidget } from "next-cloudinary";
import {
  Dropdown,
  Link,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    dagna: {
      firstName: "",
      fatherName: "",
      motherName: "",
      phoneNumber: "",
      avatar: null,
      id_front: null,
      id_back: null,
    },
    sebsabi: {
      firstName: "",
      fatherName: "",
      motherName: "",
      phoneNumber: "",
      avatar: null,
      id_front: null,
      id_back: null,
    },
    tsehafi: {
      firstName: "",
      fatherName: "",
      motherName: "",
      phoneNumber: "",
      avatar: null,
      id_front: null,
      id_back: null,
    },
    description: "",
    equbName: "",
    avatar: null,
    banks: [{ bankName: "", accountNumber: "" }],
    equbType: "",
    equbAmount: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (section, field, result) => {
    if (result?.info?.secure_url) {
      const updatedFormData = { ...formData };
      updatedFormData[section][field] = result.info.secure_url; // Store Cloudinary URL
      setFormData(updatedFormData);
    } else {
      console.error("Upload failed or result.info.secure_url is missing.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData };

    if (
      name.startsWith("dagna") ||
      name.startsWith("sebsabi") ||
      name.startsWith("tsehafi")
    ) {
      const [section, field] = name.split(".");
      updatedFormData[section][field] = value;
    } else if (name.startsWith("banks")) {
      const [_, index, field] = name.split(".");
      updatedFormData.banks[index][field] = value;
    } else {
      updatedFormData[name] = value;
    }

    setFormData(updatedFormData);
  };

  const addBank = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      banks: [...prevFormData.banks, { bankName: "", accountNumber: "" }],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const [selectedEqubType, setSelectedEqubType] = useState(""); // State to store the selected value

  const handleSelection = (key) => {
    // Update the selectedEqubType state with the selected key
    setSelectedEqubType(key);
    console.log(`Selected Equb Type: ${key}`);

    // Update the formData state with the selected equbType (don't interrupt existing functionality)
    const updatedFormData = { ...formData, equbType: key };
    setFormData(updatedFormData); // Update formData with selected equbType
  };

  return (
    <div className="xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-1/2  mx-auto p-6 bg-gradient-to-r from-sky-900 to-indigo-900 rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold text-white text-center mb-6">
        Agent Registration
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {["dagna", "sebsabi", "tsehafi"].map((member) => (
          <div key={member} className="space-y-4">
            <h2 className="text-2xl font-semibold text-white capitalize">
              {member} Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name={`${member}.firstName`}
                value={formData[member].firstName}
                onChange={handleChange}
                label="First Name"
                className="text-black"
              />
              <Input
                name={`${member}.fatherName`}
                value={formData[member].fatherName}
                onChange={handleChange}
                label="Father's Name"
                className="text-black"
              />
              <Input
                name={`${member}.motherName`}
                value={formData[member].motherName}
                onChange={handleChange}
                label="Mother's Name"
                className="text-black"
              />
              <Input
                name={`${member}.phoneNumber`}
                value={formData[member].phoneNumber}
                onChange={handleChange}
                label="Phone Number"
                className="text-black"
              />
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onError={(error) =>
                  console.error("Upload Widget Error: ", error)
                } // Handle widget errors
                onSuccess={(result) =>
                  handleImageUpload(member, "avatar", result)
                } // Handle successful upload
              >
                {({ open }) => {
                  if (!open) {
                    console.error("Upload Widget is unavailable.");
                    return null; // Return nothing if open is undefined
                  }
                  return (
                    <button
                      type="button"
                      onClick={open} // Safely call the open function
                      className="text-teal-500 underline"
                    >
                      Upload Your Photo
                    </button>
                  );
                }}
              </CldUploadWidget>{" "}
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onError={(error) =>
                  console.error("Upload Widget Error: ", error)
                } // Handle widget errors
                onSuccess={(result) =>
                  handleImageUpload(member, "id_front", result)
                } // Handle successful upload
              >
                {({ open }) => {
                  if (!open) {
                    console.error("Upload Widget is unavailable.");
                    return null; // Return nothing if open is undefined
                  }
                  return (
                    <button
                      type="button"
                      onClick={open} // Safely call the open function
                      className="text-teal-500 underline"
                    >
                      Upload ID Front
                    </button>
                  );
                }}
              </CldUploadWidget>
              <CldUploadWidget
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                onError={(error) =>
                  console.error("Upload Widget Error: ", error)
                } // Handle widget errors
                onSuccess={(result) =>
                  handleImageUpload(member, "id_back", result)
                } // Handle successful upl oad
              >
                {({ open }) => {
                  if (!open) {
                    console.error("Upload Widget is unavailable.");
                    return null; // Return nothing if open is undefined
                  }
                  return (
                    <button
                      type="button"
                      onClick={open} // Safely call the open function
                      className="text-teal-500 underline"
                    >
                      Upload ID Back
                    </button>
                  );
                }}
              </CldUploadWidget>{" "}
            </div>
          </div>
        ))}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-white">Bank Accounts</h2>
          {formData.banks.map((bank, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name={`banks.${index}.bankName`}
                value={bank.bankName}
                onChange={handleChange}
                label="Bank Name"
                className="text-black"
              />
              <Input
                name={`banks.${index}.accountNumber`}
                value={bank.accountNumber}
                onChange={handleChange}
                label="Account Number"
                className="text-black"
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={addBank}
            className="text-white bg-green-500 hover:bg-green-600"
          >
            Add Bank
          </Button>
        </div>
        <Textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          label="Description"
          placeholder="Number of memebers, goal of amount, place of physical location etc."
          className="text-black"
        />
        <Input
          name="equbName"
          value={formData.equbName}
          onChange={handleChange}
          label="Equb Name"
          placeholder="Enter equb name"
          className="text-black"
        />
        <Input
          name="equbAmount"
          value={formData.equbAmount}
          onChange={handleChange}
          label="Equb Amount"
          placeholder="Enter equb amount"
          className="text-black"
          type="number" // Ensure the input is treated as a number
          min="0" // Prevent negative values
          step="any" // Allow decimal values if needed
          onInput={(e) => {
            if (e.target.value < 0) e.target.value = 0; // Ensure no negative value can be typed
          }}
        />
        <Dropdown backdrop="blur" style={{ color: "black" }}>
          <DropdownTrigger>
            <Button
              variant="bordered"
              className="text-white bg-green-500 hover:bg-green-600"
            >
              {selectedEqubType
                ? selectedEqubType.charAt(0).toUpperCase() +
                  selectedEqubType.slice(1)
                : "Equb Type"}{" "}
              {/* Display selected value */}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            variant="faded"
            aria-label="Equb Type Selection"
            onAction={handleSelection} // Handle selection
          >
            <DropdownItem key="monthly" name="equbType" value="monthly">
              Monthly
            </DropdownItem>
            <DropdownItem key="weekly" name="equbType" value="weekly">
              Weekly
            </DropdownItem>
            <DropdownItem key="daily" name="equbType" value="daily">
              Daily
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button
          type="submit"
          isLoading={loading}
          color="primary"
          className="w-full"
        >
          Register
        </Button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">Registration successful!</p>}
      </form>
    </div>
  );
};

export default RegisterPage;
