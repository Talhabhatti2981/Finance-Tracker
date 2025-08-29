import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { Transaction } from "../../App";

type Props = {
  transactions: Transaction[];
  theme: string;
};

export default function WeeklyExpenseBarChart({ transactions, theme }: Props) {
  const [tickPlacement] = React.useState<"start" | "end" | "middle" | "extremities">("middle");
  const [tickLabelPlacement] = React.useState<"middle" | "tick">("middle");
  const [marginLeft, setMarginLeft] = React.useState(60);
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setMarginLeft(0); 
      else setMarginLeft(60);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    <div style={{ width: "100%" }}>
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
        series={[{ dataKey: "expense", label: "Last 7 Days Expense", color: "#F13439" }]}
        height={300}
        margin={{ left: marginLeft }}
      />
    </div>
  );
}
