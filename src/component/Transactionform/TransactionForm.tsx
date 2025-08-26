import React, { useState } from "react";
import { motion } from "framer-motion";
import PieChart from "../Piechart/Piechart";
import { Transaction } from "../../App";

type Props = {
  addTransaction: (transaction: Omit<Transaction, "id"> & { amount: string | number }) => void;
  transactions: Transaction[];
  theme: string;
};

type Errors = Partial<Record<keyof Omit<Transaction, "id">, string>>;

export default function TransactionForm({ addTransaction, transactions, theme }: Props) {
  const [formData, setFormData] = useState<Omit<Transaction, "id">>({
    title: "",
    amount: 0,
    type: "income",
    category: "",
    date: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const validateField = (name: keyof Omit<Transaction, "id">, value: string) => {
    if (name === "title" && !/^[A-Za-z\s]*$/.test(value)) return "Title must contain only letters";
    if (name === "amount" && (!value || Number(value) <= 0)) return "Amount must be positive";
    if (name === "date" && value && new Date(value) > new Date()) return "Date cannot be in the future";
    if (name === "category" && !/^[A-Za-z\s]*$/.test(value)) return "Category must contain only letters";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name as keyof Omit<Transaction, "id">, value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Errors = {};
    (Object.keys(formData) as (keyof Omit<Transaction, "id">)[]).forEach((key) => {
      const err = validateField(key, formData[key] as string);
      if (err) newErrors[key] = err;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    addTransaction({ ...formData, amount: Number(formData.amount) });
    setFormData({ title: "", amount: 0, type: "income", category: "", date: "" });
    setErrors({});
  };

  const inputClasses = (field: keyof Omit<Transaction, "id">) =>
    `w-full p-3 rounded-xl border focus:outline-none transition-colors duration-300 shadow-sm
    ${errors[field] ? "border-red-500" : theme === "light" ? "border-gray-300" : "border-gray-600"}
    ${theme === "light" ? "bg-white text-black placeholder-gray-400" : "bg-gray-700 text-white placeholder-gray-300"}`;

  const formBg = theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white";

  return (
    <div className="p-6 min-h-screen max-w-3xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`shadow-lg p-6 rounded-2xl space-y-6 ${formBg} border ${theme === "light" ? "border-gray-200" : "border-gray-700"}`}
      >
        <h2 className="text-2xl font-extrabold mb-4 text-center tracking-wide">Add Transaction</h2>

        <div className="grid gap-4 md:grid-cols-2">
          {["title", "amount", "category", "date"].map((field, index) => (
            <motion.div
              key={field}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
            >
              <label className="block font-semibold mb-1 capitalize">{field}</label>
              <input
                name={field}
                type={field === "amount" ? "number" : field === "date" ? "date" : "text"}
                value={formData[field as keyof Omit<Transaction, "id">]}
                onChange={handleChange}
                max={field === "date" ? new Date().toISOString().split("T")[0] : undefined}
                placeholder={`Enter ${field}`}
                className={inputClasses(field as keyof Omit<Transaction, "id">)}
              />
              {errors[field as keyof Omit<Transaction, "id">] && (
                <p className="text-red-500 text-sm mt-1">{errors[field as keyof Omit<Transaction, "id">]}</p>
              )}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <label className="block font-semibold mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className={`w-full p-3 rounded-xl border focus:outline-none transition-colors duration-300
                ${theme === "light" ? "border-gray-300 bg-white text-black" : "border-gray-600 bg-gray-700 text-white"}`}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </motion.div>
        </div>

        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-3 rounded-xl font-semibold shadow-lg hover:from-blue-600 hover:to-indigo-600 transition"
        >
          Add Transaction
        </motion.button>
      </motion.form>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="mt-10"
      >
        <PieChart transactions={transactions} theme={theme} />
      </motion.div>
    </div>
  );
}
