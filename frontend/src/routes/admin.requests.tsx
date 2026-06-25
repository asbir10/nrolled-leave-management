import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Inbox } from "lucide-react";
import { toast } from "sonner";
import {
  actionLeave,
  getAllLeaves,
  getAllUsers,
  type LeaveRequest,
  type LeaveStatus,
  type User,
} from "@/lib/api";
import { PageHeader } from "@/components/app/PageHeader";
import { LeaveStatusBadge } from "@/components/app/LeaveStatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";

export const Route = createFileRoute("/admin/requests")({
  component: AdminRequestsPage,
});

type Filter = "ALL" | LeaveStatus;
const FILTERS: Filter[] = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function formatDate(d?: string | null) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function AdminRequestsPage() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("ALL");
  const [actingId, setActingId] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([getAllLeaves(), getAllUsers().catch(() => [] as User[])])
      .then(([l, u]) => {
        setLeaves(l);
        setUsers(u);
      })
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const userMap = useMemo(() => {
    const m = new Map<number, string>();
    users.forEach((u) => m.set(u.id, u.name));
    return m;
  }, [users]);

  const filtered = filter === "ALL" ? leaves : leaves.filter((l) => l.status === filter);

  const handleAction = async (leave: LeaveRequest, action: "APPROVED" | "REJECTED") => {
    const verb = action === "APPROVED" ? "approve" : "reject";
    if (!window.confirm(`Are you sure you want to ${verb} this request?`)) return;
    setActingId(leave.id);
    try {
      await actionLeave(leave.id, action);
      toast.success(`Request ${action.toLowerCase()}`);
      load();
    } catch {
      toast.error("Failed to update request");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div>
      <PageHeader title="All Requests" subtitle="Review and action team leave requests." />

      <div className="mb-4 flex gap-1 rounded-lg border border-[#1E1E2E] bg-[#111118] p-1">
        {FILTERS.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
              style={{
                backgroundColor: active ? "rgba(99, 102, 241, 0.12)" : "transparent",
                color: active ? "#6366F1" : "#94A3B8",
              }}
            >
              {f === "ALL" ? "All" : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          );
        })}
      </div>

      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[var(--color-text-secondary)]">
            <LoadingSpinner size={18} />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Inbox} title="No requests" description="Nothing matches the current filter." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E2E]">
                  {["Employee", "Reason", "From", "To", "Days", "Applied On", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-b border-[#1E1E2E] last:border-0 hover:bg-[#16161f]">
                    <td className="px-5 py-3.5 font-medium text-[var(--color-text-primary)]">
                      {l.user_name ?? userMap.get(l.user_id) ?? `User #${l.user_id}`}
                    </td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{l.reason}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{formatDate(l.start_date)}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{formatDate(l.end_date)}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{l.days}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">
                      {formatDate(l.applied_on ?? l.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <LeaveStatusBadge status={l.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      {l.status === "PENDING" ? (
                        <div className="flex gap-2">
                          <ActionButton
                            color="#10B981"
                            loading={actingId === l.id}
                            onClick={() => handleAction(l, "APPROVED")}
                          >
                            Approve
                          </ActionButton>
                          <ActionButton
                            color="#EF4444"
                            loading={actingId === l.id}
                            onClick={() => handleAction(l, "REJECTED")}
                          >
                            Reject
                          </ActionButton>
                        </div>
                      ) : (
                        <span className="text-xs text-[var(--color-text-secondary)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionButton({
  color,
  loading,
  onClick,
  children,
}: {
  color: string;
  loading: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      style={{ backgroundColor: color }}
    >
      {loading && <LoadingSpinner size={12} />}
      {children}
    </button>
  );
}
