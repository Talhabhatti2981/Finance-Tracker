import React from "react";
import { supabase } from "../../supabaseClient";
import { Link } from "react-router-dom";
const Signup: React.FC = () => {
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      await supabase.from("profiles").insert([{ id: data.user?.id, username: name }]);
      alert("Sign up successful");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create Account
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Sign up to get started
        </p>
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
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none dark:bg-gray-800 dark:text-white"
            />
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
          <Link to ="/login">
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md transition duration-300"
          >
            Sign Up
          </button>
          </Link>
        </form>

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
