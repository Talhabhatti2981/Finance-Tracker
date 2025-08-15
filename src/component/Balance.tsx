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
}

const Balance: React.FC<BalanceProps> = ({ transactions }) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  return (
    <div className="border rounded-lg p-4">
      <h3 className="font-semibold mb-2">Balance</h3>
      <p className="text-green-600 font-semibold">
        Total Income {income} PKR
      </p>
      <p className="text-red-600 font-semibold">
        Total Expense {expense} PKR
      </p>
      <p className="text-blue-600 font-semibold">
        Remaining Balance {balance} PKR
      </p>
    </div>
  );
};

export default Balance;
