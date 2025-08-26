import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Transaction } from "../../App";

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
      className={`shadow-lg rounded-2xl flex justify-center items-center p-6 w-full h-full transition-colors
                  ${theme === "light" ? "bg-white text-gray-800" : "bg-gray-800 text-gray-200"}`}
    >
      {pieData.length === 0 ? (
        <p className={`${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
          No transactions yet
        </p>
      ) : (
        <div className="w-full max-w-lg h-[350px] md:h-[450px]">
          <PieChart
            series={[
              {
                data: pieData,
                arcLabel: (item) => `${item.value} PKR`,
                arcLabelMinAngle: 15,
                arcLabelRadius: "60%",
                faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
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
            slotProps={{
             
      
            }}
            width={undefined} 
            height={undefined}
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
};

export default TransactionPieChart;
