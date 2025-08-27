import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Transaction } from "../../App";

type Props = {
  transactions: Transaction[];
  theme: string;
};

const chartSetting = {
  series: [{ dataKey: "expense" }],
  height: 300, 
  margin: { left: 50, right: 30, top: 20, bottom: 50 },
};
export default function WeeklyExpenseBarChart({ transactions, theme }: Props) {
  const [tickPlacement] = React.useState<
    "start" | "end" | "middle" | "extremities"
  >("middle");

  const [tickLabelPlacement] = React.useState<"middle" | "tick">("middle");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const last7Days: { day: string; expense: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const total = transactions
      .filter(
        (t) =>
          t.type === "expense" &&
          new Date(t.date).toDateString() === date.toDateString()
      )
      .reduce((sum, t) => sum + t.amount, 0);

    last7Days.push({
      day: `${date.getDate()}/${date.getMonth() + 1}`,
      expense: total,
    });
  }

  const axisLabelColor = theme === "dark" ? "#ffffff" : "#000000";

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[300px]"> 
        <BarChart
          dataset={last7Days}
          xAxis={[
            {
              dataKey: "day",
              tickPlacement,
              tickLabelPlacement,
              tickLabelStyle: { fill: axisLabelColor },
            },
          ]}
          yAxis={[{ tickLabelStyle: { fill: axisLabelColor } }]}
          {...chartSetting}
          style={{ width: "100%", height: 300 }}
        />
      </div>
    </div>
  );
}
