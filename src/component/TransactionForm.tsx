import React, { useState } from "react";

type Transaction = {
  title: string;
  amount: string; 
  type: "income" | "expense";
  category: string;
  date: string;
};

type Errors = Partial<Record<keyof Transaction, string>>;

interface TransactionFormProps {
  addTransaction: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ addTransaction }) => {
  const [formData, setFormData] = useState<Transaction>({
    title: "",
    amount: "",
    type: "income",
    category: "",
    date: "",
  });

  const [errors, setErrors] = useState<Errors>({});

  const validateField = (name: keyof Transaction, value: string): string => {
    let error = "";
    if (name === "title") {
      if (!/^[A-Za-z\s]*$/.test(value)) {
        error = "Title must contain only letters";
      }
    }
    if (name === "amount") {
      if (!value || Number(value) <= 0) {
        error = "Amount must be positive";
      }
    }
    if (name === "date") {
      if (value && new Date(value) > new Date()) {
        error = "Date cannot be in the future";
      }
    }
    return error;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    const error = validateField(name as keyof Transaction, value);
    setErrors({ ...errors, [name]: error });
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

    addTransaction(formData);
    setFormData({
      title: "",
      amount: "",
      type: "income",
      category: "",
      date: "",
    });
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Enter title"
          value={formData.title}
          onChange={handleChange}
          className={`mt-1 w-full p-2 border rounded-lg 
            focus:outline-none focus:ring-0 focus:border-gray-300
            ${errors.title ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Amount</label>
        <input
          type="number"
          name="amount"
          placeholder="0"
          value={formData.amount}
          onChange={handleChange}
          className={`mt-1 w-full p-2 border rounded-lg 
            focus:outline-none focus:ring-0 focus:border-gray-300
            ${errors.amount ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.amount && <p className="text-red-500 text-sm">{errors.amount}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="mt-1 w-full p-2 border rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Category</label>
        <input
          type="text"
          name="category"
          placeholder="Select category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 w-full  p-2 border rounded-lg focus:outline-none focus:ring-0 focus:border-gray-300"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium">Date</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className={`mt-1 w-full p-2 border rounded-lg 
            focus:outline-none focus:ring-0 focus:border-gray-300
            ${errors.date ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.date && <p className="text-red-500 text-sm">{errors.date}</p>}
      </div>

      <div className="col-span-2">
        <button
          type="submit"
          className="bg-blue-500 text-white w-full py-2 rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </div>
    </form>
  );
};

export default TransactionForm;
