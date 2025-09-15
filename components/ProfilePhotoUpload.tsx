"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProfilePhotoUpload({ user } : { user: any }) {
  const [imgUrl, setImgUrl] = useState(user?.image || "/assets/dashboard/profile-pic.png");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("email", user.email); // Pass email to API

  const toastId = toast.loading("Uploading profile photo...");
    try {
      const res = await fetch("/api/upload-profile-photo", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImgUrl(data.url);
        toast.success("Profile photo updated!", { id: toastId });
      } else {
        toast.error("Upload failed.", { id: toastId });
      }
    } catch (err) {
      toast.error("Upload failed.", { id: toastId });
    }
};

  return (
    <div className="profile-photo-container" style={{ position: "relative" }}>
      <div className="glow left"></div>
      <div className="photo-border-wrapper">
        <div className="photo-container" style={{ position: "relative", cursor: "pointer" }}>
          <Image
            src={imgUrl}
            alt="profile-photo"
            width={100}
            height={100}
            style={{ objectFit: "cover", borderRadius: "50%" }}
            onClick={() => fileInputRef.current?.click()}
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
            onChange={handleFileChange}
          />
        </div>
      </div>
      <div className="glow right"></div>
    </div>
  );
}