import React, { useState } from 'react';
import type { ImageFileItem, OutputFormat } from '../types';
import { formatBytes } from '../utils/formatters';
import { downloadAllImagesAsZip } from '../utils/zipDownloader';
import { Archive, Trash2, Loader2, Sparkles, TrendingDown } from 'lucide-react';

interface BatchStatsProps {
  items: ImageFileItem[];
  format: OutputFormat;
  onClearAll: () => void;
  onOpenInspector: (item: ImageFileItem) => void;
}

export const BatchStats: React.FC<BatchStatsProps> = ({
  items,
  format,
  onClearAll,
  onOpenInspector,
}) => {
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  if (items.length === 0) return null;

  const totalOriginalSize = items.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = items.reduce(
    (acc, curr) => acc + (curr.compressedSize || curr.originalSize),
    0
  );
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const totalSavedPercent =
    totalOriginalSize > 0
      ? Math.round((totalSavedBytes / totalOriginalSize) * 100)
      : 0;

  const handleDownloadZip = async () => {
    try {
      setIsZipping(true);
      setZipProgress(0);
      await downloadAllImagesAsZip(items, format, (progress) => {
        setZipProgress(progress);
      });
    } catch (err) {
      console.error('Failed to create ZIP:', err);
      alert('Error creating zip bundle: ' + err);
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  const isProcessingAny = items.some((item) => item.isProcessing);

  return (
    <div className="w-full bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/20 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Statistics metrics */}
        <div className="flex flex-wrap items-center gap-6 sm:gap-10">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block mb-1">
              Total Images
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {items.length}
              </span>
              <span className="text-xs text-indigo-300">file{items.length > 1 ? 's' : ''}</span>
            </div>
          </div>

          <div className="h-10 w-px bg-indigo-800/60 hidden sm:block"></div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold block mb-1">
              Original Size
            </span>
            <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-300">
              {formatBytes(totalOriginalSize)}
            </span>
          </div>

          <div className="h-10 w-px bg-indigo-800/60 hidden sm:block"></div>

          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Compressed Size
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              {formatBytes(totalCompressedSize)}
            </span>
          </div>

          <div className="h-10 w-px bg-indigo-800/60 hidden sm:block"></div>

          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
              Total Savings
            </span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-sm sm:text-base">
                <TrendingDown className="w-4 h-4" />
                -{totalSavedPercent}%
              </span>
              <span className="text-xs text-indigo-200">
                ({formatBytes(totalSavedBytes)} saved)
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-3 w-full lg:w-auto justify-end">
          {/* Compare quality button for single or selected image */}
          {items.length === 1 && (
            <button
              type="button"
              onClick={() => onOpenInspector(items[0])}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2 backdrop-blur-xs"
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Inspect Before / After</span>
            </button>
          )}

          {/* Reset / Clear All button */}
          <button
            type="button"
            onClick={onClearAll}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:border-rose-400/40 text-slate-200 hover:text-white font-medium text-xs sm:text-sm border border-white/15 transition-all flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Reset / Clear All</span>
          </button>

          {/* Download All (ZIP) button */}
          <button
            type="button"
            disabled={isZipping || isProcessingAny}
            onClick={handleDownloadZip}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isZipping ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Packing ZIP ({zipProgress}%)...</span>
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" />
                <span>
                  {items.length > 1 ? `Download All (ZIP)` : 'Download (ZIP)'}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
