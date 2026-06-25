import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { applyLeave } from "@/lib/api";
import { PageHeader } from "@/components/app/PageHeader";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";

export const Route = createFileRoute("/employee/apply")({
  component: ApplyLeavePage,
});

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function ApplyLeavePage() {
  const { user } = useAuth();
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const days = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const s = new Date(startDate).getTime();
    const e = new Date(endDate).getTime();
    if (isNaN(s) || isNaN(e) || e < s) return 0;
    return Math.floor((e - s) / 86400000) + 1;
  }, [startDate, endDate]);

  const balance = user?.leave_balance ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) return;
    if (days <= 0) {
      setError("Please pick a valid date range.");
      return;
    }
    if (days > balance) {
      setError(`Requested days exceed your balance of ${balance}.`);
      return;
    }
    setSubmitting(true);
    try {
      await applyLeave({
        user_id: user.id,
        reason,
        start_date: startDate,
        end_date: endDate,
        days,
      });
      toast.success("Leave request submitted");
      setReason("");
      setStartDate("");
      setEndDate("");
    } catch {
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader title="Apply for Leave" subtitle="Submit a new time-off request." />

      <div className="mx-auto max-w-[560px]">
        <form onSubmit={handleSubmit} className="card-surface space-y-5 p-6">
          <Field label="Reason">
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Briefly describe the reason..."
              className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-3 py-2.5 text-sm text-[var(--color-text-primary)] placeholder:text-[#475569] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Start Date">
              <input
                type="date"
                required
                min={todayISO()}
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  if (endDate && new Date(endDate) < new Date(e.target.value)) {
                    setEndDate("");
                  }
                }}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
              />
            </Field>
            <Field label="End Date">
              <input
                type="date"
                required
                min={startDate || todayISO()}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
              />
            </Field>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
                Number of Days
              </p>
              <p className="mt-0.5 text-lg font-semibold text-[var(--color-text-primary)]">{days}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-[var(--color-text-secondary)]">Available balance</p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)]">{balance} days</p>
            </div>
          </div>

          {error && (
            <p className="rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/10 px-3 py-2 text-xs font-medium text-[#EF4444]">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#6366F1]/20 disabled:opacity-60"
            style={{ backgroundColor: "#6366F1" }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = "#6366F1";
            }}
          >
            {submitting && <LoadingSpinner size={14} />}
            {submitting ? "Submitting..." : "Submit Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
        {label}
      </label>
      {children}
    </div>
  );
}
