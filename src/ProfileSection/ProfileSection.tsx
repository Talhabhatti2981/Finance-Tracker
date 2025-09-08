import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate } from "react-router-dom";

type Props = { theme: string };

const ProfileSection: React.FC<Props> = ({ theme }) => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
      setProfileImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.getSession();
      if (error || !data.session) {
        alert("User not authenticated");
        setLoading(false);
        return;
      }

      const token = data.session.access_token;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/delete-user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        alert("Error: " + (result.error || `Request failed with status ${response.status}`));
        setLoading(false);
        return;
      }

      alert("Your account and related data have been deleted permanently.");
      await supabase.auth.signOut();
      navigate("/login");

    } catch (err: any) {
      console.error("Fetch failed:", err);
      alert("Network error: Could not reach server. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: name, avatar_url: profileImage },
    });
    if (updateError) return alert(`Error updating profile: ${updateError.message}`);

    if (password) {
      const { error: passError } = await supabase.auth.updateUser({ password });
      if (passError) return alert(`Password update failed: ${passError.message}`);
    }

    alert("Profile saved successfully!");
    setPassword("");
  };

  return (
    <form className={`max-w-4xl mx-auto p-6 sm:p-8 rounded-xl shadow-lg flex flex-col gap-8 ${
      theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"
    }`} onSubmit={handleSubmit}>
      <div className="flex justify-end">
        <button type="button" onClick={handleDeleteAccount} disabled={loading}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
          {loading ? "Deleting..." : "Delete Account"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="flex-1 flex flex-col gap-4 w-full order-2 md:order-1">
          <input type="text" name="name" value={name} onChange={e => setName(e.target.value)}
            placeholder="Name"
            className={`w-full p-4 rounded-lg focus:outline-none ${
              theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`} />
          <input type="email" name="email" value={email} readOnly placeholder="Email"
            className={`w-full p-4 rounded-lg focus:outline-none ${
              theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`} />
        </div>

        <div className="flex flex-col items-center gap-4 order-1 md:order-2">
          <div className="w-32 h-32 rounded-full border-2 border-gray-300 overflow-hidden">
            {profileImage ? (
              <img src={profileImage} alt="Profile Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <input type="file" accept="image/*" onChange={handleImageChange}
            className={`p-2 rounded-lg ${
              theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`} />
        </div>
      </div>

      <input type="password" name="password" value={password} onChange={e => setPassword(e.target.value)}
        placeholder="Change Password"
        className={`w-full p-4 rounded-lg focus:outline-none ${
          theme === "light" ? "text-gray-800 bg-gray-200 shadow-lg" : "text-gray-200 bg-gray-700"}`} />

      <button type="submit"
        className="w-full px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Save Profile
      </button>
    </form>
  );
};

export default ProfileSection;
