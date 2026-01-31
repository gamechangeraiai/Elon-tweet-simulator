
import React from 'react';
import { AmortizationRow } from '../types';

interface DataGridProps {
  rows: AmortizationRow[];
}

const DataGrid: React.FC<DataGridProps> = ({ rows }) => {
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(val);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">No.</th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Date</th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Principal</th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-amber-600">Interest</th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-emerald-600">Extra</th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Pay</th>
            <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Balance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((row) => (
            <tr key={row.period} className="hover:bg-indigo-50/30 transition-colors group">
              <td className="px-6 py-3 text-sm text-slate-400 font-medium mono">{row.period}</td>
              <td className="px-6 py-3 text-sm text-slate-700 font-medium">{row.date}</td>
              <td className="px-6 py-3 text-sm text-slate-600 mono">{formatCurrency(row.principal)}</td>
              <td className="px-6 py-3 text-sm text-amber-600 font-medium mono">{formatCurrency(row.interest)}</td>
              <td className="px-6 py-3 text-sm text-emerald-600 font-medium bg-emerald-50/20 mono">{formatCurrency(row.extraPayment)}</td>
              <td className="px-6 py-3 text-sm text-slate-800 font-bold mono">{formatCurrency(row.totalPayment)}</td>
              <td className="px-6 py-3 text-sm text-slate-900 font-semibold mono">
                <span className="group-hover:text-indigo-600">{formatCurrency(row.balance)}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="py-20 text-center text-slate-400">
          No data calculated yet.
        </div>
      )}
    </div>
  );
};

export default DataGrid;
