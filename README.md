# PixelDiet ⚡🖼️
> **100% Client-Side Image Compressor & Resizer** — Fast, private, and runs entirely in your browser with zero server uploads.

![PixelDiet Status](https://img.shields.io/badge/Privacy-100%25%20Client--Side-emerald)
![Build](https://img.shields.io/badge/Build-Passing-brightgreen)
![GitHub Pages](https://img.shields.io/badge/Host-GitHub%20Pages-blue)
![License](https://img.shields.io/badge/License-MIT-purple)

PixelDiet is a modern, single-page web application designed to compress, resize, and convert images directly inside the user's browser. Because all pixel processing uses the native HTML5 `<canvas>` API, your images never leave your computer or touch any remote server.

---

## ✨ Features

- 🔒 **100% Private & Secure**: Images are processed locally on your device. Zero server uploads, zero network tracking, and works completely offline.
- ⚡ **High-Speed Compression**: Hardware-accelerated processing via browser Canvas API with live quality control (10% to 100%).
- 📐 **Smart Resizing & Aspect Ratio Lock**:
  - Exact Width & Height pixel inputs.
  - Aspect Ratio Lock toggle (enabled by default) to prevent stretching or distortion.
  - Scale by percentage or presets.
- 📱 **Social Media Presets**: One-click sizing for:
  - Instagram Square (1080 × 1080)
  - Instagram Story / Reel (1080 × 1920)
  - YouTube Thumbnail (1280 × 720)
  - Web Banner / Full HD (1920 × 1080)
  - Twitter / X Post (1200 × 675)
  - Twitter / X Header (1500 × 500)
  - LinkedIn Banner (1584 × 396)
  - Profile Avatar (400 × 400)
- 🔄 **Output Format Conversion**:
  - Keep Original format
  - Convert to **WebP** (recommended for ultra-small file sizes)
  - Convert to **JPEG** (universal compatibility)
  - Convert to **PNG** (lossless with transparent alpha channel)
- 🔍 **Interactive Split-Screen Before / After Quality Inspector**:
  - Draggable vertical comparison slider.
  - Side-by-side or split visual comparison.
  - Zoom levels (100%, 150%, 200%) and batch navigation.
- 📦 **Batch Upload & ZIP Export**:
  - Drag and drop single or multiple images.
  - Clipboard paste support (`Ctrl+V` / `Cmd+V`) for instant screenshot optimization.
  - One-click **Download All (ZIP)** bundle powered by JSZip.
- 📢 **Ad-Ready Layout**: Clean non-intrusive placeholders above the tool and below the results area for future Google AdSense or sponsor banners.
- 🚀 **SEO & FAQ Section**: Comprehensive step-by-step guide and structured FAQ using semantic `<h1>`, `<h2>`, and `<h3>` tags.

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler**: [Vite 6+](https://vite.dev/) with relative base path (`base: './'`) for seamless GitHub Pages hosting
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Batch Export**: [JSZip](https://stuk.github.io/jszip/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
git clone https://github.com/pankajbatham2010/PixelDiet.git
cd PixelDiet
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production

```bash
npm run build
```

The compiled static assets will be in the `dist/` directory, ready to be hosted on any static hosting platform (GitHub Pages, Vercel, Netlify, Cloudflare Pages, S3).

---

## 🌐 Deploying to GitHub Pages

This repository includes a ready-to-use GitHub Actions workflow (`.github/workflows/deploy.yml`):

1. Go to your repository **Settings** on GitHub.
2. Under **Code and automation**, click **Pages**.
3. In **Build and deployment > Source**, choose **GitHub Actions**.
4. Every push to the `main` branch will automatically build and publish the latest version of PixelDiet!

---

## 📄 License

MIT License &copy; 2026 Pankaj Batham.
