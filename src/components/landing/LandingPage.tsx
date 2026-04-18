'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, ArrowRight, CheckCircle2, Clock, Filter,
  Zap, Globe2, Shield, BarChart3, ChevronRight, Star,
  Building2, Calendar, TrendingUp,
} from 'lucide-react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

const MOCK_APPS = [
  { company: 'Stripe', role: 'Senior Engineer', status: 'accepted', dot: 'bg-emerald-400', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20', label: 'Accepted', delay: '0ms' },
  { company: 'Figma', role: 'Product Designer', status: 'pending', dot: 'bg-amber-400', badge: 'text-amber-400 bg-amber-400/10 border-amber-500/20', label: 'Pending', delay: '80ms' },
  { company: 'Notion', role: 'Full Stack Dev', status: 'attention', dot: 'bg-orange-400', badge: 'text-orange-400 bg-orange-400/10 border-orange-500/20', label: 'Needs Attention', delay: '160ms' },
  { company: 'Linear', role: 'Frontend Dev', status: 'pending', dot: 'bg-amber-400', badge: 'text-amber-400 bg-amber-400/10 border-amber-500/20', label: 'Pending', delay: '240ms' },
  { company: 'Vercel', role: 'DevRel Engineer', status: 'accepted', dot: 'bg-emerald-400', badge: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20', label: 'Accepted', delay: '320ms' },
];

const FEATURES = [
  {
    icon: <Filter className="h-5 w-5" />,
    title: 'Smart Filtering',
    desc: 'Slice through applications instantly. Filter by status, channel, date range, or search anything.',
    color: 'from-blue-500/20 to-indigo-500/10',
    border: 'border-blue-500/20',
    glow: 'bg-blue-500',
  },
  {
    icon: <Clock className="h-5 w-5" />,
    title: 'Timeline Tracking',
    desc: 'Every call, email, and interview logged. Build a full picture of each application journey.',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/20',
    glow: 'bg-violet-500',
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: 'Instant Status Updates',
    desc: 'Flip statuses in one click. Auto-generates timeline entries so nothing falls through the cracks.',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    glow: 'bg-amber-500',
  },
  {
    icon: <Globe2 className="h-5 w-5" />,
    title: 'Multi-Channel Support',
    desc: 'LinkedIn, Indeed, email, direct — track exactly how and where you applied, all in one place.',
    color: 'from-cyan-500/20 to-teal-500/10',
    border: 'border-cyan-500/20',
    glow: 'bg-cyan-500',
  },
  {
    icon: <BarChart3 className="h-5 w-5" />,
    title: 'Application Insights',
    desc: 'Live status bar at the top of every session. Know your pipeline health at a glance.',
    color: 'from-emerald-500/20 to-green-500/10',
    border: 'border-emerald-500/20',
    glow: 'bg-emerald-500',
  },
  {
    icon: <Shield className="h-5 w-5" />,
    title: 'Private by Default',
    desc: 'Your data belongs to you. Secured with Firebase rules so only you see your applications.',
    color: 'from-rose-500/20 to-pink-500/10',
    border: 'border-rose-500/20',
    glow: 'bg-rose-500',
  },
];

const MARQUEE_COMPANIES = [
  'Google', 'Apple', 'Meta', 'Amazon', 'Netflix', 'Stripe',
  'Figma', 'Linear', 'Vercel', 'Notion', 'Airbnb', 'Shopify',
  'Spotify', 'Uber', 'Lyft', 'Dropbox', 'Atlassian', 'GitHub',
];

export function LandingPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-[#080b12] text-slate-100 overflow-x-hidden">

      {/* ── Ambient background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/6 blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-violet-600/5 blur-[120px] animate-glow-pulse" style={{ animationDelay: '3s' }} />
        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(148,163,184,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,1) 1px, transparent 1px)`,
            backgroundSize: '64px 64px',
          }}
        />
        {/* Radial fade at center */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.05) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── Navbar ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center">
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-display font-700 text-lg tracking-tight text-white">JobTrack</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/get-started"
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
          >
            Sign In <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 md:pt-24 md:pb-12">
        <div className="flex flex-col items-center text-center">

          {/* Badge */}
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-xs font-medium text-blue-400 mb-8 ${mounted ? 'animate-fade-up-1' : 'opacity-0'}`}>
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            Built for serious job seekers
          </div>

          {/* Headline */}
          <h1 className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-[82px] font-800 leading-[1.04] tracking-[-0.03em] mb-6 max-w-5xl ${mounted ? 'animate-fade-up-2' : 'opacity-0'}`}>
            <span className="text-white">Stop losing track</span>
            <br />
            <span className="text-shimmer">of opportunities.</span>
          </h1>

          {/* Sub */}
          <p className={`text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10 ${mounted ? 'animate-fade-up-3' : 'opacity-0'}`}>
            JobTrack is the command center for your job search.{' '}
            <span className="text-slate-300">Log applications, track timelines, manage statuses</span>
            {' '}— everything in one beautifully organized dashboard.
          </p>

          {/* CTAs */}
          <div className={`flex flex-col sm:flex-row items-center gap-3 mb-16 ${mounted ? 'animate-fade-up-4' : 'opacity-0'}`}>
            <Link
              href="/get-started"
              className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-2xl bg-blue-600 text-white font-semibold text-[15px] hover:bg-blue-500 transition-all duration-200 shadow-lg shadow-blue-900/40 overflow-hidden beam-line"
            >
              Start Tracking Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl border border-[#1e2d45] text-slate-300 font-medium text-[15px] hover:border-[#2a3d5a] hover:text-white transition-all duration-200"
            >
              See Features
            </a>
          </div>

          {/* App Preview Mockup */}
          <div className={`relative w-full max-w-4xl ${mounted ? 'animate-fade-up-5' : 'opacity-0'}`}>
            {/* Glow behind mockup */}
            <div className="absolute -inset-4 rounded-3xl bg-blue-600/10 blur-2xl" />

            {/* Main card */}
            <div className="relative rounded-2xl border border-[#1e2d45] bg-[#0a0d18] shadow-2xl shadow-black/60 overflow-hidden animate-float">
              {/* Top bar */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-[#1e2d45] bg-[#080b12]">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-[#1e2d45]" />
                  <div className="h-3 w-3 rounded-full bg-[#1e2d45]" />
                  <div className="h-3 w-3 rounded-full bg-[#1e2d45]" />
                </div>
                <div className="flex-1 h-5 rounded-md bg-[#111827] border border-[#1e2d45] flex items-center px-2 gap-1.5">
                  <Shield className="h-2.5 w-2.5 text-slate-600" />
                  <span className="text-[10px] text-slate-600">jobtrack.app/dashboard</span>
                </div>
              </div>

              {/* Header mockup */}
              <div className="flex items-center gap-3 px-4 py-2.5 border-b border-[#1a2235]/60 bg-[#080b12]">
                <div className="flex items-center gap-1.5 h-7 w-7 rounded-lg bg-blue-600/10 border border-blue-500/20 justify-center shrink-0">
                  <Briefcase className="h-3 w-3 text-blue-400" />
                </div>
                <span className="text-xs font-bold text-white">JobTrack</span>
                <div className="flex gap-2 ml-2">
                  {[
                    { label: '3 Accepted', cls: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20' },
                    { label: '8 Pending', cls: 'text-amber-400 bg-amber-400/10 border-amber-500/20' },
                    { label: '2 Attention', cls: 'text-orange-400 bg-orange-400/10 border-orange-500/20' },
                  ].map((b) => (
                    <span key={b.label} className={`text-[9px] font-medium px-1.5 py-0.5 rounded border ${b.cls}`}>{b.label}</span>
                  ))}
                </div>
                <div className="ml-auto h-6 w-6 rounded-lg bg-[#1e2540] border border-[#2a3357]" />
              </div>

              {/* Table */}
              <div className="overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-4 gap-0 px-4 py-2 border-b border-[#1a2235]/60 bg-[#0a0d18]">
                  {['Status', 'Company', 'Role', 'Applied'].map((h) => (
                    <span key={h} className="text-[9px] font-semibold uppercase tracking-widest text-slate-600">{h}</span>
                  ))}
                </div>

                {/* Rows */}
                {MOCK_APPS.map((app, i) => (
                  <div
                    key={app.company}
                    className="grid grid-cols-4 gap-0 px-4 py-2.5 border-b border-[#1a2035]/40 hover:bg-[#111827]/50 transition-colors"
                    style={{ animationDelay: app.delay, opacity: mounted ? 1 : 0, animation: mounted ? `fade-up 0.5s ${app.delay} ease both` : 'none' }}
                  >
                    <span className={`inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.5 rounded border w-fit ${app.badge}`}>
                      <span className={`h-1 w-1 rounded-full ${app.dot}`} />
                      {app.label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-4 rounded bg-[#1e2540] border border-[#2a3357] flex items-center justify-center">
                        <Building2 className="h-2 w-2 text-slate-500" />
                      </div>
                      <span className="text-[11px] text-slate-200 font-medium">{app.company}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">{app.role}</span>
                    <span className="text-[11px] text-slate-500">
                      {['Jan 12', 'Jan 15', 'Jan 18', 'Jan 20', 'Jan 22'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating cards */}
            <div className="hidden md:block absolute -right-12 top-12 w-52 rounded-xl border border-[#1e2d45] bg-[#0f1428] p-3.5 shadow-xl animate-float-slow" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2 mb-2.5">
                <div className="h-6 w-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span className="text-xs font-semibold text-slate-200">Offer Received!</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">Stripe sent an offer for Senior Engineer. Timeline updated.</p>
              <div className="mt-2 text-[10px] text-slate-600">2 minutes ago</div>
            </div>

            <div className="hidden md:block absolute -left-10 bottom-16 w-44 rounded-xl border border-[#1e2d45] bg-[#0f1428] p-3 shadow-xl animate-float-slow" style={{ animationDelay: '2.5s' }}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold text-slate-300">Applications</span>
                <TrendingUp className="h-3 w-3 text-emerald-400" />
              </div>
              <div className="text-2xl font-display font-800 text-white">24</div>
              <div className="text-[10px] text-emerald-400">↑ 6 this week</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Marquee / Social proof ── */}
      <section className="relative z-10 py-12 overflow-hidden border-y border-[#1a2235]/60 bg-[#0a0d18]/50">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-600 mb-6">
          Track applications at companies like
        </p>
        <div className="flex gap-0 overflow-hidden">
          <div className="flex gap-12 animate-marquee whitespace-nowrap shrink-0">
            {[...MARQUEE_COMPANIES, ...MARQUEE_COMPANIES].map((c, i) => (
              <span key={i} className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-default">{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-24">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-800 tracking-tight text-white mb-4">
            Everything your job search needs.
            <br />
            <span className="text-slate-500">Nothing it doesn't.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            A focused toolset that keeps you organised from first click to final offer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group relative rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 overflow-hidden hover:border-opacity-60 transition-all duration-300 hover:-translate-y-0.5`}
            >
              {/* Glow on hover */}
              <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full ${f.glow} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
              <div className={`h-10 w-10 rounded-xl border ${f.border} bg-black/20 flex items-center justify-center mb-4 text-white`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="rounded-3xl border border-[#1e2d45] bg-[#0a0d18] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-indigo-600/5 blur-3xl" />
          </div>
          <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
            {[
              { value: '100%', label: 'Free to use', sub: 'No paywalls, ever' },
              { value: '∞', label: 'Applications', sub: 'Track as many as you need' },
              { value: '1 min', label: 'Setup time', sub: 'Sign in and start immediately' },
            ].map((s) => (
              <div key={s.value}>
                <div className="font-display text-5xl md:text-6xl font-800 text-white mb-2 tracking-tight">{s.value}</div>
                <div className="text-base font-semibold text-slate-300 mb-1">{s.label}</div>
                <div className="text-sm text-slate-500">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="text-center mb-14">
          <h2 className="font-display text-4xl md:text-5xl font-800 tracking-tight text-white mb-4">
            Up and running in seconds.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: '01', icon: <Shield className="h-5 w-5" />, title: 'Sign in with Google', desc: 'One click and your personal dashboard is ready. No forms, no passwords.' },
            { step: '02', icon: <Briefcase className="h-5 w-5" />, title: 'Add your first application', desc: 'Company, role, channel, status — the full picture in one clean form.' },
            { step: '03', icon: <Calendar className="h-5 w-5" />, title: 'Build your timeline', desc: 'Log every touchpoint — calls, emails, interviews — as they happen.' },
          ].map((step) => (
            <div key={step.step} className="relative rounded-2xl border border-[#1e2d45] bg-[#0a0d18] p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="font-display text-3xl font-800 text-[#1e2d45]">{step.step}</span>
                <div className="h-9 w-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  {step.icon}
                </div>
              </div>
              <h3 className="font-semibold text-white mb-2 text-lg">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-16 pb-24">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-violet-600/10" />
          <div className="absolute inset-0 border border-blue-500/20 rounded-3xl" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

          <div className="relative px-10 py-16 md:py-20 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 text-xs font-medium text-blue-400 mb-6">
              <Star className="h-3 w-3" />
              Free forever. No credit card required.
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-800 tracking-tight text-white mb-5 max-w-2xl mx-auto leading-tight">
              Your next job starts with
              <span className="text-shimmer"> better tracking.</span>
            </h2>
            <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
              Join job seekers who stay organised, follow up on time, and close more offers.
            </p>
            <Link
              href="/get-started"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-white text-slate-900 font-bold text-[15px] hover:bg-slate-100 transition-all duration-200 shadow-xl shadow-black/30"
            >
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-[#1a2235] px-6 md:px-12 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-400" />
          <span className="text-sm font-semibold text-slate-400">JobTrack</span>
        </div>
        <p className="text-xs text-slate-600 text-center">
          Built to help you land your next role. Good luck out there.
        </p>
        <Link href="/get-started" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
          Sign In →
        </Link>
      </footer>
    </div>
  );
}
