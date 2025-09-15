"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ProfileForm({ user }: { user: any }) {
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [city, setCity] = useState(user?.city || "");
  const [age, setAge] = useState(user?.age || "");
  const [country, setCountry] = useState(user?.country || "");
  const [gallery, setGallery] = useState<string[]>(user?.galleryImages || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If user prop changes (unlikely, but for safety)
  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone || "");
    setCity(user?.city || "");
    setAge(user?.age || "");
    setCountry(user?.country || "");
  }, [user]);

  // Handle image upload
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (gallery.length >= 5) {
      toast.error("You can upload up to 5 images only.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("email", user.email);

    const toastId = toast.loading("Uploading image...");
    try {
      const res = await fetch("/api/upload-gallery-image", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        const newGallery = [...gallery, data.url];
        setGallery(newGallery);

        // Update gallery in DB
        await fetch("/api/update-gallery-images", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, galleryImages: newGallery }),
        });

        toast.success("Image uploaded!", { id: toastId });
      } else {
        toast.error("Upload failed.", { id: toastId });
      }
    } catch {
      toast.error("Upload failed.", { id: toastId });
    }
  };

  // Handle image delete
  const handleDeleteImage = async (idx: number) => {
    const newGallery = gallery.filter((_, i) => i !== idx);
    setGallery(newGallery);

    // Update gallery in DB
    await fetch("/api/update-gallery-images", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email, galleryImages: newGallery }),
    });
    toast.success("Image removed.");
  };

  const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  const toastId = toast.loading("Saving...");
  try {
    const res = await fetch("/api/update-profile-info", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, // keep this disabled in the input!
        name,
        phone,
        city,
        age,
        country,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success("Profile updated!", { id: toastId });
    } else {
      toast.error(data.error || "Failed to update profile", { id: toastId });
    }
  } catch {
    toast.error("Failed to update profile", { id: toastId });
  }
};

  return (
    <form className="form-container" onSubmit={handleSave}>
      <div className="input">
        <Image src="/assets/profile/name.png" alt="user-icon" width={16} height={16} />
        <input type="text" placeholder='Full Name' value={name} onChange={e => setName(e.target.value)} />
      </div>
      <div className="input">
        <Image src="/assets/profile/email.png" alt="user-icon" width={16} height={16} />
        <input type="email" placeholder='Email' value={email} disabled readOnly />
      </div>
      <div className="input-row">
        <div className="input">
          <Image src="/assets/profile/phone.png" alt="user-icon" width={16} height={16} />
          <input type="number" placeholder='Phone' value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="input">
          <Image src="/assets/profile/city.png" alt="user-icon" width={16} height={16} />
          <input type="text" placeholder='City' value={city} onChange={e => setCity(e.target.value)} />
        </div>
      </div>
      <div className="input-row">
        <div className="input">
          <Image src="/assets/profile/age.png" alt="user-icon" width={16} height={16} />
          <input type="number" placeholder='Age' value={age} onChange={e => setAge(e.target.value)} />
        </div>
        <div className="input">
          <Image src="/assets/profile/country.png" alt="user-icon" width={16} height={16} />
          <input type="text" placeholder='Country' value={country} onChange={e => setCountry(e.target.value)} />
        </div>
      </div>
      <div className="gallery-container">
        {gallery.length < 5 && (
          <div className="upload-container" onClick={() => fileInputRef.current?.click()}>
            <Image src="/assets/profile/upload.png" alt="upload-icon" width={24} height={24} />
            <p>Upload upto 5 photos to attract more clients</p>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleGalleryUpload}
            />
          </div>
        )}
        <div className="img-grid">
          {gallery.map((img, idx) => (
            <div className="img-box" key={img} style={{ position: "relative" }}>
              <Image src={img} alt={`gallery-${idx}`} width={48} height={48} />
              <button
                type="button"
                className="remove-btn"
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  background: "rgba(0,0,0,0.5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "50%",
                  width: 20,
                  height: 20,
                  cursor: "pointer",
                  fontWeight: "bold",
                  lineHeight: "18px",
                  padding: 0,
                }}
                onClick={() => handleDeleteImage(idx)}
                aria-label="Remove image"
              >
                ×
              </button>
            </div>
          ))}
          {/* Fill empty boxes with plus icon if less than 4 images */}
          {Array.from({ length: Math.max(0, 4 - gallery.length) }).map((_, idx) => (
            <div className="img-box" key={`empty-${idx}`}>
              <Image src="/assets/profile/plus.svg" alt="add-photo" width={48} height={48} />
            </div>
          ))}
        </div>
      </div>
      <button type="submit">Save Changes</button>
    </form>
  );
}