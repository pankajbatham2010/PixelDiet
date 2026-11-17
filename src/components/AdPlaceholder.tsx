import React from 'react';

interface AdPlaceholderProps {
  slot: 'top' | 'bottom';
  className?: string;
}

export const AdPlaceholder: React.FC<AdPlaceholderProps> = ({ slot, className = '' }) => {
  return (
    <div
      className={`w-full my-6 flex flex-col items-center justify-center transition-all ${className}`}
      data-ad-slot={slot}
    >
      <div className="w-full max-w-4xl min-h-[90px] border border-dashed border-slate-200 bg-slate-50/70 rounded-xl flex flex-col items-center justify-center p-3 text-center relative overflow-hidden group hover:border-slate-300 transition-colors">
        <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400 mb-1">
          Advertisement Space
        </span>
        <p className="text-xs text-slate-400">
          Reserved slot ({slot === 'top' ? 'Top Leaderboard 728×90 / Responsive' : 'Bottom Banner 728×90 / Responsive'}) &bull; Ad-Ready Layout
        </p>
      </div>
    </div>
  );
};
