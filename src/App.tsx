import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import WeeklyExpenseBarChart from "./component/BarChart/Barchart"; // ✅ updated import
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
  period: "all" | "1week" | "1month" | "6months" | "1year";
};

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<Filter>({
    type: "all",
    category: "all",
    startDate: "",
    period: "all",
  });

  const [theme, setTheme] = useState<string>(() => localStorage.getItem("theme") || "light");
  const [activePage, setActivePage] = useState<string>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });
      if (!error && data) setTransactions(data as Transaction[]);
    };
    fetchTransactions();
  }, [session]);

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
    if (!error && data) {
      setTransactions(prev =>
        prev.map(t => (t.id === id ? (data[0] as Transaction) : t))
      );
    }
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) setTransactions(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const filteredTransactions = transactions.filter(t => {
    const now = new Date();
    const txDate = new Date(t.date);
    if (txDate > now) return false;

    if (filter.type !== "all" && t.type !== filter.type) return false;
    if (filter.category !== "all" && t.category !== filter.category) return false;
    if (filter.startDate && new Date(t.date) < new Date(filter.startDate)) return false;

    if (filter.period === "1week") {
      const weekAgo = new Date();
      weekAgo.setDate(now.getDate() - 7);
      if (txDate < weekAgo) return false;
    }

    if (filter.period === "1month") {
      const monthAgo = new Date();
      monthAgo.setMonth(now.getMonth() - 1);
      if (txDate < monthAgo) return false;
    }

    if (filter.period === "6months") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(now.getMonth() - 6);
      if (txDate < sixMonthsAgo) return false;
    }

    if (filter.period === "1year") {
      const yearAgo = new Date();
      yearAgo.setFullYear(now.getFullYear() - 1);
      if (txDate < yearAgo) return false;
    }

    return true;
  });

  return (
    <Router>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/signup" element={session ? <Navigate to="/" /> : <Signup />} />

        <Route
          path="/*"
          element={
            session ? (
              <div
                className={`min-h-screen flex ${
                  theme === "light"
                    ? "bg-gray-100 text-black mt-[43px] lg:mt-[55px] sm:mt-[45px]"
                    : "bg-gray-900 text-white mt-[43px] lg:mt-[55px] sm:mt-[45px]"
                }`}
              >
                <Navbar
                  theme={theme}
                  setTheme={setTheme}
                  activePage={activePage}
                  setActivePage={setActivePage}
                  sidebarOpen={sidebarOpen}
                  setSidebarOpen={setSidebarOpen}
                  handleLogout={handleLogout}
                  session={session}
                />
                <main className="flex-1 p-6 md:p-8 w-full">
                  {activePage === "dashboard" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
<WeeklyExpenseBarChart
  transactions={filteredTransactions}
  theme={theme}
/>
                      <Balance transactions={filteredTransactions} theme={theme} />
                      <TransactionPieChart transactions={filteredTransactions} theme={theme} />
                    </div>
                  )}

                  {activePage === "AddTransaction" && (
                    <TransactionForm
                      addTransaction={addTransaction}
                      transactions={transactions}
                      theme={theme}
                    />
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
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
