import React, { useState, useEffect } from "react";
import TransactionForm from "./component/Transactionform/TransactionForm";
import TransactionList from "./component/TransactionList/TransactionList";
import Balance from "./component/Balance/Balance";
import Filters from "./component/filter/Filters";
import ThemeToggle from "./component/toggle/ThemeToggle";
import TransactionPieChart from "./component/Piechart/Piechart"; 
import { supabase } from "./supabaseClient";
import { Menu } from "lucide-react"; 
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

    if (!error && data) {
      setTransactions((prev) => [...prev, data[0] as Transaction]);
    }
  };

  const editTransaction = async (id: number, updated: Partial<Transaction>) => {
    const { data, error } = await supabase
      .from("transactions")
      .update(updated)
      .eq("id", id)
      .select();

    if (!error && data) {
      setTransactions((prev) => prev.map((t) => (t.id === id ? (data[0] as Transaction) : t)));
    }
  };

  const deleteTransaction = async (id: number) => {
    const { error } = await supabase.from("transactions").delete().eq("id", id);
    if (!error) setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
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
    <div className={`min-h-screen flex ${theme === "light" ? "bg-gray-100 text-black" : "bg-gray-900 text-white"}`}>
      <aside className={`hidden md:block w-64 p-6 shadow-lg ${theme === "light" ? "bg-white" : "bg-gray-800"}`}>
        <h2 className="text-2xl font-bold mb-6">Finance Tracker</h2>
        <nav className="space-y-3 font-bold">
          {["dashboard", "AddTransaction", "balance", "TransactionList"].map((page) => (
            <button
              key={page}
              className="w-full text-left p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => setActivePage(page)}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>
        <div className="mt-6">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 p-6 z-50 transform transition-transform duration-300 md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
      >
        <h2 className="text-2xl font-bold mb-6 mt-10">Finance Tracker</h2>
        <nav className="space-y-3 font-bold ">
          {["dashboard", "AddTransaction", "balance", "TransactionList" ].map((page) => (
            <button
              key={page}
              className="w-full text-left p-2 rounded hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => {
                setActivePage(page);
                setSidebarOpen(false);
              }}
            >
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </button>
          ))}
        </nav>
        <div className="mt-6">
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>
      </aside>
      <main className="flex-1 p-6 md:p-8 w-full">
        <div className="flex items-center justify-between md:hidden mb-6">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
            <Menu size={24} />
          </button>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        {activePage === "dashboard" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Balance transactions={filteredTransactions} theme={theme} />
            <TransactionPieChart transactions={filteredTransactions} theme={theme} />
          </div>
        )}

        {activePage === "AddTransaction" && (
          <TransactionForm addTransaction={addTransaction} transactions={transactions} theme={theme} />
        )}

        {activePage === "balance" && (
          <Balance transactions={filteredTransactions} theme={theme} />
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

       
      </main>
    </div>
  );
};

export default App;
