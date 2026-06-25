import type { LeaveStatus } from "@/lib/api";
const styles: Record<LeaveStatus, { bg: string; color: string; dot: string }> = {
  PENDING: { bg: "rgba(245, 158, 11, 0.12)", color: "#F59E0B", dot: "#F59E0B" },
  APPROVED: { bg: "rgba(16, 185, 129, 0.12)", color: "#10B981", dot: "#10B981" },
  REJECTED: { bg: "rgba(239, 68, 68, 0.12)", color: "#EF4444", dot: "#EF4444" },
};
export function LeaveStatusBadge({ status }: { status: LeaveStatus }) {
  const s = styles[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: s.dot }} />
      {status}
    </span>
  );
}