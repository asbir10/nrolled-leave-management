import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock, Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMyLeaves, type LeaveRequest } from "@/lib/api";
import { StatCard } from "@/components/app/StatCard";
import { PageHeader } from "@/components/app/PageHeader";
import { LeaveStatusBadge } from "@/components/app/LeaveStatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";

export const Route = createFileRoute("/employee/")({
  component: EmployeeDashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function formatDate(d: string) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function EmployeeDashboard() {
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getMyLeaves(user.id)
      .then(setLeaves)
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
  }, [user]);

  const pending = leaves.filter((l) => l.status === "PENDING").length;
  const approvedThisYear = leaves.filter(
    (l) => l.status === "APPROVED" && new Date(l.start_date).getFullYear() === new Date().getFullYear(),
  ).length;

  const recent = [...leaves]
    .sort(
      (a, b) =>
        new Date(b.applied_on ?? b.created_at ?? b.start_date).getTime() -
        new Date(a.applied_on ?? a.created_at ?? a.start_date).getTime(),
    )
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(" ")[0] ?? ""} 👋`}
        subtitle="Here's a snapshot of your time off."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          icon={Calendar}
          label="Leave Balance"
          value={user?.leave_balance ?? 0}
          accent="#6366F1"
          index={0}
        />
        <StatCard
          icon={Clock}
          label="Pending Requests"
          value={pending}
          accent="#F59E0B"
          index={1}
        />
        <StatCard
          icon={CheckCircle}
          label="Approved This Year"
          value={approvedThisYear}
          accent="#10B981"
          index={2}
        />
      </div>

      <div className="card-surface mt-8 overflow-hidden">
        <div className="border-b border-[#1E1E2E] px-5 py-4">
          <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Recent Requests</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-12 text-[var(--color-text-secondary)]">
            <LoadingSpinner size={18} />
          </div>
        ) : recent.length === 0 ? (
          <EmptyState icon={Inbox} title="No leave requests yet" description="Your applied leaves will show up here." />
        ) : (
          <DataTable
            head={["Reason", "From", "To", "Days", "Status"]}
            rows={recent.map((l) => [
              <span className="text-[var(--color-text-primary)]">{l.reason}</span>,
              formatDate(l.start_date),
              formatDate(l.end_date),
              l.days,
              <LeaveStatusBadge status={l.status} />,
            ])}
          />
        )}
      </div>
    </div>
  );
}

function DataTable({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#1E1E2E]">
            {head.map((h) => (
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
          {rows.map((r, i) => (
            <tr
              key={i}
              className="border-b border-[#1E1E2E] last:border-0 transition-colors hover:bg-[#16161f]"
            >
              {r.map((cell, j) => (
                <td key={j} className="px-5 py-3.5 text-[var(--color-text-secondary)]">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
