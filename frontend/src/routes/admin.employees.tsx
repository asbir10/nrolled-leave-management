import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { getAllUsers, type User } from "@/lib/api";
import { PageHeader } from "@/components/app/PageHeader";
import { EmptyState } from "@/components/app/EmptyState";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";
import { avatarColor, initials } from "@/components/app/avatar-color";
export const Route = createFileRoute("/admin/employees")({
  component: AdminEmployeesPage,
});
function AdminEmployeesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getAllUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <div>
      <PageHeader title="Employees" subtitle="Everyone on your team." />
      {loading ? (
        <div className="card-surface flex items-center justify-center py-16 text-[var(--color-text-secondary)]">
          <LoadingSpinner size={18} />
        </div>
      ) : users.length === 0 ? (
        <div className="card-surface">
          <EmptyState icon={Users} title="No employees" description="Once members are added they'll appear here." />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {users.map((u, i) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
              className="card-surface flex items-start gap-4 p-5"
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                style={{ backgroundColor: avatarColor(u.name) }}
              >
                {initials(u.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
                  {u.name}
                </p>
                <p className="truncate text-xs text-[var(--color-text-secondary)]">{u.email}</p>
                <span
                  className="mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{ backgroundColor: "rgba(99, 102, 241, 0.12)", color: "#6366F1" }}
                >
                  {u.leave_balance} days left
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}