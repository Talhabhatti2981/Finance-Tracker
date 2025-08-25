import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Transaction } from "../App";

type PieProps = {
  transactions: Transaction[];
  theme: string;
};

const TransactionPieChart: React.FC<PieProps> = ({ transactions, theme }) => {
  const pieData = transactions.map((t) => ({
    id: t.id,
    value: Number(t.amount),
    label: t.title || `Transaction ${t.id}`,
  }));

  const labelColor = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <div
      className={`shadow-md rounded-lg flex justify-center items-center p-6 transition-colors
                  ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"}`}
    >
      {pieData.length === 0 ? (
        <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
          No transactions yet
        </p>
      ) : (
        <PieChart
          series={[
            {
              data: pieData,
              arcLabel: (item) => `${item.label}: ${item.value}pkr`,
              arcLabelMinAngle: 15,
              arcLabelRadius: "60%",
            },
          ]}
          sx={{
            backgroundColor: "transparent",
            [`& .${pieArcLabelClasses.root}`]: {
              fontWeight: "bold",  
              fontSize: "10px",
              fill: labelColor,
            },
            "& .MuiChartsLegend-root": {
              color: labelColor, 
            },
          }}
          width={300}
          height={300}
        />
      )}
    </div>
  );
};

export default TransactionPieChart;
