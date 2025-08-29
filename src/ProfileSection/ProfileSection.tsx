import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

type Props = {
  theme: string;
};

const ProfileSection: React.FC<Props> = ({ theme }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setEmail(user.email || "");
        setName(user.user_metadata?.full_name || "");
        setProfileImage(user.user_metadata?.avatar_url || null);
      }
    };

    fetchUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProfileImage(url);
    }
  };


  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (!confirmed) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
 
      await supabase.auth.signOut();
      alert("Your account has been deleted.");
      navigate("/login");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        full_name: name,
        avatar_url: profileImage,
      },
    });

    if (updateError) {
      alert(`Error updating profile: ${updateError.message}`);
      return;
    }
    if (password) {
      const { error: passError } = await supabase.auth.updateUser({
        password: password,
      });

      if (passError) {
        alert(`Password update failed: ${passError.message}`);
        return;
      }
    }

    alert("Profile saved successfully!");
    setPassword("");
  };

  return (
    <form
      className={`max-w-4xl mx-auto p-6 sm:p-8 rounded-xl shadow-lg flex flex-col gap-8
        ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"}`}
      onSubmit={handleSubmit}
    >
            <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-1 flex flex-col gap-4 w-full order-2 md:order-1">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className={`w-full p-4 rounded-lg focus:outline-none 
              ${theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`}
          />
          <input
            type="email"
            name="email"
            value={email}
            readOnly
            placeholder="Email"
            className={`w-full p-4 rounded-lg focus:outline-none
              ${theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`}
          />
        </div>
        <div className="flex flex-col items-center gap-4 order-1 md:order-2">
          <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={`p-2 rounded-lg
              ${theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`}
          />
        </div>
      </div>
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Change Password"
        className={`w-full p-4 rounded-lg focus:outline-none
          ${theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`}
      />
      <button
        type="submit"
        className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Save Profile
      </button>
    </form>
  );
};

export default ProfileSection;
