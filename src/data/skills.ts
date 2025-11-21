import { Cpu, Globe, Cloud, Database, Sparkles } from "lucide-react";

export const skillCategories = [
  {
    title: "Backend",
    icon: Cpu,
    skills: ["Node.js", "TypeScript", "Golang", "PHP (Laravel)", "GraphQL", "RESTful API", "ActivityPub"],
  },
  {
    title: "Frontend",
    icon: Globe,
    skills: ["React", "Next.js", "Vue.js", "JavaScript", "Tailwind CSS"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    skills: ["GCP", "AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    title: "Database & Tools",
    icon: Database,
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Prisma", "Git", "Postman"],
  },
  {
    title: "AI Workflows",
    icon: Sparkles,
    skills: ["Cursor", "AntiGravity", "ComfyUI", "Automatic1111", "CLI Agent"],
  },
];
