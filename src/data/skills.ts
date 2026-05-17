import { Cpu, Globe, Cloud, Database, Sparkles } from "lucide-react";

export const skillCategories = [
  {
    title: "Backend",
    icon: Cpu,
    color: "#60a5fa",
    skills: ["Node.js", "TypeScript", "Golang", "PHP (Laravel)", "GraphQL", "RESTful API", "ActivityPub"],
  },
  {
    title: "Frontend",
    icon: Globe,
    color: "#a78bfa",
    skills: ["React", "Next.js", "Vue.js", "JavaScript", "Tailwind CSS"],
  },
  {
    title: "Cloud & DevOps",
    icon: Cloud,
    color: "#34d399",
    skills: ["GCP", "AWS", "Docker", "Kubernetes", "CI/CD"],
  },
  {
    title: "Database & Tools",
    icon: Database,
    color: "#f59e0b",
    skills: ["MySQL", "PostgreSQL", "MongoDB", "Prisma", "Git", "Postman"],
  },
  {
    title: "AI Workflows",
    icon: Sparkles,
    color: "#f472b6",
    skills: ["Cursor", "AntiGravity", "ComfyUI", "Automatic1111", "CLI Agent"],
  },
];
