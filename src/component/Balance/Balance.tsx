import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { ArrowUpCircle, ArrowDownCircle, Wallet } from "lucide-react";

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

  const stats = [
    {
      title: "Income",
      value: income,
      color: "from-green-400 to-green-600",
      textColor: "text-green-500",
      icon: <ArrowUpCircle size={38} className="text-green-500" />,
    },
    {
      title: "Expense",
      value: expense,
      color: "from-red-400 to-red-600",
      textColor: "text-red-500",
      icon: <ArrowDownCircle size={38} className="text-red-500" />,
    },
    {
      title: "Balance",
      value: balance,
      color: "from-blue-400 to-blue-600",
      textColor: "text-blue-500",
      icon: <Wallet size={38} className="text-blue-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.05, y: -5 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className={`relative overflow-hidden rounded-2xl shadow-lg 
            p-6 flex flex-col gap-4 items-start backdrop-blur-md
            ${theme === "light" ? "bg-white border border-gray-200" : "bg-gray-900 border border-gray-700"}`}
        >
          <div
            className={`absolute -right-12 -top-12 w-44 h-44 rounded-full opacity-20 blur-2xl bg-gradient-to-br ${stat.color}`}
          ></div>
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10 ring-2 ring-offset-1`}
          >
            {stat.icon}
          </div>
          <div className="z-10">
            <h3 className="text-base md:text-lg font-medium text-gray-400">
              {stat.title}
            </h3>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`text-2xl md:text-3xl font-extrabold ${stat.textColor}`}
            >
              <CountUp
                start={0}
                end={stat.value}
                duration={1.5}
                separator=","
              />{" "}
              PKR
            </motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Balance;
