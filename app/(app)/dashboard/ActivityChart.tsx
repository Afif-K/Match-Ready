"use client";
import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { day: "Mon", load: 40 },
  { day: "Tue", load: 65 },
  { day: "Wed", load: 55 },
  { day: "Thu", load: 80 },
  { day: "Fri", load: 70 },
  { day: "Sat", load: 90 },
  { day: "Sun", load: 60 },
];

export default function ActivityChart() {
  return (
    <section className="p-10">
      <div className="bg-gradient-to-b from-[#0B0B0F] to-[#07070A] border border-white/10 rounded-3xl p-8">
        <h2 className="text-2xl font-semibold mb-6">
          Weekly Training Load
        </h2>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="#222" vertical={false} />
              <XAxis dataKey="day" stroke="#888" />
              <Tooltip
                contentStyle={{
                  background: "#0B0B0F",
                  border: "1px solid #333",
                }}
              />
              <Line
                type="monotone"
                dataKey="load"
                stroke="#a855f7"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
