import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const PIE_PALETTE = ["#111827", "#4B5563", "#9CA3AF", "#D1D5DB", "#C4923A"];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return <div className="bg-white text-gray-900 text-xs rounded-xl px-3 py-2.5 shadow-xl border border-gray-100"><p className="font-semibold text-gray-400 mb-0.5 text-[10px] uppercase tracking-wider">{label}</p><p className="text-xl font-black">{payload[0].value}</p></div>;
}

export function DashboardCharts({ revenueOverTime, ordersByCategory }: { revenueOverTime: { label: string; value: number }[]; ordersByCategory: { label: string; value: number }[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"><h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6">Revenue Growth</h3><div style={{height:300}}><ResponsiveContainer width="100%" height="100%"><AreaChart data={revenueOverTime} margin={{top:10,right:10,left:0,bottom:0}}><defs><linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#111827" stopOpacity={0.1}/><stop offset="95%" stopColor="#111827" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false}/><XAxis dataKey="label" tick={{fill:"#6B7280",fontSize:12}} axisLine={false} tickLine={false}/><YAxis tick={{fill:"#6B7280",fontSize:12}} axisLine={false} tickLine={false}/><Tooltip content={<ChartTooltip/>}/><Area type="monotone" dataKey="value" stroke="#111827" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)"/></AreaChart></ResponsiveContainer></div></div>
      <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col shadow-sm"><h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest mb-6">Sales by Category</h3><div className="flex-1 min-h-[300px]"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ordersByCategory} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="none">{ordersByCategory.map((_: any, i: number) => <Cell key={i} fill={PIE_PALETTE[i%PIE_PALETTE.length]}/>)}</Pie><Tooltip content={<ChartTooltip/>}/></PieChart></ResponsiveContainer></div></div>
    </div>
  );
}
