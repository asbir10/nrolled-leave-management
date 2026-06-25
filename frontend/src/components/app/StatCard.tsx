import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  accent: string;
  index?: number;
}
export function StatCard({ icon: Icon, label, value, accent, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="card-surface p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-secondary)]">
            {label}
          </p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-[var(--color-text-primary)]">
            {value}
          </p>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-lg"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          <Icon size={20} />
        </div>
      </div>
    </motion.div>
  );
}