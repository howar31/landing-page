# Howar31 - Personal Landing Page

A minimalist, performance-focused personal landing page built for a backend engineer.

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Design System**: Minimalist / Terminal Theme
- **Icons**: [Lucide React](https://lucide.dev/)
- **Deployment**: GitHub Pages (Static Export)

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

### Adding Projects

Edit `src/data/projects.ts` to add or modify projects. The site will automatically update.

```typescript
export const projects = [
  {
    title: "New Project",
    description: "Description...",
    url: "https://example.com",
    tags: ["Tag1", "Tag2"],
  },
  // ...
];
```

## 📦 Deployment

This project is configured with **GitHub Actions** for automated deployment.

1.  Push changes to the `main` branch.
2.  The workflow `.github/workflows/deploy.yml` will trigger.
3.  It builds the site (`npm run build`) and deploys the `out` directory to GitHub Pages.

Ensure "GitHub Pages" is enabled in your repository settings (Settings > Pages > Build and deployment > Source: GitHub Actions).

## 📄 License

MIT
