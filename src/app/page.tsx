import { Hero } from "@/components/hero";
import { Skills } from "@/components/skills";
import { ProjectGrid } from "@/components/project-grid";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Skills />
      <ProjectGrid />
      <Footer />
    </main>
  );
}
