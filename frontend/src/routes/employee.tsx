import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FilePlus, ListChecks } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout, type NavItem } from "@/components/app/AppLayout";
export const Route = createFileRoute("/employee")({
  component: EmployeeShell,
});
const navItems: NavItem[] = [
  { label: "Dashboard", to: "/employee", icon: LayoutDashboard },
  { label: "Apply Leave", to: "/employee/apply", icon: FilePlus },
  { label: "My Requests", to: "/employee/requests", icon: ListChecks },
];
function EmployeeShell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (user.role === "admin") navigate({ to: "/admin" });
  }, [user, loading, navigate]);
  return <AppLayout navItems={navItems} />;
}