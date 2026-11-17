import React from 'react';
import { ShieldCheck, Lock, Cpu, EyeOff } from 'lucide-react';

export const PrivacyBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 rounded-2xl p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <span>100% Private & Secure</span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              <strong className="text-emerald-800 font-semibold">100% Private:</strong> Images are processed locally in your browser and <span className="underline decoration-emerald-400 font-medium">never uploaded to any server</span>.
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 text-[11px] font-medium text-slate-600 self-stretch sm:self-auto justify-start sm:justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-emerald-500/15">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/70 border border-emerald-200/50 shadow-2xs">
            <Cpu className="w-3.5 h-3.5 text-indigo-500" />
            Client-Side HTML5 Canvas
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/70 border border-emerald-200/50 shadow-2xs">
            <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
            Zero Data Logging
          </span>
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/70 border border-emerald-200/50 shadow-2xs">
            <Lock className="w-3.5 h-3.5 text-teal-600" />
            Offline Capable
          </span>
        </div>
      </div>
    </div>
  );
};
