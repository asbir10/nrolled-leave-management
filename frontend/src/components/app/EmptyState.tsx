import type { LucideIcon } from "lucide-react";
export function EmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-4 flex h-14 w-14 items-center justify-center rounded-full"
        style={{ backgroundColor: "#16161f", border: "1px solid #1E1E2E" }}
      >
        <Icon size={24} className="text-[var(--color-text-secondary)]" />
      </div>
      <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-[var(--color-text-secondary)]">{description}</p>
      )}
    </div>
  );
}