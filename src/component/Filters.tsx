import React from "react";
import { Filter } from "../App";

interface FiltersProps {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}
const Filters: React.FC<FiltersProps> = ({ filter, setFilter }) => {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        value={filter.type}
        onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value as Filter["type"] }))}
        className="p-2 border rounded-lg"
      >
        <option value="all">All</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        type="text"
        placeholder="Category"
        value={filter.category === "all" ? "" : filter.category}
        onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value || "all" }))}
        className="p-2 border rounded-lg"
      />

      <input
        type="date"
        value={filter.startDate}
        onChange={(e) => setFilter(prev => ({ ...prev, startDate: e.target.value }))}
        className="p-2 border rounded-lg"
      />
    </div>
  );
};

export default Filters;
