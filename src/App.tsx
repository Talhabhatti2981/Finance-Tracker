import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TransactionForm from "./component/Transactionform/TransactionForm";
import TransactionList from "./component/TransactionList/TransactionList";
import Balance from "./component/Balance/Balance";
import Filters from "./component/filter/Filters";
import TransactionPieChart from "./component/Piechart/Piechart"; 
import Navbar from "./component/navbar/Navbar";
import Login from "./component/Login/Login";  
import Signup from "./component/signup/Signup";
import ProfileSection from "./component/ProfileSection/ProfileSection";
import { supabase } from "./supabaseClient";
import "./App.css";

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
};

export type Filter = {
  type: "all" | "income" | "expense";
  category: string;
  startDate: string;
  endDate: string;
};

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Filter>({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("theme") || "light");
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch transactions from Supabase
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
      if (!error && data) setTransactions(data as Transaction[]);
    };
    fetchTransactions();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert([{ ...transaction, amount: Number(transaction.amount) }])
      .select();
    if (!error && data) setTransactions(prev => [...prev, data[0] as Transaction]);
  };

  const editTransaction = async (id: number, updated: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from("transactions")
      .update(updated)
      .eq("id", id)
      .select();
    if (!error && data) setTransactions(prev => prev.map(t => t.id === id ? (data[0] as Transaction) : t));
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
  };

  // Dark mode effect
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const filteredTransactions = transactions.filter(t => {
    if (filter.type !== "all" && t.type !== filter.type) return false;
    if (filter.category !== "all" && t.category !== filter.category) return false;
    if (filter.startDate && new Date(t.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(t.date) > new Date(filter.endDate)) return false;
    return true;
  });

  return (
    <Router>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main app routes */}
        <Route
          path="/*"
          element={
            <div className={`min-h-screen flex ${theme === "light" ? "bg-gray-100 text-black" : "bg-gray-900 text-white mt-[43px] lg:mt-[65px] sm:mt-[45px]"}`}>
              <Navbar
                theme={theme}
                setTheme={setTheme}
                activePage={activePage}
                setActivePage={setActivePage}
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
              />
              <main className="flex-1 p-6 md:p-8 w-full">
                {activePage === "dashboard" && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Balance transactions={filteredTransactions} theme={theme} />
                    <TransactionPieChart transactions={filteredTransactions} theme={theme} />
                  </div>
                )}

                {activePage === "AddTransaction" && (
                  <TransactionForm addTransaction={addTransaction} transactions={transactions} theme={theme} />
                )}

                {activePage === "TransactionList" && (
                  <>
                    <Filters filter={filter} setFilter={setFilter} theme={theme} />
                    <TransactionList
                      transactions={filteredTransactions}
                      editTransaction={editTransaction}
                      deleteTransaction={deleteTransaction}
                      theme={theme}
                    />
                  </>
                )}

                {activePage === "Profile Section" && <ProfileSection />}
              </main>
            </div>
          }
        />
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
