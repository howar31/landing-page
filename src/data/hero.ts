import { BookOpen, Github, LucideIcon } from "lucide-react";

export interface HeroAction {
  label: string;
  url: string;
  icon: LucideIcon;
  isPrimary?: boolean;
}

export const heroActions: HeroAction[] = [
  {
    label: "Blog",
    url: "http://blog.howar31.com/",
    icon: BookOpen,
    isPrimary: true,
  },
  {
    label: "GitHub",
    url: "https://github.com/howar31",
    icon: Github,
    isPrimary: false,
  },
];
export const heroData = {
  title: "Howar31",
  subtitle: [
    "Building scalable backend systems &",
    "crafting efficient solutions.",
  ],
  description: [
    "A seasoned Backend Engineer.  Passionate about distributed systems, cloud infrastructure, and open source.",
  ],
};
