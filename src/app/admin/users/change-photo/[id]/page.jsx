"use client";

import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { CldUploadWidget } from "next-cloudinary";
// import { auth } from "@/lib/auth";
// const session = await auth();
// console.log(session);

const AvatarUploadPage = ({ params }) => {
  const userId = params.id; // Extract userId from URL slug
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Handle image upload
  const handleImageUpload = (result) => {
    if (result?.info?.secure_url) {
      setUploadedImageUrl(result.info.secure_url);
    } else {
      console.error("Upload failed or secure_url is missing.");
    }
  };

  // Handle submission to API
  const handleSubmit = async () => {
    if (!uploadedImageUrl) {
      setError("Please upload an image before submitting.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/upload-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, img: uploadedImageUrl }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.error || "Failed to upload avatar.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent">
      <h1 className="text-3xl font-bold mb-4">Change Avatar</h1>

      {/* Upload Widget */}
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onError={(error) => console.error("Upload Error: ", error)}
        onSuccess={handleImageUpload}
      >
        {({ open }) => {
          if (!open) return null;
          return (
            <Button
              onClick={open}
              color="primary"
              className="mb-4"
              disabled={loading}
            >
              Upload Avatar
            </Button>
          );
        }}
      </CldUploadWidget>

      {/* Uploaded Image Preview */}
      {uploadedImageUrl && (
        <img
          src={uploadedImageUrl}
          alt="Uploaded Avatar"
          className="w-32 h-32 rounded-full mb-4"
        />
      )}

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        isLoading={loading}
        disabled={loading}
        className="w-full max-w-xs"
      >
        Save Changes
      </Button>

      {/* Success/Error Messages */}
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && (
        <p className="text-green-500 mt-2">Avatar updated successfully!</p>
      )}
    </div>
  );
};

export default AvatarUploadPage;
