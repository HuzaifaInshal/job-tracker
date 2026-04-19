"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AddApplicationModal } from "./AddApplicationModal";
import { AddTimelineModal } from "./AddTimelineModal";
import { useTimelines } from "@/hooks/useTimelines";
import {
  updateApplicationStatus,
  deleteApplication,
  createAutoTimeline
} from "@/lib/firestore";
import { useToast } from "@/components/ui/toast";
import {
  STATUS_LABELS,
  CHANNEL_LABELS,
  APPLY_TYPE_LABELS,
  STATUS_COLORS,
  type Application,
  type ApplicationStatus
} from "@/lib/types";
import { formatDateTime, formatRelative } from "@/lib/utils";
import {
  Building2,
  Briefcase,
  Link2,
  Calendar,
  User2,
  Hash,
  ExternalLink,
  Plus,
  Trash2,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Pencil
} from "lucide-react";

interface Props {
  application: Application | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export function ApplicationSheet({
  application,
  open,
  onClose,
  onDeleted
}: Props) {
  const { toast } = useToast();
  const { timelines, loading: tlLoading } = useTimelines(
    application?.id ?? null
  );
  const [addingTimeline, setAddingTimeline] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [deletingApp, setDeletingApp] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ApplicationStatus | null>(null);
  const [statusNote, setStatusNote] = useState("");
  const [statusDate, setStatusDate] = useState("");

  function openStatusConfirm(status: ApplicationStatus) {
    setPendingStatus(status);
    setStatusDate(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setStatusNote("");
  }

  if (!application) return null;

  async function handleStatusChange(status: ApplicationStatus) {
    if (!application) return;
    setUpdatingStatus(true);
    setPendingStatus(null);
    const note = statusNote.trim();
    setStatusNote("");
    const receivedAt = statusDate ? new Date(statusDate) : new Date();
    setStatusDate("");
    try {
      await updateApplicationStatus(application.id, status);
      await createAutoTimeline(application.id, status, note || undefined, receivedAt);
      toast("Status updated");
    } catch {
      toast("Failed to update status.", "error");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleDelete() {
    if (!application) return;
    setDeletingApp(true);
    try {
      await deleteApplication(application.id);
      toast("Application deleted");
      onDeleted();
      onClose();
    } catch {
      toast("Failed to delete.", "error");
    } finally {
      setDeletingApp(false);
      setConfirmDelete(false);
    }
  }

  const channelDisplay =
    application.channel === "other" && application.channelOther
      ? application.channelOther
      : CHANNEL_LABELS[application.channel];
  const applyTypeDisplay =
    application.applyType === "other" && application.applyTypeOther
      ? application.applyTypeOther
      : APPLY_TYPE_LABELS[application.applyType];

  return (
    <>
      <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
        <SheetContent
          title={`${application.jobTitle} · ${application.companyName}`}
        >
          {/* Status bar */}
          <div className="px-5 py-4 border-b border-slate-100 dark:border-[#1e2d45]">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={application.status} />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Button>
                <Select
                  value={application.status}
                  onValueChange={(v) => openStatusConfirm(v as ApplicationStatus)}
                  disabled={updatingStatus}
                >
                  <SelectTrigger className="h-9 text-sm w-38 border-slate-200 dark:border-[#2a3357]">
                    <RefreshCw className="h-3 w-3 text-gray-600 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(STATUS_LABELS) as ApplicationStatus[]).map(
                      (s) => (
                        <SelectItem key={s} value={s}>
                          {STATUS_LABELS[s]}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="px-5 py-5 space-y-4 border-b border-slate-100 dark:border-[#1e2d45]">
            <DetailRow icon={<Building2 className="h-4 w-4" />} label="Company">
              {application.companyName}
            </DetailRow>
            <DetailRow
              icon={<Briefcase className="h-4 w-4" />}
              label="Job Title"
            >
              {application.jobTitle}
            </DetailRow>
            <DetailRow icon={<Hash className="h-4 w-4" />} label="Channel">
              {channelDisplay}
            </DetailRow>
            <DetailRow
              icon={<ExternalLink className="h-4 w-4" />}
              label="Apply Type"
            >
              {applyTypeDisplay}
            </DetailRow>
            <DetailRow icon={<Calendar className="h-4 w-4" />} label="Applied">
              {formatDateTime(application.appliedAt)}
            </DetailRow>
            {application.contactLink && (
              <DetailRow
                icon={<Link2 className="h-4 w-4" />}
                label="Application Link / Email"
              >
                <a
                  href={
                    application.contactLink.startsWith("http") ||
                    application.contactLink.startsWith("mailto")
                      ? application.contactLink
                      : `https://${application.contactLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate dark:text-blue-400"
                >
                  {application.contactLink}
                </a>
              </DetailRow>
            )}
            <DetailRow icon={<User2 className="h-4 w-4" />} label="Posted By">
              <span className="capitalize">
                {application.postedBy === "hr" ? "HR / Recruiter" : "Company"}
              </span>
            </DetailRow>
            {application.hrCompanyName && (
              <DetailRow
                icon={<User2 className="h-4 w-4" />}
                label="HR / Company Name"
              >
                {application.hrCompanyName}
              </DetailRow>
            )}
            {application.hrCompanyLink && (
              <DetailRow
                icon={<Link2 className="h-4 w-4" />}
                label="HR / Company Link"
              >
                <a
                  href={
                    application.hrCompanyLink.startsWith("http")
                      ? application.hrCompanyLink
                      : `https://${application.hrCompanyLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate dark:text-blue-400"
                >
                  {application.hrCompanyLink}
                </a>
              </DetailRow>
            )}
            {application.socialPostLink && (
              <DetailRow
                icon={<Link2 className="h-4 w-4" />}
                label="Social Post"
              >
                <a
                  href={
                    application.socialPostLink.startsWith("http")
                      ? application.socialPostLink
                      : `https://${application.socialPostLink}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline truncate dark:text-blue-400"
                >
                  {application.socialPostLink}
                </a>
              </DetailRow>
            )}
            {application.extraNotes && (
              <div>
                <p className="text-sm font-medium mb-1.5 flex items-center gap-1.5 text-gray-600 dark:text-slate-500">
                  <MessageSquare className="h-3.5 w-3.5" /> Notes
                </p>
                <p className="text-base leading-relaxed whitespace-pre-wrap rounded-lg p-3 border text-slate-700 bg-slate-50 border-slate-200 dark:text-gray-600 dark:bg-[#0d1120] dark:border-[#1e2d45]">
                  {application.extraNotes}
                </p>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="px-5 py-5 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <Clock className="h-4 w-4 text-gray-600" /> Timeline
                {timelines.length > 0 && (
                  <span className="text-sm font-normal text-gray-600">
                    ({timelines.length})
                  </span>
                )}
              </h3>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setAddingTimeline(true)}
              >
                <Plus className="h-3.5 w-3.5" /> Add Entry
              </Button>
            </div>

            {tlLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="h-16 rounded-lg animate-pulse bg-slate-100 dark:bg-[#111827]"
                  />
                ))}
              </div>
            ) : timelines.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-8 w-8 mx-auto mb-2 text-gray-600 dark:text-slate-700" />
                <p className="text-base text-gray-600">
                  No timeline entries yet.
                </p>
                <p className="text-sm mt-1 text-gray-600 dark:text-slate-600">
                  Add events as your application progresses.
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200 dark:bg-[#1e2d45]" />
                <div className="space-y-4">
                  {timelines.map((tl) => {
                    const colors = tl.statusUpdate
                      ? STATUS_COLORS[tl.statusUpdate]
                      : null;
                    return (
                      <div key={tl.id} className="relative flex gap-4">
                        <div
                          className={`relative z-10 h-[22px] w-[22px] shrink-0 rounded-full border-2 flex items-center justify-center ${tl.isAutoGenerated ? "border-slate-200 bg-slate-50 dark:border-[#2a3357] dark:bg-[#0d1120]" : "border-blue-300 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-900/20"}`}
                        >
                          {tl.isAutoGenerated ? (
                            <RefreshCw className="h-2.5 w-2.5 text-gray-600 dark:text-slate-500" />
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />
                          )}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-base font-medium leading-tight text-slate-800 dark:text-slate-200">
                                {tl.title}
                              </p>
                              {tl.statusUpdate && colors && (
                                <span
                                  className={`inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded border mt-1 ${colors.bg} ${colors.text} ${colors.border}`}
                                >
                                  <CheckCircle2 className="h-2.5 w-2.5" />{" "}
                                  Status → {STATUS_LABELS[tl.statusUpdate]}
                                </span>
                              )}
                              {tl.description && (
                                <p className="text-sm mt-1.5 leading-relaxed text-slate-500 dark:text-gray-600">
                                  {tl.description}
                                </p>
                              )}
                            </div>
                            <p className="text-[11px] shrink-0 pt-0.5 text-gray-600 dark:text-slate-500">
                              {formatRelative(tl.receivedAt)}
                            </p>
                          </div>
                          <p className="text-[11px] mt-1 text-gray-600 dark:text-slate-600">
                            {formatDateTime(tl.receivedAt)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-5 py-4 border-t mt-auto border-slate-100 dark:border-[#1e2d45]">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
                <span className="text-sm text-red-500 flex-1">
                  Delete this application and all its timeline entries?
                </span>
                <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={deletingApp}
                >
                  {deletingApp ? "Deleting…" : "Confirm"}
                </Button>
              </div>
            ) : (
              <Button
                variant="danger"
                onClick={() => setConfirmDelete(true)}
                className="w-full"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Application
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
      <Dialog open={!!pendingStatus} onOpenChange={(o) => { if (!o) { setPendingStatus(null); setStatusNote(""); setStatusDate(""); } }}>
        <DialogContent showClose={false}>
          <DialogHeader>
            <DialogTitle>Change Status</DialogTitle>
            <DialogDescription>
              Change status from <strong>{STATUS_LABELS[application.status]}</strong> to <strong>{pendingStatus ? STATUS_LABELS[pendingStatus] : ""}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="px-6 pb-2 space-y-4">
            <div>
              <Label htmlFor="status-date">Date & Time</Label>
              <Input
                id="status-date"
                type="datetime-local"
                value={statusDate}
                onChange={(e) => setStatusDate(e.target.value)}
                className="mt-1.5 [color-scheme:dark]"
              />
            </div>
            <div>
              <Label htmlFor="status-note">Note <span className="text-slate-400 dark:text-slate-600 font-normal">(optional)</span></Label>
              <Textarea
                id="status-note"
                rows={3}
                placeholder="Add a note about this status change..."
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="mt-1.5"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setPendingStatus(null); setStatusNote(""); setStatusDate(""); }}>Cancel</Button>
            <Button
              variant="primary"
              disabled={updatingStatus}
              onClick={() => pendingStatus && handleStatusChange(pendingStatus)}
            >
              {updatingStatus ? "Updating…" : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AddApplicationModal
        open={editing}
        onClose={() => setEditing(false)}
        userId={application.userId}
        editData={application}
      />
      <AddTimelineModal
        open={addingTimeline}
        onClose={() => setAddingTimeline(false)}
        applicationId={application.id}
        currentStatus={application.status}
      />
    </>
  );
}

function DetailRow({
  icon,
  label,
  children
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3">
      <div className="shrink-0 mt-0.5 text-gray-600 dark:text-slate-600">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-wider mb-0.5 text-gray-600 dark:text-slate-500">
          {label}
        </p>
        <div className="text-base break-all text-slate-700 dark:text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
