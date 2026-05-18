import { AmbientGlow } from "@/components/ambient-glow";
import { TopBar } from "@/components/top-bar";
import { IdentityCard } from "@/components/identity-card";
import { IntroLetter } from "@/components/intro-letter";
import { TechStack } from "@/components/tech-stack";
import { ProjectGrid } from "@/components/projects";
import { Writing } from "@/components/writing";
import { SupportBlock } from "@/components/support-block";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <AmbientGlow />
      <div className="relative z-[1] min-h-screen">
        <TopBar />
        <main className="mx-auto grid max-w-[1180px] grid-cols-1 items-start gap-10 px-5 pt-6 feed:grid-cols-[320px_1fr] feed:gap-14 feed:px-8 feed:pt-10 2xl:max-w-[1320px] w1:max-w-[1480px] w1:grid-cols-[360px_1fr] w1:gap-16 w2:max-w-[1620px] w3:max-w-[1760px] w3:grid-cols-[380px_1fr]">
          <IdentityCard />
          <div className="min-w-0">
            <IntroLetter />
            <TechStack />
            <ProjectGrid />
            <Writing />
            <SupportBlock />
            <SiteFooter />
          </div>
        </main>
      </div>
    </>
  );
}
