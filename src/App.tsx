import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import TransactionForm from "./Transactionform/TransactionForm";
import TransactionList from "./TransactionList/TransactionList";
import Balance from "./Balance/Balance";
import Filters from "./filter/Filters";
import TransactionPieChart from "./component/Piechart/Piechart";
import Navbar from "./component/navbar/Navbar";
import Login from "./component/Login/Login";
import Signup from "./component/signup/Signup";
import ProfileSection from "./ProfileSection/ProfileSection";
import { supabase } from "./supabaseClient";
import ForgotPassword from "./component/Login/FogotPassword";
import WeeklyExpenseBarChart from "./component/BarChart/Barchart";
import UpdatePassword from "./component/Login/Updatepassword";
import "./App.css";

export type Transaction = {
  id: number;
  title: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  user_id?: string;
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
const getStartDate = (period: string) => {
  const now = new Date();
  switch (period) {
    case "1week":
      return new Date(now.setDate(now.getDate() - 7));
    case "1month":
      return new Date(now.setMonth(now.getMonth() - 1));
    case "6months":
      return new Date(now.setMonth(now.getMonth() - 6));
    case "1year":
      return new Date(now.setFullYear(now.getFullYear() - 1));
    default:
      return null;
  }
};

const filteredTransactions = transactions.filter((t) => {
  if (filter.type !== "all" && t.type !== filter.type) return false;
  if (filter.category !== "all" && t.category !== filter.category) return false;
  if (filter.startDate && t.date < filter.startDate) return false;
  if (filter.period !== "all") {
    const periodStart = getStartDate(filter.period);
    if (periodStart && new Date(t.date) < periodStart) return false;
  }
  return true;
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
      .eq("user_id", session.user.id)
      .order("date", { ascending: false });

    if (!error) {
      if (data && data.length > 0) {
        setTransactions(data as Transaction[]);
      } else {
        setTransactions([
          {
            id: -1,
            user_id: session.user.id,
            title: "Sample Income",
            amount: 1000,
            type: "income",
            category: "Salary",
            date: new Date().toISOString(),
          },
          {
            id: -2,
            user_id: session.user.id,
            title: "Sample Expense",
            amount: 200,
            type: "expense",
            category: "Food",
            date: new Date().toISOString(),
          },
        ]);
      }
    }
  };

  fetchTransactions();
}, [session]);

const addTransaction = async (transaction: Omit<Transaction, "id">) => {
  if (!session) return;

  const { data, error } = await supabase
    .from("transactions")
    .insert([{ ...transaction, user_id: session.user.id, amount: Number(transaction.amount) }])
    .select();

  if (!error && data) {
    setTransactions(prev => {
      const withoutSamples = prev.filter(t => t.id > 0);
      return [...withoutSamples, ...(data as Transaction[])];
    });
  }
};

  const editTransaction = async (id: number, updated: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from("transactions")
      .update(updated)
      .eq("id", id)
      .select();

    if (!error && data) {
      setTransactions(prev => prev.map(t => (t.id === id ? (data[0] as Transaction) : t)));
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


  return (
    <Router>
      <Routes>
        <Route path="/login" element={session ? <Navigate to="/" /> : <Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password" element={<UpdatePassword />} />
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
                      <WeeklyExpenseBarChart transactions={filteredTransactions} theme={theme} />
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
                        filteredTransactions={filteredTransactions}
                        theme={theme}
                      />
                    </>
                  )}

                  {activePage === "Profile Section" && <ProfileSection theme={theme} />}
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
