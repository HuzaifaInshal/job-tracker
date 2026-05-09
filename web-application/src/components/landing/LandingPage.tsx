"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Zap,
  Globe2,
  Shield,
  BarChart3,
  ChevronRight,
  Star,
  Calendar,
  Layers
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const FEATURES = [
  {
    icon: <Filter className="h-5 w-5" />,
    title: "Advanced Filtering",
    desc: "Filter by status, channel, apply type, and date range simultaneously.",
    color: "from-blue-500/20 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/10",
    lightColor: "from-blue-50 to-indigo-50",
    border: "border-blue-500/20 dark:border-blue-500/20",
    lightBorder: "border-blue-200",
    glow: "bg-blue-500"
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: "Timeline per Application",
    desc: "Add timeline entries for every stage — interviews, calls, offers, rejections — with auto-generated status change logs.",
    color: "from-violet-500/20 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/10",
    lightColor: "from-violet-50 to-purple-50",
    border: "border-violet-500/20 dark:border-violet-500/20",
    lightBorder: "border-violet-200",
    glow: "bg-violet-500"
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Status Management",
    desc: "Track applications across 6 statuses: Pending, Accepted, Rejected, Needs Attention, Expired, Disputed.",
    color: "from-amber-500/20 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/10",
    lightColor: "from-amber-50 to-orange-50",
    border: "border-amber-500/20 dark:border-amber-500/20",
    lightBorder: "border-amber-200",
    glow: "bg-amber-500"
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: "Application Tracking",
    desc: "Log every job application with company, role, channel, apply type, date, links, and notes.",
    color: "from-cyan-500/20 to-teal-500/10 dark:from-cyan-500/20 dark:to-teal-500/10",
    lightColor: "from-cyan-50 to-teal-50",
    border: "border-cyan-500/20 dark:border-cyan-500/20",
    lightBorder: "border-cyan-200",
    glow: "bg-cyan-500"
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: "Bulk Operations",
    desc: "Select multiple applications and mark them as expired in one click, or bulk add via a collapsible accordion form.",
    color: "from-emerald-500/20 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/10",
    lightColor: "from-emerald-50 to-green-50",
    border: "border-emerald-500/20 dark:border-emerald-500/20",
    lightBorder: "border-emerald-200",
    glow: "bg-emerald-500"
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: "Full Data Table",
    desc: "All 14 application fields visible as columns with tooltip previews, one-click copy, sorting, and pagination.",
    color: "from-rose-500/20 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/10",
    lightColor: "from-rose-50 to-pink-50",
    border: "border-rose-500/20 dark:border-rose-500/20",
    lightBorder: "border-rose-200",
    glow: "bg-rose-500"
  }
];

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#080b12] text-slate-800 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      {/* ── Ambient background (dark only) ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden dark:block hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px] animate-glow-pulse" />
        <div
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[100px] animate-glow-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] animate-glow-pulse"
          style={{ animationDelay: "3s" }}
        />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
            backgroundSize: "64px 64px"
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-4 sm:px-6 md:px-12 py-4 sm:py-5 max-w-9xl mx-auto border-b border-slate-200 dark:border-transparent bg-white/80 dark:bg-transparent backdrop-blur-sm dark:backdrop-blur-none sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-slate-900 dark:text-white">
            JobTrack
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/get-started"
            className="flex items-center gap-2 text-sm font-medium px-3 sm:px-4 py-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-white/5 dark:border-white/10 dark:text-gray-400 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200"
          >
            Sign In <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 md:px-12 pt-12 sm:pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm font-medium text-blue-600 dark:text-blue-400 mb-8 ${mounted ? "animate-fade-up-1" : "opacity-0"}`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse" />
            The command center for your job search
          </div>

          {/* Headline */}
          <h1
            className={`font-display text-4xl sm:text-5xl md:text-6xl lg:text-[82px] font-800 leading-[1.04] tracking-[-0.03em] mb-6 max-w-5xl ${mounted ? "animate-fade-up-2" : "opacity-0"}`}
          >
            <span className="text-slate-900 dark:text-white">Stop losing track</span>
            <br />
            <span className="text-shimmer">of opportunities.</span>
          </h1>

          {/* Sub */}
          <p
            className={`text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed mb-10 ${mounted ? "animate-fade-up-3" : "opacity-0"}`}
          >
            JobTrack is the command center for your job search.{" "}
            Log applications, track timelines, manage statuses
            {" "}— everything in one beautifully organized dashboard.
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-3 mb-12 sm:mb-16 ${mounted ? "animate-fade-up-4" : "opacity-0"}`}
          >
            <Link
              href="/get-started"
              className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-[15px] hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-900/30 dark:shadow-blue-900/40 overflow-hidden beam-line w-full sm:w-auto justify-center"
            >
              Start Tracking Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-slate-200 dark:border-[#1e2d45] text-slate-500 dark:text-slate-400 font-medium text-[15px] hover:border-slate-300 dark:hover:border-[#2a3d5a] hover:text-slate-700 dark:hover:text-white transition-all duration-200 w-full sm:w-auto justify-center"
            >
              See Features
            </a>
          </div>

          {/* Dashboard Screenshot */}
          <div
            className={`relative w-full max-w-5xl ${mounted ? "animate-fade-up-5" : "opacity-0"}`}
          >
            <div className="absolute -inset-4 rounded-3xl bg-blue-600/10 dark:bg-blue-600/10 blur-2xl" />
            <div className="relative rounded-2xl border border-slate-200 dark:border-[#1e2d45] shadow-2xl shadow-slate-200/60 dark:shadow-black/60 overflow-hidden animate-float">
              <Image
                src="/static/1.png"
                alt="JobTrack Dashboard"
                width={1920}
                height={943}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Screenshots ── */}
      <section className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-800 tracking-tight text-slate-900 dark:text-white mb-4">
            Every detail, at a glance.
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            From application details to full timelines — everything you need to stay on top of your search.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="rounded-2xl border border-slate-200 dark:border-[#1e2d45] overflow-hidden shadow-lg shadow-slate-100 dark:shadow-black/40">
            <Image
              src="/static/2.png"
              alt="Application Details & Timeline"
              width={1920}
              height={943}
              className="w-full h-auto"
            />
            <div className="px-4 py-3 bg-white dark:bg-[#0a0d18] border-t border-slate-100 dark:border-[#1a2235]">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Application Details & Timeline</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Full history of every touchpoint per application</p>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-[#1e2d45] overflow-hidden shadow-lg shadow-slate-100 dark:shadow-black/40">
            <Image
              src="/static/3.png"
              alt="Add / Edit Application"
              width={1920}
              height={943}
              className="w-full h-auto"
            />
            <div className="px-4 py-3 bg-white dark:bg-[#0a0d18] border-t border-slate-100 dark:border-[#1a2235]">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Add / Edit Application</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">All 14 fields in one clean, organized form</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section
        id="features"
        className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-24"
      >
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-800 tracking-tight text-slate-900 dark:text-white mb-4">
            Everything your job search needs.
            <br />
            <span className="text-slate-400 dark:text-slate-500">Nothing it doesn&apos;t.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            A focused toolset that keeps you organised from first click to final offer.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className={`group relative rounded-2xl border bg-gradient-to-br p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5
                ${f.lightBorder} ${f.lightColor}
                dark:${f.border} dark:${f.color}`}
            >
              <div
                className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${f.glow} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`}
              />
              <div
                className={`h-10 w-10 rounded-xl border bg-white/60 dark:bg-black/20 flex items-center justify-center mb-4 text-slate-600 dark:text-white ${f.lightBorder} dark:${f.border}`}
              >
                {f.icon}
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2">{f.title}</h3>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        <div className="rounded-3xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0a0d18] p-8 sm:p-10 md:p-16 relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-600/5 blur-3xl" />
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 text-center">
            {[
              { value: "100%", label: "Free to use", sub: "No paywalls, ever" },
              { value: "∞", label: "Applications", sub: "Track as many as you need" },
              { value: "1 min", label: "Setup time", sub: "Sign in and start immediately" }
            ].map((s) => (
              <div key={s.value}>
                <div className="font-display text-4xl sm:text-5xl md:text-6xl font-800 text-slate-900 dark:text-white mb-2 tracking-tight">
                  {s.value}
                </div>
                <div className="text-base font-semibold text-slate-600 dark:text-slate-400 mb-1">
                  {s.label}
                </div>
                <div className="text-sm sm:text-base text-slate-400 dark:text-slate-500">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-800 tracking-tight text-slate-900 dark:text-white mb-4">
            Up and running in seconds.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {[
            {
              step: "01",
              icon: <Shield className="h-5 w-5" />,
              title: "Sign in with Google",
              desc: "One click and your personal dashboard is ready. No forms, no passwords."
            },
            {
              step: "02",
              icon: <Briefcase className="h-5 w-5" />,
              title: "Add your first application",
              desc: "Company, role, channel, status — the full picture in one clean form."
            },
            {
              step: "03",
              icon: <Calendar className="h-5 w-5" />,
              title: "Build your timeline",
              desc: "Log every touchpoint — calls, emails, interviews — as they happen."
            }
          ].map((step) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-slate-200 dark:border-[#1e2d45] bg-white dark:bg-[#0a0d18] p-6 sm:p-7 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display text-3xl font-800 text-slate-200 dark:text-[#1e2d45]">
                  {step.step}
                </span>
                <div className="h-11 w-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  {step.icon}
                </div>
              </div>
              <h3 className="font-semibold text-slate-800 dark:text-white mb-2 text-lg">
                {step.title}
              </h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-9xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 pb-20 sm:pb-24">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-violet-600/10 dark:from-blue-600/20 dark:via-indigo-600/15 dark:to-violet-600/10 from-blue-50 via-indigo-50 to-violet-50" />
          <div className="absolute inset-0 border border-blue-200 dark:border-blue-500/20 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <div className="relative px-6 sm:px-10 py-14 sm:py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-sm font-medium text-blue-600 dark:text-blue-400 mb-6">
              <Star className="h-3 w-3" />
              Free forever. No credit card required.
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-800 tracking-tight text-slate-900 dark:text-white mb-5 max-w-2xl mx-auto leading-tight">
              Your next job starts with
              <span className="text-shimmer"> better tracking.</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg mb-10 max-w-xl mx-auto">
              Stay organised, follow up on time, and never lose track of an opportunity again.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-[15px] hover:bg-slate-700 dark:hover:bg-slate-100 transition-all duration-200 shadow-xl shadow-slate-900/20 dark:shadow-black/30"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-[#1a2235] px-4 sm:px-6 md:px-12 py-8 max-w-9xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-base font-semibold text-slate-600 dark:text-slate-400">
            JobTrack
          </span>
        </div>
        <p className="text-sm text-slate-400 dark:text-slate-600 text-center">
          Built to help you land your next role. Good luck out there.
        </p>
        <Link
          href="/get-started"
          className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 transition-colors"
        >
          Sign In →
        </Link>
      </footer>
    </div>
  );
}
