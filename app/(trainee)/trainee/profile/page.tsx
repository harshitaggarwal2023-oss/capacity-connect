"use client";

import { useEffect, useState } from "react";
import { MetalButton } from "@/components/ui/metal-button";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    fullName: "",
    qualifications: "",
    skills: "",
    experience: "",
    yearsExp: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setProfile({
            fullName: data.fullName || "",
            qualifications: data.qualifications?.join(", ") || "",
            skills: data.skills?.join(", ") || "",
            experience: data.experience || "",
            yearsExp: data.yearsExp || 0,
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === "yearsExp" ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          qualifications: profile.qualifications.split(",").map((s) => s.trim()).filter(Boolean),
          skills: profile.skills.split(",").map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (res.ok) {
        setMessage("Profile updated successfully.");
      } else {
        setMessage("Failed to update profile.");
      }
    } catch (error) {
      setMessage("An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-[#F7F4EF] min-h-[calc(100vh-4rem)] p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-[#FAF9F6] p-6 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Qualifications (comma-separated)</label>
          <textarea
            name="qualifications"
            value={profile.qualifications}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-transparent h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
          <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-transparent h-24"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Experience Description</label>
          <textarea
            name="experience"
            value={profile.experience}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-transparent h-32"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
          <input
            type="number"
            name="yearsExp"
            value={profile.yearsExp}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 bg-transparent"
            min="0"
          />
        </div>
        
        {message && <p className="text-sm font-medium text-blue-600">{message}</p>}
        
        <MetalButton type="submit" disabled={saving} variant="success">
          {saving ? "Saving..." : "Save Profile"}
        </MetalButton>
      </form>
    </div>
  );
}
