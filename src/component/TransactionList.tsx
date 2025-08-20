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
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  editTransaction,
  deleteTransaction,
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
    <div>
      <h2 className="text-lg font-semibold mb-3">Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-gray-500">
                  No transactions available.
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id} className="border-b">
                  <td className="p-2">
                    {editingId === t.id ? (
                      <select
                        value={editData.type ?? t.type}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            type: e.target.value as "income" | "expense",
                          })
                        }
                        className="border p-1 rounded w-full"
                      >
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                      </select>
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          t.type === "income"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
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
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={editData.amount ?? t.amount}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              amount: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="date"
                          value={editData.date ?? t.date}
                          onChange={(e) =>
                            setEditData({ ...editData, date: e.target.value })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          value={editData.category ?? t.category}
                          onChange={(e) =>
                            setEditData({
                              ...editData,
                              category: e.target.value,
                            })
                          }
                          className="border p-1 rounded w-full"
                        />
                      </td>
                      <td className="p-2 space-x-2">
                        <button
                          onClick={() => handleSave(t.id)}
                          className="text-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditData({});
                          }}
                          className="text-gray-500"
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
                      <td className="p-2 space-x-2">
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
                          className="text-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTransaction(t.id)}
                          className="text-red-600"
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
