
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Sparkles, TrendingUp, Info } from 'lucide-react';
// Corrected import to match exported function names
import { calculateTimeRemaining, calculateForecastRange } from '../utils/formulas';

interface ForecastPanelProps {
  targetDate: string;
  setTargetDate: (val: string) => void;
}

const ForecastPanel: React.FC<ForecastPanelProps> = ({ targetDate, setTargetDate }) => {
  const [avgDaily, setAvgDaily] = useState(150);
  const [currentTotal, setCurrentTotal] = useState(1240);
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 60000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Updated call to calculateForecastRange
  const forecast = calculateForecastRange(avgDaily, timeLeft.days, timeLeft.hours, currentTotal);

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Input Controls */}
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className="text-yellow-500" />
            <h3 className="font-bold text-slate-800">Tweet Forecasting</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Avg Daily Tweet</label>
              <input 
                type="number" 
                value={avgDaily} 
                onChange={(e) => setAvgDaily(Number(e.target.value))}
                className="w-full bg-[#ffff00] border border-yellow-300 rounded-xl px-4 py-3 font-bold text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Total Tweet So Far</label>
              <input 
                type="number" 
                value={currentTotal} 
                onChange={(e) => setCurrentTotal(Number(e.target.value))}
                className="w-full bg-[#ffff00] border border-yellow-300 rounded-xl px-4 py-3 font-bold text-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Target End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="datetime-local" 
                value={targetDate} 
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 font-semibold focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-slate-100" />

        {/* Visual Results */}
        <div className="flex-1 flex flex-col justify-between py-2">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                 <Clock size={48} />
               </div>
               <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Time Remaining</p>
               <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-blue-700">{timeLeft.days}</span>
                 <span className="text-xs font-bold text-blue-600">Days</span>
                 <span className="text-2xl font-black text-blue-700 ml-2">{timeLeft.hours}</span>
                 <span className="text-xs font-bold text-blue-600">Hrs</span>
               </div>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                 <TrendingUp size={48} />
               </div>
               <p className="text-[10px] font-bold text-emerald-400 uppercase mb-1">Forecasted Final</p>
               <div className="flex items-baseline gap-1">
                 <span className="text-2xl font-black text-emerald-700">{Math.round(forecast).toLocaleString()}</span>
                 <span className="text-xs font-bold text-emerald-600">Tweets</span>
               </div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-4 text-white">
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-indigo-500 p-1 rounded">
                <Info size={12} />
              </div>
              <span className="text-[10px] font-bold uppercase text-slate-400">Projection Summary</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on the current average of <span className="text-white font-bold">{avgDaily}</span> tweets/day, you are expected to reach <span className="text-emerald-400 font-bold">{Math.round(forecast)}</span> total tweets by the end of the timeframe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForecastPanel;
