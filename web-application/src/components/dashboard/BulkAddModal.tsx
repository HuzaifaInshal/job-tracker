"use client";

import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { createApplication } from "@/lib/firestore";
import { useToast } from "@/components/ui/toast";
import { normalizeUnicode } from "@/components/ui/input";
import type { ApplicationChannel, ApplyType, PostedBy } from "@/lib/types";
import { Loader2, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";

interface EntryForm {
  companyName: string;
  jobTitle: string;
  channel: ApplicationChannel | "";
  channelOther: string;
  applyType: ApplyType | "";
  applyTypeOther: string;
  appliedAt: string;
  contactLink: string;
  postedBy: PostedBy | "";
  hrCompanyName: string;
  hrCompanyLink: string;
  socialPostLink: string;
  extraNotes: string;
}

function emptyEntry(): EntryForm {
  return {
    companyName: "",
    jobTitle: "",
    channel: "",
    channelOther: "",
    applyType: "",
    applyTypeOther: "",
    appliedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    contactLink: "",
    postedBy: "",
    hrCompanyName: "",
    hrCompanyLink: "",
    socialPostLink: "",
    extraNotes: ""
  };
}

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  mode?: "full" | "quick";
}

export function BulkAddModal({ open, onClose, userId, mode = "full" }: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [entries, setEntries] = useState<EntryForm[]>([emptyEntry()]);
  const [expanded, setExpanded] = useState<number[]>([0]);

  // Shared fields for quick mode
  const [sharedChannel, setSharedChannel] = useState<ApplicationChannel | "">("");
  const [sharedChannelOther, setSharedChannelOther] = useState("");
  const [sharedApplyType, setSharedApplyType] = useState<ApplyType | "">("");
  const [sharedApplyTypeOther, setSharedApplyTypeOther] = useState("");
  const [sharedAppliedAt, setSharedAppliedAt] = useState(
    format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [sharedPostedBy, setSharedPostedBy] = useState<PostedBy | "">("");
  const [sharedContactLink, setSharedContactLink] = useState("");
  const [sharedExtraNotes, setSharedExtraNotes] = useState("");

  function handleClose() {
    setEntries([emptyEntry()]);
    setExpanded([0]);
    setSharedChannel("");
    setSharedChannelOther("");
    setSharedApplyType("");
    setSharedApplyTypeOther("");
    setSharedAppliedAt(format(new Date(), "yyyy-MM-dd'T'HH:mm"));
    setSharedPostedBy("");
    setSharedContactLink("");
    setSharedExtraNotes("");
    onClose();
  }

  function setField(idx: number, field: keyof EntryForm, value: string) {
    setEntries((prev) =>
      prev.map((e, i) => {
        if (i !== idx) return e;
        const next = { ...e, [field]: normalizeUnicode(value) };
        if (field === "postedBy" && value === "company" && !next.hrCompanyName)
          next.hrCompanyName = next.companyName;
        if (field === "companyName" && next.postedBy === "company")
          next.hrCompanyName = value;
        return next;
      })
    );
  }

  function addEntry() {
    const idx = entries.length;
    setEntries((prev) => [...prev, emptyEntry()]);
    setExpanded((prev) => [...prev, idx]);
  }

  function removeEntry(idx: number) {
    setEntries((prev) => prev.filter((_, i) => i !== idx));
    setExpanded((prev) =>
      prev.filter((i) => i !== idx).map((i) => (i > idx ? i - 1 : i))
    );
  }

  function toggleExpand(idx: number) {
    setExpanded((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (mode === "quick") {
      if (!sharedChannel || !sharedApplyType) {
        toast("Fill in channel and apply type.", "error");
        return;
      }
      for (let i = 0; i < entries.length; i++) {
        const f = entries[i];
        if (!f.companyName || !f.jobTitle) {
          toast(`Entry ${i + 1}: company name and job title are required.`, "error");
          return;
        }
      }
      setSaving(true);
      try {
        await Promise.all(
          entries.map((f) =>
            createApplication(userId, {
              companyName: f.companyName.trim(),
              jobTitle: f.jobTitle.trim(),
              channel: sharedChannel as ApplicationChannel,
              channelOther: sharedChannel === "other" ? sharedChannelOther.trim() : null,
              applyType: sharedApplyType as ApplyType,
              applyTypeOther: sharedApplyType === "other" ? sharedApplyTypeOther.trim() : null,
              appliedAt: new Date(sharedAppliedAt),
              contactLink: sharedContactLink.trim() || null,
              postedBy: (sharedPostedBy || "company") as PostedBy,
              hrCompanyName: sharedPostedBy === "company" ? f.companyName.trim() : null,
              hrCompanyLink: null,
              socialPostLink: null,
              extraNotes: sharedExtraNotes.trim() || null,
              status: "pending"
            })
          )
        );
        toast(`${entries.length} application${entries.length > 1 ? "s" : ""} added!`);
        handleClose();
      } catch {
        toast("Failed to save some applications.", "error");
      } finally {
        setSaving(false);
      }
      return;
    }
    for (let i = 0; i < entries.length; i++) {
      const f = entries[i];
      if (!f.companyName || !f.jobTitle || !f.channel || !f.applyType) {
        toast(`Entry ${i + 1}: fill in all required fields.`, "error");
        setExpanded((prev) => (prev.includes(i) ? prev : [...prev, i]));
        return;
      }
    }
    setSaving(true);
    try {
      await Promise.all(
        entries.map((f) =>
          createApplication(userId, {
            companyName: f.companyName.trim(),
            jobTitle: f.jobTitle.trim(),
            channel: f.channel as ApplicationChannel,
            channelOther: f.channel === "other" ? f.channelOther.trim() : null,
            applyType: f.applyType as ApplyType,
            applyTypeOther:
              f.applyType === "other" ? f.applyTypeOther.trim() : null,
            appliedAt: new Date(f.appliedAt),
            contactLink: f.contactLink.trim() || null,
            postedBy: f.postedBy as PostedBy,
            hrCompanyName: f.hrCompanyName.trim() || null,
            hrCompanyLink: f.hrCompanyLink.trim() || null,
            socialPostLink: f.socialPostLink.trim() || null,
            extraNotes: f.extraNotes.trim() || null,
            status: "pending"
          })
        )
      );
      toast(
        `${entries.length} application${entries.length > 1 ? "s" : ""} added!`
      );
      handleClose();
    } catch {
      toast("Failed to save some applications.", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{mode === "quick" ? "Quick Bulk Add" : "Bulk Add Applications"}</DialogTitle>
            <DialogDescription>
              {mode === "quick"
                ? "Add company & job title per entry — shared fields apply to all"
                : "Add multiple job applications at once"}
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-3">
            {mode === "quick" ? (
              <>
                {/* Shared fields */}
                <div className="border border-slate-200 dark:border-[#1e2d45] rounded-xl p-4 space-y-4 bg-slate-50 dark:bg-[#0b0e1a]">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Shared Fields (applied to all entries)</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Channel *</Label>
                      <Select value={sharedChannel} onValueChange={(v) => setSharedChannel(v as ApplicationChannel)}>
                        <SelectTrigger><SelectValue placeholder="Where you found it" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="indeed">Indeed</SelectItem>
                          <SelectItem value="linkedin">LinkedIn</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {sharedChannel === "other" && (
                        <Input className="mt-2" placeholder="Specify channel" value={sharedChannelOther} onChange={(e) => setSharedChannelOther(e.target.value)} />
                      )}
                    </div>
                    <div>
                      <Label>Apply Type *</Label>
                      <Select value={sharedApplyType} onValueChange={(v) => setSharedApplyType(v as ApplyType)}>
                        <SelectTrigger><SelectValue placeholder="How you applied" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">Direct Apply</SelectItem>
                          <SelectItem value="external">External Website</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {sharedApplyType === "other" && (
                        <Input className="mt-2" placeholder="Specify apply type" value={sharedApplyTypeOther} onChange={(e) => setSharedApplyTypeOther(e.target.value)} />
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date & Time Applied</Label>
                      <Input type="datetime-local" value={sharedAppliedAt} onChange={(e) => setSharedAppliedAt(e.target.value)} className="[color-scheme:dark]" />
                    </div>
                    <div>
                      <Label>Posted By</Label>
                      <Select value={sharedPostedBy} onValueChange={(v) => setSharedPostedBy(v as PostedBy)}>
                        <SelectTrigger><SelectValue placeholder="Who posted" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hr">HR / Recruiter</SelectItem>
                          <SelectItem value="company">Company</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Contact Link</Label>
                      <Input placeholder="https://... or email" value={sharedContactLink} onChange={(e) => setSharedContactLink(e.target.value)} />
                    </div>
                    <div>
                      <Label>Extra Notes</Label>
                      <Input placeholder="Any notes..." value={sharedExtraNotes} onChange={(e) => setSharedExtraNotes(e.target.value)} />
                    </div>
                  </div>
                </div>

                {/* Per-entry rows */}
                <div className="space-y-2">
                  {entries.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <span className="text-sm font-semibold text-slate-400 w-6 shrink-0">#{idx + 1}</span>
                      <Input
                        placeholder="Company Name *"
                        value={f.companyName}
                        onChange={(e) => setField(idx, "companyName", e.target.value)}
                        className="flex-1"
                      />
                      <Input
                        placeholder="Job Title *"
                        value={f.jobTitle}
                        onChange={(e) => setField(idx, "jobTitle", e.target.value)}
                        className="flex-1"
                      />
                      {entries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeEntry(idx)}
                          className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-colors shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              entries.map((f, idx) => {
              const isOpen = expanded.includes(idx);
              const contactLabel =
                f.applyType === "email"
                  ? "Email Address"
                  : f.applyType === "external"
                    ? "Application URL"
                    : "Application Link / Email";
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-[#1e2d45] rounded-xl overflow-hidden"
                >
                  {/* Entry header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer bg-slate-50 dark:bg-[#0b0e1a] hover:bg-slate-100 dark:hover:bg-[#111827] transition-colors"
                    onClick={() => toggleExpand(idx)}
                  >
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 w-6 shrink-0">
                      #{idx + 1}
                    </span>
                    <span className="flex-1 text-sm text-slate-700 dark:text-slate-300 truncate">
                      {f.companyName || f.jobTitle
                        ? `${f.companyName || "—"} · ${f.jobTitle || "—"}`
                        : "New entry"}
                    </span>
                    {entries.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeEntry(idx);
                        }}
                        className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-400 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                  </div>

                  {/* Entry fields */}
                  {isOpen && (
                    <div className="px-4 py-4 space-y-4 border-t border-slate-200 dark:border-[#1e2d45]">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Company Name *</Label>
                          <Input
                            placeholder="Acme Corp"
                            value={f.companyName}
                            onChange={(e) =>
                              setField(idx, "companyName", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>Job Title *</Label>
                          <Input
                            placeholder="Software Engineer"
                            value={f.jobTitle}
                            onChange={(e) =>
                              setField(idx, "jobTitle", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Channel *</Label>
                          <Select
                            value={f.channel}
                            onValueChange={(v) => setField(idx, "channel", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Where you found it" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indeed">Indeed</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {f.channel === "other" && (
                            <Input
                              className="mt-2"
                              placeholder="Specify channel"
                              value={f.channelOther}
                              onChange={(e) =>
                                setField(idx, "channelOther", e.target.value)
                              }
                            />
                          )}
                        </div>
                        <div>
                          <Label>Apply Type *</Label>
                          <Select
                            value={f.applyType}
                            onValueChange={(v) => setField(idx, "applyType", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="How you applied" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="direct">
                                Direct Apply
                              </SelectItem>
                              <SelectItem value="external">
                                External Website
                              </SelectItem>
                              <SelectItem value="email">Email</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {f.applyType === "other" && (
                            <Input
                              className="mt-2"
                              placeholder="Specify apply type"
                              value={f.applyTypeOther}
                              onChange={(e) =>
                                setField(idx, "applyTypeOther", e.target.value)
                              }
                            />
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Date & Time Applied *</Label>
                          <Input
                            type="datetime-local"
                            value={f.appliedAt}
                            onChange={(e) =>
                              setField(idx, "appliedAt", e.target.value)
                            }
                            className="[color-scheme:dark]"
                          />
                        </div>
                        <div>
                          <Label>{contactLabel}</Label>
                          <Input
                            placeholder={
                              f.applyType === "email"
                                ? "hr@company.com"
                                : "https://..."
                            }
                            value={f.contactLink}
                            onChange={(e) =>
                              setField(idx, "contactLink", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Posted By</Label>
                          <Select
                            value={f.postedBy}
                            onValueChange={(v) => setField(idx, "postedBy", v)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Who posted" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hr">HR / Recruiter</SelectItem>
                              <SelectItem value="company">Company</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>HR / Company Name</Label>
                          <Input
                            placeholder="Auto-filled for company posts"
                            value={f.hrCompanyName}
                            onChange={(e) =>
                              setField(idx, "hrCompanyName", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>HR / Company Profile Link</Label>
                          <Input
                            placeholder="https://linkedin.com/in/..."
                            value={f.hrCompanyLink}
                            onChange={(e) =>
                              setField(idx, "hrCompanyLink", e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <Label>Social Post Link</Label>
                          <Input
                            placeholder="https://linkedin.com/posts/..."
                            value={f.socialPostLink}
                            onChange={(e) =>
                              setField(idx, "socialPostLink", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Extra Notes</Label>
                        <Textarea
                          rows={2}
                          placeholder="Any additional notes..."
                          value={f.extraNotes}
                          onChange={(e) =>
                            setField(idx, "extraNotes", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            }))}

            <Button
              type="button"
              variant="secondary"
              onClick={addEntry}
              className="w-full"
            >
              <Plus className="h-4 w-4" /> Add Another Entry
            </Button>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving
                ? "Saving…"
                : `Add ${entries.length} Application${entries.length > 1 ? "s" : ""}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
