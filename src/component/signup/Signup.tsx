import React, { useState } from "react";
import { supabase } from "../../supabaseClient";

const Signup: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(""); 

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
    setPasswordStrength(checkPasswordStrength(pwd));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setErrorMessage("⚠️ Passwords do not match!");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) {
        setErrorMessage(`⚠️ ${error.message}`);
        return;
      }

      if (data.user) {
        await supabase.from("profiles").insert([{ id: data.user.id, username: name }]);
      }

      setSuccessMessage("Sign up successful! Please check your email to confirm your account.");
    } catch (err) {
      console.error("Signup error:", err);
      setErrorMessage("⚠️ Something went wrong. Please try again.");
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength === "Weak") return "text-red-600 dark:text-red-400";
    if (passwordStrength === "Medium") return "text-yellow-500 dark:text-yellow-400";
    if (passwordStrength === "Strong") return "text-green-600 dark:text-green-400";
    return "";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">Sign up to get started</p>

        <form className="space-y-5" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Enter your name"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={handlePasswordChange}
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
              name="confirmPassword"
              type="password"
              placeholder="Re-enter your password"
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300"
          >
            Sign Up
          </button>
        </form>

        {errorMessage && (
          <p className="mt-4 text-red-600 dark:text-red-400 text-sm text-center font-medium">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p className="mt-4 text-green-600 dark:text-green-400 text-sm text-center font-medium">
            {successMessage}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
          >
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
