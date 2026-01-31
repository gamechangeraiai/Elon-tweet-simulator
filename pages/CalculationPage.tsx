
import React from 'react';
import { GlobalState } from '../types';
import { calculateForecastRange } from '../utils/formulas';
import { Clock, Calendar, BarChart, Sparkles } from 'lucide-react';

const CalculationPage: React.FC<{ state: GlobalState, setState: React.Dispatch<React.SetStateAction<GlobalState>> }> = ({ state, setState }) => {
  
  const handleTopInput = (field: keyof GlobalState, value: number) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  const handleRowInput = (idx: number, field: 'avgDailyTweet' | 'group' | 'mark', value: any) => {
    const newRows = [...state.calculationRows];
    newRows[idx] = { ...newRows[idx], [field]: value };
    setState(prev => ({ ...prev, calculationRows: newRows }));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-50 py-3 px-6 border-b border-slate-200">
              <h2 className="font-bold text-slate-800 text-center uppercase tracking-widest text-sm italic">Elon tweet Timeframe</h2>
            </div>
            
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 py-3 text-left font-bold text-slate-500 uppercase tracking-tighter">Avarage Daily Tweet</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-tighter">Forecast range</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-tighter">Group</th>
                    <th className="px-4 py-3 text-center font-bold text-slate-500 uppercase tracking-tighter">Mark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.calculationRows.map((row, idx) => {
                    // Row 6 (idx 5): Avg - 4 (Light Yellow)
                    // Row 7 (idx 6): Avg - 2 (Light Yellow)
                    // Row 8 (idx 7): Avg     (Light Orange)
                    // Row 9 (idx 8): Avg + 2 (Light Yellow)
                    // Row 10 (idx 9): Avg + 4 (Light Yellow)
                    
                    let effectiveAvgDaily = row.avgDailyTweet;
                    let isLinked = false;
                    let label = "";
                    let bgColorClass = "bg-white";

                    if (idx === 5) { 
                      effectiveAvgDaily = state.average - 4; isLinked = true; label = "(Avg - 4)"; bgColorClass = "bg-[#fffde7]"; 
                    }
                    else if (idx === 6) { 
                      effectiveAvgDaily = state.average - 2; isLinked = true; label = "(Avg - 2)"; bgColorClass = "bg-[#fffde7]"; 
                    }
                    else if (idx === 7) { 
                      effectiveAvgDaily = state.average; isLinked = true; label = "(Avg)"; bgColorClass = "bg-[#fff3e0]"; 
                    }
                    else if (idx === 8) { 
                      effectiveAvgDaily = state.average + 2; isLinked = true; label = "(Avg + 2)"; bgColorClass = "bg-[#fffde7]"; 
                    }
                    else if (idx === 9) { 
                      effectiveAvgDaily = state.average + 4; isLinked = true; label = "(Avg + 4)"; bgColorClass = "bg-[#fffde7]"; 
                    }

                    const forecast = calculateForecastRange(
                      effectiveAvgDaily, 
                      state.remainingDays, 
                      state.remainingHours, 
                      state.totalTweet
                    );
                    
                    return (
                      <tr key={idx} className={`transition-colors ${bgColorClass}`}>
                        <td className="p-1 px-4">
                          {isLinked ? (
                            <div className="w-full border border-slate-200/50 rounded px-2 py-1.5 font-black text-blue-600 text-center">
                              {effectiveAvgDaily || 0} <span className="text-[8px] font-bold text-slate-400 uppercase ml-1">{label}</span>
                            </div>
                          ) : (
                            <input 
                              type="number" 
                              className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 font-bold text-slate-900 focus:ring-1 focus:ring-blue-400 outline-none text-center"
                              value={row.avgDailyTweet || ''}
                              onChange={(e) => handleRowInput(idx, 'avgDailyTweet', Number(e.target.value))}
                            />
                          )}
                        </td>
                        <td className="px-4 py-3 text-center font-mono font-bold text-blue-600">
                          {forecast ? Math.round(forecast).toLocaleString() : '0'}
                        </td>
                        <td className="p-1 px-4">
                          <input 
                            className="w-full text-center border border-slate-200 bg-white rounded py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-blue-400 outline-none" 
                            placeholder="-" 
                            value={row.group}
                            onChange={(e) => handleRowInput(idx, 'group', e.target.value)}
                          />
                        </td>
                        <td className="p-1 px-4">
                          <input 
                            className="w-full text-center border border-slate-200 bg-white rounded py-1.5 font-medium text-slate-700 focus:ring-1 focus:ring-blue-400 outline-none" 
                            placeholder="-" 
                            value={row.mark}
                            onChange={(e) => handleRowInput(idx, 'mark', e.target.value)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Summaries & Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <Sparkles size={18} className="text-blue-500" />
              Metrics
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Tweet</label>
                <input 
                  type="number" 
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-xl text-center text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                  value={state.totalTweet || ''}
                  onChange={(e) => handleTopInput('totalTweet', Number(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Average</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-center text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                    value={state.average || ''}
                    onChange={(e) => handleTopInput('average', Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Elapsed</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-center text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                    value={state.elapsed || ''}
                    onChange={(e) => handleTopInput('elapsed', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={16} className="text-blue-500" />
                <h4 className="text-[10px] font-bold text-slate-400 uppercase">Time Remaining</h4>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold">DAY</p>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-2xl text-center text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                    value={state.remainingDays || ''}
                    onChange={(e) => handleTopInput('remainingDays', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-slate-400 font-bold">HOUR</p>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-black text-2xl text-center text-slate-900 focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
                    value={state.remainingHours || ''}
                    onChange={(e) => handleTopInput('remainingHours', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-100">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <BarChart size={18} />
              Forecasting Note
            </h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              Relative Average logic is applied to rows 6-10. Row 8 (Linked Avg) is highlighted in orange. Adjacent rows 6,7 and 9,10 are highlighted in yellow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculationPage;
