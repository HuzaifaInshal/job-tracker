"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import {
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Filter,
  Zap,
  Loader2
} from "lucide-react";

const PERKS = [
  {
    icon: <Filter className="h-4 w-4" />,
    text: "Filter & search all your applications instantly"
  },
  {
    icon: <Clock className="h-4 w-4" />,
    text: "Full timeline for every application stage"
  },
  {
    icon: <Zap className="h-4 w-4" />,
    text: "One-click status updates with auto-logging"
  },
  {
    icon: <CheckCircle2 className="h-4 w-4" />,
    text: "Multi-channel tracking across all job boards"
  }
];

export function LoginPage() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn() {
    setLoading(true);
    setError("");
    try {
      await signInWithGoogle();
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080b12] flex overflow-hidden">
      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col w-[55%] relative overflow-hidden bg-[#070a10] border-r border-[#1a2235]">
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
              backgroundSize: "56px 56px"
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 mb-auto">
            <div className="h-8 w-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
              <Briefcase className="h-4 w-4 text-blue-400" />
            </div>
            <span className="font-display font-700 text-lg tracking-tight text-white">
              JobTrack
            </span>
          </Link>

          {/* Main copy */}
          <div className="py-12">
            <h2 className="font-display text-4xl xl:text-5xl font-800 tracking-[-0.025em] text-white leading-[1.1] mb-5">
              Your job search,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                finally organised.
              </span>
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-10 max-w-sm">
              Stop juggling spreadsheets. JobTrack gives you a single, powerful
              dashboard for every application in your pipeline.
            </p>

            {/* Perks */}
            <div className="space-y-3.5">
              {PERKS.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="h-9 w-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                    {p.icon}
                  </div>
                  <span className="text-base text-gray-600">{p.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini app preview */}
          <div className="mt-auto">
            <div className="rounded-xl border border-[#1e2d45] bg-[#0a0d18] overflow-hidden shadow-2xl">
              {/* Bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#1a2235] bg-[#080b12]">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#1e2d45]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#1e2d45]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#1e2d45]" />
                </div>
                <div className="text-[10px] text-slate-600 ml-2">
                  jobtrack.app/dashboard
                </div>
              </div>
              {/* Rows */}
              {[
                {
                  co: "Stripe",
                  role: "Sr. Engineer",
                  s: "Accepted",
                  sc: "text-emerald-400",
                  dot: "bg-emerald-400"
                },
                {
                  co: "Figma",
                  role: "Product Designer",
                  s: "Pending",
                  sc: "text-amber-400",
                  dot: "bg-amber-400"
                },
                {
                  co: "Vercel",
                  role: "DevRel",
                  s: "Accepted",
                  sc: "text-emerald-400",
                  dot: "bg-emerald-400"
                }
              ].map((r) => (
                <div
                  key={r.co}
                  className="flex items-center gap-4 px-4 py-2.5 border-b border-[#1a2235]/40 last:border-0"
                >
                  <span
                    className={`flex items-center gap-1 text-[10px] font-medium ${r.sc} w-20 shrink-0`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
                    {r.s}
                  </span>
                  <span className="text-[11px] font-medium text-slate-200 w-16">
                    {r.co}
                  </span>
                  <span className="text-[11px] text-slate-500">{r.role}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600 text-center mt-3">
              Your dashboard awaits
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel (sign-in) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Ambient */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-600/4 blur-3xl" />
        </div>

        {/* Back link */}
        <Link
          href="/"
          className="lg:hidden absolute top-6 left-6 flex items-center gap-1.5 text-base text-gray-600 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back
        </Link>

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="h-8 w-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-white">
            JobTrack
          </span>
        </div>

        <div className="relative z-10 w-full max-w-sm">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-800 text-white tracking-tight mb-2">
              Welcome back.
            </h1>
            <p className="text-gray-600 text-base">
              Sign in to your dashboard and take control of your job search.
            </p>
          </div>

          {/* Card */}
          <div className="gradient-border rounded-2xl p-6 shadow-2xl shadow-black/60">
            <p className="text-sm text-slate-500 uppercase tracking-widest font-semibold mb-5 text-center">
              Continue with
            </p>

            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-full group relative flex items-center gap-4 h-13 px-5 py-3.5 rounded-xl border border-[#2a3357] bg-[#111827]
                text-slate-200 font-medium text-base
                hover:bg-[#1a2540] hover:border-blue-500/30 hover:text-white
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 shadow-sm shadow-black/20
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50
                overflow-hidden beam-line"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin text-gray-600 shrink-0" />
              ) : (
                <GoogleIcon />
              )}
              <span className="flex-1 text-center">
                {loading ? "Signing in…" : "Sign in with Google"}
              </span>
            </button>

            {error && (
              <p className="mt-4 text-center text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-[#1e2d45]" />
              <span className="text-sm text-slate-600">
                Secured by Firebase Auth
              </span>
              <div className="flex-1 h-px bg-[#1e2d45]" />
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 space-y-3">
            {[
              "No password required",
              "Your data is private and secure",
              "Free, forever"
            ].map((note) => (
              <div key={note} className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="text-sm text-slate-500">{note}</span>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-slate-700 mt-8">
            By signing in, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      className="h-5 w-5 shrink-0"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
