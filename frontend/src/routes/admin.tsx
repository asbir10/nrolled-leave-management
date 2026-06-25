import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { LayoutDashboard, FileText, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AppLayout, type NavItem } from "@/components/app/AppLayout";
export const Route = createFileRoute("/admin")({
  component: AdminShell,
});
const navItems: NavItem[] = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard },
  { label: "All Requests", to: "/admin/requests", icon: FileText },
  { label: "Employees", to: "/admin/employees", icon: Users },
];
function AdminShell() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/" });
    else if (user.role !== "admin") navigate({ to: "/employee" });
  }, [user, loading, navigate]);
  return <AppLayout navItems={navItems} />;
}