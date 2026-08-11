# 💥 Comic-Themed Software Engineering Portfolio

[![Live Website](https://img.shields.io/badge/Website-yogeshtandan.in-FF0055?style=for-the-badge&logo=googlechrome&logoColor=white)](https://yogeshtandan.in/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.7-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

A comic-book-inspired engineering portfolio and technical newsroom built for **Yogesh Tandan** — Software Engineer specializing in Next.js multi-tenant SaaS, WebGL 3D rendering engines (~60% speedup), and AWS/Terraform CI/CD infrastructure.

---

## ✨ Features & Highlights

- 🎨 **Comic Design System**: Built-in halftone dot overlays, thick panel borders, speech bubble tooltips, sound effect badges (`KAPOW!`, `BAM!`), and retro typography (`Bangers`, `Bebas Neue`, `Inter`).
- 🌐 **Custom Domain & SEO Ready**: Hosted at [https://yogeshtandan.in/](https://yogeshtandan.in/) with dynamic OpenGraph metadata, JSON-LD structured data (Person, BlogPosting, CollectionPage), automatically generated `sitemap.xml`, `robots.txt`, and `rss.xml`.
- ⚡ **WebGL Interactive Hero**: Embedded interactive 3D hero canvas built with **Three.js** featuring real-time light interactions and particle grids.
- 📜 **Markdown Chronicles & Dossiers**: Built-in markdown parser using `Marked` and `gray-matter` for technical articles, TOC navigation, and project case studies.
- 📑 **Interactive Pagination & Filtering**: Category and tag filters with client-side pagination across project and blog listings.
- 🌓 **Dark / Light Mode**: Seamless theme switching using `next-themes`.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 & Vanilla CSS Tokens
- **3D Graphics**: Three.js & `@types/three`
- **Animations**: Framer Motion
- **Markdown & Parser**: `marked`, `gray-matter`
- **Icons**: Lucide React
- **Theme**: `next-themes`

---

## 🚀 Getting Started

### Prerequisites

Ensure you have Node.js 18+ installed on your system.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/y0-gesh/y0-gesh.github.io.git
   cd y0-gesh.github.io
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Build & Deployment

### Production Build

To test and compile the production static build:

```bash
npm run build
```

This will:
1. Compile the Next.js app to static HTML (`out/` directory).
2. Execute `postbuild` script (`scripts/generate-seo-files.mjs`) to generate `sitemap.xml`, `robots.txt`, and `rss.xml`.

---

## 📁 Repository Structure

```text
├── content/               # Markdown content files
│   ├── blog/              # Technical blog posts
│   └── projects/          # Project dossiers & case studies
├── public/                # Static assets, images, and CNAME
├── scripts/               # Build scripts (SEO generators)
├── src/
│   ├── app/               # Next.js App Router pages & metadata
│   ├── components/        # Comic UI, layout, section, and 3D components
│   ├── lib/               # Utility functions, markdown parser, SEO configs
│   └── styles/            # Tailwind CSS v4 & custom comic CSS styles
├── README.md              # Project documentation
└── package.json
```

---

## 👤 Author

**Yogesh Tandan** — Software Engineer
- **Website**: [yogeshtandan.in](https://yogeshtandan.in/)
- **GitHub**: [@y0-gesh](https://github.com/y0-gesh)
- **LinkedIn**: [yogesh-tandan](https://www.linkedin.com/in/yogesh-tandan)
- **X (Twitter)**: [@y0_gesh_](https://x.com/y0_gesh_)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
