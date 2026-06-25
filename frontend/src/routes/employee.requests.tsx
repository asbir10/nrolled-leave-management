import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getMyLeaves, type LeaveRequest } from "@/lib/api";
import { PageHeader } from "@/components/app/PageHeader";
import { LeaveStatusBadge } from "@/components/app/LeaveStatusBadge";
import { EmptyState } from "@/components/app/EmptyState";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";
export const Route = createFileRoute("/employee/requests")({
  component: MyRequestsPage,
});
function formatDate(d?: string | null) {
  if (!d) return "—";
  const date = new Date(d);
  if (isNaN(date.getTime())) return d;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function MyRequestsPage() {
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
  return (
    <div>
      <PageHeader title="My Requests" subtitle="All the leaves you've requested." />
      <div className="card-surface overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-[var(--color-text-secondary)]">
            <LoadingSpinner size={18} />
          </div>
        ) : leaves.length === 0 ? (
          <EmptyState icon={Inbox} title="No leave requests yet" description="Apply for leave to see it here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1E1E2E]">
                  {["Reason", "From", "To", "Days", "Applied On", "Status"].map((h) => (
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
                {leaves.map((l) => (
                  <tr key={l.id} className="border-b border-[#1E1E2E] last:border-0 hover:bg-[#16161f]">
                    <td className="px-5 py-3.5 text-[var(--color-text-primary)]">{l.reason}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{formatDate(l.start_date)}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{formatDate(l.end_date)}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">{l.days}</td>
                    <td className="px-5 py-3.5 text-[var(--color-text-secondary)]">
                      {formatDate(l.applied_on ?? l.created_at)}
                    </td>
                    <td className="px-5 py-3.5">
                      <LeaveStatusBadge status={l.status} />
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