import React, { useState } from 'react';
import { ChevronDown, Shield, Zap, Layers, CheckCircle2, Globe } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: 'How does PixelDiet compress images without uploading them to a server?',
    answer:
      'PixelDiet operates 100% inside your web browser using the native HTML5 Canvas API and WebAssembly algorithms. When you select or drag images into the app, your computer’s own CPU/GPU decodes, resizes, and re-encodes the image pixels locally in browser memory. Not a single byte is ever sent across the network.',
  },
  {
    question: 'Are my images private and secure?',
    answer:
      'Yes, absolutely. Because PixelDiet is a completely static, frontend-only application hosted on GitHub Pages with zero backend servers, your photos never leave your device. You can even disconnect your internet Wi-Fi or turn on Airplane Mode after loading the page and the tool will continue compressing and resizing your images seamlessly.',
  },
  {
    question: 'Which image formats are supported?',
    answer:
      'PixelDiet supports input files in JPEG/JPG, PNG, WebP, AVIF, and BMP formats. You can convert your output images to Original (maintaining source format), modern WebP (recommended for optimal file size and web speed), standard JPEG, or PNG (for transparency preservation).',
  },
  {
    question: 'What is the advantage of converting images to WebP?',
    answer:
      'WebP is a modern image format developed by Google that provides superior lossless and lossy compression for web images. WebP images are typically 25% to 35% smaller than comparable JPEGs and PNGs at identical visual quality, resulting in significantly faster website page loads and lower bandwidth consumption.',
  },
  {
    question: 'Why should I resize images using social media presets?',
    answer:
      'Platforms like Instagram, YouTube, Twitter/X, and LinkedIn compress uploaded images with aggressive server-side algorithms if they do not match their recommended dimensions. By using PixelDiet’s built-in social media presets (such as Instagram Square 1080×1080 or YouTube Thumbnail 1280×720), you retain maximum sharpness and avoid awkward cropping or blurriness.',
  },
  {
    question: 'Can I compress and download multiple images in batch as a ZIP file?',
    answer:
      'Yes! You can drag and drop dozens of images simultaneously. PixelDiet will process each file in parallel using your browser threads. Once ready, simply click the "Download All (ZIP)" button to get all your optimized images packaged into a single clean ZIP archive.',
  },
  {
    question: 'What does the Aspect Ratio Lock do?',
    answer:
      'When the Aspect Ratio Lock is enabled (default), entering a new Width automatically recalculates the Height proportionally (and vice versa) based on the image’s original dimensions. This prevents your photos from appearing stretched or distorted.',
  },
];

export const SeoSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section className="w-full max-w-5xl mx-auto mt-16 sm:mt-24 space-y-16 text-slate-700">
      {/* "How to Use" Step-by-Step Guide */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60">
            Step-by-Step Tutorial
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How to Compress & Resize Images Online
          </h2>
          <p className="text-sm text-slate-500">
            Follow these simple steps to optimize your pictures for web, email, or social media without losing quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {/* Step 1 */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                1
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Upload or Paste Images
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Drag and drop single or multiple JPG, PNG, or WebP files into the upload box, click "Select Files", or press <kbd className="px-1.5 py-0.5 rounded bg-white border border-slate-300 font-mono text-[11px]">Ctrl+V</kbd> to paste a clipboard screenshot.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium pt-2 border-t border-slate-200/60">
              <CheckCircle2 className="w-4 h-4" />
              <span>Batch upload supported</span>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                2
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Tune Quality & Presets
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adjust the compression quality slider (default 80%), pick your output format (WebP, JPEG, or PNG), and choose a social media preset (Instagram, YouTube) or custom dimensions with Aspect Ratio Lock.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium pt-2 border-t border-slate-200/60">
              <CheckCircle2 className="w-4 h-4" />
              <span>Real-time instant preview</span>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/60 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-indigo-600/20">
                3
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Inspect & Download
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Verify compression savings and use the interactive Before/After split slider to ensure zero visual degradation. Download single images or export the entire batch in one ZIP file.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium pt-2 border-t border-slate-200/60">
              <CheckCircle2 className="w-4 h-4" />
              <span>1-Click ZIP bundle export</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Use PixelDiet for Client-Side Compression?
          </h2>
          <p className="text-sm text-slate-500">
            Engineered from the ground up for privacy-conscious creators, developers, and businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Zero Server Uploads
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your sensitive documents, personal photos, and graphics stay 100% on your device. Nothing touches any remote server or third-party database.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Instant Processing
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              No waiting in slow upload queues or waiting for server rendering. Image compression happens instantly at hardware speed via your local browser.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center border border-teal-100">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Works Offline
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Once loaded, PixelDiet works completely offline. Perfect for flights, remote work, or spotty internet connections with zero downtime.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Bulk ZIP Export
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Compress whole photo galleries, product catalogs, or social media packs in seconds and download them bundled together in a neat ZIP archive.
            </p>
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 shadow-sm space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60">
            Got Questions?
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-slate-500">
            Everything you need to know about image compression, file formats, and privacy.
          </p>
        </div>

        <div className="divide-y divide-slate-100 max-w-3xl mx-auto">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="py-4">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between text-left py-2 font-bold text-slate-800 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  <h3 className="text-base sm:text-lg font-bold pr-4">
                    {faq.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-600' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="pt-2 pb-3 text-sm text-slate-600 leading-relaxed animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
