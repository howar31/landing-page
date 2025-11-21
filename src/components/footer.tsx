import { socialLinks } from "@/data/projects";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="max-w-6xl mx-auto px-6 pb-20 pt-10 border-t border-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-slate-600 text-sm font-mono">
          © {new Date().getFullYear()} Howar31. All rights reserved.
        </div>

        <div className="flex gap-6">
          {socialLinks.map((link) => {
            const Icon = Github; // Currently only GitHub is supported
            return (
              <a
                key={link.title}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                aria-label={link.title}
              >
                <Icon className="w-5 h-5" />
              </a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
