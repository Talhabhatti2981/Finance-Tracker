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
      className={`p-6 rounded-2xl shadow-lg transition-colors overflow-hidden
        ${theme === "light" ? "bg-white text-black" : "bg-gray-800 text-white"}
      `}
    >
      <h2 className="text-2xl font-bold mb-6">Transactions</h2>
      <div className="hidden md:block overflow-x-auto">
        <table
          className={`w-full border rounded-xl overflow-hidden shadow-sm text-sm lg:text-base 
            ${theme === "light" ? "border-gray-200" : "border-gray-700"}
          `}
        >
          <thead>
            <tr
              className={`${
                theme === "light"
                  ? "bg-gray-100 text-gray-700"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {["Type", "Title", "Amount", "Date", "Category", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="p-3 font-semibold text-left border border-gray-200 dark:border-gray-600"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-6 text-center text-gray-500 dark:text-gray-400"
                >
                  No transactions available.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  className={`border-t transition hover:shadow-md ${
                    theme === "light"
                      ? "hover:bg-gray-50"
                      : "hover:bg-gray-700 border-gray-700"
                  }`}
                >
                                    <td className="p-3">
                    {editingId === t.id ? (
                      <select
                        value={editData.type ?? t.type}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            type: e.target.value as "income" | "expense",
                          })
                        }
                        className="border rounded px-2 py-1 w-full"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          t.type === "income"
                            ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {t.type.toUpperCase()}
                      </span>
                    )}
                  </td>
                  {editingId === t.id ? (
                    <>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editData.title ?? t.title}
                          onChange={(e) =>
                            setEditData({ ...editData, title: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={editData.amount ?? t.amount}
                          onChange={(e) =>
                            setEditData({ ...editData, amount: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="date"
                          value={editData.date ?? t.date}
                          onChange={(e) =>
                            setEditData({ ...editData, date: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={editData.category ?? t.category}
                          onChange={(e) =>
                            setEditData({ ...editData, category: e.target.value })
                          }
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => handleSave(t.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditData({});
                          }}
                          className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3">{t.title}</td>
                      <td className="p-3 font-semibold">
                        {t.amount} <span className="text-xs">PKR</span>
                      </td>
                      <td className="p-3">{t.date}</td>
                      <td className="p-3">{t.category}</td>
                      <td className="p-3 space-x-2">
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
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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
      <div className="md:hidden space-y-4">
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No transactions available.
          </p>
        ) : (
          transactions.map((t) => (
            <div
              key={t.id}
              className={`p-4 rounded-xl shadow-md ${
                theme === "light"
                  ? "bg-gray-50 border border-gray-200"
                  : "bg-gray-700 border border-gray-600"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    t.type === "income"
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {t.type.toUpperCase()}
                </span>
                <span className="font-semibold">{t.amount} PKR</span>
              </div>
              <p className="text-sm">
                <span className="font-semibold">Title:</span> {t.title}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Date:</span> {t.date}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Category:</span> {t.category}
              </p>
              <div className="flex justify-end space-x-2 mt-3">
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
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTransaction(t.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;
