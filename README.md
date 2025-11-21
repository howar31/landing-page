# Howar31 - Personal Landing Page

A minimalist, performance-focused personal landing page built for a backend engineer.
Designed with a deep blue & purple aesthetic, featuring a responsive layout and data-driven content.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: GitHub Pages (Static Export) via GitHub Actions
- **Domain**: Custom domain [howar31.com](https://howar31.com)

## ✨ Features

- **Minimalist Hero Section**: 100vh immersive intro with gradient text and subtle animations.
- **Sticky Header**: Smart header that appears on scroll, responsive for mobile (icon-only) and desktop.
- **Project Grid**: Filterable grid for Side Projects with smooth layout transitions.
- **Tech Stack**: Categorized skills display (Backend, Frontend, Cloud, Database, AI Workflows).
- **Data-Driven**: Content managed via structured data files in `src/data/`.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop.
- **Cross-Browser**: Polished support for Safari (iPhone) and Chrome.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/howar31/howar31-web.git
    cd howar31-web
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📝 Managing Content

All content is separated from the UI components for easy maintenance.

### 1. Hero Section
Edit `src/data/hero.ts` to update:
- Title & Subtitle
- Description (supports unlimited lines)
- Action Buttons (Blog, GitHub, etc.)

### 2. Projects
Edit `src/data/projects.ts` to manage your portfolio:
```typescript
export const projects = [
  {
    title: "New Project",
    description: "Description...",
    url: "https://example.com",
    tags: ["Go", "K8s"],
  },
  // ...
];
```

### 3. Skills / Tech Stack
Edit `src/data/skills.ts` to update skill categories and items.

## 📦 Deployment

This project is configured with **GitHub Actions** for automated deployment to GitHub Pages.

1.  Push changes to the `main` branch.
2.  The workflow `.github/workflows/deploy.yml` will trigger.
3.  It builds the site (`npm run build`) and deploys the `out` directory to GitHub Pages.
4.  The `CNAME` file ensures the custom domain `howar31.com` is preserved.

## 📄 License

MIT
