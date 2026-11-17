import React from 'react';
import type { ImageFileItem, OutputFormat } from '../types';
import { formatBytes, getOutputFilename } from '../utils/formatters';
import { downloadSingleImage } from '../utils/zipDownloader';
import { Download, Eye, Trash2, Loader2, ArrowRight, Image as ImageIcon } from 'lucide-react';

interface ImageCardProps {
  item: ImageFileItem;
  format: OutputFormat;
  onRemove: (id: string) => void;
  onInspect: (item: ImageFileItem) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  item,
  format,
  onRemove,
  onInspect,
}) => {
  const isReduced = item.savedPercentage > 0;
  const isIncreased = item.savedPercentage < 0;

  const targetFilename = getOutputFilename(item.name, format, item.originalFormat);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Top Preview Section */}
      <div className="relative aspect-video sm:aspect-4/3 w-full bg-slate-100 overflow-hidden flex items-center justify-center">
        {item.compressedPreviewUrl || item.originalPreviewUrl ? (
          <img
            src={item.compressedPreviewUrl || item.originalPreviewUrl}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <ImageIcon className="w-8 h-8 mb-1" />
            <span className="text-xs">Loading...</span>
          </div>
        )}

        {/* Processing Overlay */}
        {item.isProcessing && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xs flex flex-col items-center justify-center text-white">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400 mb-1" />
            <span className="text-xs font-semibold">Optimizing...</span>
          </div>
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          {/* Savings Badge */}
          {item.compressedBlob && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-extrabold shadow-xs ${
                isReduced
                  ? 'bg-emerald-500 text-white'
                  : isIncreased
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {isReduced ? `-${item.savedPercentage}%` : `${Math.abs(item.savedPercentage)}%`}
            </span>
          )}
        </div>

        {/* Action icons overlay on hover */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onInspect(item)}
            title="Inspect quality before / after"
            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-indigo-600 shadow-md transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(item.id)}
            title="Remove image"
            className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-md transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Dimension comparison footer over preview */}
        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/70 backdrop-blur-xs text-[11px] font-mono text-white flex items-center justify-between">
          <span className="truncate max-w-[45%]">
            {item.originalWidth}×{item.originalHeight}
          </span>
          <ArrowRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="font-semibold text-emerald-300 truncate max-w-[45%]">
            {item.compressedWidth}×{item.compressedHeight}
          </span>
        </div>
      </div>

      {/* Info & Stats Section */}
      <div className="p-4 space-y-3">
        {/* Filename */}
        <div>
          <h4
            className="text-xs font-bold text-slate-800 truncate"
            title={targetFilename}
          >
            {item.name}
          </h4>
          <span className="text-[10px] text-slate-400 truncate block mt-0.5">
            Output: {targetFilename}
          </span>
        </div>

        {/* Size comparison breakdown */}
        <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">
              Original
            </span>
            <span className="text-xs font-medium text-slate-600 line-through">
              {formatBytes(item.originalSize)}
            </span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-slate-300" />

          <div className="text-right">
            <span className="text-[10px] uppercase font-semibold text-emerald-600 block">
              Compressed
            </span>
            <span className="text-xs font-bold text-slate-900">
              {formatBytes(item.compressedSize)}
            </span>
          </div>
        </div>

        {/* Buttons: Download & Inspect */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={() => onInspect(item)}
            className="px-3 py-2 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Compare</span>
          </button>

          <button
            type="button"
            disabled={!item.compressedBlob || item.isProcessing}
            onClick={() => downloadSingleImage(item, format)}
            className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};
