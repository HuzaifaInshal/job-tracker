"use client";

import { useEffect, useRef } from "react";
import { Briefcase, Calendar, Shield } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    step: "01",
    icon: <Shield className="h-5 w-5" />,
    title: "Sign in with Google",
    desc: "One click and your personal dashboard is ready. No forms, no passwords.",
    color: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    step: "02",
    icon: <Briefcase className="h-5 w-5" />,
    title: "Add your first application",
    desc: "Company, role, channel, status — the full picture in one clean form.",
    color: "text-violet-400",
    iconBg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    step: "03",
    icon: <Calendar className="h-5 w-5" />,
    title: "Build your timeline",
    desc: "Log every touchpoint — calls, emails, interviews — as they happen.",
    color: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
  },
];

export function HowItWorksSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const line1Ref = useRef<SVGLineElement>(null);
  const line2Ref = useRef<SVGLineElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-hiw-heading]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-hiw-heading]",
          start: "top 85%",
        },
      });

      gsap.from("[data-hiw-card]", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-hiw-card]",
          start: "top 85%",
        },
      });

      // Draw connector lines
      [line1Ref.current, line2Ref.current].forEach((line) => {
        if (!line) return;
        const length = (line as SVGLineElement & { getTotalLength?: () => number }).getTotalLength?.() ?? 200;
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(line, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-24"
    >
      <div data-hiw-heading className="text-center mb-16">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
          How it works
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white">
          Up and running in seconds.
        </h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* SVG connector lines (desktop only) */}
        <svg
          className="hidden md:block absolute top-8 left-0 w-full h-1 pointer-events-none"
          style={{ overflow: "visible" }}
        >
          <line
            ref={line1Ref}
            x1="33%"
            y1="0"
            x2="50%"
            y2="0"
            stroke="#1e2d45"
            strokeWidth="1"
          />
          <line
            ref={line2Ref}
            x1="50%"
            y1="0"
            x2="67%"
            y2="0"
            stroke="#1e2d45"
            strokeWidth="1"
          />
        </svg>

        {STEPS.map((s) => (
          <div
            key={s.step}
            data-hiw-card
            className="relative rounded-2xl border border-[#1e2d45] bg-[#0a0d18] p-7 card-hover group overflow-hidden"
          >
            {/* Subtle top gradient */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />

            <div className="flex items-center gap-3 mb-5">
              <span className="font-display text-4xl font-black text-[#1e2d45] select-none">
                {s.step}
              </span>
              <div
                className={`h-10 w-10 rounded-xl border ${s.iconBg} flex items-center justify-center ${s.color}`}
              >
                {s.icon}
              </div>
            </div>
            <h3 className="font-semibold text-white mb-2 text-lg">
              {s.title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
