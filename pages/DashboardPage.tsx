
import React from 'react';
import { GlobalState } from '../types';
import { TrendingUp, TrendingDown, DollarSign, BarChart3, PieChart as PieIcon } from 'lucide-react';

const DashboardPage: React.FC<{ state: GlobalState }> = ({ state }) => {
  // Calculate per-session metrics based on manual entries in Simulation page
  const sessionMetrics = state.tradingBlocks.map(block => {
    const blockCost = block.priceRanges.reduce((sum, r) => sum + (r.cost || 0), 0);
    const blockPnlRanges = block.priceRanges.reduce((sum, r) => sum + (r.pnl || 0), 0);
    const blockPnlActivities = block.activities.reduce((sum, act) => sum + (act.sold - act.cost), 0);
    
    // Updated Logic: Summary Total = PNL Ranges - Cost
    const blockSummaryTotal = blockPnlRanges - blockCost;
    // Grand Total = Summary Total + Activity PNL (Trade Log)
    const blockGrandTotal = blockSummaryTotal + blockPnlActivities;

    return {
      title: block.title,
      cost: blockCost,
      activityPnl: blockPnlActivities, // This is "Sum Unreal" from Trade Log
      totalSessionPnl: blockGrandTotal // This is "Session Total PNL"
    };
  });

  const totalSimulatedCost = sessionMetrics.reduce((sum, m) => sum + m.cost, 0);
  const totalUnrealizedPnl = sessionMetrics.reduce((sum, m) => sum + m.activityPnl, 0);
  const totalNetPortfolioValue = sessionMetrics.reduce((sum, m) => sum + m.totalSessionPnl, 0);

  const format = (val: number) => new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Portfolio Dashboard</h1>
          <p className="text-slate-500 text-sm">Summary of all simulated trading activities across sessions.</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-2 rounded-xl">
            <TrendingUp className="text-blue-600" size={20} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Aggregated Unrealized PNL</p>
            <p className={`text-xl font-black ${totalUnrealizedPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {totalUnrealizedPnl >= 0 ? '+' : ''}{format(totalUnrealizedPnl)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Simulated Cost Card */}
        <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl shadow-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-white/10 rounded-2xl">
              <DollarSign size={24} className="text-blue-400" />
            </div>
            <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full uppercase tracking-widest">Capital</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Total Simulated Cost</p>
          <h2 className="text-4xl font-black mt-1">{format(totalSimulatedCost)}</h2>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-500">
            <BarChart3 size={14} />
            <span>Across {state.tradingBlocks.length} Active Sessions</span>
          </div>
        </div>

        {/* Total Unrealized PNL (from Trade Logs) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-emerald-50 rounded-2xl">
              <TrendingUp size={24} className="text-emerald-600" />
            </div>
            <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full uppercase tracking-widest">Performance</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Total Unrealized PNL</p>
          <h2 className={`text-4xl font-black mt-1 ${totalUnrealizedPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {totalUnrealizedPnl >= 0 ? '+' : ''}{format(totalUnrealizedPnl)}
          </h2>
          <p className="mt-2 text-xs text-slate-500 italic">Aggregated from all Session Trade Logs</p>
        </div>

        {/* Net Portfolio Value (from Session Total PNL) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <PieIcon size={24} className="text-blue-600" />
            </div>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase tracking-widest">Total Equity</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">Net Portfolio Value</p>
          <h2 className="text-4xl font-black mt-1 text-slate-900">{format(totalNetPortfolioValue)}</h2>
          <p className="mt-2 text-xs text-slate-500 italic">Sum of Session Total PNL (Net Profit + Trade Log)</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Session Breakdown</h3>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Real-time Data Sync</span>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4">Session Name</th>
              <th className="px-6 py-4 text-center">Session Cost</th>
              <th className="px-6 py-4 text-center">Unrealized (Trade Log)</th>
              <th className="px-6 py-4 text-right">Session Total PNL</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sessionMetrics.map((session, idx) => {
              return (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-700">{session.title || `Session ${idx + 1}`}</td>
                  <td className="px-6 py-4 text-center font-mono font-medium text-slate-600">{format(session.cost)}</td>
                  <td className={`px-6 py-4 text-center font-mono font-bold ${session.activityPnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {session.activityPnl >= 0 ? '+' : ''}{format(session.activityPnl)}
                  </td>
                  <td className={`px-6 py-4 text-right font-mono font-black ${session.totalSessionPnl >= 0 ? 'text-slate-900' : 'text-rose-600'}`}>
                    {format(session.totalSessionPnl)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-tighter">ACTIVE</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardPage;
