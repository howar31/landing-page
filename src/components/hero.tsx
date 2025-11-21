"use client";

import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { heroActions, heroData } from "@/data/hero";

export function Hero() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header when scrolled past the hero section (about 100vh)
      const heroHeight = window.innerHeight;
      setIsSticky(window.scrollY > heroHeight - 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Original Hero Section */}
      <section className="min-h-screen flex flex-col justify-center relative max-w-6xl mx-auto px-6 py-4">
        <div className="flex flex-col gap-8 items-start">
          <div className="space-y-6 max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">
              <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] supports-[background-clip:text]:text-transparent">
                {heroData.title}
              </span>
            </h1>

            <div className="text-2xl md:text-3xl text-slate-300 font-medium max-w-2xl">
              {heroData.subtitle.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

            <div className="text-lg text-slate-400 max-w-xl leading-relaxed">
              {heroData.description.map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              {heroActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 ${
                      action.isPrimary
                        ? "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-slate-600">
          <ChevronDown className="w-8 h-8" />
        </div>
      </section>

      {/* Sticky Header */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isSticky ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="bg-slate-950/70 backdrop-blur-xl border-slate-800/30 supports-[backdrop-filter]:bg-slate-950/60">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              <span className="text-blue-400 bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] supports-[background-clip:text]:text-transparent">
                {heroData.title}
              </span>
            </h2>

            <div className="flex gap-3">
              {heroActions.map((action) => {
                const Icon = action.icon;
                return (
                  <a
                    key={action.label}
                    href={action.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 rounded-full font-medium transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm ${
                      action.isPrimary
                        ? "bg-blue-600 hover:bg-blue-500 text-white hover:shadow-blue-500/25"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600"
                    }`}
                    aria-label={action.label}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{action.label}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
