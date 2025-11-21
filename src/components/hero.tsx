"use client";

import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export function Hero() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header when scrolled past the hero section (about 300px)
      setIsSticky(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Original Hero Section */}
      <section className="py-24 md:py-32 max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-12 justify-between items-start md:items-end">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                Howar31
              </span>
            </h1>

            <p className="text-2xl md:text-3xl text-slate-300 font-medium max-w-2xl">
              Building scalable backend systems & <br className="hidden md:block" />
              crafting efficient solutions.
            </p>

            <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
              A seasoned Backend Engineer.
              Passionate about distributed systems, cloud infrastructure, and open source.
            </p>
          </div>

          <a
            href="http://blog.howar31.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-blue-500/50 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 backdrop-blur-sm"
          >
            Visit Blog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-400" />
          </a>
        </div>
      </section>

      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800/50">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
                Howar31
              </span>
            </h2>

            <a
              href="http://blog.howar31.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-5 py-2 bg-slate-800/50 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-blue-500/50 rounded-full font-medium transition-all hover:shadow-lg hover:shadow-blue-500/10 text-sm"
            >
              Visit Blog
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-400" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
