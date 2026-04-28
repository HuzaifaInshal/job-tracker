"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: 100, suffix: "%", label: "Free to use", sub: "No paywalls, ever" },
  { value: 999, suffix: "+", label: "Applications", sub: "Track as many as you need" },
  { value: 1, suffix: " min", label: "Setup time", sub: "Sign in and start immediately" },
];

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-stats-card]", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
      });

      // Counter tweens
      document.querySelectorAll("[data-counter]").forEach((el) => {
        const target = Number((el as HTMLElement).dataset.counter);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: "power2.out",
          snap: { val: 1 },
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
          onUpdate() {
            el.textContent = String(Math.round(obj.val));
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-16">
      <div
        data-stats-card
        className="rounded-3xl border border-[#1e2d45] bg-[#0a0d18] p-10 md:p-16 relative overflow-hidden"
      >
        {/* Background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-600/5 blur-3xl pointer-events-none" />

        {/* Top line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="group">
              <div className="font-display text-5xl md:text-6xl font-black text-white mb-2 tracking-tight flex items-baseline justify-center gap-0.5">
                <span data-counter={s.value}>0</span>
                <span>{s.suffix}</span>
              </div>
              <div className="text-sm font-semibold text-slate-300 mb-1">
                {s.label}
              </div>
              <div className="text-sm text-slate-500">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
