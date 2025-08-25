import React from "react";

type Transaction = {
  id?: number;
  title?: string;
  amount: number | string;
  type: "income" | "expense";
  category?: string;
  date?: string;
};

interface BalanceProps {
  transactions: Transaction[];
  theme: string;
}

const Balance: React.FC<BalanceProps> = ({ transactions, theme }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  let expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => {
      const newExpense = sum + Number(t.amount);
      return newExpense <= income ? newExpense : sum; 
    }, 0);
const balance = income - expense;
  return (
    <div
      className={`border rounded-lg p-4 transition-colors  
        ${theme === "light" ? "bg-white border-gray-300 text-black" : "bg-gray-800 border-gray-700 text-white"}`}
    >
      <h3 className="font-semibold mb-2">Balance</h3>
      <p className="font-semibold text-green-600 dark:text-green-400">
        Total Income: {income} PKR
      </p>
      <p className="font-semibold text-red-600 dark:text-red-400">
        Total Expense: {expense} PKR
      </p>
      <p className="font-semibold text-blue-600 dark:text-blue-400">
        Remaining Balance: {balance} PKR
      </p>
    </div>
  );
};

export default Balance;
