import React from 'react';
import type { CompressionSettings, OutputFormat, SocialPreset } from '../types';
import { SOCIAL_PRESETS } from '../utils/formatters';
import { Sliders, Lock, Unlock, RotateCcw, Layers } from 'lucide-react';

interface ControlPanelProps {
  settings: CompressionSettings;
  onChange: (newSettings: CompressionSettings) => void;
  referenceAspectRatio?: number | null; // width / height of first or active image
  hasImages: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  settings,
  onChange,
  referenceAspectRatio,
}) => {
  // Quality slider change
  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value) / 100;
    onChange({
      ...settings,
      quality: val,
    });
  };

  // Set quick quality preset
  const setQuickQuality = (q: number) => {
    onChange({
      ...settings,
      quality: q,
    });
  };

  // Format change
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...settings,
      format: e.target.value as OutputFormat,
    });
  };

  // Toggle aspect ratio lock
  const toggleAspectRatio = () => {
    onChange({
      ...settings,
      aspectRatioLocked: !settings.aspectRatioLocked,
    });
  };

  // Width input change
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    if (val !== null && isNaN(val)) return;

    let newHeight = settings.customHeight;
    if (settings.aspectRatioLocked && val !== null && val > 0) {
      const ratio = referenceAspectRatio || 1;
      newHeight = Math.round(val / ratio);
    }

    onChange({
      ...settings,
      resizeMode: val || newHeight ? 'custom' : 'none',
      customWidth: val,
      customHeight: newHeight,
    });
  };

  // Height input change
  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value === '' ? null : parseInt(e.target.value, 10);
    if (val !== null && isNaN(val)) return;

    let newWidth = settings.customWidth;
    if (settings.aspectRatioLocked && val !== null && val > 0) {
      const ratio = referenceAspectRatio || 1;
      newWidth = Math.round(val * ratio);
    }

    onChange({
      ...settings,
      resizeMode: newWidth || val ? 'custom' : 'none',
      customWidth: newWidth,
      customHeight: val,
    });
  };

  // Apply social media preset
  const applyPreset = (preset: SocialPreset) => {
    onChange({
      ...settings,
      resizeMode: 'preset',
      customWidth: preset.width,
      customHeight: preset.height,
    });
  };

  // Reset resize dimensions
  const resetDimensions = () => {
    onChange({
      ...settings,
      resizeMode: 'none',
      customWidth: null,
      customHeight: null,
      scalePercentage: 100,
    });
  };

  const qualityPercent = Math.round(settings.quality * 100);

  const getQualityLabel = (val: number) => {
    if (val <= 35) return 'Max Compression (Smallest file)';
    if (val <= 65) return 'High Compression (Good quality)';
    if (val <= 85) return 'Balanced (Recommended)';
    return 'Ultra High Quality (Crisp details)';
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">
              Live Optimization Settings
            </h3>
            <p className="text-xs text-slate-500">
              Changes apply instantly across all uploaded images
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            onChange({
              quality: 0.8,
              format: 'original',
              aspectRatioLocked: true,
              resizeMode: 'none',
              customWidth: null,
              customHeight: null,
              scalePercentage: 100,
            });
          }}
          className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium transition-colors cursor-pointer"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Compression Slider & Output Format */}
        <div className="space-y-6">
          {/* Compression Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="quality-slider" className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Compression Quality</span>
                <span className="text-xs font-normal text-slate-400">({getQualityLabel(qualityPercent)})</span>
              </label>
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 font-bold text-xs">
                {qualityPercent}%
              </span>
            </div>

            <div className="relative pt-1">
              <input
                id="quality-slider"
                type="range"
                min="10"
                max="100"
                step="1"
                value={qualityPercent}
                onChange={handleQualityChange}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-medium">
                <span>10% (Smallest)</span>
                <span>50%</span>
                <span className="text-indigo-600 font-semibold">80% (Default)</span>
                <span>100% (Lossless-like)</span>
              </div>
            </div>

            {/* Quick Quality Presets */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setQuickQuality(0.5)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  qualityPercent === 50
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Small Size (50%)
              </button>
              <button
                type="button"
                onClick={() => setQuickQuality(0.8)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  qualityPercent === 80
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                Balanced (80%)
              </button>
              <button
                type="button"
                onClick={() => setQuickQuality(0.95)}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-all cursor-pointer ${
                  qualityPercent === 95
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                High Quality (95%)
              </button>
            </div>
          </div>

          {/* Output Format Dropdown */}
          <div className="space-y-2">
            <label htmlFor="format-select" className="text-sm font-semibold text-slate-800 flex items-center justify-between">
              <span>Convert Output Format</span>
              <span className="text-xs font-normal text-slate-400">Choose file type</span>
            </label>
            <div className="relative">
              <select
                id="format-select"
                value={settings.format}
                onChange={handleFormatChange}
                className="w-full bg-slate-50 border border-slate-300 hover:border-slate-400 text-slate-800 text-sm font-medium rounded-xl p-3 pr-8 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none cursor-pointer"
              >
                <option value="original">Original (Keep source format)</option>
                <option value="image/webp">WebP (Recommended — Ultra high compression & web speed)</option>
                <option value="image/jpeg">JPEG (Universal photo compatibility)</option>
                <option value="image/png">PNG (Preserves transparent background)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500">
              WebP offers 25–35% smaller file sizes compared to JPEG at the same visual quality.
            </p>
          </div>
        </div>

        {/* Right Column: Resize Controls & Social Media Presets */}
        <div className="space-y-6">
          {/* Resize Controls with Aspect Ratio Lock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <span>Resize Dimensions (px)</span>
                {settings.resizeMode !== 'none' && (
                  <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-medium border border-emerald-200">
                    Active
                  </span>
                )}
              </label>

              {settings.resizeMode !== 'none' && (
                <button
                  type="button"
                  onClick={resetDimensions}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
                >
                  Clear Dimensions
                </button>
              )}
            </div>

            <div className="grid grid-cols-11 items-center gap-2">
              {/* Width Input */}
              <div className="col-span-5 relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">W</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="Width px"
                  value={settings.customWidth ?? ''}
                  onChange={handleWidthChange}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              {/* Aspect Ratio Lock Toggle */}
              <div className="col-span-1 flex justify-center">
                <button
                  type="button"
                  onClick={toggleAspectRatio}
                  title={settings.aspectRatioLocked ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
                  className={`p-2 rounded-lg transition-colors border cursor-pointer ${
                    settings.aspectRatioLocked
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                      : 'bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {settings.aspectRatioLocked ? (
                    <Lock className="w-3.5 h-3.5" />
                  ) : (
                    <Unlock className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Height Input */}
              <div className="col-span-5 relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">H</span>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  placeholder="Height px"
                  value={settings.customHeight ?? ''}
                  onChange={handleHeightChange}
                  className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.aspectRatioLocked}
                  onChange={toggleAspectRatio}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Lock aspect ratio (recommended)</span>
              </label>

              {settings.customWidth && settings.customHeight && (
                <span className="font-mono text-[11px] text-slate-400">
                  {settings.customWidth} × {settings.customHeight}
                </span>
              )}
            </div>
          </div>

          {/* Social Media Presets */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                Social Media Dimension Presets
              </span>
              <span className="text-xs text-slate-400">Auto-fill dimensions</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {SOCIAL_PRESETS.map((preset) => {
                const isSelected =
                  settings.customWidth === preset.width &&
                  settings.customHeight === preset.height;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`p-2 rounded-xl text-left border transition-all text-xs flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-2xs ring-1 ring-indigo-600'
                        : 'border-slate-200/80 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold truncate">{preset.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 mt-1">
                      {preset.width} × {preset.height}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
