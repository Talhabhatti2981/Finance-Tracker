import React, { useEffect } from "react";
import { FaMoon, FaSun } from "react-icons/fa";

type ThemeToggleProps = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setTheme }) => {
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [setTheme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div
      onClick={toggleTheme}
      className={`absolute top-4 right-4 w-16 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-500 shadow-lg
        ${theme === "dark" ? "bg-gray-700" : "bg-yellow-400"}`}
    >
      <div
        className={`w-6 h-6 flex items-center justify-center rounded-full shadow-md transform transition-transform duration-500
          ${theme === "dark" ? "translate-x-8 bg-gray-900 text-yellow-400" : "translate-x-0 bg-white text-gray-800"}`}
      >
        {theme === "dark" ? <FaMoon size={14} /> : <FaSun size={14} />}
      </div>
    </div>
  );
};

export default ThemeToggle;
