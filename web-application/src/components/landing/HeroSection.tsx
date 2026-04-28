"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  Shield,
  TrendingUp,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const MOCK_APPS = [
  {
    company: "Stripe",
    role: "Senior Engineer",
    dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
    label: "Accepted",
    date: "Jan 12",
  },
  {
    company: "Figma",
    role: "Product Designer",
    dot: "bg-amber-400",
    badge: "text-amber-400 bg-amber-400/10 border-amber-500/20",
    label: "Pending",
    date: "Jan 15",
  },
  {
    company: "Notion",
    role: "Full Stack Dev",
    dot: "bg-orange-400",
    badge: "text-orange-400 bg-orange-400/10 border-orange-500/20",
    label: "Needs Attention",
    date: "Jan 18",
  },
  {
    company: "Linear",
    role: "Frontend Dev",
    dot: "bg-amber-400",
    badge: "text-amber-400 bg-amber-400/10 border-amber-500/20",
    label: "Pending",
    date: "Jan 20",
  },
  {
    company: "Vercel",
    role: "DevRel Engineer",
    dot: "bg-emerald-400",
    badge: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
    label: "Accepted",
    date: "Jan 22",
  },
];

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const floatCard1Ref = useRef<HTMLDivElement>(null);
  const floatCard2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero content stagger
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-badge]", { y: 30, opacity: 0, duration: 0.7 })
        .from("[data-hero-h1]", { y: 40, opacity: 0, duration: 0.8 }, "-=0.4")
        .from("[data-hero-sub]", { y: 30, opacity: 0, duration: 0.7 }, "-=0.5")
        .from("[data-hero-ctas]", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          mockupRef.current,
          { y: 60, opacity: 0, duration: 1, ease: "power2.out" },
          "-=0.3"
        )
        .from(
          floatCard1Ref.current,
          { x: 40, opacity: 0, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.4"
        )
        .from(
          floatCard2Ref.current,
          { x: -40, opacity: 0, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.5"
        );

      // Floating animation on mockup
      gsap.to(mockupRef.current, {
        y: -14,
        duration: 3.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      gsap.to(floatCard1Ref.current, {
        y: -18,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 0.8,
      });

      gsap.to(floatCard2Ref.current, {
        y: -12,
        duration: 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 1.5,
      });

      // Parallax on scroll
      gsap.to(mockupRef.current, {
        y: 80,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Table rows stagger in
      gsap.from("[data-mock-row]", {
        x: -20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        delay: 1.2,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 pt-32 pb-8 md:pt-40 md:pb-12"
    >
      <div className="flex flex-col items-center text-center">
        {/* Badge */}
        <div
          data-hero-badge
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/8 text-sm font-medium text-blue-400 mb-8"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
          Built for serious job seekers
        </div>

        {/* Headline */}
        <h1
          data-hero-h1
          className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[84px] font-black leading-[1.03] tracking-[-0.03em] mb-6 max-w-5xl"
        >
          <span className="text-white">Stop losing track</span>
          <br />
          <span className="text-shimmer">of opportunities.</span>
        </h1>

        {/* Sub */}
        <p
          data-hero-sub
          className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10"
        >
          JobTrack is the command center for your job search.{" "}
          <span className="text-slate-500">
            Log applications, track timelines, manage statuses
          </span>{" "}
          — everything in one beautifully organized dashboard.
        </p>

        {/* CTAs */}
        <div
          data-hero-ctas
          className="flex flex-col sm:flex-row items-center gap-3 mb-20"
        >
          <Link
            href="/get-started"
            className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-[15px] hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-900/40 overflow-hidden beam-line"
          >
            Start Tracking Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-[#1e2d45] text-slate-400 font-medium text-[15px] hover:border-[#2a3d5a] hover:text-white transition-all duration-200"
          >
            See Features
          </a>
        </div>

        {/* Mockup */}
        <div className="relative w-full max-w-4xl">
          <div className="absolute -inset-6 rounded-3xl bg-blue-600/8 blur-3xl pointer-events-none" />

          <div
            ref={mockupRef}
            className="relative rounded-2xl border border-[#1e2d45] bg-[#0a0d18] shadow-2xl shadow-black/70 overflow-hidden"
          >
            {/* Browser bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2d45] bg-[#080b12]">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <div className="h-3 w-3 rounded-full bg-[#28c840]" />
              </div>
              <div className="flex-1 h-5 rounded-md bg-[#111827] border border-[#1e2d45] flex items-center px-2 gap-1.5">
                <Shield className="h-2.5 w-2.5 text-slate-600" />
                <span className="text-[10px] text-slate-600">
                  jobtrack.app/dashboard
                </span>
              </div>
            </div>

            {/* App header */}
            <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1a2235]/60 bg-[#080b12]">
              <div className="h-8 w-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <Briefcase className="h-3.5 w-3.5 text-blue-400" />
              </div>
              <span className="text-sm font-bold text-white">JobTrack</span>
              <div className="flex gap-2 ml-2">
                {[
                  {
                    label: "3 Accepted",
                    cls: "text-emerald-400 bg-emerald-400/10 border-emerald-500/20",
                  },
                  {
                    label: "8 Pending",
                    cls: "text-amber-400 bg-amber-400/10 border-amber-500/20",
                  },
                  {
                    label: "2 Attention",
                    cls: "text-orange-400 bg-orange-400/10 border-orange-500/20",
                  },
                ].map((b) => (
                  <span
                    key={b.label}
                    className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${b.cls}`}
                  >
                    {b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-4 px-4 py-2 border-b border-[#1a2235]/60 bg-[#0a0d18]">
              {["Status", "Company", "Role", "Applied"].map((h) => (
                <span
                  key={h}
                  className="text-[9px] font-semibold uppercase tracking-widest text-slate-600"
                >
                  {h}
                </span>
              ))}
            </div>

            {/* Rows */}
            {MOCK_APPS.map((app) => (
              <div
                key={app.company}
                data-mock-row
                className="grid grid-cols-4 px-4 py-2.5 border-b border-[#1a2035]/40 hover:bg-[#111827]/50 transition-colors"
              >
                <span
                  className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded border w-fit ${app.badge}`}
                >
                  <span className={`h-1 w-1 rounded-full ${app.dot}`} />
                  {app.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className="h-4 w-4 rounded bg-[#1e2540] border border-[#2a3357] flex items-center justify-center">
                    <Building2 className="h-2 w-2 text-slate-500" />
                  </div>
                  <span className="text-[11px] text-slate-200 font-medium">
                    {app.company}
                  </span>
                </div>
                <span className="text-[11px] text-slate-500">{app.role}</span>
                <span className="text-[11px] text-slate-600">{app.date}</span>
              </div>
            ))}
          </div>

          {/* Floating card — offer */}
          <div
            ref={floatCard1Ref}
            className="hidden md:block absolute -right-14 top-10 w-52 rounded-xl border border-[#1e2d45] bg-[#0f1428]/95 backdrop-blur-sm p-3.5 shadow-2xl"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <span className="text-sm font-semibold text-slate-200">
                Offer Received!
              </span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Stripe sent an offer for Senior Engineer. Timeline updated.
            </p>
            <div className="mt-2 text-[10px] text-slate-600">2 minutes ago</div>
          </div>

          {/* Floating card — stats */}
          <div
            ref={floatCard2Ref}
            className="hidden md:block absolute -left-12 bottom-14 w-44 rounded-xl border border-[#1e2d45] bg-[#0f1428]/95 backdrop-blur-sm p-3 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold text-slate-500">
                Applications
              </span>
              <TrendingUp className="h-3 w-3 text-emerald-400" />
            </div>
            <div className="text-2xl font-display font-black text-white">
              24
            </div>
            <div className="text-[10px] text-emerald-400 mt-0.5">
              ↑ 6 this week
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
