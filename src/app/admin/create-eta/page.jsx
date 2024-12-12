"use client";

import React, { useState } from "react";
import { Input, Button, Textarea } from "@nextui-org/react";
import { CldUploadWidget } from "next-cloudinary";

const RegisterEtaPage = () => {
  const [formData, setFormData] = useState({
    etaName: "",
    etaDescription: "",
    etaAvatar: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = (result) => {
    if (result?.info?.secure_url) {
      setFormData({ ...formData, etaAvatar: result.info.secure_url });
    } else {
      console.error("Image upload failed.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/register-eta", {
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

  return (
    <div className="xl:w-1/2 lg:w-1/2 md:w-1/2 sm:w-1/2 mx-auto p-6 bg-gradient-to-r from-sky-900 to-indigo-900 rounded-xl shadow-xl">
      <h1 className="text-4xl font-bold text-white text-center mb-6">
        Register New Eta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Input
          name="etaName"
          value={formData.etaName}
          onChange={handleChange}
          label="Eta Name"
          placeholder="Enter Eta name"
          className="text-black"
        />
        <Textarea
          name="etaDescription"
          value={formData.etaDescription}
          onChange={handleChange}
          label="Eta Description"
          placeholder="Enter a brief description"
          className="text-black"
        />
        {/* <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onError={(error) => console.error("Upload Widget Error: ", error)}
          onSuccess={handleImageUpload}
        >
          {({ open }) => (
            <button
              type="button"
              onClick={open}
              className="text-teal-500 underline"
            >
              Upload Eta Avatar
            </button>
          )}
        </CldUploadWidget> */}
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

export default RegisterEtaPage;
