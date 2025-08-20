import React from "react";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import { Transaction } from "../App";

type PieProps = {
  transactions: Transaction[];
};

const TransactionPieChart: React.FC<PieProps> = ({ transactions }) => {
  const pieData = transactions.map((t) => ({
    id: t.id, 
    value: t.amount,
    label: t.title || `Transaction ${t.id}`,
  }));

  return (
    <div className="bg-white shadow-md rounded-lg flex justify-center items-center p-6">
      {pieData.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <PieChart
          series={[
            {
              data: pieData,
              arcLabel: (item) => `${item.label}: ${item.value} PKR`,
              arcLabelMinAngle: 15,
              arcLabelRadius: "60%",
            },
          ]}
          sx={{ [`& .${pieArcLabelClasses.root}`]: { fontWeight: "bold", fontSize: "10px" } }}
          width={300}
          height={300}
        />
      )}
    </div>
  );
};

export default TransactionPieChart;
