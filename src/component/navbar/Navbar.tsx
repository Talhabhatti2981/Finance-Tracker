import React from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "../toggle/ThemeToggle";

type NavbarProps = {
  theme: string;
  setTheme: (theme: string) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
};

const Navbar: React.FC<NavbarProps> = ({
  theme,
  setTheme,
  activePage,
  setActivePage,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const pages = ["dashboard", "AddTransaction", "TransactionList", "Profile Section"];

  return (
    <>
      <aside
        className={`hidden md:flex flex-col justify-between w-64 p-6 shadow-lg ${
          theme === "light" ? "bg-white" : "bg-gray-800"
        }`}
      >
        
        
        <nav className="space-y-3 font-bold">
          {pages.map((page) => (
            <button
              key={page}
              className={`w-full text-left p-2 rounded transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 ${
                activePage === page ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
              onClick={() => setActivePage(page)}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>
        <div className="mt-8">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 p-6 z-50 flex flex-col justify-between transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold mt-[75px]">Finance Tracker</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-3 font-bold">
          {pages.map((page) => (
            <button
              key={page}
              className={`w-full text-left p-2 rounded transition-colors hover:bg-gray-300 dark:hover:bg-gray-700 ${
                activePage === page ? "bg-gray-200  dark:bg-gray-700" : ""
              }`}
              onClick={() => {
                setActivePage(page);
                setSidebarOpen(false);
              }}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>

        <div className="mt-8 space-y-4">
          <ThemeToggle theme={theme} setTheme={setTheme} />
          
        </div>
      </aside>
      <div
        className={`fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3 shadow-md ${
          theme === "light" ? "bg-white text-black" : "bg-gray-900 text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 md:hidden"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-bold text-lg md:hidden">Finance Tracker</h1>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/Login"
            className={`px-4 py-2 rounded-lg font-medium transition-colors shadow-sm ${
              theme === "light"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            Login
          </Link>
          <Link
            to="/Signup"
            className={`px-4 py-2 rounded-lg font-medium border transition-colors shadow-sm ${
              theme === "light"
                ? "border-blue-600 text-blue-600 hover:bg-blue-50"
                : "border-blue-400 text-blue-400 hover:bg-gray-700"
            }`}
          >
            Sign Up
          </Link>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </div>
      <div className="h-14 md:hidden" />
    </>
  );
};

export default Navbar;
