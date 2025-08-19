import React, { useState, useEffect } from "react";
import TransactionForm from "./component/TransactionForm";
import TransactionList from "./component/TransactionList";
import Balance from "./component/Balance";
import Filters from "./component/Filters";
// import PieArcLabel from "./component/PieArcLabel";
import "./App.css"
const App = () => {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });

  const [filter, setFilter] = useState({
    type: "all",
    category: "all",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, { id: Date.now(), ...transaction }]);
  };

  const editTransaction = (id, updated) => {
    setTransactions(
      transactions.map((t) => (t.id === id ? { ...t, ...updated } : t))
    );
  };

  const deleteTransaction = (id) => {
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
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Personal Finance Tracker
      </h1>
      <div className="bg-white shadow rounded-xl p-6 mb-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TransactionForm addTransaction={addTransaction} />
        </div>
        <div>
          <Balance transactions={filteredTransactions} />
        </div>
      </div>
      <div className="bg-white shadow rounded-xl p-6">
        <Filters filter={filter} setFilter={setFilter} />
        <TransactionList
          transactions={filteredTransactions}
          editTransaction={editTransaction}
          deleteTransaction={deleteTransaction}
        />
        {/* <PieArcLabel/> */}
      </div>
    </div>
  );
};
export default App;
