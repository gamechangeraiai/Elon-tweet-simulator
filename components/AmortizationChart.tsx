
import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { AmortizationRow } from '../types';

interface ChartProps {
  data: AmortizationRow[];
}

const AmortizationChart: React.FC<ChartProps> = ({ data }) => {
  // Sample data to keep chart readable (every 12 months)
  const sampledData = data.filter((_, index) => index % 12 === 0 || index === data.length - 1);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={sampledData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis 
          dataKey="date" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#94a3b8' }} 
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          tickFormatter={(val) => `฿${(val / 1000000).toFixed(1)}M`}
        />
        <Tooltip 
          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
          formatter={(value: number) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value)}
        />
        <Legend verticalAlign="top" height={36}/>
        <Area 
          type="monotone" 
          dataKey="balance" 
          stroke="#6366f1" 
          strokeWidth={3}
          fillOpacity={1} 
          fill="url(#colorBalance)" 
          name="Remaining Balance"
        />
        <Area 
          type="monotone" 
          dataKey="interest" 
          stroke="#f59e0b" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorInterest)" 
          name="Monthly Interest"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default AmortizationChart;
