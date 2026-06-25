import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, FileText, XCircle } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { getAllLeaves, type LeaveRequest } from "@/lib/api";
import { StatCard } from "@/components/app/StatCard";
import { PageHeader } from "@/components/app/PageHeader";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";
export const Route = createFileRoute("/admin/")({
  component: AdminOverview,
});
function AdminOverview() {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllLeaves()
      .then(setLeaves)
      .catch(() => setLeaves([]))
      .finally(() => setLoading(false));
  }, []);
  const total = leaves.length;
  const pending = leaves.filter((l) => l.status === "PENDING").length;
  const approved = leaves.filter((l) => l.status === "APPROVED").length;
  const rejected = leaves.filter((l) => l.status === "REJECTED").length;
  const data = [
    { name: "Pending", count: pending, color: "#F59E0B" },
    { name: "Approved", count: approved, color: "#10B981" },
    { name: "Rejected", count: rejected, color: "#EF4444" },
  ];
  return (
    <div>
      <PageHeader title="Overview" subtitle="Activity across all leave requests." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total Requests" value={total} accent="#6366F1" index={0} />
        <StatCard icon={Clock} label="Pending" value={pending} accent="#F59E0B" index={1} />
        <StatCard icon={CheckCircle} label="Approved" value={approved} accent="#10B981" index={2} />
        <StatCard icon={XCircle} label="Rejected" value={rejected} accent="#EF4444" index={3} />
      </div>
      <div className="card-surface mt-8 p-6">
        <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">Requests by status</h2>
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
          Distribution of all leave requests.
        </p>
        <div className="mt-6 h-72">
          {loading ? (
            <div className="flex h-full items-center justify-center text-[var(--color-text-secondary)]">
              <LoadingSpinner size={18} />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E2E" vertical={false} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  cursor={{ fill: "rgba(99, 102, 241, 0.08)" }}
                  contentStyle={{
                    backgroundColor: "#111118",
                    border: "1px solid #1E1E2E",
                    borderRadius: 8,
                    color: "#F1F5F9",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}