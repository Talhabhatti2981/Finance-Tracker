import React, { useState } from "react";

const ProfileSection: React.FC = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you sure you want to delete your account?");
    if (confirmed) {
      alert("Account deleted");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile saved");
  };

  return (
    <form
      className="max-w-4xl mx-auto p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col gap-8"
      onSubmit={handleSubmit}
    >
      {/* Delete Account */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Delete Account
        </button>
      </div>

      {/* Profile Info */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Name & Email */}
        <div className="flex-1 flex flex-col gap-4 w-full order-2 md:order-1">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full p-4 border rounded-lg focus:outline-none text-gray-800 dark:text-gray-200 dark:bg-gray-700"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-4 border rounded-lg focus:outline-none text-gray-800 dark:text-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Profile Image */}
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
            className="p-2 border rounded-lg text-gray-800 dark:text-gray-200 dark:bg-gray-700"
          />
        </div>
      </div>

      {/* Change Password */}
      <input
        type="password"
        name="password"
        placeholder="Change Password"
        className="w-full p-4 border rounded-lg focus:outline-none text-gray-800 dark:text-gray-200 dark:bg-gray-700"
      />

      {/* Save Profile */}
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
