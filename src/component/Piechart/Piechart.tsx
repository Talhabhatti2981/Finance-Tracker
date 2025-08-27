import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Transaction } from "../../App";

type PieProps = {
  transactions: Transaction[];
  theme: string;
};

const TransactionPieChart: React.FC<PieProps> = ({ transactions, theme }) => {
  const labelColor = theme === "dark" ? "#ffffff" : "#000000";
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const typeData = [
    { id: 1, value: income, label: "Income", color: "#22C55E" },
    { id: 2, value: expense, label: "Expense", color: "#EF4444" },
  ];
  const categoryMap: { [key: string]: number } = {};
  transactions.forEach((t) => {
    if (!categoryMap[t.category]) categoryMap[t.category] = 0;
    categoryMap[t.category] += Number(t.amount);
  });

  const colors = [
    "#00B54C",
    "#FDC700",
    "#3383FF",
    
  ];

  const categoryData = Object.entries(categoryMap).map(([cat, value], idx) => ({
    id: idx + 1,
    value,
    label: cat,
    color: colors[idx % colors.length],
  }));

  return (
    <div className={`grid md:grid-cols-2 gap-6 w-full sm:w-full lg:w-[950px] ml-0 sm:ml-0 lg:ml-20 xl:ml-20 h-full transition-colors 
        ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"} 
        p-6 rounded-2xl shadow-lg`}
    >
      <div className="flex flex-col items-center w-full h-[350px] md:h-[450px]">
        <h2 className="text-lg font-semibold mb-2">Income vs Expense</h2>
        {income === 0 && expense === 0 ? (
          <p className="text-gray-400">No data available</p>
        ) : (
          <PieChart
            series={[
              {
                data: typeData,
                arcLabelMinAngle: 15,
                arcLabelRadius: "60%",
              },
            ]}
            sx={{
              backgroundColor: "transparent",
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: "bold",
                fontSize: "12px",
                fill: labelColor,
              },
              "& .MuiChartsLegend-root": {
                color: labelColor,
                fontSize: "12px",
                fontWeight: "500",
              },
            }}
            className="w-full h-full"
          />
        )}
      </div>
      <div className="flex flex-col items-center w-full h-[350px] md:h-[450px]">
        <h2 className="text-lg font-semibold mb-2">Category Breakdown</h2>
        {categoryData.length === 0 ? (
          <p className="text-gray-400">No category data available</p>
        ) : (
          <PieChart
            series={[
              {
                data: categoryData,
                arcLabelMinAngle: 15,
                arcLabelRadius: "60%",
              },
            ]}
            sx={{
              backgroundColor: "transparent",
              [`& .${pieArcLabelClasses.root}`]: {
                fontWeight: "bold",
                fontSize: "12px",
                fill: labelColor,
              },
              "& .MuiChartsLegend-root": {
                color: labelColor,
                fontSize: "14px",
                fontWeight: "500",
              },
            }}
            className="w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default TransactionPieChart;
