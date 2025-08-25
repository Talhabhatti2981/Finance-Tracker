import React, { useState, useEffect } from "react";
import TransactionForm from "./component/TransactionForm";
import TransactionList from "./component/TransactionList";
import Balance from "./component/Balance";
import Filters from "./component/Filters";
import ThemeToggle from "./component/toggle/ThemeToggle";
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
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState<Filter>({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("theme") || "light");
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction: Omit<Transaction, "id"> & { amount: string | number }) => {
    setTransactions([...transactions, { id: Date.now(), ...transaction, amount: Number(transaction.amount) }]);
  };

  const editTransaction = (id: number, updated: Partial<Transaction> & { amount?: string | number }) => {
    setTransactions(
      transactions.map((t) =>
        t.id === id ? { ...t, ...updated, amount: updated.amount !== undefined ? Number(updated.amount) : t.amount } : t
      )
    );
  };

  const deleteTransaction = (id: number) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

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
