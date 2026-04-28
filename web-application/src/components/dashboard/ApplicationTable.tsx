"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ApplicationSheet } from "./ApplicationSheet";
import { AddApplicationModal } from "./AddApplicationModal";
import { BulkAddModal } from "./BulkAddModal";
import { StatusBadge } from "@/components/ui/badge";
import { Tooltip } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  STATUS_LABELS,
  CHANNEL_LABELS,
  APPLY_TYPE_LABELS,
  type Application,
  type ApplicationStatus,
  type ApplicationChannel,
  type ApplyType
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { bulkMarkExpired, bulkSetArchived } from "@/lib/firestore";
import { useToast } from "@/components/ui/toast";
import { Loader2 } from "lucide-react";
import {
  Search,
  Plus,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Building2,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Layers,
  Archive,
  ArchiveRestore,
  ChevronDown
} from "lucide-react";

type SortField = "appliedAt" | "companyName" | "status" | "jobTitle";
type SortDir = "asc" | "desc";
const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
type PageSize = (typeof PAGE_SIZE_OPTIONS)[number];

interface Props {
  applications: Application[];
  loading: boolean;
  userId: string;
  isArchived?: boolean;
}

export function ApplicationTable({ applications, loading, userId, isArchived = false }: Props) {
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all"
  );
  const [channelFilter, setChannelFilter] = useState<
    ApplicationChannel | "all"
  >("all");
  const [applyTypeFilter, setApplyTypeFilter] = useState<ApplyType | "all">(
    "all"
  );
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [sortField, setSortField] = useState<SortField>("appliedAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSize>(10);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAddOpen, setBulkAddOpen] = useState(false);
  const [bulkAddMode, setBulkAddMode] = useState<"full" | "quick">("full");
  const [bulkDropdownOpen, setBulkDropdownOpen] = useState(false);
  const bulkDropdownRef = useRef<HTMLDivElement>(null);
  const [markingExpired, setMarkingExpired] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bulkDropdownRef.current && !bulkDropdownRef.current.contains(e.target as Node)) {
        setBulkDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function openApp(app: Application) {
    setSelectedApp(app);
    setSheetOpen(true);
  }

  function toggleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setChannelFilter("all");
    setApplyTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    setSelected(new Set());
  }

  const hasFilters =
    search ||
    statusFilter !== "all" ||
    channelFilter !== "all" ||
    applyTypeFilter !== "all" ||
    dateFrom ||
    dateTo;

  const filtered = useMemo(() => {
    let items = [...applications];
    const q = search.toLowerCase();
    if (q)
      items = items.filter(
        (a) =>
          a.companyName.toLowerCase().includes(q) ||
          a.jobTitle.toLowerCase().includes(q) ||
          a.hrCompanyName?.toLowerCase().includes(q) ||
          a.channelOther?.toLowerCase().includes(q) ||
          a.contactLink?.toLowerCase().includes(q)
      );
    if (statusFilter !== "all")
      items = items.filter((a) => a.status === statusFilter);
    if (channelFilter !== "all")
      items = items.filter((a) => a.channel === channelFilter);
    if (applyTypeFilter !== "all")
      items = items.filter((a) => a.applyType === applyTypeFilter);
    if (dateFrom)
      items = items.filter((a) => a.appliedAt >= new Date(dateFrom));
    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59);
      items = items.filter((a) => a.appliedAt <= to);
    }
    items.sort((a, b) => {
      let cmp = 0;
      if (sortField === "appliedAt")
        cmp = a.appliedAt.getTime() - b.appliedAt.getTime();
      else if (sortField === "companyName")
        cmp = a.companyName.localeCompare(b.companyName);
      else if (sortField === "jobTitle")
        cmp = a.jobTitle.localeCompare(b.jobTitle);
      else cmp = a.status.localeCompare(b.status);
      return sortDir === "asc" ? cmp : -cmp;
    });
    return items;
  }, [
    applications,
    search,
    statusFilter,
    channelFilter,
    applyTypeFilter,
    dateFrom,
    dateTo,
    sortField,
    sortDir
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const allPageSelected =
    paginated.length > 0 && paginated.every((a) => selected.has(a.id));

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (allPageSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((a) => next.delete(a.id));
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = new Set(prev);
        paginated.forEach((a) => next.add(a.id));
        return next;
      });
    }
  }

  async function handleBulkArchive(archive: boolean) {
    setArchiving(true);
    try {
      await bulkSetArchived(Array.from(selected), archive);
      toast(
        `${selected.size} application${selected.size > 1 ? "s" : ""} ${archive ? "archived" : "unarchived"}.`
      );
      setSelected(new Set());
    } catch {
      toast("Failed to update some applications.", "error");
    } finally {
      setArchiving(false);
    }
  }

  async function handleBulkExpire() {
    setMarkingExpired(true);
    try {
      await bulkMarkExpired(Array.from(selected));
      toast(
        `${selected.size} application${selected.size > 1 ? "s" : ""} marked as expired.`
      );
      setSelected(new Set());
    } catch {
      toast("Failed to update some applications.", "error");
    } finally {
      setMarkingExpired(false);
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field)
      return (
        <ArrowUpDown className="h-3 w-3 text-gray-600 dark:text-slate-600 ml-1" />
      );
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3 text-blue-500 ml-1" />
    ) : (
      <ArrowDown className="h-3 w-3 text-blue-500 ml-1" />
    );
  }

  return (
    <div className="flex flex-col h-full max-h-[85dvh] container mx-auto my-10 pt-3 border border-gray-200 dark:border-[#1e2d45] bg-white/90 dark:bg-black shadow rounded-lg">
      {/* Toolbar */}
      <div className="px-6 py-4 border-b space-y-3 border-slate-200 dark:border-[#1e2d45]">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[180px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
            <Input
              placeholder="Search company, role…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v as ApplicationStatus | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 h-11">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map((s) => (
                <SelectItem key={s} value={s}>
                  {STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={channelFilter}
            onValueChange={(v) => {
              setChannelFilter(v as ApplicationChannel | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 h-11">
              <SelectValue placeholder="Channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="indeed">Indeed</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={applyTypeFilter}
            onValueChange={(v) => {
              setApplyTypeFilter(v as ApplyType | "all");
              setPage(1);
            }}
          >
            <SelectTrigger className="w-40 h-11">
              <SelectValue placeholder="Apply Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="direct">Direct Apply</SelectItem>
              <SelectItem value="external">External</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              <X className="h-3.5 w-3.5" /> Clear
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2">
            {!isArchived && (
              <div className="relative" ref={bulkDropdownRef}>
                <div className="flex items-center">
                  <Button
                    variant="secondary"
                    className="rounded-r-none border-r-0"
                    onClick={() => { setBulkAddMode("full"); setBulkAddOpen(true); }}
                  >
                    <Layers className="h-4 w-4" /> Bulk Add
                  </Button>
                  <Button
                    variant="secondary"
                    className="rounded-l-none px-2"
                    onClick={() => setBulkDropdownOpen((o) => !o)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
                {bulkDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 z-20 min-w-[180px] rounded-xl border shadow-lg border-slate-200 bg-white dark:border-[#2a3357] dark:bg-[#111827]">
                    <button
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#1e2540] rounded-t-xl"
                      onClick={() => { setBulkAddMode("full"); setBulkAddOpen(true); setBulkDropdownOpen(false); }}
                    >
                      <span className="font-medium">Full Bulk Add</span>
                      <p className="text-gray-500 text-xs mt-0.5">All fields per entry</p>
                    </button>
                    <button
                      className="w-full text-left px-3 py-2.5 text-sm hover:bg-slate-50 dark:hover:bg-[#1e2540] rounded-b-xl border-t border-slate-100 dark:border-[#1e2d45]"
                      onClick={() => { setBulkAddMode("quick"); setBulkAddOpen(true); setBulkDropdownOpen(false); }}
                    >
                      <span className="font-medium">Quick Bulk Add</span>
                      <p className="text-gray-500 text-xs mt-0.5">Company & title only</p>
                    </button>
                  </div>
                )}
              </div>
            )}
            {!isArchived && (
              <Button variant="primary" onClick={() => setAddOpen(true)}>
                <Plus className="h-4 w-4" /> Add Application
              </Button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SlidersHorizontal className="h-4 w-4 text-gray-600 shrink-0" />
          <span className="text-sm text-gray-600">Date range:</span>
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setPage(1);
            }}
            className="w-40 h-11 text-base [color-scheme:light] dark:[color-scheme:dark]"
          />
          <span className="text-sm text-gray-600">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setPage(1);
            }}
            className="w-40 h-11 text-base [color-scheme:light] dark:[color-scheme:dark]"
          />
          <span className="ml-auto text-sm text-gray-600">
            {filtered.length} application{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="mx-6 mt-3 flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-950/30 dark:border-blue-500/30">
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            {selected.size} selected
          </span>
          {!isArchived && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleBulkExpire}
              disabled={markingExpired || archiving}
            >
              {markingExpired ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Clock className="h-3.5 w-3.5" />
              )}
              Mark as Expired
            </Button>
          )}
          <Button
            size="sm"
            variant="secondary"
            onClick={() => handleBulkArchive(!isArchived)}
            disabled={archiving || markingExpired}
          >
            {archiving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : isArchived ? (
              <ArchiveRestore className="h-3.5 w-3.5" />
            ) : (
              <Archive className="h-3.5 w-3.5" />
            )}
            {isArchived ? "Unarchive" : "Archive"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setSelected(new Set())}
          >
            <X className="h-3.5 w-3.5" /> Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-6 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-lg animate-pulse bg-slate-100 dark:bg-[#111827]"
                style={{ opacity: 1 - i * 0.12 }}
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            hasFilters={!!hasFilters}
            onAdd={() => setAddOpen(true)}
            onClear={clearFilters}
          />
        ) : (
          <table className="w-full min-w-[1400px]">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-[#1e2d45] dark:bg-[#0b0e1a]">
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                  />
                </th>
                <Th onClick={() => toggleSort("status")}>
                  Status <SortIcon field="status" />
                </Th>
                <Th onClick={() => toggleSort("companyName")}>
                  Company <SortIcon field="companyName" />
                </Th>
                <Th onClick={() => toggleSort("jobTitle")}>
                  Job Title <SortIcon field="jobTitle" />
                </Th>
                <Th>Channel</Th>
                <Th>Apply Type</Th>
                <Th onClick={() => toggleSort("appliedAt")}>
                  Applied <SortIcon field="appliedAt" />
                </Th>
                <Th>Contact</Th>
                <Th>Posted By</Th>
                <Th>HR / Company</Th>
                <Th>HR Link</Th>
                <Th>Social Post</Th>
                <Th>Notes</Th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => openApp(app)}
                  className={`border-b cursor-pointer group transition-colors duration-100 border-slate-100 dark:border-[#1a2035]/60 ${
                    selected.has(app.id)
                      ? "bg-blue-100/80 dark:bg-blue-950/30"
                      : app.status === "need_immediate_attention"
                        ? "bg-orange-50/70 hover:bg-orange-100/80 dark:bg-orange-950/20 dark:hover:bg-orange-950/40"
                        : app.status === "rejected"
                          ? "bg-red-50/80 hover:bg-red-100/80 dark:bg-red-950/20 dark:hover:bg-red-950/40"
                          : app.status === "accepted"
                            ? "bg-blue-50/70 hover:bg-blue-100/80 dark:bg-blue-950/20 dark:hover:bg-blue-950/40"
                            : app.status === "disputed"
                              ? "bg-purple-50/70 hover:bg-purple-100/80 dark:bg-purple-950/20 dark:hover:bg-purple-950/40"
                              : app.status === "responded"
                                ? "bg-cyan-50/70 hover:bg-cyan-100/80 dark:bg-cyan-950/20 dark:hover:bg-cyan-950/40"
                                : "hover:bg-slate-50/80 dark:hover:bg-[#111827]"
                  }`}
                >
                  <td
                    className="w-10 px-4 py-3.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(app.id)}
                      onChange={() => toggleSelect(app.id)}
                      className="h-4 w-4 rounded border-slate-300 accent-blue-600 cursor-pointer"
                    />
                  </td>
                  <Td>
                    <StatusBadge status={app.status} />
                  </Td>
                  <Td>
                    <Tooltip
                      content={app.companyName}
                      copyText={app.companyName}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-slate-100 border border-slate-200 dark:bg-[#1e2540] dark:border-[#2a3357]">
                          <Building2 className="h-3.5 w-3.5 text-gray-600" />
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                          {app.companyName}
                        </span>
                      </div>
                    </Tooltip>
                  </Td>
                  <Td>
                    <Tooltip content={app.jobTitle} copyText={app.jobTitle}>
                      <span className="text-slate-600 dark:text-gray-400 truncate max-w-[160px] block">
                        {app.jobTitle}
                      </span>
                    </Tooltip>
                  </Td>
                  <Td>
                    {(() => {
                      const label =
                        app.channel === "other" && app.channelOther
                          ? app.channelOther
                          : CHANNEL_LABELS[app.channel];
                      return (
                        <Tooltip content={label} copyText={label}>
                          <span className="text-sm font-medium rounded px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 dark:bg-[#1e2540] dark:text-gray-400 dark:border-[#2a3357] whitespace-nowrap">
                            {label}
                          </span>
                        </Tooltip>
                      );
                    })()}
                  </Td>
                  <Td>
                    {(() => {
                      const label =
                        app.applyType === "other" && app.applyTypeOther
                          ? app.applyTypeOther
                          : APPLY_TYPE_LABELS[app.applyType];
                      return (
                        <Tooltip content={label} copyText={label}>
                          <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {label}
                          </span>
                        </Tooltip>
                      );
                    })()}
                  </Td>
                  <Td>
                    <Tooltip
                      content={formatDate(app.appliedAt)}
                      copyText={formatDate(app.appliedAt)}
                    >
                      <span className="text-gray-600 dark:text-slate-400 whitespace-nowrap">
                        {formatDate(app.appliedAt)}
                      </span>
                    </Tooltip>
                  </Td>
                  <Td>
                    {app.contactLink ? (
                      <Tooltip
                        content={app.contactLink}
                        copyText={app.contactLink}
                      >
                        <a
                          href={
                            app.contactLink.startsWith("http") ||
                            app.contactLink.startsWith("mailto")
                              ? app.contactLink
                              : `https://${app.contactLink}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[120px] block"
                        >
                          {app.contactLink}
                        </a>
                      </Tooltip>
                    ) : (
                      <Dash />
                    )}
                  </Td>
                  <Td>
                    {(() => {
                      const label =
                        app.postedBy === "hr"
                          ? "HR / Recruiter"
                          : app.postedBy === "company"
                            ? "Company"
                            : null;
                      return label ? (
                        <Tooltip content={label} copyText={label}>
                          <span className="whitespace-nowrap text-slate-500 dark:text-slate-400">
                            {label}
                          </span>
                        </Tooltip>
                      ) : (
                        <Dash />
                      );
                    })()}
                  </Td>
                  <Td>
                    {app.hrCompanyName ? (
                      <Tooltip
                        content={app.hrCompanyName}
                        copyText={app.hrCompanyName}
                      >
                        <span className="truncate max-w-[120px] block text-slate-500 dark:text-slate-400">
                          {app.hrCompanyName}
                        </span>
                      </Tooltip>
                    ) : (
                      <Dash />
                    )}
                  </Td>
                  <Td>
                    {app.hrCompanyLink ? (
                      <Tooltip
                        content={app.hrCompanyLink}
                        copyText={app.hrCompanyLink}
                      >
                        <a
                          href={
                            app.hrCompanyLink.startsWith("http")
                              ? app.hrCompanyLink
                              : `https://${app.hrCompanyLink}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[120px] block"
                        >
                          {app.hrCompanyLink}
                        </a>
                      </Tooltip>
                    ) : (
                      <Dash />
                    )}
                  </Td>
                  <Td>
                    {app.socialPostLink ? (
                      <Tooltip
                        content={app.socialPostLink}
                        copyText={app.socialPostLink}
                      >
                        <a
                          href={
                            app.socialPostLink.startsWith("http")
                              ? app.socialPostLink
                              : `https://${app.socialPostLink}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-blue-600 dark:text-blue-400 hover:underline truncate max-w-[120px] block"
                        >
                          {app.socialPostLink}
                        </a>
                      </Tooltip>
                    ) : (
                      <Dash />
                    )}
                  </Td>
                  <Td>
                    {app.extraNotes ? (
                      <Tooltip
                        content={app.extraNotes}
                        copyText={app.extraNotes}
                      >
                        <span className="truncate max-w-[150px] block text-slate-500 dark:text-slate-400">
                          {app.extraNotes}
                        </span>
                      </Tooltip>
                    ) : (
                      <Dash />
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 dark:border-[#1e2d45]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v) as PageSize);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-20 h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">
              {(page - 1) * pageSize + 1}–
              {Math.min(page * pageSize, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <BulkAddModal
        open={bulkAddOpen}
        onClose={() => setBulkAddOpen(false)}
        userId={userId}
        mode={bulkAddMode}
      />
      <ApplicationSheet
        application={selectedApp}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onDeleted={() => setSelectedApp(null)}
      />
      <AddApplicationModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        userId={userId}
      />
    </div>
  );
}

function Dash() {
  return <span className="text-slate-300 dark:text-slate-600">—</span>;
}

function Th({
  children,
  className,
  onClick
}: {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <th
      onClick={onClick}
      className={`text-left px-4 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-600 dark:text-slate-500 ${onClick ? "cursor-pointer hover:text-slate-600 dark:hover:text-gray-600 select-none" : ""} ${className ?? ""}`}
    >
      <span className="flex items-center">{children}</span>
    </th>
  );
}

function Td({
  children,
  className
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={`px-4 py-3.5 text-base ${className ?? ""}`}>{children}</td>
  );
}

function EmptyState({
  hasFilters,
  onAdd,
  onClear
}: {
  hasFilters: boolean;
  onAdd: () => void;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4 bg-slate-100 border border-slate-200 dark:bg-[#111827] dark:border-[#1e2d45]">
        <Briefcase className="h-9 w-9 text-gray-600 dark:text-slate-600" />
      </div>
      {hasFilters ? (
        <>
          <p className="text-slate-700 font-medium dark:text-gray-600">
            No applications match your filters
          </p>
          <p className="text-gray-600 text-base mt-1">
            Try adjusting or clearing your filters.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClear}
            className="mt-4"
          >
            <X className="h-3.5 w-3.5" /> Clear Filters
          </Button>
        </>
      ) : (
        <>
          <p className="text-slate-700 font-medium dark:text-gray-600">
            No applications yet
          </p>
          <p className="text-gray-600 text-base mt-1">
            Start tracking your job search by adding your first application.
          </p>
          <Button variant="primary" onClick={onAdd} className="mt-4">
            <Plus className="h-4 w-4" /> Add First Application
          </Button>
        </>
      )}
    </div>
  );
}
