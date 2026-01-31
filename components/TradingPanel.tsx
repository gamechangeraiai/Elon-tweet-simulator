
import React, { useState } from 'react';
// Corrected import to use calculateRowPnl
import { calculateRowPnl } from '../utils/formulas';

interface TradingPanelProps {
  title: string;
  currentPrice: number;
}

const RANGES = [
  "280 - 299", "300 - 319", "320 - 339", "340 - 359", "360 - 379",
  "380 - 399", "400 - 419", "420 - 439", "440 - 459", "460 - 479",
  "480 - 499", "500 - 519", "520 - 539", "540 - 559"
];

const TradingPanel: React.FC<TradingPanelProps> = ({ title, currentPrice }) => {
  const [data, setData] = useState(
    RANGES.map(r => ({ range: r, shares: 0, cost: 0 }))
  );

  const handleUpdate = (idx: number, field: 'shares' | 'cost', value: number) => {
    const newData = [...data];
    newData[idx] = { ...newData[idx], [field]: value };
    setData(newData);
  };

  const totalCost = data.reduce((acc, curr) => acc + curr.cost, 0);
  // Corrected function call to calculateRowPnl
  const totalPnl = data.reduce((acc, curr) => acc + calculateRowPnl(curr.shares, curr.cost, currentPrice), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center py-2 bg-slate-50 rounded-lg">
          {title}
        </h4>
        
        <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="p-2 text-left font-bold text-slate-500">Range</th>
                <th className="p-2 text-center font-bold text-slate-500">Share</th>
                <th className="p-2 text-center font-bold text-slate-500">Cost</th>
                <th className="p-2 text-right font-bold text-slate-500">PNL</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => {
                // Corrected function call to calculateRowPnl
                const pnl = calculateRowPnl(row.shares, row.cost, currentPrice);
                return (
                  <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="p-2 font-semibold text-slate-500 bg-slate-50/30">{row.range}</td>
                    <td className="p-1">
                      <input 
                        type="number" 
                        value={row.shares || ''} 
                        onChange={(e) => handleUpdate(idx, 'shares', Number(e.target.value))}
                        className="w-full p-1 text-center font-mono bg-[#ffff00] border border-yellow-300 rounded focus:ring-1 focus:ring-blue-400 outline-none"
                      />
                    </td>
                    <td className="p-1">
                      <input 
                        type="number" 
                        value={row.cost || ''} 
                        onChange={(e) => handleUpdate(idx, 'cost', Number(e.target.value))}
                        className="w-full p-1 text-center font-mono bg-[#ffff00] border border-yellow-300 rounded focus:ring-1 focus:ring-blue-400 outline-none"
                      />
                    </td>
                    <td className={`p-2 text-right font-bold font-mono ${pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {pnl === 0 ? '-' : pnl.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Port */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
        <p className="text-[10px] font-bold text-slate-400 uppercase mb-3 text-center">Summary Port</p>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Cost</p>
            <p className="font-mono font-bold text-sm">{totalCost.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Unrealized</p>
            <p className={`font-mono font-bold text-sm ${totalPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalPnl.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Total</p>
            <p className="font-mono font-bold text-sm">{(totalCost + totalPnl).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-slate-400 uppercase text-center">Recent Activity</p>
        <div className="rounded-xl border border-slate-100 overflow-hidden">
           <table className="w-full text-[10px]">
             <thead className="bg-slate-100">
               <tr>
                 <th className="p-1.5 text-left">Activity</th>
                 <th className="p-1.5 text-center">Share</th>
                 <th className="p-1.5 text-right">Net PNL</th>
               </tr>
             </thead>
             <tbody>
               {[1, 2, 3].map(i => (
                 <tr key={i} className="border-b border-slate-50">
                   <td className="p-1.5"><input className="w-full bg-yellow-100 border-none rounded px-1" /></td>
                   <td className="p-1.5"><input className="w-full bg-yellow-100 border-none rounded px-1 text-center" /></td>
                   <td className="p-1.5 text-right font-bold text-slate-400">0</td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};

export default TradingPanel;
