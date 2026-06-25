import { Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { LogOut, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "./Logo";
import { avatarColor, initials } from "./avatar-color";
export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}
export function AppLayout({ navItems }: { navItems: NavItem[] }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (!user) return <Outlet />;
  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };
  return (
    <div className="flex min-h-screen">
      <aside
        className="fixed inset-y-0 left-0 z-20 flex w-60 flex-col"
        style={{ backgroundColor: "#111118", borderRight: "1px solid #1E1E2E" }}
      >
        <div className="px-5 py-5">
          <Logo />
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active =
              item.to === pathname ||
              (item.to !== "/employee" && item.to !== "/admin" && pathname.startsWith(item.to));
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
                style={{
                  color: active ? "#6366F1" : "#94A3B8",
                  backgroundColor: active ? "rgba(99, 102, 241, 0.1)" : "transparent",
                }}
                onMouseEnter={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  if (!active) e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                {active && (
                  <span
                    className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r"
                    style={{ backgroundColor: "#6366F1" }}
                  />
                )}
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[#1E1E2E] p-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: avatarColor(user.name) }}
            >
              {initials(user.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                {user.name}
              </p>
              <p className="truncate text-xs text-[var(--color-text-secondary)]">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[#1E1E2E] px-3 py-2 text-xs font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[#16161f] hover:text-[var(--color-text-primary)]"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </div>
      </aside>
      <main className="ml-60 flex-1 px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}