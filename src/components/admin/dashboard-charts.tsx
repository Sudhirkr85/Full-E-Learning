"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from "recharts";

type UserRatioItem = {
  name: string;
  value: number;
  color: string;
};

type RevenueHistoryItem = {
  name: string;
  revenue: number;
};

type DashboardChartsProps = {
  userRatio: UserRatioItem[];
  revenueHistory: RevenueHistoryItem[];
  totalUsers: number;
};

export function DashboardCharts({ userRatio, revenueHistory, totalUsers }: DashboardChartsProps) {
  // Custom tooltips to match glassmorphism dark UI
  const renderCustomTooltipPie = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-white/10 bg-[#070b19]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl text-xs font-semibold">
          <p className="text-white mb-0.5">{data.name}</p>
          <p className="text-indigo-400 font-extrabold">{data.value} users</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomTooltipBar = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="rounded-xl border border-white/10 bg-[#070b19]/90 px-3.5 py-2.5 shadow-2xl backdrop-blur-xl text-xs font-semibold">
          <p className="text-slate-400 mb-0.5">Revenue</p>
          <p className="text-emerald-400 font-extrabold">₹{value.toLocaleString("en-IN")}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* LEFT: User Distribution Donut Chart */}
      <div className="rounded-2xl border border-white/5 bg-[#090d20]/50 p-6 shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col justify-between min-h-[360px]">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">User Distribution</h3>
          <p className="text-xs text-slate-500 mt-1">Ratio between Students, Teachers, and Admins</p>
        </div>

        <div className="relative flex-1 flex items-center justify-center my-4 min-h-[200px]">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={userRatio}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {userRatio.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={renderCustomTooltipPie} />
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Total Users Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Users</span>
            <span className="text-2xl font-extrabold text-white">{totalUsers}</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-6 text-[11px] font-bold uppercase tracking-wider mt-2">
          {userRatio.map((item, index) => (
            <div key={`legend-${index}`} className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-400">{item.name}</span>
              <span className="text-white">({item.value})</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Monthly Revenue Overview BarChart */}
      <div className="rounded-2xl border border-white/5 bg-[#090d20]/50 p-6 shadow-[0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl flex flex-col justify-between min-h-[360px]">
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">Revenue Overview</h3>
          <p className="text-xs text-slate-500 mt-1">Successful catalog payments over the last 6 months</p>
        </div>

        <div className="flex-1 mt-6 min-h-[220px]">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                fontSize={10} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `₹${value.toLocaleString("en-IN")}`} 
              />
              <Tooltip content={renderCustomTooltipBar} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
              <Bar 
                dataKey="revenue" 
                fill="url(#revenueGrad)" 
                radius={[4, 4, 0, 0]}
              >
                {/* Visual gradient fill */}
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
