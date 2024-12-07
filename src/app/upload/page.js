"use client";
import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

const UploadPage = () => {
  const [imageUrl, setImageUrl] = useState(null);

  const handleSuccess = (result) => {
    setImageUrl(result.info.secure_url); // Get the secure URL of the uploaded image
  };

  return (
    <div>
      <h1>Upload an Image to Cloudinary</h1>

      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        onSuccess={handleSuccess}
      >
        {({ open }) => <button onClick={() => open()}>Upload Image</button>}
      </CldUploadWidget>

      {imageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img src={imageUrl} alt="Uploaded Image" width={400} />
        </div>
      )}
    </div>
  );
};

export default UploadPage;
