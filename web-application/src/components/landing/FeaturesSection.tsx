"use client";

import { useEffect, useRef } from "react";
import {
  BarChart3,
  Clock,
  Filter,
  Globe2,
  Shield,
  Zap,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  {
    icon: <Filter className="h-5 w-5" />,
    title: "Smart Filtering",
    desc: "Slice through applications instantly. Filter by status, channel, date range, or search anything.",
    gradient: "from-blue-500/15 to-indigo-500/5",
    border: "border-blue-500/20",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
    glow: "bg-blue-500",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Timeline Tracking",
    desc: "Every call, email, and interview logged. Build a full picture of each application journey.",
    gradient: "from-violet-500/15 to-purple-500/5",
    border: "border-violet-500/20",
    iconBg: "bg-violet-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
    glow: "bg-violet-500",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Instant Status Updates",
    desc: "Flip statuses in one click. Auto-generates timeline entries so nothing falls through the cracks.",
    gradient: "from-amber-500/15 to-orange-500/5",
    border: "border-amber-500/20",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
    glow: "bg-amber-500",
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Multi-Channel Support",
    desc: "LinkedIn, Indeed, email, direct — track exactly how and where you applied, all in one place.",
    gradient: "from-cyan-500/15 to-teal-500/5",
    border: "border-cyan-500/20",
    iconBg: "bg-cyan-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    glow: "bg-cyan-500",
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Application Insights",
    desc: "Live status bar at the top of every session. Know your pipeline health at a glance.",
    gradient: "from-emerald-500/15 to-green-500/5",
    border: "border-emerald-500/20",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    glow: "bg-emerald-500",
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: "Private by Default",
    desc: "Your data belongs to you. Secured with Firebase rules so only you see your applications.",
    gradient: "from-rose-500/15 to-pink-500/5",
    border: "border-rose-500/20",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    iconColor: "text-rose-400",
    glow: "bg-rose-500",
  },
];

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from("[data-feat-heading]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "[data-feat-heading]",
          start: "top 85%",
        },
      });

      // Cards batch stagger
      ScrollTrigger.batch("[data-feat-card]", {
        start: "top 88%",
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 50,
            opacity: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          }),
        once: true,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="features"
      ref={sectionRef}
      className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-28"
    >
      {/* Section heading */}
      <div data-feat-heading className="text-center mb-16">
        <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-blue-400 mb-4">
          Features
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Everything your job search needs.
          <br />
          <span className="text-slate-500">Nothing it doesn't.</span>
        </h2>
        <p className="text-slate-400 text-lg max-w-xl mx-auto">
          A focused toolset that keeps you organised from first click to final
          offer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            data-feat-card
            className={`group relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.gradient} p-6 overflow-hidden card-hover cursor-default`}
          >
            {/* Hover glow */}
            <div
              className={`absolute -top-10 -right-10 h-32 w-32 rounded-full ${f.glow} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-500 pointer-events-none`}
            />

            <div
              className={`h-10 w-10 rounded-xl border ${f.iconBg} flex items-center justify-center mb-4 ${f.iconColor}`}
            >
              {f.icon}
            </div>
            <h3 className="font-semibold text-white mb-2 text-[15px]">
              {f.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
