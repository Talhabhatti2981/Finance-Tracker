import React from "react";
import { Filter } from "../../App";

interface FiltersProps {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  theme: string;
}

const Filters: React.FC<FiltersProps> = ({ filter, setFilter, theme }) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        value={filter.type}
        onChange={(e) =>
          setFilter((prev) => ({ ...prev, type: e.target.value as Filter["type"] }))
        }
        className={`p-2 border rounded-lg transition-colors 
          ${theme === "light"
            ? "bg-white text-black border-gray-300"
            : "bg-gray-700 text-white border-gray-600"}`}
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select
        value={filter.period}
        onChange={(e) =>
          setFilter((prev) => ({ ...prev, period: e.target.value as Filter["period"] }))
        }
        className={`p-2 border rounded-lg transition-colors 
          ${theme === "light"
            ? "bg-white text-black border-gray-300"
            : "bg-gray-700 text-white border-gray-600"}`}
      >
        <option value="all">All</option>
        <option value="1week">Last 1 Week</option>
        <option value="1month">Last 1 Month</option>
        <option value="6months">Last 6 Months</option>
        <option value="1year">Last 1 Year</option>
      </select>
      <input
        type="text"
        placeholder="Category"
        value={filter.category === "all" ? "" : filter.category}
        onChange={(e) =>
          setFilter((prev) => ({ ...prev, category: e.target.value || "all" }))
        }
        className={`p-2 border rounded-lg transition-colors
          ${theme === "light"
            ? "bg-white text-black border-gray-300"
            : "bg-gray-700 text-white border-gray-600"}`}
      />
      <input
        type="date"
        max={today} 
        value={filter.startDate}
        onChange={(e) =>
          setFilter((prev) => ({ ...prev, startDate: e.target.value }))
        }
        className={`p-2 border rounded-lg transition-colors 
          ${theme === "light"
            ? "bg-white text-black border-gray-300"
            : "bg-gray-700 text-white border-gray-600"}`}
      />
    </div>
  );
};

export default Filters;
