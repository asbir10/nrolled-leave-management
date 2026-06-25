import type { ReactNode } from "react";
export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--color-text-primary)]">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{subtitle}</p>
        )}
      </div>
      {actions}
    </div>
  );
}