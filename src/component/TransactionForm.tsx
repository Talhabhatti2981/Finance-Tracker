import React, { useState } from "react";
import PieChart from "./Piechart";
import { Transaction } from "../App";

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
    if (name === "title" && !/^[A-Za-z\s]*$/.test(value))
      return "Title must contain only letters";
    if (name === "amount" && (!value || Number(value) <= 0))
      return "Amount must be positive";
    if (name === "date" && value && new Date(value) > new Date())
      return "Date cannot be in the future";
    if (name === "category" && !/^[A-Za-z\s]*$/.test(value))
      return "Category must contain only letters";
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

  return (
    <div className="p-6 min-h-screen max-w-3xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className={`shadow-md p-6 rounded-lg space-y-4 transition-colors
                    ${theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
      >
        <h2 className="text-xl font-bold mb-2">Add Transaction</h2>

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className={`w-full p-2 border rounded-md focus:outline-none ${
              errors.title
                ? "border-red-500"
                : theme === "light"
                ? "border-gray-300"
                : "border-gray-600"
            } ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Amount</label>
          <input
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0"
            className={`w-full p-2 border rounded-md focus:outline-none ${
              errors.amount
                ? "border-red-500"
                : theme === "light"
                ? "border-gray-300"
                : "border-gray-600"
            } ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md ${
              theme === "light" ? "border-gray-300 bg-white text-black" : "border-gray-600 bg-gray-700 text-white"
            }`}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Category</label>
          <input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Enter category"
            className={`w-full p-2 border rounded-md focus:outline-none ${
              errors.category
                ? "border-red-500"
                : theme === "light"
                ? "border-gray-300"
                : "border-gray-600"
            } ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          />
          {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:outline-none ${
              errors.date
                ? "border-red-500"
                : theme === "light"
                ? "border-gray-300"
                : "border-gray-600"
            } ${theme === "light" ? "bg-white text-black" : "bg-gray-700 text-white"}`}
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Transaction
        </button>
      </form>

      <PieChart transactions={transactions} theme={theme}  />
    </div>
  );
}
