"use client";

import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Avatar from "@radix-ui/react-avatar";
import { Briefcase, LogOut, ChevronDown, Archive, BarChart2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Application, ApplicationStatus } from "@/lib/types";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/types";

interface Props {
  applications: Application[];
}

const SUMMARY_STATUSES: ApplicationStatus[] = [
  "need_immediate_attention",
  "responded"
];

export function DashboardHeader({ applications }: Props) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isArchived = pathname === "/dashboard/archived";
  const isAnalytics = pathname === "/dashboard/analytics";

  const counts = SUMMARY_STATUSES.reduce<Record<ApplicationStatus, number>>(
    (acc, s) => ({
      ...acc,
      [s]: applications.filter((a) => a.status === s).length
    }),
    {} as Record<ApplicationStatus, number>
  );

  const initials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
    : (user?.email?.[0]?.toUpperCase() ?? "?");

  return (
    <header className="border-b sticky top-0 z-30 backdrop-blur-sm border-slate-200 bg-white/90 dark:border-[#1e2d45] dark:bg-[#080b12]/95">
      <div className="flex items-center gap-4 px-6 h-14">
        {/* Brand */}
        <div className="flex items-center gap-2 mr-4">
          <div className="h-9 w-9 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <Briefcase className="h-3.5 w-3.5 text-blue-500 dark:text-blue-400" />
          </div>
          <span className="font-bold text-slate-800 text-base tracking-tight dark:text-slate-200">
            JobTrack
          </span>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-1 mr-3">
          <Link
            href="/dashboard"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !isArchived
                ? "bg-slate-100 text-slate-700 dark:bg-[#1e2540] dark:text-slate-200"
                : "text-slate-500 hover:bg-slate-100 dark:text-gray-600 dark:hover:bg-[#1a2035]"
            }`}
          >
            Applications
          </Link>
          <Link
            href="/dashboard/archived"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isArchived
                ? "bg-slate-100 text-slate-700 dark:bg-[#1e2540] dark:text-slate-200"
                : "text-slate-500 hover:bg-slate-100 dark:text-gray-600 dark:hover:bg-[#1a2035]"
            }`}
          >
            <Archive className="h-3.5 w-3.5" /> Archived
          </Link>
          <Link
            href="/dashboard/analytics"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isAnalytics
                ? "bg-slate-100 text-slate-700 dark:bg-[#1e2540] dark:text-slate-200"
                : "text-slate-500 hover:bg-slate-100 dark:text-gray-600 dark:hover:bg-[#1a2035]"
            }`}
          >
            <BarChart2 className="h-3.5 w-3.5" /> Analytics
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
          {applications.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium border shrink-0 border-slate-200 bg-slate-50 text-slate-500 dark:border-[#2a3357] dark:bg-[#111827] dark:text-gray-600">
              {applications.length} Total
            </div>
          )}
          {SUMMARY_STATUSES.map((s) => {
            const colors = STATUS_COLORS[s];
            const count = counts[s];
            if (count === 0) return null;
            return (
              <div
                key={s}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium border shrink-0 ${colors.bg} ${colors.text} ${colors.border}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                {count} {STATUS_LABELS[s]}
              </div>
            );
          })}
        </div>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="flex items-center gap-2 rounded-xl px-2.5 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-[#111827] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
              <Avatar.Root className="h-9 w-9 rounded-lg overflow-hidden border border-slate-200 dark:border-[#2a3357]">
                <Avatar.Image
                  src={user?.photoURL ?? undefined}
                  alt={user?.displayName ?? ""}
                  className="h-full w-full object-cover"
                />
                <Avatar.Fallback className="h-full w-full flex items-center justify-center bg-blue-100 text-blue-600 text-sm font-semibold dark:bg-blue-900/30 dark:text-blue-400">
                  {initials}
                </Avatar.Fallback>
              </Avatar.Root>
              <span className="text-base text-slate-600 max-w-[140px] truncate hidden sm:block dark:text-gray-600">
                {user?.displayName ?? user?.email}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-600" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="z-50 min-w-[180px] rounded-xl border p-1 shadow-xl border-slate-200 bg-white shadow-slate-200/50 dark:border-[#2a3357] dark:bg-[#111827] dark:shadow-black/40 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
            >
              <div className="px-2 py-1.5 mb-1 border-b border-slate-100 dark:border-[#1e2d45]">
                <p className="text-sm font-medium text-slate-700 truncate dark:text-gray-600">
                  {user?.displayName}
                </p>
                <p className="text-sm text-gray-600 truncate dark:text-slate-500">
                  {user?.email}
                </p>
              </div>
              <DropdownMenu.Item
                onClick={logout}
                className="flex items-center gap-2 px-2 py-2 text-base rounded-lg cursor-pointer transition-colors focus:outline-none text-slate-600 hover:bg-slate-50 hover:text-red-600 dark:text-gray-600 dark:hover:bg-[#1e2540] dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
