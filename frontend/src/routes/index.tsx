import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/app/Logo";
import { LoadingSpinner } from "@/components/app/LoadingSpinner";

export const Route = createFileRoute("/")({
  component: LoginPage,
});

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      navigate({ to: user.role === "admin" ? "/admin" : "/employee" });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const u = await login(email, password);
      navigate({ to: u.role === "admin" ? "/admin" : "/employee" });
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="card-surface w-full max-w-[420px] p-8"
      >
        <div className="mb-8 flex justify-center">
          <Logo size="lg" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          Welcome back
        </h1>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          Sign in to your workspace
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
              Email
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@company.com"
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] py-2.5 pl-9 pr-3 text-sm text-[var(--color-text-primary)] placeholder:text-[#475569] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[var(--color-text-secondary)]">
              Password
            </label>
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]"
              />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] py-2.5 pl-9 pr-10 text-sm text-[var(--color-text-primary)] placeholder:text-[#475569] focus:border-[#6366F1] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/10 px-3 py-2 text-xs font-medium text-[#EF4444]"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-[#6366F1]/20 disabled:opacity-60"
            style={{ backgroundColor: submitting ? "#4F46E5" : "#6366F1" }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = "#4F46E5";
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.backgroundColor = "#6366F1";
            }}
          >
            {submitting && <LoadingSpinner size={14} />}
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}