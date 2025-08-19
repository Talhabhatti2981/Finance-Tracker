import React, { useState, useEffect } from "react";
import  PieChart  from "./PieArcLabel";
type Transaction = {
  title: string;
  amount: string;
  type: "income" | "expense";
  category: string;
  date: string;
};

type Errors = Partial<Record<keyof Transaction, string>>;

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [formData, setFormData] = useState<Transaction>({
    title: "",
    amount: "",
    type: "income",
    category: "",
    date: "",
  });
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    const saved = localStorage.getItem("transactions");
    if (saved) setTransactions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);

  const validateField = (name: keyof Transaction, value: string) => {
    if (name === "title" && !/^[A-Za-z\s]*$/.test(value))
      return "Title must contain only letters";
    if (name === "amount" && (!value || Number(value) <= 0))
      return "Amount must be positive";
    if (name === "date" && value && new Date(value) > new Date())
      return "Date cannot be in the future";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: validateField(name as keyof Transaction, value) });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: Errors = {};
    (Object.keys(formData) as (keyof Transaction)[]).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setTransactions([...transactions, formData]);
    setFormData({ title: "", amount: "", type: "income", category: "", date: "" });
    setErrors({});
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.amount), 0);
  const balance = totalIncome - totalExpense;

  return (
    
    <div className="p-6 min-h-screen bg-gray-100 max-w-3xl mx-auto">
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md p-6 rounded-lg space-y-4">
        <h2 className="text-xl font-bold mb-2">Add Transaction</h2>

        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter title"
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
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
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.amount ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
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
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 border-gray-300"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Date</label>
          <input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
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
<PieChart transactions={transactions} />

    </div>
  );
  
}

