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
import type {
  Application,
  ApplicationChannel,
  ApplyType,
  PostedBy
} from "@/lib/types";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
  editData?: Application;
}

const emptyForm = () => ({
  companyName: "",
  jobTitle: "",
  channel: "" as ApplicationChannel | "",
  channelOther: "",
  applyType: "" as ApplyType | "",
  applyTypeOther: "",
  appliedAt: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  contactLink: "",
  postedBy: "" as PostedBy | "",
  hrCompanyName: "",
  hrCompanyLink: "",
  socialPostLink: "",
  extraNotes: "",
  status: "pending" as Application["status"]
});

export function AddApplicationModal({
  open,
  onClose,
  userId,
  editData
}: Props) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function set(field: string, value: string) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "postedBy" && value === "company" && !next.hrCompanyName) {
        next.hrCompanyName = next.companyName;
      }
      if (field === "companyName" && next.postedBy === "company") {
        next.hrCompanyName = value;
      }
      return next;
    });
  }

  function handleClose() {
    setForm(emptyForm());
    onClose();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !form.companyName ||
      !form.jobTitle ||
      !form.channel ||
      !form.applyType ||
      !form.postedBy
    ) {
      toast("Please fill in all required fields.", "error");
      return;
    }
    setSaving(true);
    try {
      await createApplication(userId, {
        companyName: form.companyName.trim(),
        jobTitle: form.jobTitle.trim(),
        channel: form.channel as ApplicationChannel,
        channelOther:
          form.channel === "other" ? form.channelOther.trim() : undefined,
        applyType: form.applyType as ApplyType,
        applyTypeOther:
          form.applyType === "other" ? form.applyTypeOther.trim() : undefined,
        appliedAt: new Date(form.appliedAt),
        contactLink: form.contactLink.trim() || undefined,
        postedBy: form.postedBy as PostedBy,
        hrCompanyName: form.hrCompanyName.trim() || undefined,
        hrCompanyLink: form.hrCompanyLink.trim() || undefined,
        socialPostLink: form.socialPostLink.trim() || undefined,
        extraNotes: form.extraNotes.trim() || undefined,
        status: "pending"
      });
      toast("Application added successfully!");
      handleClose();
    } catch {
      toast("Failed to save application.", "error");
    } finally {
      setSaving(false);
    }
  }

  const contactLabel =
    form.applyType === "email"
      ? "Email Address"
      : form.applyType === "external"
        ? "Application URL"
        : "Application Link / Email";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Application</DialogTitle>
            <DialogDescription>Track a new job application</DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  placeholder="Acme Corp"
                  value={form.companyName}
                  onChange={(e) => set("companyName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Software Engineer"
                  value={form.jobTitle}
                  onChange={(e) => set("jobTitle", e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Row 2: Channel + Apply Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Channel *</Label>
                <Select
                  value={form.channel}
                  onValueChange={(v) => set("channel", v)}
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
                {form.channel === "other" && (
                  <Input
                    className="mt-2"
                    placeholder="Specify channel"
                    value={form.channelOther}
                    onChange={(e) => set("channelOther", e.target.value)}
                  />
                )}
              </div>
              <div>
                <Label>Apply Type *</Label>
                <Select
                  value={form.applyType}
                  onValueChange={(v) => set("applyType", v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="How you applied" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Apply</SelectItem>
                    <SelectItem value="external">External Website</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {form.applyType === "other" && (
                  <Input
                    className="mt-2"
                    placeholder="Specify apply type"
                    value={form.applyTypeOther}
                    onChange={(e) => set("applyTypeOther", e.target.value)}
                  />
                )}
              </div>
            </div>

            {/* Row 3: Date + Contact Link */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="appliedAt">Date & Time Applied *</Label>
                <Input
                  id="appliedAt"
                  type="datetime-local"
                  value={form.appliedAt}
                  onChange={(e) => set("appliedAt", e.target.value)}
                  className="[color-scheme:dark]"
                  required
                />
              </div>
              <div>
                <Label htmlFor="contactLink">{contactLabel}</Label>
                <Input
                  id="contactLink"
                  placeholder={
                    form.applyType === "email"
                      ? "hr@company.com"
                      : "https://..."
                  }
                  value={form.contactLink}
                  onChange={(e) => set("contactLink", e.target.value)}
                />
              </div>
            </div>

            {/* Row 4: Posted By */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Posted By *</Label>
                <Select
                  value={form.postedBy}
                  onValueChange={(v) => set("postedBy", v)}
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
                <Label htmlFor="hrCompanyName">HR / Company Name</Label>
                <Input
                  id="hrCompanyName"
                  placeholder="Auto-filled for company posts"
                  value={form.hrCompanyName}
                  onChange={(e) => set("hrCompanyName", e.target.value)}
                />
              </div>
            </div>

            {/* Row 5: Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hrLink">HR / Company Profile Link</Label>
                <Input
                  id="hrLink"
                  placeholder="https://linkedin.com/in/..."
                  value={form.hrCompanyLink}
                  onChange={(e) => set("hrCompanyLink", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="socialLink">Social Post Link</Label>
                <Input
                  id="socialLink"
                  placeholder="https://linkedin.com/posts/..."
                  value={form.socialPostLink}
                  onChange={(e) => set("socialPostLink", e.target.value)}
                />
              </div>
            </div>

            {/* Extra Notes */}
            <div>
              <Label htmlFor="notes">Extra Notes</Label>
              <Textarea
                id="notes"
                rows={3}
                placeholder="Any additional notes about this application..."
                value={form.extraNotes}
                onChange={(e) => set("extraNotes", e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Saving…" : "Add Application"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
