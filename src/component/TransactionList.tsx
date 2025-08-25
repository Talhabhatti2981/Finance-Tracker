import React, { useState } from "react";

type Transaction = {
  id: number;
  title: string;
  amount: number | string;
  type: "income" | "expense";
  category: string;
  date: string;
};

interface TransactionListProps {
  transactions: Transaction[];
  editTransaction: (
    id: number,
    updated: Partial<Transaction> & { amount?: string | number }
  ) => void;
  deleteTransaction: (id: number) => void;
  theme: string;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  editTransaction,
  deleteTransaction,
  theme, 
}) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Transaction>>({});

  const handleSave = (id: number) => {
    const updatedData: Partial<Transaction> & { amount?: string | number } = {
      ...editData,
      amount: Number(editData.amount ?? 0),
    };
    editTransaction(id, updatedData);
    setEditingId(null);
    setEditData({});
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-md transition-colors 
                  ${theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"}`}
    >
      <h2 className="text-xl font-bold mb-4">
        Transactions
      </h2>

      <div className="overflow-x-auto">
        <table
          className={`w-full border rounded-lg border-gray-300 ${
            theme === "light" ? "" : "border-gray-700"
          }`}
        >
          <thead>
            <tr
              className={`text-sm ${
                theme === "light"
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              <th className="p-3 border border-gray-300 dark:border-gray-600">Type</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">Title</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">Amount</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">Date</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">Category</th>
              <th className="p-3 border border-gray-300 dark:border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody className={`${theme === "light" ? "text-gray-800" : "text-gray-100"}`}>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className={`p-4 text-center ${
                    theme === "light" ? "text-gray-500" : "text-gray-400"
                  } border border-gray-300 ${theme === "light" ? "" : "border-gray-600"}`}
                >
                  No transactions available.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  className={`border border-gray-300 ${
                    theme === "light" ? "" : "border-gray-700"
                  } hover:bg-gray-50 dark:hover:bg-gray-700 transition`}
                >
                  <td className="p-2 text-center">
                    {editingId === t.id ? (
                      <select
                        value={editData.type ?? t.type}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            type: e.target.value as "income" | "expense",
                          })
                        }
                        className={`border p-1 rounded w-full ${
                          theme === "light"
                            ? "border-gray-300 bg-white text-black"
                            : "border-gray-600 bg-gray-900 text-white"
                        }`}
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          t.type === "income"
                            ? theme === "light"
                              ? "bg-green-100 text-green-700"
                              : "bg-green-900 text-green-300"
                            : theme === "light"
                            ? "bg-red-100 text-red-700"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {t.type.toUpperCase()}
                      </span>
                    )}
                  </td>

                  {editingId === t.id ? (
                    <>
                      <td className="p-2">
                        <input
                          type="text"
                          value={editData.title ?? t.title}
                          onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                          }
                          className={`border p-1 rounded w-full ${
                            theme === "light"
                              ? "border-gray-300 bg-white text-black"
                              : "border-gray-600 bg-gray-900 text-white"
                          }`}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editData.amount ?? t.amount}
                          onChange={(e) =>
                            setEditData({ ...editData, amount: e.target.value })
                          }
                          className={`border p-1 rounded w-full ${
                            theme === "light"
                              ? "border-gray-300 bg-white text-black"
                              : "border-gray-600 bg-gray-900 text-white"
                          }`}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          value={editData.date ?? t.date}
                          onChange={(e) =>
                            setEditData({ ...editData, date: e.target.value })
                          }
                          className={`border p-1 rounded w-full ${
                            theme === "light"
                              ? "border-gray-300 bg-white text-black"
                              : "border-gray-600 bg-gray-900 text-white"
                          }`}
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={editData.category ?? t.category}
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
                          className={`border p-1 rounded w-full ${
                            theme === "light"
                              ? "border-gray-300 bg-white text-black"
                              : "border-gray-600 bg-gray-900 text-white"
                          }`}
                        />
                      </td>
                      <td className="p-2 space-x-2 text-center">
                        <button
                          onClick={() => handleSave(t.id)}
                          className={`font-semibold hover:underline ${
                            theme === "light" ? "text-green-600" : "text-green-400"
                          }`}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditData({});
                          }}
                          className={`hover:underline ${
                            theme === "light" ? "text-gray-500" : "text-gray-300"
                          }`}
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-2">{t.title}</td>
                      <td className="p-2">{t.amount} PKR</td>
                      <td className="p-2">{t.date}</td>
                      <td className="p-2">{t.category}</td>
                      <td className="p-2 space-x-2 text-center">
                        <button
                          onClick={() => {
                            setEditingId(t.id);
                            setEditData({
                              title: t.title,
                              amount: t.amount,
                              date: t.date,
                              category: t.category,
                              type: t.type,
                            });
                          }}
                          className={`font-semibold hover:underline ${
                            theme === "light" ? "text-blue-600" : "text-blue-400"
                          }`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className={`font-semibold hover:underline ${
                            theme === "light" ? "text-red-600" : "text-red-400"
                          }`}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
