import Link from "next/link";
import { Briefcase } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#1a2235] px-6 md:px-12 py-8 max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Briefcase className="h-4 w-4 text-blue-400" />
        <span className="text-sm font-semibold text-slate-400">JobTrack</span>
      </div>
      <p className="text-sm text-slate-600 text-center">
        Built to help you land your next role. Good luck out there.
      </p>
      <Link
        href="/get-started"
        className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
      >
        Sign In →
      </Link>
    </footer>
  );
}
