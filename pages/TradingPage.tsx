
import React from 'react';
import { GlobalState } from '../types';
import { ArrowRightLeft, LayoutGrid } from 'lucide-react';

const TradingPage: React.FC<{ state: GlobalState, setState: React.Dispatch<React.SetStateAction<GlobalState>> }> = ({ state, setState }) => {
  
  const handleBlockTitleChange = (blockIdx: number, title: string) => {
    const newBlocks = [...state.tradingBlocks];
    newBlocks[blockIdx] = { ...newBlocks[blockIdx], title };
    setState(prev => ({ ...prev, tradingBlocks: newBlocks }));
  };

  const handleRangeInput = (blockIdx: number, rowIdx: number, field: 'shares' | 'cost' | 'pnl', value: number) => {
    const newBlocks = [...state.tradingBlocks];
    const newRanges = [...newBlocks[blockIdx].priceRanges];
    newRanges[rowIdx] = { ...newRanges[rowIdx], [field]: value };
    newBlocks[blockIdx] = { ...newBlocks[blockIdx], priceRanges: newRanges };
    setState(prev => ({ ...prev, tradingBlocks: newBlocks }));
  };

  const handleActivityInput = (blockIdx: number, rowIdx: number, field: keyof any, value: any) => {
     const newBlocks = [...state.tradingBlocks];
     const newActivities = [...newBlocks[blockIdx].activities];
     newActivities[rowIdx] = { ...newActivities[rowIdx], [field]: value };
     newBlocks[blockIdx] = { ...newBlocks[blockIdx], activities: newActivities };
     setState(prev => ({ ...prev, tradingBlocks: newBlocks }));
  };

  const format = (val: number) => new Intl.NumberFormat('en-US').format(val);

  return (
    <div className="space-y-12 animate-in slide-in-from-left-4 duration-500 pb-12">
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <ArrowRightLeft size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Trading Simulation Workspace</h2>
            <p className="text-xs text-slate-500">Manual entry mode for Costs, Shares, and Unrealized Valuations.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {state.tradingBlocks.map((block, blockIdx) => {
          // Calculation based on requested logic: Total = Unreal PNL - Cost
          const totalCost = block.priceRanges.reduce((acc, curr) => acc + curr.cost, 0);
          const totalUnrealizedPnl = block.priceRanges.reduce((acc, curr) => acc + (curr.pnl || 0), 0);
          const summaryTotal = totalUnrealizedPnl - totalCost;
          
          const sumActivityUnrealized = block.activities.reduce((sum, act) => sum + (act.sold - act.cost), 0);
          
          // Grand Total PNL for the session
          const grandTotalSession = summaryTotal + sumActivityUnrealized;

          return (
            <div key={blockIdx} className="space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                {/* Header - Editable Day Title */}
                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                  <input 
                    type="text"
                    className="font-bold text-slate-600 uppercase text-xs tracking-widest bg-transparent border-none focus:ring-0 w-full"
                    value={block.title}
                    onChange={(e) => handleBlockTitleChange(blockIdx, e.target.value)}
                    placeholder="DAY NAME..."
                  />
                </div>

                {/* Range Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead className="bg-slate-50 text-slate-400 font-bold uppercase border-b border-slate-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Range</th>
                        <th className="px-3 py-2 text-center">Share</th>
                        <th className="px-3 py-2 text-center">Cost</th>
                        <th className="px-3 py-2 text-right">Valuation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {block.priceRanges.map((row, rowIdx) => {
                        return (
                          <tr key={rowIdx} className="hover:bg-slate-50/50">
                            <td className="px-3 py-1.5 font-bold text-slate-500 bg-slate-50/30 whitespace-nowrap">{row.range}</td>
                            <td className="p-1">
                              <input 
                                type="number" 
                                className="w-full bg-white border border-slate-200 rounded p-1 font-bold text-center text-slate-900 focus:ring-1 focus:ring-blue-400 outline-none"
                                value={row.shares || ''}
                                onChange={(e) => handleRangeInput(blockIdx, rowIdx, 'shares', Number(e.target.value))}
                              />
                            </td>
                            <td className="p-1">
                              <input 
                                type="number" 
                                className="w-full bg-white border border-slate-200 rounded p-1 font-bold text-center text-slate-900 focus:ring-1 focus:ring-blue-400 outline-none"
                                value={row.cost || ''}
                                onChange={(e) => handleRangeInput(blockIdx, rowIdx, 'cost', Number(e.target.value))}
                              />
                            </td>
                            <td className="p-1">
                              <input 
                                type="number" 
                                className={`w-full bg-white border border-slate-200 rounded p-1 font-black text-right focus:ring-1 focus:ring-blue-400 outline-none ${row.pnl >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}
                                placeholder="0"
                                value={row.pnl || ''}
                                onChange={(e) => handleRangeInput(blockIdx, rowIdx, 'pnl', Number(e.target.value))}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Summary Port & Total Box */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 space-y-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase text-center mb-3 tracking-widest">Summary Port</p>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Cost</p>
                        <p className="text-xs font-black text-slate-700">{format(totalCost)}</p>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Unreal Valu</p>
                        <p className={`text-xs font-black ${totalUnrealizedPnl >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {format(totalUnrealizedPnl)}
                        </p>
                      </div>
                      <div className="bg-white p-2 rounded-xl border border-slate-200 text-center">
                        <p className="text-[9px] font-bold text-slate-400 uppercase">Total</p>
                        <p className={`text-xs font-black ${summaryTotal >= 0 ? 'text-slate-700' : 'text-rose-600'}`}>{format(summaryTotal)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-2xl p-4 text-white text-center shadow-lg shadow-indigo-100 border border-white/10">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mb-1">Session Total PNL</p>
                    <p className="text-2xl font-black">{format(grandTotalSession)}</p>
                    <p className="text-[9px] font-bold opacity-60 uppercase mt-1">Summary Total + Sum Unreal</p>
                  </div>
                </div>
              </div>

              {/* Activity Section */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid size={12} className="text-slate-400" />
                    <span className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">Trade Log</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Sum Unreal &raquo;</span>
                    <span className={`text-[11px] font-black ${sumActivityUnrealized >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {format(sumActivityUnrealized)}
                    </span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[9px]">
                    <thead className="bg-slate-50 text-slate-400 border-b border-slate-100">
                      <tr>
                        <th className="p-2 text-left">Activity</th>
                        <th className="p-2 text-center">Share</th>
                        <th className="p-2 text-center">Cost</th>
                        <th className="p-2 text-center">Sold</th>
                        <th className="p-2 text-right">Net PNL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {block.activities.map((act, actIdx) => {
                        const net = act.sold - act.cost;
                        return (
                          <tr key={actIdx} className="hover:bg-slate-50/50">
                            <td className="p-1"><input className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-slate-900 focus:ring-1 focus:ring-blue-400 outline-none" value={act.activity} onChange={(e) => handleActivityInput(blockIdx, actIdx, 'activity', e.target.value)} /></td>
                            <td className="p-1"><input className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center text-slate-900 focus:ring-1 focus:ring-blue-400 outline-none" type="number" value={act.share || ''} onChange={(e) => handleActivityInput(blockIdx, actIdx, 'share', Number(e.target.value))} /></td>
                            <td className="p-1"><input className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center text-slate-900 focus:ring-1 focus:ring-blue-400 outline-none" type="number" value={act.cost || ''} onChange={(e) => handleActivityInput(blockIdx, actIdx, 'cost', Number(e.target.value))} /></td>
                            <td className="p-1"><input className="w-full bg-white border border-slate-200 rounded px-1.5 py-1 text-center text-slate-900 focus:ring-1 focus:ring-blue-400 outline-none" type="number" value={act.sold || ''} onChange={(e) => handleActivityInput(blockIdx, actIdx, 'sold', Number(e.target.value))} /></td>
                            <td className={`p-2 text-right font-black ${net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{net === 0 ? '0' : format(net)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TradingPage;
