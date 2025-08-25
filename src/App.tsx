import React, { useState, useEffect } from "react";
import TransactionForm from "./component/TransactionForm";
import TransactionList from "./component/TransactionList";
import Balance from "./component/Balance";
import Filters from "./component/Filters";
import ThemeToggle from "./component/toggle/ThemeToggle";
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
  useEffect(() => {
    const fetchTransactions = async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        console.error("❌ Error fetching:", error.message);
      } else if (data) {
        console.log("✅ Supabase data:", data);
        setTransactions(data as Transaction[]);
      }
    };

    fetchTransactions();
  }, []);
  const addTransaction = async (transaction: Omit<Transaction, "id">) => {
    const { data, error } = await supabase
      .from("transactions")
      .insert([{ ...transaction, amount: Number(transaction.amount) }])
      .select();

    if (error) {
      console.error("❌ Error adding:", error.message);
    } else if (data) {
      setTransactions((prev) => [...prev, data[0] as Transaction]);
    }
  };
  const editTransaction = async (id: number, updated: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from("transactions")
      .update(updated)
      .eq("id", id)
      .select();

    if (error) {
      console.error("❌ Error updating:", error.message);
    } else if (data) {
      setTransactions((prev) => prev.map((t) => (t.id === id ? (data[0] as Transaction) : t)));
    }
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (error) {
      console.error("❌ Error deleting:", error.message);
    } else {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
    }
  };

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const filteredTransactions = transactions.filter((t) => {
    if (filter.type !== "all" && t.type !== filter.type) return false;
    if (filter.category !== "all" && t.category !== filter.category) return false;
    if (filter.startDate && new Date(t.date) < new Date(filter.startDate)) return false;
    if (filter.endDate && new Date(t.date) > new Date(filter.endDate)) return false;
    return true;
  });

  return (
    <div
      className={`min-h-screen p-8 
                  ${theme === "light" ? "bg-white text-black" : "bg-black text-white"}`}
    >
      <ThemeToggle theme={theme} setTheme={setTheme} />

      <h1 className="text-3xl font-bold mb-9 text-center mt-20 ">
        Personal Finance Tracker
      </h1>

      <div className={`shadow rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6
                      ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <div className="md:col-span-2">
          <TransactionForm addTransaction={addTransaction} transactions={transactions} theme={theme} />
        </div>
        <div>
          <Balance transactions={filteredTransactions} theme={theme} />
        </div>
      </div>

      <div className={`shadow rounded-xl p-6 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <Filters filter={filter} setFilter={setFilter} theme={theme} />
        <TransactionList
          transactions={filteredTransactions}
          editTransaction={editTransaction}
          deleteTransaction={deleteTransaction}
          theme={theme}
        />
      </div>
    </div>
  );
};

export default App;
