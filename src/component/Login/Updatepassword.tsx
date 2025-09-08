import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const UpdatePassword: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = hashParams.get("access_token");
    const refresh_token = hashParams.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth.setSession({ access_token, refresh_token }).then(({ error }) => {
        if (error) {
          console.error("Failed to create session:", error.message);
          setMessage("Invalid or expired link. Please request a new reset.");
        } else {
          console.log("Session created from recovery link");
        }
      });
    } else {
      setMessage("Auth session missing. Please request a new reset link.");
    }
  }, []);
  const checkPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    if (strength <= 2) return "Weak";
    if (strength === 3 || strength === 4) return "Medium";
    if (strength === 5) return "Strong";
    return "";
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setMessage(" Passwords do not match!");
      return;
    }

    if (!passwordStrength || passwordStrength === "Weak") {
      setMessage(" Please choose a stronger password.");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage(` ${error.message}`);
    } else {
      setMessage(" Password updated successfully! Redirecting to login...");
      setTimeout(() => navigate("/Login"), 2000);
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "text-red-600 dark:text-red-400";
    if (passwordStrength === "Medium") return "text-yellow-500 dark:text-yellow-400";
    if (passwordStrength === "Strong") return "text-green-600 dark:text-green-400";
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Reset Password
        </h2>
     <form className="space-y-5" onSubmit={handleUpdatePassword}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
            {passwordStrength && (
              <p className={`mt-1 text-sm font-medium ${getStrengthColor()}`}>
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-md transition duration-300"
          >
            Update Password
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">{message}</p>
        )}
      </div>
    </div>
  );
};

export default UpdatePassword;
