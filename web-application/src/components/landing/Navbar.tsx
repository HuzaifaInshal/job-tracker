"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Briefcase, ChevronRight } from "lucide-react";
import { gsap } from "gsap";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-nav-item]", {
        y: -20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.1,
      });
    }, navRef);

    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ctx.revert();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 max-w-[1400px] mx-auto transition-all duration-500 ${
        scrolled
          ? "bg-[#080b12]/80 backdrop-blur-xl border-b border-white/5"
          : ""
      }`}
    >
      <div data-nav-item className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
          <Briefcase className="h-4 w-4 text-blue-400" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight text-white">
          JobTrack
        </span>
      </div>

      <div data-nav-item className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/get-started"
          className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          Sign In <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </nav>
  );
}
