"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function CtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        scale: 0.94,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
        },
      });

      gsap.from("[data-cta-content] > *", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-12 py-16 pb-28"
    >
      <div ref={cardRef} className="relative rounded-3xl overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/12 to-violet-600/8" />
        <div className="absolute inset-0 border border-blue-500/20 rounded-3xl" />
        <div className="absolute inset-0 bg-grid opacity-40" />

        {/* Top edge glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent" />

        {/* Corner orbs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-violet-600/8 blur-3xl pointer-events-none" />

        <div
          data-cta-content
          className="relative px-10 py-16 md:py-24 text-center flex flex-col items-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/25 bg-blue-500/10 text-sm font-medium text-blue-400 mb-6">
            <Star className="h-3 w-3" />
            Free forever. No credit card required.
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-black tracking-tight text-white mb-5 max-w-2xl leading-tight">
            Your next job starts with
            <span className="text-shimmer"> better tracking.</span>
          </h2>

          <p className="text-slate-400 text-lg mb-10 max-w-xl">
            Join job seekers who stay organised, follow up on time, and close
            more offers.
          </p>

          <Link
            href="/get-started"
            className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-[15px] hover:bg-slate-100 transition-all duration-200 shadow-xl shadow-black/30"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
