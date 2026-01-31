
import React from 'react';

interface SummaryCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: 'indigo' | 'emerald' | 'amber' | 'slate';
  isHighlighted?: boolean;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ label, value, icon, color, isHighlighted }) => {
  const colorStyles = {
    indigo: 'text-indigo-600 bg-indigo-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    amber: 'text-amber-600 bg-amber-50',
    slate: 'text-slate-600 bg-slate-50',
  };

  return (
    <div className={`p-4 rounded-2xl border ${isHighlighted ? 'border-emerald-200 bg-emerald-50/20 ring-4 ring-emerald-500/5' : 'border-slate-100 bg-white'}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorStyles[color]}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-xl font-bold text-slate-900 mono">
        {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(value)}
      </div>
    </div>
  );
};

export default SummaryCard;
